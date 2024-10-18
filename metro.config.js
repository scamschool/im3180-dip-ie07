// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // Destructure transformer and resolver from the default config
  const { transformer, resolver } = config;

  // Modify the transformer to use react-native-svg-transformer
  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
  };

  // Modify the resolver to exclude svg from assetExts and include it in sourceExts
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"), // Remove "svg" from assetExts
    sourceExts: [...resolver.sourceExts, "svg"], // Add "svg" to sourceExts
  };

  return config;
})();
