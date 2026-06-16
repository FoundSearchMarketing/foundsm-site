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

## Placeholder Media

When a user does not provide a real image, keep the section visual by adding a temporary placeholder image URL in `videoUrl`; leave `image` unset until an editor uploads a real Sanity image asset. The placeholder must visibly say `Image goes here - WIDTHxHEIGHT` and the `imageAlt` must say what image should replace it.

Use this format:

```json
{
  "videoUrl": "https://placehold.co/1200x900?text=Image+goes+here+-+1200x900",
  "imageAlt": "Image goes here - replace with a paid media dashboard image, 1200x900."
}
```

Recommended placeholder canvases:

| Component or media slot | Placeholder size |
| --- | --- |
| `modernHeroBlock` split media, rounded/plain | `1200x900` |
| `modernHeroBlock` circle media | `1200x1200` |
| `splitFeatureBlock` media | `960x720` |
| `featureTabsBlock.tabs[].image` | `826x1070` |
| `cardGridBlock.cards[].image` | `800x600` |
| `heroBlock` media | `1200x900` |
| `imageTextBlock` media | `960x720` |
| `logoBarBlock.logos[].image` | `320x160` |

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
