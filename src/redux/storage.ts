// Create a noop storage for SSR
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: string) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

// Try to import localStorage, fallback to noop
let storage;
try {
  storage = require('redux-persist/lib/storage').default;
} catch (error) {
  console.warn('redux-persist storage not available, using noop storage');
  storage = createNoopStorage();
}

// Use localStorage on client, noop on server
const finalStorage = typeof window !== 'undefined' ? storage : createNoopStorage();

export default finalStorage;
