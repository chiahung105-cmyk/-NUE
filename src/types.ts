export interface BopomofoSymbol {
  symbol: string;
  pinyin: string;
  name: string;
  example: string;
  examplePinyin: string;
  exampleZhuyin: string;
  category: "consonant" | "medial" | "rhyme";
  audioKey?: string;
  pronunciationGuide?: string;
}

export interface ParsedCharacter {
  char: string;
  zhuyin: string;
  pinyin: string;
  breakdown: {
    initial: string;
    medial: string;
    rhyme: string;
    tone: string;
  };
}

export interface ParseResult {
  translation: string;
  explanation: string;
  characters: ParsedCharacter[];
  exampleSentence: {
    chinese: string;
    zhuyin: string;
    english: string;
  };
}

export interface QuizQuestion {
  id: number;
  type: "symbol-match" | "character-match" | "pinyin-match";
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  audioText?: string;
}

export interface QuizResponse {
  questions: QuizQuestion[];
}
