/**
 * JSDOC
 * YA
 * A
 */

import { playerInitialData } from "../config/PlayerData.js";

export default class BinnacleManager {
  static instance = null;

  static getInstance() {
    if (!BinnacleManager.instance) {
      BinnacleManager.instance = new BinnacleManager();
    }
    return BinnacleManager.instance;
  }
  constructor() {
    this.glyphs = playerInitialData.glyphs; 
  }

  /** Añade uno o varios jeroglíficos al registro del jugador */
  addGlyph(glyphsEarned) {
    // Validación: debe ser un objeto con pares { tier: cantidad }
    if (typeof glyphsEarned !== 'object' || glyphsEarned === null) {
      console.warn('[Bitácora] Formato inválido en addGlyph. Se esperaba un objeto.');
      return;
    }

    for (const [tier, amount] of Object.entries(glyphsEarned)) {
      // Solo procesamos tiers válidos
      if (!['S', 'A', 'B'].includes(tier)) {
        console.warn(`[Bitácora] Tier inválido: ${tier}`);
        continue;
      }

      // Inicializa si no existe y suma la cantidad
      if (!this.glyphs[tier]) this.glyphs[tier] = 0;
      this.glyphs[tier] += amount;

      console.log(`[Bitácora] Añadidos ${amount} jeroglíficos Tier ${tier}. Total: ${this.glyphs[tier]}`);
    }
  }

  /** Comprueba si tiene jeroglificos necesarios para cierta accion */
  hasGlyphs(tier, amount) {
  return this.glyphs[tier] >= amount;
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
  // ...variable devuelve una copia superficial para evitar modificaciones
  getSummary() {
    return { ...this.glyphs };
  }

  /** Resetea la bitácora (por nueva partida, etc.) */
  reset() {
    this.glyphs = { S: 0, A: 0, B: 0 };
  }
}
