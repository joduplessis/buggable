const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = (env) => {
    return {
        mode: 'development',
        entry: {
            index: path.resolve(__dirname, './src/index.js'),
        },
        resolve: {
            alias: {
                'react': 'preact/compat',
                'react-dom': 'preact/compat',
            },
        },
        output: {
            path: path.resolve(__dirname, 'public'),
            publicPath: '/',
            filename: 'scripts.[name].js',
            chunkFilename: 'scripts.[name].js',
        },
        performance: {
            hints: false,
            maxEntrypointSize: 512000,
            maxAssetSize: 512000,
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, './src/index.html'),
            }),
            new MiniCssExtractPlugin({
                filename: 'styles.css',
                chunkFilename: 'styles.css',
            }),
            new webpack.NormalModuleReplacementPlugin(/src\/js\/environment\.js/, 'environment.dev.js'),
        ],
        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendor',
                        chunks: 'all',
                    },
                },
            },
        },
        devServer: {
            contentBase: path.resolve(__dirname, 'public'),
            historyApiFallback: true,
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    enforce: 'pre',
                    use: ['source-map-loader'],
                },
                {
                    test: /\.css$/i,
                    use: [MiniCssExtractPlugin.loader, 'css-loader'],
                },
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                },
            ],
        },
    }
}
