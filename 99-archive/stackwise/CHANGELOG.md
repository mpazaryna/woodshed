# CHANGELOG.md

## [v2.4.0] - 2025-01-08 09:50:14 -0500

### Features

- refactor import and chopper to be markdown specific ([`5e1689c`](https://github.com/mpazaryna/stackwise/commit/5e1689c32b8b5f3772c54251b9a7feb28475ee66))
- updated ai_compose for markdown ([`b85636b`](https://github.com/mpazaryna/stackwise/commit/b85636b659424803e9be61a23ffefb4d4703d2ca))
- convert xml to markdown ([`5751dc3`](https://github.com/mpazaryna/stackwise/commit/5751dc371a002139149d3bea77b632fe71046764))

### Chores

- remove cruft, xml is no longer a base file type ([`d71bd42`](https://github.com/mpazaryna/stackwise/commit/d71bd4213b15fe4c031fa1d4140082d31d1ec5af))
- remove analysis.ts is not needed ([`d06ae3f`](https://github.com/mpazaryna/stackwise/commit/d06ae3f8092c71d68291b79f3b8060baa9a3aa42))

## [v2.3.0] - 2024-12-16 13:20:02 -0500

### Features

- domain based cli ([`5f1eee8`](https://github.com/mpazaryna/stackwise/commit/5f1eee850a2013fe8462ce636afb8e5cc05c4e3a))
- add domain specific handlers ([`d0b2291`](https://github.com/mpazaryna/stackwise/commit/d0b229169e2f0fb54a2b06c01fd7348ce746f6c4))
- domain driven cli ([`ce3c50d`](https://github.com/mpazaryna/stackwise/commit/ce3c50d5dae2a5e0610501a0d1675b1775a71d4b))
- integration first development rules ([`6d2c4f6`](https://github.com/mpazaryna/stackwise/commit/6d2c4f61fcee5725f5fd5a93eff97753cfd33498))

### Bug Fixes

- update deno task for aic to include --env flag and add logging for environment variable checks in aic.ts ([`9b1520c`](https://github.com/mpazaryna/stackwise/commit/9b1520c8bca90113f2b19aebe6b7298bcda4e8d2))

### Documentation

- updated changelog ([`f81d5cb`](https://github.com/mpazaryna/stackwise/commit/f81d5cb233f0f1b8689e466bf5c4f18c626a5cc0))
- updated readme ([`10529f1`](https://github.com/mpazaryna/stackwise/commit/10529f1ea1ecc9f29244e45eb50b8b56d0b8f947))

### Chores

- update file names ([`ac17cd0`](https://github.com/mpazaryna/stackwise/commit/ac17cd0a6c9e5029a690f2b585c30f31562452a1))
- rename to _legacy ([`83fa746`](https://github.com/mpazaryna/stackwise/commit/83fa74635a17d8e2e220fb04e38e81deeef5d207))
- additional refactors and renames ([`5261fc3`](https://github.com/mpazaryna/stackwise/commit/5261fc37335468559bcc07d95ba636584f8b8761))
- standardize names ([`9143998`](https://github.com/mpazaryna/stackwise/commit/914399899aa60022f83a52bba4657005bffb11ed))
- write full rules on cli_compose ([`c731814`](https://github.com/mpazaryna/stackwise/commit/c731814017dabf4dc32f4b33b905fa42089ac9ba))
- additional updates ([`774d68d`](https://github.com/mpazaryna/stackwise/commit/774d68d3c664de64aba1b71842f75736515b57e2))
- remove wellness as a domain ([`5db53b4`](https://github.com/mpazaryna/stackwise/commit/5db53b4d8f7c622610d430d983b42237f64fd19b))
- removed angular project config cruft ([`cf277b3`](https://github.com/mpazaryna/stackwise/commit/cf277b35d9a3dd9f2c3f3ae5a869ca060e016836))
- add angular-specific to tag ([`619b54d`](https://github.com/mpazaryna/stackwise/commit/619b54dcbbeb968ef5d47c683e032b49950d4e1a))
- removed from git ([`3d9ed66`](https://github.com/mpazaryna/stackwise/commit/3d9ed66140aa7b096317eb578ca44bef6dee8711))
- removed cruft ([`9a0d462`](https://github.com/mpazaryna/stackwise/commit/9a0d46277bca674396ed0d9a8988949b6fbca002))
- remove code that is creating bunk directories ([`6ecca98`](https://github.com/mpazaryna/stackwise/commit/6ecca98a88bafa3d84b147cd63d7cd7618485656))
- removed backup folder ([`a97a1cf`](https://github.com/mpazaryna/stackwise/commit/a97a1cf3b04a29e799be89c5043f628ae421c8a5))

## [v2.2.0] - 2024-12-12 14:02:58 -0500

### Features

- evalFacade.ts ([`251d30e`](https://github.com/mpazaryna/stackwise/commit/251d30e9b70b00ecde332dfbe07d1c2b91b8c425))
- centralizing logging ([`c2effe0`](https://github.com/mpazaryna/stackwise/commit/c2effe0c8676335875fe9e596321ee18e5b314ad))
- eval framework refactors ([`8bb1caa`](https://github.com/mpazaryna/stackwise/commit/8bb1caa265563b20386051829d2e828fb5ca4a6f))
- domain awareness when doing evals and analysis ([`d3d9d65`](https://github.com/mpazaryna/stackwise/commit/d3d9d65ccdc3e5b125a67bfd414cace8e917f729))
- add task for forge ([`706544c`](https://github.com/mpazaryna/stackwise/commit/706544cdc47b317b293eb4f31fd9ff703850f3b2))
- chopper util to break up large primitives ([`83e54b4`](https://github.com/mpazaryna/stackwise/commit/83e54b450f645565ba274d7e5ceb0953dc4ff031))
- adding api endpoint and aicFacade.ts for calling aic.ts ([`a62dc28`](https://github.com/mpazaryna/stackwise/commit/a62dc28133c880874d25ebb522ce3924a72a4ed3))
- add config for processing rules ([`9d5b257`](https://github.com/mpazaryna/stackwise/commit/9d5b25722c71bacc6e9da12f28fa323ef508db73))
- updated output ([`8a077ab`](https://github.com/mpazaryna/stackwise/commit/8a077ab4f68cf18efba188bd4663dd4da1d2f497))
- ai composition initial commit ([`69c4afb`](https://github.com/mpazaryna/stackwise/commit/69c4afb1f6e133abb0e1d00cadf893e403bcbd58))
- character arc primitive ([`be17956`](https://github.com/mpazaryna/stackwise/commit/be17956e845df1bd1e0e595b49e2d0ef64e1b3f0))
- write the ai analysis to evals ([`84a4026`](https://github.com/mpazaryna/stackwise/commit/84a4026a04fbc8bc632b7817dab2130a1cde044e))
- initial import of ai composition ([`47cbcd9`](https://github.com/mpazaryna/stackwise/commit/47cbcd91a0a807937bc1f4ae5b700c4116da843d))
- indexer improvements #44 ([`2aa2fa0`](https://github.com/mpazaryna/stackwise/commit/2aa2fa0bd43112bfed4003c3e65069b953a6a7e9))
- add assets folder ([`97270d3`](https://github.com/mpazaryna/stackwise/commit/97270d3ab9de3f2e53d4a2e241509f77b904e3bd))
- added changelog and changelog script ([`917a382`](https://github.com/mpazaryna/stackwise/commit/917a382829cac85c63bb2e0607e9adfb0bb350e5))

### Bug Fixes

- final refactors ([`fdc62a5`](https://github.com/mpazaryna/stackwise/commit/fdc62a5121088700758a495ba4923b1721835ff4))
- remove cruft folder ([`f8aee02`](https://github.com/mpazaryna/stackwise/commit/f8aee024fab8460083f8dc18953d6744b6a6e31f))
- file name and directory updated ([`803ec48`](https://github.com/mpazaryna/stackwise/commit/803ec48a6c827bc088f0fb07ef333d76d6844012))

### Documentation

- adding jdocs ([`1416e51`](https://github.com/mpazaryna/stackwise/commit/1416e513ee119417afe72be56b9d1bdd54189ba7))
- updated dev logs ([`87ef071`](https://github.com/mpazaryna/stackwise/commit/87ef07185d41bc0737053502b5c38278d440e672))
- repo update ([`6696dbc`](https://github.com/mpazaryna/stackwise/commit/6696dbcbcb6e9058d317f7e40f369a2d44594bf9))

### Chores

- remove cruft ([`6bfea01`](https://github.com/mpazaryna/stackwise/commit/6bfea0175b5a065e334c3d5aad795eadd01a492f))
- rename forge to chopper ([`a0ee14d`](https://github.com/mpazaryna/stackwise/commit/a0ee14db32f153f19cdd2072aa5855b39373c16e))
- more cleaning ([`6d775f9`](https://github.com/mpazaryna/stackwise/commit/6d775f9dfb3895ac351b206881e27d9aad0b3728))
- refactor name prompt becomes template ([`b63a9cd`](https://github.com/mpazaryna/stackwise/commit/b63a9cde5a925d1cb098314e21f432ff6eb5bfbd))
- updates and retest ([`734d546`](https://github.com/mpazaryna/stackwise/commit/734d546b2f13376deca60975729e54c0c0699481))
- updates ([`cd9d345`](https://github.com/mpazaryna/stackwise/commit/cd9d3450e72bbf0eb97b9f9b7a6a7987163caa06))
- commit before refactor ([`7294d54`](https://github.com/mpazaryna/stackwise/commit/7294d54b53a5558ab96ab345ad7122d51e02cbd7))
- remove cruft ([`c6636c8`](https://github.com/mpazaryna/stackwise/commit/c6636c883512e5af6a857d86c24a1e3b235cb2ad))
- remove subdirs ([`f5cd6de`](https://github.com/mpazaryna/stackwise/commit/f5cd6de5c7ed423b1caf47f338c971c43fbce276))
- updated deno tasks ([`9f285a0`](https://github.com/mpazaryna/stackwise/commit/9f285a05af633da0c157f47bbdae464336e934ca))
- hardening prompt generator for languages ([`0da2c4e`](https://github.com/mpazaryna/stackwise/commit/0da2c4edca099eda9ef565782db2a52c9915a16b))
- code cleanup ([`0ce74c0`](https://github.com/mpazaryna/stackwise/commit/0ce74c0348c0ad3b36fb47a7d40a09e8a2e66e64))
- updated dev tasks ([`a120a39`](https://github.com/mpazaryna/stackwise/commit/a120a3957ec0b0ea893b36aa93409b1a5ee8ab53))

## [v2.0.0] - 2024-12-06 16:32:05 -0500

### Features

- Major overhaul and refactor of the entire codebase.

### Bug Fixes

- No fix changes in this release.

### Documentation

- No docs changes in this release.

### Chores

- retest ([`9887dc8`](https://github.com/mpazaryna/stackwise/commit/9887dc8f72812adbb7caaebd03675fbd62d60d07))
