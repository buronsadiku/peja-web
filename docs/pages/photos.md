# Photos

The Photos page displays all photos uploaded by guests (via QR code flow) and by the couple. Users can browse, search, select in bulk, download, favourite, and add photos to their Gold Book.

Route: `/app/photos`

---

## Toolbar

Displays at the top of the page with summary stats and actions.

**Content:**
- Title: "{count} photographs. {X} faces." — the second part styled in italic and accent color
- Subtitle stats: "From {date range} · {X} paired with messages · {X} unmatched"
- Search input with magnifying glass icon and Cmd+K shortcut indicator
- Sort button (desktop only)
- "Upload photos" button with upload icon

**Search behavior:**
- Filters photos in **real-time** as user types
- Searches by **guest name** only

**Sort options:**
- By event phase (default — groups photos by auto-detected event moments)
- Newest first
- Oldest first

**"Upload photos" button:**
- Opens file picker for the couple to upload images directly
- Both the couple and guests can upload photos (guests upload via QR code flow)

---

## Photo Grid

A responsive masonry-style grid of photo tiles.

**Layout:**
- 2 columns on mobile
- 3 columns on tablet
- 4 columns on desktop and larger

**Content:**
- Photos displayed as tiles with varying heights (masonry layout)
- Photos are sorted by selected sort order
- No day/time group headers — photos grouped by auto-detected event phases when sorted by phase

**Empty state:**
- If no photos have been uploaded yet, an empty state illustration/message is shown

---

## Photo Tile

Each tile displays a single photo.

**Content:**
- The actual photo filling the tile (replaces placeholder monograms)
- Guest name and time (bottom of tile, white text with drop shadow)
- Favourite indicator — heart icon at top-right if favourited
- Select checkbox — circular indicator at top-left (visible in select mode)

**Tapping a tile (not in select mode):**
- Navigates to `/app/photos/:id` — the full-screen photo detail page
- This applies on **all screen sizes** including large-desktop

**Tapping a tile (in select mode):**
- Toggles selection state
- Selected tiles show a ring border and checkbox filled with accent color

**Hover:**
- Slight scale up (1.02) with enhanced shadow

---

## Full-Screen Photo Detail Page

Opens when user taps a photo tile. Shows the photo in full screen with a carousel for browsing all event photos.

Route: `/app/photos/:id`

**Content:**
- Photo displayed full screen
- **Carousel navigation** — all event photos are swipeable/navigable (not just photos from same guest)
- Navigation arrows (left/right) to move between photos
- Action buttons:
  - Download
  - Favourite / Unfavourite
  - Use in Gold Book

**Photo metadata:**
- Resolution (e.g., "4032 x 3024")
- File size (e.g., "3.2 MB")
- Uploaded by {guest name or couple name} — shows who uploaded the photo

---

## Select Mode

Allows users to select multiple photos for batch operations.

**Toggle:**
- A "Select" button above the grid
- Tapping enters **select mode** — button changes to "Cancel ({count})"
- Tapping "Cancel" exits select mode and clears all selections

**In select mode:**
- Tapping a photo tile **toggles its selection** (does not navigate to detail page)
- Selected tiles show a **ring border** and filled checkbox at top-left

---

## Batch Action Bar

Appears when in select mode with at least one photo selected. Hidden when no photos are selected.

**Content:**
- Checkmark icon
- "{X} photos selected · of {total}"
- Action buttons:
  - **Download** — downloads selected photos
  - **Favourite** — marks all selected photos as favourited
  - **Use in Gold Book** — adds all selected photos to the Gold Book

---

## Storage

Displayed somewhere accessible on the page (e.g., in a sidebar on large-desktop or as a subtle indicator).

**Content:**
- Storage used vs. plan limit (e.g., "1.2 / 5 GB")
- Visual progress bar showing usage

**Behavior:**
- When storage limit is reached, **uploads are blocked**
- A message or prompt indicates the limit has been reached

---

## Upload

**Who can upload:**
- **Guests** — upload photos through the QR code flow
- **Couple** — upload photos via the "Upload photos" button on this page

**Accepted content:**
- Image files (standard formats: JPG, PNG, HEIC, etc.)
