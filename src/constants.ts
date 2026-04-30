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
