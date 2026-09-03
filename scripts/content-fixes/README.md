# One-off content fixes

Scripts here repair a specific Sanity document whose content was damaged by a
paste from Word/Google Docs. They are not part of the build — they exist so a
content repair is reviewable, reproducible, and applies identically to
`staging` and `production`.

## closing-the-loop

`/insights/closing-the-loop-how-conversion-apis-and-value-based-bidding-transform-performance-marketing/`

The pasted body carried these artefacts:

- newline-only spans that rendered as runs of `<br>` and empty `<p>` blocks
- a leading `"\n \n\n "` inside the first item of every bullet list
- several paragraphs collapsed into one block, separated by `\n` (i.e. `<br>`)
  instead of being real paragraphs
- the funnel-value table flattened into one unreadable line
  (`Conversion StageDefinitionAssigned Proxy ValueRaw LeadName/Email...`)
- section numbers out of order (`2.` appeared before `1.`)
- headings at `h4`/`h3`/`h5`, where every other post uses `h2` for sections and
  `h3` for subsections, so the page jumped `h1` → `h4`
- two sentences ending in a colon orphaned at the end of the Value-Based Bidding
  paragraph, with the Scenario A/B examples they introduce sitting two headings
  further down

Prose is unchanged word for word. The only copy-level edits are the section
renumbering, the table rows being made readable, and moving those two orphaned
sentences under "Option 2", where their trailing colon leads into the examples.

```sh
node scripts/content-fixes/build-closing-the-loop-body.mjs        # regenerate JSON
SANITY_WRITE_TOKEN=... node scripts/content-fixes/apply-closing-the-loop-body.mjs --dataset staging
SANITY_WRITE_TOKEN=... node scripts/content-fixes/apply-closing-the-loop-body.mjs --dataset production
```
