
//% color=#5b3fe8

const enum EcranWidgetCategorie1 {
    //% block="curseur (01)"
    Slider = 1,
    //% block="barre (02)"
    Bar = 2,
    //% block="boussole (03)"
    Compass = 3,
    //% block="jauge (04)"
    Gauge = 4,
    //% block="vu-mètre (05)"
    LineMeter = 5,
}

const enum EcranWidgetCategorie2 {
    //% block="curseur (01)"
    Slider = 1,
    //% block="barre (02)"
    Bar = 2,
    //% block="boussole (03)"
    Compass = 3,
    //% block="jauge (04)"
    Gauge = 4,
    //% block="vu-mètre (05)"
    LineMeter = 5,
    //% block="graphique (06)"
    Chart = 6,
    //% block="texte (07)"
    Text = 7,
    //% block="ligne (08)"
    Line = 8,
    //% block="rectangle (09)"
    Rectangle = 9,
    //% block="cercle (10)"
    Circle = 10,
    //% block="triangle (11)"
    Triangle = 11,
    //% block="image (12)"
    Icon = 12,
    //% block="gif (13)"
    Gif = 13,
}

namespace a4_ms_stationnement {

    export enum TaillePolice {
        //% block="grande"
        Large = 1,
        //% block="petite"
        Small = 2,
    }

    export enum RectangleArrondi {
        //% block="arrondi"
        IsRound = 1,
        //% block="non arrondi"
        NoneRound = 2,
    }

    export enum StyleGraphique {
        //% block="courbe"
        LineChart = 3,
        //% block="barres"
        BarChart = 2,
        //% block="courbe remplie"
        ShadingLineChart = 1,
    }

    export enum TypeRemplissage {
        //% block="rempli"
        Fill = 1,
        //% block="non rempli"
        NotFill = 2,
    }

    export enum ProtocoleEcran {
        IIC = 1,
        Serial = 2,
    }

    const IIC_MAX_TRANSFER_SIZE = 32

    const CMDLEN_OF_HEAD_LEN = 3
    const CMD_DELETE_OBJ_LEN = 0x06
    const CMD_SET_TOP_OBJ_LEN = 0x06
    const CMD_SET_COMPASS_VALUE_LEN = 0x07
    const CMD_SET_LEN = 0x07
    const CMD_SET_GAUGE_VALUE_LEN = 0x07
    const CMD_SET_LINE_METER_VALUE_LEN = 0x07
    const CMD_SET_BAR_VALUE_LEN = 0x07
    const CMD_SET_SLIDER_VALUE_LEN = 0x07
    const CMD_SET_ANGLE_OBJ_LEN = 0x08
    const CMD_DRAW_COMPASS_LEN = 0x0B
    const CMD_DRAW_CHART_LEN = 0x09
    const CMD_DRAW_SERIE_LEN = 0x09
    const CMD_OF_DRAW_BAR_LEN = 0x10
    const CMD_OF_DRAW_SLIDER_LEN = 0x10
    const CMD_DRAW_LINE_LEN = 0x11
    const CMD_OF_DRAW_CIRCLE_LEN = 0x13
    const CMD_OF_DRAW_GAUGE_LEN = 0x15
    const CMD_OF_DRAW_LINE_METER_LEN = 0x15
    const CMD_OF_DRAW_RECT_LEN = 0x16
    const CMD_OF_DRAW_TRIANGLE_LEN = 0x19

    const CMD_SET_BACKGROUND_COLOR = 0x19
    const CMD_SET_BACKGROUND_IMG = 0x1A
    const CMD_OF_DRAW_LINE = 0x03
    const CMD_OF_DRAW_RECT = 0x04
    const CMD_OF_DRAW_CIRCLE = 0x06
    const CMD_OF_DRAW_TRIANGLE = 0x07
    const CMD_OF_DRAW_ICON_INTERNAL = 0x08
    const CMD_OF_DRAW_ICON_EXTERNAL = 0x09
    const CMD_OF_DRAW_BAR = 0x0A
    const CMD_OF_DRAW_BAR_VALUE = 0x0B
    const CMD_OF_DRAW_SLIDER = 0x0C
    const CMD_OF_DRAW_SLIDER_VALUE = 0x0D
    const CMD_OF_DRAW_COMPASS = 0x0E
    const CMD_OF_DRAW_COMPASS_VALUE = 0x0F
    const CMD_OF_DRAW_LINE_METER = 0x10
    const CMD_OF_DRAW_LINE_METER_VALUE = 0x11
    const CMD_OF_DRAW_GAUGE = 0x12
    const CMD_OF_DRAW_GAUGE_VALUE = 0x13
    const CMD_OF_DRAW_LINE_CHART = 0x14
    const CMD_OF_DRAW_LINE_CHART_TEXT = 0x15
    const CMD_OF_DRAW_SERIE = 0x16
    const CMD_OF_DRAW_SERIE_DATA = 0x17
    const CMD_OF_DRAW_TEXT = 0x18
    const CMD_DELETE_OBJ = 0x1B
    const CMD_SET_TOP_OBJ = 0x1C
    const CMD_SET_ANGLE_OBJ = 0x1E
    const CMD_OF_DRAW_GIF_INTERNAL = 0x1F
    const CMD_OF_DRAW_GIF_EXTERNAL = 0x20

    const CMD_HEADER_HIGH = 0x55
    const CMD_HEADER_LOW = 0xaa

    let address = 0x2c

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
        lineChartHead: LinkedList,
        seriesHead: LinkedList,
        compassHead: LinkedList,
        textHead: LinkedList,
        gaugeHead: LinkedList,
        lineHead: LinkedList,
        rectHead: LinkedList,
        circleHead: LinkedList,
        triangleHead: LinkedList,
        lineMeterHead: LinkedList,
        barHead: LinkedList,
        sliderHead: LinkedList,
        iconHead: LinkedList,
        gifHead: LinkedList,
    }

    let list: GenericList
    let protocol: ProtocoleEcran = ProtocoleEcran.IIC
    let chartID = 0
    let axisListX: string[] = []
    let axisListY: string[] = []
    let axisYData: number[] = []
    let seriesData: any = {}
    let dataFactor = 1

    //% block="écran initialiser en I2C"
    //% group="Écran"
    //% weight=100
    export function ecranInitialiserI2C() {
        creerListes()
        protocol = ProtocoleEcran.IIC
        basic.pause(1000)
    }

    //% block="écran effacer tout"
    //% group="Écran"
    //% weight=95
    export function ecranEffacerTout() {
        nettoyerEcran()
    }

    //% block="écran définir couleur de fond %color"
    //% color.shadow="colorNumberPicker"
    //% group="Écran"
    //% weight=90
    export function ecranCouleurFond(color: number) {
        setBackgroundColor(colorToCustom(color))
    }

    //% block="couleur RVB rouge %red vert %green bleu %blue"
    //% red.min=0 red.max=255 red.defl=255
    //% green.min=0 green.max=255 green.defl=255
    //% blue.min=0 blue.max=255 blue.defl=255
    //% group="Écran"
    //% weight=85
    export function ecranCouleurRVB(red: number, green: number, blue: number): number {
        return (red << 16) + (green << 8) + blue
    }

    //% block="écran définir image de fond %picture"
    //% group="Écran"
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
    //% weight=65
    export function ecranAfficherImage(num: number, name: string, x: number, y: number, size: number) {
        updateIcon(num, x, y, name, size)
    }

    //% block="écran rotation image numéro %num angle %angle"
    //% num.min=1 num.max=255 num.defl=1
    //% angle.min=0 angle.max=360 angle.defl=180
    //% group="Écran"
    //% weight=60
    export function ecranRotationImage(num: number, angle: number) {
        setAngleIcon(num, angle * 10)
    }

    //% block="écran afficher gif numéro %num nom %name position x %x y %y taille %size"
    //% num.min=1 num.max=255 num.defl=1
    //% x.min=0 x.max=320 x.defl=120
    //% y.min=0 y.max=240 y.defl=120
    //% size.min=0 size.max=512 size.defl=256
    //% inlineInputMode=inline
    //% group="Écran"
    //% weight=58
    export function ecranAfficherGif(num: number, name: string, x: number, y: number, size: number) {
        updateGif(num, x, y, name, size)
    }

    //% block="écran tracer ligne numéro %num x1 %x1 y1 %y1 x2 %x2 y2 %y2 largeur %width couleur %color"
    //% num.min=1 num.max=255 num.defl=1
    //% x1.min=0 x1.max=320 x1.defl=40
    //% y1.min=0 y1.max=240 y1.defl=120
    //% x2.min=0 x2.max=320 x2.defl=300
    //% y2.min=0 y2.max=240 y2.defl=120
    //% color.shadow="colorNumberPicker"
    //% inlineInputMode=inline
    //% group="Écran"
    //% weight=55
    export function ecranTracerLigne(num: number, x1: number, y1: number, x2: number, y2: number, width: number, color: number) {
        updateLine(num, x1, y1, x2, y2, width, color)
    }

    //% block="écran tracer rectangle numéro %num x %x y %y largeur %w hauteur %h épaisseur %width couleur contour %bocolor %fill couleur remplissage %fcolor %round"
    //% num.min=1 num.max=255 num.defl=1
    //% x.min=0 x.max=320 x.defl=0
    //% y.min=0 y.max=240 y.defl=0
    //% w.min=0 w.max=320 w.defl=300
    //% h.min=0 h.max=240 h.defl=200
    //% bocolor.shadow="colorNumberPicker"
    //% fcolor.shadow="colorNumberPicker"
    //% inlineInputMode=inline
    //% group="Écran"
    //% weight=50
    export function ecranTracerRectangle(num: number, x: number, y: number, w: number, h: number, width: number, bocolor: number, fill: TypeRemplissage, fcolor: number, round: RectangleArrondi) {
        updateRect(num, x, y, w, h, width, bocolor, fill === TypeRemplissage.Fill ? 1 : 0, fcolor, round === RectangleArrondi.IsRound ? 1 : 0)
    }

    //% block="écran tracer cercle numéro %num centre x %x y %y rayon %r épaisseur %width couleur contour %bocolor %fill couleur remplissage %fcolor"
    //% num.min=1 num.max=255 num.defl=1
    //% x.min=0 x.max=320 x.defl=160
    //% y.min=0 y.max=240 y.defl=120
    //% r.min=0 r.max=120 r.defl=120
    //% bocolor.shadow="colorNumberPicker"
    //% fcolor.shadow="colorNumberPicker"
    //% inlineInputMode=inline
    //% group="Écran"
    //% weight=45
    export function ecranTracerCercle(num: number, x: number, y: number, r: number, width: number, bocolor: number, fill: TypeRemplissage, fcolor: number) {
        updateCircle(num, x, y, r, width, bocolor, fill === TypeRemplissage.Fill ? 1 : 0, fcolor)
    }

    //% block="écran tracer triangle numéro %num x1 %x1 y1 %y1 x2 %x2 y2 %y2 x3 %x3 y3 %y3 épaisseur %width couleur contour %bocolor %fill couleur remplissage %fcolor"
    //% num.min=1 num.max=255 num.defl=1
    //% x1.min=0 x1.max=320 x1.defl=160
    //% y1.min=0 y1.max=240 y1.defl=0
    //% x2.min=0 x2.max=320 x2.defl=0
    //% y2.min=0 y2.max=240 y2.defl=240
    //% x3.min=0 x3.max=320 x3.defl=320
    //% y3.min=0 y3.max=240 y3.defl=240
    //% bocolor.shadow="colorNumberPicker"
    //% fcolor.shadow="colorNumberPicker"
    //% inlineInputMode=inline
    //% group="Écran"
    //% weight=40
    export function ecranTracerTriangle(num: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, width: number, bocolor: number, fill: TypeRemplissage, fcolor: number) {
        updateTriangle(num, x1, y1, x2, y2, x3, y3, width, bocolor, fill === TypeRemplissage.Fill ? 1 : 0, fcolor)
    }

    //% block="écran créer curseur numéro %num x %x y %y largeur %w hauteur %h couleur %color"
    //% num.min=1 num.max=255 num.defl=1
    //% x.min=0 x.max=320 x.defl=80
    //% y.min=0 y.max=240 y.defl=120
    //% w.min=0 w.max=320 w.defl=200
    //% h.min=0 h.max=240 h.defl=20
    //% color.shadow="colorNumberPicker"
    //% inlineInputMode=inline
    //% group="Écran"
    //% weight=35
    export function ecranCreerCurseur(num: number, x: number, y: number, w: number, h: number, color: number) {
        updateSlider(num, x, y, w, h, color)
    }

    //% block="écran créer barre numéro %num x %x y %y largeur %w hauteur %h couleur %color"
    //% num.min=1 num.max=255 num.defl=1
    //% x.min=0 x.max=320 x.defl=80
    //% y.min=0 y.max=240 y.defl=120
    //% w.min=0 w.max=320 w.defl=200
    //% h.min=0 h.max=240 h.defl=20
    //% color.shadow="colorNumberPicker"
    //% inlineInputMode=inline
    //% group="Écran"
    //% weight=30
    export function ecranCreerBarre(num: number, x: number, y: number, w: number, h: number, color: number) {
        updateBar(num, x, y, w, h, color)
    }

    //% block="écran créer boussole numéro %num x %x y %y rayon %r"
    //% num.min=1 num.max=255 num.defl=1
    //% x.min=0 x.max=320 x.defl=50
    //% y.min=0 y.max=240 y.defl=0
    //% r.min=0 r.max=320 r.defl=240
    //% inlineInputMode=inline
    //% group="Écran"
    //% weight=25
    export function ecranCreerBoussole(num: number, x: number, y: number, r: number) {
        updateCompass(num, x, y, r)
    }

    //% block="écran créer jauge numéro %num x %x y %y rayon %r début %start fin %end couleur aiguille %color couleur fond %dcolor"
    //% num.min=1 num.max=255 num.defl=1
    //% color.shadow="colorNumberPicker"
    //% dcolor.shadow="colorNumberPicker"
    //% inlineInputMode=inline
    //% group="Écran"
    //% weight=20
    export function ecranCreerJauge(num: number, x: number, y: number, r: number, start: number, end: number, color: number, dcolor: number) {
        updateGauge(num, x, y, r, start, end, color, dcolor)
    }

    //% block="écran créer vu-mètre numéro %num x %x y %y taille %r début %start fin %end couleur données %color couleur fond %dcolor"
    //% num.min=1 num.max=255 num.defl=1
    //% color.shadow="colorNumberPicker"
    //% dcolor.shadow="colorNumberPicker"
    //% inlineInputMode=inline
    //% group="Écran"
    //% weight=18
    export function ecranCreerVuMetre(num: number, x: number, y: number, r: number, start: number, end: number, color: number, dcolor: number) {
        updateLineMeter(num, x, y, r, start, end, color, dcolor)
    }

    //% block="écran définir donnée widget %type=EcranWidgetCategorie1_conv numéro %num valeur %data"
    //% num.min=1 num.max=255 num.defl=1
    //% group="Écran"
    //% weight=17
    export function ecranDefinirWidget(type: number, num: number, data: number) {
        switch (type) {
            case EcranWidgetCategorie1.Slider:
                setSliderValue(num, data)
                break
            case EcranWidgetCategorie1.Bar:
                setBarValue(num, data)
                break
            case EcranWidgetCategorie1.Compass:
                setCompassScale(num, (data / 360) * 3600)
                break
            case EcranWidgetCategorie1.Gauge:
                setGaugeValue(num, data)
                break
            case EcranWidgetCategorie1.LineMeter:
                setMeterValue(num, data)
                break
        }
    }

    //% block="écran créer graphique numéro %num axe X %xaxis axe Y %yaxis couleur fond %color style %styles"
    //% num.min=1 num.max=255 num.defl=1
    //% color.shadow="colorNumberPicker"
    //% inlineInputMode=inline
    //% group="Écran"
    //% weight=16
    export function ecranCreerGraphique(num: number, xaxis: string, yaxis: string, color: number, styles: StyleGraphique) {
        chartID = num
        axisListX = xaxis.split(" ")
        axisListY = yaxis.split(" ")
        axisYData = []
        axisListX.forEach(() => axisYData.push(0))
        dataFactor = Math.abs((parseInt(axisListY[0]) - parseInt(axisListY[axisListY.length - 1])) / 100)
        updateChart(chartID, color, styles)
        basic.pause(100)
        setChartAxisTexts(chartID, 0, axisListX)
        basic.pause(100)
        setChartAxisTexts(chartID, 1, axisListY)
    }

    //% block="écran ajouter série graphique numéro %num couleur %color"
    //% num.min=1 num.max=255 num.defl=1
    //% color.shadow="colorNumberPicker"
    //% group="Écran"
    //% weight=14
    export function ecranAjouterSerieGraphique(num: number, color: number) {
        seriesData[num] = axisYData
        updateChartSeries(chartID, num, color)
        addChartSeriesData(chartID, num, seriesData[num], axisListX.length)
    }

    //% block="écran définir donnée graphique numéro %num axe X %xaxis valeur %data"
    //% num.min=1 num.max=255 num.defl=1
    //% group="Écran"
    //% weight=12
    export function ecranDefinirPointGraphique(num: number, xaxis: string, data: number) {
        let index = axisListX.indexOf(xaxis)
        if (data < parseInt(axisListY[axisListY.length - 1]) || data > parseInt(axisListY[0])) return
        if (index != -1) {
            updateChartPoint(chartID, num, index, Math.round((data - parseInt(axisListY[axisListY.length - 1])) / dataFactor))
        }
    }

    //% block="écran mettre à jour graphique numéro %num couleur fond %color style %styles"
    //% color.shadow="colorNumberPicker"
    //% group="Écran"
    //% weight=11
    export function ecranMajGraphique(num: number, color: number, styles: StyleGraphique) {
        updateChart(num, color, styles)
    }

    //% block="écran supprimer %type=EcranWidgetCategorie2_conv numéro %num"
    //% num.min=1 num.max=255 num.defl=1
    //% group="Écran"
    //% weight=8
    export function ecranSupprimerObjet(type: number, num: number) {
        switch (type) {
            case EcranWidgetCategorie2.Slider: deleteSlider(num); break
            case EcranWidgetCategorie2.Bar: deleteBar(num); break
            case EcranWidgetCategorie2.Compass: deleteCompass(num); break
            case EcranWidgetCategorie2.Gauge: deleteGauge(num); break
            case EcranWidgetCategorie2.LineMeter: deleteLineMeter(num); break
            case EcranWidgetCategorie2.Chart: deleteChart(num); break
            case EcranWidgetCategorie2.Text: deleteString(num); break
            case EcranWidgetCategorie2.Line: deleteLine(num); break
            case EcranWidgetCategorie2.Rectangle: deleteRect(num); break
            case EcranWidgetCategorie2.Circle: deleteCircle(num); break
            case EcranWidgetCategorie2.Triangle: deleteTriangle(num); break
            case EcranWidgetCategorie2.Icon: deleteIcon(num); break
            case EcranWidgetCategorie2.Gif: deleteGif(num); break
        }
    }

    //% blockId="EcranWidgetCategorie1_conv" block="%item"
    //% weight=2 blockHidden=true
    export function getWidgetCategorie1(item: EcranWidgetCategorie1): number {
        return item as number
    }

    //% blockId="EcranWidgetCategorie2_conv" block="%item"
    //% weight=1 blockHidden=true
    export function getWidgetCategorie2(item: EcranWidgetCategorie2): number {
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

    function updateGif(id: number, x: number, y: number, str: string, zoom: number) {
        let len = str.length
        let cmd = creatCommand(CMD_OF_DRAW_GIF_EXTERNAL, len + 11)
        cmd = cmd.concat([id]).concat(data16Tobyte(zoom)).concat(data16Tobyte(x)).concat(data16Tobyte(y))
        str.split("").forEach(v => cmd.push(v.charCodeAt(0)))
        writeCommand(cmd, len + 11)
    }

    function deleteGif(id: number) {
        let cmd = creatCommand(CMD_DELETE_OBJ, CMD_DELETE_OBJ_LEN)
        cmd = cmd.concat([CMD_OF_DRAW_GIF_INTERNAL, id])
        writeCommand(cmd, CMD_DELETE_OBJ_LEN)
        deleteNodeByID(list.gifHead, id)
    }

    function updateLine(id: number, x0: number, y0: number, x1: number, y1: number, width: number, color: number) {
        let cmd = creatCommand(CMD_OF_DRAW_LINE, CMD_DRAW_LINE_LEN)
        cmd = cmd.concat([id, width]).concat(data24Tobyte(color)).concat(data16Tobyte(x0)).concat(data16Tobyte(y0)).concat(data16Tobyte(x1)).concat(data16Tobyte(y1))
        writeCommand(cmd, CMD_DRAW_LINE_LEN)
        basic.pause(10)
    }

    function deleteLine(id: number) {
        let cmd = creatCommand(CMD_DELETE_OBJ, CMD_DELETE_OBJ_LEN)
        cmd = cmd.concat([CMD_OF_DRAW_LINE, id])
        writeCommand(cmd, CMD_DELETE_OBJ_LEN)
        deleteNodeByID(list.lineHead, id)
    }

    function updateRect(id: number, x: number, y: number, w: number, h: number, bw: number, boColor: number, fill: number, fillColor: number, rounded: number) {
        let cmd = creatCommand(CMD_OF_DRAW_RECT, CMD_OF_DRAW_RECT_LEN)
        cmd = cmd.concat([id, bw]).concat(data24Tobyte(boColor)).concat([fill]).concat(data24Tobyte(fillColor)).concat([rounded]).concat(data16Tobyte(x)).concat(data16Tobyte(y)).concat(data16Tobyte(w)).concat(data16Tobyte(h))
        writeCommand(cmd, CMD_OF_DRAW_RECT_LEN)
    }

    function deleteRect(id: number) {
        let cmd = creatCommand(CMD_DELETE_OBJ, CMD_DELETE_OBJ_LEN)
        cmd = cmd.concat([CMD_OF_DRAW_RECT, id])
        writeCommand(cmd, CMD_DELETE_OBJ_LEN)
        deleteNodeByID(list.rectHead, id)
    }

    function updateCircle(id: number, x: number, y: number, r: number, bw: number, boColor: number, fill: number, fillColor: number) {
        let cmd = creatCommand(CMD_OF_DRAW_CIRCLE, CMD_OF_DRAW_CIRCLE_LEN)
        cmd = cmd.concat([id, bw]).concat(data24Tobyte(boColor)).concat([fill]).concat(data24Tobyte(fillColor)).concat(data16Tobyte(r)).concat(data16Tobyte(x)).concat(data16Tobyte(y))
        writeCommand(cmd, CMD_OF_DRAW_CIRCLE_LEN)
    }

    function deleteCircle(id: number) {
        let cmd = creatCommand(CMD_DELETE_OBJ, CMD_DELETE_OBJ_LEN)
        cmd = cmd.concat([CMD_OF_DRAW_CIRCLE, id])
        writeCommand(cmd, CMD_DELETE_OBJ_LEN)
        deleteNodeByID(list.circleHead, id)
    }

    function updateTriangle(id: number, x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, bw: number, boColor: number, fill: number, fillColor: number) {
        let cmd = creatCommand(CMD_OF_DRAW_TRIANGLE, CMD_OF_DRAW_TRIANGLE_LEN)
        cmd = cmd.concat([id, bw]).concat(data24Tobyte(boColor)).concat([fill]).concat(data24Tobyte(fillColor)).concat(data16Tobyte(x0)).concat(data16Tobyte(y0)).concat(data16Tobyte(x1)).concat(data16Tobyte(y1)).concat(data16Tobyte(x2)).concat(data16Tobyte(y2))
        writeCommand(cmd, CMD_OF_DRAW_TRIANGLE_LEN)
    }

    function deleteTriangle(id: number) {
        let cmd = creatCommand(CMD_DELETE_OBJ, CMD_DELETE_OBJ_LEN)
        cmd = cmd.concat([CMD_OF_DRAW_TRIANGLE, id])
        writeCommand(cmd, CMD_DELETE_OBJ_LEN)
        deleteNodeByID(list.triangleHead, id)
    }

    function updateSlider(id: number, x: number, y: number, w: number, h: number, color: number) {
        let cmd = creatCommand(CMD_OF_DRAW_SLIDER, CMD_OF_DRAW_SLIDER_LEN)
        cmd = cmd.concat([id]).concat(data24Tobyte(color)).concat(data16Tobyte(x)).concat(data16Tobyte(y)).concat(data16Tobyte(w)).concat(data16Tobyte(h))
        writeCommand(cmd, CMD_OF_DRAW_SLIDER_LEN)
    }

    function setSliderValue(id: number, value: number) {
        let cmd = creatCommand(CMD_OF_DRAW_SLIDER_VALUE, CMD_SET_SLIDER_VALUE_LEN)
        cmd = cmd.concat([id]).concat(data16Tobyte(value))
        writeCommand(cmd, CMD_SET_SLIDER_VALUE_LEN)
    }

    function deleteSlider(id: number) {
        let cmd = creatCommand(CMD_DELETE_OBJ, CMD_DELETE_OBJ_LEN)
        cmd = cmd.concat([CMD_OF_DRAW_SLIDER, id])
        writeCommand(cmd, CMD_DELETE_OBJ_LEN)
        deleteNodeByID(list.sliderHead, id)
    }

    function updateBar(id: number, x: number, y: number, w: number, h: number, color: number) {
        let cmd = creatCommand(CMD_OF_DRAW_BAR, CMD_OF_DRAW_BAR_LEN)
        cmd = cmd.concat([id]).concat(data24Tobyte(color)).concat(data16Tobyte(x)).concat(data16Tobyte(y)).concat(data16Tobyte(w)).concat(data16Tobyte(h))
        writeCommand(cmd, CMD_OF_DRAW_BAR_LEN)
    }

    function setBarValue(id: number, value: number) {
        let cmd = creatCommand(CMD_OF_DRAW_BAR_VALUE, CMD_SET_BAR_VALUE_LEN)
        cmd = cmd.concat([id]).concat(data16Tobyte(value))
        writeCommand(cmd, CMD_SET_BAR_VALUE_LEN)
    }

    function deleteBar(id: number) {
        let cmd = creatCommand(CMD_DELETE_OBJ, CMD_DELETE_OBJ_LEN)
        cmd = cmd.concat([CMD_OF_DRAW_BAR, id])
        writeCommand(cmd, CMD_DELETE_OBJ_LEN)
        deleteNodeByID(list.barHead, id)
    }

    function updateCompass(id: number, x: number, y: number, diameter: number) {
        let cmd = creatCommand(CMD_OF_DRAW_COMPASS, CMD_DRAW_COMPASS_LEN)
        cmd = cmd.concat([id]).concat(data16Tobyte(diameter)).concat(data16Tobyte(x)).concat(data16Tobyte(y))
        writeCommand(cmd, CMD_DRAW_COMPASS_LEN)
    }

    function setCompassScale(id: number, scale: number) {
        let cmd = creatCommand(CMD_OF_DRAW_COMPASS_VALUE, CMD_SET_COMPASS_VALUE_LEN)
        cmd = cmd.concat([id]).concat(data16Tobyte(scale))
        writeCommand(cmd, CMD_SET_COMPASS_VALUE_LEN)
    }

    function deleteCompass(id: number) {
        let cmd = creatCommand(CMD_DELETE_OBJ, CMD_DELETE_OBJ_LEN)
        cmd = cmd.concat([CMD_OF_DRAW_COMPASS, id])
        writeCommand(cmd, CMD_DELETE_OBJ_LEN)
        deleteNodeByID(list.compassHead, id)
    }

    function updateGauge(id: number, x: number, y: number, diameter: number, start: number, end: number, pointerColor: number, bgColor: number) {
        let cmd = creatCommand(CMD_OF_DRAW_GAUGE, CMD_OF_DRAW_GAUGE_LEN)
        cmd = cmd.concat([id]).concat(data16Tobyte(diameter)).concat(data16Tobyte(start)).concat(data16Tobyte(end)).concat(data24Tobyte(pointerColor)).concat(data24Tobyte(bgColor)).concat(data16Tobyte(x)).concat(data16Tobyte(y))
        writeCommand(cmd, CMD_OF_DRAW_GAUGE_LEN)
    }

    function setGaugeValue(id: number, value: number) {
        let cmd = creatCommand(CMD_OF_DRAW_GAUGE_VALUE, CMD_SET_GAUGE_VALUE_LEN)
        cmd = cmd.concat([id]).concat(data16Tobyte(value))
        writeCommand(cmd, CMD_SET_GAUGE_VALUE_LEN)
    }

    function deleteGauge(id: number) {
        let cmd = creatCommand(CMD_DELETE_OBJ, CMD_DELETE_OBJ_LEN)
        cmd = cmd.concat([CMD_OF_DRAW_GAUGE, id])
        writeCommand(cmd, CMD_DELETE_OBJ_LEN)
        deleteNodeByID(list.gaugeHead, id)
    }

    function updateLineMeter(id: number, x: number, y: number, size: number, start: number, end: number, pointerColor: number, bgColor: number) {
        let cmd = creatCommand(CMD_OF_DRAW_LINE_METER, CMD_OF_DRAW_LINE_METER_LEN)
        cmd = cmd.concat([id]).concat(data16Tobyte(size)).concat(data16Tobyte(start)).concat(data16Tobyte(end)).concat(data24Tobyte(pointerColor)).concat(data24Tobyte(bgColor)).concat(data16Tobyte(x)).concat(data16Tobyte(y))
        writeCommand(cmd, CMD_OF_DRAW_LINE_METER_LEN)
    }

    function deleteLineMeter(id: number) {
        let cmd = creatCommand(CMD_DELETE_OBJ, CMD_DELETE_OBJ_LEN)
        cmd = cmd.concat([CMD_OF_DRAW_LINE_METER, id])
        writeCommand(cmd, CMD_DELETE_OBJ_LEN)
        deleteNodeByID(list.lineMeterHead, id)
    }

    function updateChart(id: number, bgColor: number, type: number) {
        let cmd = creatCommand(CMD_OF_DRAW_LINE_CHART, CMD_DRAW_CHART_LEN)
        cmd = cmd.concat([id, type]).concat(data24Tobyte(bgColor))
        writeCommand(cmd, CMD_DRAW_CHART_LEN)
    }

    function updateChartSeries(chartId: number, seriesId: number, color: number) {
        let cmd = creatCommand(CMD_OF_DRAW_SERIE, CMD_DRAW_SERIE_LEN)
        cmd = cmd.concat([seriesId, chartId]).concat(data24Tobyte(color))
        writeCommand(cmd, CMD_DRAW_SERIE_LEN)
    }

    function setChartAxisTexts(chartId: number, axis: number, text: string[]) {
        let len = text.length - 1
        text.forEach(value => len = len + value.length)
        let cmd = creatCommand(CMD_OF_DRAW_LINE_CHART_TEXT, len + 6)
        cmd = cmd.concat([chartId, axis])
        for (let i = 0; i < text.length; i++) {
            text[i].split("").forEach(v => cmd.push(v.charCodeAt(0)))
            if (i != text.length - 1) cmd.push(0x0A)
        }
        writeCommand(cmd, len + 6)
    }

    function updateChartPoint(chartId: number, seriesId: number, pointNum: number, value: number) {
        let cmd = creatCommand(CMD_OF_DRAW_SERIE_DATA, 10)
        cmd = cmd.concat([chartId, seriesId, 1, pointNum]).concat(data16Tobyte(value))
        writeCommand(cmd, 10)
    }

    function addChartSeriesData(chartId: number, seriesId: number, point: number[], len: number): number {
        let cmd = creatCommand(CMD_OF_DRAW_SERIE_DATA, len * 2 + 8)
        cmd = cmd.concat([chartId, seriesId, 0, 0])
        point.forEach(value => cmd = cmd.concat(data16Tobyte(value)))
        writeCommand(cmd, len * 2 + 8)
        return 1
    }

    function setMeterValue(lineMeterId: number, value: number) {
        let cmd = creatCommand(CMD_OF_DRAW_LINE_METER_VALUE, CMD_SET_LINE_METER_VALUE_LEN)
        cmd = cmd.concat([lineMeterId]).concat(data16Tobyte(value))
        writeCommand(cmd, CMD_SET_LINE_METER_VALUE_LEN)
    }

    function creerListes() {
        list = {
            lineChartHead: new LinkedList(),
            seriesHead: new LinkedList(),
            compassHead: new LinkedList(),
            textHead: new LinkedList(),
            gaugeHead: new LinkedList(),
            lineHead: new LinkedList(),
            rectHead: new LinkedList(),
            circleHead: new LinkedList(),
            triangleHead: new LinkedList(),
            lineMeterHead: new LinkedList(),
            barHead: new LinkedList(),
            sliderHead: new LinkedList(),
            iconHead: new LinkedList(),
            gifHead: new LinkedList(),
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
            case 0x999999: return 0x696969
            case 0x7f00ff: return 0x800080
            default: return color
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
                    pins.i2cWriteBuffer(address, pins.createBufferFromArray(data.slice(i * IIC_MAX_TRANSFER_SIZE, i * IIC_MAX_TRANSFER_SIZE + currentTransferSize)), true)
                } else {
                    pins.i2cWriteBuffer(address, pins.createBufferFromArray(data.slice(i * IIC_MAX_TRANSFER_SIZE, i * IIC_MAX_TRANSFER_SIZE + currentTransferSize)), false)
                }
                remain = remain - currentTransferSize
                i = i + 1
            }
        }
    }
}
