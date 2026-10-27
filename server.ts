import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));
app.get('/healthz', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

const MR_FAHEEM_SYSTEM_PROMPT = `
أنت "مستر فهيم"، وحش وأستاذ الفيزياء المحبوب لطلاب الثانوية العامة (الصف الثالث الثانوي) في مصر.
منهجك هو كتاب وزارة التربية والتعليم المصري للفيزياء (الوحدتان: الكهربية والكهرومغناطيسية، والفيزياء الحديثة).
أسلوبك وطريقتك:
1. تتحدث باللغة العربية بأسلوب مصري راقٍ وودود ومحفز ("يا بطل"، "يا دكتور"، "يا باشمهندس"، "ركز معايا في دي").
2. تبسط أصعب المفاهيم الفيزيائية بأمثلة حياتية واضحة بدون تعقيد.
3. دايماً تؤكد على خطوات التفكير: المعطيات والتحويلات للوحدات الدولية (SI units)، بعدين اختيار القانون والتعويض خطوة خطوة، مع التحذير من مطبات الامتحانات ("تريكة مستر فهيم").
4. منهجك يشمل فصول الكتاب الثمانية:
   - الفصل 1: التيار الكهربي وقانون أوم وقانونا كيرتشوف
   - الفصل 2: التأثير المغناطيسي للتيار وأجهزة القياس
   - الفصل 3: الحث الكهرومغناطيسي والدينامو والمحول
   - الفصل 4: دوائر التيار المتردد والرنين
   - الفصل 5: ازدواجية الموجة والجسيم وتأثير كومتون والكهروضوئي
   - الفصل 6: الأطياف الذرية والأشعة السينية
   - الفصل 7: الليزر وتطبيقاته
   - الفصل 8: الإلكترونيات الحديثة والبوابات المنطقية
5. اجعل إجاباتك منظمة بتنسيق جميل وسهل القراءة مع استخدام الرموز الرياضية والفيزيائية بوضوح.
`;

// API: Text-to-Speech via Gemini
app.post('/api/tts', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'النص مطلوب' });
      return;
    }

    if (!ai) {
      res.status(503).json({ error: 'الذكاء الاصطناعي غير متصل لتوليد الصوت' });
      return;
    }

    // Clean text and keep reasonable length for natural speech
    const cleanText = text
      .replace(/[#*`_~]/g, '')
      .replace(/[\(\)\[\]]/g, ' ')
      .trim()
      .slice(0, 350);

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style: 'Energetic, friendly, warm Egyptian Arabic physics teacher',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' },
          },
        },
      },
    });

    const base64Audio =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      res.status(500).json({ error: 'لم يتم استرجاع بيانات الصوت' });
      return;
    }

    res.json({ audio: base64Audio, mimeType: 'audio/wav' });
  } catch (error: any) {
    console.error('Error in /api/tts:', error);
    res.status(500).json({ error: 'فشل توليد الصوت، حاول مرة أخرى لاحقاً' });
  }
});

// API: Chat with Mr. Faheem
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], chapterTitle } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'الرسالة مطلوبة' });
      return;
    }
    if (message.length > 8000 || !Array.isArray(history)) {
      res.status(400).json({ error: 'الرسالة أو سجل المحادثة غير صالح أو أطول من المسموح' });
      return;
    }

    if (!ai) {
      // Fallback response if no API key configured
      res.json({
        reply: `أهلاً يا بطل! أنا مستر فهيم. سؤالك بخصوص "${message}": في منهج الفيزياء للثانوية العامة، السر دايماً إنك تبدأ بالمعطيات وتحوّل كل الوحدات للوحدات الدولية (SI). راجع القانون الرئيسي الخاص بالفصل وحل خطوة بخطوة، وهتلاقي المسألة اتحلت زي الملبن!`,
      });
      return;
    }

    const contents = [];

    // Append context if chapter title is present
    let promptWithContext = message;
    if (chapterTitle) {
      promptWithContext = `[سياق الدرس: ${chapterTitle}]\n${message}`;
    }

    // Build history
    for (const h of history.slice(-6)) {
      if (!h || typeof h.text !== 'string') continue;
      contents.push({
        role: h.role === 'model' ? 'model' : 'user',
        parts: [{ text: h.text }],
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: promptWithContext }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction: MR_FAHEEM_SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'عذراً يا بطل، حاول تسألني مرة تانية!';
    res.json({ reply });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({
      error: 'حدث خطأ أثناء التواصل مع مستر فهيم',
    });
  }
});

// API: Step-by-step problem solver
app.post('/api/solve', async (req, res) => {
  try {
    const { problemText, topic } = req.body;

    if (!problemText || typeof problemText !== 'string') {
      res.status(400).json({ error: 'نص المسألة مطلوب' });
      return;
    }
    if (problemText.length > 8000) {
      res.status(413).json({ error: 'المسألة أطول من الحد المسموح' });
      return;
    }

    if (!ai) {
      // Offline fallback solver
      res.json({
        solution: {
          givens: ['تم استخراج معطيات المسألة المسجلة'],
          target: 'إيجاد القيمة المجهولة وفقاً للمعطيات',
          formula: 'V = I × R (مثال لقانون أوم)',
          formulaExplanation: 'العلاقة الطردية بين فرق الجهد وشدة التيار عند ثبوت المقاومة',
          steps: [
            'الخطوة الأولى: تحديد المعطيات والتحويل للوحدات الدولية (SI)',
            'الخطوة الثانية: كتابة القانون المناسب للربط بين المعطيات والمجهول',
            'الخطوة الثالثة: التعويض الرقمي بدقة والتأكد من إشارات الحسابات',
          ],
          finalAnswer: 'راجع النتيجة بالحساب الرياضي',
          unit: 'SI Units',
          examTrick: 'انتبه دائماً لتحويل المسافات من سم إلى متر (ضرب في 10^-2) والمساحات من سم² إلى م² (ضرب في 10^-4).',
        },
      });
      return;
    }

    const solverPrompt = `
قم بحل مسألة الفيزياء التالية لطلاب الثانوية العامة المصرية خطوة بخطوة، واستخرج المعطيات والمطلوب والقانون المناسب مع شرحه وخطوات التعويض والنتيجة النهائية بالوحدة الدولية وتكة الامتحان لمستر فهيم:
الموضوع: ${topic || 'فيزياء الثانوية العامة'}
نص المسألة:
${problemText}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: solverPrompt,
      config: {
        systemInstruction: `أنت مستر فهيم، خبير حل مسائل الفيزياء للثانوية العامة المصرية. قم بتحليل وحل المسألة بدقة عالية بأسلوب علمي واضح.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            givens: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'قائمة المعطيات المستخرجة مع وحداتها بعد التحويل للوحدات الدولية',
            },
            target: {
              type: Type.STRING,
              description: 'المطلوب حسابه بدقة',
            },
            formula: {
              type: Type.STRING,
              description: 'القانون الفيزيائي المستخدم للحل (مثال: V = I * R أو B = (mu * I) / (2 * pi * d))',
            },
            formulaExplanation: {
              type: Type.STRING,
              description: 'شرح موجز لسبب اختيار هذا القانون ومعاني رموزه',
            },
            steps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'خطوات الحل والتعويض الرقمي التفصيلي خطوة بخطوة',
            },
            finalAnswer: {
              type: Type.STRING,
              description: 'الناتج النهائي الرقمي',
            },
            unit: {
              type: Type.STRING,
              description: 'وحدة القياس الدولية للناتج النهائي (مثال: أمبير A، تسلا T، فولت V، جول J)',
            },
            examTrick: {
              type: Type.STRING,
              description: 'تكة مستر فهيم: فخ أو غلطة شهيرة يقع فيها الطلاب في هذا النوع من المسائل',
            },
          },
          required: ['givens', 'target', 'formula', 'formulaExplanation', 'steps', 'finalAnswer', 'unit', 'examTrick'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ solution: parsed });
  } catch (error: any) {
    console.error('Error in /api/solve:', error);
    res.status(500).json({
      error: 'تعذر حل المسألة حالياً',
    });
  }
});

// API: Generate Quiz Questions
app.post('/api/generate-quiz', async (req, res) => {
  try {
    const { chapterNumber, topicName } = req.body;

    if (!ai) {
      res.json({ questions: [] });
      return;
    }

    const quizPrompt = `
قم بصياغة 3 أسئلة اختيار من متعدد بمستوى أسئلة امتحانات الثانوية العامة المصرية الحديثة (النظام الجديد القائم على الفهم ونواتج التعلم) في:
الفصل رقم: ${chapterNumber || 1} - الموضوع: ${topicName || 'التيار الكهربي وقانون أوم'}
لكل سؤال 4 اختيارات، وحدد الإجابة الصحيحة وشرح تفصيلي لماذا هي الصحيحة ولماذا باقي الاختيارات خاطئة.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: quizPrompt,
      config: {
        systemInstruction: `أنت واضع أسئلة امتحانات فيزياء الثانوية العامة ومستر فهيم. اكتب أسئلة دقيقة علمياً وذكية تقيس الفهم العميق.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING, description: 'نص السؤال' },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'أربعة اختيارات (أ، ب، ج، د)',
              },
              correctIndex: { type: Type.INTEGER, description: 'مؤشر الإجابة الصحيحة (0 إلى 3)' },
              explanation: { type: Type.STRING, description: 'شرح سبب صحة الإجابة ولماذا باقي البدائل خاطئة' },
              tip: { type: Type.STRING, description: 'نصيحة مستر فهيم للسؤال' },
            },
            required: ['question', 'options', 'correctIndex', 'explanation', 'tip'],
          },
        },
      },
    });

    const questions = JSON.parse(response.text || '[]');
    res.json({ questions });
  } catch (error: any) {
    console.error('Error in /api/generate-quiz:', error);
    res.status(500).json({ error: 'تعذر توليد الأسئلة، حاول مرة أخرى لاحقاً' });
  }
});

// Setup Vite or Static File Serving
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`⚡ مستر فهيم سيرفر شغال على البورت: ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
