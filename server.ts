import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Endpoint: Parse text into detailed Zhuyin phonetics
app.post("/api/zhuyin/parse", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ error: "Text is required" });
    }

    const trimmedText = text.trim().substring(0, 50); // Limit input length to prevent token issues

    const prompt = `請分析以下繁體中文詞彙，並將其拆解為詳細的注音符號與拼音：
詞彙："${trimmedText}"

必須按照提供的 JSON 格式回傳，請詳細拆解每個漢字的注音「聲母、介母、韻母、聲調」，並提供整句翻譯與一個簡單的互動例句。
聲母必須是 ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄑㄒㄓㄔㄕㄖㄗㄘㄙ 其中之一，如果該字無聲母則留空。
介母必須是 ㄧㄨㄩ 其中之一，如果無則留空。
韻母必須是 ㄚㄛㄜㄝㄞㄟㄠㄡㄢㄣㄤㄥㄦ 其中之一，如果無則留空。
聲調為 1 (第一聲, 留空或不標), 2 (第二聲, ˊ), 3 (第三聲, ˇ), 4 (第四聲, ˋ), 5 (輕聲, ˙)。`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["translation", "explanation", "characters", "exampleSentence"],
          properties: {
            translation: {
              type: Type.STRING,
              description: "The English translation of the entire input text."
            },
            explanation: {
              type: Type.STRING,
              description: "A short educational note about pronunciation or usage."
            },
            characters: {
              type: Type.ARRAY,
              description: "Character-by-character analysis.",
              items: {
                type: Type.OBJECT,
                required: ["char", "zhuyin", "pinyin", "breakdown"],
                properties: {
                  char: { type: Type.STRING, description: "The Chinese character." },
                  zhuyin: { type: Type.STRING, description: "The full Zhuyin spelling with tone mark (e.g. ㄊㄞˊ)." },
                  pinyin: { type: Type.STRING, description: "The Pinyin spelling (e.g. tái)." },
                  breakdown: {
                    type: Type.OBJECT,
                    required: ["initial", "medial", "rhyme", "tone"],
                    properties: {
                      initial: { type: Type.STRING, description: "The initial / consonant consonant (e.g., ㄊ). Empty if none." },
                      medial: { type: Type.STRING, description: "The medial vowel (ㄧ, ㄨ, ㄩ). Empty if none." },
                      rhyme: { type: Type.STRING, description: "The rhyme vowel (ㄚ, ㄛ, ㄜ, etc.). Empty if none." },
                      tone: { type: Type.STRING, description: "The tone character (e.g. ˊ, ˇ, ˋ, ˙ or empty for 1st tone)." }
                    }
                  }
                }
              }
            },
            exampleSentence: {
              type: Type.OBJECT,
              required: ["chinese", "zhuyin", "english"],
              properties: {
                chinese: { type: Type.STRING, description: "A simple example sentence using the phrase." },
                zhuyin: { type: Type.STRING, description: "The complete Zhuyin spelling of the example sentence with spaces between words." },
                english: { type: Type.STRING, description: "The English translation of the example sentence." }
              }
            }
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini API");
    }

    const data = JSON.parse(resultText);
    res.json(data);
  } catch (error: any) {
    console.error("Error in /api/zhuyin/parse:", error);
    res.status(500).json({ error: error.message || "Failed to parse text" });
  }
});

// Endpoint: Generate dynamic Bopomofo questions / quizzes
app.post("/api/zhuyin/quiz", async (req, res) => {
  try {
    const { category } = req.body; // e.g. "consonants", "medials", "rhymes", "mixed"

    const prompt = `請為繁體中文注音符號學習者生成一個趣味互動單選題庫。
測驗類別：${category || "mixed"}

請回傳 5 題單選題。
每道題目必須是以下三種類型之一：
1. 聲母/介母/韻母聽讀辨析 (給予拼音或注音描述，請選出正確的注音符號，例如：哪一個是聲母 't' 的注音符號？ 答案：ㄊ)
2. 漢字拼讀對應 (給予一個常見漢字，請選出正確的注音，例如：『我』的正確注音是？ 答案：ㄨㄛˇ)
3. 拼音與注音轉換對應 (例如：拼音 'sh' 對應哪一個注音符號？ 答案：ㄕ)

請確保問題描述對初學者友善，且選項具有混淆性。
必須按照提供的 JSON 格式回傳：`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["questions"],
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["id", "type", "question", "options", "answer", "explanation", "audioText"],
                properties: {
                  id: { type: Type.INTEGER, description: "Unique number starting from 1" },
                  type: { type: Type.STRING, description: "The question type: 'symbol-match', 'character-match', or 'pinyin-match'" },
                  question: { type: Type.STRING, description: "The question text, written in Traditional Chinese." },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "An array of 4 multiple-choice options."
                  },
                  answer: { type: Type.STRING, description: "The exact string from options that is the correct answer." },
                  explanation: { type: Type.STRING, description: "An educational explanation of why this answer is correct." },
                  audioText: { type: Type.STRING, description: "If this question should be read aloud, the Chinese character or sound description to be played via Web Speech API (e.g. ㄎ, ㄨㄛˇ, or 我)." }
                }
              }
            }
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini API for quiz");
    }

    const data = JSON.parse(resultText);
    res.json(data);
  } catch (error: any) {
    console.error("Error in /api/zhuyin/quiz:", error);
    res.status(500).json({ error: error.message || "Failed to generate quiz" });
  }
});

// Vite middleware setup for Development or Static serving for Production
if (process.env.NODE_ENV !== "production") {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
