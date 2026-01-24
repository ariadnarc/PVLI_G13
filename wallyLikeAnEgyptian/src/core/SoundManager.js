/**
 * @file SoundManager.js
 * @description
 * Clase que gestiona la carga, reproducción y control de sonidos y música.
 * Permite reproducir efectos de sonido, música de fondo, pausar, reanudar y detener.
 * Centraliza toda la lógica de audio para las distintas escenas.
 */

 /**
  * Clase SoundManager
  */
export default class SoundManager {
  /**
   * Inicializa todos los sonidos pre-cargados en la escena.
   * @param {Phaser.Scene} scene - Escena de Phaser donde se reproducirán los sonidos.
   */
  constructor(scene) {
    this.scene = scene;

    /** @type {Object.<string, Phaser.Sound.BaseSound>} */
    this.sounds = {};

    // Lista de keys de sonidos pre-cargados
    const keys = ['victory','defeat','click','locked','unlocked',
        'start','slideBarTheme','crocoshootTheme','undertaleTheme',
        'puzzleLightsTheme','lockPickTheme','walkLikeAnEgyptian','finalBossTheme','creditsMusic', 'ambience'
      ];

    // Añadir cada sonido a la colección
    keys.forEach(key => {
    this.sounds[key] = this.scene.sound.add(key);
    });
  }

  /**
   * Reproduce un efecto de sonido.
   * @param {string} key - Key del sonido.
   * @param {Phaser.Types.Sound.SoundConfig} [config={}] - Configuración opcional de reproducción.
   */
  play(key, config = {}) {
    if(this.sounds[key]) {
      this.sounds[key].play(config);
    } else {
      console.warn(`SoundManager: no existe el sonido ${key}`);
    }
  }

  /**
   * Reproduce música de fondo. Detiene cualquier música previa.
   * @param {string} key - Key de la música.
   * @param {Phaser.Types.Sound.SoundConfig} [config={loop: true, volume: 0.5}] - Configuración de la música.
   */
  playMusic(key, config = { loop: true, volume: 0.5 }) {
    if(this.music) this.music.stop();
    if(this.sounds[key]) {
      this.music = this.sounds[key];
      this.music.play(config);
    }
  }

  /**
   * Detiene la música de fondo actual.
   */
  stopMusic() {
    if(this.music) this.music.stop();
    this.music = null;
  }

  /**
   * Detiene un sonido específico si se está reproduciendo.
   * @param {string} key - Key del sonido a detener.
   */
  stop(key) {
    if(this.sounds[key] && this.sounds[key].isPlaying) {
      this.sounds[key].stop();
    }
  }

  /**
   * Pausa todos los sonidos y música en la escena.
   */
  pauseAll() {
    this.scene.sound.pauseAll();
  }

  /**
   * Reanuda todos los sonidos y música pausados en la escena.
   */
  resumeAll() {
    this.scene.sound.resumeAll();
  }
}