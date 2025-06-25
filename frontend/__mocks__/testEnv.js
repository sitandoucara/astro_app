module.exports = {
  setupTestEnv: () => {
    process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://mock-project-id.supabase.co';
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-test-key';
  },
};
