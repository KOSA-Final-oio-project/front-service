module.exports = {
    devServer: {
        proxy: {
            '^/chat-service': {
                target: 'http://localhost:9797',
                ws: true,
                changeOrigin: true,
                pathRewrite: { '^/chat-service': '/chat-service' }
            }
        }
    }
}
