export default class BinnacleManager {
  constructor() {
    this.glyphs = {
      S: 0,
      A: 0,
      B: 0
    };
  }

  /** Añade un jeroglífico al registro del jugador */
  addGlyph(tier) {
    if (!this.glyphs[tier]) this.glyphs[tier] = 0;
    this.glyphs[tier]++;
    console.log(`[Binnacle] Añadido jeroglífico Tier ${tier}. Total:`, this.glyphs[tier]);
  }

  /** Gasta jeroglíficos al seleccionar dificultad o eventos */
  spendGlyphs(tier, amount) {
    if (this.glyphs[tier] >= amount) {
      this.glyphs[tier] -= amount;
      return true;
    }
    return false;
  }

  /** Devuelve un resumen completo */
  getSummary() {
    return { ...this.glyphs };
  }

  /** Resetea la bitácora (por nueva partida, etc.) */
  reset() {
    this.glyphs = { S: 0, A: 0, B: 0 };
  }
}
