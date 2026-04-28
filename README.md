# a4_ms-stationnement

MakeCode extension for the **A4 limited parking station model** based on the **DFR1216 expansion board**, **BBC micro:bit**, a **DFR-compatible screen**, and a **proximity sensor connected to C0**.

![A4 ms stationnement](icon.png)

## Purpose

This extension is designed for an educational parking timer model used in technology lessons.

It provides simple blocks to:
- read the battery level of the DFR1216 board;
- control the two onboard RGB LEDs;
- detect vehicle presence with a proximity sensor;
- read the ambient light level from the micro:bit;
- control a compatible DFR screen through I2C.

## Hardware required

- BBC micro:bit
- DFR1216 expansion board
- DFR-compatible screen
- proximity sensor connected to port C0

## API overview

### System
- `battery level (%)`
- `set RGB0 to ... and RGB1 to ...`
- `set RGB0 to R ... G ... B ... and RGB1 to R ... G ... B ...`
- `set RGB brightness to ...`
- `clear RGB LEDs`

### Sensors
- `vehicle present`
- `ambient light level`

### Screen
- `initialize screen in I2C`
- `clear screen`
- `set screen background color`
- `RGB color`
- `set screen background image`
- `show text`
- `time`
- `show image`
- `rotate image`
- `remove screen object`

## Example

```typescript
basic.showNumber(a4ParkingStation.batteryLevel())
a4ParkingStation.initScreenI2C()
a4ParkingStation.setScreenBackgroundColor(
    a4ParkingStation.rgbColor(239, 239, 239)
)

basic.forever(function () {
    if (a4ParkingStation.vehiclePresent()) {
        a4ParkingStation.setDualRgbColors(
            a4ParkingStation.RgbColor.Red,
            a4ParkingStation.RgbColor.Blue
        )
        a4ParkingStation.showScreenText(
            "OCCUPIED",
            1,
            120,
            120,
            a4ParkingStation.ScreenFontSize.Large,
            0xff0000
        )
    } else {
        a4ParkingStation.setDualRgbColors(
            a4ParkingStation.RgbColor.Green,
            a4ParkingStation.RgbColor.Green
        )
        a4ParkingStation.showScreenText(
            "FREE",
            1,
            120,
            120,
            a4ParkingStation.ScreenFontSize.Large,
            a4ParkingStation.rgbColor(31, 160, 85)
        )
    }
})
```

## Compatibility

This extension is intended for use with the DFR1216 expansion board and BBC micro:bit.

If you want to submit this repository for approval, make sure the compatibility statement in the GitHub description, icon, and support request matches the hardware you have tested.

## License

MIT

## Supported targets

* for PXT/microbit
