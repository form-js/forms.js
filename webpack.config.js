const path = require("path");

module.exports = {
  entry: "./public/app.js", // Adjust this to your main compiled JavaScript file
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "public/dist"),
  },
  resolve: {
    extensions: [".js"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      }
    ]
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 9000,
    hot: true,
    watchFiles: {
      paths: ["public/**/*"],
      options: {
        usePolling: true,
      },
    },
    headers: {
      "Cache-Control": "no-store",
    },
  },
  mode: "development",
  watch: true,
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 300,
    poll: 1000,
  },
};
