import React, { useState, useRef, useEffect } from "react";
import {
  Volume2,
  BookOpen,
  Edit3,
  HelpCircle,
  Sparkles,
  ChevronRight,
  RefreshCw,
  Award,
  Eraser,
  PenTool,
  CheckCircle,
  XCircle,
  Globe,
  CornerDownRight,
} from "lucide-react";
import { BopomofoSymbol, ParseResult, QuizQuestion } from "./types";

const BOPOMOFO_SYMBOLS: BopomofoSymbol[] = [
  // 聲母 Consonants (21)
  { symbol: "ㄅ", pinyin: "b", name: "玻", example: "爸", examplePinyin: "bà", exampleZhuyin: "ㄅㄚˋ", category: "consonant", pronunciationGuide: "類似英文的 b，如 'boy'，但不送氣。雙唇不送氣清塞音。" },
  { symbol: "ㄆ", pinyin: "p", name: "坡", example: "婆", examplePinyin: "pó", exampleZhuyin: "ㄆㄛˊ", category: "consonant", pronunciationGuide: "類似英文的 p，如 'pie'，為送氣音。雙唇送氣清塞音。" },
  { symbol: "ㄇ", pinyin: "m", name: "摸", example: "媽", examplePinyin: "mā", exampleZhuyin: "ㄇㄚ", category: "consonant", pronunciationGuide: "與英文的 m 相同，如 'mother'。雙唇鼻音。" },
  { symbol: "ㄈ", pinyin: "f", name: "佛", example: "飛", examplePinyin: "fēi", exampleZhuyin: "ㄈㄟ", category: "consonant", pronunciationGuide: "與英文的 f 相同，如 'fly'。唇齒清擦音。" },
  { symbol: "ㄉ", pinyin: "d", name: "得", example: "大", examplePinyin: "dà", exampleZhuyin: "ㄉㄚˋ", category: "consonant", pronunciationGuide: "類似英文的 d，如 'day' 且不送氣。舌尖中不送氣清塞音。" },
  { symbol: "ㄊ", pinyin: "t", name: "特", example: "天", examplePinyin: "tiān", exampleZhuyin: "ㄊㄧㄢ", category: "consonant", pronunciationGuide: "類似英文的 t，如 'toy'，為送氣音。舌尖中送氣清塞音。" },
  { symbol: "ㄋ", pinyin: "n", name: "訥", example: "你", examplePinyin: "nǐ", exampleZhuyin: "ㄋㄧˇ", category: "consonant", pronunciationGuide: "與英文的 n 相同，如 'no'。舌尖中鼻音。" },
  { symbol: "ㄌ", pinyin: "l", name: "勒", example: "來", examplePinyin: "lái", exampleZhuyin: "ㄌㄞˊ", category: "consonant", pronunciationGuide: "與英文的 l 相同，如 'love'。舌尖中邊音。" },
  { symbol: "ㄍ", pinyin: "g", name: "哥", example: "歌", examplePinyin: "gē", exampleZhuyin: "ㄍㄜ", category: "consonant", pronunciationGuide: "類似英文的 g，如 'game' 且不送氣。舌根不送氣清塞音。" },
  { symbol: "ㄎ", pinyin: "k", name: "科", example: "口", examplePinyin: "kǒu", exampleZhuyin: "ㄎㄡˇ", category: "consonant", pronunciationGuide: "類似英文的 k，如 'kite'，為送氣音。舌根送氣清塞音。" },
  { symbol: "ㄏ", pinyin: "h", name: "喝", example: "好", examplePinyin: "hǎo", exampleZhuyin: "ㄏㄠˇ", category: "consonant", pronunciationGuide: "類似英文的 h，如 'hat'。舌根清擦音。" },
  { symbol: "ㄐ", pinyin: "j", name: "基", example: "家", examplePinyin: "jiā", exampleZhuyin: "ㄐㄧㄚ", category: "consonant", pronunciationGuide: "類似英文的 j，如 'jeep'，不送氣。舌面前不送氣清塞擦音。" },
  { symbol: "ㄑ", pinyin: "q", name: "欺", example: "去", examplePinyin: "qù", exampleZhuyin: "ㄑㄩˋ", category: "consonant", pronunciationGuide: "類似英文的 ch，如 'cheap'，為送氣音。舌面前送氣清塞擦音。" },
  { symbol: "ㄒ", pinyin: "x", name: "希", example: "小", examplePinyin: "xiǎo", exampleZhuyin: "ㄒㄧㄠˇ", category: "consonant", pronunciationGuide: "類似英文的 sh 偏平，如 'she'。舌面前清擦音。" },
  { symbol: "ㄓ", pinyin: "zh", name: "知", example: "中", examplePinyin: "zhōng", exampleZhuyin: "ㄓㄨㄥ", category: "consonant", pronunciationGuide: "捲舌音，不送氣。類似英文的 j 但發音位置靠後。舌尖後不送氣清塞擦音。" },
  { symbol: "ㄔ", pinyin: "ch", name: "車", example: "車", examplePinyin: "chē", exampleZhuyin: "ㄔㄜ", category: "consonant", pronunciationGuide: "捲舌音，送氣。類似英文的 ch 但發音位置靠後。舌尖後送氣清塞擦音。" },
  { symbol: "ㄕ", pinyin: "sh", name: "詩", example: "山", examplePinyin: "shān", exampleZhuyin: "ㄕㄢ", category: "consonant", pronunciationGuide: "捲舌音，摩擦發聲。類似英文的 sh 但位置偏後。舌尖後清擦音。" },
  { symbol: "ㄖ", pinyin: "r", name: "日", example: "日", examplePinyin: "rì", exampleZhuyin: "ㄖˋ", category: "consonant", pronunciationGuide: "捲舌濁擦音，發音類似英文 r，但摩擦感較重。" },
  { symbol: "ㄗ", pinyin: "z", name: "資", example: "字", examplePinyin: "zì", exampleZhuyin: "ㄗˋ", category: "consonant", pronunciationGuide: "不捲舌音，不送氣。發音位置在牙齒。舌尖前不送氣清塞擦音。" },
  { symbol: "ㄘ", pinyin: "c", name: "雌", example: "草", examplePinyin: "cǎo", exampleZhuyin: "ㄘㄠˇ", category: "consonant", pronunciationGuide: "不捲舌音，送氣。發音位置在牙齒。舌尖前送氣清塞擦音。" },
  { symbol: "ㄙ", pinyin: "s", name: "思", example: "三", examplePinyin: "sān", exampleZhuyin: "ㄙㄢ", category: "consonant", pronunciationGuide: "不捲舌音。發音類似英文 s。舌尖前清擦音。" },

  // 介母 Medials (3)
  { symbol: "ㄧ", pinyin: "yi / i", name: "衣", example: "一", examplePinyin: "yī", exampleZhuyin: "ㄧ", category: "medial", pronunciationGuide: "與英文的 'ee' 相同，如 'meet'。閉前不圓唇元音。" },
  { symbol: "ㄨ", pinyin: "wu / u", name: "污", example: "五", examplePinyin: "wǔ", exampleZhuyin: "ㄨˇ", category: "medial", pronunciationGuide: "與英文的 'oo' 相同，如 'boot'。閉後圓唇元音。" },
  { symbol: "ㄩ", pinyin: "yu / ü", name: "迂", example: "雨", examplePinyin: "yǔ", exampleZhuyin: "ㄩˇ", category: "medial", pronunciationGuide: "類似德文的 'ü' 或法文 'u'。發音時嘴唇用力搓圓。閉前圓唇元音。" },

  // 韻母 Rhymes (13)
  { symbol: "ㄚ", pinyin: "a", name: "啊", example: "阿", examplePinyin: "ā", exampleZhuyin: "ㄚ", category: "rhyme", pronunciationGuide: "類似英文 'ah'，如 'father'。開前不圓唇元音。" },
  { symbol: "ㄛ", pinyin: "o", name: "喔", example: "哦", examplePinyin: "ó", exampleZhuyin: "ㄛˊ", category: "rhyme", pronunciationGuide: "類似英文的 'o' 偏圓。半閉後圓唇元音。" },
  { symbol: "ㄜ", pinyin: "e", name: "鵝", example: "鵝", examplePinyin: "é", exampleZhuyin: "ㄜˊ", category: "rhyme", pronunciationGuide: "中後不圓唇元音，發音時嘴角向兩側拉開。" },
  { symbol: "ㄝ", pinyin: "ê", name: "誒", example: "葉", examplePinyin: "yè", exampleZhuyin: "ㄧㄝˋ", category: "rhyme", pronunciationGuide: "類似英文 'get' 中的 e。半開前不圓唇元音。" },
  { symbol: "ㄞ", pinyin: "ai", name: "哀", example: "愛", examplePinyin: "ài", exampleZhuyin: "ㄞˋ", category: "rhyme", pronunciationGuide: "類似英文 'tie' 的發音。前響雙元音。" },
  { symbol: "ㄟ", pinyin: "ei", name: "矦", example: "美", examplePinyin: "měi", exampleZhuyin: "ㄇㄟˇ", category: "rhyme", pronunciationGuide: "類似英文 'say' 中的 ay。前響雙元音。" },
  { symbol: "ㄠ", pinyin: "ao", name: "熬", example: "包", examplePinyin: "bāo", exampleZhuyin: "ㄅㄠ", category: "rhyme", pronunciationGuide: "類似英文 'how' 中的 ow。前響雙元音。" },
  { symbol: "ㄡ", pinyin: "ou", name: "歐", example: "口", examplePinyin: "kǒu", exampleZhuyin: "ㄎㄡˇ", category: "rhyme", pronunciationGuide: "類似英文 'go' 中的 o。前響雙元音。" },
  { symbol: "ㄢ", pinyin: "an", name: "安", example: "安", examplePinyin: "ān", exampleZhuyin: "ㄢ", category: "rhyme", pronunciationGuide: "發音由元音 ㄚ 往鼻音 n 滑動。前鼻音韻尾。" },
  { symbol: "ㄣ", pinyin: "en", name: "恩", example: "人", examplePinyin: "rén", exampleZhuyin: "ㄖㄣˊ", category: "rhyme", pronunciationGuide: "類似英文 'open' 中的 en 聲。前鼻音韻尾。" },
  { symbol: "ㄤ", pinyin: "ang", name: "昂", example: "幫", examplePinyin: "bāng", exampleZhuyin: "ㄅㄤ", category: "rhyme", pronunciationGuide: "發音由元音 ㄚ 往後鼻音 ng 滑動。後鼻音韻尾。" },
  { symbol: "ㄥ", pinyin: "eng", name: "亨", example: "風", examplePinyin: "fēng", exampleZhuyin: "ㄈㄥ", category: "rhyme", pronunciationGuide: "發音由 ㄜ 或 ㄨ 往後鼻音 ng 滑動。後鼻音韻尾。" },
  { symbol: "ㄦ", pinyin: "er", name: "兒", example: "二", examplePinyin: "èr", exampleZhuyin: "ㄦˋ", category: "rhyme", pronunciationGuide: "捲舌韻母，類似英文 'butter' 的 er 聲。" },
];

export default function App() {
  const [activeSymbol, setActiveSymbol] = useState<BopomofoSymbol>(BOPOMOFO_SYMBOLS[0]);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Parser states
  const [inputText, setInputText] = useState("台灣");
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState("");

  // Quiz states
  const [quizCategory, setQuizCategory] = useState("mixed");
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  // Initialize Canvas Grid guidelines & load initial parse
  useEffect(() => {
    drawGrid();
  }, [activeSymbol]);

  useEffect(() => {
    // Run an initial quick parse of "台灣"
    handleParseText();
  }, []);

  const drawGrid = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear and draw grid background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw outer boundary
    ctx.strokeStyle = "#E5E1D8";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Draw dashed vertical/horizontal dividing lines for traditional calligraphy practicing
    ctx.strokeStyle = "#F0EDE6";
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1;
    
    // Vertical line
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // Reset line dash
    ctx.setLineDash([]);

    // Draw ghost placeholder symbol in center
    ctx.fillStyle = "rgba(45, 41, 38, 0.08)";
    ctx.font = "italic 110px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(activeSymbol.symbol, canvas.width / 2, canvas.height / 2);
  };

  // Text-To-Speech Pronunciation using Web Speech API
  const handleSpeak = (text: string) => {
    if (!("speechSynthesis" in window)) {
      alert("您的瀏覽器不支援語音合成服務。");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Look for Taiwan Mandarian voice
    const voices = window.speechSynthesis.getVoices();
    const twVoice = voices.find((v) => v.lang.includes("zh-TW")) ||
                    voices.find((v) => v.lang.includes("zh-HK")) ||
                    voices.find((v) => v.lang.includes("zh-CN")) ||
                    voices.find((v) => v.lang.startsWith("zh"));
    if (twVoice) {
      utterance.voice = twVoice;
    }
    utterance.lang = "zh-TW";
    utterance.rate = 0.8; // Friendly, deliberate learning speed
    window.speechSynthesis.speak(utterance);
  };

  // Drawing pad handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = "#2D2926"; // Elegant charcoal black
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Parse Chinese text endpoint trigger
  const handleParseText = async () => {
    if (!inputText.trim()) return;
    setIsParsing(true);
    setParseError("");
    try {
      const response = await fetch("/api/zhuyin/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });
      if (!response.ok) throw new Error("解析時伺服器發生異常");
      const data = await response.json();
      setParseResult(data);
    } catch (err: any) {
      setParseError(err.message || "無法解析文字，請稍後重試。");
    } finally {
      setIsParsing(false);
    }
  };

  // Quiz generator trigger
  const handleStartQuiz = async () => {
    setIsQuizLoading(true);
    setQuizCompleted(false);
    setQuizScore(0);
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setQuizFeedback(null);
    try {
      const response = await fetch("/api/zhuyin/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: quizCategory }),
      });
      if (!response.ok) throw new Error("測驗載入失敗");
      const data = await response.json();
      if (data && data.questions) {
        setQuizQuestions(data.questions);
      }
    } catch (err) {
      alert("載入互動測驗時發生錯誤。");
    } finally {
      setIsQuizLoading(false);
    }
  };

  // Submit Answer handler
  const handleSelectAnswer = (option: string) => {
    if (selectedAnswer !== null) return; // Prevent multiple clicks
    setSelectedAnswer(option);
    const currentQuestion = quizQuestions[currentQuizIndex];
    const isCorrect = option === currentQuestion.answer;
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
      setQuizFeedback("恭喜，回答正確！");
    } else {
      setQuizFeedback(`不小心答錯囉！正確答案是：${currentQuestion.answer}`);
    }

    // Play TTS of audioText or symbol to assist listening comprehension
    if (currentQuestion.audioText) {
      handleSpeak(currentQuestion.audioText);
    }
  };

  // Go to next question or complete
  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setQuizFeedback(null);
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  // Preset quick phrases for the parser
  const PRESET_PHRASES = ["台灣", "注音符號", "學習快樂", "謝謝你", "美麗山川"];

  return (
    <div className="w-full min-h-screen bg-[#F9F7F2] text-[#2D2926] font-serif flex flex-col transition-colors duration-150">
      
      {/* Top Banner & Title Board */}
      <header className="max-w-7xl w-full mx-auto px-6 py-8 md:py-12 border-b-2 border-[#2D2926] flex flex-col md:flex-row justify-between items-baseline gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-[#2D2926] text-[#F9F7F2] text-xs px-2 py-1 font-sans font-bold tracking-widest uppercase">
              BOPOMOFO EDUCATION
            </span>
            <span className="text-xs font-sans tracking-widest text-emerald-800 font-bold bg-emerald-50 px-2 py-1 border border-emerald-200">
              ● 互動式 AI 語文學習
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#2D2926]">
            注音符號學習指南
          </h1>
          <p className="text-lg md:text-xl italic opacity-80 mt-1 font-serif tracking-wide">
            The Traditional Chinese Bopomofo Reference Board
          </p>
        </div>
        
        <div className="text-left md:text-right">
          <span className="block text-xs font-sans font-extrabold tracking-[0.2em] uppercase opacity-60">
            CHINESE REFERENCE CHART
          </span>
          <span className="text-3xl md:text-4xl font-light leading-none">
            繁體中文 • ㄅㄆㄇ
          </span>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="max-w-7xl w-full mx-auto px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left/Middle Column (8/12) - Interactive Reference Wall & Canvas practicing */}
        <section className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Symbol Reference board */}
          <div className="bg-white p-6 border border-[#E5E1D8] shadow-sm rounded-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#2D2926] pb-4 mb-6 gap-3">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-[#2D2926]" />
                <h2 className="text-2xl font-bold tracking-wide">01. ㄅㄆㄇ 符號總表</h2>
              </div>
              <p className="text-xs font-sans text-stone-500 tracking-wider">
                * 點擊任意符號可查看發音口訣、手寫練習與語音朗讀
              </p>
            </div>

            {/* Consonants section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-[#2D2926] text-[#F9F7F2] text-[10px] px-1.5 py-0.5 font-sans font-bold">聲母</span>
                <span className="text-sm font-bold italic tracking-wide text-stone-600">聲母 Consonants (21)</span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {BOPOMOFO_SYMBOLS.filter((s) => s.category === "consonant").map((sym) => (
                  <button
                    key={sym.symbol}
                    onClick={() => {
                      setActiveSymbol(sym);
                      handleSpeak(sym.symbol);
                    }}
                    className={`group relative flex flex-col items-center justify-center p-3 border transition-all duration-150 rounded-sm cursor-pointer ${
                      activeSymbol.symbol === sym.symbol
                        ? "bg-[#2D2926] text-[#F9F7F2] border-[#2D2926] scale-105 shadow-md"
                        : "bg-stone-50 text-[#2D2926] border-[#E5E1D8] hover:bg-[#F0EDE6] hover:border-stone-400"
                    }`}
                  >
                    <span className="text-3xl font-extrabold mb-1">{sym.symbol}</span>
                    <span className="text-xs font-mono opacity-60 uppercase">{sym.pinyin}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Medials and Rhymes Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Medials */}
              <div className="md:col-span-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#2D2926] text-[#F9F7F2] text-[10px] px-1.5 py-0.5 font-sans font-bold">介母</span>
                  <span className="text-sm font-bold italic tracking-wide text-stone-600">介母 Medials (3)</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {BOPOMOFO_SYMBOLS.filter((s) => s.category === "medial").map((sym) => (
                    <button
                      key={sym.symbol}
                      onClick={() => {
                        setActiveSymbol(sym);
                        handleSpeak(sym.symbol);
                      }}
                      className={`flex flex-col items-center justify-center p-3 border transition-all duration-150 rounded-sm cursor-pointer ${
                        activeSymbol.symbol === sym.symbol
                          ? "bg-[#2D2926] text-[#F9F7F2] border-[#2D2926] scale-105 shadow-md"
                          : "bg-stone-50 text-[#2D2926] border-[#E5E1D8] hover:bg-[#F0EDE6] hover:border-stone-400"
                      }`}
                    >
                      <span className="text-3xl font-extrabold mb-1">{sym.symbol}</span>
                      <span className="text-xs font-mono opacity-60 uppercase">{sym.pinyin}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rhymes */}
              <div className="md:col-span-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#2D2926] text-[#F9F7F2] text-[10px] px-1.5 py-0.5 font-sans font-bold">韻母</span>
                  <span className="text-sm font-bold italic tracking-wide text-stone-600">韻母 Rhymes (13)</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {BOPOMOFO_SYMBOLS.filter((s) => s.category === "rhyme").map((sym) => (
                    <button
                      key={sym.symbol}
                      onClick={() => {
                        setActiveSymbol(sym);
                        handleSpeak(sym.symbol);
                      }}
                      className={`flex flex-col items-center justify-center p-3 border transition-all duration-150 rounded-sm cursor-pointer ${
                        activeSymbol.symbol === sym.symbol
                          ? "bg-[#2D2926] text-[#F9F7F2] border-[#2D2926] scale-105 shadow-md"
                          : "bg-stone-50 text-[#2D2926] border-[#E5E1D8] hover:bg-[#F0EDE6] hover:border-stone-400"
                      }`}
                    >
                      <span className="text-3xl font-extrabold mb-1">{sym.symbol}</span>
                      <span className="text-xs font-mono opacity-60 uppercase">{sym.pinyin}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Active Symbol Details & Calligraphy Practice Pad */}
          <div className="bg-[#F0EDE6] border border-[#2D2926] p-6 rounded-sm grid grid-cols-1 md:grid-cols-12 gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-stone-300 opacity-20 rounded-full blur-xl"></div>
            
            {/* Left side detail texts */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-[#2D2926] text-[#F9F7F2] text-xs px-2 py-0.5 font-sans uppercase tracking-widest font-bold">
                    {activeSymbol.category === "consonant" ? "聲母 Consonant" : activeSymbol.category === "medial" ? "介母 Medial" : "韻母 Rhyme"}
                  </span>
                  <span className="text-xs font-sans text-stone-600">
                    注音本音：{activeSymbol.name}
                  </span>
                </div>

                <div className="flex items-baseline gap-4 mb-4">
                  <h3 className="text-7xl font-extrabold text-[#2D2926]">{activeSymbol.symbol}</h3>
                  <div className="flex flex-col">
                    <span className="text-2xl font-mono font-bold text-stone-700">/{activeSymbol.pinyin}/</span>
                    <span className="text-xs font-sans text-stone-500 uppercase tracking-widest">Pinyin Romanization</span>
                  </div>
                </div>

                <div className="space-y-3 font-sans text-stone-800">
                  <p className="text-sm bg-white p-3 border-l-4 border-[#2D2926] leading-relaxed">
                    <strong className="block text-xs font-bold text-[#2D2926] mb-1 font-sans">發音口訣 & 特徵:</strong>
                    {activeSymbol.pronunciationGuide}
                  </p>

                  <div className="bg-white/80 p-3 rounded-sm border border-stone-300 grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-[10px] text-stone-500 uppercase font-bold tracking-wider">練習例字</span>
                      <span className="text-2xl font-serif font-bold text-[#2D2926]">{activeSymbol.example}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-stone-500 uppercase font-bold tracking-wider">例字拼讀</span>
                      <span className="text-sm font-sans font-bold text-stone-700">
                        {activeSymbol.examplePinyin} ({activeSymbol.exampleZhuyin})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-300 flex flex-wrap gap-2">
                <button
                  onClick={() => handleSpeak(activeSymbol.symbol)}
                  className="flex items-center gap-2 bg-[#2D2926] text-[#F9F7F2] hover:bg-stone-800 px-4 py-2 text-sm font-sans font-bold cursor-pointer transition-all rounded-sm shadow-sm"
                >
                  <Volume2 className="w-4 h-4" />
                  聽符號發音
                </button>
                <button
                  onClick={() => handleSpeak(activeSymbol.example)}
                  className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-[#2D2926] border border-[#2D2926] px-4 py-2 text-sm font-sans font-bold cursor-pointer transition-all rounded-sm"
                >
                  <Volume2 className="w-4 h-4" />
                  聽例字「{activeSymbol.example}」
                </button>
              </div>
            </div>

            {/* Right side practice board */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2 w-full justify-between">
                <span className="text-xs font-sans font-extrabold tracking-wider text-stone-700 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5" />
                  筆順手寫練習板
                </span>
                <button
                  onClick={drawGrid}
                  className="text-[10px] font-sans font-bold bg-white text-stone-600 border border-stone-300 px-2 py-0.5 hover:bg-stone-50 cursor-pointer rounded-sm flex items-center gap-1"
                >
                  <Eraser className="w-3 h-3" />
                  重寫
                </button>
              </div>

              <div className="bg-white p-1 rounded-sm border-2 border-dashed border-[#2D2926]">
                <canvas
                  id="bopomofo-canvas"
                  ref={canvasRef}
                  width={200}
                  height={200}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="cursor-crosshair block touch-none"
                />
              </div>
              <p className="text-[10px] font-sans text-stone-500 mt-2 text-center">
                可以使用滑鼠或手指直接在上方格子內描寫
              </p>
            </div>
          </div>

          {/* Interactive Tone Pitch Map */}
          <div className="bg-white p-6 border border-[#E5E1D8] rounded-sm">
            <div className="border-b border-[#2D2926] pb-3 mb-6 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-[#2D2926]" />
              <h2 className="text-2xl font-bold tracking-wide">02. 聲調與調型指南</h2>
            </div>
            
            <p className="text-sm font-sans text-stone-700 mb-6 leading-relaxed">
              注音拼讀共有五個聲調。聲調決定了同一個發音所代表的不同漢字，極其關鍵。點擊下方聲調按鈕，傾聽由同一個音節（如：ma）延伸出的五種不同聲調起伏。
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              
              <div className="border border-stone-200 p-4 bg-stone-50 rounded-sm text-center flex flex-col justify-between">
                <div>
                  <span className="block text-xs font-sans font-bold text-stone-500 uppercase tracking-wider mb-1">第一聲 (陰平)</span>
                  <span className="text-xs bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded font-sans inline-block mb-3">高平調 (55)</span>
                  <div className="text-3xl font-extrabold text-[#2D2926] my-2">ㄇㄚ</div>
                  <p className="text-xs font-mono text-stone-500">mā (不標號)</p>
                </div>
                <button
                  onClick={() => handleSpeak("媽")}
                  className="mt-4 w-full bg-[#2D2926] hover:bg-stone-800 text-[#F9F7F2] text-xs font-sans py-1.5 px-2 rounded-sm cursor-pointer transition-all flex items-center justify-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" /> 聽發音
                </button>
              </div>

              <div className="border border-stone-200 p-4 bg-stone-50 rounded-sm text-center flex flex-col justify-between">
                <div>
                  <span className="block text-xs font-sans font-bold text-stone-500 uppercase tracking-wider mb-1">第二聲 (陽平)</span>
                  <span className="text-xs bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded font-sans inline-block mb-3">中升調 (35)</span>
                  <div className="text-3xl font-extrabold text-[#2D2926] my-2">ㄇㄚˊ</div>
                  <p className="text-xs font-mono text-stone-500">má (標 ˊ)</p>
                </div>
                <button
                  onClick={() => handleSpeak("麻")}
                  className="mt-4 w-full bg-[#2D2926] hover:bg-stone-800 text-[#F9F7F2] text-xs font-sans py-1.5 px-2 rounded-sm cursor-pointer transition-all flex items-center justify-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" /> 聽發音
                </button>
              </div>

              <div className="border border-stone-200 p-4 bg-stone-50 rounded-sm text-center flex flex-col justify-between">
                <div>
                  <span className="block text-xs font-sans font-bold text-stone-500 uppercase tracking-wider mb-1">第三聲 (上聲)</span>
                  <span className="text-xs bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded font-sans inline-block mb-3">降升調 (214)</span>
                  <div className="text-3xl font-extrabold text-[#2D2926] my-2">ㄇㄚˇ</div>
                  <p className="text-xs font-mono text-stone-500">mǎ (標 ˇ)</p>
                </div>
                <button
                  onClick={() => handleSpeak("馬")}
                  className="mt-4 w-full bg-[#2D2926] hover:bg-stone-800 text-[#F9F7F2] text-xs font-sans py-1.5 px-2 rounded-sm cursor-pointer transition-all flex items-center justify-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" /> 聽發音
                </button>
              </div>

              <div className="border border-stone-200 p-4 bg-stone-50 rounded-sm text-center flex flex-col justify-between">
                <div>
                  <span className="block text-xs font-sans font-bold text-stone-500 uppercase tracking-wider mb-1">第四聲 (去聲)</span>
                  <span className="text-xs bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded font-sans inline-block mb-3">全降調 (51)</span>
                  <div className="text-3xl font-extrabold text-[#2D2926] my-2">ㄇㄚˋ</div>
                  <p className="text-xs font-mono text-stone-500">mà (標 ˋ)</p>
                </div>
                <button
                  onClick={() => handleSpeak("罵")}
                  className="mt-4 w-full bg-[#2D2926] hover:bg-stone-800 text-[#F9F7F2] text-xs font-sans py-1.5 px-2 rounded-sm cursor-pointer transition-all flex items-center justify-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" /> 聽發音
                </button>
              </div>

              <div className="border border-stone-200 p-4 bg-stone-50 rounded-sm text-center flex flex-col justify-between">
                <div>
                  <span className="block text-xs font-sans font-bold text-stone-500 uppercase tracking-wider mb-1">輕聲 (輕)</span>
                  <span className="text-xs bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded font-sans inline-block mb-3">短促音 (3)</span>
                  <div className="text-3xl font-extrabold text-[#2D2926] my-2">˙ㄇㄚ</div>
                  <p className="text-xs font-mono text-stone-500">ma (前方標 ˙)</p>
                </div>
                <button
                  onClick={() => handleSpeak("嗎")}
                  className="mt-4 w-full bg-[#2D2926] hover:bg-stone-800 text-[#F9F7F2] text-xs font-sans py-1.5 px-2 rounded-sm cursor-pointer transition-all flex items-center justify-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" /> 聽發音
                </button>
              </div>

            </div>
          </div>

        </section>

        {/* Right Column (4/12) - Parser & Smart AI Quiz Box */}
        <section className="lg:col-span-4 flex flex-col gap-8">
          
          {/* AI Parser Widget */}
          <div className="bg-white p-6 border border-[#E5E1D8] shadow-sm rounded-sm">
            <div className="border-b border-[#2D2926] pb-3 mb-4 flex items-center gap-2.5">
              <Globe className="w-5 h-5 text-[#2D2926]" />
              <h2 className="text-xl font-bold tracking-wide">03. AI 漢字注音解析器</h2>
            </div>

            <p className="text-xs font-sans text-stone-600 mb-4 leading-relaxed">
              在下方輸入任何中文語詞（最長50字），AI 將為您即時拆解其拼讀構造（聲、介、韻、調），並提供英譯與造句！
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-sans font-extrabold tracking-wider text-stone-500 uppercase mb-1">
                  請輸入漢字進行拆解：
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    maxLength={50}
                    placeholder="例如：學習、注音符號、你好"
                    className="flex-1 bg-stone-50 border border-stone-300 rounded-sm px-3 py-2 text-sm font-sans focus:outline-none focus:border-[#2D2926]"
                  />
                  <button
                    onClick={handleParseText}
                    disabled={isParsing || !inputText.trim()}
                    className="bg-[#2D2926] hover:bg-stone-800 disabled:bg-stone-400 text-[#F9F7F2] text-xs font-sans font-bold px-4 py-2 rounded-sm cursor-pointer transition-all flex items-center gap-1"
                  >
                    {isParsing ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    解析
                  </button>
                </div>
              </div>

              {/* Presets */}
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[10px] font-sans text-stone-500">推薦熱詞：</span>
                {PRESET_PHRASES.map((phrase) => (
                  <button
                    key={phrase}
                    onClick={() => {
                      setInputText(phrase);
                      // Trigger instantly on state change after current render cycle
                      setTimeout(() => {
                        const btn = document.querySelector(`button[data-phrase="${phrase}"]`);
                        if (btn) (btn as HTMLButtonElement).click();
                      }, 50);
                    }}
                    className="text-[10px] font-sans bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 px-2 py-0.5 rounded-sm cursor-pointer transition-all"
                  >
                    {phrase}
                  </button>
                ))}
                {/* Hidden click proxy for preset instant trigger */}
                <button
                  id="preset-proxy"
                  onClick={handleParseText}
                  className="hidden"
                />
              </div>

              {/* Parse Results block */}
              {parseError && (
                <div className="bg-red-50 text-red-800 text-xs p-3 border border-red-200 rounded-sm">
                  {parseError}
                </div>
              )}

              {isParsing && (
                <div className="py-12 flex flex-col items-center justify-center bg-stone-50 border border-dashed border-stone-300 rounded-sm">
                  <RefreshCw className="w-8 h-8 text-[#2D2926] animate-spin mb-2" />
                  <p className="text-xs font-sans text-stone-600">
                    AI 正在精密拆解注音結構中...
                  </p>
                </div>
              )}

              {!isParsing && parseResult && (
                <div className="border-t border-[#E5E1D8] pt-4 space-y-4 font-sans">
                  
                  {/* Cards for each character */}
                  <div className="space-y-3">
                    <span className="block text-[10px] font-sans font-extrabold tracking-wider text-stone-500 uppercase">
                      漢字與聲韻解構：
                    </span>
                    
                    <div className="flex flex-wrap gap-2">
                      {parseResult.characters.map((charData, idx) => (
                        <div
                          key={idx}
                          className="flex-1 min-w-[70px] bg-[#F9F7F2] border border-stone-300 p-2 text-center rounded-sm relative group hover:border-stone-500 transition-all duration-150"
                        >
                          <div className="text-3xl font-serif font-extrabold text-[#2D2926] mb-1">
                            {charData.char}
                          </div>
                          
                          <div className="text-sm font-sans font-bold text-stone-800 mb-1">
                            {charData.zhuyin}
                          </div>

                          <div className="text-[10px] font-mono text-stone-500 uppercase mb-2">
                            {charData.pinyin}
                          </div>

                          {/* Mini Anatomy breakdown block */}
                          <div className="border-t border-stone-200 pt-1.5 text-[9px] text-stone-600 space-y-0.5 text-left">
                            <div className="flex justify-between">
                              <span>聲母:</span>
                              <span className="font-bold text-[#2D2926]">{charData.breakdown.initial || "無"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>介母:</span>
                              <span className="font-bold text-[#2D2926]">{charData.breakdown.medial || "無"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>韻母:</span>
                              <span className="font-bold text-[#2D2926]">{charData.breakdown.rhyme || "無"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>聲調:</span>
                              <span className="font-bold text-indigo-700">
                                {charData.breakdown.tone === "1" || charData.breakdown.tone === "" ? "1聲" : charData.breakdown.tone}
                              </span>
                            </div>
                          </div>

                          {/* Sound speak button */}
                          <button
                            onClick={() => handleSpeak(charData.char)}
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-stone-200 hover:bg-stone-300 text-[#2D2926] p-0.5 rounded cursor-pointer transition-all"
                            title="朗讀單字"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Translation & Notes */}
                  <div className="bg-stone-50 p-3 rounded-sm border border-stone-200 space-y-2 text-xs">
                    <div>
                      <span className="block font-bold text-stone-600">English Translation:</span>
                      <p className="text-stone-800 italic">{parseResult.translation}</p>
                    </div>
                    <div>
                      <span className="block font-bold text-stone-600">AI 學習小註解:</span>
                      <p className="text-stone-700 leading-relaxed">{parseResult.explanation}</p>
                    </div>
                  </div>

                  {/* Dynamic Sentence block */}
                  <div className="bg-[#2D2926] text-[#F9F7F2] p-4 rounded-sm space-y-2">
                    <span className="block text-[9px] uppercase tracking-widest opacity-50 font-bold">
                      拼讀實戰造句 (Example Usage):
                    </span>
                    <p className="text-lg font-serif font-bold text-white tracking-wide">
                      {parseResult.exampleSentence.chinese}
                    </p>
                    <div className="text-xs opacity-80 leading-relaxed font-sans border-l-2 border-[#F9F7F2]/30 pl-2">
                      <p className="font-bold text-[#F9F7F2]">{parseResult.exampleSentence.zhuyin}</p>
                      <p className="text-stone-300 italic mt-1">{parseResult.exampleSentence.english}</p>
                    </div>
                    <button
                      onClick={() => handleSpeak(parseResult.exampleSentence.chinese)}
                      className="mt-2 text-[10px] font-sans font-bold bg-white/10 hover:bg-white/20 text-[#F9F7F2] py-1 px-2 border border-white/20 rounded-sm cursor-pointer transition-all flex items-center gap-1"
                    >
                      <Volume2 className="w-3 h-3" /> 聽整句朗讀
                    </button>
                  </div>

                </div>
              )}
            </div>
          </div>

          {/* AI Interactive Quiz Chamber */}
          <div className="bg-[#2D2926] text-[#F9F7F2] p-6 border border-[#2D2926] shadow-md rounded-sm">
            <div className="border-b border-[#F9F7F2]/20 pb-3 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-300" />
                <h2 className="text-xl font-bold tracking-wide text-white">04. 互動知識挑戰</h2>
              </div>
              <span className="text-[10px] font-mono bg-amber-400 text-[#2D2926] px-1.5 py-0.5 rounded font-extrabold">
                QUIZ
              </span>
            </div>

            {/* Preparation / Settings Area */}
            {quizQuestions.length === 0 && !isQuizLoading && (
              <div className="space-y-4">
                <p className="text-xs opacity-80 leading-relaxed">
                  想知道自己對 ㄅㄆㄇ 的熟悉程度嗎？讓 AI 為您打造客製化的注音隨堂測驗！
                </p>

                <div className="space-y-3 text-stone-800">
                  <label className="block text-[10px] font-sans font-extrabold tracking-wider text-[#F9F7F2]/60 uppercase">
                    請選擇測驗範圍：
                  </label>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setQuizCategory("mixed")}
                      className={`text-xs py-2 px-1 text-center font-sans font-bold border rounded-sm cursor-pointer transition-all ${
                        quizCategory === "mixed"
                          ? "bg-amber-400 text-[#2D2926] border-amber-400"
                          : "bg-white/10 text-stone-200 border-white/20 hover:bg-white/20"
                      }`}
                    >
                      混合大會考
                    </button>
                    <button
                      onClick={() => setQuizCategory("consonants")}
                      className={`text-xs py-2 px-1 text-center font-sans font-bold border rounded-sm cursor-pointer transition-all ${
                        quizCategory === "consonants"
                          ? "bg-amber-400 text-[#2D2926] border-amber-400"
                          : "bg-white/10 text-stone-200 border-white/20 hover:bg-white/20"
                      }`}
                    >
                      聲母專場
                    </button>
                    <button
                      onClick={() => setQuizCategory("rhymes")}
                      className={`text-xs py-2 px-1 text-center font-sans font-bold border rounded-sm cursor-pointer transition-all ${
                        quizCategory === "rhymes"
                          ? "bg-amber-400 text-[#2D2926] border-amber-400"
                          : "bg-white/10 text-stone-200 border-white/20 hover:bg-white/20"
                      }`}
                    >
                      介韻母專場
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleStartQuiz}
                  className="w-full bg-amber-400 hover:bg-amber-300 text-[#2D2926] font-sans font-bold py-3 text-sm tracking-widest uppercase transition-all rounded-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  生成客製化測驗卷
                </button>
              </div>
            )}

            {/* Loading animation */}
            {isQuizLoading && (
              <div className="py-16 text-center flex flex-col items-center justify-center">
                <RefreshCw className="w-10 h-10 text-amber-300 animate-spin mb-4" />
                <p className="text-sm font-sans text-stone-200">
                  AI 正在出題並設計混淆選項...
                </p>
                <p className="text-[10px] text-stone-400 mt-2 font-mono">
                  CREATING CUSTOM EDUCATION PAPER
                </p>
              </div>
            )}

            {/* Active Quiz Area */}
            {quizQuestions.length > 0 && !quizCompleted && (
              <div className="space-y-4 font-sans">
                
                {/* Header info */}
                <div className="flex justify-between items-center text-xs opacity-80 border-b border-white/10 pb-2">
                  <span>進度：{currentQuizIndex + 1} / {quizQuestions.length} 題</span>
                  <span>得分：{quizScore} / {quizQuestions.length}</span>
                </div>

                {/* Question presentation */}
                <div className="bg-white/5 p-4 rounded-sm border border-white/10 space-y-3">
                  <span className="text-[10px] font-sans font-extrabold text-amber-300 tracking-wider uppercase block">
                    Q{currentQuizIndex + 1}. {quizQuestions[currentQuizIndex].type === "symbol-match" ? "符號辨析" : quizQuestions[currentQuizIndex].type === "character-match" ? "漢字拼讀" : "拼音對應"}
                  </span>
                  
                  <p className="text-base font-serif text-white tracking-wide leading-relaxed">
                    {quizQuestions[currentQuizIndex].question}
                  </p>

                  {/* Audio trigger for questions */}
                  {quizQuestions[currentQuizIndex].audioText && (
                    <button
                      onClick={() => handleSpeak(quizQuestions[currentQuizIndex].audioText || "")}
                      className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/10 text-xs px-2.5 py-1.5 rounded cursor-pointer transition-all"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                      點我聽題目發音
                    </button>
                  )}
                </div>

                {/* Multiple choice grid */}
                <div className="grid grid-cols-1 gap-2.5">
                  {quizQuestions[currentQuizIndex].options.map((option, idx) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrectAnswer = option === quizQuestions[currentQuizIndex].answer;
                    
                    let btnStyle = "bg-white/10 border-white/20 hover:bg-white/20 text-white";
                    if (selectedAnswer !== null) {
                      if (isCorrectAnswer) {
                        btnStyle = "bg-emerald-600 border-emerald-500 text-white shadow-md";
                      } else if (isSelected) {
                        btnStyle = "bg-rose-700 border-rose-600 text-white shadow-sm";
                      } else {
                        btnStyle = "bg-white/5 border-white/10 text-stone-400 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectAnswer(option)}
                        disabled={selectedAnswer !== null}
                        className={`w-full text-left p-3 border rounded-sm text-sm font-sans flex justify-between items-center transition-all ${
                          selectedAnswer === null ? "cursor-pointer active:scale-95" : "cursor-default"
                        } ${btnStyle}`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="font-mono text-xs opacity-50 bg-black/20 w-5 h-5 flex items-center justify-center rounded-full">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          {option}
                        </span>

                        {selectedAnswer !== null && isCorrectAnswer && (
                          <CheckCircle className="w-4 h-4 text-emerald-200" />
                        )}
                        {selectedAnswer !== null && isSelected && !isCorrectAnswer && (
                          <XCircle className="w-4 h-4 text-rose-200" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Feedback Block */}
                {quizFeedback && (
                  <div className="bg-stone-800 p-4 rounded-sm border border-stone-700 space-y-2 text-xs">
                    <p className={`font-bold flex items-center gap-1.5 ${
                      selectedAnswer === quizQuestions[currentQuizIndex].answer ? "text-emerald-400" : "text-rose-400"
                    }`}>
                      {selectedAnswer === quizQuestions[currentQuizIndex].answer ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      {quizFeedback}
                    </p>
                    <p className="text-stone-300 leading-relaxed font-sans border-l border-stone-600 pl-2">
                      <strong className="text-stone-400 block mb-0.5">解析註解：</strong>
                      {quizQuestions[currentQuizIndex].explanation}
                    </p>
                  </div>
                )}

                {/* Action navigation button */}
                {selectedAnswer !== null && (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full bg-amber-400 hover:bg-amber-300 text-[#2D2926] font-sans font-bold py-2.5 text-xs uppercase tracking-widest transition-all rounded-sm flex items-center justify-center gap-1 cursor-pointer"
                  >
                    {currentQuizIndex < quizQuestions.length - 1 ? (
                      <>
                        下一題
                        <ChevronRight className="w-4 h-4" />
                      </>
                    ) : (
                      "完成測驗，查看成果"
                    )}
                  </button>
                )}

              </div>
            )}

            {/* Completed Certificate view */}
            {quizCompleted && (
              <div className="text-center space-y-6 py-4 font-sans">
                
                {/* Vintage certificate panel */}
                <div className="bg-[#F9F7F2] text-[#2D2926] p-6 border-4 border-double border-[#2D2926] space-y-4 shadow-lg rounded-sm relative overflow-hidden">
                  
                  {/* Decorative seal stamp */}
                  <div className="absolute -bottom-2 -right-2 w-24 h-24 border-4 border-dashed border-red-700/20 rounded-full flex items-center justify-center transform rotate-12 pointer-events-none">
                    <div className="text-center text-[10px] text-red-700/30 font-bold uppercase tracking-widest">
                      注音認證<br />APPROVED
                    </div>
                  </div>

                  <div className="flex justify-center mb-2 text-amber-600">
                    <Award className="w-12 h-12" />
                  </div>

                  <h3 className="text-xl font-bold tracking-wider text-stone-800">
                    注音符號學習證書
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed max-w-xs mx-auto">
                    恭喜您完成「{quizCategory === "mixed" ? "混合大會考" : quizCategory === "consonants" ? "聲母專場" : "介韻母專場"}」互動式測驗挑戰！
                  </p>

                  {/* Score block */}
                  <div className="border-t border-b border-stone-300 py-3 my-2">
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-stone-500">
                      測驗最終成績 (Final Score)
                    </span>
                    <span className="text-4xl font-serif font-extrabold text-[#2D2926]">
                      {quizScore} / {quizQuestions.length}
                    </span>
                    <p className="text-[10px] text-stone-500 mt-1">
                      答對率：{Math.round((quizScore / quizQuestions.length) * 100)}%
                    </p>
                  </div>

                  <p className="text-[10px] font-mono text-stone-500 uppercase tracking-widest">
                    Taiwan Bopomofo Educational Series
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleStartQuiz}
                    className="flex-1 bg-amber-400 hover:bg-amber-300 text-[#2D2926] font-sans font-bold py-2.5 text-xs uppercase tracking-widest transition-all rounded-sm cursor-pointer text-center"
                  >
                    重新挑戰
                  </button>
                  <button
                    onClick={() => {
                      setQuizQuestions([]);
                      setQuizCompleted(false);
                    }}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-sans font-bold py-2.5 text-xs uppercase tracking-widest transition-all rounded-sm cursor-pointer text-center border border-white/20"
                  >
                    結束回到大廳
                  </button>
                </div>

              </div>
            )}

          </div>

        </section>

      </main>

      {/* Editorial footer block */}
      <footer className="max-w-7xl w-full mx-auto px-6 py-8 border-t border-[#E5E1D8] mt-12 flex flex-col sm:flex-row justify-between items-center text-[10px] font-sans tracking-widest uppercase opacity-60 gap-4">
        <div className="text-center sm:text-left">
          Phonetic symbols of Traditional Chinese (Taiwan • Bopomofo System)
        </div>
        <div className="text-center sm:text-right">
          Interactive Study Series • Educational Edition
        </div>
      </footer>

    </div>
  );
}
