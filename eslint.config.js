import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  // 1. 全局忽略
  globalIgnores(['dist', 'node_modules', 'build']),

  // 2. 基础 JS + TS + React 配置
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // React 规则覆盖
      'react/react-in-jsx-scope': 'off', // React 17+ 不需要导入 React
      'react/self-closing-comp': [
        'error',
        {
          component: true,
          html: true,
        },
      ],

      // TypeScript 规则覆盖
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // 3. 扩展推荐配置（顺序很重要！）
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      react,
    },
    settings: {
      react: {
        version: 'detect', // 自动检测 React 版本
      },
    },
    rules: {
      ...react.configs.recommended.rules,
    },
  },
  reactHooks.configs['recommended-latest'],
  reactRefresh.configs.vite,

  // 4. Prettier 集成（必须放在最后！）
  prettier,
  {
    plugins: {
      prettier: { rules: {} }, // 确保插件注册
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
          // 其他选项会从 .prettierrc 继承
        },
      ],
    },
  },
]);
