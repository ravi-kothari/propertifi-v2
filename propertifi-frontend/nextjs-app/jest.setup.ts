import '@testing-library/jest-dom';
import 'whatwg-fetch';
import { TextEncoder, TextDecoder } from 'util';
import { ReadableStream, TransformStream } from 'stream/web';

// Polyfill for Node environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;
global.ReadableStream = ReadableStream as any;
global.TransformStream = TransformStream as any;

// TODO: Enable MSW when Jest compatibility is resolved
// import { server } from './mocks/server';
// beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
// afterEach(() => server.resetHandlers());
// afterAll(() => server.close());

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});