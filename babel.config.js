module.exports = api => {
    api.cache(true);

    return {
        presets: [
            ['@babel/preset-env', {
                targets: {
                    browsers: [ '> 2%', 'ie 11', 'safari > 9' ],
                },
            }],
        ],
        plugins: [
            '@babel/plugin-proposal-object-rest-spread',
        ],
    };
};
