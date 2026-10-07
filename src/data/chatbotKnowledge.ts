import type { LanguageCode } from '../types';

export interface ChatQAPair {
  keywords: string[];
  replies: Record<LanguageCode, string>;
  followUps?: string[];
  topicTag: string;
}

export const multilingualSnippets = {
  en: {
    tag: "Annotation Mode: Standard English (Scholarly Text)",
    inputTag: "Faculty Notes • Academic English (Auto-detection enabled)",
    plainText: "In the Raft Protocol, the active leader continuously transmits periodic heartbeats to affirm authority. If followers fail to detect signals within a randomized election timeout of 150 to 300 milliseconds, they self-promote to Candidates. When simultaneous candidates split votes evenly, the randomized timer triggers a rapid reset: a fresh ballot sequence commences immediately without deadlock.",
    content: `In the <span class="font-sans font-semibold bg-[#fff3ed] text-secondary border border-[#ffd5c4] px-1.5 py-0.5 rounded text-[13px]">Raft Protocol</span>, the active leader continuously transmits periodic <span class="font-sans font-medium bg-[#eaf4f0] text-primary border border-[#cbe5d8] px-1.5 py-0.5 rounded text-[13px]">heartbeats</span> to affirm authority. If followers fail to detect signals within a randomized election timeout (<span class="font-sans font-semibold text-primary">150–300ms</span>), they self-promote to Candidates.<br><br>When two simultaneous candidates split votes evenly, the randomized timer triggers a rapid reset: a fresh ballot sequence commences immediately without deadlock!`
  },
  tngl: {
    tag: "Annotation Mode: Tanglish (Chennai Academic Dialect)",
    inputTag: "Faculty Notes • Conversational Tanglish active",
    plainText: "Simple ah sollanum na: Raft la leader regular ah heartbeat anupum. Follower ku heartbeat varalana Candidate ah maari vote kekkum. Rendu perukum ore maari Split vote aana, election timeout randomized ah reset aagi fresh ah next round start aagum! No deadlock!",
    content: `Simple ah sollanum na: <span class="font-sans font-semibold bg-[#fff3ed] text-secondary border border-[#ffd5c4] px-1.5 py-0.5 rounded text-[13px]">Raft</span> la leader regular ah <span class="font-sans font-medium bg-[#eaf4f0] text-primary border border-[#cbe5d8] px-1.5 py-0.5 rounded text-[13px]">heartbeat</span> anupum. Follower ku heartbeat varalana <span class="font-sans font-semibold text-primary">Candidate</span> ah maari vote kekkum.<br><br>Rendu perukum ore maari <span class="font-sans font-medium bg-[#fff3ed] text-secondary border border-[#ffd5c4] px-1.5 py-0.5 rounded text-[13px]">Split vote</span> aana, election timeout randomized ah reset aagi fresh ah next round start aagum! No deadlock!`
  },
  ta: {
    tag: "Annotation Mode: தமிழ் (பாடத்திட்டக் குறிப்பு விளக்கம்)",
    inputTag: "பாடக் குறிப்பு • தூய தமிழ் எழுத்துரு இயக்கம்",
    plainText: "ராஃப்ட் நெறிமுறையில் தலைவர் தொடர் துடிப்புச் சமிக்ஞையை அனுப்புவார். அதைத் தவறவிட்டால் பின்தொடர்பவர்கள் வேட்பாளராக மாறுவர். சமநிலை வாக்குகள் ஏற்படும் போது, சீரற்ற காலக்கெடு தானாகவே புதுப்பிக்கப்பட்டு புதிய தேர்தல் தொடங்கும்.",
    content: `<span class="font-sans font-semibold bg-[#fff3ed] text-secondary border border-[#ffd5c4] px-1.5 py-0.5 rounded text-[13px]">ராஃப்ட் (Raft)</span> நெறிமுறையில் தலைவர் (Leader) தொடர் துடிப்புச் சமிக்ஞையை (<span class="font-sans font-medium bg-[#eaf4f0] text-primary border border-[#cbe5d8] px-1.5 py-0.5 rounded text-[13px]">heartbeats</span>) அனுப்புவார். அதைத் தவறவிட்டால் பின்தொடர்பவர்கள் வேட்பாளராக மாறுவர்.<br><br>சமநிலை வாக்குகள் (<span class="font-sans font-semibold text-secondary">Split Vote</span>) ஏற்படும் போது, சீரற்ற காலக்கெடு (<span class="font-sans font-semibold text-primary">150–300ms</span>) தானாகவே புதுப்பிக்கப்பட்டு புதிய தேர்தல் தொடங்கும்.`
  },
  hi: {
    tag: "Annotation Mode: हिन्दी (शैक्षणिक व्याख्या एवं संदर्भ)",
    inputTag: "अध्ययन सामग्री • देवनागरी व्याख्या प्रणाली सक्रिय",
    plainText: "राफ्ट में नेता निरंतर हार्टबीट भेजता है। यदि फॉलोअर्स को समय पर संकेत नहीं मिलता, तो वे प्रत्याशी बन जाते हैं। यदि दो प्रत्याशियों के मत बराबर बंट जाते हैं, तो रैंडमाइज़्ड इलेक्शन टाइमआउट तुरंत रीसेट होकर नया चुनाव शुरू कर देता है!",
    content: `<span class="font-sans font-semibold bg-[#fff3ed] text-secondary border border-[#ffd5c4] px-1.5 py-0.5 rounded text-[13px]">राफ्ट (Raft)</span> में नेता निरंतर <span class="font-sans font-medium bg-[#eaf4f0] text-primary border border-[#cbe5d8] px-1.5 py-0.5 rounded text-[13px]">हार्टबीट (Heartbeat)</span> भेजता है। यदि फॉलोअर्स को समय पर संकेत नहीं मिलता, तो वे प्रत्याशी बन जाते हैं।<br><br>यदि दो प्रत्याशियों के मत बराबर बंट जाते हैं (<span class="font-sans font-semibold text-secondary">Split Vote</span>), तो रैंडमाइज़्ड इलेक्शन टाइमआउट तुरंत रीसेट होकर नया चुनाव शुरू कर देता है!`
  }
};

export const CHATBOT_KNOWLEDGE_BASE: ChatQAPair[] = [
  {
    keywords: ['virtual memory', 'paging', 'page fault', 'cs-302', 'ram', 'memory'],
    topicTag: 'CS-302: Virtual Memory',
    replies: {
      en: '🧠 **Virtual Memory Overview:**\nVirtual memory lets programs run even if they are bigger than physical RAM. The OS maps virtual addresses to physical frames using Page Tables. When you touch a page not yet in RAM, a **Page Fault** triggers and the OS fetches it from secondary storage using algorithms like LRU.',
      ta: '🧠 **Virtual Memory விளக்கம் (தமிழ்):**\nVirtual Memory என்பது உங்கள் RAM கொள்ளளவை விட பெரிய Program-களை இயக்க உதவும் OS நுட்பம். உங்கள் தகவல்கள் "Pages" ஆக பிரிக்கப்பட்டு, தேவைப்படும் போது மட்டும் RAM-ல் ஏற்றப்படும். RAM-ல் இல்லாத பக்கத்தை தேடும் போது **Page Fault** ஏற்பட்டு, Disk-ல் இருந்து கொண்டு வரப்படும்!',
      hi: '🧠 **वर्चुअल मेमोरी की व्याख्या (हिन्दी):**\nवर्चुअल मेमोरी की मदद से आप RAM की क्षमता से बड़े प्रोग्राम भी आसानी से चला सकते हैं। ऑपरेटिंग सिस्टम पेज टेबल की मदद से वर्चुअल एड्रेस को फिजिकल RAM में मैप करता है। जब कोई पेज RAM में नहीं होता, तो **Page Fault** होता है और OS उसे हार्ड डिस्क से लोड करता है।',
      tngl: '🧠 **Virtual Memory Simple Breakdown (Tanglish):**\nVirtual Memory na simple da: RAM space kammiya irunthalum periya games/apps crash aagatha mari, hard disk-la oru part-ah temporary RAM mathiri OS treat pannum. Program thevaiyana pages mattum ulla eduthu vandhu work aagum. Missing page ah thedum pothu varradhu thaan **Page Fault**!'
    },
    followUps: [
      'What is Belady\'s Anomaly?',
      'How does LRU differ from FIFO?',
      'Explain TLB hit ratio formula'
    ]
  },
  {
    keywords: ['belady', 'anomaly', 'fifo'],
    topicTag: 'CS-302: Algorithms',
    replies: {
      en: '⚠️ **Belady\'s Anomaly in FIFO:**\nNormally, giving a process more RAM frames should *reduce* page faults. But in FIFO (First-In First-Out), adding more frames can paradoxically *increase* page faults because FIFO ignores how recently pages were referenced! Note: LRU and Optimal are stack algorithms and NEVER suffer from Belady\'s anomaly.',
      ta: '⚠️ **Belady’s Anomaly (தமிழ்):**\nFIFO முறையில் RAM அளவை (Frames) அதிகப்படுத்தினாலும், ஆச்சரியப்படும் வகையில் Page Faults எண்ணிக்கை குறையாமல் அதிகரிக்கும் விசித்திரமான சிக்கலே Belady’s Anomaly. ஆனால் LRU முறையில் இந்த பிரச்சனை வரவே வராது!',
      hi: '⚠️ **बेलाडीज अनोमली (हिन्दी):**\nFIFO रिप्लेसमेंट में जब हम फ्रेम्स बढ़ाते हैं, तो पेज फॉल्ट कम होने के बजाय बढ़ जाते हैं! इसे Belady’s Anomaly कहते हैं। LRU और Optimal में यह दिक्कत कभी नहीं आती।',
      tngl: '⚠️ **Belady\'s Anomaly (Tanglish):**\nPeriya shock enna na: FIFO la RAM frames athigam aakina page faults korayum nu nenaipom, aana innum increase aagum! Idhuku peru thaan Belady\'s Anomaly. But LRU la idhu nadakathey.'
    },
    followUps: [
      'What is LRU algorithm?',
      'Show EMAT calculation formula'
    ]
  },
  {
    keywords: ['transformer', 'attention', 'ai-405', 'self-attention', 'qkv', 'query key value', 'llm'],
    topicTag: 'AI-405: Attention & Transformers',
    replies: {
      en: '⚡ **Self-Attention & Transformers:**\nTransformers calculate relationships between ALL words in a sentence simultaneously using $$\\text{Attention}(Q,K,V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$.\n• **Query (Q):** What I am searching for\n• **Key (K):** What tags exist on tokens\n• **Value (V):** The actual feature embedding content.\nScaling by $$\\sqrt{d_k}$$ prevents gradient collapse in large vector spaces.',
      ta: '⚡ **Transformers மற்றும் Self-Attention (தமிழ்):**\nTransformers ஒரே நேரத்தில் ஒரு வாக்கியத்தின் அனைத்து சொற்களையும் ஆய்வு செய்கிறது. Q (கேள்வி), K (அடையாளம்), V (உள்ளடக்கம்) ஆகிய மூன்று அணிகளைப் பெருக்கி, எந்த சொல் எந்த சொல்லுடன் தொடர்புடையது என்ற Attention Score கணக்கிடப்படுகிறது.',
      hi: '⚡ **ट्रांसफॉर्मर और सेल्फ-अटेंशन (हिन्दी):**\nट्रांसफॉर्मर वाक्य के सभी शब्दों को एक साथ प्रोसेस करता है। Query, Key, और Value (Q, K, V) मैट्रिसेस का इस्तेमाल करके यह पता लगाता है कि वाक्य में कौन सा शब्द किसके लिए सबसे ज्यादा जरूरी है।',
      tngl: '⚡ **Transformer & QKV Magic (Tanglish):**\nOld RNN mari slow-ah pogama, Transformer orey shot-la full sentence ah parallel-ah read pannum bro! Q = Query (enna thedrom), K = Key (tag enna), V = Value (actual content). Renduthukum dot product panni softmax potta context clear-ah therinjidum!'
    },
    followUps: [
      'Why do we need Positional Encodings?',
      'Difference between Encoder and Decoder?'
    ]
  },
  {
    keywords: ['graph', 'dijkstra', 'math-210', 'shortest path', 'handshaking', 'euler'],
    topicTag: 'MATH-210: Graph Theory',
    replies: {
      en: '📍 **Dijkstra & Graph Theory Highlights:**\n• **Handshaking Lemma:** $\\sum \\text{deg}(v) = 2|E|$. Total vertex degrees is always even.\n• **Dijkstra Algorithm:** Finds shortest single-source path on non-negative weighted graphs in $O((V+E)\\log V)$ using a Min-Priority Queue.\n• If edge weights are negative, use **Bellman-Ford** ($O(V \\cdot E)$).',
      ta: '📍 **Graph Theory மற்றும் Dijkstra (தமிழ்):**\n• Handshaking Lemma: அனைத்து முனைகளின் டிகிரி கூடுதல் எப்போதும் இரட்டைப்படை எண்ணாகவே இருக்கும் ($2|E|$).\n• Dijkstra அல்காரிதம் நேர்மறை எடையுள்ள கோடுகளில் மிகக் குறைந்த தூர வழியை மிக வேகமாக Min-Heap மூலம் கண்டறியும்.',
      hi: '📍 **ग्राफ थ्योरी और डिजक्स्ट्रा (हिन्दी):**\n• Handshaking Lemma: सभी नोड्स की डिग्री का जोड़ हमेशा 2 * Edges होता है।\n• Dijkstra सबसे कम दूरी खोजने के लिए Min-Heap का इस्तेमाल करता है। अगर नेगेटिव वजन है तो Bellman-Ford इस्तेमाल करें।',
      tngl: '📍 **Graph & Shortest Path (Tanglish):**\n• Handshaking rule: Total degree eppavume $2 \\times \\text{edges}$, so always even number!\n• Dijkstra algorithm Google maps mari non-negative path la fastest route kandupidikum with Min-Heap queue.'
    },
    followUps: [
      'What is Prim vs Kruskal for MST?',
      'Explain Planar Graph Euler formula'
    ]
  },
  {
    keywords: ['focus', 'tips', 'timer', 'pomodoro', 'study plan', 'credit', 'exam strategy'],
    topicTag: 'Study Tips & System Guide',
    replies: {
      en: '🎯 **Exam Optimization Strategy:**\n1. Use **Focus Lock (25m Pomodoro)** to prevent tab switching and doomscrolling.\n2. If an important call comes in, our **Smart Call Guardian** automatically extends your timer by the exact call duration so your study quota is preserved!\n3. Finish with an **Auto Mock Test** to earn 100+ Credit Points and cement memory retention.',
      ta: '🎯 **தேர்வு வெற்றி உத்திகள் (தமிழ்):**\n1. கவனச்சிதறலை தவிர்க்க **Focus Lock** முறையை 25 நிமிடங்கள் பயன்படுத்துங்கள்.\n2. அவசர அழைப்பு வந்தால், **Smart Call Guardian** அந்த நேரத்தை தானாகவே Study Timer-ல் கூட்டி சரிசெய்யும்!\n3. படித்து முடித்ததும் **Mock Test** எழுதி Credit Points பெற்று பரிசுகளை வெல்லுங்கள்.',
      hi: '🎯 **स्मार्ट स्टडी टिप्स (हिन्दी):**\n1. बिना किसी रुकावट के पढ़ने के लिए 25 मिनट का **Focus Lock** ऑन करें।\n2. फोन आने पर हमारा **Smart Call Guardian** फोन का समय टाइमर में जोड़ देगा!\n3. अंत में **Mock Test** देकर तुरंत पॉइंट्स जीतें और रिवॉर्ड्स अनलॉक करें।',
      tngl: '🎯 **Pro Study Hacks (Tanglish):**\n1. 25-min **Focus Lock** potu study pannu, distraction zero aagidum.\n2. In-between call vandhalum no tension, **Smart Call Guardian** call time ah timer-oda add back pannidum!\n3. Session mudinjathum **Auto Mock Test** attend panni points collect pannu bro!'
    },
    followUps: [
      'How to earn Credit Points quickly?',
      'Explain Smart Call Handling feature'
    ]
  }
];

export function getSmartReply(userQuery: string, language: LanguageCode, activeTopic?: string): {
  reply: string;
  followUps: string[];
  topic: string;
} {
  const queryLower = userQuery.toLowerCase().trim();

  for (const item of CHATBOT_KNOWLEDGE_BASE) {
    if (item.keywords.some(k => queryLower.includes(k.toLowerCase()))) {
      return {
        reply: item.replies[language] || item.replies.en,
        followUps: item.followUps || [],
        topic: item.topicTag
      };
    }
  }

  if (activeTopic && activeTopic.includes('CS-302')) {
    return {
      reply: CHATBOT_KNOWLEDGE_BASE[0].replies[language],
      followUps: CHATBOT_KNOWLEDGE_BASE[0].followUps || [],
      topic: 'CS-302: Virtual Memory'
    };
  }

  const fallbacks: Record<LanguageCode, string> = {
    en: `💡 **AI Academic Tutor:**\nI analyzed your query: "${userQuery}". Here is a concise academic breakdown: Focus on core invariants, verify the boundary conditions, and test memory/time complexity. You can ask me to explain any topic in Tamil, Hindi, Tanglish or English, or ask for mnemonic exam formulas!`,
    ta: `💡 **AI ஆசிரியர் பதில்:**\nஉங்கள் கேள்வி: "${userQuery}". இந்த தலைப்பின் முக்கிய சூத்திரங்கள் மற்றும் அடிப்படைக் கருத்துக்களை நினைவில் கொள்ளுங்கள். எந்த தலைப்பையும் தமிழ், ஹிந்தி, Tanglish அல்லது ஆங்கிலத்தில் விளக்க நான் தயாராக உள்ளேன்!`,
    hi: `💡 **AI शिक्षक सहायता:**\nआपका सवाल: "${userQuery}". इस विषय के मुख्य फॉर्मूलों और बेसिक कॉन्सेप्ट्स को समझकर याद रखें। आप मुझसे किसी भी विषय को हिन्दी, तमिल, Tanglish या अंग्रेजी में समझ सकते हैं!`,
    tngl: `💡 **AI Bro Tutor:**\nUnoda question "${userQuery}" paathen! Idhula main exam keypoints and formulas focus pannunga. Enkitta Tamil, Hindi, Tanglish la edhu venalum direct-ah ketkalam!`
  };

  return {
    reply: fallbacks[language] || fallbacks.en,
    followUps: [
      'Explain in simple analogy',
      'Give me a 2-minute mock question',
      'Show high-yield exam formulas'
    ],
    topic: 'Smart AI Study Assistant'
  };
}
