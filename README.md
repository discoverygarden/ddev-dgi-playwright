[![tests](https://github.com/ddev/ddev-addon-template/actions/workflows/tests.yml/badge.svg)](https://github.com/ddev/ddev-addon-template/actions/workflows/tests.yml) ![project is maintained](https://img.shields.io/maintenance/yes/2025.svg)

# DGI-PLAYWRIGHT
Implements dgi specific additions to the Lullabot playwright 
## Enable
Following part of the initial instructions outlined at Lullabot/ddev-playwright, which looks like:
```
ddev add-on get Lullabot/ddev-playwright
ddev add-on get discoverygarden/ddev-dgi-playwright

# Installs playwright with dgi additions
ddev install-dgi-playwright
```

## Use playwright
```
# Runs playwright using playwrights `test` command.
ddev playwright test

# Runs playwright with access to the UI
ddev playwright-ui

## Runs playwright in codegen mode
ddev playwright codegen
```

## Additional Resources
[Playwright basic usage docs](https://playwright.dev/docs/intro)
[Lullabot/ddev-playwright](https://github.com/Lullabot/ddev-playwright)
