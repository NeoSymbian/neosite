#!/bin/sh
# SPDX-License-Identifier: Apache-2.0
# Refresh img/screens/ from neoui's snapshot tests (NeoSymbian/neoui snapshots/) and NEOPHONE's (NeoSymbian/phone
# snapshots/: Phone, Contacts, Messages), shrunk to 540 px wide.
# macOS (sips). Usage: tools/sync-screens.sh [neoui checkout, default ../neoui] [phone checkout, default ../phone]
set -eu
src="${1:-../neoui}/snapshots"
dst="$(dirname "$0")/../img/screens"
[ -d "$src" ] || { echo "no snapshots at $src" >&2; exit 1; }
mkdir -p "$dst"
# Full-size frames (1080x2160): shrink. Half-size ones (539x1079) are copied as they are.
for n in home settings settings-wifi-connected terminal clock browser-page shade; do
  sips -s format png --resampleWidth 540 "$src/$n-pixel.png" --out "$dst/$n.png" >/dev/null
done
for n in keyboard-en keyboard-hy keyboard-ru switcher; do
  cp "$src/$n-539x1079.png" "$dst/$n.png"
done
# NEOPHONE draws the app area only (1080x1902, between the status bar and the toolbar): padded to 1:2 with black
phone="${2:-../phone}/snapshots"
for pair in phone-call:call-active phone-log:phone-recents contacts:contacts-list messages-thread:messages-thread; do
  sips -s format png --padToHeightWidth 2160 1080 --padColor 000000 "$phone/${pair#*:}.png" --out "$dst/${pair%%:*}.png" >/dev/null
  sips --resampleWidth 540 "$dst/${pair%%:*}.png" >/dev/null
done
echo "updated $(ls "$dst" | wc -l | tr -d ' ') screens in $dst"
