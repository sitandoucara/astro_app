const mockReanimated = require('react-native-reanimated/mock');

module.exports = {
  ...mockReanimated,
  FadeInUp: {
    duration: jest.fn(() => ({ entering: jest.fn() })),
  },
  useSharedValue: jest.fn((initial) => ({ value: initial })),
  useAnimatedStyle: jest.fn(() => ({})),
  withSpring: jest.fn((value) => value),
  interpolate: jest.fn((value, input, output) => output[0]),
};
