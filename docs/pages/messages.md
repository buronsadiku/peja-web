# Messages

The Messages page shows all voice messages, photos, and notes left by guests. Users can listen, search, filter, select in bulk, export, and manage their Gold Book from here.

Route: `/app/messages`

---

## Toolbar

Displays at the top of the page with summary stats and actions.

**Content:**
- Title: "{count} messages. {total duration} of love." — the duration part is styled in italic and accent color
- Subtitle stats: "From {X} guests · {X} with photos · {X} favourited · last received {time ago}"
- Search input with magnifying glass icon and Cmd+K shortcut indicator
- "Newest first" sort button (desktop only)
- "Export all" button with download icon

**Search behavior:**
- Filters messages **in real-time** as user types
- Searches across guest name, relation, quote, and transcript

**Sort options:**
- Newest first (default)
- Oldest first

**"Export all" behavior:**
- Tapping opens a **confirmation modal** first
- If confirmed, generates a **single ZIP file** containing:
  - One folder per message, named after the guest (e.g., "Margot Devreese")
  - Inside each folder:
    - The audio file (.mp3) — if the message has audio
    - The image file — if the message has a photo
    - A text file (.txt) with the note/transcript

---

## Filter Chips

A row of filter chips below the toolbar (visible on large-desktop in the toolbar area, on smaller screens below it).

**Available filters:**
- All (default)
- Favourites
- Added to Gold Book
- (More filters TBD)

**Behavior:**
- Tapping a filter chip activates it — list updates immediately
- Active chip is visually highlighted
- Tapping the active chip or "All" resets to show all messages
- There is **no** "+ Add filter" option

---

## Message List

A scrollable list of all messages, displayed as rows.

**Content:**
- A flat list of message rows — **no day/time group headers**
- Messages sorted by selected sort order

**Empty state:**
- If there are **no messages at all**, an empty state illustration/message is shown

---

## Select Mode

Allows users to select multiple messages for batch operations.

**Toggle:**
- A "Select" button above the message list
- Tapping it enters **select mode** — button changes to "Cancel ({count})"
- Tapping "Cancel" exits select mode and clears all selections

**In select mode:**
- Tapping a message row **toggles its selection** (does not open detail pane)
- Selected rows show a **left border highlight** and tinted background
- A "Clear all" button appears when at least one message is selected

---

## Batch Action Bar

Appears at the bottom/top when in select mode with at least one message selected. Hidden when no messages are selected.

**Content:**
- Checkmark icon
- "{X} selected · {combined duration} combined"
- Action buttons:
  - **Favourite** — marks all selected messages as favourited
  - **Download** — exports selected messages as a ZIP (same folder structure as "Export all", but only for selected messages)
  - **Add to Gold Book** — adds all selected messages to the Gold Book

---

## Message Row

Each row represents a single guest message.

**Content:**
- Avatar with guest's initials and tint color (slight rotation alternating between rows)
- Guest name (bold) with inline badges:
  - Heart icon — if favourited
  - Image icon — if message has a photo
- Guest relation (muted text)
- Quote text in serif italic with quotation marks
- Waveform visualization (visible on tablet and larger)
- Duration text (visible on tablet and larger)
- Play button

**Tapping the row (anywhere except play button):**
- On **large-desktop and small-desktop**: sets this message as active in the **detail pane** (no navigation)
- On **smaller screens (tablet and below)**: navigates to `/app/messages/:id` (separate page)

**Tapping the play button:**
- Plays audio **inline** on all screen sizes — does not navigate
- Single active player rule applies (stops any other playing audio)
- Playing state: button becomes pause icon with accent background and glow shadow

**Play button on tablet and larger:**
- Standard play/pause button with waveform visualization next to it
- Waveform bars fill with color from left to right as audio progresses

**Play button on mobile (phone):**
- No waveform bars shown
- Play button has a **circular ring border** acting as progress indicator
- Ring **fills clockwise from the top** as audio plays
- When playing: play icon becomes **pause icon**
- Below the button: time indicator `{elapsed} / {total}` (e.g., "13s / 1m 32s")

**Selected state (in select mode):**
- Left border: 3px accent color
- Background: subtle accent tint
- Tapping toggles selection instead of opening detail

---

## Message Detail Pane

A side panel showing full details of the selected message. Visible on **small-desktop and larger** screens.

**Sections:**

### 1. Header Card
- Large avatar (72px) with initials, tint color, slight rotation
- Guest name and relation
- Metadata: event moment · time · timezone · duration
- Three-dot menu button

**Three-dot menu options:**
- Add to favourites / Remove from favourites
- Add to Gold Book
- Download (individual message export — same folder structure: audio + image + text file)

### 2. Audio Player
- Play/pause button (accent color when playing, with shadow glow)
- Waveform visualization with progress fill
- Time display: `{elapsed} / {total}` in monospace font
- Same single active player rules as dashboard

### 3. Pulled Quote
- A card with warm/gold background
- "Pulled quote" label
- The guest's note displayed in serif italic with quotation marks
- This is the note the guest left — **not editable** by the user

### 4. Transcript
- "Transcript" label
- First ~230 characters of the auto-generated transcript with ellipsis if longer
- "Expand" button — **expands the transcript inline** to show full text
- Confidence score is **not shown**

### 5. Action Buttons
A row of action buttons:
- **Add to Gold Book** — primary styled button
- **Download** — exports this individual message (audio + image + text file)
- **Favourite** / **Favourited** — toggles favourite state, heart icon fills when favourited
- **View full message** — navigates to `/app/messages/:id` (the full page view)

### 6. No metadata footer
- Play count and "book-worthy" indicators are **not shown**

---

## Audio Playback Rules (Global)

Same rules as the Dashboard:

1. **Single active player** — only one audio plays at a time. Starting new audio stops the current one. This applies across the message list and the detail pane.
2. **Playback tracking** — the system remembers where the user paused/stopped for each message.
3. **No auto-advance** — when audio finishes, playback stops. Does not play next message automatically.
