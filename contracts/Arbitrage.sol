// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.26;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import { IVaultMain } from "@balancer-labs/v3-interfaces/contracts/vault/IVaultMain.sol";

import { UniversalRouter } from "@uniswap/universal-router/contracts/UniversalRouter.sol";
import { Commands } from "@uniswap/universal-router/contracts/libraries/Commands.sol";
import { IPoolManager } from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import { IV4Router } from "@uniswap/v4-periphery/src/interfaces/IV4Router.sol";
import { Actions } from "@uniswap/v4-periphery/src/libraries/Actions.sol";
import { IPermit2 } from "@uniswap/permit2/src/interfaces/IPermit2.sol";
import { StateLibrary } from "@uniswap/v4-core/src/libraries/StateLibrary.sol";
import { PoolKey } from "@uniswap/v4-core/src/types/PoolKey.sol";
import { Commands } from "@uniswap/universal-router/contracts/libraries/Commands.sol";

import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';

contract Arbitrage {
    using StateLibrary for IPoolManager;

    IPoolManager public immutable poolManager;
    IPermit2 public immutable permit2;
    IVaultMain public immutable balancerVault;

    UniversalRouter public immutable uRouter;
    ISwapRouter public immutable pRouter;
    address public owner;

    uint24 public constant poolFee = 3000;

    constructor(ISwapRouter _pRouter, UniversalRouter _uRouter, address _poolManager, address _permit2, address _balancerVault) {
        uRouter = UniversalRouter(_uRouter);
        pRouter = _pRouter;
        poolManager = IPoolManager(_poolManager);
        permit2 = IPermit2(_permit2);
        balancerVault = IVaultMain(_balancerVault);
        owner = msg.sender;
    }

    function approveTokenWithPermit2(
        address token,
        uint160 amount,
        uint48 expiration,
        address _router
    ) public {
        IERC20(token).approve(address(permit2), type(uint256).max);
        permit2.approve(token, address(_router), amount, expiration);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function executeFlashLoan(uint256 amount, address token0, address token1, bool startOnUniswap, PoolKey memory key) external onlyOwner {
        // Prepare calldata for the vault callback
        bytes memory userData = abi.encode(amount, token0, token1, startOnUniswap, key);
        balancerVault.unlock(abi.encodeWithSelector(this.receiveFlashLoan.selector, userData));
    }

    function receiveFlashLoan(bytes memory userData) external {
        require(msg.sender == address(balancerVault), "Unauthorized callback");

        // Decode flash loan amount
        (uint256 amount, address token0, address token1, bool startOnUniswap, PoolKey memory key) = abi.decode(userData, (uint256, address, address, bool, PoolKey));

        // Send some tokens from the vault to this contract (taking a flash loan)
        balancerVault.sendTo(IERC20(token0), address(this), amount);

        // Execute any logic with the borrowed funds (e.g., arbitrage, liquidation, etc.)
        address[] memory path = new address[](2);

        path[0] = token0;
        path[1] = token1;

        if (startOnUniswap) {
            _Uniswap(key, path, uint160(amount), 0, 281474976710655, uRouter);

            path[0] = token1;
            path[1] = token0;

            _Pancakeswap(token0, token1, uint160(IERC20(token1).balanceOf(address(this))), pRouter);
        } else {
            _Pancakeswap(token0, token1, uint160(amount), pRouter);

            path[0] = token1;
            path[1] = token0;

            _Uniswap(key, path, uint160(IERC20(token1).balanceOf(address(this))), amount, 281474976710655, uRouter);
        }

        // Repay the loan
        IERC20(token0).transfer(address(balancerVault), amount);

        // Settle the repayment
        balancerVault.settle(IERC20(token0), amount);
    }

    function _Pancakeswap(
        address token0,
        address token1,
        uint160 _amountIn,
        ISwapRouter router
    ) internal returns (uint256 amountOut) {
        TransferHelper.safeTransferFrom(token1, msg.sender, address(this), _amountIn);
        TransferHelper.safeApprove(token1, address(router), _amountIn);
        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: token0,
                tokenOut: token1,
                fee: poolFee,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: _amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        amountOut = router.exactInputSingle(params);
    }

    function _Uniswap(
        PoolKey memory key,
        address[] memory _path,
        uint160 _amountIn,
        uint256 _amountOut,
        uint48 expiration,
        UniversalRouter router
    ) internal returns (uint256 amountOut) {
        approveTokenWithPermit2(_path[0], _amountIn, expiration, address(router));

        // Encode the Universal Router command
        bytes memory commands = abi.encodePacked(uint8(Commands.V4_SWAP));
        bytes[] memory inputs = new bytes[](1);

        // Encode V4Router actions
        bytes memory actions = abi.encodePacked(
            uint8(Actions.SWAP_EXACT_IN_SINGLE),
            uint8(Actions.SETTLE_ALL),
            uint8(Actions.TAKE_ALL)
        );

        // Prepare parameters for each action
        bytes[] memory params = new bytes[](3);
        params[0] = abi.encode(
            IV4Router.ExactInputSingleParams({
                poolKey: key,
                zeroForOne: true,
                amountIn: uint128(_amountIn),
                amountOutMinimum: uint128(_amountOut),
                hookData: bytes("")
            })
        );
        params[1] = abi.encode(key.currency0, _amountIn);
        params[2] = abi.encode(key.currency1, _amountOut);

        // Combine actions and params into inputs
        inputs[0] = abi.encode(actions, params);

        // Execute the swap
        router.execute(commands, inputs, block.timestamp);

        // Verify and return the output amount
        amountOut = IERC20(address(uint160(key.currency1.toId()))).balanceOf(address(this));
        require(amountOut >= _amountOut, "Insufficient output amount");
        return amountOut;
    }
}
