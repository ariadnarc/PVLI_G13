/**
 * @file CofresData.js
 * @description Configuración de todos los cofres del mapa.
 * Define la posición inicial de cada cofre, el minijuego asociado,
 * la dificultad, el jeroglífico que contiene y los textos de controles
 * que se muestran al jugador.
 *
 * Este archivo actúa como fuente para la colocación y
 * progresión de cofres a lo largo del mapa.
 */

/**
 * @typedef {Object} CofreData
 * @property {{x: number, y: number}} posInicial - Posición inicial del cofre en el mapa.
 * @property {string} minijuego - Nombre de la escena del minijuego asociado al cofre.
 * @property {string} dificultad - Nivel de dificultad del minijuego ('FACIL', 'MEDIA', 'DIFICIL').
 * @property {number} jeroglificoId - Identificador del jeroglífico que se obtiene al completar el cofre.
 * @property {string[]} controles - Textos que indican los controles del minijuego.
 */

/**
 * Array con la configuración de todos los cofres del juego,
 * ordenados por dificultad y progresión dentro del mapa.
 * @type {CofreData[]}
 */

export const cofresData = [

    //=== DIFICULTAD FÁCIL ===
    {
        posInicial: { x: 450, y: 500 },
        minijuego: "SlideBar",
        dificultad: "FACIL",
        jeroglificoId: 1,
        controles: ["Pulsa espacio para parar al escarabajo sobre la gema."]
    },
    {
        posInicial: { x: 540, y: 310 },
        minijuego: "CrocoShoot",
        dificultad: "FACIL",
        jeroglificoId: 2,
        controles: ["Pulsa ← / → para girar,",
                    "Pulsa espacio para disparar."]
    },
    {
        posInicial: { x: 400, y: 120 },
        minijuego: "LockPick",
        dificultad: "FACIL",
        jeroglificoId: 3,
        controles: [
            "Usa ← / → para girar",
            "Encuentra el punto correcto y mantén espacio."]
    },
    {
        posInicial: { x: 720, y: 120 },  
        minijuego: "Undertale",
        dificultad: "FACIL",
        jeroglificoId: 4,
        controles: [
            "Usa las flechas para moverte.",
            "Esquiva los misiles para ganar."]
    },
    {
        posInicial: { x: 996, y: 89 },
        minijuego: "PuzzleLights",
        dificultad: "FACIL",
        jeroglificoId: 5,
        controles: [
            "Haz click en los jeroglíficos que se iluminen siguiendo el orden."]
    },

    //=== DIFICULTAD MEDIA ===
    {
        posInicial: { x: 1230, y: 90 },
        minijuego: "PuzzleLights",
        dificultad: "MEDIA",
        jeroglificoId: 6,
        controles: [
            "Haz click en los jeroglíficos que se iluminen siguiendo el orden."]
    },
    {
        posInicial: { x: 820, y: 260 },
        minijuego: "SlideBar",
        dificultad: "MEDIA",
        jeroglificoId: 7,
        controles: ["Pulsa espacio para parar al escarabajo sobre la gema."]
    },
    {   
        posInicial: { x: 1050, y: 730 },
        minijuego: "CrocoShoot",
        dificultad: "MEDIA",
        jeroglificoId: 8,
        controles: ["Pulsa ← / → para girar,",
                    "Pulsa espacio para disparar."]
    },
    {
        posInicial: { x: 1380, y: 730 },
        minijuego: "LockPick",
        dificultad: "MEDIA",
        jeroglificoId: 9,
        controles: [
            "Usa ← / → para girar",
            "Encuentra el punto correcto y mantén espacio."]
    },
    {
        posInicial: { x: 1300, y: 730 },
        minijuego: "Undertale",
        dificultad: "MEDIA",
        jeroglificoId: 10,
        controles: [
            "Usa las flechas para moverte.",
            "Esquiva los misiles para ganar."]
    },
    
    //=== DIFICULTAD DIFÍCIL ===
    {
        posInicial: { x: 1250, y: 1300 },
        minijuego: "CrocoShoot",
        dificultad: "DIFICIL",
        jeroglificoId: 11,
        controles: ["Pulsa ← / → para girar,",
                    "Pulsa espacio para disparar."]
    },
    {
        posInicial: { x: 1110, y: 1300 },
        minijuego: "Undertale",
        dificultad: "DIFICIL",
        jeroglificoId: 12,
        controles: [
            "Usa las flechas para moverte.",
            "Esquiva los misiles para ganar."]
    },
    {
        posInicial: { x: 870, y: 1400 },
        minijuego: "SlideBar",
        dificultad: "DIFICIL",
        jeroglificoId: 13,
        controles: ["Pulsa espacio para parar al escarabajo sobre la gema."]
    },
    {
        posInicial: { x: 560, y: 1370 },
        minijuego: "PuzzleLights",
        dificultad: "DIFICIL",
        jeroglificoId: 14,
        controles: [
            "Haz click en los jeroglíficos que se iluminen siguiendo el orden."]
    },
    {
        posInicial: { x: 270, y: 1370 },
        minijuego: "LockPick",
        dificultad: "DIFICIL",
        jeroglificoId: 15,
        controles: [
            "Usa ← / → para girar",
            "Encuentra el punto correcto y mantén espacio."]
    }
]