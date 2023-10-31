const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:9281', // 设置你要代理的服务器地址
        changeOrigin: true,
        pathRewrite: {
          '^/api': '', // 如果代理地址中有/api前缀，可以使用pathRewrite将api前缀去掉
        },
      },
    },
  },
})
