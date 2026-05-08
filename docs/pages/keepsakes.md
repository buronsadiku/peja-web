# Keepsakes

The Keepsakes page is a marketplace where users can turn their event's voice messages and photos into physical and digital products. It features a hero section, a featured product (Gold Book), product grid, bundle offer, and an orders summary.

Route: `/app/keepsakes`

---

## Hero Section

Introduces the keepsake studio at the top of the page.

**Content:**
- Eyebrow label: "The keepsake studio"
- Heading: "Turn {message count} voices into something you can hold" — dynamic based on actual message count
- Description text referencing the user's actual message and photo counts

**Behavior:**
- Text is always dynamic — reflects real data even if the user has 0 messages or photos
- Page is still accessible and fully visible even with 0 content

---

## Featured Product — Gold Book

A large, prominent card highlighting the Gold Book as the premium product.

**Content:**
- Gold gradient background
- "Most ordered" label with star icon
- Product name: "Gold Book"
- Price: €389
- Description: 112-page hand-bound book
- Feature highlights: "QR codes per quote" functionality
- 3 feature pills: "112 pages", "QR per quote", "Linen · gold foil"
- "Open editor" button — navigates to `/app/gold-book` (same editor as dashboard nudge card)
- Shipping info: "Ships in 2-3 weeks · Free EU delivery"
- 3D book mockup on desktop (hidden on smaller screens)

---

## Orders Rail

A sidebar widget showing the user's recent orders. Visible on desktop.

**Content:**
- "Your orders" heading with cart icon
- "See all" link — navigates to `/app/orders` (separate orders page, documented separately)
- Up to 3 recent order items, each showing:
  - Product title
  - Current status
  - Progress bar with percentage

**Order stages:**
- Processing → In production → Shipping → Delivered
- Progress bar reflects which stage the order is at

**Empty state:**
- If user has no orders, an empty state is shown

**Re-ordering:**
- Users can re-order any product, including completed ones — not limited to one-time purchase

---

## Bundle Banner

A promotional banner offering a discounted product bundle.

**Content:**
- Gift icon
- Bundle name and contents (dynamic — not fixed to specific products)
- Savings amount (e.g., "Save €47")
- "Add bundle" button

**Behavior:**
- Tapping "Add bundle" **adds the bundle to the cart**
- Bundle composition is dynamic — can change based on available products/promotions

---

## Filter Tabs

A horizontal row of filter tabs above the product grid.

**Filters:**
- All (default)
- Printed
- Digital
- Physical
- Gifts

**Behavior:**
- Tapping a tab **filters the product grid** to show only matching products
- Active tab is visually highlighted (filled background)
- "All" shows every product

---

## Product Grid

A responsive grid of product cards.

**Layout:**
- 1 column on mobile
- 2 columns on tablet
- 3 columns on desktop and larger

**Products (examples):**

| Product | Price | Type | Shipping |
|---------|-------|------|----------|
| Highlight Reel | €89 | Digital | 3-min video |
| Audio Vinyl | €129 | Physical | 12" pressed vinyl record |
| Digital Album | €29 | Digital | Shareable link |
| Thank-You Cards | €49 | Physical | Set of 50 with guest photos |
| Voice Canvas | €69 | Physical | Framed print with quote |

**Each product card shows:**
- Colored gradient header with product visual/headline
- Product name and price (€)
- Subtitle: type + shipping time (e.g., "Digital · Ships in 5 days")
- Short tagline/description
- Two buttons:
  - **"Customise"** — navigates to the product's own customisation page (see below)
  - **"Preview"** — opens a **preview modal** showing a mockup of the product with the user's actual content (messages, photos, quotes)

**Shipping times:**
- Displayed per product — static estimate per product type (not dynamically calculated)

---

## Product Customisation Pages

Each product has its own dedicated customisation page where users can configure the product before adding to cart.

**Routes:**
- `/app/keepsakes/highlight-reel`
- `/app/keepsakes/audio-vinyl`
- `/app/keepsakes/digital-album`
- `/app/keepsakes/thank-you-cards`
- `/app/keepsakes/voice-canvas`

(Each product page will be documented separately)

---

## Preview Modal

Opens when user taps "Preview" on a product card.

**Content:**
- A mockup/preview showing what the product would look like using the user's actual event content (their messages, photos, quotes)
- Not a generic product image — personalized to the user's data

---

## Cart & Checkout

**Header integration:**
- Cart button in the header showing item count (e.g., "Cart · 2")

**Cart/checkout flow:**
- Will be a full checkout page in the future (not yet implemented)
- Adding bundle or individual products adds them to cart

---

## Header — Keepsakes-Specific

When on the keepsakes page, the header shows keepsakes-specific actions:

**Content:**
- Cart button with item count

(No credit display — removed)

---

## What Is NOT Shown

- No testimonials section on this page
- No "Carbon-neutral, printed in Portugal" footer
- No "€50 credit available" indicator
