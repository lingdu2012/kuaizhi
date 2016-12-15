 mui.init();
    
function showToast(){
	plus.nativeUI.toast("直达新闻，快知天下！",{duration:"long"});
}
function checkVersion(){
	var ov=plus.runtime.version;
	$.ajax({
		url:"http://api.kuaizhi.imgrids.com/api/index/version.html?callback=?",
		type:'get',
		dataType:'jsonp',
		success:function(data){
			if(data.length>0){
				var nv=data['version'];
				var ov2=vo.replace(".","");
				var nv2=nv.replace(".","");
				if(nv2>ov2){
					updateApp(data['url']);
				}
			}
		},
		error:function(){
			plus.nativeUI.toast("请检查网络连接！",{duration:"long"});
		}
	});
}
function updateApp(url){
	plus.nativeUI.showWaiting("升级中...");
	var dtask = plus.downloader.createDownload( url, {method:"GET"}, function(d,status){
		if ( status == 200 ) { 
			plus.runtime.install(d.filename,{},function(){
				plus.nativeUI.closeWaiting();
				plus.nativeUI.alert("升级成功，正在重启!",function(){
					plus.runtime.restart();
				});
			},function(e){
				plus.nativeUI.closeWaiting();
				alert("升级失败: "+e.message);
			});
		} else {
			plus.nativeUI.closeWaiting();
			 alert( "下载失败: " + status ); 
		} 
	} );
	dtask.addEventListener('statechanged',function(d,status){
		console.log("statechanged: "+d.state);
	});
	dtask.start();
}
mui.plusReady(function() {
	checkVersion();
	plus.key.addEventListener('backbutton',function(){
		if(confirm('亲，今天发生的就是这些事情了！')){
			plus.runtime.quit();
		}
	},false);
});