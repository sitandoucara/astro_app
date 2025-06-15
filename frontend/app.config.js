export default () => ({
  expo: {
    name: 'AstroMood',
    slug: 'astromood',
    version: '1.0.0',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    ios: {
      bundleIdentifier: 'com.sigraph.astromood',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      eas: {
        projectId: '6deed567-7f8f-4954-af1e-f2d545e74c89',
      },
    },
  },
});
