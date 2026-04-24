//% weight=100 color=#0fbc11 icon="\uf085"
//% groups="['Système', 'Capteurs', 'Écran']"
namespace a4_ms_stationnement {

    const I2C_ADDR = 0x33
    let initialized = false
    let globalBrightness = 255

    // Mémorisation de l'état des 2 LED RGB
    let rgb0_r = 0
    let rgb0_g = 0
    let rgb0_b = 0

    let rgb1_r = 0
    let rgb1_g = 0
    let rgb1_b = 0

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

    function writeRGBState() {
        let buf = pins.createBuffer(8)

        buf[0] = 1
        buf[1] = globalBrightness

        buf[2] = rgb0_r
        buf[3] = rgb0_g
        buf[4] = rgb0_b

        buf[5] = rgb1_r
        buf[6] = rgb1_g
        buf[7] = rgb1_b

        writeReg(0x90, buf)
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

    //% block="mettre %index en R %r G %g B %b"
    //% r.min=0 r.max=255
    //% g.min=0 g.max=255
    //% b.min=0 b.max=255
    //% inlineInputMode=inline
    //% group="Système"
    //% color=#0fbc11
    //% weight=90
    export function setRGB(index: RGBIndex, r: number, g: number, b: number) {
        init()

        r = Math.clamp(0, 255, r)
        g = Math.clamp(0, 255, g)
        b = Math.clamp(0, 255, b)

        if (index == RGBIndex.RGB0) {
            rgb0_r = r
            rgb0_g = g
            rgb0_b = b
        } else if (index == RGBIndex.RGB1) {
            rgb1_r = r
            rgb1_g = g
            rgb1_b = b
        } else {
            rgb0_r = r
            rgb0_g = g
            rgb0_b = b

            rgb1_r = r
            rgb1_g = g
            rgb1_b = b
        }

        writeRGBState()
    }

    //% block="mettre %index en couleur %color"
    //% group="Système"
    //% color=#0fbc11
    //% weight=80
    export function setRGBColor(index: RGBIndex, color: RGBColor) {
        let r = 0
        let g = 0
        let b = 0

        switch (color) {
            case RGBColor.Red: r = 255; break
            case RGBColor.Green: g = 255; break
            case RGBColor.Blue: b = 255; break
            case RGBColor.Yellow: r = 255; g = 255; break
            case RGBColor.Cyan: g = 255; b = 255; break
            case RGBColor.Magenta: r = 255; b = 255; break
            case RGBColor.White: r = 255; g = 255; b = 255; break
            case RGBColor.Off: default: break
        }

        setRGB(index, r, g, b)
    }

    //% block="régler luminosité RGB à %b"
    //% b.min=0 b.max=255
    //% group="Système"
    //% color=#0fbc11
    //% weight=70
    export function setBrightness(b: number) {
        init()
        globalBrightness = Math.clamp(0, 255, b)
        writeRGBState()
    }

    //% block="éteindre les LED RGB"
    //% group="Système"
    //% color=#0fbc11
    //% weight=60
    export function clearRGB() {
        setRGB(RGBIndex.Both, 0, 0, 0)
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
