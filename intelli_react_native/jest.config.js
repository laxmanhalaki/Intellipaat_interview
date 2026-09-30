module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(@react-navigation|@react-native|react-native|react-native-toast-message)/)',
  ],
};
