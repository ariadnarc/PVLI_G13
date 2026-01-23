/**
 * @file SalaSecretaBoot.js
 * @description
 * Contiene la configuración de los minijuegos de la sala secreta.
 * Cada objeto define el minijuego, su dificultad y las instrucciones de control.
 */

/**
 * @typedef {Object} MinijuegoSecreto
 * @property {string} minijuego - Clave interna del minijuego.
 * @property {string} dificultad - Dificultad del minijuego (FACIL, MEDIA, DIFICIL).
 * @property {string[]} controles - Instrucciones para el jugador.
 */

/**
 * Minijuegos que se ejecutan en la sala secreta.
 * @type {MinijuegoSecreto[]}
 */
export const MINIJUEGOS_SECRETA = [
    {
        minijuego: "CrocoShoot",
        dificultad: "DIFICIL",
        controles: [
            "Pulsa ← / → para girar,",
            "Pulsa espacio para disparar."
        ]
    },
    {
        minijuego: "Undertale",
        dificultad: "DIFICIL",
        controles: [
            "Usa las flechas para moverte.",
            "Esquiva los misiles para ganar."
        ]
    },
    {
        minijuego: "LockPick",
        dificultad: "DIFICIL",
        controles: [
            "Usa ← / → para girar",
            "Encuentra el punto correcto y mantén espacio."
        ]
    }
]