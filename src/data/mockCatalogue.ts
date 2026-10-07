import type { CatalogueItem } from '../types';

export const INITIAL_CATALOGUE: CatalogueItem[] = [
  {
    id: 'sub-cs-302',
    code: 'CS-302',
    title: 'Virtual Memory & Page Replacement Strategies',
    domain: 'Computer Science',
    languages: ['en', 'ta', 'hi', 'tngl'],
    difficulty: 'Intermediate',
    chaptersCount: 4,
    estimatedMinutes: 45,
    aiSimplifiedVersion: 'v2.4 (Condensed)',
    isAiSimplified: true,
    examProbability: 'High',
    lastStudiedDate: '2 hours ago',
    progressPercent: 75,
    tags: ['OS Internals', 'Paging', 'TLB', 'LRU Algorithm', 'Thrashing'],
    summary: {
      en: 'Virtual memory creates the illusion of infinite RAM by using disk space as an overflow buffer. The operating system breaks memory into fixed-size "pages" and swaps them in/out using algorithms like LRU and FIFO when physical memory fills up.',
      ta: 'Virtual Memory என்பது உங்கள் கம்ப்யூட்டரில் RAM பற்றாக்குறை ஏற்படும் போது, Hard Disk இடத்தைப் பயன்படுத்தி RAM அளவை பெரிதாக காட்டும் ஒரு OS யுக்தி. தகவல்களை "Pages" ஆக பிரித்து தேவைக்கேற்ப RAM-க்கு கொண்டு வரும்.',
      hi: 'Virtual Memory एक ऐसी तकनीक है जो RAM कम पड़ने पर Hard Disk के कुछ हिस्से को अस्थायी RAM की तरह इस्तेमाल करती है। यह डेटा को छोटे "Pages" में बांटकर मेमोरी मैनेज करता है।',
      tngl: 'Virtual memory simple concept bro: RAM space full aana, Hard disk-la irukura extra space ah OS temporary RAM-ah use pannum. Important pages mattum load panni memory crash aagama pathukum!'
    },
    jargonBreakdown: [
      {
        term: 'Page Fault',
        formalDefinition: 'An interrupt raised by hardware when a running program accesses a memory page that is mapped in the virtual address space, but not currently loaded in physical memory (RAM).',
        simplifiedAnalogy: 'Like reaching for a book on your desk (RAM) only to find it is still in the basement library (Hard Disk) — you have to pause your study and go fetch it.'
      },
      {
        term: 'Translation Lookaside Buffer (TLB)',
        formalDefinition: 'A high-speed hardware cache used by the memory management unit to store recent translations of virtual memory to physical memory addresses.',
        simplifiedAnalogy: 'Like keeping your 5 most dialed phone numbers on speed-dial instead of looking up the entire 1,000-page directory every time.'
      },
      {
        term: 'Thrashing',
        formalDefinition: 'A state where the CPU spends significantly more time swapping pages into and out of memory than executing actual process instructions.',
        simplifiedAnalogy: 'Like spending 50 minutes looking for different books in your bag and only 10 minutes actually reading, bringing productivity to zero.'
      },
      {
        term: 'Belady’s Anomaly',
        formalDefinition: 'The phenomenon in FIFO page replacement where increasing the number of page frames results in an increase in the number of page faults.',
        simplifiedAnalogy: 'Like buying a bigger backpack, but somehow dropping your supplies more often because you put things in random order.'
      }
    ],
    chapters: [
      {
        id: 'ch-1',
        number: 1,
        title: 'Architectural Foundations of Paging & Segmentation',
        durationMinutes: 10,
        completed: true,
        keyPoints: [
          'Logical Address Space vs Physical Address Space separation',
          'Page size tradeoff: 4KB standard (internal fragmentation vs page table overhead)',
          'Page Table Base Register (PTBR) and memory mapping mechanics'
        ],
        simplifiedExplanation: {
          en: 'Paging slices programs into equal chunks (pages) and physical RAM into matching slots (frames). Programs do not need to be contiguous in RAM anymore.',
          ta: 'Paging என்பது ஒரு program-ஐ சம அளவிலான துண்டுகளாக (Pages) பிரித்து, RAM-ல் கிடைக்கும் இடங்களில் வைக்க உதவும் முறை.',
          hi: 'Paging प्रोग्राम को बराबर साइज के हिस्सों (Pages) में बांटती है ताकि मेमोरी कहीं भी बिखरी हो तो भी काम चल सके।',
          tngl: 'Program continuous-ah RAM-la iruka theva illa; kutty kutty pieces (pages) ah split panni wherever space is there insert pannidum.'
        },
        examTip: 'Always calculate Effective Memory Access Time (EMAT) = Hit_Ratio * (TLB_access + RAM_access) + (1 - Hit_Ratio) * (TLB_access + 2 * RAM_access).'
      },
      {
        id: 'ch-2',
        number: 2,
        title: 'Page Replacement Algorithms: FIFO, Optimal & LRU',
        durationMinutes: 15,
        completed: true,
        keyPoints: [
          'First-In First-Out (FIFO) and vulnerability to Belady’s Anomaly',
          'Optimal Algorithm (OPT/MIN) as the theoretical baseline',
          'Least Recently Used (LRU) implementation via Counter and Stack methods'
        ],
        simplifiedExplanation: {
          en: 'When RAM is full, the OS must choose which page to evict. LRU throws out whatever hasn’t been used in the longest time, which is usually the smartest choice.',
          ta: 'RAM நிறைந்தவுடன் எந்த பழைய Page-ஐ வெளியேற்றுவது என்பதை LRU முடிவு செய்யும். அதிக நேரம் பயன்படுத்தப்படாத பக்கத்தை வெளியேற்றும்.',
          hi: 'जब RAM भर जाती है तो LRU उस पेज को हटाता है जो सबसे लंबे समय से इस्तेमाल नहीं हुआ है।',
          tngl: 'RAM full aana, romba nerama use aagatha page ah thooki potutu pudhu page ah ulla vaikardhu thaan LRU concept.'
        },
        examTip: 'LRU and Optimal never suffer from Belady’s anomaly because they are stack algorithms.'
      },
      {
        id: 'ch-3',
        number: 3,
        title: 'Thrashing & Working Set Model',
        durationMinutes: 10,
        completed: true,
        keyPoints: [
          'Locality of Reference (Temporal vs Spatial Locality)',
          'Working Set Window (Δ) calculation to allocate sufficient frames',
          'Page Fault Frequency (PFF) dynamic thresholding'
        ],
        simplifiedExplanation: {
          en: 'If a process does not have enough frames for its active loop, page faults spike and the CPU halts to swap constantly.',
          ta: 'ஒரு Process இயங்குவதற்கு தேவையான குறைந்தபட்ச RAM கிடைக்காத போது, System முடங்கி போகும் நிலைக்கு Thrashing என்று பெயர்.',
          hi: 'अगर प्रोसेस को जरूरी फ्रेम नहीं मिलते तो सिस्टम सिर्फ पेज स्वैप करने में उलझ कर स्लो हो जाता है।',
          tngl: 'Orey nerathula neraya apps run panna, CPU swap panniye saavum, app crash/hang aagum — idhu thaan Thrashing.'
        },
        examTip: 'If sum of Working Set Sizes (∑WSSi) > Total RAM Frames (D), Thrashing is guaranteed.'
      },
      {
        id: 'ch-4',
        number: 4,
        title: 'Advanced Hardware: Multi-Level Paging & Inverted Tables',
        durationMinutes: 10,
        completed: false,
        keyPoints: [
          'Two-Level and Hierarchical Paging for 64-bit architectures',
          'Inverted Page Tables using hash anchors to bound memory overhead',
          'Page Table Entry (PTE) protection bits: Valid/Invalid, Dirty/Modified, Reference'
        ],
        simplifiedExplanation: {
          en: 'In 64-bit systems, page tables would be gigabytes in size. Multi-level paging allows pages to be allocated on-demand in a tree structure.',
          ta: 'நவீன 64-bit கம்ப்யூட்டர்களில் Page Table அளவை குறைக்க Multi-level Paging முறை பயன்படுத்தப்படுகிறது.',
          hi: 'बड़े 64-bit सिस्टम में मेमोरी बचाने के लिए मल्टी-लेवल पेजिंग पेड़ (Tree) की तरह काम करती है।',
          tngl: '64-bit OS-la Page table perusa irukum, athanala multi-tier indexing use panni RAM waste aagatha mari handle pannuvanga.'
        },
        examTip: 'Dirty bit (Modify bit) prevents unnecessary write-backs to disk when a page is pristine.'
      }
    ],
    highYieldFormulas: [
      {
        title: 'Effective Memory Access Time (EMAT)',
        formula: 'EMAT = h · (c + m) + (1 - h) · (c + 2m)',
        meaning: 'h = TLB Hit Ratio, c = TLB Lookup time, m = Main Memory access time'
      },
      {
        title: 'Effective Access Time with Page Faults',
        formula: 'EAT = (1 - p) · m + p · S',
        meaning: 'p = Page Fault Rate, m = RAM Access Time (≈100ns), S = Page Fault Service Time (≈10ms)'
      }
    ]
  },
  {
    id: 'sub-ai-405',
    code: 'AI-405',
    title: 'Neural Attention Mechanisms & Transformer Architecture',
    domain: 'Data Science & AI',
    languages: ['en', 'ta', 'hi', 'tngl'],
    difficulty: 'Advanced',
    chaptersCount: 5,
    estimatedMinutes: 55,
    aiSimplifiedVersion: 'v3.1 (State of Art)',
    isAiSimplified: true,
    examProbability: 'Essential',
    lastStudiedDate: 'Yesterday',
    progressPercent: 60,
    tags: ['Deep Learning', 'Self-Attention', 'Multi-Head Attention', 'Positional Encoding', 'LLMs'],
    summary: {
      en: 'Transformers revolutionized AI by replacing recurrent neural networks (RNNs) with the Self-Attention mechanism. Every word directly attends to every other word in parallel, using Query, Key, and Value matrix transformations with Scaled Dot-Product calculation.',
      ta: 'Transformers என்பது நவீன AI-யின் இதயம். முந்தைய RNN போல வார்த்தைகளை ஒவ்வொன்றாக படிக்காமல், அனைத்து வார்த்தைகளையும் ஒரே நேரத்தில் (Parallel) படித்து, முக்கியமான வார்த்தைகளுக்கு அதிக கவனம் (Attention) செலுத்தும்.',
      hi: 'ट्रांसफॉर्मर आर्किटेक्चर ने AI को बदल दिया। यह सेल्फ-अटेंशन के जरिए सभी शब्दों के बीच आपसी संबंध को एक साथ प्रोसेस करता है।',
      tngl: 'Old RNN mari sequential-ah pogama, sentence-la irukura ellam words-kum orey time-la dynamic attention score calculate panni process panra modern AI architecture thaan Transformer!'
    },
    jargonBreakdown: [
      {
        term: 'Scaled Dot-Product Attention',
        formalDefinition: 'Attention(Q, K, V) = softmax((Q · K^T) / √d_k) · V. Computes compatibility scores between Query and Key vectors scaled by the square root of key dimension.',
        simplifiedAnalogy: 'Like searching a YouTube video: Query is what you typed in the search bar, Key is the title/tags of every video, and Value is the actual video content you stream.'
      },
      {
        term: 'Multi-Head Attention',
        formalDefinition: 'Projecting queries, keys, and values h times with different learned linear projections to allow the model to jointly attend to information from different representation subspaces.',
        simplifiedAnalogy: 'Like analyzing a crime scene with 8 different detective lenses at once: one looks at fingerprints, one at motives, one at timelines, and one at physical clues.'
      },
      {
        term: 'Positional Encoding',
        formalDefinition: 'Adding sinusoidal frequency vectors to input embeddings to inject sequential order information since self-attention contains no inherent recurrence or convolution.',
        simplifiedAnalogy: 'Like numbering the pages of an essay before tossing them into a hat, so you always know their exact original order.'
      }
    ],
    chapters: [
      {
        id: 'ai-ch-1',
        number: 1,
        title: 'The Bottleneck of RNNs & LSTMs',
        durationMinutes: 10,
        completed: true,
        keyPoints: [
          'Vanishing and exploding gradients across long text sequences',
          'Sequential O(N) dependency prevents modern GPU parallelization',
          'Fixed-length hidden state bottleneck in Seq2Seq models'
        ],
        simplifiedExplanation: {
          en: 'Old AI read sentences word-by-word like a human with short-term memory, forgetting the beginning of long paragraphs.',
          ta: 'பழைய மாடல்கள் நீண்ட வாக்கியங்களை படிக்கும் போது தொடக்கத்தை மறந்துவிடும் சிக்கலை சந்தித்தன.',
          hi: 'पुराने मॉडल्स लंबे वाक्यों में शुरुआत की बातें भूल जाते थे और बहुत धीमे थे।',
          tngl: 'Old models word-by-word read pannum, so GPU parallel compute panna mudiyathu and long text maranthudum.'
        },
        examTip: 'Why RNN cannot parallelize: Hidden state h_t depends strictly on h_{t-1}.'
      },
      {
        id: 'ai-ch-2',
        number: 2,
        title: 'Query, Key, Value (Q, K, V) Vector Mechanics',
        durationMinutes: 15,
        completed: true,
        keyPoints: [
          'Linear projections: Q = X·W_Q, K = X·W_K, V = X·W_V',
          'Dot product similarity and scaling factor (√d_k) to prevent softmax saturation',
          'Softmax normalization to output attention weights summing to 1'
        ],
        simplifiedExplanation: {
          en: 'Each token creates a question (Q), a tag (K), and content (V). Multiplying Q and K tells the model which words relate to each other.',
          ta: 'ஒவ்வொரு சொல்லும் ஒரு கேள்வி (Q), அடையாளம் (K), மற்றும் உட்பொருள் (V) ஆக மாற்றப்பட்டு ஒப்பீடு செய்யப்படுகிறது.',
          hi: 'हर शब्द अपने सवाल, टैग और कंटेंट के आधार पर दूसरे शब्दों से संबंध बनाता है।',
          tngl: 'Q-oda question ku K-oda tag match aana, V-oda content score boost aagi context purinjukum.'
        },
        examTip: 'If dot-product is not scaled by 1/√d_k, values become huge and softmax gradients vanish to zero.'
      },
      {
        id: 'ai-ch-3',
        number: 3,
        title: 'Positional Encodings & Sinusoidal Functions',
        durationMinutes: 10,
        completed: true,
        keyPoints: [
          'PE(pos, 2i) = sin(pos / 10000^(2i/d_model))',
          'PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))',
          'Relative positional offset property through linear transformations'
        ],
        simplifiedExplanation: {
          en: 'Because attention calculates all words simultaneously, sinusoidal wave patterns are added to give words their position 1, 2, 3...',
          ta: 'வார்த்தைகளின் வரிசை மாறாமல் இருக்க சைன்/கோசைன் கணித அலைகள் சேர்க்கப்படுகின்றன.',
          hi: 'शब्दों की सही जगह बताने के लिए साइन और कोसाइन वेव्स का इस्तेमाल किया जाता है।',
          tngl: 'Words ellam orey time-la render aagurathaala, order therinjuka sine/cosine math codes add panranga.'
        },
        examTip: 'Sine/Cosine formulation enables extrapolation to sequence lengths longer than seen during training.'
      },
      {
        id: 'ai-ch-4',
        number: 4,
        title: 'Encoder vs Decoder Stack Architecture',
        durationMinutes: 10,
        completed: false,
        keyPoints: [
          'Encoder: Self-Attention + Feed-Forward Network with Residual Connections and LayerNorm',
          'Decoder: Masked Multi-Head Attention (causal masking) + Cross-Attention',
          'Autoregressive generation and next-token prediction'
        ],
        simplifiedExplanation: {
          en: 'Encoder understands full text. Decoder generates output one word at a time, looking back at the encoder and previously generated words.',
          ta: 'Encoder உள்ளீட்டை முழுமையாக புரிந்துகொள்கிறது; Decoder புதிய சொற்களை உருவாக்குகிறது.',
          hi: 'Encoder वाक्य को समझता है और Decoder एक-एक करके नए शब्द लिखता है।',
          tngl: 'Encoder input full context ah capture pannum, Decoder next best word ah predict panni generate pannum.'
        },
        examTip: 'Masked attention sets future token logits to -∞ before softmax so the model cannot cheat by peeking ahead.'
      },
      {
        id: 'ai-ch-5',
        number: 5,
        title: 'FlashAttention & Scaling Laws',
        durationMinutes: 10,
        completed: false,
        keyPoints: [
          'IO-Aware exact attention on GPU SRAM vs HBM memory hierarchy',
          'O(N^2) complexity reduction in memory reads',
          'Kaplan & Chinchilla scaling laws for compute, parameters, and tokens'
        ],
        simplifiedExplanation: {
          en: 'FlashAttention reorganizes memory computations into SRAM tiles, speeding up LLM training by 3-5x without losing any accuracy.',
          ta: 'FlashAttention என்பது GPU நினைவகத்தை மிகத் திறமையாக பயன்படுத்தி AI மாடல்களை அதிவேகமாக இயக்க உதவும் முறை.',
          hi: 'फ्लैशअटेंशन जीपीयू मेमोरी को ऑप्टिमाइज़ करके ट्रेनिंग को 3 से 5 गुना तेज बना देता है।',
          tngl: 'GPU SRAM tile chunks la calculate panni speed boost tharum without math loss.'
        }
      }
    ],
    highYieldFormulas: [
      {
        title: 'Self-Attention Formulation',
        formula: 'Attention(Q, K, V) = \\text{softmax}\\left(\\frac{Q K^T}{\\sqrt{d_k}}\\right) V',
        meaning: 'Q = Queries, K = Keys, V = Values, d_k = Dimension of key vectors'
      },
      {
        title: 'Multi-Head Projection',
        formula: '\\text{MultiHead}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h) W^O',
        meaning: '\\text{head}_i = \\text{Attention}(Q W_i^Q, K W_i^K, V W_i^V)'
      }
    ]
  },
  {
    id: 'sub-math-210',
    code: 'MATH-210',
    title: 'Discrete Mathematics: Graph Theory & Shortest Path Trees',
    domain: 'Mathematics',
    languages: ['en', 'ta', 'hi', 'tngl'],
    difficulty: 'Foundation',
    chaptersCount: 3,
    estimatedMinutes: 35,
    aiSimplifiedVersion: 'v1.9',
    isAiSimplified: true,
    examProbability: 'High',
    lastStudiedDate: '3 days ago',
    progressPercent: 90,
    tags: ['Graphs', 'Dijkstra', 'Euler Path', 'Adjacency Matrix', 'Spanning Trees'],
    summary: {
      en: 'Graph theory studies mathematical structures modeling pairwise relations between objects (nodes and edges). Core applications include network routing, compiler optimization, social graph clustering, and shortest path calculations.',
      ta: 'Graph Theory என்பது புள்ளிகள் (Nodes) மற்றும் இணைப்புக் கோடுகள் (Edges) மூலம் சிக்கலான வலையமைப்புகளை (Networks) எளிதாக விளக்கும் கணிதப் பிரிவு.',
      hi: 'ग्राफ थ्योरी नोड्स और किनारों के बीच के रिश्तों का गणितीय अध्ययन है, जो रूटिंग और नेटवर्क्स में काम आता है।',
      tngl: 'Points (nodes) and lines (edges) vachu real world networks like Google Maps routing, social media connections ah model panra core discrete math.'
    },
    jargonBreakdown: [
      {
        term: 'Eulerian Path vs Hamiltonian Path',
        formalDefinition: 'Eulerian path visits every edge exactly once; Hamiltonian path visits every vertex exactly once (NP-complete).',
        simplifiedAnalogy: 'Euler: Snowplow truck that must clear every street once. Hamiltonian: Politician visiting every city once on a campaign tour.'
      },
      {
        term: 'Planar Graph & Kuratowski’s Theorem',
        formalDefinition: 'A graph that can be embedded in the plane without crossing edges. It is planar iff it contains no subgraph homeomorphic to K_5 or K_{3,3}.',
        simplifiedAnalogy: 'Drawing a subway map where no train tracks cross over each other on flat ground.'
      }
    ],
    chapters: [
      {
        id: 'math-ch-1',
        number: 1,
        title: 'Graph Fundamentals & Degree Handshaking Lemma',
        durationMinutes: 10,
        completed: true,
        keyPoints: [
          'Sum of degrees = 2 * (Number of Edges) -> Handshaking Lemma',
          'Number of odd-degree vertices is always even',
          'Bipartite graph verification using 2-coloring theorem'
        ],
        simplifiedExplanation: {
          en: 'Every edge connects two vertices, so whenever you add an edge, total vertex degree count increases by exactly 2.',
          ta: 'ஒவ்வொரு கோடும் இரண்டு முனைகளை இணைப்பதால், மொத்த Degrees எண்ணிக்கை எப்பொழுதும் இரட்டைப்படையாகவே (Even) இருக்கும்.',
          hi: 'हर किनारा दो बिंदुओं को जोड़ता है, इसलिए कुल डिग्री हमेशा सम (Even) संख्या होती है।',
          tngl: 'Oru edge vantha rendupakkam count erum, athanala total degrees eppavume even number ah thaan irukum.'
        },
        examTip: 'Formula: ∑ deg(v) = 2|E|. Always checks out in quick sanity tests.'
      },
      {
        id: 'math-ch-2',
        number: 2,
        title: 'Shortest Paths: Dijkstra & Bellman-Ford',
        durationMinutes: 15,
        completed: true,
        keyPoints: [
          'Dijkstra’s greedy approach with Min-Heap in O((V + E) log V)',
          'Failure of Dijkstra on negative edge cycles',
          'Bellman-Ford dynamic programming relaxation in O(V · E)'
        ],
        simplifiedExplanation: {
          en: 'Dijkstra finds the fastest road route by always picking the closest unvisited checkpoint first.',
          ta: 'Dijkstra அல்காரிதம் மிகக் குறைந்த தூர வழியை படிப்படியாக தேர்ந்தெடுத்து கண்டுபிடிக்கும்.',
          hi: 'डिजक्स्ट्रा सबसे छोटे रास्ते को खोजने के लिए लालची (Greedy) तरीका अपनाता है।',
          tngl: 'Google Maps mari closest node ah pick panni shortest overall travel time calculate pannum.'
        },
        examTip: 'If a problem mentions negative weights or detecting negative cycles, the answer is always Bellman-Ford.'
      },
      {
        id: 'math-ch-3',
        number: 3,
        title: 'Minimum Spanning Trees: Kruskal & Prim',
        durationMinutes: 10,
        completed: true,
        keyPoints: [
          'Cut Property and Cycle Property of MSTs',
          'Kruskal’s algorithm with Disjoint Set Union (DSU / Union-Find)',
          'Prim’s vertex-growing algorithm for dense graphs'
        ],
        simplifiedExplanation: {
          en: 'Connecting all cities with electrical wire using the absolute minimum total length without creating loops.',
          ta: 'அனைத்து நகரங்களையும் மிகக் குறைந்த செலவில், வளையங்கள் (Loops) இல்லாமல் மின் கம்பிகளால் இணைப்பது போன்றது MST.',
          hi: 'कम से कम तार खर्च करके बिना लूप बनाए सभी शहरों को बिजली से जोड़ना।',
          tngl: 'Ellam points ah minimum wire length la connect panrathu with no circular loops.'
        }
      }
    ],
    highYieldFormulas: [
      {
        title: 'Handshaking Lemma',
        formula: '\\sum_{v \\in V} \\text{deg}(v) = 2|E|',
        meaning: 'Total degrees in any graph equals twice the number of edges.'
      },
      {
        title: 'Euler’s Formula for Planar Graphs',
        formula: 'V - E + F = 2',
        meaning: 'V = Vertices, E = Edges, F = Faces (including outer infinite face).'
      }
    ]
  },
  {
    id: 'sub-ece-204',
    code: 'ECE-204',
    title: 'Signals, Systems & Discrete Fourier Transform',
    domain: 'Electronics',
    languages: ['en', 'ta', 'hi', 'tngl'],
    difficulty: 'Intermediate',
    chaptersCount: 4,
    estimatedMinutes: 40,
    aiSimplifiedVersion: 'v2.0',
    isAiSimplified: true,
    examProbability: 'High',
    lastStudiedDate: '5 days ago',
    progressPercent: 40,
    tags: ['LTI Systems', 'Convolution', 'FFT', 'Nyquist Sampling', 'Poles and Zeros'],
    summary: {
      en: 'Deconstructs complex temporal signals into pure harmonic frequencies using Fourier and Z-transforms. Essential for audio processing, 5G wireless telecommunications, radar, and biomedical imaging.',
      ta: 'ஒலி மற்றும் மின் சமிக்ஞைகளை (Signals) தூய அலைவரிசைகளாக (Frequencies) பிரித்து ஆய்வு செய்யும் மின்னணுவியல் பாடம்.',
      hi: 'सिग्नल्स और सिस्टम्स किसी भी ध्वनि या डेटा तरंग को उसकी मूल आवृत्तियों में तोड़कर समझने का विज्ञान है।',
      tngl: 'Raw sound or electric wave ah frequency components ah split panni noise filter panra core electronics concept.'
    },
    jargonBreakdown: [
      {
        term: 'Nyquist-Shannon Sampling Rate',
        formalDefinition: 'To avoid aliasing when digitizing a continuous bandlimited analog signal, the sampling frequency f_s must be at least twice the maximum frequency f_max present in the signal.',
        simplifiedAnalogy: 'Like recording a spinning car wheel: if you take too few camera frames per second, the wheel looks like it is spinning backwards (aliasing).'
      }
    ],
    chapters: [
      {
        id: 'ece-ch-1',
        number: 1,
        title: 'Continuous vs Discrete Signals & LTI Properties',
        durationMinutes: 10,
        completed: true,
        keyPoints: ['Linearity and Superposition', 'Time-Invariance test', 'Causality and BIBO Stability criteria'],
        simplifiedExplanation: {
          en: 'An LTI system guarantees that if you scale the input, the output scales identically, and delaying input delays output identically.',
          ta: 'LTI அமைப்புகள் மாற்றங்களுக்கு ஏற்ப நேர்த்தியாக இயங்கும் பண்பு கொண்டவை.',
          hi: 'LTI सिस्टम इनपुट और आउटपुट के बीच सीधा और स्थिर संबंध बनाए रखते हैं।',
          tngl: 'Input double aana output exact double aagum, delay aana delay aagum — no weird surprises.'
        }
      },
      {
        id: 'ece-ch-2',
        number: 2,
        title: 'Convolution Sum and Integral in Time Domain',
        durationMinutes: 10,
        completed: false,
        keyPoints: ['y[n] = x[n] * h[n]', 'Flip, shift, multiply and accumulate mechanics', 'Impulse response characterization'],
        simplifiedExplanation: {
          en: 'Convolution computes how the physical shape of an input signal gets smeared or modified by passing through a filter.',
          ta: 'ஒரு சமிக்ஞை அமைப்பில் நுழையும் போது எவ்வாறு மாறுகிறது என்பதை கணக்கிடுவது Convolution.',
          hi: 'कॉन्वोल्यूशन बताता है कि फ़िल्टर से गुजरने पर सिग्नल का आकार कैसे बदलता है।',
          tngl: 'Oru voice echo room-la pogum pothu eppadi change aaguthu nu compute panra math operation.'
        }
      }
    ],
    highYieldFormulas: [
      {
        title: 'Discrete Fourier Transform (DFT)',
        formula: 'X[k] = \\sum_{n=0}^{N-1} x[n] \\cdot e^{-j 2\\pi k n / N}',
        meaning: 'Converts time-domain samples x[n] into frequency spectrum bin X[k].'
      },
      {
        title: 'Nyquist Criterion',
        formula: 'f_s \\ge 2 \\cdot f_{\\text{max}}',
        meaning: 'Sampling rate must be double the highest frequency to prevent spectral overlap.'
      }
    ]
  },
  {
    id: 'sub-se-315',
    code: 'SE-315',
    title: 'Distributed Consensus & Raft Protocol',
    domain: 'Software Engineering',
    languages: ['en', 'ta', 'hi', 'tngl'],
    difficulty: 'Advanced',
    chaptersCount: 4,
    estimatedMinutes: 50,
    aiSimplifiedVersion: 'v2.8',
    isAiSimplified: true,
    examProbability: 'Essential',
    lastStudiedDate: '1 week ago',
    progressPercent: 30,
    tags: ['Consensus', 'Leader Election', 'Log Replication', 'Split Brain', 'CAP Theorem'],
    summary: {
      en: 'Raft is an understandable consensus algorithm for managing replicated state machines across clusters. It solves leader election, log replication, and split-brain safety with randomized election timeouts.',
      ta: 'பல கம்ப்யூட்டர்கள் ஒன்றிணைந்து இயங்கும் போது, சர்வர் செயலிழந்தாலும் ஒரே முடிவை எடுக்க உதவும் முறை தான் Raft Consensus.',
      hi: 'राफ्ट एक ऐसा एल्गोरिदम है जो कई सर्वर्स के बीच डेटा को हमेशा सिंक और एक समान रखता है।',
      tngl: 'Multiple cloud servers orey data va agree panna, leader election and log replication vachu handle panra modern distributed systems protocol.'
    },
    jargonBreakdown: [
      {
        term: 'Split Brain Problem',
        formalDefinition: 'A condition where a distributed cluster partitions into two disconnected sub-clusters, each electing its own leader and accepting conflicting writes.',
        simplifiedAnalogy: 'Like two rooms in a company losing phone connection and both electing their own CEO, making contradictory company decisions at the same time.'
      }
    ],
    chapters: [
      {
        id: 'se-ch-1',
        number: 1,
        title: 'Leader Election & Randomized Heartbeats',
        durationMinutes: 12,
        completed: true,
        keyPoints: ['Follower, Candidate, and Leader states', 'Randomized election timer (150ms-300ms) to prevent split votes', 'Majority quorum rule (N/2 + 1)'],
        simplifiedExplanation: {
          en: 'If a follower stops hearing from the leader, it becomes a candidate and asks others to vote for it with a randomized timer.',
          ta: 'தலைவர் சர்வர் பதிலளிக்கவில்லை என்றால், மற்ற சர்வர்கள் வாக்களித்து புதிய தலைவரை தேர்ந்தெடுக்கும்.',
          hi: 'अगर लीडर बंद हो जाए, तो बाकी सर्वर्स मिलकर नया लीडर चुन लेते हैं।',
          tngl: 'Leader silent aana, randomized timer la candidate aagi vote kettu new leader aagidum.'
        }
      }
    ],
    highYieldFormulas: [
      {
        title: 'Quorum Majority Condition',
        formula: 'Q = \\lfloor \\frac{N}{2} \\rfloor + 1',
        meaning: 'Minimum votes required for leader election and commit acknowledgement.'
      }
    ]
  }
];
