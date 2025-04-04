import '@testing-library/jest-dom';

// Mock the IndexedDB
const indexedDB = {
  open: vi.fn(),
};

// Add to global
global.indexedDB = indexedDB as any;
