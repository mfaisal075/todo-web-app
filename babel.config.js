module.exports = {
  presets: [
    '@babel/preset-env', // Preset for modern JavaScript
    '@babel/preset-react', // Preset for React
    '@babel/preset-typescript', // Include if you're using TypeScript
    '@babel/preset-flow', // Add this line for Flow support
  ],
  plugins: [
    ['@babel/plugin-transform-class-properties', {loose: true}], // Set loose mode to true
    ['@babel/plugin-transform-private-methods', {loose: true}], // Set loose mode to true
    ['@babel/plugin-transform-private-property-in-object', {loose: true}], // Add this line for private properties
    // You can add other plugins here as needed
  ],
};
