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
  { id: 'pebble-scout', name: 'Pebble Scout', rarity: 'Common', color: '#94a3b8' },
  { id: 'mossling-gatherer', name: 'Mossling Gatherer', rarity: 'Common', color: '#94a3b8' },
  { id: 'driftwood-golem', name: 'Driftwood Golem', rarity: 'Common', color: '#94a3b8' },
  { id: 'sand-sprinter', name: 'Sand Sprinter', rarity: 'Common', color: '#94a3b8' },
  { id: 'coral-bug', name: 'Coral Bug', rarity: 'Common', color: '#94a3b8' },
  { id: 'fog-crawler', name: 'Fog Crawler', rarity: 'Common', color: '#94a3b8' },
  { id: 'ember-twig', name: 'Ember Twig', rarity: 'Common', color: '#94a3b8' },
  { id: 'brook-minnow', name: 'Brook Minnow', rarity: 'Common', color: '#94a3b8' },
  { id: 'stone-tortoise', name: 'Stone Tortoise', rarity: 'Common', color: '#94a3b8' },
  { id: 'windleaf-sprite', name: 'Windleaf Sprite', rarity: 'Common', color: '#94a3b8' },
  { id: 'dust-hopper', name: 'Dust Hopper', rarity: 'Common', color: '#94a3b8' },
  { id: 'vine-snare', name: 'Vine Snare', rarity: 'Common', color: '#94a3b8' },
  { id: 'crag-rat', name: 'Crag Rat', rarity: 'Common', color: '#94a3b8' },
  { id: 'tide-skipper', name: 'Tide Skipper', rarity: 'Common', color: '#94a3b8' },
  { id: 'barkhide-lizard', name: 'Barkhide Lizard', rarity: 'Common', color: '#94a3b8' },
  { id: 'glow-ant', name: 'Glow Ant', rarity: 'Common', color: '#94a3b8' },
  { id: 'hollow-beetle', name: 'Hollow Beetle', rarity: 'Common', color: '#94a3b8' },
  { id: 'rain-drifter', name: 'Rain Drifter', rarity: 'Common', color: '#94a3b8' },
  { id: 'mud-slug', name: 'Mud Slug', rarity: 'Common', color: '#94a3b8' },
  { id: 'sunseed-imp', name: 'Sunseed Imp', rarity: 'Common', color: '#94a3b8' },
  { id: 'cliff-roamer', name: 'Cliff Roamer', rarity: 'Common', color: '#94a3b8' },
  { id: 'frost-petal', name: 'Frost Petal', rarity: 'Common', color: '#94a3b8' },
  { id: 'thorn-pup', name: 'Thorn Pup', rarity: 'Common', color: '#94a3b8' },
  { id: 'echo-sparrow', name: 'Echo Sparrow', rarity: 'Common', color: '#94a3b8' },
  { id: 'river-pebbler', name: 'River Pebbler', rarity: 'Common', color: '#94a3b8' },
  { id: 'ash-mite', name: 'Ash Mite', rarity: 'Common', color: '#94a3b8' },
  { id: 'bramble-mouse', name: 'Bramble Mouse', rarity: 'Common', color: '#94a3b8' },
  { id: 'gale-feather', name: 'Gale Feather', rarity: 'Common', color: '#94a3b8' },
  { id: 'root-creeper', name: 'Root Creeper', rarity: 'Common', color: '#94a3b8' },
  { id: 'dune-hopper', name: 'Dune Hopper', rarity: 'Common', color: '#94a3b8' },
  { id: 'cloudlet', name: 'Cloudlet', rarity: 'Common', color: '#94a3b8' },
  { id: 'sapling-guard', name: 'Sapling Guard', rarity: 'Common', color: '#94a3b8' },
  { id: 'flame-flicker', name: 'Flame Flicker', rarity: 'Common', color: '#94a3b8' },
  { id: 'ice-shardling', name: 'Ice Shardling', rarity: 'Common', color: '#94a3b8' },
  { id: 'shale-worm', name: 'Shale Worm', rarity: 'Common', color: '#94a3b8' },
  { id: 'night-cricket', name: 'Night Cricket', rarity: 'Common', color: '#94a3b8' },
  { id: 'bloom-pixie', name: 'Bloom Pixie', rarity: 'Common', color: '#94a3b8' },
  { id: 'drift-seed', name: 'Drift Seed', rarity: 'Common', color: '#94a3b8' },
  { id: 'ember-dust', name: 'Ember Dust', rarity: 'Common', color: '#94a3b8' },
  { id: 'shellback-crab', name: 'Shellback Crab', rarity: 'Common', color: '#94a3b8' },

  // Uncommon (25)
  { id: 'thornhide-boar', name: 'Thornhide Boar', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'crystal-finch', name: 'Crystal Finch', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'wavecaller-adept', name: 'Wavecaller Adept', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'ember-fox', name: 'Ember Fox', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'ironroot-treant', name: 'Ironroot Treant', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'frosttail-lynx', name: 'Frosttail Lynx', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'sandstorm-adept', name: 'Sandstorm Adept', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'glowvine-witch', name: 'Glowvine Witch', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'storm-kite', name: 'Storm Kite', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'lava-hopper', name: 'Lava Hopper', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'coral-knight', name: 'Coral Knight', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'mist-stalker', name: 'Mist Stalker', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'windblade-hawk', name: 'Windblade Hawk', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'ashen-wolf', name: 'Ashen Wolf', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'stoneguard-sentinel', name: 'Stoneguard Sentinel', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'river-serpent', name: 'River Serpent', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'bloom-shaman', name: 'Bloom Shaman', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'dune-seraph', name: 'Dune Seraph', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'flame-dancer', name: 'Flame Dancer', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'icebound-archer', name: 'Icebound Archer', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'thunder-cub', name: 'Thunder Cub', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'nightshade-rogue', name: 'Nightshade Rogue', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'sunflare-monk', name: 'Sunflare Monk', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'rootbinder-mage', name: 'Rootbinder Mage', rarity: 'Uncommon', color: '#4ade80' },
  { id: 'gale-rider', name: 'Gale Rider', rarity: 'Uncommon', color: '#4ade80' },

  // Rare (15)
  { id: 'stormforge-golem', name: 'Stormforge Golem', rarity: 'Rare', color: '#60a5fa' },
  { id: 'frostbrand-warrior', name: 'Frostbrand Warrior', rarity: 'Rare', color: '#60a5fa' },
  { id: 'emberclaw-tiger', name: 'Emberclaw Tiger', rarity: 'Rare', color: '#60a5fa' },
  { id: 'tidebreaker-giant', name: 'Tidebreaker Giant', rarity: 'Rare', color: '#60a5fa' },
  { id: 'thornqueen-dryad', name: 'Thornqueen Dryad', rarity: 'Rare', color: '#60a5fa' },
  { id: 'skybreaker-griffin', name: 'Skybreaker Griffin', rarity: 'Rare', color: '#60a5fa' },
  { id: 'lava-titan', name: 'Lava Titan', rarity: 'Rare', color: '#60a5fa' },
  { id: 'crystal-sage', name: 'Crystal Sage', rarity: 'Rare', color: '#60a5fa' },
  { id: 'nightfall-assassin', name: 'Nightfall Assassin', rarity: 'Rare', color: '#60a5fa' },
  { id: 'sunblade-paladin', name: 'Sunblade Paladin', rarity: 'Rare', color: '#60a5fa' },
  { id: 'ironclad-juggernaut', name: 'Ironclad Juggernaut', rarity: 'Rare', color: '#60a5fa' },
  { id: 'windstorm-dragonet', name: 'Windstorm Dragonet', rarity: 'Rare', color: '#60a5fa' },
  { id: 'dunestrider-champion', name: 'Dunestrider Champion', rarity: 'Rare', color: '#60a5fa' },
  { id: 'bloom-guardian', name: 'Bloom Guardian', rarity: 'Rare', color: '#60a5fa' },
  { id: 'shadowveil-sorcerer', name: 'Shadowveil Sorcerer', rarity: 'Rare', color: '#60a5fa' },

  // Epic (10)
  { id: 'inferno-phoenix', name: 'Inferno Phoenix', rarity: 'Epic', color: '#c084fc' },
  { id: 'glacier-colossus', name: 'Glacier Colossus', rarity: 'Epic', color: '#c084fc' },
  { id: 'tempest-leviathan', name: 'Tempest Leviathan', rarity: 'Epic', color: '#c084fc' },
  { id: 'verdant-overlord', name: 'Verdant Overlord', rarity: 'Epic', color: '#c084fc' },
  { id: 'eclipse-harbinger', name: 'Eclipse Harbinger', rarity: 'Epic', color: '#c084fc' },
  { id: 'thunderlord-behemoth', name: 'Thunderlord Behemoth', rarity: 'Epic', color: '#c084fc' },
  { id: 'starfall-enchanter', name: 'Starfall Enchanter', rarity: 'Epic', color: '#c084fc' },
  { id: 'abyssal-warden', name: 'Abyssal Warden', rarity: 'Epic', color: '#c084fc' },
  { id: 'solar-archangel', name: 'Solar Archangel', rarity: 'Epic', color: '#c084fc' },
  { id: 'voidblade-executioner', name: 'Voidblade Executioner', rarity: 'Epic', color: '#c084fc' },

  // Legendary (6)
  { id: 'ignivar', name: 'Ignivar, Flame Sovereign', rarity: 'Legendary', color: '#fbbf24' },
  { id: 'cryonix', name: 'Cryonix, Lord of Frost', rarity: 'Legendary', color: '#fbbf24' },
  { id: 'zephyros', name: 'Zephyros, Sky Tyrant', rarity: 'Legendary', color: '#fbbf24' },
  { id: 'terradon', name: 'Terradon, Earthbreaker', rarity: 'Legendary', color: '#fbbf24' },
  { id: 'lumina', name: 'Lumina, Radiant Queen', rarity: 'Legendary', color: '#fbbf24' },
  { id: 'umbros', name: 'Umbros, Shadow King', rarity: 'Legendary', color: '#fbbf24' },

  // Mythic (3)
  { id: 'aetherion', name: 'Aetherion, Weaver of Realities', rarity: 'Mythic', color: '#f87171' },
  { id: 'chronaros', name: 'Chronaros, Time Devourer', rarity: 'Mythic', color: '#f87171' },
  { id: 'nyxara', name: 'Nyxara, Empress of the Void', rarity: 'Mythic', color: '#f87171' },

  // Ultra Mythic (1)
  { id: 'omnirex', name: 'Omnirex, The Infinite Origin', rarity: 'Ultra Mythic', color: '#ffffff' },
];
