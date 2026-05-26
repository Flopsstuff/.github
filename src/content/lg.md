## Overview

Liquid Glass (`lg`) is an iOS demo app that simulates a draggable magnifying lens over images using custom Metal-powered CoreImage filters. Instead of applying a simple blur, it creates a displacement map and uses that map to bend background pixels so the lens looks like curved glass. The app also adds optional chromatic aberration and color adjustments, so the effect can range from subtle magnification to stylized distortion.

![Liquid Glass demo](https://raw.githubusercontent.com/Flopsstuff/lg/master/img/githubPreview.gif)

## Why it exists

The project exists as a practical graphics experiment: reproduce a believable "liquid glass" lens in real time on iOS, with controls that expose how each parameter affects the final image. It is useful for learning the interaction between CoreImage and custom Metal kernels, especially for effects that need both physically-inspired deformation (lens curvature, rim behavior) and interactive UI tuning.

## How it works

The render path is split into two custom CoreImage kernels loaded from a Metal library:

1. `displacementMapGeneratorKernel` builds a lens-shaped displacement map from lens dimensions and tuning inputs (`radius`, `bezel`, `magic`, `rim`, `noise`).
2. `displacementMapDistortsionKernel` samples the background image with offset coordinates derived from that map and applies per-channel offsets to produce chromatic aberration.

`LGView` captures pixels under the lens area, then applies filters in sequence: optional blur, displacement distortion, then optional color controls (brightness/saturation/contrast). A draggable lens view updates continuously as position or slider values change.

## Technical details

| Aspect | Detail |
| --- | --- |
| Platform | iOS app (`UIKit`) |
| Language | Swift |
| Rendering stack | CoreImage + Metal Shading Language |
| Custom filters | `DisplacementMapFilter.swift` backed by `Displacement.ci.metal` |
| Interaction | Drag lens, tap background to cycle images, tap lens to toggle map preview |
| Tuning controls | Width, height, radius, scale, bezel, padding, magic, rim, aberration, blur, saturation, brightness, contrast, noise |
| License | MIT |

Run it by opening `lg.xcodeproj` in Xcode and launching the `lg` target on an iOS simulator or device.

## Links

- [Repository](https://github.com/Flopsstuff/lg)
- [README](https://github.com/Flopsstuff/lg/blob/master/README.md)
- [Core Image documentation](https://developer.apple.com/documentation/coreimage)
- [Metal documentation](https://developer.apple.com/documentation/metal)
