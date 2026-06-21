const CACHE_NAME = 'magic-words-cache-v30';
const ASSETS = [
  'index.html',
  'styles.css',
  'particles.js',
  'app.js',
  'manifest.json',
  'assets/boy_front.png',
  'assets/boy_action.png',
  'assets/animal_cat.png',
  'assets/animal_dog.png',
  'assets/animal_rabbit.png',
  'assets/animal_dragon.png',
  'assets/animal_lion.png',
  'assets/animal_cow.png',
  'assets/animal_horse.png',
  'assets/animal_pig.png',
  'assets/animal_bear.png',
  'assets/animal_sheep.png',
  'assets/animal_elephant.png',
  'assets/animal_chicken.png',
  'assets/animal_donkey.png',
  'assets/animal_giraffe.png',
  'assets/animal_tiger.png',
  'assets/animal_toucan.png',
  'assets/animal_alligator.png',
  'assets/animal_rhino.png',
  'assets/animal_hippo.png',
  'assets/animal_lizard.png',
  'assets/animal_duck.png',
  'assets/animal_goat.png',
  'assets/animal_turkey.png',
  'assets/animal_monkey.png',
  'assets/animal_zebra.png',
  'assets/animal_kangaroo.png',
  'assets/animal_penguin.png',
  'assets/animal_panda.png',
  'assets/animal_fox.png',
  'assets/animal_koala.png',
  'assets/animal_squirrel.png',
  'assets/animal_deer.png',
  'assets/animal_owl.png',
  'assets/animal_wolf.png',
  'assets/animal_whale.png',
  'assets/animal_seal.png',
  'assets/animal_otter.png',
  'assets/animal_snake.png',
  'assets/animal_camel.png',
  'assets/animal_gorilla.png',
  'assets/animal_frog.png',
  'assets/animal_turtle.png',
  'assets/animal_dolphin.png',
  'assets/animal_shark.png',
  'assets/animal_octopus.png',
  'assets/animal_crab.png',
  'assets/animal_flamingo.png',
  'assets/animal_parrot.png',
  'assets/animal_mouse.png',
  'assets/animal_hamster.png',
  'assets/animal_butterfly.png',
  'assets/animal_bee.png',
  'assets/animal_ladybug.png',
  'assets/animal_beetle.png',
  'assets/animal_cricket.png',
  'assets/animal_firefly.png',
  'assets/animal_seagull.png',
  'assets/animal_hummingbird.png',
  'assets/animal_hedgehog.png',
  'assets/animal_platypus.png',
  'assets/animal_cheetah.png',
  'assets/animal_leopard.png',
  'assets/animal_llama.png',
  'assets/animal_lobster.png',
  'assets/animal_walrus.png',
  'assets/animal_stingray.png',
  'assets/animal_squid.png',
  'assets/animal_shrimp.png',
  'assets/animal_eel.png',
  'assets/animal_pelican.png',
  'assets/animal_clam.png',
  'assets/animal_goldfish.png',
  'assets/animal_orca.png',
  'assets/animal_caterpillar.png',
  'assets/animal_ant.png',
  'assets/animal_spider.png',
  'assets/animal_centipede.png',
  'assets/animal_moth.png',
  'assets/animal_eagle.png',
  'assets/animal_raccoon.png',
  'assets/animal_sloth.png',
  'assets/animal_alpaca.png',
  'assets/animal_meerkat.png',
  'assets/animal_chameleon.png',
  'assets/animal_snail.png',
  'assets/animal_worm.png',
  'assets/animal_dragonfly.png',
  'assets/animal_grasshopper.png',
  'assets/animal_swan.png',
  'assets/animal_peacock.png',
  'assets/animal_woodpecker.png',
  'assets/animal_pigeon.png',
  'assets/animal_skunk.png',
  'assets/animal_beaver.png',
  'assets/animal_bat.png',
  'assets/animal_porcupine.png',
  'assets/animal_jellyfish.png',
  'assets/animal_starfish.png',
  'assets/animal_seahorse.png'
];

// Install Service Worker
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Service Worker
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Assets
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
