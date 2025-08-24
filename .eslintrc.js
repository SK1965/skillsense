module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended', // Add Prettier integration
  ],
  rules: {   
    "node/no-deprecated-api": "warn"
  },
};
