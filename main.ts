/**
 * MakeCode extension for the A4 limited parking station model
 * based on the DFR1216 expansion board and BBC micro:bit.
 */
//% weight=100 color=#0fbc11 icon="\uf085" block="A4 parking station"
//% groups='["System", "Sensors", "Screen"]'
namespace a4ParkingStation {
    const BOARD_I2C_ADDR = 0x33
    const SCREEN_I2C_ADDR = 0x2c
    const SCREEN_I2C_MAX_TRANSFER_SIZE = 32

    let boardInitialized = false
    let globalRgbBrightness = 255
    let screenListsInitialized = false

    /**
     * Preset colors for the two onboard RGB LEDs.
     */
    export enum RgbColor {
        //% block="red"
        Red,
        //% block="green"
        Green,
        //% block="blue"
        Blue,
        //% block="yellow"
        Yellow,
        //% block="cyan"
        Cyan,
        //% block="magenta"
        Magenta,
        //% block="white"
        White,
        //% block="off"
        Off
    }

    /**
     * DFR1216 GPIO ports.
     */
    export enum IoPort {
        //% block="C0"
        C0 = 0,
        //% block="C1"
        C1 = 1,
        //% block="C2"
        C2 = 2,
        //% block="C3"
        C3 = 3,
        //% block="C4"
        C4 = 4,
        //% block="C5"
        C5 = 5
    }

    /**
     * Text sizes supported by the screen.
     */
    export enum ScreenFontSize {
        //% block="large"
        Large = 1,
        //% block="small"
        Small = 2
    }

    /**
     * Screen object types that can be removed.
     */
    export enum ScreenObjectType {
        //% block="text"
        Text = 7,
        //% block="image"
        Image = 12
    }

    class GenericNode {
        id: number
        next: GenericNode

        constructor(id: number) {
            this.id = id
            this.next = null
        }
    }

    class LinkedList {
        head: GenericNode
        size: number
        nextId: number

        constructor() {
            this.head = null
            this.size = 0
            this.nextId = 1
        }

        append() {
            const newNode = new GenericNode(this.nextId)

            if (this.head == null) {
                this.head = newNode
            } else {
                let current = this.head
                while (current.next != null) {
                    current = current.next
                }
                current.next = newNode
            }

            this.size++
            this.nextId++
        }

        removeId(id: number): boolean {
            if (this.head == null) {
                return false
            }

            let current = this.head

            if (current.id == id) {
                this.head = current.next
            } else {
                let previous = null
                while (current && current.id != id) {
                    previous = current
                    current = current.next
                }

                if (!current) {
                    return false
                }

                previous.next = current.next
            }

            this.size--
            return true
        }
    }

    type ScreenObjectLists = {
        textHead: LinkedList,
        imageHead: LinkedList
    }

    let screenObjectLists: ScreenObjectLists

    // Screen command constants
    const CMDLEN_OF_HEAD_LEN = 3
    const CMD_DELETE_OBJ_LEN = 0x06
    const CMD_SET_LEN = 0x07
    const CMD_SET_ANGLE_OBJ_LEN = 0x08

    const CMD_SET_BACKGROUND_COLOR = 0x19
    const CMD_SET_BACKGROUND_IMG = 0x1A
    const CMD_DRAW_ICON_INTERNAL = 0x08
    const CMD_DRAW_ICON_EXTERNAL = 0x09
    const CMD_DRAW_TEXT = 0x18
    const CMD_DELETE_OBJ = 0x1B
    const CMD_SET_ANGLE_OBJ = 0x1E
    const CMD_HEADER_HIGH = 0x55
    const CMD_HEADER_LOW = 0xaa

    function initBoard() {
        if (!boardInitialized) {
            boardInitialized = true
            basic.pause(100)
        }
    }

    function ensureScreenLists() {
        if (!screenListsInitialized) {
            screenObjectLists = {
                textHead: new LinkedList(),
                imageHead: new LinkedList()
            }
            screenListsInitialized = true
        }
    }

    function writeBoardRegister(reg: number, data: Buffer) {
        let buf = pins.createBuffer(data.length + 1)
        buf[0] = reg

        for (let i = 0; i < data.length; i++) {
            buf[i + 1] = data[i]
        }

        pins.i2cWriteBuffer(BOARD_I2C_ADDR, buf)
    }

    function readBoardRegister(reg: number, len: number): Buffer {
        pins.i2cWriteNumber(BOARD_I2C_ADDR, reg, NumberFormat.UInt8BE)
        return pins.i2cReadBuffer(BOARD_I2C_ADDR, len)
    }

    function setDigitalInput(io: IoPort) {
        writeBoardRegister(0x2c + io, pins.createBufferFromArray([5]))
    }

    function readDigital(io: IoPort): number {
        initBoard()
        setDigitalInput(io)
        basic.pause(10)
        return readBoardRegister(0x3f + io, 1)[0]
    }

    function writeRgbValues(r0: number, g0: number, b0: number, r1: number, g1: number, b1: number) {
        initBoard()

        let buf = pins.createBuffer(8)
        buf[0] = 1
        buf[1] = globalRgbBrightness

        buf[2] = Math.clamp(0, 255, r0)
        buf[3] = Math.clamp(0, 255, g0)
        buf[4] = Math.clamp(0, 255, b0)

        buf[5] = Math.clamp(0, 255, r1)
        buf[6] = Math.clamp(0, 255, g1)
        buf[7] = Math.clamp(0, 255, b1)

        writeBoardRegister(0x90, buf)
    }

    function colorToRgb(color: RgbColor): number[] {
        switch (color) {
            case RgbColor.Red: return [255, 0, 0]
            case RgbColor.Green: return [0, 255, 0]
            case RgbColor.Blue: return [0, 0, 255]
            case RgbColor.Yellow: return [255, 255, 0]
            case RgbColor.Cyan: return [0, 255, 255]
            case RgbColor.Magenta: return [255, 0, 255]
            case RgbColor.White: return [255, 255, 255]
            case RgbColor.Off:
            default: return [0, 0, 0]
        }
    }

    function data16ToBytes(data: number): number[] {
        return [(data >> 8) & 0xFF, data & 0xFF]
    }

    function data24ToBytes(data: number): number[] {
        return [(data >> 16) & 0xFF, (data >> 8) & 0xFF, data & 0xFF]
    }

    function normalizeScreenColor(color: number): number {
        switch (color) {
            case 0x999999:
                return 0x696969
            case 0x7f00ff:
                return 0x800080
            default:
                return color
        }
    }

    function createScreenCommand(cmd: number, len: number): number[] {
        return [CMD_HEADER_HIGH, CMD_HEADER_LOW, len - CMDLEN_OF_HEAD_LEN, cmd]
    }

    function writeScreenCommand(data: number[], len: number) {
        let remain = len
        let index = 0

        while (remain > 0) {
            let currentTransferSize = (remain > SCREEN_I2C_MAX_TRANSFER_SIZE) ? SCREEN_I2C_MAX_TRANSFER_SIZE : remain
            let chunk = pins.createBufferFromArray(
                data.slice(index * SCREEN_I2C_MAX_TRANSFER_SIZE, index * SCREEN_I2C_MAX_TRANSFER_SIZE + currentTransferSize)
            )

            if (remain > SCREEN_I2C_MAX_TRANSFER_SIZE) {
                pins.i2cWriteBuffer(SCREEN_I2C_ADDR, chunk, true)
            } else {
                pins.i2cWriteBuffer(SCREEN_I2C_ADDR, chunk, false)
            }

            remain = remain - currentTransferSize
            index = index + 1
        }
    }

    function deleteNodeById(linkList: LinkedList, id: number) {
        if (linkList) {
            linkList.removeId(id)
        }
    }

    function clearScreenInternal() {
        let cmd = createScreenCommand(0x1D, 0x04)
        writeScreenCommand(cmd, 4)
        basic.pause(1500)
    }

    function setBackgroundColorInternal(color: number) {
        let cmd = createScreenCommand(CMD_SET_BACKGROUND_COLOR, CMD_SET_LEN)
        cmd = cmd.concat(data24ToBytes(color))
        writeScreenCommand(cmd, CMD_SET_LEN)
        basic.pause(300)
    }

    function setBackgroundImageInternal(location: number, name: string) {
        let len = name.length
        let cmd = createScreenCommand(CMD_SET_BACKGROUND_IMG, len + 5)
        cmd = cmd.concat([location])
        name.split("").forEach(value => cmd.push(value.charCodeAt(0)))
        writeScreenCommand(cmd, len + 5)
    }

    function updateTextInternal(id: number, x: number, y: number, text: string, fontSize: number, color: number) {
        let len = text.length > 242 ? 242 : text.length
        let cmd = createScreenCommand(CMD_DRAW_TEXT, len + 13)
        cmd = cmd.concat([id, fontSize])
            .concat(data24ToBytes(color))
            .concat(data16ToBytes(x))
            .concat(data16ToBytes(y))

        text.split("").forEach(value => cmd.push(value.charCodeAt(0)))
        writeScreenCommand(cmd, len + 13)
    }

    function deleteTextInternal(id: number) {
        let cmd = createScreenCommand(CMD_DELETE_OBJ, CMD_DELETE_OBJ_LEN)
        cmd = cmd.concat([CMD_DRAW_TEXT, id])
        writeScreenCommand(cmd, CMD_DELETE_OBJ_LEN)
        deleteNodeById(screenObjectLists.textHead, id)
    }

    function setImageAngleInternal(id: number, angle: number) {
        let cmd = createScreenCommand(CMD_SET_ANGLE_OBJ, CMD_SET_ANGLE_OBJ_LEN)
        cmd = cmd.concat([CMD_DRAW_ICON_INTERNAL, id]).concat(data16ToBytes(angle))
        writeScreenCommand(cmd, CMD_SET_ANGLE_OBJ_LEN)
    }

    function updateImageInternal(id: number, x: number, y: number, name: string, zoom: number) {
        let len = name.length
        let cmd = createScreenCommand(CMD_DRAW_ICON_EXTERNAL, len + 11)
        cmd = cmd.concat([id])
            .concat(data16ToBytes(zoom))
            .concat(data16ToBytes(x))
            .concat(data16ToBytes(y))

        name.split("").forEach(value => cmd.push(value.charCodeAt(0)))
        writeScreenCommand(cmd, len + 11)
    }

    function deleteImageInternal(id: number) {
        let cmd = createScreenCommand(CMD_DELETE_OBJ, CMD_DELETE_OBJ_LEN)
        cmd = cmd.concat([CMD_DRAW_ICON_INTERNAL, id])
        writeScreenCommand(cmd, CMD_DELETE_OBJ_LEN)
        deleteNodeById(screenObjectLists.imageHead, id)
    }

    /**
     * Returns the battery level in percent.
     */
    //% block="battery level (\\%)"
    //% group="System"
    //% color=#0fbc11
    //% weight=100
    export function batteryLevel(): number {
        initBoard()
        return readBoardRegister(0x87, 1)[0]
    }

    /**
     * Sets the two onboard RGB LEDs using preset colors.
     * @param color0 color for RGB0
     * @param color1 color for RGB1
     */
    //% block="set RGB0 to %color0 and RGB1 to %color1"
    //% inlineInputMode=inline
    //% group="System"
    //% color=#0fbc11
    //% weight=90
    export function setDualRgbColors(color0: RgbColor, color1: RgbColor) {
        let c0 = colorToRgb(color0)
        let c1 = colorToRgb(color1)
        writeRgbValues(c0[0], c0[1], c0[2], c1[0], c1[1], c1[2])
    }

    /**
     * Sets the two onboard RGB LEDs using custom RGB values.
     * @param r0 red value for RGB0
     * @param g0 green value for RGB0
     * @param b0 blue value for RGB0
     * @param r1 red value for RGB1
     * @param g1 green value for RGB1
     * @param b1 blue value for RGB1
     */
    //% block="set RGB0 to R %r0 G %g0 B %b0 and RGB1 to R %r1 G %g1 B %b1"
    //% r0.min=0 r0.max=255
    //% g0.min=0 g0.max=255
    //% b0.min=0 b0.max=255
    //% r1.min=0 r1.max=255
    //% g1.min=0 g1.max=255
    //% b1.min=0 b1.max=255
    //% inlineInputMode=inline
    //% group="System"
    //% color=#0fbc11
    //% weight=80
    export function setDualRgb(r0: number, g0: number, b0: number, r1: number, g1: number, b1: number) {
        writeRgbValues(r0, g0, b0, r1, g1, b1)
    }

    /**
     * Sets the brightness of the two onboard RGB LEDs.
     * @param brightness brightness value from 0 to 255
     */
    //% block="set RGB brightness to %brightness"
    //% brightness.min=0 brightness.max=255
    //% group="System"
    //% color=#0fbc11
    //% weight=70
    export function setRgbBrightness(brightness: number) {
        globalRgbBrightness = Math.clamp(0, 255, brightness)
    }

    /**
     * Turns off the two onboard RGB LEDs.
     */
    //% block="clear RGB LEDs"
    //% group="System"
    //% color=#0fbc11
    //% weight=60
    export function clearRgb() {
        writeRgbValues(0, 0, 0, 0, 0, 0)
    }

    /**
     * Returns true when a vehicle is detected on port C0.
     */
    //% block="vehicle present"
    //% group="Sensors"
    //% color=#ff4fa3
    //% weight=100
    export function vehiclePresent(): boolean {
        initBoard()
        return readDigital(IoPort.C0) == 1
    }

    /**
     * Returns the micro:bit ambient light level.
     */
    //% block="ambient light level"
    //% group="Sensors"
    //% color=#ff4fa3
    //% weight=90
    export function ambientLightLevel(): number {
        return input.lightLevel()
    }

    /**
     * Initializes the screen in I2C mode.
     */
    //% block="initialize screen in I2C"
    //% group="Screen"
    //% color=#8e44ad
    //% weight=100
    export function initScreenI2C() {
        ensureScreenLists()
        basic.pause(1000)
    }

    /**
     * Clears all objects currently shown on the screen.
     */
    //% block="clear screen"
    //% group="Screen"
    //% color=#8e44ad
    //% weight=95
    export function clearScreen() {
        ensureScreenLists()
        clearScreenInternal()
    }

    /**
     * Sets the screen background color.
     * @param color 24-bit RGB color
     */
    //% block="set screen background color %color"
    //% color.shadow="colorNumberPicker"
    //% group="Screen"
    //% color=#8e44ad
    //% weight=90
    export function setScreenBackgroundColor(color: number) {
        ensureScreenLists()
        setBackgroundColorInternal(normalizeScreenColor(color))
    }

    /**
     * Builds a 24-bit RGB color value.
     * @param red red value from 0 to 255
     * @param green green value from 0 to 255
     * @param blue blue value from 0 to 255
     */
    //% block="RGB color red %red green %green blue %blue"
    //% red.min=0 red.max=255 red.defl=255
    //% green.min=0 green.max=255 green.defl=255
    //% blue.min=0 blue.max=255 blue.defl=255
    //% group="Screen"
    //% color=#8e44ad
    //% weight=85
    export function rgbColor(red: number, green: number, blue: number): number {
        return (red << 16) + (green << 8) + blue
    }

    /**
     * Sets a background image on the screen.
     * @param picture image file name
     */
    //% block="set screen background image %picture"
    //% group="Screen"
    //% color=#8e44ad
    //% weight=80
    export function setScreenBackgroundImage(picture: string) {
        ensureScreenLists()
        setBackgroundImageInternal(1, picture)
    }

    /**
     * Displays a text string on the screen.
     * @param text text to display
     * @param id object id from 1 to 255
     * @param x horizontal position
     * @param y vertical position
     * @param size font size
     * @param color 24-bit RGB color
     */
    //% block="show text %text id %id at x %x y %y size %size color %color"
    //% id.min=1 id.max=255 id.defl=1
    //% x.min=0 x.max=320 x.defl=120
    //% y.min=0 y.max=240 y.defl=120
    //% color.shadow="colorNumberPicker"
    //% inlineInputMode=inline
    //% group="Screen"
    //% color=#8e44ad
    //% weight=75
    export function showScreenText(text: string, id: number, x: number, y: number, size: ScreenFontSize, color: number) {
        ensureScreenLists()
        updateTextInternal(id, x, y, text, size, color)
    }

    /**
     * Builds a time string in HH:MM:SS format.
     * @param hour hour from 0 to 23
     * @param min minute from 0 to 59
     * @param sec second from 0 to 59
     */
    //% block="time %hour hours %min minutes %sec seconds"
    //% hour.min=0 hour.max=23 hour.defl=12
    //% min.min=0 min.max=59 min.defl=40
    //% sec.min=0 sec.max=59 sec.defl=30
    //% inlineInputMode=inline
    //% group="Screen"
    //% color=#8e44ad
    //% weight=70
    export function buildTimeString(hour: number, min: number, sec: number): string {
        return `${hour < 10 ? "0" + hour : "" + hour}:${min < 10 ? "0" + min : "" + min}:${sec < 10 ? "0" + sec : "" + sec}`
    }

    /**
     * Displays an image on the screen.
     * @param id object id from 1 to 255
     * @param name image file name
     * @param x horizontal position
     * @param y vertical position
     * @param size zoom value
     */
    //% block="show image id %id name %name at x %x y %y size %size"
    //% id.min=1 id.max=255 id.defl=1
    //% x.min=0 x.max=320 x.defl=120
    //% y.min=0 y.max=240 y.defl=120
    //% size.min=0 size.max=512 size.defl=256
    //% inlineInputMode=inline
    //% group="Screen"
    //% color=#8e44ad
    //% weight=65
    export function showScreenImage(id: number, name: string, x: number, y: number, size: number) {
        ensureScreenLists()
        updateImageInternal(id, x, y, name, size)
    }

    /**
     * Rotates an image already shown on the screen.
     * @param id object id from 1 to 255
     * @param angle rotation angle in degrees
     */
    //% block="rotate image id %id angle %angle"
    //% id.min=1 id.max=255 id.defl=1
    //% angle.min=0 angle.max=360 angle.defl=180
    //% group="Screen"
    //% color=#8e44ad
    //% weight=60
    export function rotateScreenImage(id: number, angle: number) {
        ensureScreenLists()
        setImageAngleInternal(id, angle * 10)
    }

    /**
     * Removes a text or image object from the screen.
     * @param type object type
     * @param id object id from 1 to 255
     */
    //% block="remove screen %type object id %id"
    //% id.min=1 id.max=255 id.defl=1
    //% group="Screen"
    //% color=#8e44ad
    //% weight=50
    export function removeScreenObject(type: ScreenObjectType, id: number) {
        ensureScreenLists()

        switch (type) {
            case ScreenObjectType.Text:
                deleteTextInternal(id)
                break
            case ScreenObjectType.Image:
                deleteImageInternal(id)
                break
        }
    }
}
