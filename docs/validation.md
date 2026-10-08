# Validation record

Verified on 6 October 2026.

- 21 automated tests passed across cart rules, repositories, checkout validation and application interactions.
- Strict TypeScript checking, ESLint, Prettier verification and the production build passed.
- Browser layouts inspected at 390 × 844 (mobile), 768 × 1024 (tablet), and 1440 × 1000 (desktop). Checked document widths; no horizontal overflow was observed on the inspected pages.
- Verified food photography loaded, food options and quantities changed totals, persisted cart survived reload, and different restaurant orders appeared as independent sections with separate delivery fees.
- Verified required-field validation, invalid phone input, delivery/pickup switching, successful demo checkout, distinct restaurant confirmation references and clearing the cart after success.
- Keyboard focus moved from the page heading to the next action with a visible blue outline. Form labels, radio groups, landmark structure, skip navigation and live feedback were inspected through browser accessibility state.
- Shared colour-token contrast ratios: primary button 5.48:1; body text 13.56:1; secondary text 4.87:1; success 6.22:1; warning 5.83:1; error 6.06:1. These representative text pairs exceed 4.5:1.

Browser testing found and corrected an HTML phone-pattern incompatibility with Unicode-set regular expressions. Regression tests also cover repeated option edits and normalised persisted cart keys, ensuring saved items remain independently editable and removable.

No real backend, payment, authentication, fulfillment or restaurant submission was tested. Accessibility checks are targeted checks, not a formal WCAG audit or a complete screen-reader/device compatibility assessment.
