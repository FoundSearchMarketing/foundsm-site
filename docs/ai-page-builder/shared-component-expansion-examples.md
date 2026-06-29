# Shared Landing Page Component Examples

Use these examples as valid `landingPage.sections` shapes for the expanded shared component catalog. Keep styling tokenized; do not add raw CSS, arbitrary colors, custom font sizes, custom font weights, breakpoints, or editor-owned responsive behavior.

## Portable Text Helper Shape

```json
[
  {
    "_type": "block",
    "_key": "body-1",
    "style": "normal",
    "markDefs": [],
    "children": [
      {
        "_type": "span",
        "_key": "body-1-span",
        "text": "Replace this sentence with approved page copy.",
        "marks": []
      }
    ]
  }
]
```

## New Blocks

### `proofMosaicBlock`

```json
{
  "_type": "proofMosaicBlock",
  "_key": "proof-mosaic-1",
  "title": "Proof that connects spend to pipeline",
  "metrics": [
    {
      "_key": "metric-1",
      "eyebrow": "Pipeline",
      "prefix": "$",
      "value": "18M",
      "label": "in influenced opportunity reviewed across channels"
    }
  ],
  "quote": {
    "text": "FoundSM gave our revenue team a clearer operating rhythm.",
    "authorName": "Customer name placeholder",
    "authorTitle": "VP Marketing"
  },
  "featureCard": {
    "title": "Operator-owned measurement",
    "body": [
      {
        "_type": "block",
        "_key": "feature-body-1",
        "style": "normal",
        "markDefs": [],
        "children": [
          {
            "_type": "span",
            "_key": "feature-body-1-span",
            "text": "Connect channel decisions to pipeline quality, not just platform-reported conversions.",
            "marks": []
          }
        ]
      }
    ],
    "cta": {
      "label": "Talk to FoundSM",
      "href": "/contact-us/"
    }
  },
  "videoUrl": "https://placehold.co/1200x800?text=Image+goes+here+-+1200x800",
  "imageAlt": "Image goes here - replace with a proof dashboard image, 1200x800.",
  "theme": "light",
  "layoutPreset": "mosaic"
}
```

### `formLandingBlock`

```json
{
  "_type": "formLandingBlock",
  "_key": "form-landing-1",
  "eyebrow": "Contact",
  "title": "Talk with a paid media strategist",
  "lead": "Get a practical read on what is blocking pipeline from paid media.",
  "intro": [
    {
      "_type": "block",
      "_key": "intro-1",
      "style": "normal",
      "markDefs": [],
      "children": [
        {
          "_type": "span",
          "_key": "intro-1-span",
          "text": "Share a few details and the team will follow up with next steps.",
          "marks": []
        }
      ]
    }
  ],
  "hubspotFormId": "00000000-0000-0000-0000-000000000000",
  "portalId": "2299821",
  "variant": "contact",
  "theme": "dark",
  "showFormCard": true
}
```

### `accordionBlock`

```json
{
  "_type": "accordionBlock",
  "_key": "accordion-1",
  "eyebrow": "Why it works",
  "title": "The operating details that improve performance",
  "body": [
    {
      "_type": "block",
      "_key": "accordion-body-1",
      "style": "normal",
      "markDefs": [],
      "children": [
        {
          "_type": "span",
          "_key": "accordion-body-1-span",
          "text": "Use this section when the page needs dense detail without turning into a long wall of copy.",
          "marks": []
        }
      ]
    }
  ],
  "items": [
    {
      "_key": "item-1",
      "title": "Audience quality",
      "body": [
        {
          "_type": "block",
          "_key": "item-1-body",
          "style": "normal",
          "markDefs": [],
          "children": [
            {
              "_type": "span",
              "_key": "item-1-body-span",
              "text": "Segment by buying signal and sales feedback instead of only platform engagement.",
              "marks": []
            }
          ]
        }
      ]
    }
  ],
  "theme": "muted",
  "layoutPreset": "twoColumn"
}
```

### `peopleGridBlock`

```json
{
  "_type": "peopleGridBlock",
  "_key": "people-grid-1",
  "title": "Meet the operators leading the work",
  "intro": [
    {
      "_type": "block",
      "_key": "people-intro-1",
      "style": "normal",
      "markDefs": [],
      "children": [
        {
          "_type": "span",
          "_key": "people-intro-1-span",
          "text": "Use supplied people details only. Do not invent names, roles, or headshots.",
          "marks": []
        }
      ]
    }
  ],
  "people": [
    {
      "_key": "person-1",
      "name": "Team member placeholder",
      "role": "Paid Media Strategist",
      "videoUrl": "https://placehold.co/800x800?text=Image+goes+here+-+800x800",
      "imageAlt": "Image goes here - replace with a team member headshot, 800x800."
    }
  ],
  "layout": "centered",
  "showImages": true
}
```

### `eventHeroBlock`

```json
{
  "_type": "eventHeroBlock",
  "_key": "event-hero-1",
  "eyebrow": "Live workshop",
  "titleLines": ["Build a cleaner", "paid media revenue engine"],
  "accentLine": "in 45 minutes",
  "description": "A practical session for marketing teams that need clearer pipeline signal from paid media.",
  "meta": [
    {
      "_key": "meta-1",
      "label": "Date",
      "value": "July 18"
    }
  ],
  "primaryCta": {
    "label": "Reserve a seat",
    "href": "/contact-us/"
  },
  "secondaryCta": {
    "label": "Talk to FoundSM",
    "href": "/contact-us/"
  },
  "cardTitle": "What you will leave with",
  "stats": [
    {
      "_key": "stat-1",
      "label": "Format",
      "value": "Live Q&A"
    }
  ],
  "chips": ["Measurement", "Pipeline", "Optimization"],
  "theme": "dark"
}
```

## Extended Existing Blocks

### `cardGridBlock` with `variant`, `density`, card metadata, and card CTA

```json
{
  "_type": "cardGridBlock",
  "_key": "card-grid-extended-1",
  "title": "Three ways the system improves decisions",
  "columns": 3,
  "theme": "light",
  "variant": "numbered",
  "density": "compact",
  "cards": [
    {
      "_key": "card-1",
      "number": "01",
      "title": "Clarify signal",
      "meta": "Measurement",
      "body": [
        {
          "_type": "block",
          "_key": "card-1-body",
          "style": "normal",
          "markDefs": [],
          "children": [
            {
              "_type": "span",
              "_key": "card-1-body-span",
              "text": "Separate efficient spend from spend that only looks good inside ad platforms.",
              "marks": []
            }
          ]
        }
      ],
      "cta": {
        "label": "See the approach",
        "href": "/our-approach/"
      }
    }
  ]
}
```

### `featureTabsBlock` with layout preset, auto rotation, and per-tab CTA

```json
{
  "_type": "featureTabsBlock",
  "_key": "feature-tabs-extended-1",
  "title": "Where teams get stuck",
  "idPrefix": "paid-media-tabs",
  "theme": "muted",
  "layoutPreset": "ecosystem",
  "autoRotate": false,
  "tabs": [
    {
      "_key": "tab-1",
      "title": "Attribution",
      "body": [
        {
          "_type": "block",
          "_key": "tab-1-body",
          "style": "normal",
          "markDefs": [],
          "children": [
            {
              "_type": "span",
              "_key": "tab-1-body-span",
              "text": "Bring sales feedback and pipeline movement into the optimization loop.",
              "marks": []
            }
          ]
        }
      ],
      "cta": {
        "label": "Discuss measurement",
        "href": "/contact-us/"
      }
    }
  ]
}
```

### `modernCtaBlock` with compact layout

```json
{
  "_type": "modernCtaBlock",
  "_key": "modern-cta-extended-1",
  "title": "Ready to pressure-test your paid media system?",
  "body": [
    {
      "_type": "block",
      "_key": "cta-body-1",
      "style": "normal",
      "markDefs": [],
      "children": [
        {
          "_type": "span",
          "_key": "cta-body-1-span",
          "text": "Bring your current goals, channels, and friction points.",
          "marks": []
        }
      ]
    }
  ],
  "cta": {
    "label": "Talk to FoundSM",
    "href": "/contact-us/"
  },
  "theme": "green",
  "align": "centered",
  "layoutPreset": "compact"
}
```

### `logoBarBlock` with marquee display

```json
{
  "_type": "logoBarBlock",
  "_key": "logo-bar-extended-1",
  "heading": "Built around the tools marketing teams already use",
  "displayMode": "marquee",
  "theme": "muted",
  "density": "compact",
  "logos": [
    {
      "_key": "logo-1",
      "name": "Platform placeholder",
      "videoUrl": "https://placehold.co/320x160?text=Image+goes+here+-+320x160",
      "imageAlt": "Image goes here - replace with a platform logo, 320x160."
    }
  ]
}
```
