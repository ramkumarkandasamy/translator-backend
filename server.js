import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

app.post("/translate", async (req, res) => {
  const { text, sourceLang, targetLang } = req.body;

  if (!text || !targetLang) {
    return res.status(400).json({ error: "Missing text or target language" });
  }

  try {
    const langpair = `${sourceLang || "auto"}|${targetLang}`;
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`
    );

    const data = await response.json();
    const translation = data?.responseData?.translatedText;

    res.json({ translation, detected: data?.responseData?.detectedSourceLanguage });
  } catch (error) {
    res.status(500).json({ error: "Translation failed", details: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
