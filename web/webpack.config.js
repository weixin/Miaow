/*
 * Copyright 2018 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const path = require('path');
const sassAssetFunctions = require('node-sass-asset-functions');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  devServer: {
    contentBase: path.join(__dirname, '../web-dist'),
    compress: true,
    port: 9000,
    watchContentBase: true,
  },
  entry: {
    'plugin-call': [
      './src/plugin-call-stub.js',
    ],
    'index': [
      './src/index.js',
      'webpack-dev-server/client?http://localhost:9080/'
    ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../web-dist')
  },
  resolve: {
    alias: {
      // use full (compiler + runtime) version of vue
      vue: 'vue/dist/vue.js'
    }
  },
  performance: {
    hints: false
  },
  module: {
    rules: [
      {
        test: /\.(html)$/,
        use: [
          {
            loader: 'extract-loader',
          },
          {
            loader: 'html-loader',
            options: {
              attrs: [
                'img:src',
                'link:href'
              ],
              interpolate: true,
              minimize: 'production' === process.env.NODE_ENV,
            },
          },
        ]
      },
      {
        test: /\.(scss)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].css'
            }
          },
          {
            loader: 'extract-loader',
          },
          {
            loader: 'css-loader',
            options: {
              minimize: 'production' === process.env.NODE_ENV,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              functions: sassAssetFunctions({
                images_path: path.join(__dirname, 'src'),
              }),
            },
          },
        ]
      },
      {
        test: /\.(png|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
          }
        ]
      },
      {
        test: /\.(woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          },
        ]
      },
    ],
  }
};
