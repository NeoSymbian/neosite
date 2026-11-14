#!/bin/sh
# SPDX-License-Identifier: Apache-2.0
# Refresh img/screens/ from neoui's snapshot tests (NeoSymbian/neoui snapshots/), shrunk to 540 px wide.
# macOS (sips). Usage: tools/sync-screens.sh [path to the neoui checkout, default ../neoui]
set -eu
src="${1:-../neoui}/snapshots"
dst="$(dirname "$0")/../img/screens"
[ -d "$src" ] || { echo "no snapshots at $src" >&2; exit 1; }
mkdir -p "$dst"
# Full-size frames (1080x2160): shrink. Half-size ones (539x1079) are copied as they are.
for n in home phone-call phone-log contacts messages-thread settings settings-wifi-connected terminal clock browser-page shade; do
  sips -s format png --resampleWidth 540 "$src/$n-pixel.png" --out "$dst/$n.png" >/dev/null
done
for n in keyboard-en keyboard-hy keyboard-ru switcher; do
  cp "$src/$n-539x1079.png" "$dst/$n.png"
done
echo "updated $(ls "$dst" | wc -l | tr -d ' ') screens in $dst"
