export const normalizeTitle = (name: string) => {
  if (!name) return '';
  
  return name
    .replace(/\.(html|js)$/i, '')
    .replace(/^cl/i, '') // Remove 'cl' prefix
    .replace(/([A-Z])/g, ' $1') // Space before capitals (CamelCase)
    .replace(/(\d+)([a-zA-Z])/g, '$1 $2') // Space between numbers and letters
    .replace(/([a-zA-Z])(\d+)/g, '$1 $2') // Space between letters and numbers
    .replace(/[._\-\s]+/g, ' ') // Replace dots, underscores, hyphens with spaces
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim()
    .split(' ')
    .map(word => {
      if (word.length <= 3 && !/[aeiou]/i.test(word)) return word.toUpperCase(); // Acronyms
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};

const HOMOGLYPHS_MEDIUM: Record<string, string> = {
  'A': 'А', 'a': 'а',
  'E': 'Е', 'e': 'е',
  'I': 'І', 'i': 'і',
  'O': 'О', 'o': 'о',
  'u': 'υ',
};

const HOMOGLYPHS_HIGH: Record<string, string> = {
  ...HOMOGLYPHS_MEDIUM,
  'B': 'Β', 'b': 'Ь',
  'C': 'С', 'c': 'с',
  'D': 'Ⅾ', 'd': 'ԁ',
  'F': 'Ғ', 'f': 'ғ',
  'G': 'Ԍ', 'g': 'ɡ',
  'H': 'Н', 'h': 'һ',
  'J': 'Ј', 'j': 'ј',
  'K': 'К', 'k': 'к',
  'L': 'Ⅼ', 'l': 'ⅼ',
  'M': 'М', 'm': 'м',
  'N': 'Ν', 'n': 'п',
  'P': 'Р', 'p': 'р',
  'Q': 'Ԛ', 'q': 'ԛ',
  'R': 'Ꭱ', 'r': 'г',
  'S': 'Ѕ', 's': 'ѕ',
  'T': 'Т', 't': 'т',
  'U': 'Ս', 'V': 'Ⅴ', 'v': 'ⅴ',
  'W': 'Ԝ', 'w': 'ԝ',
  'X': 'Х', 'x': 'х',
  'Y': 'Ү', 'y': 'у',
  'Z': 'Ζ', 'z': 'ᴢ',
  '0': 'Ο', '1': 'Ⅰ', '2': 'ᛡ', '3': 'З', '4': 'ㄐ', 
  '5': 'Ƽ', '6': 'б', '7': '7', '8': '8', '9': '9', // filling as many as possible
};

export const obfuscate = (text: string, level: number) => {
  if (level <= 1 || !text) return text;
  const map = level === 2 ? HOMOGLYPHS_MEDIUM : HOMOGLYPHS_HIGH;
  return text.split('').map(char => map[char] || char).join('');
};
