# Changelog

## 1.0.0 (2025-04-15)


### ⚠ BREAKING CHANGES

* removed command and Supabase related logic
* removed command and Supabase related logic

### Features

* command interface ([cb47c59](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/cb47c59d82399ac8989ba7f3eb2428463f6fe969))
* global label change via config ([2be8b8e](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/2be8b8e332421ba07e2da36e6f6e777da40f4943))
* remove unused higher time and priority labels ([f0e2a21](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/f0e2a21ecc00030e7a4d04ad46d552035aaa105d))
* switch to Bun ([faec8fd](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/faec8fdb733f2508392ac598c265a5a40793ef0e))
* upgrade sdk ([e9c4714](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/e9c4714a8719cdf0636502ba332a334967433eaf))
* used ubiquity's knip-reporter ([42391a6](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/42391a683a183f614ac63598cda333562bb85e72))
* used ubiquity's knip-reporter ([ecc041e](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/ecc041edd014fbfc0f933627c8a9f615fb70dc79))


### Bug Fixes

* add environment ([74bd780](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/74bd780f45d74ab567df8d35b5abb3ac708fa5bf))
* add environment ([79020ac](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/79020ac75568c15194a4bece1593e57500ad8bcd))
* added defaults for time and priority settings ([422a553](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/422a553c26c5667afc7cbb57876748c543ef2b6a))
* **config:** add descriptions to JSON schema properties ([f3bc570](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/f3bc570beebccd520c6c9b69194a7dc26ab1a490))
* eslint and prettier ([50df0a3](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/50df0a3498be5d56a43ec18e51bd77b39ff3d309))
* json schema ([cbdd62f](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/cbdd62fc95232454634f41a038067c839d7704dc))
* knip ([e12efd8](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/e12efd8a709a59a924172d5fa364909d13a583be))
* label generation ([305eed6](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/305eed61201335f4fec9f5340b556a990b74a232))
* labels are deleted from the targeted repo on regeneration ([c977b8b](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/c977b8bb2a5eb549e77696aeb4ba576d76d16d4b))
* labels do not get added twice to the label price list on update ([9e9ce5d](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/9e9ce5dce7365f2b9818a4ee00a25de0aa45b5c8))
* **logging:** handle missing label error gracefully ([23e02c7](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/23e02c763d02048a479452d80f41aa4525f9ef0e))
* long-running `syncPriceLabelToConfig` now only runs within GitHub Actions ([c3732a4](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/c3732a4108ba05370f4bf197f6c8b6a642cdd137))
* ncc build ([f9b1a54](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/f9b1a54b1014554a063327bb53d88de0f0f5da05))
* octokit auth ([c667d1f](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/c667d1f209f319d5e394664a0914c058ef4b63b7))
* only the incorrect labels get deleted on multiplier update ([e05e224](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/e05e224c8cd5c4f27b0a11e58e6d37d58ac6f6f6))
* pricing attempt on parent issue now displays a warning, or nothing is no price is set ([72c8912](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/72c89125b01c6c111010b5afa80794a9614b32e3))
* pricing parent issue ([fd23fd0](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/fd23fd031d531dde732144e8b6142f240e82964e))
* priority 0 is now properly handled and prices at zero ([3b5a250](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/3b5a25059cb447541d3cd0d8b0a6017e2b58a654))
* priority 0 is now properly handled and prices at zero ([2a7dfa8](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/2a7dfa843e5050b341900655ad0bce981f230594))
* remove allow command ([3e33352](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/3e33352a1db89df5a404c7f90614b22011691bd3))
* remove node ([9086444](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/908644492e5ebbc77088fef5ea985a30d5dae1c6))
* remove public-access-control ([16dff27](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/16dff27429d4ccc399a13e30b197c07a4c6f7272))
* remove ts expect error ([d6184bd](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/d6184bdec0d1c9da5139dce82ffa4caa6859ed92))
* remove unneeded ([74cba95](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/74cba95e2accc2324948f98a1d3bc743e4f07e49))
* removed `/allow` command ([2d14eac](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/2d14eaca84c50c9808b3d62d96abf59cf35dee07))
* removed `/allow` command ([7591c53](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/7591c532a1c1b4de8efac32937c20d1fa1fde2a6))
* removed `publicAccessControl` and replaced it with `shouldFundContributorClosedIssue` ([f250edb](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/f250edb16d6785cf73dedfda858c178b1d37ce11))
* removed collaborator feature ([3702e7e](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/3702e7e6c4151b5e179e466a62b4ce1c16ddcf51))
* removed command and Supabase related logic ([ecfa4fe](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/ecfa4fe220aa208ebb7a79d63d4346564a915f96))
* removed command and Supabase related logic ([df2d10d](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/df2d10d0492455af8c5f5c130d1b197bebafb21c))
* run label creation as an Action ([5e431c8](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/5e431c832d59b7d49653a7b0fbad5bbbab904cce))
* SDK usage ([eb5b16e](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/eb5b16e08ce833aff6f3f9d8e18b39e173f3f9fa))
* setup bun ([13d90cd](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/13d90cdce1782eeb8a62c5c824e49b3ed36207f8))
* support ESM and update configurations ([7ee03ee](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/7ee03ee4a391d3e51708417c079fef561b0e013b))
* support ESM and update configurations ([20dcee9](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/20dcee96aa187f0dd8c7dee95a95a7e1fe98fa1e))
* tests ([665d7b0](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/665d7b0508df9d74d338c026c374801d21dc7cfe))
* **tests:** update mocking technique and import structure ([67d96d5](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/67d96d537bdd5b56517ebc509357dd3bc477c402))
* the error message regarding the label set only appear on pricing attempts ([bc91264](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/bc91264bed7fd25c883bec23739d265eec170d86))
* trigger Action for base rate update ([17bbf31](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/17bbf31b8a04fcd3679f152e0195e69e37186e6d))
* update bun lock file format ([16f9dd5](https://github.com/ubiquity-whilefoo/daemon-pricing/commit/16f9dd5169261d52b3fb2a39b8becbf9deff88f0))

## [1.1.0](https://github.com/ubiquity-os-marketplace/daemon-pricing/compare/v1.0.2...v1.1.0) (2024-11-29)

### Features

- add @ubiquity-os/ubiquity-os-kernel ([e326fa0](https://github.com/ubiquity-os-marketplace/daemon-pricing/commit/e326fa0f600d9614bb4b3d5c6946b337b4d024ee))
- add label change detection in global config update ([16f64da](https://github.com/ubiquity-os-marketplace/daemon-pricing/commit/16f64da359b4dc3be0aea4fa60cadbd8d491aa8f))
- add label description and collaborator-only feature ([8ce1f22](https://github.com/ubiquity-os-marketplace/daemon-pricing/commit/8ce1f22eb895014b35a779e44a5483f30ce6153b))
- command interface ([cb47c59](https://github.com/ubiquity-os-marketplace/daemon-pricing/commit/cb47c59d82399ac8989ba7f3eb2428463f6fe969))
- **logging:** add logger for label update check ([7739f14](https://github.com/ubiquity-os-marketplace/daemon-pricing/commit/7739f1477fd701d74052e1ef7c9f6051d128260c))
- manifest check ([1b566f5](https://github.com/ubiquity-os-marketplace/daemon-pricing/commit/1b566f51a32a2a6c10434f920cd6a1df30de0878))
- remove unused higher time and priority labels ([f0e2a21](https://github.com/ubiquity-os-marketplace/daemon-pricing/commit/f0e2a21ecc00030e7a4d04ad46d552035aaa105d))
- switch to Bun ([faec8fd](https://github.com/ubiquity-os-marketplace/daemon-pricing/commit/faec8fdb733f2508392ac598c265a5a40793ef0e))
- sync on repo created and issue opened ([72efb74](https://github.com/ubiquity-os-marketplace/daemon-pricing/commit/72efb74d04b1b5983053e9b999314321f772d8d6))
- upgrade sdk ([e9c4714](https://github.com/ubiquity-os-marketplace/daemon-pricing/commit/e9c4714a8719cdf0636502ba332a334967433eaf))
- worker deploy and delete ([c202f02](https://github.com/ubiquity-os-marketplace/daemon-pricing/commit/c202f0279145675592aeabd780e54f4b434934b4))

### Bug Fixes

- add environment ([79020ac](https://github.com/ubiquity-os-marketplace/daemon-pricing/commit/79020ac75568c15194a4bece1593e57500ad8bcd))
- knip ([e12efd8](https://github.com/ubiquity-os-marketplace/daemon-pricing/commit/e12efd8a709a59a924172d5fa364909d13a583be))
- **logging:** handle missing label error gracefully ([23e02c7](https://github.com/ubiquity-os-marketplace/daemon-pricing/commit/23e02c763d02048a479452d80f41aa4525f9ef0e))
- ncc build ([f9b1a54](https://github.com/ubiquity-os-marketplace/daemon-pricing/commit/f9b1a54b1014554a063327bb53d88de0f0f5da05))
- remove node ([9086444](https://github.com/ubiquity-os-marketplace/daemon-pricing/commit/908644492e5ebbc77088fef5ea985a30d5dae1c6))
- remove ts expect error ([d6184bd](https://github.com/ubiquity-os-marketplace/daemon-pricing/commit/d6184bdec0d1c9da5139dce82ffa4caa6859ed92))
- remove unnecessary period from COLLABORATOR_ONLY_DESCRIPTION ([ef5fcb2](https://github.com/ubiquity-os-marketplace/daemon-pricing/commit/ef5fcb2573327401ecb5cc585211173e7bda3e10))
- remove unneeded ([74cba95](https://github.com/ubiquity-os-marketplace/daemon-pricing/commit/74cba95e2accc2324948f98a1d3bc743e4f07e49))
- remove unused inputs.ref from compute workflow ([45a9d8d](https://github.com/ubiquity-os-marketplace/daemon-pricing/commit/45a9d8d5f20135cbcb763d4041241ff7e8098d2b))
- round decimals ([0543cb5](https://github.com/ubiquity-os-marketplace/daemon-pricing/commit/0543cb55a34cad39dcb1c8886511da8754d5cbce))
- setup bun ([13d90cd](https://github.com/ubiquity-os-marketplace/daemon-pricing/commit/13d90cdce1782eeb8a62c5c824e49b3ed36207f8))
- support ESM and update configurations ([7ee03ee](https://github.com/ubiquity-os-marketplace/daemon-pricing/commit/7ee03ee4a391d3e51708417c079fef561b0e013b))
- support ESM and update configurations ([20dcee9](https://github.com/ubiquity-os-marketplace/daemon-pricing/commit/20dcee96aa187f0dd8c7dee95a95a7e1fe98fa1e))
- **sync-labels:** correct label description check logic ([7b7395e](https://github.com/ubiquity-os-marketplace/daemon-pricing/commit/7b7395e99dc861908028519e8236e0ea3a8c67b7))
- **sync-labels:** update label description handling ([5b6e439](https://github.com/ubiquity-os-marketplace/daemon-pricing/commit/5b6e439f9fc7054a9b792fcc3fb9ccd396a7b536))
- temporarily disable auth ([502b505](https://github.com/ubiquity-os-marketplace/daemon-pricing/commit/502b505396900b656022a2293709eb1b94418db6))
- tests ([665d7b0](https://github.com/ubiquity-os-marketplace/daemon-pricing/commit/665d7b0508df9d74d338c026c374801d21dc7cfe))
- **tests:** update mocking technique and import structure ([67d96d5](https://github.com/ubiquity-os-marketplace/daemon-pricing/commit/67d96d537bdd5b56517ebc509357dd3bc477c402))
- update bun lock file format ([16f9dd5](https://github.com/ubiquity-os-marketplace/daemon-pricing/commit/16f9dd5169261d52b3fb2a39b8becbf9deff88f0))
- update collaborator description with warning emoji ([470d072](https://github.com/ubiquity-os-marketplace/daemon-pricing/commit/470d072985c4ef5e673bfb9bef93152d510dd9c2))

## [1.0.2](https://github.com/ubiquity-os/daemon-pricing/compare/v1.0.1...v1.0.2) (2024-08-20)

### Bug Fixes

- temporarily disable auth ([97c8b36](https://github.com/ubiquity-os/daemon-pricing/commit/97c8b364381d7bb1abf09ffe10f7f88a4ad9f4c6))

## [1.0.1](https://github.com/ubiquity-os/daemon-pricing/compare/v1.0.0...v1.0.1) (2024-08-20)

### Bug Fixes

- updated manifest.json ([3aa6c14](https://github.com/ubiquity-os/daemon-pricing/commit/3aa6c14b3d250b7bb53a2ca4828049cf02318b8d))

## 1.0.0 (2024-07-08)

### Features

- access and label tables ([78d96d9](https://github.com/ubiquity-os/daemon-pricing/commit/78d96d9485a79fc8c5d984d6967ecc90d86e3d64))
- action inputs ([abca8f0](https://github.com/ubiquity-os/daemon-pricing/commit/abca8f0d5b5fc353fb314f6d12e7a4db179dcd61))
- added release-please.yml workflow ([a494891](https://github.com/ubiquity-os/daemon-pricing/commit/a4948917b8a00deaa2fd000ac50ed4052ab7a8bd))
- assistive pricing ([2728e2e](https://github.com/ubiquity-os/daemon-pricing/commit/2728e2e102681deb30461e5b86a7648631d03276))
- check signature ([c149116](https://github.com/ubiquity-os/daemon-pricing/commit/c149116af230ba3e0f441f7a87b5651ecd10499d))
- database type generation ([e2c0f39](https://github.com/ubiquity-os/daemon-pricing/commit/e2c0f395ccc9b70e22a28d2e7b1e6ec906024b0d))
- env is now validated ([ecbf7ab](https://github.com/ubiquity-os/daemon-pricing/commit/ecbf7abbed3ccc2c1bc1bc82f5d9c6f08c153036))
- generating supabase types on build ([7978c60](https://github.com/ubiquity-os/daemon-pricing/commit/7978c606fc771b2642798ea815adbec30e582939))
- handle comment ([a4beb54](https://github.com/ubiquity-os/daemon-pricing/commit/a4beb5422df78b97ac32cd3349774b44f18762f4))
- now runs on cloudflare worker ([94d5bb7](https://github.com/ubiquity-os/daemon-pricing/commit/94d5bb710a90442db3642594c92049763464be6a))
- setup action ([0160a2f](https://github.com/ubiquity-os/daemon-pricing/commit/0160a2fc0afdde4bf75fc94aab633f9c14b1c472))
- setup node and pnpm ([5d3c1c1](https://github.com/ubiquity-os/daemon-pricing/commit/5d3c1c162405358fbb8e0bc7a50fe7ce37669803))
- supabase, typeguards ([63643dd](https://github.com/ubiquity-os/daemon-pricing/commit/63643dd73cd67c601cf2720ff9e97203806718c4))
- typebox for settings schema ([32250fe](https://github.com/ubiquity-os/daemon-pricing/commit/32250fedce4b0df64b8af33d8e5fe4274afba58d))

### Bug Fixes

- added secrets for Supabase generation ([ba46893](https://github.com/ubiquity-os/daemon-pricing/commit/ba46893b28e114813ee576de61d32001cbc60502))
- added secrets for Supabase generation ([32a0d75](https://github.com/ubiquity-os/daemon-pricing/commit/32a0d75c9e372fb13c9ab308265eaa398d529cdd))
- change from inputs to env ([63a6eee](https://github.com/ubiquity-os/daemon-pricing/commit/63a6eeee3139018369134c10b3af256ea0aa9a71))
- check for membership before getting role ([3ac4014](https://github.com/ubiquity-os/daemon-pricing/commit/3ac401451b86f1c993644288cf5e179f43a6e045))
- comment ([3945ae4](https://github.com/ubiquity-os/daemon-pricing/commit/3945ae4c13d7c92260ffd5fc54a1c79758f3b4db))
- comment ([5d44e62](https://github.com/ubiquity-os/daemon-pricing/commit/5d44e6203ad621745ce526a9ec08db8bcd3cda26))
- cspell ([92bfa6e](https://github.com/ubiquity-os/daemon-pricing/commit/92bfa6e1303654e6e37c5b58776ba907413365b4))
- deployment and release are working properly ([d92e4c0](https://github.com/ubiquity-os/daemon-pricing/commit/d92e4c04b325bd761c5558e61ebd945088f1da2a))
- eslint and cspell ([130ed5a](https://github.com/ubiquity-os/daemon-pricing/commit/130ed5a1eabf2f11a81eca924d97ca140b6a3cf1))
- fixed TTY environment missing ([612c851](https://github.com/ubiquity-os/daemon-pricing/commit/612c851b7c51cce07903a6fad0a72bb5053c2a1e))
- label type ([7278e3b](https://github.com/ubiquity-os/daemon-pricing/commit/7278e3b14f1393cd0aa1b04b8fbb7a87e7a67b66))
- log instead of throw ([3c6ef5c](https://github.com/ubiquity-os/daemon-pricing/commit/3c6ef5c3b338ac8953cbdb33313e9c071fa04e9b))
- permission for public set label ([9687b71](https://github.com/ubiquity-os/daemon-pricing/commit/9687b718fd123623c3e825a648f777cb83f1b6a1))
- remove duplicates and ignore label already exists error ([1f2e3ff](https://github.com/ubiquity-os/daemon-pricing/commit/1f2e3ff0027cf9b95b3d3c26a2455151452c57ad))
- sample request ([83a3d83](https://github.com/ubiquity-os/daemon-pricing/commit/83a3d8385400cfd1cc85c7d3e2eb5d375144c859))
- spacing ([ead0dab](https://github.com/ubiquity-os/daemon-pricing/commit/ead0dab367a1a4126bb73027c5a1e4153230577a))
- switch statement ([c429aa2](https://github.com/ubiquity-os/daemon-pricing/commit/c429aa2eedaa583e769d8b2cc1196c32bbf768d8))
- tests ([4a9cfc3](https://github.com/ubiquity-os/daemon-pricing/commit/4a9cfc3e98f283e54daf3c01d6e016d216eec658))
