// fis.match('::packager', {
//   spriter: fis.plugin('csssprites')
// });

fis.match('*', {
//   useHash: true
});

fis.match('*.js', {
    useHash: true,
    parser: fis.plugin('babel'),
    optimizer: fis.plugin('uglify-js')
});

fis.match('*.css', {
  useSprite: true,
  optimizer: fis.plugin('clean-css')
});

// 配置配置文件，注意，清空所有的配置，只留下以下代码即可。
fis.match('*.png', {
    release: '/static/$0'
});

// fis.match('*.png', {
//   optimizer: fis.plugin('png-compressor')
// });

fis.match('*', {
    deploy: fis.plugin('http-push', {
        receiver: 'http://47.94.10.18:8999/receiver',
        to: '/home/work/linshi/fis3test' // 注意这个是指的是测试机器的路径，而非本地机器
    }),
    // deploy: fis.plugin('local-deliver', {
    //     to: '/Users/siwenyu/Desktop/临时代码存放/fis3outtest'
    // })
})

fis.match('*.js', {
    packTo: '/static/aa.js'
});

fis.match('::package', {
    postpackager: fis.plugin('loader', {
      allInOne: true
    })
});