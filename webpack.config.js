module.exports = {
    mode: 'development', // or 'production'
    entry: 'public/js/common.js', // Your entry file
    output: {
        filename: 'public/js/bundle.js', // Your output file name
    },
    module: {
        rules: [
            {
                test: /\.js$/, // Transpile all .js files
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader', // Use babel-loader for transpilation
                    options: {
                        presets: ['@babel/preset-env'], // Use @babel/preset-env for transpilation
                    },
                },
            },
        ],
    },
};
