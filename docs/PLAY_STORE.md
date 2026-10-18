# Google Play compliance

TaraCSE Mobile ships to the Google Play Store. These rules bind every screen, every
string, and the store listing. They come from §5 of the approved design spec
(`docs/superpowers/specs/2026-10-18-taracse-mobile-ui-design.md`).

Accounts are shared with the TaraCSE website. **All payments and plan changes happen on
the website only.** The app shows whatever plan the account already has and never sells,
prices, or points to a way to buy anything.

## 1. Payments and anti-steering

Google Play's Payments policy says apps may not lead users to a payment method other
than Google Play's billing system, and it covers in-app buttons, links, messaging,
promotions, webviews and account flows. Region programs that allow linking out (for
example the US external content links program) need enrollment and do not cover the
Philippine audience by default. This app uses none of them.

1. **No purchase surface.** No upgrade, pricing, checkout, promo-code, payment-proof or
   QR screens. The web app's `/dashboard/upgrade` and `/pricing` have no mobile
   counterpart. Payment QR images from the web repo are never copied into this repo.
2. **No steering.** No text, button, link, banner, toast, push copy or email-style
   prompt that mentions buying, upgrading, prices, or "go to the website" in any form.
   This includes Home nudges, empty states, locked-feature states, KOT messages, and the
   Terms and Privacy text.
3. **Plan is shown, not sold.** The profile badge and the Plan screen state the current
   plan ("Free" or "Premium") as a fact, plus what it includes and, for Premium, the
   renewal or expiry date. No buttons, links, prices or instructions about getting
   another plan.
4. **Premium-only features on a free account** show the item with a lock icon and the
   neutral line **"Not included in your current plan."** Tapping it opens a small sheet
   with the same line and a **"Got it"** button. No call to action. Applies to mock exams
   beyond the free allowance, advanced analytics and the full question bank. Use the
   `LockedItem` primitive; never hand-roll this.
5. **Copy review gate.** Before any release (and in Phase 6), search all user-facing
   strings and review every hit:

   ```bash
   grep -rniE "upgrade|buy|subscribe|price|₱|\bpay|website|taracse\.com|promo|premium" src/ --include=*.ts --include=*.tsx
   ```

   `premium` is allowed only as the name of a plan stated as fact, never as a verb or CTA.

6. **Store listing** (title, short and full description, screenshots, feature graphic)
   must not mention web purchase, prices or upgrades either.

## 2. Account deletion

Play requires apps that let users create accounts to let them request deletion inside
the app **and** through a web link declared in the Data safety form.

- In app: Profile → Delete account. Explains what is deleted, requires typing a
  confirmation word, a final destructive confirm, then a "Your account is scheduled for
  deletion" state and sign-out.
- Web link: **later task in the web repo** (`C:\TaraCSE`). A public page where a user can
  request deletion without the app. Its URL goes in the Data safety form.

## 3. AI-generated content

AI explanations are generative content. Play's AI-generated content policy expects users
to be able to report or flag offensive output without leaving the app.

- The explanation sheet in a practice session has **"Report this explanation"** → reason
  chips (Incorrect, Offensive, Confusing, Other) + optional note → sent state.

## 4. Listing prerequisites (for submission later)

- Privacy policy URL (public, served by the website). The app reads it from
  `EXPO_PUBLIC_PRIVACY_POLICY_URL`.
- Data safety answers. Today the app collects nothing; update when auth and analytics land.
- Content rating questionnaire.
- Target audience: adults; not designed for children.
- Target API level that meets the current Play requirement at submission time.
- Adaptive icon, monochrome icon, feature graphic, phone screenshots.
- Android permissions: none requested this phase; see `blockedPermissions` in
  `app.config.ts`.
- The account deletion web URL (section 2).
- Steering rules above applied to the listing text.

## Sources

- Google Play Payments policy: https://support.google.com/googleplay/android-developer/answer/9858738
- External content links program (US): https://support.google.com/googleplay/android-developer/answer/16470497
- RevenueCat, app-to-web purchase guidelines: https://www.revenuecat.com/blog/engineering/app-to-web-purchase-guidelines

Policies change. Re-read the live Payments, Account deletion and AI-generated content
policies before every submission.
