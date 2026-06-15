# FoundSM Component Catalog

## Preferred POC Blocks

| `_type` | Best Use | Required Values | Optional Tokens |
| --- | --- | --- | --- |
| `modernHeroBlock` | First viewport, campaign promise, primary CTA | `title`, `intro`, `cta` | `layoutPreset`, `tone`, `titleScale`, `imageShape`, `imageFit`, `sizePreset`, media |
| `splitFeatureBlock` | Explain one idea with supporting media | `title`, `body` | `eyebrow`, `cta`, media, `imagePosition`, `theme` |
| `featureTabsBlock` | Compare parallel ideas or methods | `title`, `tabs[].title`, `tabs[].body` | `subtitle`, `idPrefix`, tab icon/media, `theme` |
| `cardGridBlock` | Benefits, services, proof points, steps | `title`, `cards[].title`, `cards[].body` | `subtitle`, card lead/icon/media, `columns`, `theme` |
| `statementBandBlock` | Emphasized principle or proof statement | `lead`, `body` | `theme`, `pattern`, `width` |
| `modernCtaBlock` | Final or mid-page next action | `title`, `cta` | `body`, `theme`, `align` |

## Existing Generic Blocks

`heroBlock`, `statsBlock`, `featuresBlock`, `testimonialBlock`, `ctaBlock`, `formBlock`, `textBlock`, `imageTextBlock`, `logoBarBlock`, and `faqBlock` remain valid. Prefer modern POC blocks for new AI-assisted landing pages.

## Token Values

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
