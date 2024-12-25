// Text analysis utility functions
export interface TextAnalysis {
  wordCount: number;
  characterCount: number;
  sentenceCount: number;
  readabilityScore: number;
}

export function analyzeText(text: string): TextAnalysis {
  if (!text.trim()) {
    return {
      wordCount: 0,
      characterCount: 0,
      sentenceCount: 0,
      readabilityScore: 0,
    };
  }

  const words = text.trim().split(/\s+/);
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  
  // Calculate readability using a simplified Flesch-Kincaid formula
  const avgWordsPerSentence = words.length / Math.max(sentences.length, 1);
  const avgSyllablesPerWord = words.reduce((acc, word) => 
    acc + countSyllables(word), 0) / words.length;
  
  const readabilityScore = Math.min(
    Math.max(
      Math.round(100 - (1.015 * avgWordsPerSentence + 84.6 * avgSyllablesPerWord - 1.015)),
      0
    ),
    100
  );

  return {
    wordCount: words.length,
    characterCount: text.length,
    sentenceCount: sentences.length,
    readabilityScore,
  };
}

function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;
  
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  
  const syllables = word.match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 1;
}