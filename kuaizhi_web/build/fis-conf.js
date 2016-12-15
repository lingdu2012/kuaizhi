fis.media('prod')
.match('::package', {
    postpackager: fis.plugin('loader',{
    	allInOne: true
    })
})
.match('jquery-2.2.3.js', {
	useHash: false,
    optimizer: fis.plugin('uglify-js'),
    packTo: 'jquery.min.js',
    packOrder:0
})
.match('jquery.easing.1.3.js', {
	useHash: false,
    optimizer: fis.plugin('uglify-js'),
    packTo: 'jquery.min.js',
    packOrder:1
})
.match('store_json2.min.js', {
	useHash: false,
	optimizer: fis.plugin('uglify-js'),
    packTo: 'jquery.min.js',
    packOrder:2
})
.match('mui.js', {
	useHash: false,
	optimizer: fis.plugin('uglify-js'),
    packTo: 'jquery.min.js',
    packOrder:3
})
.match('mui.picker.js', {
	useHash: false,
	optimizer: fis.plugin('uglify-js'),
    packTo: 'jquery.min.js',
    packOrder:4
})
.match('myaps.js', {
	useHash: false,
	optimizer: fis.plugin('uglify-js'),
    packTo: 'jquery.min.js',
    packOrder:5
})
.match('myapp.js', {
	useHash: false,
	optimizer: fis.plugin('uglify-js'),
    packTo: 'myapp.min.js',
    packOrder:6
});


fis.match('**', {
  deploy: [
    fis.plugin('skip-packed', {
      // 配置项
        skipPackedToPkg:true
    }),
    fis.plugin('local-deliver', {
      to: '../js'
    })
  ]
});

fis.set('project.ignore', [
  'fis-conf.js',
  'JSXTransformer.js'
]);

fis.config.set('settings.optimizer.uglify-js', {
    mangle: {
      
    }
});
fis.config.set('settings.optimizer.uglify-js', {
    compress: {
      drop_console: true
    }
});
