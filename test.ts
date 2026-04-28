/**
 * test.ts
 * A4 parking station extension hardware test
 *
 * Test goals:
 * - check that the extension compiles correctly;
 * - validate the RGB LED functions;
 * - validate the vehicle presence input on C0;
 * - validate the ambient light reading;
 * - validate the screen I2C initialization and display functions.
 *
 * Expected result:
 * - the battery level is shown on the micro:bit display at startup;
 * - the screen is initialized and shows a title, text, and images;
 * - the background color changes with ambient light level;
 * - the two RGB LEDs alternate colors;
 * - the screen shows VEHICLE DETECTED when the proximity sensor on C0 is active;
 * - the screen shows NO VEHICLE when the proximity sensor on C0 is inactive;
 * - button A rotates the displayed image;
 * - button B removes and redraws screen objects.
 *
 * Pass condition:
 * - no compilation error;
 * - all blocks execute as expected on hardware.
 */

let rotationAngle = 0
let timeText = ""

// Startup checks
basic.showNumber(a4ParkingStation.batteryLevel())

// Screen initialization
a4ParkingStation.initScreenI2C()
a4ParkingStation.clearScreen()

// Build and use a time string to test buildTimeString()
timeText = a4ParkingStation.buildTimeString(12, 34, 56)

// Initial screen content
a4ParkingStation.setScreenBackgroundColor(
    a4ParkingStation.rgbColor(239, 239, 239)
)

a4ParkingStation.setScreenBackgroundImage("Parking.png")

a4ParkingStation.showScreenText(
    "A4 PARKING TEST",
    1,
    65,
    20,
    a4ParkingStation.ScreenFontSize.Large,
    0x000000
)

a4ParkingStation.showScreenText(
    timeText,
    2,
    110,
    55,
    a4ParkingStation.ScreenFontSize.Small,
    0x000000
)

a4ParkingStation.showScreenImage(
    3,
    "Parking.png",
    30,
    80,
    350
)

// RGB LED test in background
control.inBackground(function () {
    while (true) {
        a4ParkingStation.setRgbBrightness(255)
        a4ParkingStation.setDualRgbColors(
            a4ParkingStation.RgbColor.Red,
            a4ParkingStation.RgbColor.Blue
        )
        basic.pause(500)

        a4ParkingStation.setDualRgbColors(
            a4ParkingStation.RgbColor.Blue,
            a4ParkingStation.RgbColor.Red
        )
        basic.pause(500)

        a4ParkingStation.setDualRgb(
            255, 255, 0,
            0, 255, 255
        )
        basic.pause(500)

        a4ParkingStation.clearRgb()
        basic.pause(500)
    }
})

// Button A: rotate the image
input.onButtonPressed(Button.A, function () {
    rotationAngle += 45
    if (rotationAngle > 360) {
        rotationAngle = 0
    }

    a4ParkingStation.rotateScreenImage(3, rotationAngle)

    a4ParkingStation.showScreenText(
        "ANGLE " + rotationAngle,
        4,
        90,
        210,
        a4ParkingStation.ScreenFontSize.Small,
        0x000000
    )
})

// Button B: remove and redraw objects
input.onButtonPressed(Button.B, function () {
    a4ParkingStation.removeScreenObject(
        a4ParkingStation.ScreenObjectType.Text,
        4
    )

    a4ParkingStation.removeScreenObject(
        a4ParkingStation.ScreenObjectType.Image,
        3
    )

    basic.pause(300)

    a4ParkingStation.showScreenImage(
        3,
        "Parking.png",
        30,
        80,
        350
    )

    a4ParkingStation.showScreenText(
        "IMAGE REDRAWN",
        4,
        75,
        210,
        a4ParkingStation.ScreenFontSize.Small,
        0x000000
    )
})

// Main loop: sensor and light test
basic.forever(function () {
    let lightLevel = a4ParkingStation.ambientLightLevel()
    let detected = a4ParkingStation.vehiclePresent()

    // Screen background test using ambient light level
    if (lightLevel < 10) {
        a4ParkingStation.setScreenBackgroundColor(
            a4ParkingStation.rgbColor(176, 158, 255)
        )
    } else {
        a4ParkingStation.setScreenBackgroundColor(
            a4ParkingStation.rgbColor(255, 255, 0)
        )
    }

    // Vehicle presence test using C0
    if (detected) {
        a4ParkingStation.showScreenText(
            "VEHICLE DETECTED",
            5,
            55,
            180,
            a4ParkingStation.ScreenFontSize.Large,
            0xff0000
        )
    } else {
        a4ParkingStation.showScreenText(
            "NO VEHICLE",
            5,
            95,
            180,
            a4ParkingStation.ScreenFontSize.Large,
            a4ParkingStation.rgbColor(31, 160, 85)
        )
    }

    basic.pause(500)
})
