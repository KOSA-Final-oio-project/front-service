// module.exports = {
//     // devServer: {
//     //     proxy: {
//     //         '^/chat-service': {
//     //             target: 'http://localhost:9797',
//     //             ws: true,
//     //             changeOrigin: true,
//     //             pathRewrite: { '^/chat-service': '/chat-service' }
//     //         }
//     //     }
//     // }
//     devServer: {
//         port: 9797,
//         liveReload: true,
//         // host 지정
//         host: '192.168.1.93',
//         allowedHosts: 'all',
//         open: true,
//         client: {
//             overlay: true,
//             // 웹소켓용 url 지정
//             webSocketURL: 'ws://192.168.1.93:9712/**'
//         },
//         compress: true,
//         proxy: {
//             '^/chat-service': {
//                 target: 'http://192.168.1.93:9712',
//                 ws: true,
//                 changeOrigin: true,
//                 pathRewrite: { '^/chat-service': '/chat-service' }
//             }
//         }
//     }
// }