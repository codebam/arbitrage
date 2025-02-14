// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import "@balancer-labs/v2-interfaces/contracts/vault/IVault.sol";
import "@balancer-labs/v2-interfaces/contracts/vault/IFlashLoanRecipient.sol";

import { UniversalRouter } from "@uniswap/universal-router/contracts/UniversalRouter.sol";
import { Commands } from "@uniswap/universal-router/contracts/libraries/Commands.sol";
import { IPoolManager } from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import { IV4Router } from "@uniswap/v4-periphery/src/interfaces/IV4Router.sol";
import { Actions } from "@uniswap/v4-periphery/src/libraries/Actions.sol";
import { IPermit2 } from "@uniswap/permit2/src/interfaces/IPermit2.sol";
import { StateLibrary } from "@uniswap/v4-core/src/libraries/StateLibrary.sol";
import { PoolKey } from "@uniswap/v4-core/src/types/PoolKey.sol";
import { ISwapRouter } from "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import { Commands } from "@uniswap/universal-router/contracts/libraries/Commands.sol";
// import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// already imported by balancer contracts

abstract contract Arbitrage is IFlashLoanRecipient {
    using StateLibrary for IPoolManager;

    UniversalRouter public immutable router;
    IPoolManager public immutable poolManager;
    IPermit2 public immutable permit2;

    IVault private constant vault = IVault(0xBA12222222228d8Ba445958a75a0704d566BF2C8);

    ISwapRouter public immutable sRouter;
    UniversalRouter public immutable uRouter;
    address public owner;
    uint24 public constant feeTier = 3000;

    function approveTokenWithPermit2(
        address token,
        uint160 amount,
        uint48 expiration,
        address _router
    ) public {
        IERC20(token).approve(address(permit2), type(uint256).max);
        permit2.approve(token, address(router), amount, expiration);
    }

    constructor(address _sRouter, UniversalRouter _router, address _poolManager, address _permit2) {
        sRouter = ISwapRouter(_sRouter); // Sushiswap
        uRouter = UniversalRouter(_router); // Uniswap
        poolManager = IPoolManager(_poolManager);
        permit2 = IPermit2(_permit2);
        owner = msg.sender;
    }

    function executeTrade(
        PoolKey calldata key,
        bool _startOnUniswap,
        address _token0,
        address _token1,
        uint256 _flashAmount
    ) external {
        bytes memory data = abi.encode(_startOnUniswap, _token0, _token1);

        // Token to flash loan, by default we are flash loaning 1 token.
        IERC20[] memory tokens = new IERC20[](1);
        tokens[0] = IERC20(_token0);

        // Flash loan amount.
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = _flashAmount;

        vault.flashLoan(this, tokens, amounts, data);
    }

    function receiveFlashLoan(
        PoolKey calldata key,
        IERC20[] memory tokens,
        uint160[] memory amounts,
        bytes memory userData
    ) external {
        require(msg.sender == address(vault));

        uint160 flashAmount = amounts[0];

        (bool startOnUniswap, address token0, address token1) = abi.decode(
            userData,
            (bool, address, address)
        );

        // Use the money here!
        address[] memory path = new address[](2);

        path[0] = token0;
        path[1] = token1;

        if (startOnUniswap) {
            _swapOnUniswap(key, path, flashAmount, 0, 281474976710655);

            path[0] = token1;
            path[1] = token0;

            _swapOnSushiswap(path, uint160(IERC20(token1).balanceOf(address(this))), flashAmount, 281474976710655);
        } else {
            _swapOnSushiswap(path, flashAmount, 0, 281474976710655);

            path[0] = token1;
            path[1] = token0;

            _swapOnUniswap(key, path, uint160(IERC20(token1).balanceOf(address(this))), flashAmount, 281474976710655);
        }

        IERC20(token0).transfer(address(vault), flashAmount);

        IERC20(token0).transfer(owner, IERC20(token0).balanceOf(address(this)));
    }

    // -- INTERNAL FUNCTIONS -- //

    function _swapOnUniswap(
        PoolKey calldata key,
        address[] memory _path,
        uint160 _amountIn,
        uint256 _amountOut,
        uint48 expiration
    ) internal returns (uint256 amountOut) {
        approveTokenWithPermit2(_path[0], _amountIn, expiration, address(uRouter));

        uint160 priceLimit = 0;

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
                amountIn: _amountIn,
                amountOutMinimum: _amountOut,
                sqrtPriceLimitX96: uint160(0),
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
        amountOut = IERC20(key.currency1).balanceOf(address(this));
        require(amountOut >= _amountOut, "Insufficient output amount");
        return amountOut;
    }

    function _swapOnSushiswap(
        address[] memory _path,
        uint160 _amountIn,
        uint256 _amountOut,
        uint48 expiration
    ) internal returns (uint256 amountOut) {
        approveTokenWithPermit2(_path[0], _amountIn, expiration, address(sRouter));

        uint160 priceLimit = 0;

        ISwapRouter.ExactInputSingleParams memory params =
         ISwapRouter.ExactInputSingleParams({
            tokenIn: _path[0],
            tokenOut: _path[1],
            fee: feeTier,
            recipient: address(this),
            deadline: (block.timestamp + 1200),
            amountIn: _amountIn,
            amountOutMinimum: _amountOut,
            sqrtPriceLimitX96: priceLimit
        });
        amountOut = sRouter.exactInputSingle(params);
        return amountOut;
    }
}
