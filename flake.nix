{
  inputs = {
    utils.url = "github:numtide/flake-utils";
  };
  outputs = { self, nixpkgs, utils }: utils.lib.eachDefaultSystem (system:
    let
      pkgs = nixpkgs.legacyPackages.${system};
    in
    {
      devShell = pkgs.mkShell {
        buildInputs = with pkgs; [
            foundry
            nodejs
            efm-langserver
            nil
            nodePackages.typescript-language-server
            nodePackages.prettier
            vscode-langservers-extracted
            nodePackages.bash-language-server
        ];
      };
    }
  );
}
