export default class SoundManager {
  constructor(scene) {
    this.scene = scene;
    this.sounds = {};

    const keys = ['victory','defeat','click','locked','unlocked',
        'start','slideBarTheme','crocoshootTheme','undertaleTheme',
        'puzzleLightsTheme','lockPickTheme','walkLikeAnEgyptian','finalBossTheme','creditsMusic', 'ambience'];

    keys.forEach(key => {
    this.sounds[key] = this.scene.sound.add(key);
    });
  }

  play(key, config = {}) {
    if(this.sounds[key]) {
      this.sounds[key].play(config);
    } else {
      console.warn(`SoundManager: no existe el sonido ${key}`);
    }
  }

  playMusic(key, config = { loop: true, volume: 0.5 }) {
    if(this.music) this.music.stop();
    if(this.sounds[key]) {
      this.music = this.sounds[key];
      this.music.play(config);
    }
  }

  stopMusic() {
    if(this.music) this.music.stop();
    this.music = null;
  }

  stop(key) {
    if(this.sounds[key] && this.sounds[key].isPlaying) {
      this.sounds[key].stop();
    }
  }

  pauseAll() {
    this.scene.sound.pauseAll();
  }

  resumeAll() {
    this.scene.sound.resumeAll();
  }
}