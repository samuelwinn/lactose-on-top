/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Character } from './types.ts';

export const CHARACTERS: Character[] = [
  {
    id: 'kaze',
    name: 'KAZE',
    color: '#34d399', // Emerald
    accent: '#10b981',
    stats: { health: 100, speed: 9, power: 5, defense: 4 },
    moves: ['Wind Kick', 'Tornado Palm', 'Air Dash'],
    specialMove: 'Hurricane Blast',
    description: 'Special: Hurricane Blast - Launches a massive wind projectile that deals heavy damage and pushes enemies back across the screen.',
  },
  {
    id: 'brutus',
    name: 'BRUTUS',
    color: '#92400e', // Amber/Brown
    accent: '#78350f',
    stats: { health: 150, speed: 3, power: 9, defense: 8 },
    moves: ['Earthquake Slam', 'Titan Grip', 'Boulder Charge'],
    specialMove: 'Earthshaker Slam',
    description: 'Special: Earthshaker Slam - Slams the ground with titanic force, damaging any opponent currently standing on the floor.',
  },
  {
    id: 'luna',
    name: 'LUNA',
    color: '#818cf8', // Indigo
    accent: '#6366f1',
    stats: { health: 110, speed: 6, power: 6, defense: 6 },
    moves: ['Moonlight Spear', 'Lunar Phase', 'Star Rain'],
    specialMove: 'Eclipse Swap',
    description: 'Special: Eclipse Swap - Manipulates gravity to instantly swap positions with the opponent while dealing psychic damage.',
  },
  {
    id: 'volt',
    name: 'VOLT',
    color: '#facc15', // Yellow
    accent: '#eab308',
    stats: { health: 100, speed: 8, power: 7, defense: 5 },
    moves: ['Surge Punch', 'Circuit Break', 'Electro Slide'],
    specialMove: 'Overload Zap',
    description: 'Special: Overload Zap - Releases an intense burst of electricity in a medium radius, stunning and dealing massive AOE damage.',
  },
  {
    id: 'ignis',
    name: 'IGNIS',
    color: '#f87171', // Red
    accent: '#ef4444',
    stats: { health: 120, speed: 5, power: 8, defense: 4 },
    moves: ['Magma Burst', 'Inferno Kick', 'Heatwave'],
    specialMove: 'Nova Burst',
    description: 'Special: Nova Burst - Triggers a delayed thermal explosion that engulfs a huge area, dealing the highest raw damage in the game.',
  },
  {
    id: 'glacia',
    name: 'GLACIA',
    color: '#60a5fa', // Blue
    accent: '#3b82f6',
    stats: { health: 110, speed: 4, power: 6, defense: 8 },
    moves: ['Frost Nova', 'Icicle Spike', 'Blizzard Wall'],
    specialMove: 'Absolute Zero',
    description: 'Special: Absolute Zero - Flash-freezes the surrounding air, dealing damage and momentarily halting the opponent\'s momentum.',
  },
  {
    id: 'yuri',
    name: 'YURI',
    color: '#c084fc', // Purple
    accent: '#a855f7',
    stats: { health: 90, speed: 10, power: 4, defense: 3 },
    moves: ['Shadow Step', 'Ghost Strike', 'Void Blade'],
    specialMove: 'Void Ambush',
    description: 'Special: Void Ambush - Slips through a shadow rift to instantly reappear behind the opponent for a devastating backstab.',
  },
  {
    id: 'rex',
    name: 'REX',
    color: '#4ade80', // Green
    accent: '#22c55e',
    stats: { health: 130, speed: 5, power: 7, defense: 6 },
    moves: ['Tail Whip', 'Primal Roar', 'Frenzy Bite'],
    specialMove: 'Apex Predator',
    description: 'Special: Apex Predator - Performs a lightning-fast primal lunge across the stage, pinning the opponent for massive shredding damage.',
  },
  {
    id: 'jade',
    name: 'JADE',
    color: '#2dd4bf', // Teal
    accent: '#14b8a6',
    stats: { health: 100, speed: 7, power: 6, defense: 7 },
    moves: ['Dragon Palm', 'Lotus Counter', 'Flowing Water'],
    specialMove: 'Zen Strike',
    description: 'Special: Zen Strike - A precise dash that allows Jade to phase through the opponent, dealing internal damage as she passes.',
  },
  {
    id: 'aero',
    name: 'AERO',
    color: '#fb923c', // Orange
    accent: '#f97316',
    stats: { health: 95, speed: 9, power: 5, defense: 4 },
    moves: ['Sonic Grind', 'Ollie Flip', 'Grid Burst'],
    specialMove: 'Wind Burst',
    description: 'Special: Wind Burst - Creates a localized sonic boom that sends the opponent flying backwards with extreme velocity.',
  },
  {
    id: 'midas',
    name: 'MIDAS',
    color: '#fbbf24', // Amber/Gold
    accent: '#f59e0b',
    stats: { health: 140, speed: 4, power: 8, defense: 7 },
    moves: ['Gilded Armor', 'Heavy Coin', 'Gold Rush'],
    specialMove: 'Golden Touch',
    description: 'Special: Golden Touch - Concentrates wealth into a single, short-range blow that deals catastrophic critical damage to any target hit.',
  },
  {
    id: 'nova',
    name: 'NOVA',
    color: '#f472b6', // Pink
    accent: '#ec4899',
    stats: { health: 100, speed: 7, power: 7, defense: 5 },
    moves: ['Stardust Blast', 'Nebula Blink', 'Cosmic Ray'],
    specialMove: 'Supernova',
    description: 'Special: Supernova - Collapses space-time to pull the opponent directly to Nova\'s position before releasing an astronomical energy shock.',
  },
];

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 450;
export const GROUND_Y = 380;
export const GRAVITY = 0.6;
export const JUMP_FORCE = -15;
export const MOVE_SPEED = 5;
