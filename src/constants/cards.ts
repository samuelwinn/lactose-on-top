export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Ultra Mythic';

export interface Card {
  id: string;
  name: string;
  rarity: Rarity;
  color: string;
}

export const RARITIES: Record<Rarity, { chance: number; color: string; bg: string; glow: string; dropRate: string }> = {
  'Common': { chance: 0.60, color: '#94a3b8', bg: 'bg-zinc-800', glow: 'shadow-zinc-500/20', dropRate: '1.5% each' },
  'Uncommon': { chance: 0.25, color: '#4ade80', bg: 'bg-emerald-900', glow: 'shadow-emerald-500/30', dropRate: '1.0% each' },
  'Rare': { chance: 0.0795, color: '#60a5fa', bg: 'bg-blue-900', glow: 'shadow-blue-500/40', dropRate: '0.53% each' },
  'Epic': { chance: 0.040, color: '#c084fc', bg: 'bg-purple-900', glow: 'shadow-purple-500/50', dropRate: '0.40% each' },
  'Legendary': { chance: 0.0198, color: '#fbbf24', bg: 'bg-amber-900', glow: 'shadow-amber-500/60', dropRate: '0.33% each' },
  'Mythic': { chance: 0.0090, color: '#f87171', bg: 'bg-red-900', glow: 'shadow-red-500/70', dropRate: '0.30% each' },
  'Ultra Mythic': { chance: 0.0010, color: '#ffffff', bg: 'bg-white', glow: 'shadow-white/80', dropRate: '0.10% each' },
};

export const ALL_CARDS: Card[] = [
  // Common (40)
  { id: 'mario', name: 'Mario', rarity: 'Common', color: '#94a3b8' },
  { id: 'sonic-the-hedgehog', name: 'Sonic the Hedgehog', rarity: 'Common', color: '#94a3b8' },
  { id: 'steve', name: 'Steve', rarity: 'Common', color: '#94a3b8' },
  { id: 'crash-bandicoot', name: 'Crash Bandicoot', rarity: 'Common', color: '#94a3b8' },
  { id: 'link', name: 'Link', rarity: 'Common', color: '#94a3b8' },
  { id: 'pikachu', name: 'Pikachu', rarity: 'Common', color: '#94a3b8' },
  { id: 'mega-man', name: 'Mega Man', rarity: 'Common', color: '#94a3b8' },
  { id: 'pac-man', name: 'Pac-Man', rarity: 'Common', color: '#94a3b8' },
  { id: 'kirby', name: 'Kirby', rarity: 'Common', color: '#94a3b8' },
  { id: 'ryu', name: 'Ryu', rarity: 'Common', color: '#94a3b8' },
  { id: 'luigi', name: 'Luigi', rarity: 'Common', color: '#94a3b8' },
  { id: 'tails', name: 'Tails', rarity: 'Common', color: '#94a3b8' },
  { id: 'alex', name: 'Alex', rarity: 'Common', color: '#94a3b8' },
  { id: 'coco-bandicoot', name: 'Coco Bandicoot', rarity: 'Common', color: '#94a3b8' },
  { id: 'eevee', name: 'Eevee', rarity: 'Common', color: '#94a3b8' },
  { id: 'chun-li', name: 'Chun-Li', rarity: 'Common', color: '#94a3b8' },
  { id: 'donkey-kong', name: 'Donkey Kong', rarity: 'Common', color: '#94a3b8' },
  { id: 'spyro', name: 'Spyro', rarity: 'Common', color: '#94a3b8' },
  { id: 'bomberman', name: 'Bomberman', rarity: 'Common', color: '#94a3b8' },
  { id: 'yoshi', name: 'Yoshi', rarity: 'Common', color: '#94a3b8' },
  { id: 'knuckles', name: 'Knuckles', rarity: 'Common', color: '#94a3b8' },
  { id: 'creeper', name: 'Creeper', rarity: 'Common', color: '#94a3b8' },
  { id: 'enderman', name: 'Enderman', rarity: 'Common', color: '#94a3b8' },
  { id: 'sora', name: 'Sora', rarity: 'Common', color: '#94a3b8' },
  { id: 'toad', name: 'Toad', rarity: 'Common', color: '#94a3b8' },
  { id: 'shadow-the-hedgehog', name: 'Shadow the Hedgehog', rarity: 'Common', color: '#94a3b8' },
  { id: 'villager', name: 'Villager', rarity: 'Common', color: '#94a3b8' },
  { id: 'inkling', name: 'Inkling', rarity: 'Common', color: '#94a3b8' },
  { id: 'isabelle', name: 'Isabelle', rarity: 'Common', color: '#94a3b8' },
  { id: 'tom-nook', name: 'Tom Nook', rarity: 'Common', color: '#94a3b8' },
  { id: 'shovel-knight', name: 'Shovel Knight', rarity: 'Common', color: '#94a3b8' },
  { id: 'cuphead', name: 'Cuphead', rarity: 'Common', color: '#94a3b8' },
  { id: 'mugman', name: 'Mugman', rarity: 'Common', color: '#94a3b8' },
  { id: 'rayman', name: 'Rayman', rarity: 'Common', color: '#94a3b8' },
  { id: 'diddy-kong', name: 'Diddy Kong', rarity: 'Common', color: '#94a3b8' },
  { id: 'banjo', name: 'Banjo', rarity: 'Common', color: '#94a3b8' },
  { id: 'kazooie', name: 'Kazooie', rarity: 'Common', color: '#94a3b8' },
  { id: 'sans', name: 'Sans', rarity: 'Common', color: '#94a3b8' },
  { id: 'papyrus', name: 'Papyrus', rarity: 'Common', color: '#94a3b8' },
  { id: 'jigglypuff', name: 'Jigglypuff', rarity: 'Common', color: '#94a3b8' },

  // Uncommon (25)
  { id: 'samus-aran', name: 'Samus Aran', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'captain-falcon', name: 'Captain Falcon', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'pit', name: 'Pit', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'marth', name: 'Marth', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'ike', name: 'Ike', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'little-mac', name: 'Little Mac', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'greninja', name: 'Greninja', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'lucario', name: 'Lucario', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'master-chief', name: 'Master Chief', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'scorpion', name: 'Scorpion', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'sub-zero', name: 'Sub-Zero', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'raiden', name: 'Raiden', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'liu-kang', name: 'Liu Kang', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'lara-croft', name: 'Lara Croft', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'nathan-drake', name: 'Nathan Drake', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'sackboy', name: 'Sackboy', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'astro-bot', name: 'Astro Bot', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'ratchet', name: 'Ratchet', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'clank', name: 'Clank', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'jak', name: 'Jak', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'daxter', name: 'Daxter', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'meta-knight', name: 'Meta Knight', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'king-dedede', name: 'King Dedede', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'falco-lombardi', name: 'Falco Lombardi', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'wario', name: 'Wario', rarity: 'Uncommon', color: '#4ade80' },

  // Rare (15)
  { id: 'princess-zelda-breath-of-the-wild', name: 'Princess Zelda (Breath of the Wild)', rarity: 'Rare', color: '#60a5fa' },
  { id: 'king-k-rool', name: 'King K. Rool', rarity: 'Rare', color: '#60a5fa' },
  { id: 'dr-mario', name: 'Dr. Mario', rarity: 'Rare', color: '#60a5fa' },
  { id: 'metal-sonic', name: 'Metal Sonic', rarity: 'Rare', color: '#60a5fa' },
  { id: 'amy-rose', name: 'Amy Rose', rarity: 'Rare', color: '#60a5fa' },
  { id: 'blaze-the-cat', name: 'Blaze the Cat', rarity: 'Rare', color: '#60a5fa' },
  { id: 'charmander', name: 'Charmander', rarity: 'Rare', color: '#60a5fa' },
  { id: 'squirtle', name: 'Squirtle', rarity: 'Rare', color: '#60a5fa' },
  { id: 'bulbasaur', name: 'Bulbasaur', rarity: 'Rare', color: '#60a5fa' },
  { id: 'slime', name: 'Slime', rarity: 'Rare', color: '#60a5fa' },
  { id: 'solid-snake', name: 'Solid Snake', rarity: 'Rare', color: '#60a5fa' },
  { id: 'toon-link', name: 'Toon Link', rarity: 'Rare', color: '#60a5fa' },
  { id: 'mr-game-watch', name: 'Mr. Game & Watch', rarity: 'Rare', color: '#60a5fa' },
  { id: 'doom-slayer', name: 'Doom Slayer', rarity: 'Rare', color: '#60a5fa' },
  { id: 'pichu', name: 'Pichu', rarity: 'Rare', color: '#60a5fa' },

  // Epic (10)
  { id: 'ganondorf', name: 'Ganondorf', rarity: 'Epic', color: '#c084fc' },
  { id: 'bowser', name: 'Bowser', rarity: 'Epic', color: '#c084fc' },
  { id: 'dr-eggman', name: 'Dr. Eggman', rarity: 'Epic', color: '#c084fc' },
  { id: 'm-bison', name: 'M. Bison', rarity: 'Epic', color: '#c084fc' },
  { id: 'akuma', name: 'Akuma', rarity: 'Epic', color: '#c084fc' },
  { id: 'vergil', name: 'Vergil', rarity: 'Epic', color: '#c084fc' },
  { id: 'dante', name: 'Dante', rarity: 'Epic', color: '#c084fc' },
  { id: 'bayonetta', name: 'Bayonetta', rarity: 'Epic', color: '#c084fc' },
  { id: 'ridley', name: 'Ridley', rarity: 'Epic', color: '#c084fc' },
  { id: 'ganon-beast-form', name: 'Ganon (Beast Form)', rarity: 'Epic', color: '#c084fc' },

  // Legendary (6)
  { id: 'mario-fire-form', name: 'Mario (Fire Form)', rarity: 'Legendary', color: '#fbbf24' },
  { id: 'link-champion-form', name: 'Link (Champion Form)', rarity: 'Legendary', color: '#fbbf24' },
  { id: 'sonic-super-sonic', name: 'Sonic (Super Sonic)', rarity: 'Legendary', color: '#fbbf24' },
  { id: 'steve-netherite-armor', name: 'Steve (Netherite Armor)', rarity: 'Legendary', color: '#fbbf24' },
  { id: 'pikachu-gigantamax', name: 'Pikachu (Gigantamax)', rarity: 'Legendary', color: '#fbbf24' },
  { id: 'kirby-hypernova', name: 'Kirby (Hypernova)', rarity: 'Legendary', color: '#fbbf24' },

  // Mythic (3)
  { id: 'mewtwo', name: 'Mewtwo', rarity: 'Mythic', color: '#f87171' },
  { id: 'freddy-fazbear', name: 'Freddy Fazbear', rarity: 'Mythic', color: '#f87171' },
  { id: 'fox-mccloud', name: 'Fox McCloud', rarity: 'Mythic', color: '#f87171' },

  // Ultra Mythic (1)
  { id: 'herobrine', name: 'Herobrine', rarity: 'Ultra Mythic', color: '#ffffff' },
];
