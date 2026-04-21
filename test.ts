/**
 * Test de l'extension a4_ms_stationnement
 * Maquette : borne de stationnement limitée
 *
 * Fonctionnement :
 * - affiche d'abord le niveau de batterie sur la micro:bit
 * - initialise l'écran
 * - applique un fond gris clair
 * - surveille en continu la présence d'un véhicule
 *   - si un véhicule est détecté :
 *       LED RGB rouges
 *       affichage "OCCUPE" en rouge
 *   - sinon :
 *       LED RGB vertes
 *       affichage "LIBRE" en vert
 */

// Affiche le niveau de batterie au démarrage
basic.showNumber(a4_ms_stationnement.niveauBatterie())

// Initialisation de l'écran
a4_ms_stationnement.ecranInitialiserI2C()

// Définition de la couleur de fond de l'écran : gris clair
a4_ms_stationnement.ecranCouleurFond(
    a4_ms_stationnement.ecranCouleurRVB(239, 239, 239)
)

// Boucle principale de surveillance
basic.forever(function () {
    if (a4_ms_stationnement.presenceVehicule()) {
        // Véhicule détecté : LED rouges + message OCCUPE
        a4_ms_stationnement.setRGBColor(RGBIndex.Both, RGBColor.Red)
        a4_ms_stationnement.ecranAfficherTexte(
            "OCCUPE",
            1,
            120,
            120,
            a4_ms_stationnement.TaillePolice.Large,
            0xff0000
        )
    } else {
        // Aucun véhicule : LED vertes + message LIBRE
        a4_ms_stationnement.setRGBColor(RGBIndex.Both, RGBColor.Green)
        a4_ms_stationnement.ecranAfficherTexte(
            "LIBRE",
            1,
            120,
            120,
            a4_ms_stationnement.TaillePolice.Large,
            a4_ms_stationnement.ecranCouleurRVB(31, 160, 85)
        )
    }
})
