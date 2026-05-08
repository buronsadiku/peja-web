# Dashboard

The Dashboard is the main landing page after login. It gives the user a quick overview of their event: a personalized greeting, listening progress, key stats, recent messages, and a nudge to complete their Gold Book.

Route: `/app`

---

## Greeting

Displays a personalized greeting at the top of the page.

**Content:**
- Event date and venue name (e.g., "14 June 2026 · Mas de la Calma")
- Greeting based on the user's local time:
  - **5:00 AM – 11:59 AM** → "Good morning, {name}"
  - **12:00 PM – 4:59 PM** → "Good afternoon, {name}"
  - **5:00 PM – 8:59 PM** → "Good evening, {name}"
  - **9:00 PM – 4:59 AM** → "Good night, {name}"
- The name comes from the user profile or the venue data (partner 1 / partner 2 names — TBD which source)
- Below the greeting, a message: "You have {count} new voice messages waiting. Want to keep listening?"

**Conditional behavior:**
- If there are **no new (unlistened) messages**, the "You have X new voice messages" text is **hidden entirely**

---

## Resume Card

Allows the user to continue listening to a voice message where they left off.

**Content:**
- Avatar with the speaker's initials
- Speaker name and role (e.g., "Margot Devreese · Maid of honour")
- Progress text: "Paused at {current time} of {total time}"
- "Continue listening" button

**Behavior:**
- The card shows the **first voice message that has not been fully listened to**
- The system tracks playback progress per message so the user can resume from the exact point
- Tapping "Continue listening" **plays the audio inline** — no navigation, no new page
- When the audio **finishes playing, it stops** — it does not auto-advance to the next message
- If another audio is already playing anywhere on the dashboard (e.g., from a message row), that audio **stops** and this one starts (single active player)

**Visibility:**
- The card is **hidden** if the user has never started playing any audio (no resume state exists)
- The card is **hidden** if all messages have been fully listened to

---

## Stats Line

A row of 4 key statistics about the event's messages.

**Content:**
- Messages count (e.g., "87")
- Photos count (e.g., "64")
- Total voice duration (e.g., "1h 42m")
- Favourites count (e.g., "14")

**Behavior:**
- Stats are **not clickable** — display only
- If there are no messages/content at all, each stat shows **"0"**

---

## Message List

Shows the 5 most recent messages with playback controls.

**Content:**
- Section heading: "New messages"
- Link: "See all {count}" — navigates to `/app/messages`
- A list of up to **5 message rows**, always the **latest 5 messages** (not filtered by listened/unlistened)

**Empty state:**
- If there are **no messages at all**, an empty state is shown (instead of hiding the section)

---

### Message Row

Each row represents a single voice message.

**Content:**
- Avatar with speaker's initials
- Speaker name and role (e.g., "Margot Devreese · Maid of honour")
- A short quote from the message in italics
- Play button
- Waveform visualization (tablet and larger screens only)

**Behavior — tapping the row (anywhere except the play button):**
- Navigates to the **message detail page** at `/app/messages/:id`

**Behavior — tapping the play button:**
- Plays the audio **inline** — does not navigate away
- If another audio is already playing (from another row or the Resume Card), it **stops** and the new one starts (single active player)
- The waveform **animates** as the audio plays, showing progress with color fill

**Play button on tablet and larger screens:**
- A standard play/pause button with the waveform visualization next to it
- Waveform bars fill with color from left to right as audio progresses

**Play button on mobile (phone):**
- No waveform bars are shown
- Instead, the play button has a **circular ring border** that acts as a progress indicator
- The ring **fills clockwise from the top** as the audio plays
- When playing, the play icon becomes a **pause icon**
- Below the pause button, a time indicator appears: `{elapsed} / {total}` (e.g., "13s / 1m 32s")

---

## Nudge Card

Prompts the user to complete their Gold Book.

**Content:**
- Accent icon (✦)
- Title: "Your Gold Book is {percent}% ready"
- Description: "{count} more quotes to approve before it goes to press."
- "Open editor" button — navigates to `/app/gold-book`

**Visibility:**
- The card is **only visible** when the Gold Book has pending items to complete
- The card **hides** when the user has completed the Gold Book **and** finished the payment

---

## Mobile Header

Visible only on mobile devices. Appears at the top of the page above all dashboard content.

**Content:**
- Logo (left side)
- Hamburger menu button (right side)

**Behavior:**
- Tapping the **hamburger button** opens the **sidebar navigation** as an overlay on top of all content
- The sidebar covers the full screen and contains the same navigation as the desktop sidebar

---

## Audio Playback Rules (Global)

These rules apply across all audio-playing components on the dashboard:

1. **Single active player** — only one audio can play at a time across the entire dashboard. Starting a new audio stops the currently playing one.
2. **Playback tracking** — the system remembers where the user paused/stopped for each message, so they can resume later.
3. **No auto-advance** — when an audio finishes, playback stops. It does not automatically play the next message.
