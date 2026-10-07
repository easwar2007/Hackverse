import type { MockQuestion } from '../types';

export const MOCK_QUESTIONS: MockQuestion[] = [
  // CS-302 Virtual Memory
  {
    id: 'q-cs-1',
    catalogueId: 'sub-cs-302',
    topicTitle: 'CS-302: Virtual Memory & Page Replacement',
    question: 'Which of the following page replacement algorithms is strictly immune to Belady’s Anomaly?',
    options: [
      'First-In First-Out (FIFO)',
      'Least Recently Used (LRU)',
      'Second Chance / Clock Algorithm',
      'Random Page Replacement'
    ],
    correctIndex: 1,
    points: 25,
    keyTakeaway: 'LRU and Optimal are stack algorithms (the set of pages for n frames is a subset of pages for n+1 frames), guaranteeing immunity to Belady\'s Anomaly.',
    explanation: {
      en: 'LRU is a stack algorithm where the set of pages in memory for N frames is strictly a subset of the pages that would be in memory for N+1 frames. Therefore, increasing frames will never increase page faults.',
      ta: 'LRU ஒரு Stack Algorithm என்பதால், RAM அளவை அதிகரிக்கும் போது Page Faults எண்ணிக்கை ஒருபோதும் அதிகரிக்காது. Belady’s Anomaly-யில் இருந்து இது முழுமையாக பாதுகாப்பானது.',
      hi: 'LRU एक स्टैक एल्गोरिदम है, इसलिए इसमें फ्रेम्स की संख्या बढ़ाने पर कभी भी पेज फॉल्ट्स नहीं बढ़ते।',
      tngl: 'LRU is a stack algorithm bro. Frames athigamaana epovume page fault korayume thavira athigam aagathu.'
    }
  },
  {
    id: 'q-cs-2',
    catalogueId: 'sub-cs-302',
    topicTitle: 'CS-302: Virtual Memory & Page Replacement',
    question: 'In a 2-level paging system with a TLB hit ratio of 90%, TLB access time of 20ns, and main memory access time of 100ns, what is the Effective Memory Access Time (EMAT)?',
    options: [
      '120 ns',
      '140 ns',
      '220 ns',
      '130 ns'
    ],
    correctIndex: 1,
    points: 25,
    keyTakeaway: 'EMAT = 0.90*(20+100) + 0.10*(20 + 2*100 + 100) = 0.90(120) + 0.10(320) = 108 + 32 = 140 ns.',
    explanation: {
      en: 'On TLB Hit (90%): 20ns + 100ns = 120ns. On TLB Miss (10%): 20ns + 100ns (outer table) + 100ns (inner table) + 100ns (data) = 320ns. EMAT = 0.9*120 + 0.1*320 = 108 + 32 = 140 ns.',
      ta: 'TLB Hit ஆகும் போது (90%): 120ns. Miss ஆகும் போது (10%): 320ns. கணக்கீடு: 0.9(120) + 0.1(320) = 140 ns.',
      hi: 'हिट होने पर समय 120ns और मिस होने पर 320ns होगा। कुल औसत EMAT = 140 ns निकल कर आता है।',
      tngl: 'Formula: 0.9 * (20+100) + 0.1 * (20 + 3*100) = 108 + 32 = 140 ns clean answer.'
    }
  },
  {
    id: 'q-cs-3',
    catalogueId: 'sub-cs-302',
    topicTitle: 'CS-302: Virtual Memory & Page Replacement',
    question: 'What is the primary indicator that an operating system is experiencing "Thrashing"?',
    options: [
      'CPU utilization is nearly 100% running computation',
      'CPU utilization drops drastically while Page Fault Frequency surges',
      'Hard disk activity drops to 0%',
      'The TLB cache is permanently disabled by hardware'
    ],
    correctIndex: 1,
    points: 25,
    keyTakeaway: 'Thrashing occurs when the sum of working set sizes exceeds physical memory, causing the CPU to spend all time servicing I/O page faults.',
    explanation: {
      en: 'Thrashing happens when memory is oversubscribed and processes constantly swap pages in/out of disk. As a result, page fault handling consumes all disk I/O and CPU utilization plummets.',
      ta: 'RAM போதாமல் அனைத்து processes-களும் இடைவிடாது Disk-ல் இருந்து Pages மாற்றி மாற்றி ஏற்றும் போது Thrashing ஏற்பட்டு CPU வேகம் கடுமையாக சரியும்.',
      hi: 'जब रैम कम पड़ जाती है और बार-बार पेज फॉल्ट होते हैं, तो सीपीयू का उपयोग गिर जाता है और डिस्क बिजी हो जाती है।',
      tngl: 'RAM pathaama disk-laye swap aagi aagi CPU utilization romba drop aagidum. Idhuku peru thaan Thrashing.'
    }
  },

  // AI-405 Transformers
  {
    id: 'q-ai-1',
    catalogueId: 'sub-ai-405',
    topicTitle: 'AI-405: Transformer & Self-Attention',
    question: 'Why does Scaled Dot-Product Attention divide by √d_k in Attention(Q,K,V)?',
    options: [
      'To normalize the output vectors to unit length 1.0',
      'To prevent the dot products from growing excessively large, which pushes softmax into regions with vanishing gradients',
      'To enforce causal masking for unidirectional autoregressive decoding',
      'To reduce matrix multiplication computational complexity from O(N²) to O(N)'
    ],
    correctIndex: 1,
    points: 25,
    keyTakeaway: 'Dividing by √d_k prevents large dot products from causing vanishing gradients in softmax.',
    explanation: {
      en: 'For large projection dimensions d_k, dot products grow large in magnitude, pulling softmax output into saturated regions with near-zero gradients. Scaling by 1/√d_k counteracts this variance scaling.',
      ta: 'பெரிய வெக்டார் பரிமாணங்களில் புள்ளி பெருக்கல் மதிப்பு அதிகமாகி Softmax Gradient பூஜ்ஜியமாக மாறுவதை தடுக்க √d_k ஆல் வகுக்கப்படுகிறது.',
      hi: 'Softmax के ग्रेडिएंट्स को खत्म होने से बचाने के लिए √d_k से भाग दिया जाता है।',
      tngl: 'Dimension d_k perusa aana dot product value perusaagi softmax gradient freeze aagidum. Athai thadukka thaan √d_k divide panrom!'
    }
  },
  {
    id: 'q-ai-2',
    catalogueId: 'sub-ai-405',
    topicTitle: 'AI-405: Transformer & Self-Attention',
    question: 'What is the specific purpose of Causal (Look-Ahead) Masking in GPT-style Decoder architectures?',
    options: [
      'To eliminate gradient descent requirements in multi-head projections',
      'To prevent position i from attending to tokens at subsequent positions (i+1, i+2...) during training',
      'To compress 16-bit floats to 8-bit integers',
      'To prevent split-brain partition across GPUs'
    ],
    correctIndex: 1,
    points: 25,
    keyTakeaway: 'Causal masking sets future attention weights to -infinity before softmax, ensuring autoregressive next-token prediction consistency.',
    explanation: {
      en: 'During autoregressive generation, a token at position i cannot peek at future tokens (i+1, i+2...). Masking future positions with -∞ ensures the decoder only attends to past context.',
      ta: 'Decoder அடுத்தடுத்த புதிய சொற்களை உருவாக்கும் போது, எதிர்கால சொற்களை முன்கூட்டியே பார்க்காமல் தடுக்க Causal Masking பயன்படுகிறது.',
      hi: 'यह मॉडल को भविष्य के शब्दों को पहले से देखने से रोकता है ताकि वह सही से वाक्य बना सके।',
      tngl: 'Model future tokens ah cheat panni paakaama iruka mask potu -infinity set pannuvom.'
    }
  },

  // MATH-210 Graph Theory
  {
    id: 'q-math-1',
    catalogueId: 'sub-math-210',
    topicTitle: 'MATH-210: Discrete Mathematics',
    question: 'A simple graph has 15 edges and every vertex has degree 3. How many vertices does this graph have?',
    options: [
      '5 vertices',
      '10 vertices',
      '15 vertices',
      '30 vertices'
    ],
    correctIndex: 1,
    points: 25,
    keyTakeaway: 'Handshaking Lemma: ∑ deg(v) = 2 * |E| → 3 * V = 2 * 15 = 30 → V = 10 vertices.',
    explanation: {
      en: 'Using the Handshaking Lemma: Sum of all vertex degrees = 2 * (Number of edges). Since every vertex has degree 3: 3 * V = 2 * 15 = 30. Therefore, V = 30 / 3 = 10.',
      ta: 'Handshaking Lemma சூத்திரம்: 3 * V = 2 * 15 = 30. எனவே மொத்த முனைகள் V = 10.',
      hi: 'हैंडशेकिंग लेम्मा के अनुसार: 3 * V = 2 * 15 = 30, इसलिए V = 10 नोड्स होंगे।',
      tngl: 'Formula: 3 * V = 2 * 15 = 30. So V = 10 vertices!'
    }
  }
];

export const MOCK_TESTS_DATABASE: Record<string, MockQuestion[]> = {
  'sub-cs-302': MOCK_QUESTIONS.filter(q => q.catalogueId === 'sub-cs-302'),
  'sub-ai-405': MOCK_QUESTIONS.filter(q => q.catalogueId === 'sub-ai-405'),
  'sub-math-210': MOCK_QUESTIONS.filter(q => q.catalogueId === 'sub-math-210')
};

export function getQuestionsForSubject(subjectId: string): MockQuestion[] {
  if (MOCK_TESTS_DATABASE[subjectId] && MOCK_TESTS_DATABASE[subjectId].length > 0) {
    return MOCK_TESTS_DATABASE[subjectId];
  }
  const filtered = MOCK_QUESTIONS.filter(q => q.catalogueId === subjectId);
  return filtered.length > 0 ? filtered : MOCK_QUESTIONS.slice(0, 3);
}
