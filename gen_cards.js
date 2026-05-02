
const cards = [
  // Common (40)
  ["Mario", "Common"], ["Sonic the Hedgehog", "Common"], ["Steve", "Common"], ["Crash Bandicoot", "Common"],
  ["Link", "Common"], ["Pikachu", "Common"], ["Mega Man", "Common"], ["Pac-Man", "Common"],
  ["Kirby", "Common"], ["Ryu", "Common"], ["Luigi", "Common"], ["Tails", "Common"],
  ["Alex", "Common"], ["Coco Bandicoot", "Common"], ["Eevee", "Common"], ["Chun-Li", "Common"],
  ["Donkey Kong", "Common"], ["Spyro", "Common"], ["Bomberman", "Common"], ["Yoshi", "Common"],
  ["Knuckles", "Common"], ["Creeper", "Common"], ["Enderman", "Common"], ["Sora", "Common"],
  ["Toad", "Common"], ["Shadow the Hedgehog", "Common"], ["Villager", "Common"], ["Inkling", "Common"],
  ["Isabelle", "Common"], ["Tom Nook", "Common"], ["Shovel Knight", "Common"], ["Cuphead", "Common"],
  ["Mugman", "Common"], ["Rayman", "Common"], ["Diddy Kong", "Common"], ["Banjo", "Common"],
  ["Kazooie", "Common"], ["Sans", "Common"], ["Papyrus", "Common"], ["Jigglypuff", "Common"],

  // Uncommon (25)
  ["Samus Aran", "Uncommon"], ["Captain Falcon", "Uncommon"], ["Pit", "Uncommon"], ["Marth", "Uncommon"],
  ["Ike", "Uncommon"], ["Little Mac", "Uncommon"], ["Greninja", "Uncommon"], ["Lucario", "Uncommon"],
  ["Master Chief", "Uncommon"], ["Scorpion", "Uncommon"], ["Sub-Zero", "Uncommon"], ["Raiden", "Uncommon"],
  ["Liu Kang", "Uncommon"], ["Lara Croft", "Uncommon"], ["Nathan Drake", "Uncommon"], ["Sackboy", "Uncommon"],
  ["Astro Bot", "Uncommon"], ["Ratchet", "Uncommon"], ["Clank", "Uncommon"], ["Jak", "Uncommon"],
  ["Daxter", "Uncommon"], ["Meta Knight", "Uncommon"], ["King Dedede", "Uncommon"], ["Falco Lombardi", "Uncommon"],
  ["Wario", "Uncommon"],

  // Rare (15)
  ["Princess Zelda (Breath of the Wild)", "Rare"], ["King K. Rool", "Rare"], ["Dr. Mario", "Rare"],
  ["Metal Sonic", "Rare"], ["Amy Rose", "Rare"], ["Blaze the Cat", "Rare"], ["Charmander", "Rare"],
  ["Squirtle", "Rare"], ["Bulbasaur", "Rare"], ["Slime", "Rare"], ["Solid Snake", "Rare"],
  ["Toon Link", "Rare"], ["Mr. Game & Watch", "Rare"], ["Doom Slayer", "Rare"], ["Pichu", "Rare"],

  // Epic (10)
  ["Ganondorf", "Epic"], ["Bowser", "Epic"], ["Dr. Eggman", "Epic"], ["M. Bison", "Epic"],
  ["Akuma", "Epic"], ["Vergil", "Epic"], ["Dante", "Epic"], ["Bayonetta", "Epic"],
  ["Ridley", "Epic"], ["Ganon (Beast Form)", "Epic"],

  // Legendary (6)
  ["Mario (Fire Form)", "Legendary"], ["Link (Champion Form)", "Legendary"], ["Sonic (Super Sonic)", "Legendary"],
  ["Steve (Netherite Armor)", "Legendary"], ["Pikachu (Gigantamax)", "Legendary"], ["Kirby (Hypernova)", "Legendary"],

  // Mythic (3)
  ["Mewtwo", "Mythic"], ["Freddy Fazbear", "Mythic"], ["Fox McCloud", "Mythic"],

  // Ultra Mythic (1)
  ["Herobrine", "Ultra Mythic"]
];

const rarityColors = {
  'Common': '#94a3b8',
  'Uncommon': '#4ade80',
  'Rare': '#60a5fa',
  'Epic': '#c084fc',
  'Legendary': '#fbbf24',
  'Mythic': '#f87171',
  'Ultra Mythic': '#ffffff'
};

const result = cards.map(([name, rarity]) => {
  const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return `  { id: '${id}', name: '${name}', rarity: '${rarity}', color: '${rarityColors[rarity]}' },`;
}).join('\n');

console.log('export const ALL_CARDS: Card[] = [\n' + result + '\n];');
