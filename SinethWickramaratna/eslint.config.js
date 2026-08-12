import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  {
    // The 3D layer drives three.js imperatively: useFrame callbacks run
    // outside React's render phase and are *expected* to mutate the
    // camera, the scene and the shared world singleton every frame.
    // react-hooks/immutability reasons about render purity and cannot
    // see that distinction, so it reports these idioms as errors.
    // Scoped narrowly to the WebGL code — the rule stays on everywhere else.
    files: ['src/synthesis/world/**/*.jsx', 'src/synthesis/environments/**/*.jsx'],
    rules: {
      'react-hooks/immutability': 'off',
    },
  },
])
