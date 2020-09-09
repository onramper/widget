const path = require('path');

module.exports = {
    mode: 'none',
    entry: {
        app: path.join(__dirname, 'src/OnramperWidget', 'index.tsx')
    },
    output: {
        libraryTarget: 'umd',
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: '/node_modules/',
                options: {
                    configFile: path.resolve(__dirname, 'component.tsconfig.json')
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: true
                        }
                    }
                ],
                include: /\.module\.css$/
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ],
                exclude: /\.module\.css$/
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: '@svgr/webpack',
                        options: {
                            svgoConfig: {
                                plugins: [{ removeViewBox: false }]
                            }
                        }
                    },
                    {
                        loader: 'svg-url-loader',
                        options: {
                            limit: 14000,
                        }
                    }
                ]
            }
        ]
    },
    externals: {
        react: 'react',
        'react-dom': 'react-dom'
    }
}