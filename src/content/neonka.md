## Overview

**neonka** (internally called *TKB — Teensy Keyboard Bridge*) is a firmware and
hardware project that transforms an **IBM Wheelwriter 6** electric typewriter into
a USB-connected computer peripheral. With neonka running, a modern computer can
send text to the typewriter over USB serial and it will print it; the typewriter's
keyboard also reports its keystrokes back to the computer. The bridge runs on a
Teensy 4.0 microcontroller wired into the typewriter's **Option Interface** port.

## Why it exists

The IBM Wheelwriter series has a proprietary 9-bit serial bus on its Option Interface
connector — an interface originally intended for external peripherals like a memory
module or an additional keyboard. The bus operates at an unusual 187,500 bps with
inverted open-collector signalling, making it incompatible with standard UART
hardware out of the box.

neonka exists to make that interface useful to a modern developer: reverse-engineer the
protocol, implement it cleanly in firmware, and end up with a typewriter that can act
as a printer (receive text from a PC) *and* a keyboard (send keypresses to a PC) over
a plain USB connection — no modification to the typewriter itself required.

## How it works

**Hardware layer.** The Teensy 4.0 connects to the Wheelwriter's 10-pin Molex Option
Interface connector. Because the typewriter's bus runs at 5 V while the Teensy
operates at 3.3 V, a 4-channel bidirectional level shifter sits between them. The
Teensy's Serial2 peripheral (TX pin 8, RX pin 7) handles the actual bus traffic.

**Protocol layer.** The Wheelwriter uses a 3-byte command packet format inherited from
the typewriter's internal 8051-family MCU: an address word (`0x121`) followed by a
command code and optional data bytes. Words are transmitted one at a time and each
must be acknowledged by the typewriter before the next is sent — a software
handshake over the shared open-collector bus.

**Firmware.** `firmware/src/main.cpp` implements:

- An **`ascii2wheel`** lookup table mapping all 96 printable ASCII characters to
  printwheel positions, plus a reverse table for decoding incoming keystrokes.
- A **4 KB ring buffer** that absorbs large paste operations without stalling.
- A **bus state machine** (idle → command → data1 → data2) for monitoring and
  decoding typewriter keystrokes as bus traffic flows past.
- Status polling and RX-flush logic before each command to prevent
  desynchronisation under rapid input.
- Configurable retry counts (`SEND_RETRIES`, `CMD_RETRIES`) and ACK timeouts.

```bash
./scripts/setup.sh      # one-time: create venv, install PlatformIO
./scripts/build.sh      # compile the firmware
./scripts/upload.sh     # flash the Teensy
./scripts/serial.sh     # open the serial monitor (auto-reconnects)
```

The Teensy appears as a USB serial device; anything written to it prints on the
typewriter, and every keypress on the typewriter echoes back to the host.

## Technical details

| Aspect            | Detail                                                      |
| ----------------- | ----------------------------------------------------------- |
| Language          | C++ (Arduino framework via PlatformIO)                      |
| Microcontroller   | Teensy 4.0 (ARM Cortex-M7, 600 MHz, 3.3 V)                 |
| Target hardware   | IBM Wheelwriter 6 (via Option Interface, 10-pin Molex)      |
| Bus protocol      | 9-bit UART, 187,500 bps, inverted open-collector signalling |
| Level shifting    | 4-channel bidirectional shifter (3.3 V ↔ 5 V)              |
| Build tooling     | PlatformIO in a project-local Python venv; VSCode tasks     |
| Character support | Full ASCII (printable) + CR/LF, tab, backspace              |

Protocol documentation is checked in under `docs/` and cross-references two
independent prior-art implementations (Jim Loos's STC 8051 project and John Kua's
Arduino Nano RP2040 project) to verify the reverse-engineered spec.

## Links

- [Repository](https://github.com/Flopsstuff/neonka)
- [Wheelwriter bus protocol docs](https://github.com/Flopsstuff/neonka/blob/main/docs/wheelwriter-bus-protocol.md)
