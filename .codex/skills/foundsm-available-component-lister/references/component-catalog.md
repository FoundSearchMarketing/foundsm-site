# FoundSM Component Catalog

## Preferred POC Blocks

| Component | Use When | Required Values | Optional Tokens |
| --- | --- | --- | --- |
| `modernHeroBlock` | First viewport, campaign promise, primary CTA | `title`, `intro`, `cta` | media, `layoutPreset`, `tone`, `titleScale`, `imageShape`, `imageFit`, `sizePreset` |
| `splitFeatureBlock` | Explain one idea with supporting media | `title`, `body` | `eyebrow`, `cta`, media, `imagePosition`, `theme` |
| `featureTabsBlock` | Compare parallel ideas or methods | `title`, `tabs` | `subtitle`, `idPrefix`, tab icons/media, `theme` |
| `cardGridBlock` | Benefits, services, proof points, steps | `title`, `cards` | `subtitle`, card lead/icons/media, `columns`, `theme` |
| `statementBandBlock` | Emphasize a principle, proof point, or quote-like idea | `lead`, `body` | `theme`, `pattern`, `width` |
| `modernCtaBlock` | Drive the next action | `title`, `cta` | `body`, `theme`, `align` |

## Existing Generic Blocks

`heroBlock`, `statsBlock`, `featuresBlock`, `testimonialBlock`, `ctaBlock`, `formBlock`, `textBlock`, `imageTextBlock`, `logoBarBlock`, and `faqBlock`.

## Forbidden Options

Do not present raw CSS, arbitrary colors, custom font sizes, custom breakpoints, inline styles, or one-off layout behavior as available controls.
