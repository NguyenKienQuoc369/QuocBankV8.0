# Task: Fix "Phát hành thẻ ảo" button not working on Vercel

Status: In Progress

## Information Gathered
- Button in app/dashboard/card/page.tsx has no handler (non-functional).
- Server actions exist in app/actions/card.ts but no issue/creation action is exposed for the button.
- Cookie mismatch: app/actions/card.ts reads 'session_token' while lib/auth.ts writes 'session'. This breaks auth-dependent actions in production.
- Prisma Card fields: cardNumber, expiryDate, cvv, type, isLocked; no balance field (balance is on Account).
- CardControlStation uses incorrect props (number, brand, expiry, balance) and should map to card.cardNumber, card.type, card.expiryDate, card.account.balance.

## Plan
1. Create API route POST /api/cards/issue to issue a virtual card.
   - Verify user via cookie 'session' (or getSession()).
   - Find user account (first Account by userId).
   - Create new Card with generateCardNumber(), generateCVV(), expiryDate (computed MM/YY), type 'PLATINUM'.
   - Return JSON { success, message }.
2. Add client button component components/dashboard/IssueVirtualCardButton.tsx
   - On click, call fetch('/api/cards/issue', { method: 'POST' }).
   - Handle loading/error, and call router.refresh() on success.
3. Wire the button into app/dashboard/card/page.tsx, replacing the static button.
4. Fix cookie name in app/actions/card.ts to 'session' for getMyCards and toggleCardLock.
5. Update components/dashboard/CardControlStation.tsx fields to align with Prisma schema.

## Steps and Progress
- [x] Create API route: app/api/cards/issue/route.ts
- [x] Create client button: components/dashboard/IssueVirtualCardButton.tsx
- [x] Wire button into app/dashboard/card/page.tsx
- [x] Fix cookie mismatch in app/actions/card.ts ('session' instead of 'session_token')
- [x] Update CardControlStation fields (cardNumber, expiryDate, type, account.balance)
- [ ] Manual testing on local/Vercel:
  - [ ] Login and navigate to /dashboard/card
  - [ ] Click "Phát hành thẻ ảo" and verify card appears
  - [ ] Toggle lock still works

## Notes
- Ensure environment variables on Vercel:
  - DATABASE_URL
  - JWT_SECRET
- Revalidation: client will use router.refresh(); API route may optionally revalidate server paths if needed.
