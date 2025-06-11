module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  transformIgnorePatterns: [
    'node_modules/(?!(expo|expo-font|expo-modules-core|react-native|@react-native|@react-navigation|react-redux|react-native-css-interop|@expo/vector-icons)/)',
  ],
  moduleNameMapper: {
    '^@expo/vector-icons$': '<rootDir>/__mocks__/@expo/vector-icons.js',
    '^app/(.*)$': '<rootDir>/app/$1',
    '^features/(.*)$': '<rootDir>/features/$1',
    '^shared/(.*)$': '<rootDir>/shared/$1',
    '\\.(svg|png|jpg|jpeg)$': '<rootDir>/__mocks__/fileMock.js',
  },

  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
};
