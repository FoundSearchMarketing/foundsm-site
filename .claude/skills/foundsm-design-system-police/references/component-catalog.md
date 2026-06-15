# FoundSM Component Catalog

Approved preferred blocks: `modernHeroBlock`, `splitFeatureBlock`, `featureTabsBlock`, `cardGridBlock`, `statementBandBlock`, `modernCtaBlock`.

Approved existing generic blocks: `heroBlock`, `statsBlock`, `featuresBlock`, `testimonialBlock`, `ctaBlock`, `formBlock`, `textBlock`, `imageTextBlock`, `logoBarBlock`, and `faqBlock`.

Approved token values:

```json
{
  "modernHeroBlock": {
    "layoutPreset": ["split", "textOnly"],
    "tone": ["light", "soft", "dark"],
    "titleScale": ["default", "display"],
    "imageShape": ["rounded", "circle", "plain"],
    "imageFit": ["cover", "contain"],
    "sizePreset": ["compact", "standard", "spacious"]
  },
  "splitFeatureBlock": {
    "imagePosition": ["left", "right"],
    "theme": ["light", "muted", "dark"]
  },
  "featureTabsBlock": {
    "theme": ["light", "muted"]
  },
  "cardGridBlock": {
    "columns": [2, 3, 4],
    "theme": ["light", "muted", "dark"]
  },
  "statementBandBlock": {
    "theme": ["dark", "muted", "light"],
    "pattern": [true, false],
    "width": ["default", "narrow"]
  },
  "modernCtaBlock": {
    "theme": ["dark", "green", "light", "white"],
    "align": ["split", "centered"]
  }
}
```
