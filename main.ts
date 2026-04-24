//% weight=100 color=#0fbc11 icon="\uf085"
//% groups="['Système', 'Capteurs', 'Écran']"
namespace a4_ms_stationnement {

    const I2C_ADDR = 0x33
    let initialized = false
    let globalBrightness = 255

    function init() {
        if (!initialized) {
            initialized = true
            basic.pause(100)
        }
    }

    function writeReg(reg: number, data: Buffer) {
        let buf = pins.createBuffer(data.length + 1)
        buf[0] = reg
        for (let i = 0; i < data.length; i++) {
            buf[i + 1] = data[i]
        }
        pins.i2cWriteBuffer(I2C_ADDR, buf)
    }

    function readReg(reg: number, len: number): Buffer {
        pins.i2cWriteNumber(I2C_ADDR, reg, NumberFormat.UInt8BE)
        return pins.i2cReadBuffer(I2C_ADDR, len)
    }

    function setDigitalInput(io: IO) {
        writeReg(0x2c + io, pins.createBufferFromArray([5]))
    }

    function readDigital(io: IO): number {
        init()
        setDigitalInput(io)
        basic.pause(10)
        return readReg(0x3f + io, 1)[0]
    }

    function writeRGBValues(r0: number, g0: number, b0: number, r1: number, g1: number, b1: number) {
        init()

        let buf = pins.createBuffer(8)
        buf[0] = 1
        buf[1] = globalBrightness

        buf[2] = Math.clamp(0, 255, r0)
        buf[3] = Math.clamp(0, 255, g0)
        buf[4] = Math.clamp(0, 255, b0)

        buf[5] = Math.clamp(0, 255, r1)
        buf[6] = Math.clamp(0, 255, g1)
        buf[7] = Math.clamp(0, 255, b1)

        writeReg(0x90, buf)
    }

    function colorToRGB(color: RGBColor): number[] {
        switch (color) {
            case RGBColor.Red: return [255, 0, 0]
            case RGBColor.Green: return [0, 255, 0]
            case RGBColor.Blue: return [0, 0, 255]
            case RGBColor.Yellow: return [255, 255, 0]
            case RGBColor.Cyan: return [0, 255, 255]
            case RGBColor.Magenta: return [255, 0, 255]
            case RGBColor.White: return [255, 255, 255]
            case RGBColor.Off:
            default: return [0, 0, 0]
        }
    }

    // =========================
    // SYSTÈME
    // =========================

    //% block="niveau de batterie (\\%)"
    //% group="Système"
    //% color=#0fbc11
    //% weight=100
    export function niveauBatterie(): number {
        init()
        return readReg(0x87, 1)[0]
    }

    //% block="mettre RGB0 en %color0 et RGB1 en %color1"
    //% inlineInputMode=inline
    //% group="Système"
    //% color=#0fbc11
    //% weight=90
    export function setTwoRGBColors(color0: RGBColor, color1: RGBColor) {
        let c0 = colorToRGB(color0)
        let c1 = colorToRGB(color1)
        writeRGBValues(c0[0], c0[1], c0[2], c1[0], c1[1], c1[2])
    }

    //% block="mettre RGB0 en R %r0 G %g0 B %b0 et RGB1 en R %r1 G %g1 B %b1"
    //% r0.min=0 r0.max=255
    //% g0.min=0 g0.max=255
    //% b0.min=0 b0.max=255
    //% r1.min=0 r1.max=255
    //% g1.min=0 g1.max=255
    //% b1.min=0 b1.max=255
    //% inlineInputMode=inline
    //% group="Système"
    //% color=#0fbc11
    //% weight=80
    export function setTwoRGB(r0: number, g0: number, b0: number, r1: number, g1: number, b1: number) {
        writeRGBValues(r0, g0, b0, r1, g1, b1)
    }

    //% block="régler luminosité RGB à %b"
    //% b.min=0 b.max=255
    //% group="Système"
    //% color=#0fbc11
    //% weight=70
    export function setBrightness(b: number) {
        globalBrightness = Math.clamp(0, 255, b)
    }

    //% block="éteindre les LED RGB"
    //% group="Système"
    //% color=#0fbc11
    //% weight=60
    export function clearRGB() {
        writeRGBValues(0, 0, 0, 0, 0, 0)
    }

    // =========================
    // CAPTEURS
    // =========================

    //% block="présence d'un véhicule"
    //% group="Capteurs"
    //% color=#ff4fa3
    //% weight=100
    export function presenceVehicule(): boolean {
        init()
        return readDigital(IO.C0) == 1
    }

    //% block="niveau d'intensité lumineuse"
    //% group="Capteurs"
    //% color=#ff4fa3
    //% weight=90
    export function niveauLuminosite(): number {
        return input.lightLevel()
    }
}
