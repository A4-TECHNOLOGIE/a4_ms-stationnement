namespace a4_ms_stationnement {

    // =========================
    // ÉCRAN
    // =========================

    // Les noms exacts des fonctions dépendent du namespace exporté
    // par pxt-DFRobot_lcdDisplay.
    // Dans beaucoup d'extensions DFRobot, le namespace est lcdDisplay.
    // Si besoin, ajuste seulement le préfixe "lcdDisplay.".

    //% block="écran initialiser"
    //% group="Écran"
    //% weight=100
    export function ecranInitialiser(): void {
        lcdDisplay.begin()
    }

    //% block="écran effacer"
    //% group="Écran"
    //% weight=95
    export function ecranEffacer(): void {
        lcdDisplay.clear()
    }

    //% block="écran couleur de fond %color"
    //% group="Écran"
    //% weight=90
    export function ecranCouleurFond(color: number): void {
        lcdDisplay.setBackgroundColor(color)
    }

    //% block="écran image de fond %num"
    //% group="Écran"
    //% weight=85
    export function ecranImageFond(num: number): void {
        lcdDisplay.setBackgroundImage(num)
    }

    //% block="écran afficher texte %texte en x %x y %y taille %taille couleur %color"
    //% group="Écran"
    //% weight=80
    export function ecranAfficherTexte(texte: string, x: number, y: number, taille: number, color: number): void {
        lcdDisplay.drawString(texte, x, y, taille, color)
    }

    //% block="écran afficher pixel x %x y %y couleur %color"
    //% group="Écran"
    //% weight=75
    export function ecranPixel(x: number, y: number, color: number): void {
        lcdDisplay.drawPoint(x, y, color)
    }

    //% block="écran afficher ligne x1 %x1 y1 %y1 x2 %x2 y2 %y2 couleur %color"
    //% group="Écran"
    //% weight=70
    export function ecranLigne(x1: number, y1: number, x2: number, y2: number, color: number): void {
        lcdDisplay.drawLine(x1, y1, x2, y2, color)
    }

    //% block="écran rectangle x %x y %y largeur %w hauteur %h couleur %color rempli %fill"
    //% group="Écran"
    //% weight=65
    export function ecranRectangle(x: number, y: number, w: number, h: number, color: number, fill: boolean): void {
        lcdDisplay.drawRectangle(x, y, w, h, color, fill)
    }

    //% block="écran cercle x %x y %y rayon %r couleur %color rempli %fill"
    //% group="Écran"
    //% weight=60
    export function ecranCercle(x: number, y: number, r: number, color: number, fill: boolean): void {
        lcdDisplay.drawCircle(x, y, r, color, fill)
    }

    //% block="écran triangle x1 %x1 y1 %y1 x2 %x2 y2 %y2 x3 %x3 y3 %y3 couleur %color rempli %fill"
    //% group="Écran"
    //% weight=55
    export function ecranTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, color: number, fill: boolean): void {
        lcdDisplay.drawTriangle(x1, y1, x2, y2, x3, y3, color, fill)
    }

    //% block="écran afficher icône %icon x %x y %y"
    //% group="Écran"
    //% weight=50
    export function ecranIcone(icon: number, x: number, y: number): void {
        lcdDisplay.drawIcon(icon, x, y)
    }

    //% block="écran afficher gif %gif x %x y %y"
    //% group="Écran"
    //% weight=45
    export function ecranGif(gif: number, x: number, y: number): void {
        lcdDisplay.drawGif(gif, x, y)
    }
}
