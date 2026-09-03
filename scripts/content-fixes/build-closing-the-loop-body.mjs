// Rebuilds the Portable Text body for the "Closing the Loop" insight post.
//
// The original body was pasted in from a Word/Google Doc and carried the
// artefacts of that paste: stray newline-only spans (rendered as runs of
// <br>), leading "\n \n\n " inside the first item of every bullet list,
// multi-paragraph runs collapsed into single blocks, a table flattened into
// one unreadable line, out-of-order section numbers, and heading levels
// (h4/h3/h5) that don't match the h2/h3 convention every other post uses.
//
// Output is written to closing-the-loop-body.json and applied by
// apply-closing-the-loop-body.mjs.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

let keySeed = 0;
const key = () => `ctl${(++keySeed).toString(36).padStart(4, '0')}`;

const span = (text, marks = []) => ({ _key: key(), _type: 'span', marks, text });

const block = (style, children, extra = {}) => ({
  _key: key(),
  _type: 'block',
  children,
  markDefs: extra.markDefs || [],
  style,
  ...(extra.listItem ? { level: 1, listItem: extra.listItem } : {}),
});

const p = (...children) => block('normal', children);
const h2 = (text) => block('h2', [span(text)]);
const h3 = (text) => block('h3', [span(text)]);
const li = (...children) => block('normal', children, { listItem: 'bullet' });

// A funnel-stage row from the flattened table, rendered as a readable
// "stage — definition — value" bullet.
const stage = (name, definition, value) => li(span(name, ['strong']), span(` — ${definition} — ${value}`));

const activationLinkKey = 'link-ctl-data-activation';
const intro = block(
  'normal',
  [
    span('When stored, it is static. But '),
    span('when activated', [activationLinkKey]),
    span(
      ', it becomes the kinetic energy that fuels advertising performance. If you haven’t already, 2026 is the year to move beyond just collecting conversions. This article helps explain how to close the loop, and send the truth of what actually happened back to the ad platforms so algorithms can bid more intelligently.',
    ),
  ],
  { markDefs: [{ _key: activationLinkKey, _type: 'link', href: '/capabilities/data-activation/' }] },
);

const body = [
  p(span('Many businesses are sitting on a reservoir of unused potential: DATA.', ['strong'])),
  intro,

  h2('1. Why Revenue-Focused Businesses Move from Online Conversion Tracking (Pixels) to Conversion API (CAPI)'),
  p(span('Pixels = “Traffic” events.\nAPIs = “Truth” events.')),
  p(span('Pixels reliably capture lightweight, on-site behaviors like page views or basic lead submissions. But the events that truly matter (qualified leads, SQLs, revenue, LTV) rarely occur in a browser session. They happen offline, inside CRMs, on sales calls, or post-purchase.')),
  p(span('That’s why every major ad platform now prioritizes server-to-server (S2S) conversion APIs.')),

  h2('2. How does CAPI help improve signal capture?'),
  p(span('By creating a direct server-side connection to Meta’s ad optimization systems, the Conversion API improves the quality and reliability of conversion data, supporting more efficient ad delivery, stronger targeting signals, and clearer performance measurement across Meta technologies.')),
  p(span('Browser pixels were built for a world that no longer exists. Signal loss, iOS tracking restrictions, and privacy-driven platform changes have weakened them to the point where pixel-only setups are now traffic trackers, not truth tellers. CAPI is the bridge that repairs the feedback loop. CAPI is designed to:')),
  li(span('Serve as a parallel source to capture web events that the Pixel may lose due to connectivity or page loading errors')),
  li(span('Create a direct and more reliable connection between your offline events and Meta')),

  h3('Caveat: Event Deduplication is Critical'),
  p(
    span('Running Pixel + CAPI in parallel is powerful, but without deduplication, you’ll risk double counting conversions. That inflates CPA, misleads the platform, and degrades bidding performance. '),
    span('The fix is simple and universal:', ['strong']),
    span(' Generate a unique event_id at form submission.'),
  ),
  li(span('Browser Pixel: Sends event with event_id = abc123')),
  li(span('Server API: Sends event with the same event_id = abc123 (from your CRM)')),
  li(span('Platforms: Typically keep the first event received if no significant differences exist between them.')),
  p(span('This gives you the best of both worlds: real-time pixel reporting + high-quality server truth.')),

  h3('Google Ads — Offline Conversion Import (OCI)'),
  li(span('Mechanism: gRPC or REST API')),
  li(span('Required keys: gclid, conversion_name, conversion_time')),
  li(span('Time constraint: Upload within 90 days of the click')),
  li(span('Best practice: Daily uploads or more frequent so Smart Bidding can react to recent auction patterns')),

  h3('Meta (Facebook) Conversions API'),
  li(span('Mechanism: POST request to the Graph API')),
  li(span('Identifiers: fbp, fbc (if available), user agent, user IP address')),
  li(span('PII: Hashed personal data (name, email, phone) via SHA-256')),
  li(span('Event Match Quality (EMQ): Score from 1–10. To exceed 6, send at least three customer parameters (email, IP, user agent, etc.)')),
  p(span('Meta and Google don’t just prefer API events, they reward them with better match rates, more stable optimization, and more durable attribution.', ['strong'])),

  h2('3. Data Latency Can Impact Algorithmic Learning and Effectiveness'),
  p(span('Algorithms need to connect a conversion to the action that created it. Delay the signal too long, and the learning loop breaks. This is why manual uploads or propensity models with long delay times can negatively impact algorithm performance. We recommend providing downstream conversion data as close to real-time as feasible as a best practice.')),
  li(span('High velocity (e-commerce): Sync within 1 hour')),
  li(span('Low velocity (B2B, Lead Gen): Sync at least every 24 hours')),
  li(span('Critical rule: Delays beyond 48 hours materially reduce optimization accuracy')),

  p(span('Once your data pipeline is activated, the next phase isn’t technical, it’s strategic.')),
  p(span('Most advertisers still optimize for Cost Per Acquisition (CPA). But CPA only measures volume, not value. And for B2B or high-ticket lead generation, “Closed Deals” are too rare to give algorithms the 30–50 monthly conversions they need to learn effectively.')),
  p(
    span('The solution is Value-Based Bidding (VBB): powering tROAS with intelligently engineered proxy values. Using AI and conversion data, VBB optimizes ad spend toward the monetary value of conversions, not just the '),
    span('number', ['em']),
    span('. It prioritizes maximizing revenue and ROI by bidding higher for users likely to bring high-value transactions, rather than another conversion. It is the shift from quantity to quality, while telling the platforms what qualifies as a high-value action (ie, revenue, profit margins, CLTV, etc.).'),
  ),

  h2('Option 1: The Progressive Funnel Model (Milestone-Based Proxy Values)'),
  p(span('Instead of waiting for a deal to close, you assign values to key stages in your sales funnel.')),
  p(span('An example would look like:', ['strong'])),
  stage('Raw Lead', 'Name/Email submitted', '$10'),
  stage('MQL', 'Fits ICP (company size, geo, etc.)', '$50'),
  stage('SQL', 'Sales accepts meeting', '$350'),
  stage('Deal Created', 'Proposal sent', '$1,500'),
  stage('Closed Won', 'True revenue', '$10,000+'),
  p(
    span('Execution:', ['strong']),
    span(' Send these values through the value parameter in your CAPI payloads. Switch campaigns to bid to value instead of volume (tROAS, value bidding, etc)'),
  ),
  p(span('The AI will now prioritize leads that progress deeper down the funnel, not just the ones who filled out the form fastest.')),

  h2('Option 2: The Propensity Model (Real-Time Attribute Scoring)'),
  p(span('More advanced organizations score leads based on who the user is (job title, credit score), rather than what they’ve done. This helps the AI to distinguish between a low-value browser and a high-value prospect.')),
  p(span('Using tools like Clearbit, ZoomInfo, or internal enrichment:')),
  h3('Scenario A'),
  li(span('Email: janedoe@gmail.com')),
  li(span('Company: Freelancer')),
  li(span('Predicted Sale LTV: $5,000')),
  li(span('Lead Signal Sent: value = $20')),
  li(span('Outcome: Algorithm downweights this audience')),
  h3('Scenario B'),
  li(span('Email: jane@fortune500.com')),
  li(span('Title: VP of Engineering')),
  li(span('Predicted Sale LTV: $50,000')),
  li(span('Lead Signal Sent: value = $300')),
  li(span('Outcome: Algorithm aggressively bids for similar profiles')),
  p(span('This approach trains the system on what quality looks like at the moment the lead is created.')),

  h2('The Value Curve: Why This Works'),
  p(span('It teaches AI that not all leads are equal. As the AI learns which specific signals result in high proxy values, targeting becomes more advanced and quality of leads becomes more valuable. This allows your data pipeline to move from “more leads” to “better leads.”')),
  li(
    span('Bidding for Lead Volume (tCPA/Max Conversions)', ['strong']),
    span(': This strategy creates a “race to the bottom.” The algorithm is incentivized to find the cheapest possible leads regardless of quality. As you try to scale, the system scrapes the bottom of the barrel for low-intent users just to hit your cost target. The result is that volume goes up, but lead quality and ROAS goes down.'),
  ),
  li(
    span('Bidding for Value: Value-Based Bidding (tROAS/Max Conversion Value)', ['strong']),
    span(': This strategy teaches the algorithm to find your most valuable users. As you give the system more information, it goes out and hunts for more value. When you scale, ROAS remains high because the algorithm uses that increased volume to learn which signals correlate with high-value outcomes.'),
  ),

  block('h2', [span('Conclusion: '), span('Data Doesn’t Win. Activated Data Wins.', ['em'])]),
  p(span('If pixels were the start of performance marketing, CAPI is the upgrade that keeps it alive. But CAPI alone only closes the loop; value-based bidding transforms it.')),
  p(span('When you send richer, faster, more accurate truth back to the platforms, and pair it with engineered proxy values, you unlock a level of algorithmic performance that simply isn’t possible with legacy CPA models.')),
  p(span('This is the new playbook:', ['strong'])),
  p(span('Build the pipes → Deduplicate → Reduce latency → Train on value, not volume.')),
  p(span('If your ad platforms can’t see qualified leads or revenue, they can’t optimize for growth. Found helps organizations audit their first-party data, CRM integrations, and signal flow to uncover gaps holding revenue back.')),
];

const outPath = join(dirname(fileURLToPath(import.meta.url)), 'closing-the-loop-body.json');
writeFileSync(outPath, `${JSON.stringify(body, null, 2)}\n`);
console.log(`Wrote ${body.length} blocks to ${outPath}`);
