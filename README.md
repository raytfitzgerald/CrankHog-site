# crankhog.app

The website for [CrankHog](https://github.com/raytfitzgerald/FreeGaz), the free indoor trainer app.

Plain static HTML and CSS, with no build step. Preview it locally with:

```bash
python3 -m http.server 8742
```

The screenshots, logos and fonts in `assets/` come from the app repo (`docs/screenshots`, `docs/brand`, and the bundled Saira and Atkinson Hyperlegible Next fonts, both SIL OFL 1.1). The brand rules are in the app's `docs/BRAND.md`.

The link-preview image (`assets/img/og.png`, 1200×630) is built from `og/card.html`. After changing the card or the home screenshot, run `og/render.sh` (needs Google Chrome).
