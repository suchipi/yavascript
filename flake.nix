{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      inherit (nixpkgs) lib;

      makePackages = (system:
        let
          pkgs = import nixpkgs {
            inherit system;
          };
        in
        {
          default = pkgs.buildNpmPackage rec {
            pname = "yavascript";
            version =
              let
                sha = builtins.substring 0 12 (self.rev or self.dirtyRev);
                dirty = lib.strings.optionalString (self ? dirtyRev) "-dirty";
              in
              "git-${sha}${dirty}";

            src = ./.;

            npmConfigHook = pkgs.importNpmLock.npmConfigHook;
            npmDeps = pkgs.importNpmLock {
              npmRoot = src;
            };

            SKIP_FNM_USE = 1;
            SKIP_NPM_INSTALL = 1;
            YAVASCRIPT_VERSION = version;

            preBuild = ''
              patchShebangs meta
            '';

            nativeBuildInputs = with pkgs; [
              ninja
            ];
            dontUseNinjaBuild = true;
            dontUseNinjaInstall = true;

            installPhase = ''
              mkdir -p $out/bin
              cp -r dist $out/
              mv \
                $out/dist/yavascript \
                $out/dist/yavascript-bootstrap \
                $out/bin/
            '';
          };
        }
      );
    in
    builtins.foldl' lib.recursiveUpdate { } (builtins.map
      (system: {
        devShells.${system} = makePackages system;
        packages.${system} = makePackages system;
      })
      lib.systems.flakeExposed);
}
