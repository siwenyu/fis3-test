# fis记录

FIS3 是面向前端的工程构建工具。解决前端工程中性能优化、资源加载（异步、同步、按需、预加载、依赖管理、合并、内嵌）、模块化开发、自动化工具、开发规范、代码部署等问题。此篇不讲官网说明<a href="http://fis.baidu.com/fis3/docs/beginning/intro.html">官网</a>，主要是一些使用的注意事项。


###  fis压缩

fis3内置的压缩插件是：uglify-js

```
 optimizer: fis.plugin('uglify-js')

报错：Got Error Unexpected token: punc ()) while uglify /app.js
```

原因：不支持es6语法。


### fis3中的前端优化

1. 文件压缩：

```
optimizer: fis.plugin('uglify-js')
optimizer: fis.plugin('clean-css')
optimizer: fis.plugin('png-compressor')
```

2. CssSprite图片合并


```
background-image: url('./img/list-1.png?__sprite');

spriter: fis.plugin('csssprites')
```

### 资源定位

#### 路径构建

构建过程中对资源 URI 进行了替换，替换成了绝对 URL。通俗点讲就是相对路径换成了绝对路径。

优点：随意部署，不用关心路径，开发时候只需要相对路径。可以将项目部署到到任意的路径。

比如：

```
./image/aa.png
../image/aa.png

构建成：
/image/aa.png
/**/image/aa.png

其中默认根目录为项目根目录。
```

#### 特殊路径处理

如果想把某一批文件放到指定的目录，并且需要其他引用该文件的URI自动转换。比如，构建完毕我想把静态文件全部放到一个指定的static目录，但是其他目录不会改变。

```
// 配置配置文件，注意，清空所有的配置，只留下以下代码即可。
fis.match('*.png', {
    release: '/static/$0'
});

```

#### 线下开发调试资源定位

可能有时候开发的时候不需要压缩、合并图片、也不需要 hash。那么给上面配置追加如下配置；


```
fis.media('debug').match('*.{js,css,png}', {
  useHash: false,
  useSprite: false,
  optimizer: null
})

fis3 release debug
```

 启用 media debug 的配置，覆盖上面的配置，把诸多功能关掉。

 ### 常用命令

```
 fis3 release 构建。不加 -d 参数默认被发布到内置 Web Server的根目录下，当启动服务时访问此目录下的资源。

fis3 server start   启动fis3内置的web Server，http://127.0.0.1:8080

fis3 server -h  查看更多命令

Commands:

   start       start server
   stop        shutdown server
   restart     restart server
   info        output server info
   open        open document root directory
   clean       clean files in document root

 Options:

   -h, --help              print this help message
   -p, --port <int>        server listen port
   --root <path>           document root
   --www <path>            alias for --root
   --type                  specify server type
   --timeout <seconds>     start timeout
   --https                 start https server
   --no-browse             do not open a web browser.
   --no-daemon             do not run in background.
   --include <glob>        clean include filter
   --exclude <glob>        clean exclude filter
   --qrcode                output the address with qrcode

fis3 server start -p 8081 更换

fis3 release -wL  监听。-w：构建；-L：监听浏览器刷新。

```

### 发布到本地的其他指定目录

```
deploy: fis.plugin('local-deliver', {
    to: '/Users/siwenyu/Desktop/临时代码存放/fis3outtest'
})
```

### 发布到远程机器的完整步骤

```
本地配置：

fis.match('*', {
    deploy: fis.plugin('http-push', {
        receiver: 'http://47.94.10.18:8999/receiver',   // 远程机器
        to: '/home/work/linshi/fis3test' // 注意这个是指的是测试机器的路径，而非本地机器
    })
})

远程配置：

安装receiver ，pm2（或者其他进程管理工具）。例如：'http://47.94.10.18:8999/receiver',

启动 ：
pm2 list
┌────────┬────┬───────┬────────┬────────┬─────┬────────┬───────────┐
│ Name   │ id │ mode  │ status │ ↺      │ cpu │ memory │
├────────┼────┼───────┼────────┼────────┼─────┼────────┼───────────┤
│ server │ 0  │ 0.1.0 │ fork   │ online │ 0   │ 0.2%   │ 25.3 MB   │
└────────┴────┴───────┴────────┴────────┴─────┴────────┴───────────┘

本地服务：

fis3 release -wL 


 [INFO] Currently running fis3 (/usr/local/lib/node_modules/fis3/)

 Ω ....... 20ms
 Ψ 8132

 - [17:26:50] app.js >> /home/work/linshi/fis3test/app_1548e74.js
 - [17:26:50] img/list-1.png >> /home/work/linshi/fis3test/static/img/list-1.png
 - [17:26:50] img/list-2.png >> /home/work/linshi/fis3test/static/img/list-2.png
 - [17:26:50] img/logo.png >> /home/work/linshi/fis3test/static/img/logo.png
 - [17:26:50] index.html >> /home/work/linshi/fis3test/index.html
 - [17:26:50] readme.md >> /home/work/linshi/fis3test/readme.md
 - [17:26:50] style.css >> /home/work/linshi/fis3test/style.css [17:26:50.345]

```


### 使用babel编译es6

```
安装：
npm install -g fis-parser-babel

配置：
fis.match('*.js', {
    useHash: true,
    parser: fis.plugin('babel'),
    optimizer: fis.plugin('uglify-js')
});
```

### 编译less文件

```
npm install -g fis-parser-less


fis.match('*.less', {
    // fis-parser-less 插件进行解析
    parser: fis.plugin('less'),
    // .less 文件后缀构建后被改成 .css 文件
    rExt: '.css'
})


```

### 插件使用

fis3的插件<a href="http://fis.baidu.com/fis3/docs/api/config-system-plugin.html">内置插件列表</a>

包含经常用到的压缩，转义，编码，部署，发布，打包。

自定义插件：全部发布在npm上。可以直接发布安装使用。

### 模块化支持

```
fis3-hook-commonjs
fis3-hook-amd
fis3-hook-cmd
```
