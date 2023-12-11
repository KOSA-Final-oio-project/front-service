module.exports = {
    devServer: {
        proxy: {
            '/chat-service': {
                target: 'http://localhost:9797/',
                changeOrigin: true,
                pathRewrite: {
                    '^/chat-service': '/chat-service',
                },
            },
        },
    },
};
