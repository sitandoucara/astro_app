module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/jest.setup.ts'],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  transformIgnorePatterns: [
    'node_modules/(?!(expo|expo-font|expo-modules-core|react-native' +
      '|@react-native|@react-navigation|react-redux' +
      '|react-native-css-interop|@expo/vector-icons' +
      '|react-native-reanimated|react-native-url-polyfill)/)',
  ],
  moduleNameMapper: {
    '^@react-native-async-storage/async-storage$': '<rootDir>/__mocks__/asyncStorageMock.js',
    '^app/(.*)$': '<rootDir>/app/$1',
    '^features/(.*)$': '<rootDir>/features/$1',
    '^shared/(.*)$': '<rootDir>/shared/$1',
    '\\.(svg|png|jpg|jpeg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
};
