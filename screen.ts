const enum EcranObjetSupprimable {
    //% block="texte"
    Text = 7,
    //% block="image"
    Icon = 12,
}

namespace a4_ms_stationnement {

    export enum TaillePolice {
        //% block="grande"
        Large = 1,
        //% block="petite"
        Small = 2,
        //% block="très grande"
        XLarge = 3,
    }

    export enum ProtocoleEcran {
        IIC = 1,
        Serial = 2,
    }

    const IIC_MAX_TRANSFER_SIZE = 32

    const CMDLEN_OF_HEAD_LEN = 3
    const CMD_DELETE_OBJ_LEN = 0x06
    const CMD_SET_LEN = 0x07
    const CMD_SET_ANGLE_OBJ_LEN = 0x08
    const CMD_SET_ANGLE_OBJ = 0x1E

    const CMD_SET_BACKGROUND_COLOR = 0x19
    const CMD_SET_BACKGROUND_IMG = 0x1A
    const CMD_OF_DRAW_ICON_INTERNAL = 0x08
    const CMD_OF_DRAW_ICON_EXTERNAL = 0x09
    const CMD_OF_DRAW_TEXT = 0x18
    const CMD_DELETE_OBJ = 0x1B
    const CMD_HEADER_HIGH = 0x55
    const CMD_HEADER_LOW = 0xaa

    let address = 0x2c
    let protocol: ProtocoleEcran = ProtocoleEcran.IIC

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
        id: number

        constructor() {
            this.head = null
            this.size = 0
            this.id = 1
        }

        append() {
            const newNode = new GenericNode(this.id)
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
            this.id++
        }

        removeId(id: number): boolean {
            if (this.head == null) return false

            let current = this.head
            if (current.id == id) {
                this.head = current.next
            } else {
                let previous = null
                while (current && current.id != id) {
                    previous = current
                    current = current.next
                }
                if (!current) return false
                previous.next = current.next
            }

            this.size--
            return true
        }
    }

    type GenericList = {
        textHead: LinkedList,
        iconHead: LinkedList
    }

    let list: GenericList

    //% block="écran initialiser en I2C"
    //% group="Écran"
    //% color=#8e44ad
    //% weight=100
    export function ecranInitialiserI2C() {
        creerListes()
        protocol = ProtocoleEcran.IIC
        basic.pause(1000)
    }

    //% block="écran effacer tout"
    //% group="Écran"
    //% color=#8e44ad
    //% weight=95
    export function ecranEffacerTout() {
        nettoyerEcran()
    }

    //% block="écran définir couleur de fond %color"
    //% color.shadow="colorNumberPicker"
    //% group="Écran"
    //% color=#8e44ad
    //% weight=90
    export function ecranCouleurFond(color: number) {
        setBackgroundColor(colorToCustom(color))
    }

    //% block="couleur RVB rouge %red vert %green bleu %blue"
    //% red.min=0 red.max=255 red.defl=255
    //% green.min=0 green.max=255 green.defl=255
    //% blue.min=0 blue.max=255 blue.defl=255
    //% group="Écran"
    //% color=#8e44ad
    //% weight=85
    export function ecranCouleurRVB(red: number, green: number, blue: number): number {
        return (red << 16) + (green << 8) + blue
    }

    //% block="écran définir image de fond %picture"
    //% group="Écran"
    //% color=#8e44ad
    //% weight=80
    export function ecranImageFond(picture: string) {
        setBackgroundImg(1, picture)
    }

    //% block="écran afficher texte %text numéro %num position x %x y %y taille %size couleur %color"
    //% num.min=1 num.max=255 num.defl=1
    //% x.min=0 x.max=320 x.defl=120
    //% y.min=0 y.max=240 y.defl=120
    //% color.shadow="colorNumberPicker"
    //% inlineInputMode=inline
    //% group="Écran"
    //% color=#8e44ad
    //% weight=75
    export function ecranAfficherTexte(text: string, num: number, x: number, y: number, size: TaillePolice, color: number) {
        updateString(num, x, y, text, size, color)
    }

    //% block="heure %hour minutes %min secondes %sec"
    //% hour.min=0 hour.max=23 hour.defl=12
    //% min.min=0 min.max=59 min.defl=40
    //% sec.min=0 sec.max=59 sec.defl=30
    //% inlineInputMode=inline
    //% group="Écran"
    //% color=#8e44ad
    //% weight=70
    export function ecranConstruireHeure(hour: number, min: number, sec: number): string {
        return `${hour < 10 ? "0" + hour : "" + hour}:${min < 10 ? "0" + min : "" + min}:${sec < 10 ? "0" + sec : "" + sec}`
    }

    //% block="écran afficher image numéro %num nom %name position x %x y %y taille %size"
    //% num.min=1 num.max=255 num.defl=1
    //% x.min=0 x.max=320 x.defl=120
    //% y.min=0 y.max=240 y.defl=120
    //% size.min=0 size.max=512 size.defl=256
    //% inlineInputMode=inline
    //% group="Écran"
    //% color=#8e44ad
    //% weight=65
    export function ecranAfficherImage(num: number, name: string, x: number, y: number, size: number) {
        updateIcon(num, x, y, name, size)
    }

    //% block="écran rotation image numéro %num angle %angle"
    //% num.min=1 num.max=255 num.defl=1
    //% angle.min=0 angle.max=360 angle.defl=180
    //% group="Écran"
    //% color=#8e44ad
    //% weight=60
    export function ecranRotationImage(num: number, angle: number) {
        setAngleIcon(num, angle * 10)
    }

    //% block="écran supprimer %type=EcranObjetSupprimable_conv numéro %num"
    //% num.min=1 num.max=255 num.defl=1
    //% group="Écran"
    //% color=#8e44ad
    //% weight=8
    export function ecranSupprimerObjet(type: number, num: number) {
        switch (type) {
            case EcranObjetSupprimable.Text:
                deleteString(num)
                break
            case EcranObjetSupprimable.Icon:
                deleteIcon(num)
                break
        }
    }

    //% blockId="EcranObjetSupprimable_conv" block="%item"
    //% weight=1 blockHidden=true
    export function getObjetSupprimable(item: EcranObjetSupprimable): number {
        return item as number
    }

    function nettoyerEcran() {
        let cmd = creatCommand(0x1D, 0x04)
        writeCommand(cmd, 4)
        basic.pause(1500)
    }

    function setBackgroundColor(color: number) {
        let cmd = creatCommand(CMD_SET_BACKGROUND_COLOR, CMD_SET_LEN)
        cmd = cmd.concat(data24Tobyte(color))
        writeCommand(cmd, CMD_SET_LEN)
        basic.pause(300)
    }

    function setBackgroundImg(location: number, str: string) {
        let len = str.length
        let cmd = creatCommand(CMD_SET_BACKGROUND_IMG, len + 5)
        cmd = cmd.concat([location])
        str.split("").forEach(v => cmd.push(v.charCodeAt(0)))
        writeCommand(cmd, len + 5)
    }

    function updateString(id: number, x: number, y: number, str: string, fontSize: number, color: number) {
        let len = str.length > 242 ? 242 : str.length
        let cmd = creatCommand(CMD_OF_DRAW_TEXT, len + 13)
        cmd = cmd.concat([id, fontSize]).concat(data24Tobyte(color)).concat(data16Tobyte(x)).concat(data16Tobyte(y))
        str.split("").forEach(v => cmd.push(v.charCodeAt(0)))
        writeCommand(cmd, len + 13)
    }

    function deleteString(id: number) {
        let cmd = creatCommand(CMD_DELETE_OBJ, CMD_DELETE_OBJ_LEN)
        cmd = cmd.concat([CMD_OF_DRAW_TEXT, id])
        writeCommand(cmd, CMD_DELETE_OBJ_LEN)
        deleteNodeByID(list.textHead, id)
    }

    function setAngleIcon(id: number, angle: number) {
        let cmd = creatCommand(CMD_SET_ANGLE_OBJ, CMD_SET_ANGLE_OBJ_LEN)
        cmd = cmd.concat([CMD_OF_DRAW_ICON_INTERNAL, id]).concat(data16Tobyte(angle))
        writeCommand(cmd, CMD_SET_ANGLE_OBJ_LEN)
    }

    function updateIcon(id: number, x: number, y: number, str: string, zoom: number) {
        let len = str.length
        let cmd = creatCommand(CMD_OF_DRAW_ICON_EXTERNAL, len + 11)
        cmd = cmd.concat([id]).concat(data16Tobyte(zoom)).concat(data16Tobyte(x)).concat(data16Tobyte(y))
        str.split("").forEach(v => cmd.push(v.charCodeAt(0)))
        writeCommand(cmd, len + 11)
    }

    function deleteIcon(id: number) {
        let cmd = creatCommand(CMD_DELETE_OBJ, CMD_DELETE_OBJ_LEN)
        cmd = cmd.concat([CMD_OF_DRAW_ICON_INTERNAL, id])
        writeCommand(cmd, CMD_DELETE_OBJ_LEN)
        deleteNodeByID(list.iconHead, id)
    }

    function creerListes() {
        list = {
            textHead: new LinkedList(),
            iconHead: new LinkedList()
        }
    }

    function deleteNodeByID(linkList: LinkedList, id: number) {
        linkList.removeId(id)
    }

    function data16Tobyte(data: number): number[] {
        return [(data >> 8) & 0xFF, data & 0xFF]
    }

    function data24Tobyte(data: number): number[] {
        return [(data >> 16) & 0xFF, (data >> 8) & 0xFF, data & 0xFF]
    }

    function colorToCustom(color: number): number {
        switch (color) {
            case 0x999999:
                return 0x696969
            case 0x7f00ff:
                return 0x800080
            default:
                return color
        }
    }

    function creatCommand(cmd: number, len: number): number[] {
        return [CMD_HEADER_HIGH, CMD_HEADER_LOW, len - CMDLEN_OF_HEAD_LEN, cmd]
    }

    function writeCommand(data: number[], len: number) {
        if (protocol == ProtocoleEcran.IIC) {
            let remain = len
            let i = 0
            while (remain > 0) {
                let currentTransferSize = (remain > IIC_MAX_TRANSFER_SIZE) ? 32 : remain
                if (remain > IIC_MAX_TRANSFER_SIZE) {
                    pins.i2cWriteBuffer(
                        address,
                        pins.createBufferFromArray(data.slice(i * IIC_MAX_TRANSFER_SIZE, i * IIC_MAX_TRANSFER_SIZE + currentTransferSize)),
                        true
                    )
                } else {
                    pins.i2cWriteBuffer(
                        address,
                        pins.createBufferFromArray(data.slice(i * IIC_MAX_TRANSFER_SIZE, i * IIC_MAX_TRANSFER_SIZE + currentTransferSize)),
                        false
                    )
                }
                remain = remain - currentTransferSize
                i = i + 1
            }
        }
    }
}
