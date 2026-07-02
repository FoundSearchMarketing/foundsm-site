# FoundSM Component Catalog

Use these approved Sanity `landingPage.sections` blocks for AI-assisted landing pages. Do not invent block types, raw CSS fields, arbitrary colors, font sizes, font weights, breakpoints, or editor-owned responsive behavior.

## Shared Landing Page Blocks

| `_type` | Best Use | Required Values | Optional Tokens |
| --- | --- | --- | --- |
| `modernHeroBlock` | First viewport, campaign promise, primary CTA | `title`, `intro`, `cta` | `secondaryCta`, `layoutPreset`, `tone`, `titleScale`, `imageShape`, `imageFit`, `sizePreset`, media |
| `splitFeatureBlock` | Explain one idea with supporting media | `title`, `body` | `eyebrow`, `cta`, media, `hubspotFormId`, `imagePosition`, `mediaHeight`, `theme` |
| `featureTabsBlock` | Compare parallel ideas, methods, solutions, or audience paths | `title`, `tabs[].title`, `tabs[].body` | `subtitle`, `idPrefix`, tab icon/media/CTA, `theme`, `layoutPreset`, `autoRotate` |
| `cardGridBlock` | Benefits, services, proof points, steps, topic cards, credentials | `title`, `cards[].title`, `cards[].body` | `subtitle`, card `lead`, `icon`, `number`, `meta`, media, `cta`, `columns`, `theme`, `variant`, `density` |
| `statementBandBlock` | Emphasized principle, short proof statement, POV break | `lead`, `body` | `theme`, `pattern`, `width` |
| `proofMosaicBlock` | Mixed proof with metrics, testimonial, trust card, optional media | `title` | `metrics`, `quote`, `featureCard`, media, `theme`, `layoutPreset` |
| `formLandingBlock` | Contact, newsletter, resource, and event lead-capture pages | `title`, `intro`, `hubspotFormId` | `eyebrow`, `lead`, `portalId`, `summary`, `variant`, `theme`, `showFormCard` |
| `accordionBlock` | Dense advantages, why-us detail, process detail, FAQ-adjacent content | `title`, `items[].title`, `items[].body` | `eyebrow`, `body`, `items[].icon`, `theme`, `layoutPreset` |
| `peopleGridBlock` | Leadership, speaker, author, advisor, or team sections | `title`, `people[].name`, `people[].role` | `intro`, person image/video, `layout`, `showImages` |
| `eventHeroBlock` | Campaign or event opener with metadata, stats, chips, and dual CTAs | `titleLines`, `description`, `primaryCta` | `eyebrow`, `accentLine`, `meta`, `secondaryCta`, `cardTitle`, `stats`, `chips`, `theme` |
| `modernCtaBlock` | Final or mid-page next action | `title`, `cta` | `body`, `theme`, `align`, `layoutPreset` |
| `logoBarBlock` | Client, partner, platform, press, or trust-logo band | `logos[].name` plus logo media when using logo objects, or legacy image logos with `alt` | `heading`, `displayMode`, `theme`, `density` |

## Legacy Blocks

`heroBlock`, `statsBlock`, `featuresBlock`, `testimonialBlock`, `ctaBlock`, `formBlock`, `textBlock`, `imageTextBlock`, and `faqBlock` remain valid for existing pages. Prefer the shared blocks above for new AI-assisted landing pages.

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
    "mediaHeight": ["standard", "short", "hero"],
    "theme": ["light", "muted", "dark"]
  },
  "featureTabsBlock": {
    "theme": ["light", "muted"],
    "layoutPreset": ["mediaPanel", "badgePanel", "ecosystem"],
    "autoRotate": [true, false]
  },
  "cardGridBlock": {
    "columns": [2, 3, 4],
    "theme": ["light", "muted", "dark"],
    "variant": ["standard", "icon", "numbered", "credential", "topic", "benefit"],
    "density": ["compact", "standard"]
  },
  "statementBandBlock": {
    "theme": ["dark", "muted", "light"],
    "pattern": [true, false],
    "width": ["default", "narrow"]
  },
  "proofMosaicBlock": {
    "theme": ["light", "dark"],
    "layoutPreset": ["mosaic", "compact"]
  },
  "formLandingBlock": {
    "variant": ["contact", "newsletter", "resource", "event"],
    "theme": ["light", "dark", "muted"],
    "showFormCard": [true, false]
  },
  "accordionBlock": {
    "theme": ["light", "muted", "dark"],
    "layoutPreset": ["singleColumn", "twoColumn"]
  },
  "peopleGridBlock": {
    "layout": ["centered", "split"],
    "showImages": [true, false]
  },
  "eventHeroBlock": {
    "theme": ["dark", "green", "light"]
  },
  "modernCtaBlock": {
    "theme": ["dark", "green", "light", "white"],
    "align": ["split", "centered"],
    "layoutPreset": ["panel", "strip", "compact"]
  },
  "logoBarBlock": {
    "displayMode": ["static", "marquee"],
    "theme": ["light", "muted"],
    "density": ["compact", "standard"]
  }
}
```

## Placeholder Media

When the user does not provide a real image, keep the section visual by adding a temporary placeholder image URL in `videoUrl`; leave `image` unset until an editor uploads a real Sanity image asset. The placeholder must visibly say `Image goes here - WIDTHxHEIGHT` and `imageAlt` must say what image should replace it.

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
| `eventHeroBlock` supporting campaign image, if adapted later | `1200x900` |
| `splitFeatureBlock` media | `960x720` |
| `proofMosaicBlock` media | `1200x800` |
| `featureTabsBlock.tabs[].image` | `826x1070` |
| `cardGridBlock.cards[].image` | `800x600` |
| `peopleGridBlock.people[].image` | `800x800` |
| `heroBlock` media | `1200x900` |
| `imageTextBlock` media | `960x720` |
| `logoBarBlock.logos[].videoUrl` placeholder or uploaded logo image | `320x160` |
