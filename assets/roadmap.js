// SPDX-License-Identifier: Apache-2.0
// The roadmap's single source: phases, parts and stages with their state. roadmap.html renders it;
// tests/roadmap.test.js checks ids, order and that states agree with dependencies.
// To change a state, edit the stage here and move AS_OF.

export const AS_OF = '2026-11-16';
export const STATES = ['done', 'progress', 'blocked', 'planned'];
export const STATE_LABEL = { done: 'Done', progress: 'In progress', blocked: 'Blocked', planned: 'Planned' };
export const WHERE_LABEL = { phone: 'On the phone', installed: 'Installed', qemu: 'QEMU', host: 'Host tests' };

const DOCS = 'https://github.com/NeoSymbian/docs/blob/main/';

// In order. A stage's phase is never earlier than the phase of anything it depends on.
export const PHASES = [
  { n: 1, title: 'Kernel bring-up', text: 'The 2010 kernel boots on 64-bit ARM, first on QEMU, then on the phone.' },
  { n: 2, title: 'Tools and debugging', text: 'Drive, log and test the phone and the emulator without touching them.' },
  { n: 3, title: 'Phone platform and storage', text: 'Buses, power, keys, touch, the screen and a real file system on the phone.' },
  { n: 4, title: 'Rust user side and UI', text: 'Rust on the 2010 user side, and the new touch UI in place of the window server.' },
  { n: 5, title: 'Calls and connectivity', text: 'The modem, phone calls with audio, and Wi-Fi to the internet.' },
  { n: 6, title: 'Daily phone', text: 'Messages, data, power and the apps that make it usable every day.' },
  { n: 7, title: 'Release readiness', text: 'Tests, data safety and security before anything is called a release.' },
];

export const PARTS = [
  { id: 'kernel', title: 'Kernel', text: 'The 2010 EKA2 kernel, ported to 64-bit ARM with 32-bit pointers, on all 8 cores.', doc: DOCS + 'roadmap.md' },
  { id: 'tools', title: 'Tools and debugging', text: 'The USB console, the emulator and the test runners that keep the work honest.', doc: DOCS + 'debug-access-roadmap.md' },
  { id: 'hardware', title: 'Hardware and drivers', text: 'Drivers for the Pixel\'s Snapdragon 670, written in C++ inside the kernel.', doc: DOCS + 'hardware.md' },
  { id: 'storage', title: 'Storage', text: 'Symbian\'s own FAT32 on the eMMC, a verified system drive and A/B update slots.', doc: DOCS + 'filesystem.md' },
  { id: 'rust', title: 'Rust user side', text: 'Rust programs, libraries and servers that run beside the unchanged 2010 code.', doc: DOCS + 'rust-integration.md' },
  { id: 'shell', title: 'UI shell and apps', text: 'neoui, the Rust touch UI that replaces the old window server, and its apps.', doc: DOCS + 'neoui-shell.md' },
  { id: 'smooth', title: 'Smooth UI', text: 'Input, frame pacing, compositing and CPU clocks for a fluid UI.', doc: DOCS + 'smooth-ui.md' },
  { id: 'telephony', title: 'Telephony', text: 'The Pixel\'s modem, driven from Rust: calls and audio now, then messages and data.', doc: DOCS + 'hardware/modem.md' },
  { id: 'wifi', title: 'Wi-Fi and wireless', text: 'The WCN3990 chip: firmware control, WPA2, a Rust IP stack and the 2010 socket API.', doc: DOCS + 'hardware/wifi.md' },
  { id: 'legacy', title: 'Old apps', text: 'Unchanged S60 apps from old .sis packages, running inside the new UI.', doc: DOCS + 'legacy.md' },
  { id: 'release', title: 'Release readiness', text: 'The kernel modernization track: the gates a supported release must pass.', doc: DOCS + 'kernel-modernization.md' },
];

// where: phone = shown on the phone (RAM boot), installed = in the phone's installed system, qemu, host.
export const STAGES = [
  // Phase 1: kernel bring-up
  { id: 'nkernsa', title: 'Nanokernel boots on QEMU', part: 'kernel', phase: 1, state: 'done', date: '', where: 'qemu',
    note: 'The SMP nanokernel and its test suite on QEMU, the port\'s first milestone.', doc: 'port-map.md', after: [] },
  { id: 'M1', title: 'Nanokernel test suite clean on the phone', part: 'kernel', phase: 1, state: 'done', date: '', where: 'phone',
    note: 'The whole nkernsa suite passes on the Pixel with 0 failures.', doc: 'known-issues.md', after: ['nkernsa'] },
  { id: 'M2', title: 'Full kernel on QEMU and the phone', part: 'kernel', phase: 1, state: 'done', date: '2026-11-06', where: 'phone',
    note: 'All 8 cores, kernel threads, timers, and user mode at EL0 with the dropped ARM instructions emulated.', doc: 'roadmap.md', after: ['M1'] },
  { id: 'M3', title: 'The 2010 user side boots', part: 'kernel', phase: 1, state: 'done', date: '2026-11-06', where: 'phone',
    note: 'The file server, estart and the shell prompt on the phone screen.', doc: 'roadmap.md', after: ['M2'] },

  // Phase 2: tools and debugging
  { id: 'H0', title: 'USB console and kernel monitor', part: 'tools', phase: 2, state: 'done', date: '2026-11-07', where: 'phone',
    note: 'Logs, screenshots, taps and fastboot over USB, so tests boot, report and return on their own.', doc: 'roadmap.md', after: ['M2'] },
  { id: 'Syborg', title: 'The emulator on QEMU 11.1', part: 'tools', phase: 2, state: 'done', date: '2026-11-08', where: 'qemu',
    note: 'The Syborg board rewritten in C with tests; the Rust test run went from about 4 minutes to 20 seconds.', doc: 'https://github.com/NeoSymbian/symbian-qemu', after: [] },
  { id: 'T1–T11', title: 'Shell, file transfer and CI access', part: 'tools', phase: 2, state: 'done', date: '2026-11-11', where: 'phone',
    note: 'fshell over USB and serial, checked push and pull, a USB debugging switch.', doc: 'debug-access-roadmap.md', after: ['H0'] },
  { id: 'T12', title: 'Debug access on an installed boot', part: 'tools', phase: 2, state: 'blocked', date: '2026-11-11', where: 'installed',
    note: 'Parked: on a normal boot the USB link never reaches the computer.', doc: 'debug-access-roadmap.md', after: ['T1–T11'] },

  // Phase 3: phone platform and storage
  { id: 'H1', title: 'Platform base: power votes, buses, firmware calls', part: 'hardware', phase: 3, state: 'done', date: '', where: 'phone',
    note: 'RPMh power votes, SPMI to the PMICs, I2C and TrustZone calls, the things the bootloader leaves off.', doc: 'roadmap.md', after: ['M3'] },
  { id: 'H4', title: 'Keys and touchscreen', part: 'hardware', phase: 3, state: 'done', date: '2026-11-06', where: 'phone',
    note: 'Power and volume keys over SPMI, Synaptics touch over I2C.', doc: 'roadmap.md', after: ['H1'] },
  { id: 'H3a', title: 'Power off, restart and the clock', part: 'hardware', phase: 3, state: 'done', date: '2026-11-08', where: 'installed',
    note: 'Power-off and restart from the UI, and the real-time clock.', doc: 'rust-integration.md', after: ['H1'] },
  { id: 'D2', title: 'Screen brightness, screen off and wake', part: 'hardware', phase: 3, state: 'done', date: '2026-11-11', where: 'phone',
    note: 'Brightness and blanking through the OLED panel, a screen timeout and the power key.', doc: 'hardware.md', after: ['H4'] },
  { id: 'TSENS', title: 'Temperature sensors and battery readings', part: 'hardware', phase: 3, state: 'done', date: '2026-11-11', where: 'phone',
    note: 'All 21 thermal sensors, and the battery level read from the fuel gauge.', doc: 'hardware/battery.md', after: ['H1'] },
  { id: 'FS1', title: 'FAT32 with long file names', part: 'storage', phase: 3, state: 'done', date: '2026-11-07', where: 'phone',
    note: 'Symbian\'s own FAT32 file system, built from the 2010 source.', doc: 'filesystem.md', after: ['M3'] },
  { id: 'FS2', title: 'Fast eMMC', part: 'storage', phase: 3, state: 'done', date: '2026-11-07', where: 'phone',
    note: 'DDR52 transfers, about 70 MB/s reads.', doc: 'filesystem.md', after: ['FS1', 'H1'] },
  { id: 'FS3', title: 'C: and E: on the phone\'s storage', part: 'storage', phase: 3, state: 'done', date: '2026-11-07', where: 'phone',
    note: 'C: is the 8 GB system drive, E: about 42 GB of mass memory; files survive a reset.', doc: 'filesystem.md', after: ['FS2'] },
  { id: 'FS4', title: 'Z: read from flash', part: 'storage', phase: 3, state: 'done', date: '2026-11-07', where: 'installed',
    note: 'The system drive is a read-only image in the phone\'s flash.', doc: 'filesystem.md', after: ['FS3'] },
  { id: 'FS5', title: 'Integrity checks and A/B slots', part: 'storage', phase: 3, state: 'done', date: '2026-11-08', where: 'installed',
    note: 'Every block checked against SHA-256; a bad update falls back to the previous slot on its own.', doc: 'filesystem.md', after: ['FS4'] },

  // Phase 4: Rust user side and UI
  { id: 'R0–R3', title: 'Rust programs and IPC servers', part: 'rust', phase: 4, state: 'done', date: '2026-11-06', where: 'qemu',
    note: 'Rust-only EXEs with a heap, timers, threads and files; a Rust server for unchanged C++ clients.', doc: 'rust-integration.md', after: [] },
  { id: 'R4–R6', title: 'The UI server replaces the window server', part: 'shell', phase: 4, state: 'done', date: '2026-11-06', where: 'qemu',
    note: 'neoui draws straight to the frame buffer, and apps run as separate processes.', doc: 'rust-integration.md', after: ['R0–R3'] },
  { id: 'R7', title: 'neoui on the Pixel', part: 'shell', phase: 4, state: 'done', date: '2026-11-06', where: 'phone',
    note: 'The Rust UI runs in place of the shell on the phone and takes taps.', doc: 'roadmap.md', after: ['R4–R6', 'H4', 'M3'] },
  { id: 'R8–R10', title: 'Files, Terminal and the app switcher', part: 'shell', phase: 4, state: 'done', date: '2026-11-07', where: 'phone',
    note: 'Apps keep running in the background; the Terminal runs the 2010 text programs.', doc: 'rust-integration.md', after: ['R7'] },
  { id: 'S1–S3', title: 'Input, compositing and CPU clocks', part: 'smooth', phase: 4, state: 'done', date: '2026-11-08', where: 'installed',
    note: 'No lost taps, frames paced at 60 fps, dragging up from 8 to 37–62 frames a second.', doc: 'smooth-ui.md', after: ['R7'] },
  { id: 'Part 1', title: 'Settings store', part: 'shell', phase: 4, state: 'done', date: '2026-11-09', where: 'qemu',
    note: 'One typed, saved, watchable store for the shell and every app.', doc: 'neoui-shell.md', after: ['R7'] },
  { id: 'R6d', title: 'System keyboard in English, Armenian and Russian', part: 'shell', phase: 4, state: 'done', date: '2026-11-12', where: 'installed',
    note: 'Any text field raises it; a globe key switches the layout.', doc: 'neoui-shell.md', after: ['Part 1'] },
  { id: 'Part 5', title: 'Status bar, shade, date and time', part: 'shell', phase: 4, state: 'done', date: '2026-11-13', where: 'phone',
    note: 'Quick settings, and a clock the mobile network can set.', doc: 'neoui-shell.md', after: ['Part 1'] },
  { id: 'Part 6', title: 'Time zones with daylight saving', part: 'shell', phase: 4, state: 'done', date: '2026-11-13', where: 'host',
    note: 'Zone rules checked by host tests.', doc: 'neoui-shell.md', after: ['Part 5'] },

  // Phase 5: calls and connectivity
  { id: 'C0–C4', title: 'The modem boots under our kernel', part: 'telephony', phase: 5, state: 'done', date: '2026-11-08', where: 'phone',
    note: 'Radio backups, the kernel transport, the modem\'s firmware boot and its services.', doc: 'hardware/modem.md', after: ['H1'] },
  { id: 'C5', title: 'Registers on LTE; calls go out and come in', part: 'telephony', phase: 5, state: 'done', date: '2026-11-09', where: 'phone',
    note: 'A Rust daemon speaks QMI; the status bar shows the operator and signal bars.', doc: 'hardware/modem.md', after: ['C0–C4', 'R7'] },
  { id: 'C5b', title: 'The modem\'s packet engine (IPA)', part: 'telephony', phase: 5, state: 'done', date: '2026-11-09', where: 'phone',
    note: 'The groundwork for mobile data.', doc: 'hardware/modem.md', after: ['C5'] },
  { id: 'C6', title: 'Call audio', part: 'telephony', phase: 5, state: 'done', date: '2026-11-09', where: 'installed',
    note: 'Two-way audio on the earpiece or loudspeaker, through the Pixel\'s audio DSP.', doc: 'hardware/modem.md', after: ['C5'] },
  { id: 'NITZ', title: 'Time from the mobile network', part: 'telephony', phase: 5, state: 'done', date: '2026-11-13', where: 'phone',
    note: 'The network sets the phone\'s clock and time zone.', doc: 'hardware/modem.md', after: ['C5'] },
  { id: 'C7', title: 'Complete calls', part: 'telephony', phase: 5, state: 'progress', date: '2026-11-12', where: 'installed',
    note: 'Ringing, vibration, multi-call controls, SIM and radio screens. Merged and installed; phone acceptance pending.', doc: 'hardware/modem.md', after: ['C6'] },
  { id: 'W0–W2', title: 'Wi-Fi firmware under control', part: 'wifi', phase: 5, state: 'done', date: '2026-11-12', where: 'phone',
    note: 'The modem starts the Wi-Fi firmware; our kernel drives its copy engines, HTC and WMI.', doc: 'hardware/wifi.md', after: ['C0–C4'] },
  { id: 'W3', title: 'Scanning, and Wi-Fi in Settings', part: 'wifi', phase: 5, state: 'done', date: '2026-11-12', where: 'phone',
    note: 'Networks nearby on 2.4 and 5 GHz, listed in Settings.', doc: 'hardware/wifi.md', after: ['W0–W2'] },
  { id: 'W4', title: 'Joins a WPA2 network', part: 'wifi', phase: 5, state: 'done', date: '2026-11-12', where: 'installed',
    note: 'Our kernel does the 802.11 join, a Rust supplicant runs the key handshake.', doc: 'hardware/wifi.md', after: ['W3'] },
  { id: 'W5', title: 'An IP address and the internet', part: 'wifi', phase: 5, state: 'done', date: '2026-11-12', where: 'phone',
    note: 'NEONET, a Rust IP stack on smoltcp, with DHCP, TCP and UDP.', doc: 'hardware/wifi.md', after: ['W4'] },
  { id: 'W7', title: 'Interrupt-driven Wi-Fi', part: 'wifi', phase: 5, state: 'done', date: '2026-11-13', where: 'phone',
    note: 'The driver sleeps on the chip\'s interrupts. Recovery after a modem restart is not proven yet.', doc: 'hardware/wifi.md', after: ['W5'] },
  { id: 'W5a', title: '2010 programs use the socket API', part: 'wifi', phase: 5, state: 'done', date: '2026-11-13', where: 'phone',
    note: 'The 2010 socket server (ESOCK) runs over NEONET.', doc: 'hardware/wifi.md', after: ['W5'] },

  // Phase 6: daily phone
  { id: 'C8', title: 'Call log and contacts', part: 'telephony', phase: 6, state: 'done', date: '2026-11-14', where: 'installed',
    note: 'Recents, caller ID, call waiting, contacts and the blocklist, as the Phone app (NEOPHONE). Installed on slot a.', doc: 'hardware/modem.md', after: ['C7'] },
  { id: 'ADSP', title: 'Modem restart without losing call audio', part: 'telephony', phase: 6, state: 'progress', date: '2026-11-13', where: 'phone',
    note: 'The next telephony step: keep the audio DSP in step when the modem restarts.', doc: 'hardware/modem.md', after: ['C6'] },
  { id: 'C9', title: 'Text messages (SMS)', part: 'telephony', phase: 6, state: 'done', date: '2026-11-16', where: 'installed',
    note: 'SMS through the modem daemon, Messages as the third app of NEOPHONE, Reply with message and message blocking. Sent, delivered and received on the phone; installed on slot a.', doc: 'hardware/modem.md', after: ['C5'] },
  { id: 'C10', title: 'Mobile data', part: 'telephony', phase: 6, state: 'planned', date: '', where: 'phone',
    note: 'Internet over the cellular network, through the packet engine.', doc: 'hardware/modem.md', after: ['C5b'] },
  { id: 'C12', title: 'Modem persistence and power', part: 'telephony', phase: 6, state: 'planned', date: '', where: 'phone',
    note: '', doc: 'hardware/modem.md', after: ['C7'] },
  { id: 'C11', title: 'Voice over LTE', part: 'telephony', phase: 6, state: 'planned', date: '', where: 'phone',
    note: 'A stretch goal, with a go/no-go decision first.', doc: 'hardware/modem.md', after: ['C10'] },
  { id: 'M4', title: 'Kernel performance', part: 'kernel', phase: 6, state: 'progress', date: '2026-11-15', where: 'phone',
    note: 'big.LITTLE-aware balancing is done and CPU frequency scaling has started. Since 2026-11-15 the RAM map comes from the bootloader (1687 MB in 8 banks), and old SMP-unsafe apps run one CPU at a time.', doc: 'roadmap.md', after: ['M3'] },
  { id: 'H3', title: 'Charging and suspend', part: 'hardware', phase: 6, state: 'planned', date: '', where: 'phone',
    note: 'Charging control and sleep, for a battery that lasts a day.', doc: 'roadmap.md', after: ['H3a', 'TSENS'] },
  { id: 'D3', title: 'Media audio', part: 'hardware', phase: 6, state: 'planned', date: '', where: 'phone',
    note: 'Sound beyond calls, and the headset.', doc: 'hardware.md', after: ['C6'] },
  { id: 'D4–D7', title: 'Sensors, cameras, NFC and fingerprint', part: 'hardware', phase: 6, state: 'planned', date: '', where: 'phone',
    note: '', doc: 'hardware.md', after: ['H1'] },
  { id: 'FS6', title: 'Share E: with a computer over USB', part: 'storage', phase: 6, state: 'blocked', date: '', where: 'installed',
    note: 'Waits on USB power during a normal boot (the same cause as T12).', doc: 'filesystem.md', after: ['FS5'] },
  { id: 'Updates', title: 'Updates from the phone itself', part: 'storage', phase: 6, state: 'planned', date: '', where: 'installed',
    note: 'Into the inactive A/B slot.', doc: 'filesystem.md', after: ['FS5'] },
  { id: 'Parts 2–4', title: 'Notifications, home pages and widgets', part: 'shell', phase: 6, state: 'planned', date: '', where: 'phone',
    note: '', doc: 'neoui-shell.md', after: ['Part 1'] },
  { id: 'S4–S5', title: 'NEON builds and the display engine', part: 'smooth', phase: 6, state: 'planned', date: '', where: 'phone',
    note: 'Faster drawing code, then vsync and hardware planes.', doc: 'smooth-ui.md', after: ['S1–S3'] },
  { id: 'L0.5', title: 'The Old apps launcher', part: 'legacy', phase: 6, state: 'done', date: '2026-11-14', where: 'phone',
    note: 'An Old apps grid with the installed apps and their real icons; a tap starts the app in a 2010 window server inside neoui.', doc: 'legacy.md', after: ['R7'] },
  { id: 'L2', title: 'Two usable old apps: X-plore and Frozen Bubble', part: 'legacy', phase: 6, state: 'progress', date: '2026-11-16', where: 'phone',
    note: 'Both run on the phone from their original .sis packages: X-plore lists C: and E:, Frozen Bubble shows its menu. Keys, audio and the full game are next.', doc: 'legacy.md', after: ['L0.5'] },
  { id: 'BT/GNSS', title: 'Bluetooth and location', part: 'wifi', phase: 6, state: 'planned', date: '', where: 'phone',
    note: 'Bluetooth is designed (2026-11-15): a new Rust host stack for the WCN3990, BLE first, with the 2010 client libraries kept. B0, the first contact with the chip, is next.', doc: 'hardware/bluetooth.md', after: ['W7'] },
  { id: 'Browser', title: 'A modern web browser', part: 'shell', phase: 6, state: 'planned', date: '', where: 'phone',
    note: 'Designed 2026-11-15: Servo as a native app. WB0, a proof on the host, comes first.', doc: 'browser.md', after: ['R7', 'W5'] },

  // Phase 7: release readiness
  { id: 'KM0', title: 'Trustworthy tests', part: 'release', phase: 7, state: 'planned', date: '', where: 'qemu',
    note: '', doc: 'kernel-modernization.md', after: ['M3'] },
  { id: 'KM1', title: 'Data preservation', part: 'release', phase: 7, state: 'planned', date: '', where: 'phone',
    note: '', doc: 'kernel-modernization.md', after: ['KM0'] },
  { id: 'KM2', title: 'Security boundaries', part: 'release', phase: 7, state: 'planned', date: '', where: 'phone',
    note: '', doc: 'kernel-modernization.md', after: ['KM0'] },
  { id: 'KM3', title: 'Time, SMP and ABI correctness', part: 'release', phase: 7, state: 'planned', date: '', where: 'phone',
    note: '', doc: 'kernel-modernization.md', after: ['KM1', 'KM2'] },
  { id: 'KM4', title: 'Device lifecycle', part: 'release', phase: 7, state: 'planned', date: '', where: 'phone',
    note: '', doc: 'kernel-modernization.md', after: ['KM3'] },
  { id: 'KM5', title: 'Measured performance', part: 'release', phase: 7, state: 'planned', date: '', where: 'phone',
    note: '', doc: 'kernel-modernization.md', after: ['KM4'] },
  { id: 'KM6', title: 'Release support', part: 'release', phase: 7, state: 'planned', date: '', where: 'phone',
    note: '', doc: 'kernel-modernization.md', after: ['KM2', 'KM4'] },
];

// A doc field is a file in NeoSymbian/docs or a full URL.
export function docUrl(doc) {
  return /^https?:/.test(doc) ? doc : DOCS + doc;
}

// Counts per state for a list of stages.
export function counts(stages) {
  const c = { done: 0, progress: 0, blocked: 0, planned: 0 };
  for (const s of stages) c[s.state]++;
  return c;
}

// A phase is done when all its stages are; in progress once any stage has started; else planned.
export function phaseState(stages) {
  const c = counts(stages);
  if (c.done === stages.length) return 'done';
  return c.done + c.progress + c.blocked > 0 ? 'progress' : 'planned';
}
