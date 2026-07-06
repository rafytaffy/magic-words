// Define Application States
const STATES = {
  INITIALIZING: 'INITIALIZING',
  IDLE_WAITING: 'IDLE_WAITING',
  HEARD: 'HEARD',
  SUMMONING: 'SUMMONING',
  COOLDOWN: 'COOLDOWN'
};

class App {
  constructor() {
    this.state = STATES.INITIALIZING;
    this.recognition = null;
    this.particles = null;
    this.audioCtx = null;
    this.isListeningActive = false;
    this.currentAnimal = null;
    this.cooldownTimer = null;

    // Supported animal keywords mapping to their internal keys (including common toddler pronunciations)
    this.supportedAnimals = {
      'cat': 'cat', 'kitten': 'cat', 'kat': 'cat', 'tat': 'cat', 'cah': 'cat',
      'dog': 'dog', 'puppy': 'dog', 'dah': 'dog', 'gog': 'dog', 'doggy': 'dog',
      'rabbit': 'rabbit', 'bunny': 'rabbit', 'wabbit': 'rabbit', 'wabit': 'rabbit', 'labbit': 'rabbit', 'rabi': 'rabbit', 'bun': 'rabbit',
      'dragon': 'dragon', 'dwagon': 'dragon', 'gagon': 'dragon', 'dagon': 'dragon', 'dagin': 'dragon',
      'lion': 'lion', 'yion': 'lion', 'lili': 'lion', 'line': 'lion', 'lione': 'lion',
      'cow': 'cow', 'caw': 'cow', 'coww': 'cow', 'mow': 'cow', 'moo': 'cow',
      'horse': 'horse', 'hos': 'horse', 'hawse': 'horse', 'horsey': 'horse', 'hose': 'horse',
      'pig': 'pig', 'piddy': 'pig', 'piggy': 'pig', 'pik': 'pig',
      'bear': 'bear', 'beh': 'bear', 'bare': 'bear', 'behr': 'bear',
      'sheep': 'sheep', 'seep': 'sheep', 'heep': 'sheep', 'shee': 'sheep', 'baa': 'sheep',
      'elephant': 'elephant', 'elphant': 'elephant', 'efant': 'elephant', 'ellie': 'elephant', 'elpat': 'elephant', 'elph': 'elephant', 'pepant': 'elephant',
      'chicken': 'chicken', 'chick': 'chicken', 'hen': 'chicken',
      'donkey': 'donkey',
      'giraffe': 'giraffe',
      'tiger': 'tiger',
      'alligator': 'alligator', 'aligator': 'alligator', 'crocodile': 'alligator',
      'rhino': 'rhino', 'rhinoceros': 'rhino',
      'toucan': 'toucan', 'tucan': 'toucan', 'two-can': 'toucan', 'twocan': 'toucan',
      'hippo': 'hippo', 'hippopotamus': 'hippo', 'hipo': 'hippo', 'hepo': 'hippo',
      'lizard': 'lizard', 'lizardy': 'lizard', 'liz': 'lizard', 'wizado': 'lizard',
      'duck': 'duck', 'ducky': 'duck', 'quack': 'duck', 'duk': 'duck',
      'goat': 'goat', 'gote': 'goat', 'got': 'goat', 'billy': 'goat', 'cote': 'goat',
      'turkey': 'turkey', 'turki': 'turkey', 'gobble': 'turkey', 'tukey': 'turkey',
      'monkey': 'monkey', 'monky': 'monkey', 'montey': 'monkey',
      'zebra': 'zebra', 'sebra': 'zebra', 'zibra': 'zebra',
      'kangaroo': 'kangaroo', 'kangar': 'kangaroo', 'roo': 'kangaroo',
      'penguin': 'penguin', 'pewgwid': 'penguin', 'pengin': 'penguin',
      'panda': 'panda', 'pauda': 'panda', 'pand': 'panda',
      'fox': 'fox', 'poks': 'fox', 'foks': 'fox',
      'koala': 'koala', 'kowala': 'koala', 'koala-bear': 'koala',
      'squirrel': 'squirrel', 'skwirel': 'squirrel', 'skwirl': 'squirrel',
      'deer': 'deer', 'dih': 'deer', 'dear': 'deer',
      'owl': 'owl', 'oul': 'owl', 'howl': 'owl',
      'wolf': 'wolf', 'wuf': 'wolf', 'wuff': 'wolf',
      'whale': 'whale', 'wayl': 'whale', 'wail': 'whale', 'wale': 'whale', 'while': 'whale', 'well': 'whale', 'wheel': 'whale', 'whales': 'whale', 'rayl': 'whale', 'wayli': 'whale', 'waly': 'whale',
      'seal': 'seal', 'seel': 'seal',
      'otter': 'otter', 'atah': 'otter',
      'snake': 'snake', 'nake': 'snake', 'nakey': 'snake',
      'camel': 'camel', 'kamul': 'camel',
      'gorilla': 'gorilla', 'gorila': 'gorilla', 'rilla': 'gorilla',
      'frog': 'frog', 'wog': 'frog', 'fog': 'frog', 'froggy': 'frog',
      'turtle': 'turtle', 'turtl': 'turtle', 'turt': 'turtle',
      'dolphin': 'dolphin', 'dolfin': 'dolphin', 'dofin': 'dolphin',
      'shark': 'shark', 'sark': 'shark', 'tark': 'shark',
      'octopus': 'octopus', 'octo': 'octopus', 'pus': 'octopus',
      'crab': 'crab', 'krab': 'crab', 'tab': 'crab',
      'flamingo': 'flamingo', 'mingo': 'flamingo',
      'parrot': 'parrot', 'parot': 'parrot', 'perot': 'parrot',
      'mouse': 'mouse', 'mous': 'mouse', 'maus': 'mouse',
      'hamster': 'hamster', 'hampster': 'hamster', 'hammy': 'hamster',
      'butterfly': 'butterfly', 'butter': 'butterfly', 'fly': 'butterfly', 'papat': 'butterfly',
      'bee': 'bee', 'honeybee': 'bee', 'bih': 'bee',
      'ladybug': 'ladybug', 'lady': 'ladybug', 'bug': 'ladybug',
      'beetle': 'beetle', 'betl': 'beetle',
      'cricket': 'cricket',
      'firefly': 'firefly',
      'seagull': 'seagull', 'gull': 'seagull',
      'hummingbird': 'hummingbird', 'humming': 'hummingbird',
      'hedgehog': 'hedgehog', 'hog': 'hedgehog', 'hedgie': 'hedgehog',
      'platypus': 'platypus', 'platy': 'platypus',
      'cheetah': 'cheetah', 'cheta': 'cheetah',
      'leopard': 'leopard', 'leopard-cat': 'leopard',
      'llama': 'llama', 'lama': 'llama',
      'lobster': 'lobster', 'lopster': 'lobster',
      'walrus': 'walrus',
      'stingray': 'stingray', 'ray': 'stingray',
      'squid': 'squid',
      'shrimp': 'shrimp', 'srimp': 'shrimp',
      'eel': 'eel',
      'pelican': 'pelican',
      'clam': 'clam', 'clem': 'clam',
      'goldfish': 'goldfish', 'gold': 'goldfish', 'fish': 'goldfish',
      'orca': 'orca', 'killer-whale': 'orca',
      'caterpillar': 'caterpillar', 'piller': 'caterpillar', 'cater': 'caterpillar',
      'ant': 'ant', 'ent': 'ant',
      'spider': 'spider', 'pider': 'spider', 'spy': 'spider',
      'centipede': 'centipede',
      'moth': 'moth',
      'eagle': 'eagle', 'egl': 'eagle',
      'raccoon': 'raccoon', 'coon': 'raccoon',
      'sloth': 'sloth', 'slof': 'sloth',
      'alpaca': 'alpaca',
      'meerkat': 'meerkat',
      'chameleon': 'chameleon', 'cham': 'chameleon',
      'snail': 'snail', 'nayl': 'snail',
      'worm': 'worm', 'werm': 'worm',
      'dragonfly': 'dragonfly',
      'grasshopper': 'grasshopper', 'hopper': 'grasshopper',
      'swan': 'swan', 'swon': 'swan',
      'peacock': 'peacock', 'pea': 'peacock',
      'woodpecker': 'woodpecker', 'pecker': 'woodpecker',
      'pigeon': 'pigeon', 'pidgin': 'pigeon',
      'skunk': 'skunk', 'kunk': 'skunk',
      'beaver': 'beaver', 'bever': 'beaver',
      'bat': 'bat', 'bet': 'bat',
      'porcupine': 'porcupine', 'porky': 'porcupine',
      'jellyfish': 'jellyfish', 'jelly': 'jellyfish',
      'starfish': 'starfish', 'star': 'starfish',
      'seahorse': 'seahorse'
    };

    // Cache DOM Elements
    this.setupOverlay = document.getElementById('setup-overlay');
    this.startBtn = document.getElementById('start-btn');
    this.hintsContainer = document.getElementById('hints-container');
    this.hintCards = [
      document.getElementById('hint-card-0'),
      document.getElementById('hint-card-1'),
      document.getElementById('hint-card-2'),
      document.getElementById('hint-card-3')
    ];
    this.boyFront = document.getElementById('boy-front');
    this.boyAction = document.getElementById('boy-action');
    this.speechBubble = document.getElementById('speech-bubble');
    this.speechText = document.getElementById('speech-text');
    this.speechFeed = document.getElementById('speech-feed');
    this.speechFeedBubble = this.speechFeed.querySelector('.speech-feed-bubble');
    
    this.statusLight = document.getElementById('status-light');
    this.statusLabel = document.getElementById('status-label');
    this.micBtn = document.getElementById('mic-btn');

    // Catalog Modal Elements
    this.catalogBtn = document.getElementById('catalog-btn');
    this.catalogModal = document.getElementById('catalog-modal');
    this.closeModalBtn = document.getElementById('close-modal-btn');

    // Animal image elements
    this.animalElements = {
      'cat': document.getElementById('animal-cat'),
      'dog': document.getElementById('animal-dog'),
      'rabbit': document.getElementById('animal-rabbit'),
      'dragon': document.getElementById('animal-dragon'),
      'lion': document.getElementById('animal-lion'),
      'cow': document.getElementById('animal-cow'),
      'horse': document.getElementById('animal-horse'),
      'pig': document.getElementById('animal-pig'),
      'bear': document.getElementById('animal-bear'),
      'sheep': document.getElementById('animal-sheep'),
      'elephant': document.getElementById('animal-elephant'),
      'chicken': document.getElementById('animal-chicken'),
      'donkey': document.getElementById('animal-donkey'),
      'giraffe': document.getElementById('animal-giraffe'),
      'tiger': document.getElementById('animal-tiger'),
      'toucan': document.getElementById('animal-toucan'),
      'alligator': document.getElementById('animal-alligator'),
      'rhino': document.getElementById('animal-rhino'),
      'hippo': document.getElementById('animal-hippo'),
      'lizard': document.getElementById('animal-lizard'),
      'duck': document.getElementById('animal-duck'),
      'goat': document.getElementById('animal-goat'),
      'turkey': document.getElementById('animal-turkey'),
      'monkey': document.getElementById('animal-monkey'),
      'zebra': document.getElementById('animal-zebra'),
      'kangaroo': document.getElementById('animal-kangaroo'),
      'penguin': document.getElementById('animal-penguin'),
      'panda': document.getElementById('animal-panda'),
      'fox': document.getElementById('animal-fox'),
      'koala': document.getElementById('animal-koala'),
      'squirrel': document.getElementById('animal-squirrel'),
      'deer': document.getElementById('animal-deer'),
      'owl': document.getElementById('animal-owl'),
      'wolf': document.getElementById('animal-wolf'),
      'whale': document.getElementById('animal-whale'),
      'seal': document.getElementById('animal-seal'),
      'otter': document.getElementById('animal-otter'),
      'snake': document.getElementById('animal-snake'),
      'camel': document.getElementById('animal-camel'),
      'gorilla': document.getElementById('animal-gorilla'),
      'frog': document.getElementById('animal-frog'),
      'turtle': document.getElementById('animal-turtle'),
      'dolphin': document.getElementById('animal-dolphin'),
      'shark': document.getElementById('animal-shark'),
      'octopus': document.getElementById('animal-octopus'),
      'crab': document.getElementById('animal-crab'),
      'flamingo': document.getElementById('animal-flamingo'),
      'parrot': document.getElementById('animal-parrot'),
      'mouse': document.getElementById('animal-mouse'),
      'hamster': document.getElementById('animal-hamster'),
      'butterfly': document.getElementById('animal-butterfly'),
      'bee': document.getElementById('animal-bee'),
      'ladybug': document.getElementById('animal-ladybug'),
      'beetle': document.getElementById('animal-beetle'),
      'cricket': document.getElementById('animal-cricket'),
      'firefly': document.getElementById('animal-firefly'),
      'seagull': document.getElementById('animal-seagull'),
      'hummingbird': document.getElementById('animal-hummingbird'),
      'hedgehog': document.getElementById('animal-hedgehog'),
      'platypus': document.getElementById('animal-platypus'),
      'cheetah': document.getElementById('animal-cheetah'),
      'leopard': document.getElementById('animal-leopard'),
      'llama': document.getElementById('animal-llama'),
      'lobster': document.getElementById('animal-lobster'),
      'walrus': document.getElementById('animal-walrus'),
      'stingray': document.getElementById('animal-stingray'),
      'squid': document.getElementById('animal-squid'),
      'shrimp': document.getElementById('animal-shrimp'),
      'eel': document.getElementById('animal-eel'),
      'pelican': document.getElementById('animal-pelican'),
      'clam': document.getElementById('animal-clam'),
      'goldfish': document.getElementById('animal-goldfish'),
      'orca': document.getElementById('animal-orca'),
      'caterpillar': document.getElementById('animal-caterpillar'),
      'ant': document.getElementById('animal-ant'),
      'spider': document.getElementById('animal-spider'),
      'centipede': document.getElementById('animal-centipede'),
      'moth': document.getElementById('animal-moth'),
      'eagle': document.getElementById('animal-eagle'),
      'raccoon': document.getElementById('animal-raccoon'),
      'sloth': document.getElementById('animal-sloth'),
      'alpaca': document.getElementById('animal-alpaca'),
      'meerkat': document.getElementById('animal-meerkat'),
      'chameleon': document.getElementById('animal-chameleon'),
      'snail': document.getElementById('animal-snail'),
      'worm': document.getElementById('animal-worm'),
      'dragonfly': document.getElementById('animal-dragonfly'),
      'grasshopper': document.getElementById('animal-grasshopper'),
      'swan': document.getElementById('animal-swan'),
      'peacock': document.getElementById('animal-peacock'),
      'woodpecker': document.getElementById('animal-woodpecker'),
      'pigeon': document.getElementById('animal-pigeon'),
      'skunk': document.getElementById('animal-skunk'),
      'beaver': document.getElementById('animal-beaver'),
      'bat': document.getElementById('animal-bat'),
      'porcupine': document.getElementById('animal-porcupine'),
      'jellyfish': document.getElementById('animal-jellyfish'),
      'starfish': document.getElementById('animal-starfish'),
      'seahorse': document.getElementById('animal-seahorse')
    };

    // List of core animal keys
    this.coreAnimals = [
      'cat',
      'dog',
      'rabbit',
      'dragon',
      'lion',
      'cow',
      'horse',
      'pig',
      'bear',
      'sheep',
      'elephant',
      'chicken',
      'donkey',
      'giraffe',
      'tiger',
      'toucan',
      'alligator',
      'rhino',
      'hippo',
      'lizard',
      'duck',
      'goat',
      'turkey',
      'monkey',
      'zebra',
      'kangaroo',
      'penguin',
      'panda',
      'fox',
      'koala',
      'squirrel',
      'deer',
      'owl',
      'wolf',
      'whale',
      'seal',
      'otter',
      'snake',
      'camel',
      'gorilla',
      'frog',
      'turtle',
      'dolphin',
      'shark',
      'octopus',
      'crab',
      'flamingo',
      'parrot',
      'mouse',
      'hamster',
      'butterfly',
      'bee',
      'ladybug',
      'beetle',
      'cricket',
      'firefly',
      'seagull',
      'hummingbird',
      'hedgehog',
      'platypus',
      'cheetah',
      'leopard',
      'llama',
      'lobster',
      'walrus',
      'stingray',
      'squid',
      'shrimp',
      'eel',
      'pelican',
      'clam',
      'goldfish',
      'orca',
      'caterpillar',
      'ant',
      'spider',
      'centipede',
      'moth',
      'eagle',
      'raccoon',
      'sloth',
      'alpaca',
      'meerkat',
      'chameleon',
      'snail',
      'worm',
      'dragonfly',
      'grasshopper',
      'swan',
      'peacock',
      'woodpecker',
      'pigeon',
      'skunk',
      'beaver',
      'bat',
      'porcupine',
      'jellyfish',
      'starfish',
      'seahorse'
    ];

    // Pre-calculate normalized toddler phonetic keys for all core animals
    this.normalizedCoreAnimals = {};
    this.coreAnimals.forEach(animal => {
      this.normalizedCoreAnimals[animal] = this.normalizeToddlerSpeech(animal);
    });

    // Ignored filler words for phonetic matching
    this.ignoredWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 
      'have', 'has', 'had', 'do', 'does', 'did', 'to', 'from', 'in', 'on', 'at', 'by', 'for', 
      'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 
      'above', 'below', 'of', 'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further', 
      'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 
      'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 
      'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just', 'should', 'now', 'i', 'me', 
      'my', 'we', 'our', 'you', 'your', 'he', 'him', 'his', 'she', 'her', 'it', 'its', 'they', 
      'them', 'their', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am',
      'look', 'see', 'sea', 'show', 'please', 'say', 'summon', 'want', 'like', 'love', 'make',
      'play', 'baby', 'toddler', 'kid', 'child', 'boy'
    ]);

    this.initEvents();
  }

  // Normalize speech to match toddler pronunciation patterns
  normalizeToddlerSpeech(word) {
    let w = word.toLowerCase().trim();
    if (!w) return "";

    // 1. Digraphs and stops: ph -> f, th -> t, sh -> s, ch -> t
    w = w.replace(/ph/g, 'f');
    w = w.replace(/th/g, 't').replace(/sh/g, 's').replace(/ch/g, 't');

    // 2. Liquids & Glides: l, w, y -> r (toddlers swap these constantly)
    w = w.replace(/l/g, 'r').replace(/w/g, 'r').replace(/y/g, 'r');

    // 3. Hard k/c/q/g spellings normalized to k (velar neutralization)
    w = w.replace(/c/g, 'k').replace(/q/g, 'k').replace(/g/g, 'k');

    // 4. Simplify double letters
    w = w.replace(/(.)\1+/g, '$1');

    return w;
  }

  initEvents() {
    this.startBtn.addEventListener('click', () => this.startMagic());
    this.micBtn.addEventListener('click', () => this.toggleListening());

    // Suggestion Hint Cards click listeners to summon the clicked animal
    this.hintCards.forEach(card => {
      if (card) {
        card.addEventListener('click', () => {
          const animalName = card.dataset.animal;
          if (animalName && this.state === STATES.IDLE_WAITING) {
            this.handleAnimalTrigger(animalName);
          }
        });
      }
    });

    // Screen Touch / Tap listener to summon a random animal
    document.addEventListener('pointerdown', (e) => {
      // Ignore clicks on setup overlay, mic buttons, and start button
      if (
        e.target.closest('#mic-btn') || 
        e.target.closest('#setup-overlay') || 
        e.target.closest('#start-btn') ||
        e.target.closest('#catalog-btn') ||
        e.target.closest('#catalog-modal')
      ) return;

      if (this.state === STATES.IDLE_WAITING) {
        this.triggerRandomAnimal("Screen Tap: ");
      }
    });

    // Keyboard press listener to summon a random animal
    window.addEventListener('keydown', (e) => {
      // Ignore if setup overlay is active
      if (this.setupOverlay && !this.setupOverlay.classList.contains('hidden')) return;

      if (this.state === STATES.IDLE_WAITING) {
        this.triggerRandomAnimal(`Key [${e.key.toUpperCase()}]: `);
      }
    });

    // Catalog button click events
    if (this.catalogBtn) {
      this.catalogBtn.addEventListener('click', () => this.openCatalog());
    }
    if (this.closeModalBtn) {
      this.closeModalBtn.addEventListener('click', () => this.closeCatalog());
    }
    if (this.catalogModal) {
      this.catalogModal.addEventListener('click', (e) => {
        if (e.target === this.catalogModal) this.closeCatalog();
      });
    }
  }

  // Helper to summon a random animal from the active list
  triggerRandomAnimal(prefixText = "Magic Summon: ") {
    if (this.state !== STATES.IDLE_WAITING) return;

    const activeAnimals = Object.keys(this.animalElements);
    const randomIndex = Math.floor(Math.random() * activeAnimals.length);
    const randomAnimal = activeAnimals[randomIndex];

    this.currentAnimal = randomAnimal;
    this.transitionTo(STATES.HEARD);

    this.speechFeedBubble.classList.add('recognized');
    this.speechFeedBubble.innerText = `${prefixText}${randomAnimal.toUpperCase()}!`;
    this.speechFeed.classList.add('visible');

    setTimeout(() => {
      this.transitionTo(STATES.SUMMONING);
    }, 400);
  }

  // Calculate Levenshtein distance between two strings
  levenshtein(s1, s2) {
    if (s1.length < s2.length) {
      return this.levenshtein(s2, s1);
    }
    if (s2.length === 0) {
      return s1.length;
    }
    let previousRow = Array.from(Array(s2.length + 1).keys());
    for (let i = 0; i < s1.length; i++) {
      let currentRow = [i + 1];
      for (let j = 0; j < s2.length; j++) {
        let insertions = previousRow[j + 1] + 1;
        let deletions = currentRow[j] + 1;
        let substitutions = previousRow[j] + (s1[i] !== s2[j] ? 1 : 0);
        currentRow.push(Math.min(insertions, deletions, substitutions));
      }
      previousRow = currentRow;
    }
    return previousRow[s2.length];
  }

  // Set up Audio Context for synthesizer sound effects
  initAudio() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // Synthesize a magical wand chime sound
  playWandSound() {
    this.initAudio();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
    
    notes.forEach((freq, index) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + (index * 0.08));
      
      gain.gain.setValueAtTime(0.15, now + (index * 0.08));
      gain.gain.exponentialRampToValueAtTime(0.001, now + (index * 0.08) + 0.4);
      
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      
      osc.start(now + (index * 0.08));
      osc.stop(now + (index * 0.08) + 0.4);
    });
  }

  // Synthesize a magical poof explosion sound
  playPoofSound() {
    this.initAudio();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const bufferSize = this.audioCtx.sampleRate * 0.4; // 0.4 seconds
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Fill buffer with random white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noiseNode = this.audioCtx.createBufferSource();
    noiseNode.buffer = buffer;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(50, now + 0.35);

    const gain = this.audioCtx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    noiseNode.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioCtx.destination);

    noiseNode.start(now);
    noiseNode.stop(now + 0.4);
  }

  // Speak a phrase using the Web Speech Synthesis API
  speak(phrase) {
    if ('speechSynthesis' in window) {
      // Cancel active voice to avoid stacking
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.lang = 'en-US';
      utterance.rate = 1.15; // slightly faster
      utterance.pitch = 1.4; // high pitch for kid-like voice
      
      // Attempt to pick a cute/high-pitched voice if available
      const voices = window.speechSynthesis.getVoices();
      const childVoice = voices.find(v => v.name.toLowerCase().includes('google US English') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('kid') || v.name.toLowerCase().includes('toy'));
      if (childVoice) {
        utterance.voice = childVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  }

  // Start the experience after overlay click
  startMagic() {
    this.initAudio();
    this.particles = new ParticleSystem('particle-canvas');
    this.setupOverlay.classList.add('hidden');
    
    // Small chime to confirm audio initialized
    this.playWandSound();
    
    // Init speech recognition
    this.initSpeechRecognition();
  }

  // Initialize Speech Recognition
  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      this.updateHUDState(STATES.COOLDOWN, "Mic Unavail.");
      this.speechFeedBubble.innerText = "Speech Recognition not supported in this browser. Please use Safari on iOS, or Chrome/Edge on Desktop.";
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      this.isListeningActive = true;
      if (this.state === STATES.INITIALIZING || this.state === STATES.RESET) {
        this.transitionTo(STATES.IDLE_WAITING);
      }
    };

    this.recognition.onresult = (event) => {
      if (this.state !== STATES.IDLE_WAITING) return;

      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const currentSpeech = (finalTranscript || interimTranscript).toLowerCase().trim();
      if (!currentSpeech) return;

      const words = currentSpeech.split(/\s+/);
      let matchedAnimal = null;
      let isExact = false;

      // Pass 1: Direct exact or explicit toddler map check (highest priority across the entire phrase)
      for (const word of words) {
        if (word.length < 2) continue;
        if (this.supportedAnimals[word]) {
          matchedAnimal = this.supportedAnimals[word];
          isExact = true;
          break;
        }
      }

      // Pass 2: Custom toddler phonetic normalization check (only run if no exact match is found)
      if (!matchedAnimal) {
        for (const word of words) {
          if (word.length < 2) continue;
          if (this.ignoredWords.has(word)) continue; // Skip common filler/ignored words

          const normalizedWord = this.normalizeToddlerSpeech(word);
          if (!normalizedWord || normalizedWord.length < 2) continue;

          let candidates = [];

          for (const target of this.coreAnimals) {
            const normalizedTarget = this.normalizedCoreAnimals[target];

            // Exact match
            if (normalizedWord === normalizedTarget) {
              candidates.push({ target, type: 'exact', distance: 0 });
              continue;
            }

            // Substring match (query must be a substring of target, e.g. "gator" -> "alligator")
            if (normalizedWord.length >= 3 && normalizedTarget.includes(normalizedWord)) {
              const lenDiff = Math.abs(normalizedTarget.length - normalizedWord.length);
              candidates.push({ target, type: 'substring', distance: lenDiff });
              continue;
            }

            // Levenshtein phonetic distance
            const distance = this.levenshtein(normalizedWord, normalizedTarget);
            let threshold = 1;
            if (normalizedTarget.length >= 6) threshold = 2;

            if (distance <= threshold) {
              candidates.push({ target, type: 'fuzzy', distance: distance });
            }
          }

          if (candidates.length > 0) {
            candidates.sort((a, b) => {
              // Exact match is top priority
              if (a.type === 'exact' && b.type !== 'exact') return -1;
              if (b.type === 'exact' && a.type !== 'exact') return 1;

              // Substring match is second priority
              if (a.type === 'substring' && b.type !== 'substring') return -1;
              if (b.type === 'substring' && a.type !== 'substring') return 1;

              // Compare distance
              if (a.distance !== b.distance) {
                return a.distance - b.distance;
              }

              // Tie-breaker: choose target closer in name length to the user's word
              const lenDiffA = Math.abs(a.target.length - word.length);
              const lenDiffB = Math.abs(b.target.length - word.length);
              return lenDiffA - lenDiffB;
            });

            matchedAnimal = candidates[0].target;
            break;
          }
        }
      }

      // 3. If matched, update bubble, show overlay, and trigger summon; otherwise remain silent
      if (matchedAnimal) {
        this.speechFeedBubble.classList.add('recognized');
        if (isExact) {
          this.speechFeedBubble.innerText = `Summoning: ${matchedAnimal.toUpperCase()}!`;
        } else {
          this.speechFeedBubble.innerText = `Best Guess: ${matchedAnimal.toUpperCase()}!`;
        }
        this.speechFeed.classList.add('visible'); // Show speech feed on match
        this.handleAnimalTrigger(matchedAnimal);
      }
    };

    this.recognition.onerror = (event) => {
      console.warn("Speech recognition error", event.error);
      if (event.error === 'not-allowed') {
        this.updateHUDState(STATES.COOLDOWN, "Blocked Mic");
        this.speechFeedBubble.innerText = "Microphone access blocked. Please enable it in browser settings.";
        this.isListeningActive = false;
      }
    };

    this.recognition.onend = () => {
      this.isListeningActive = false;
      // Auto-restart if we are in IDLE_WAITING state
      if (this.state === STATES.IDLE_WAITING) {
        this.startListening();
      }
    };

    this.startListening();
  }

  startListening() {
    if (this.recognition && !this.isListeningActive) {
      try {
        this.recognition.start();
        this.isListeningActive = true;
      } catch (e) {
        console.error("Failed to start speech recognition", e);
      }
    }
  }

  stopListening() {
    if (this.recognition && this.isListeningActive) {
      try {
        this.recognition.stop();
        this.isListeningActive = false;
      } catch (e) {
        console.error("Failed to stop speech recognition", e);
      }
    }
  }

  toggleListening() {
    if (this.state !== STATES.IDLE_WAITING && this.state !== STATES.INITIALIZING) return;

    if (this.isListeningActive) {
      this.stopListening();
      this.updateHUDState(STATES.COOLDOWN, "Muted");
      this.speechFeedBubble.innerText = "Paused listening. Tap indicator to resume.";
      this.speechFeed.classList.add('visible'); // Show pause status
    } else {
      this.startListening();
      this.updateHUDState(STATES.IDLE_WAITING, "Listening...");
      this.speechFeedBubble.innerText = "";
      this.speechFeed.classList.remove('visible'); // Hide when listening resumes
    }
  }

  // State Transitions Manager
  transitionTo(nextState) {
    this.state = nextState;
    console.log(`Transitioned to state: ${nextState}`);

    switch (nextState) {
      case STATES.IDLE_WAITING:
        this.updateHUDState(STATES.IDLE_WAITING, "Listening...");
        this.speechFeedBubble.innerText = "";
        this.speechFeedBubble.classList.remove('recognized');
        this.speechFeed.classList.remove('visible'); // Hide speech feed
        this.boyFront.classList.add('active');
        this.boyAction.classList.remove('active');
        this.speechBubble.classList.remove('active');
        
        // Show and populate suggestion hint cards
        if (this.hintsContainer) {
          this.hintsContainer.classList.add('visible');
          this.renderNewHints();
        }
        
        this.startListening();
        break;

      case STATES.HEARD:
        this.updateHUDState(STATES.HEARD, "Heard Word!");
        
        // Hide hint cards immediately during summon sequence
        if (this.hintsContainer) {
          this.hintsContainer.classList.remove('visible');
        }
        
        // Stop listening temporarily during summon sequence
        this.stopListening();
        break;

      case STATES.SUMMONING:
        this.updateHUDState(STATES.SUMMONING, "Magic Wave!");
        this.executeSummon();
        break;

      case STATES.COOLDOWN:
        this.updateHUDState(STATES.COOLDOWN, "Resting (2s)");
        this.cooldownTimer = setTimeout(() => {
          this.resetStage();
        }, 2000);
        break;
    }
  }

  updateHUDState(stateType, label) {
    this.statusLabel.innerText = label;
    this.micBtn.className = "mic-status-container"; // reset classes

    if (stateType === STATES.IDLE_WAITING) {
      this.micBtn.classList.add('listening');
    } else if (stateType === STATES.HEARD || stateType === STATES.SUMMONING) {
      this.micBtn.classList.add('listening');
    } else {
      this.micBtn.classList.add('cooldown');
    }
  }

  // Triggered when animal keyword is matched
  handleAnimalTrigger(animalName) {
    this.currentAnimal = animalName;
    this.transitionTo(STATES.HEARD);
    
    // Short delay for anticipation, then start summon
    setTimeout(() => {
      this.transitionTo(STATES.SUMMONING);
    }, 400);
  }

  // The boy character turns, waves wand, speaks, and summons animal
  executeSummon() {
    // 1. Turn boy character (swap active image)
    this.boyFront.classList.remove('active');
    this.boyAction.classList.add('active');

    // 2. Say abracadabra!
    const spokenText = `Abracadabra! ${this.currentAnimal}!`;
    this.speechText.innerText = `Abracadabra! ${this.currentAnimal.toUpperCase()}!`;
    this.speechBubble.classList.add('active');
    this.speak(spokenText);

    // 3. Play chime sound and emit wand particles
    this.playWandSound();
    this.emitWandStream();

    // 4. Time the arrival of magic particles at the animal pedestal
    setTimeout(() => {
      // Create magic explosion
      const animalPed = document.querySelector('.animal-wrapper');
      const rect = animalPed.getBoundingClientRect();
      const stageRect = document.querySelector('.diorama-stage').getBoundingClientRect();
      
      const explosionX = rect.left + rect.width / 2 - stageRect.left;
      const explosionY = rect.bottom - 45 - stageRect.top; // centered vertically near pedestal body

      this.playPoofSound();
      this.particles.createSummonExplosion(explosionX, explosionY);

      // 5. Reveal animal
      const animalEl = this.animalElements[this.currentAnimal];
      if (animalEl) {
        // Hide all other animal elements
        Object.values(this.animalElements).forEach(el => {
          el.className = "animal-img";
        });
        animalEl.classList.add('summon-pop');
      }

      // 6. Turn boy back to front view, hide bubble
      setTimeout(() => {
        this.boyFront.classList.add('active');
        this.boyAction.classList.remove('active');
        this.speechBubble.classList.remove('active');
        
        // Go to cooldown state
        this.transitionTo(STATES.COOLDOWN);
      }, 800);

    }, 850); // Particle travel time
  }

  // Compute exact coordinates to fire particle stream
  emitWandStream() {
    const stage = document.querySelector('.diorama-stage');
    const stageRect = stage.getBoundingClientRect();
    
    // Wand tip coordinate
    const wandTip = document.getElementById('wand-tip');
    const wandRect = wandTip.getBoundingClientRect();
    const startX = wandRect.left - stageRect.left;
    const startY = wandRect.top - stageRect.top;

    // Animal Pedestal center target coordinate
    const animalPed = document.querySelector('.animal-wrapper');
    const pedRect = animalPed.getBoundingClientRect();
    const endX = pedRect.left + pedRect.width / 2 - stageRect.left;
    const endY = pedRect.bottom - 60 - stageRect.top;

    // Emit stream
    this.particles.createWandStream(startX, startY, endX, endY);
  }

  // Clean stage after 5 second cooldown
  resetStage() {
    if (this.currentAnimal) {
      const animalEl = this.animalElements[this.currentAnimal];
      if (animalEl) {
        animalEl.classList.remove('summon-pop');
        animalEl.classList.add('dismiss-pop');
        
        // Let dismissal animation finish
        setTimeout(() => {
          animalEl.classList.remove('dismiss-pop');
          this.currentAnimal = null;
          this.state = STATES.RESET;
          this.transitionTo(STATES.IDLE_WAITING);
        }, 500);
      } else {
        this.currentAnimal = null;
        this.state = STATES.RESET;
        this.transitionTo(STATES.IDLE_WAITING);
      }
    } else {
      this.state = STATES.RESET;
      this.transitionTo(STATES.IDLE_WAITING);
    }
  }

  openCatalog() {
    if (this.catalogModal) {
      this.buildAnimalGrid();
      this.catalogModal.classList.add('active');
      // Stop speech recognition briefly to avoid picking up sounds while looking at catalog
      this.stopListening();
    }
  }

  closeCatalog() {
    if (this.catalogModal) {
      this.catalogModal.classList.remove('active');
      // Resume speech recognition if idle
      if (this.state === STATES.IDLE_WAITING) {
        this.startListening();
      }
    }
  }

  buildAnimalGrid() {
    const grid = document.getElementById('modal-animal-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    const sortedAnimals = [...this.coreAnimals].sort();
    
    sortedAnimals.forEach(animal => {
      const card = document.createElement('div');
      card.className = 'animal-grid-card';
      
      const img = document.createElement('img');
      img.src = `assets/animal_${animal}.png`;
      img.alt = animal;
      img.className = 'grid-animal-img';
      img.loading = 'lazy';
      
      const name = document.createElement('div');
      name.className = 'grid-animal-name';
      name.innerText = animal.charAt(0).toUpperCase() + animal.slice(1);
      
      card.appendChild(img);
      card.appendChild(name);
      
      card.addEventListener('click', () => {
        this.closeCatalog();
        if (this.state === STATES.IDLE_WAITING) {
          this.speechFeedBubble.classList.add('recognized');
          this.speechFeedBubble.innerText = `Summoning: ${animal.toUpperCase()}!`;
          this.speechFeed.classList.add('visible');
          this.handleAnimalTrigger(animal);
        }
      });
      
      grid.appendChild(card);
    });
  }

  // Select 4 random unique animals and render them with staggered bouncy entrance animations
  renderNewHints() {
    if (!this.hintsContainer) return;

    // Filter out the currently active/summoned animal if there is one
    const available = [...this.coreAnimals].filter(a => a !== this.currentAnimal);
    
    // Pick 4 unique random animals
    const selected = [];
    while (selected.length < 4 && available.length > 0) {
      const idx = Math.floor(Math.random() * available.length);
      const chosen = available.splice(idx, 1)[0];
      selected.push(chosen);
    }

    // Exit transition for all cards (fade-out)
    this.hintCards.forEach(card => {
      if (card) card.classList.remove('visible');
    });

    // Wait for exit transition to complete (400ms), then update content and bounce-pop in
    setTimeout(() => {
      selected.forEach((animal, index) => {
        const card = this.hintCards[index];
        if (!card) return;

        // Set dataset and content
        card.dataset.animal = animal;
        const img = card.querySelector('.hint-img');
        const text = card.querySelector('.hint-text');
        
        if (img) {
          img.src = `assets/animal_${animal}.png`;
          img.alt = animal;
        }
        if (text) {
          text.innerText = animal;
        }

        // Staggered pop-in animation
        setTimeout(() => {
          card.classList.add('visible');
        }, index * 80); // 80ms stagger delay
      });
    }, 400);
  }
}

// Initialise App once page is fully loaded
window.addEventListener('DOMContentLoaded', () => {
  window.magicApp = new App();

  // Register Service Worker for PWA offline capabilities
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then((reg) => console.log('Service Worker registered successfully:', reg.scope))
      .catch((err) => console.warn('Service Worker registration failed:', err));
  }
});
