import 'react-native-url-polyfill/auto';
import { config } from 'dotenv';

// Load test environment variables
config({ path: '.env.test' });

// Setup mock environment variables for testing
const { setupTestEnv } = require('./__mocks__/testEnv');
setupTestEnv();

// Ensure required environment variables are set for tests
if (!process.env.EXPO_PUBLIC_SUPABASE_URL) {
  process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://mock-project-id.supabase.co';
}

if (!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'mock-test-key';
}

// Mock global alert for all tests
global.alert = jest.fn();
