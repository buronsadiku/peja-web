# Guests

The Guests page shows all guests who have registered by scanning the event QR code and contributing (leaving a message, photo, or both). There is no manual guest management — guests appear only after they interact via the QR code flow.

Route: `/app/guests`

---

## Hero Section

A header introducing the guests overview.

**Content:**
- Title: "Your {count} guests, all in one place" — count is dynamic
- Subtitle explaining that guests are tracked automatically

**No action buttons** — guests are not manually added, imported, or invited from this page.
**No ContributionRing** — not needed since all listed guests have already contributed.

---

## Stats Bar

A row of stat cards showing key guest metrics.

**Stats displayed:**

| Stat | Example | Description |
|------|---------|-------------|
| Total guests | 112 | All registered guests |
| With photo | 63 | Guests who uploaded a photo |
| Thank-yous owed | 47 | Guests who haven't received a thank-you yet |

**Layout:**
- 2 columns on mobile
- 3 columns on tablet and larger

**Behavior:**
- Stats are display only, not clickable

---

## Filter Chips

A horizontal row of filter chips above the directory.

**Filters:**
- All guests (default)
- With photo
- No email yet
- Favourited by you
- Thank-you owed

**Sort button** (right-aligned):
- Most recent first (default)
- Oldest first
- A–Z by name
- Z–A by name

**Behavior:**
- Tapping a chip filters the guest directory table immediately
- Active chip is visually highlighted
- Only one filter active at a time

---

## Guest Directory

The main table listing all guests with their details.

**Header controls:**
- "Directory" title with "showing {count}" subtext
- "Export CSV" button — exports all guests as a list with names, email, and any contact info available

**Table columns:**

| Column | Content |
|--------|---------|
| Checkbox | For batch selection |
| Guest | Avatar + name + relation. Heart icon if favourited |
| Group · Table | Guest group name and table assignment |
| Contact | Email, phone, or other contact. Icon changes based on type (mail, phone, link) |
| Status | Status pill (see below) |
| Activity | Message count + photo icon if guest has photo |
| Menu | Three-dot menu for row actions |

**Status pills:**
- **Contributed · Thanked** — green pill with check icon. Guest contributed and thank-you has been sent
- **Contributed** — primary color pill with mic icon. Guest contributed but no thank-you sent yet

**Pagination:**
- 10 guests per page
- Shows "Showing {X} of {total}"
- Page number buttons with current page highlighted

---

### Guest Row Interactions

**Tapping the row** (anywhere except checkbox and menu):
- Navigates to guest detail page at `/app/guests/:id`
- (Guest detail page documented separately)

**Checkbox:**
- Selects the guest for batch actions
- When one or more guests are selected, batch action options appear:
  - **Export** — export selected guests' data
  - **Favourite** — mark selected guests as favourited

**Three-dot menu:**
- **Export** — export this guest's data
- **Favourite** / **Unfavourite** — toggle favourite status

---

## Guest Groups Strip

A section showing guest groups with contribution counts.

**Content:**
- "Groups" heading with "Edit groups" link
- "Edit groups" navigates to `/app/guests/groups` (group management page)
- Grid of group cards

**Layout:**
- 2 columns on mobile
- 3 columns on tablet
- 6 columns on desktop

**Each group card shows:**
- Avatar with first letter of group name
- Group name (e.g., "Lena's family")
- "{X} of {Y} recorded" subtitle
- Overlapping avatar stack of group members (max 5 visible, "+N more" for the rest)

**Tapping a group card:**
- Filters the guest directory to show only guests from that group

---

## Thank-You Card

A call-to-action card prompting the user to send thank-you notes.

**Content:**
- "Thank-you notes" label
- Title: "{count} guests are waiting for a thank-you."
- Description about pre-addressed postcards with guest's photo and quote
- "Review the batch" button — navigates to `/app/thank-you` (preview and edit thank-you cards)
- Price info: "€39 for {count} cards · ships in 1–2 weeks"

**Visibility:**
- Shown when there are guests who haven't received a thank-you yet
- Hidden when all guests have been thanked

---

## Empty State

If no guests have registered yet (no one has scanned the QR code), an empty state is shown.

**Key context:** Guests are not invited or added manually. They only appear after scanning the event QR code and contributing content.

---

## What Is NOT on This Page

- No "Add a guest" button — guests self-register via QR code
- No "Import CSV" button
- No "Copy invite link" button
- No nudge card / nudge functionality
- No ContributionRing
- No "Contributed" or "Still to hear" filters
- No "Declined" stat
- No "Group: all" or "Table: any" dropdown filters
