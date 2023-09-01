const path = require('path');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

module.exports = {
    entry: {
        drafts: './Content/components/Drafts/index.js',
        crosswords: './Content/components/Crosswords/index.js',
        solve: './Content/components/Solve/index.js',
        users: './Content/components/Users/index.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './wwwroot/dist'),
    },
    devtool: 'eval-source-map',//'source-map'/*process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-source-map'*/,
    mode: 'development',///*process.env.NODE_ENV === 'production' ?*/ 'production' /*: 'development'*/,
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    plugins: [
        new WebpackManifestPlugin({
            fileName: 'asset-manifest.json',
            generate: (seed, files) => {
                const manifestFiles = files.reduce((manifest, file) => {
                    manifest[file.name] = file.path;
                    return manifest;
                }, seed);

                const entrypointFiles = files.filter(x => x.isInitial && !x.name.endsWith('.map')).map(x => x.path);

                return {
                    files: manifestFiles,
                    entrypoints: entrypointFiles,
                };
            },
        }),
    ]
};