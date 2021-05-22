const webpack = require('webpack');
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const HotModuleReplacementPlugin = require('hot-module-replacement');
const autoprefixer = require('autoprefixer');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
const filename = ext => (isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`);

// HotModuleReplacementPlugin({});
const cssLoaders = (extra) => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                hmr: isDev,
                reloadAll: true,
                publicPath: './'
            }
        },
        'css-loader'
    ];
    if (extra) {
        loaders.push(extra);
    }
    return loaders;
};
const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    };
    if (isProd) {
        config.minimizer = [
            new OptimizeCssAssetWebpackPlugin(),
            new TerserWebpackPlugin()
        ];
    }
    return config;
};
const EnableHotModuleReplacementPlugin = () => {
    let res;
    if (isDev) {
        res = new webpack.HotModuleReplacementPlugin();
        return res;
    }
};

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: ['@babel/polyfill', './index.ts']
        //  analit: './index.js',
    },
    target: 'web',
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, './dist')
    },
    resolve: {
        extensions: [ '.js', '.json'],
        alias: {
            '@models': path.resolve(__dirname, 'src/models')
        }
    },
    optimization: optimization(),
    devServer: {
        port: 4200,
        //   publicPath: './src',
        //  watchContentBase: true,
        hot: isDev,
        open: true,
        contentBase: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname, 'src/assets/imgs'), to: 'assets/imgs' },
                { from: path.resolve(__dirname, 'src/assets/audio'), to: 'assets/audio' },
                {
                    from: path.resolve(__dirname, 'src/favicon.ico'),
                    to: path.resolve(__dirname, 'dist')
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: filename('css'),
            chunkFilename: '[id].css'
        })
        // isDev EnableHotModuleReplacementPlugin()
        // new HotModuleReplacementPlugin(),
    ],
    module: {
        rules: [
            /*  {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'eslint-loader']
              }, */
            /*
            {
              test: /\.tsx?$/,
              use: 'ts-loader',
              exclude: /node_modules/
            }, */
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            //  name: '[name].[ext]',
                            //    outputPath: ''
                        }
                    }
                ]
            },
            {
                test: /\.(ttf|woff|woff2|eot|wav)$/,
                use: ['file-loader']
            }, {
                test: /\.xml$/,
                use: ['xml-loader']
            }, {
                test: /\.csv$/,
                use: ['csv-loader']
            },
            /* {
                      loader: 'postcss-loader',
                      options: {
                          plugins: [
                                  autoprefixer()
                          ]
                      }
                  }, */
            {
                test: /\.(sass|scss)$/,
                use: cssLoaders('sass-loader')
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-proposal-private-methods'
                        ]
                    }
                }
            },
            {
                test: /\.m?ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-typescript'],
                        plugins: [
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-proposal-private-methods'
                        ]
                    }
                }
            }
        ]
    }

};
