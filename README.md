[![tests](https://github.com/discoverygarden/ddev-dgi-playwright/actions/workflows/tests.yml/badge.svg)](https://github.com/discoverygarden/ddev-dgi-playwright/actions/workflows/tests.yml) ![project is maintained](https://img.shields.io/maintenance/yes/2025.svg)

# DGI-PLAYWRIGHT
Playwright integration for DGI projects, adapted from and using [Lullabot/ddev-playwright](https://github.com/Lullabot/ddev-playwright).
## Enable
Setup process should be straight forward. Download add-on, run install script, and tests will be immediately accessible to run:
```
# Installs the add-on
ddev add-on get discoverygarden/ddev-dgi-playwright

# Installs playwright with dgi additions
ddev install-dgi-playwright
```

## Use playwright
```
# Runs playwright using playwrights `test` command.
ddev playwright test

# Runs playwright with access to the UI accessible at <siteuri>:9324
ddev playwright-ui

## Runs playwright in codegen mode
ddev playwright codegen
```

## Additional Resources

* [Playwright basic usage docs](https://playwright.dev/docs/intro)
* [Lullabot/ddev-playwright](https://github.com/Lullabot/ddev-playwright)
