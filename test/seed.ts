import type { Payload } from 'payload';

// thanks chatgprt
const randomWords = [
  'Elephant',
  'Sunshine',
  'Galaxy',
  'Bicycle',
  'Dragon',
  'Adventure',
  'Symphony',
  'Pineapple',
  'Wanderlust',
  'Moonlight',
  'Chocolate',
  'Serendipity',
  'Thunderstorm',
  'Velvet',
  'Kaleidoscope',
  'Bubblegum',
  'Enigma',
  'Waterfall',
  'Firefly',
  'Rainbow',
  'Cobweb',
  'Whirlwind',
  'Marshmallow',
  'Stardust',
  'Tornado',
  'Meadow',
  'Mirage',
  'Saffron',
  'Zephyr',
  'Blizzard',
];

export const seed = async (payload: Payload) => {
  payload.logger.info('Seeding examples...');
  for (const title of randomWords) {
    await payload.create({ collection: 'examples', data: { title } });
  }
};
