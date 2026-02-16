const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// 👇 This explicitly adds 'mp3' to the list of allowed assets
config.resolver.assetExts.push("mp3");

module.exports = config;
