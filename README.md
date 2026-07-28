# AVR Link

A macOS **menu-bar app**, an **iOS companion app**, and an **Apple Watch app** that discover and
control telnet-enabled AVR receivers over their local-network control protocol (telnet on TCP 23).
Power/standby, volume, mute, input selection, and independent control of the Main / Zone 2 / Zone 3
speaker zones.

This is a clean-room implementation grounded in the vendor protocol specs.
All three apps are thin UI shells over a shared, headless-tested engine (`AVRLinkCore`).

> The Swift package lives in `avrKit/`: its pure, dependency-free protocol codec is the `AVRKit`
> module and the shared cross-platform app engine is `AVRLinkCore`. Everything else — the Xcode
> project, targets, schemes, and source directories — carries the **AVR Link** product name.

## Features

- **Discovery** — finds receivers via Bonjour (HEOS / AirPlay service types) and confirms each
  candidate by probing the control port, so only real AVRs appear. Manual IP entry is supported.
- **Bidirectional state** — the UI reflects the receiver's *actual* state, parsing unsolicited
  events and `?` query replies (including the current input per zone).
- **Custom source labels** — reads the receiver's own source configuration (`SSFUN` rename map +
  `SSSOD` enabled/hidden) so the input picker shows *your* names (e.g. "Apple TV", "XLR") and only
  the sources you keep. Falls back to the built-in list on receivers that don't report it.
- **Auto-reconnect** — exponential backoff (1→30 s, jittered) on dropped links and standby→wake,
  with fast retry when the network path returns.
- **Per-zone control** — power, mute, input picker, and a volume slider for Main / Zone 2 / Zone 3.
- **Sleep / auto-off timer** — set the receiver to power itself off after 5 / 15 / 30 / 60 / 120
  minutes (capped at the receiver's 120-minute `SLP` maximum), from a menu beside the power button in
  both apps. iOS surfaces the running countdown as a **Live Activity / Dynamic Island** — a
  self-ticking count-down to auto-off with Add-15-min / mute / Turn-Off controls, rendered on-device
  so it stays accurate with no background updates. macOS shows an equivalent **status card** above the
  zone cards with the same countdown and controls.
- **Menu-bar volume scrub (macOS)** — click-drag on the status-bar icon to scrub volume via a
  translucent, Control-Center-style slider HUD under the icon (the "liquid glass" look comes from an
  AppKit `NSVisualEffectView` desktop blur, not SwiftUI's `glassEffect`), respecting the configured
  volume limit.
- **Settings** — a dedicated Settings surface on the iOS and macOS apps (iOS: Settings sheet; macOS:
  the popover footer menu) with:
  - **Volume display scale** — show levels as the raw 0–98 wire number (**Absolute**) or as decibels
    (**Relative**, wire − 80). Display-only; never changes what's sent to the receiver.
  - **Per-zone maximum-volume limit** — an app-enforced ceiling per zone (the protocol has no
    hardware limit to set); the app clamps every send and lowers the receiver when a new, lower limit
    is applied.
  - **Hide/show zones** — hide zones you don't use from the main view (a global UI preference).
  - **Appearance** — System / Light / Dark, persisted per app.
- **iOS companion** — full parity as a touch remote, plus:
  - **Home-Screen widgets** — a compact status widget (small; headline state with interactive
    power / volume / mute buttons) and a medium per-zone control widget (power / input / volume / mute).
  - **Lock-Screen widgets** — an accessory widget (inline / circular / rectangular) to glance the
    receiver's state and, on the rectangular family, drive power / volume / mute.
  - **Single-action Lock-Screen widgets** — standalone volume-up, volume-down, and mute tiles
    (circular / rectangular), each targeting the main zone.
  - **Control Center controls** (iOS 18+): power toggle, mute toggle, volume-up, and volume-down.
  - **Siri & Shortcuts** via App Intents — whole-unit power/mute, per-zone power/mute, input
    cycling, and volume up/down/set.
  - **Volume-button remote** (opt-in, off by default) — the iPhone's physical volume side buttons
    adjust the receiver instead of the phone, targeting the most recently used zone (Main by default).
    The per-press step is configurable (0.5–5.0 on the 0–98 scale, default 2.0). It keeps an audio
    session alive with silent playback to capture the buttons (`.mixWithOthers`, so it won't pause
    your music) and re-centers the system volume after each press, so a press "into" a 0/1 rail —
    which iOS reports as no change — can't strand control at the limit. The decision logic lives in a
    pure, unit-tested `VolumeButtonInterpreter`; the AVFoundation wiring (`VolumeButtonMonitor`) has
    no Simulator behavior and is validated on device.
    - **Keep working in background** (Experimental) — optionally holds the connection and audio
      session open after the app leaves the foreground so the buttons keep working, for a chosen
      window (1 / 2 / 3 / 6 / 12 hours, or Never). Relies on background audio staying alive, so it's
      device-QA-gated and off by default.
  - Backgrounding frees the receiver's telnet session and foregrounding reconnects automatically —
    unless the volume-button background option above is holding the session open.
- **watchOS companion** — a wrist remote that **relays through the paired iPhone over
  WatchConnectivity** rather than talking to the receiver directly. watchOS blocks low-level
  networking (`NWBrowser`/`NWConnection`) for normal apps, so the **iPhone owns the receiver
  connection and LAN discovery**; the watch mirrors the phone's headline state and sends control
  intents back for the phone to execute. It offers whole-unit power plus per-zone power / mute /
  input and **Digital-Crown volume** (0.5 dB steps on Main, whole units on Zones 2/3).
  - The paired iPhone publishes its selected + known receivers and connection status to the watch,
    so the watch never has to rediscover or re-type an address. The watch **cannot browse the LAN
    itself**; adding a receiver by IP is relayed to the iPhone's probe.
  - Works whenever the iPhone app is running and reachable. When the phone app is backgrounded or
    out of range, the watch shows its last cached state but can't drive the receiver; commands
    issued meanwhile are queued for guaranteed delivery when the phone wakes.
  - **Watch-face complications** (WidgetKit, all accessory families — circular / corner / inline /
    rectangular) — a launcher, a live main-zone volume/power glance, and a live current-input glance,
    all marked with the same menu-bar receiver glyph. The live glances read the snapshot the watch
    app republishes into its App Group from the phone relay; the volume glance deep-links
    (`avrlink://volume`) straight into the app's Digital-Crown volume control.

## Requirements

- macOS 14.0+ / iOS 17.0+ / watchOS 10.0+ (deployment targets), built with Xcode 26 / Swift 5
  language mode. Control Center controls require iOS 18.
- The receiver must have **Network Standby = On** to accept commands while in standby.
