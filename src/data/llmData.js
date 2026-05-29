export const llmData = [
  {
    id: "input",
    title: "1. Prompt Ingestion",
    color: "#3b82f6", // blue
    zPosition: 6,
    simple: {
      desc: "This is where your prompt goes in. The model reads your text just like a person starting to read a sentence, preparing to figure out what you mean.",
      example: 'User Prompt: "Explain quantum physics..."',
      keyPoints: ["Accepts raw text string", "First point of contact", "Usually has a length limit"]
    },
    technical: {
      desc: "Raw string sequences are ingested. The input is bounded by a context window (e.g., 8k to 128k tokens). Here, the system might inject system prompts or chat templates (like <|im_start|>user).",
      example: "Input String -> Character Stream Buffer",
      keyPoints: ["Context window boundaries", "System prompt injection", "ChatML formatting applied"]
    }
  },
  {
    id: "tokenization",
    title: "2. Tokenizer Pipeline",
    color: "#a855f7", // purple
    zPosition: 3,
    simple: {
      desc: "The model doesn't read words; it reads 'tokens'. It chops your words into smaller chunks. A token can be a whole word, a syllable, or even a single letter.",
      example: '"Hello, world!" becomes ["Hello", ",", " world", "!"]',
      keyPoints: ["Chops text into pieces", "Uses a massive dictionary", "More efficient than letter-by-letter"]
    },
    technical: {
      desc: "Employs an algorithm like Byte-Pair Encoding (BPE), WordPiece, or SentencePiece to segment text into subwords. These subwords are mapped to integer IDs based on a pre-trained vocabulary (typically 32,000 to 128,000 tokens).",
      example: 'String: "Quantum" -> Tokens: ["Qu", "ant", "um"] -> IDs: [4501, 231, 98]',
      keyPoints: ["BPE / SentencePiece Algorithms", "Integer ID Mapping", "Vocabulary Size (~100k)", "Handles unknown chars via byte-fallback"]
    }
  },
  {
    id: "embedding",
    title: "3. Embedding Space",
    color: "#06b6d4", // cyan
    zPosition: 0,
    simple: {
      desc: "Each token is turned into a long list of numbers. Words that have similar meanings end up with similar numbers, like plotting points on a massive mathematical map.",
      example: '"King" and "Queen" would be placed close together on this map.',
      keyPoints: ["Converts words to math", "Captures meaning", "Adds position info"]
    },
    technical: {
      desc: "Tokens are mapped to dense, high-dimensional vectors (e.g., d_model = 4096 dimensions). Positional encodings (like Rotary Positional Embeddings - RoPE) are added or injected so the model retains sequence order.",
      example: "Token ID 4501 -> Vector: [0.12, -0.55, 0.89, ... 4096 dimensions]",
      keyPoints: ["High-dimensional vectors (d_model)", "Semantic proximity", "Rotary Positional Encodings (RoPE)"]
    }
  },
  {
    id: "transformer",
    title: "4. Transformer Blocks",
    color: "#f97316", // orange
    zPosition: -3,
    simple: {
      desc: "The core engine. It passes the numbers through many repeating layers, slowly understanding the context of the whole sentence by looking at all the words together.",
      example: "Understanding that 'bank' means 'river bank' instead of 'money bank' based on surrounding words.",
      keyPoints: ["Many stacked layers (12 to 96+)", "Deep context processing", "The 'brain' of the model"]
    },
    technical: {
      desc: "A deep stack of repeating blocks (e.g., Llama 3 has 32-80 layers). Each block contains a Self-Attention mechanism followed by a Feed-Forward Network (usually a SwiGLU variant), with RMSNorm and residual connections bridging them.",
      example: "Input -> RMSNorm -> Attention -> Add -> RMSNorm -> FFN -> Add",
      keyPoints: ["Residual / Skip Connections", "RMSNorm instead of LayerNorm", "SwiGLU Activation Networks", "Gradient flow preservation"]
    }
  },
  {
    id: "attention",
    title: "5. Attention Mechanism",
    color: "#eab308", // yellow
    zPosition: -6,
    simple: {
      desc: "Inside the transformer, 'attention' decides which words are most important to look at right now to understand the current word.",
      example: "In 'The cat sat on the mat because it was tired', attention links 'it' strongly to 'cat'.",
      keyPoints: ["Focuses on important words", "Connects distant concepts", "Contextualizes meaning"]
    },
    technical: {
      desc: "Multi-Head Attention projects inputs into Queries (Q), Keys (K), and Values (V). It computes attention scores: Softmax(QK^T / sqrt(d_k)) * V. Modern LLMs use Grouped-Query Attention (GQA) and KV Caching to speed up generation.",
      example: "Matrix Dimensions: Q [seq, d_k], K [seq, d_k], V [seq, d_v]",
      keyPoints: ["Multi-Head / Grouped-Query Attention", "Query, Key, Value Projections", "KV Cache for autoregressive generation"]
    }
  },
  {
    id: "output",
    title: "6. Output Projection (Softmax)",
    color: "#22c55e", // green
    zPosition: -9,
    simple: {
      desc: "After processing, the model guesses the very next word. Then it takes that new word, feeds it back to the beginning, and repeats the whole process to write a sentence!",
      example: "Guesses the next word is 'physics' with 92% certainty.",
      keyPoints: ["Predicts only ONE next word", "Loops back to the start", "Uses probability"]
    },
    technical: {
      desc: "The final hidden state passes through an RMSNorm and a linear projection head mapping d_model to Vocabulary Size. A Softmax function converts these logits into a probability distribution. Sampling techniques (Temperature, Top-K, Top-P) pick the final token.",
      example: "Logits [Vocab_Size] -> Softmax -> Probability -> Temperature Scaling -> Sampled Token ID",
      keyPoints: ["Linear Language Modeling Head", "Softmax Probability Distribution", "Temperature, Top-P (Nucleus), Top-K Sampling"]
    }
  }
];
