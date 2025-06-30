const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add TypeScript extensions to the beginning of source extensions
config.resolver.sourceExts = ['ts', 'tsx', ...config.resolver.sourceExts];

// Add mjs to asset extensions
config.resolver.assetExts.push('mjs');

// Enable ES modules transpilation for node_modules
config.transformer.unstable_allowRequireContext = true;

// Add web-browser to the modules to transpile
config.transformer.babelTransformerPath = require.resolve('metro-react-native-babel-transformer');

// Ensure node_modules packages with ES modules are properly handled
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'expo-web-browser': require.resolve('expo-web-browser'),
};

module.exports = config;