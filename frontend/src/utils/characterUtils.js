/**
 * Accurately count Unicode characters including Vietnamese diacritics and emojis.
 * @param {string} text
 * @returns {number}
 */
export const countUnicodeCharacters = (text = '') => {
  if (!text) return 0;
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter('vi', { granularity: 'grapheme' });
    return [...segmenter.segment(text)].length;
  }
  return [...text].length;
};

