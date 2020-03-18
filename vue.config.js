var path = require('path')

const PostCompilePlugin = require('webpack-post-compile-plugin')
const TransformModulesPlugin = require('webpack-transform-modules-plugin')
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: './',

  configureWebpack:(config)=>{
    // config.entry.app = ['babel-polyfill', './src/main.js'] //入口文件
    config.entry.app = './src/main.js' //入口文件
  },

  chainWebpack: config => {
    // 路径别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@img', resolve('src/assets/img'))

    // 图片转base64大小限制
    // config.module
    //   .rule('images')
    //   .use('url-loader')
    //     .loader('url-loader')
    //     .tap(options => Object.assign(options, { limit: 1000 }))

    // 使用全局less变量
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))

    // 按需加载组件库
    const conf = config.toConfig()
    config
      .plugin('post-compile')
      .use(PostCompilePlugin, [{
        config: {
          module: {
            rules: [...conf.module.rules]
          }
        }
      }])
      .end()
      .plugin('transform-modules')
      .use(TransformModulesPlugin)

  },

  productionSourceMap: false,

  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        import: []
      }
    }
  },
  pluginOptions: {
    'cube-ui': {
      postCompile: true,
      theme: false
    }
  }
}

function addStyleResource(rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        path.resolve(__dirname, 'src/assets/css/var.less') // 需要全局导入的less
      ],
    })
}
