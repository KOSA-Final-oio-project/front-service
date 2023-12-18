module.exports = {
    // devServer: {
    //     proxy: {
    //         '^/chat-service': {
    //             target: 'http://localhost:9797',
    //             ws: true,
    //             changeOrigin: true,
    //             pathRewrite: { '^/chat-service': '/chat-service' }
    //         }
    //     }
    // }
    devServer: {
        port: 9797,
        liveReload: true,
        // host 지정
        host: 'localhost',
        allowedHosts: 'all',
        open: true,
        client: {
            overlay: true,
            // 웹소켓용 url 지정
            webSocketURL: 'ws://locaclhost:9797/**'
        },
        compress: true,
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
