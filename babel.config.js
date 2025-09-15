module.exports = function(api) {
  api.cache(true);

  const envFile = process.env.ENVFILE || ".env";

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ["module:react-native-dotenv", {
        moduleName: "@env",
        path: envFile,
        safe: false,
        allowUndefined: true
      }]
    ]
  };
};
