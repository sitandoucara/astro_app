export default () => ({
  expo: {
    name: 'AstroMood',
    slug: 'astromood',
    version: '1.1.1',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    supportsTablet: true,
    ios: {
      buildNumber: '13',
      supportsTablet: true,
      bundleIdentifier: 'com.sigraph.astromood',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: 'com.sigraph.astromood',
      supportsTablet: true,
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
