import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './src/newVersion/index.ts',
  mode: 'development',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, '../../public/js/core'),
    clean: true,
    library: {
      name: 'forms.js',
      type: 'umd',
    },
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    usedExports: true,
  },
};
