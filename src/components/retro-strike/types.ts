/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum GameState {
  BOOTING = 'BOOTING',
  MENU = 'MENU',
  CHARACTER_SELECT = 'CHARACTER_SELECT',
  FIGHTING = 'FIGHTING',
  GAME_OVER = 'GAME_OVER',
}

export type FighterStats = {
  health: number;
  speed: number;
  power: number;
  defense: number;
};

export type Character = {
  id: string;
  name: string;
  color: string;
  accent: string;
  stats: FighterStats;
  moves: string[];
  specialMove: string;
  description: string;
  imageUrl?: string;
};

export type Player = {
  id: 1 | 2;
  character: Character;
  x: number;
  y: number;
  vx: number;
  vy: number;
  health: number;
  power: number;
  isJumping: boolean;
  isAttacking: boolean;
  isBlocking: boolean;
  isSpecial: boolean;
  isStunned: boolean;
  direction: 'left' | 'right';
  currentMove: string | null;
  comboCount: number;
  lastHurtTime: number;
};

export type InputState = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  attack1: boolean;
  attack2: boolean;
  block: boolean;
  special: boolean;
};
