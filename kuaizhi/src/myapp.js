//组件间监听事件
var EventEmitter = {
    _events: {},
    dispatch: function (event, data) {
        if (!this._events[event]) return;
        for (var i = 0; i < this._events[event].length; i++)
            this._events[event][i](data);
    },
    subscribe: function (event, callback) {
      if (!this._events[event]) this._events[event] = [];
      this._events[event].push(callback);
    },
    unSubscribe: function(event){
	    if(this._events && this._events[event]) {
	    	delete this._events[event];
	    }
    }
}
//获取元素位置
Array.prototype.indexOf = function(val) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == val) return i;
	}
	return -1;
};
function remove(array,index){
	for(var i = 0; i < array.length; i++){
		if(array[i]&&array[i].id==index){
			delete array[i];
		}
	}
	return array;
}


var pageNow=1;
var dateNow="";
var id=0;
var kzurl="http://api.kuaizhi.imgrids.com/api/index/";
//头部导航菜单
var Topmenu=React.createClass({
	getInitialState: function() {
      return {
        menus: [{'title':'体育','id':20},{'title':'时事','id':50}]
      };
    },
    componentDidMount: function() {
    	var m=this;
      	$.ajax({
			url:kzurl+"article_obj.html?callback=?",
			type:'get',
			dataType:'jsonp',
			success:function(data){
				if (m.isMounted()) {
					m.setState({menus:data});
				}
			},
			error:function(){
				console.log("连接失败");
			}
		});
    },
	handleClickBack: function(event) {
		$(event.target).addClass("mymenu-active").siblings().removeClass("mymenu-active");
		$("#mymenuheader").text($(event.target).text());
		id=event.target.id;
		pageNow=1;
		
		EventEmitter.dispatch('changeItem',new Date().getTime());
		
	},
	render: function() {
		var s = this.state.menus;
		var self=this;
		return ( 
			<ul className='mymenu'>
			    <li className='mymenu-active' onClick={self.handleClickBack}>最新</li>
			    {s.map(function(result,k) {
			        return <li id={result.id} onClick={self.handleClickBack}>{result.title}</li>
				})}
			    <li id="520" onClick={self.handleClickBack}>剪报</li>
			</ul>
		);
	}
});


//信息列表
var Cardlist=React.createClass({
	getInitialState: function() {
	    return {
	        cards: [{
	        	'id':"1",
				'title':"正在努力加载",
				'obj':"1",
				'content':"正在努力加载中",
				'istop':"0",
				'objname':'--',
				'created':"2016-04-13 16:43:13"
			}]
	    };
    },
    componentDidMount: function() {
    	var m=this;
    	EventEmitter.subscribe('changeItem', function(newItem){
			m.setState({
			 	curItem:newItem
			});
			//id=newItem;
			if(id==520){//跳转到剪报
				React.render(<Likelist />,
					document.getElementById('cardlists')
				);
			}else{
				$.ajax({
					url:m.props.source,
					type:'get',
					data:{id:id,date:dateNow},
					dataType:'jsonp',
					success:function(data){
						if (m.isMounted()) {
							m.setState({cards:data});
						}
					},
					error:function(){
						console.log("连接失败");
					}
				});
			}
		});
      	$.ajax({
			url:m.props.source,
			type:'get',
			data:{id:id,date:dateNow},
			dataType:'jsonp',
			success:function(data){
				if (m.isMounted()) {
					m.setState({cards:data});
				}
			},
			error:function(){
				console.log("连接失败");
			}
		});
    },
    componentDidUpdate:function(prevProps,prevState){
    	checklike();
    },
    likedcallback:function(event){
    	var data=this.state.cards;
    	
    	if($(event.target).hasClass("myicon")){
    		
    		$(event.target).removeClass("myicon");
    		var unlike_id=$(event.target).parents(".mycard").attr("data-id");
    		checkstore(data,unlike_id,1);
    		
    	}else{//加入收藏
  
    		$(event.target).addClass("myicon");
    		var like_id=$(event.target).parents(".mycard").attr("data-id");
	    	checkstore(data,like_id,0);
    	}
    },
    removedcallback:function(event){
    	
    	var m=this;
    	var d=this.state.cards;
    	var p=$(event.target).parents(".mycard");
    	
    	p.animate({height:0,opacity:0},{
            duration:1000,
            easing:"easeOutBounce",
            complete:function (){

                d=remove(d,p.attr("data-id"));
                
                m.setState({cards:d});
                     
                p.remove();       
                pageNow=pageNow+1;
                
        		$.ajax({
					url:m.props.source,
					type:'get',
					data:{id:id,page:pageNow,date:dateNow},
					dataType:'jsonp',
					success:function(data){
						if(data.length>0){

							d[d.length]=data[0];
							
							if (m.isMounted()) {
								m.setState({cards:d});
							}
						}
					},
					error:function(){
						console.log("连接失败");
					}
				});
            }
        }); 
    },
	render: function() {
		var q = this.state.cards;
		var self=this;
		return (
			<ul>
			{q.map(function (result,k) {  
				return  <li data-id={result.id} className="mui-card mycard">
							<div className="mui-collapse-content mui-text-right">
								<span className="mui-spinner mui-pull-left likebtn" onClick={self.likedcallback}></span>
								<span className="mui-icon mui-icon-close" onClick={self.removedcallback}></span>
							</div>
							<div className="mui-collapse-content mycard-text">
								<p>{result.content}</p>
							</div>
							<div className="mui-collapse-content mycard-date">
								<h5><span className="mui-badge mui-badge-primary">{result.objname}</span>&nbsp;&nbsp;<span>{result.created}</span></h5>
							</div>
						</li>
			})}
			</ul>
		);
	}
});

//收藏列表
var Likelist=React.createClass({
	getInitialState: function() {
	    return {
	        cards: [{
	        	'id':"1",
				'title':"正在努力加载",
				'obj':"1",
				'content':"正在努力加载中",
				'istop':"0",
				'objname':'--',
				'created':"2016-04-13 16:43:13"
			}]
	    };
    },
    componentDidMount: function() {
     	var m=this;

    	EventEmitter.subscribe('changeItem', function(newItem){
			m.setState({
			 	curItem:newItem
			});
			//id=newItem;
			if(id==520){//跳转到剪报
			
			}else{
				React.render(<Cardlist source='http://api.kuaizhi.imgrids.com/api/index/article_list.html?callback=?' />,
					document.getElementById('cardlists')
				);
			}
		});
		
    	var d=null;
        if(store.get("like_data")&&store.get("like_data").length>0){
        	d=JSON.parse(store.get("like_data"));
        }else{
        	d=JSON.parse('[]');
        }
    	if (m.isMounted()) {
			m.setState({cards:d});
		}
    },
    componentDidUpdate:function(prevProps,prevState){
    	//checklike();
    },
    likedcallback:function(event){
    	var data=this.state.cards;
    	
    	if($(event.target).hasClass("myicon")){
    		$(event.target).removeClass("myicon");
    		var unlike_id=$(event.target).parents(".mycard").attr("data-id");
    		checkstore(data,unlike_id,1);
    		this.removedcallback(event);
    	}
    },
    removedcallback:function(event){
    	
    	var m=this;
    	var d=this.state.cards;
    	var p=$(event.target).parents(".mycard");
    	
    	p.animate({height:0,opacity:0},{
            duration:1000,
            easing:"easeOutBounce",
            complete:function (){

                d=remove(d,p.attr("data-id"));
                m.setState({cards:d});

                p.remove();       
            }
        }); 
    },
	render: function() {
		var q = this.state.cards;
		var self=this;
		return (
			<ul>
			{q.map(function (result,k) {  
				return  <li data-id={result.id} className="mui-card mycard">
							<div className="mui-collapse-content mui-text-right">
								<span className="mui-icon mui-icon-star-filled myicon  likebtn" onClick={self.likedcallback}></span>
							</div>
							<div className="mui-collapse-content mycard-text">
								<p>{result.content}</p>
							</div>
							<div className="mui-collapse-content mycard-date">
								<h5><span className="mui-badge mui-badge-primary">{result.objname}</span>&nbsp;&nbsp;<span>{result.created}</span></h5>
							</div>
						</li>
			})}
			</ul>
		);
	}
});

//日期选择
var Datemenu=React.createClass({
	getInitialState: function() {
      return {
        menus: [{'content':'2016-05-16 星期一'},{'content':'农历四月初十'}]
      };
    },
    componentDidMount: function() {
    	var m=this;
      	$.ajax({
			url:kzurl+"date_list.html?callback=?",
			type:'get',
			data:{date:dateNow},
			dataType:'jsonp',
			success:function(data){
				if(data.length>0){
					if (m.isMounted()) {
					    m.setState({menus:data});
				    }
				}else{
					var myDate = new Date();
					var d=myDate.getFullYear()+"-"+(myDate.getMonth()+1)+"-"+myDate.getDate();
					if (m.isMounted()) {
					    m.setState({menus:[{'content':d}]});
				    }
				}
			},
			error:function(){
				console.log("连接失败");
			}
		});
    },
	handleClickBack: function(event) {//日期选择
		var m=this;
		
		plus.nativeUI.pickDate( function(e){
			var d=e.date;
			dateNow=d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
			//console.log( "选择的日期："+d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate());
			EventEmitter.dispatch('changeItem',new Date().getTime());
			$.ajax({
				url:kzurl+"date_list.html?callback=?",
				type:'get',
				data:{date:dateNow},
				dataType:'jsonp',
				success:function(data){
					if(data.length>0){
						if (m.isMounted()) {
						    m.setState({menus:data});
					    }
					}else{
						if (m.isMounted()) {
						    m.setState({menus:[{'content':dateNow}]});
					    }
					}
				},
				error:function(){
					console.log("连接失败");
				}
			});
		});
	},
	render: function() {
		var s = this.state.menus;
		var self=this;
		return ( 
			<div className="mui-slider">
				<div className="mui-slider-group">
				   {s.map(function(result,k) {
				    return <div className="mui-slider-item datenote" onClick={self.handleClickBack}>
				           &nbsp;&nbsp;{result.content}
				           </div>
				    })}
				</div>
			</div>
		);
	}
});

//检查是否已经收藏
function checklike(){
	var str=store.get("like_ids");
	var str_arr=null;
	if(!str){
		str="";
	}else{
		str_arr=$.makeArray(JSON.parse(str));
	}	
    $("li.mycard").each(function(){
        var mid=$(this).attr("data-id");
        var p=$(this).find(".likebtn");
        if(str_arr && str_arr.indexOf(mid) > -1){
        	p.removeClass().addClass("mui-icon mui-icon-star-filled myicon mui-pull-left likebtn").removeClass("mui-spinner");
        }else{
        	p.removeClass().addClass("mui-icon mui-icon-star-filled mui-pull-left likebtn").removeClass("mui-spinner");
        }
    });
}

//本地存储
function checkstore(data,sid,is_del){
	
	if(is_del==1){//删除数据
		var str=store.get("like_ids");
		var str_arr=JSON.parse(str);
		str_arr=$.makeArray(str_arr);
        var q,p;
		for(var i=0;i<str_arr.length;i++){
			if(str_arr[i]==sid){
				q=str_arr.slice(0,i);
				p=str_arr.slice(i+1);
			}
		}
        str_arr=q.concat(p);
        if(str_arr.length==0){
			str_arr=null;
			store.set("like_ids","");
		}else{
			store.set("like_ids",JSON.stringify(str_arr));
		}
	
		var like_data=null;
		var n=JSON.parse(store.get("like_data"));
		var q,p;
		for(var i=0;i<n.length;i++){
			if(n[i] && n[i].id==sid){
				q=n.slice(0,i);
				p=n.slice(i+1);
			}
		}
		like_data=q.concat(p);
		if(like_data.length==0){
			like_data=null;
			store.set("like_data","");
		}else{
			store.set("like_data",JSON.stringify(like_data));
		}

	}else{//存储数据
		
		var like_id=sid;
    	if(store.get("like_ids")){
    	    var n=JSON.parse(store.get("like_ids"));
	        n=$.makeArray(n);
	        n[n.length]=parseInt(like_id);
    		store.set("like_ids",JSON.stringify(n));
    		
    	}else{
    		store.set("like_ids",like_id);
    	}
		var like_data=null;
		for(var i=0;i<data.length;i++){
			if(data[i]&&data[i].id==sid){
				like_data=$.makeArray(data[i]);
			}
		}
		
		var like_storage=null;
		
		if(store.get("like_data")){
			var n=JSON.parse(store.get("like_data"));
			n=$.makeArray(n);
			n[n.length]=like_data[0];
			like_storage=JSON.stringify(n);
		}else{
			like_storage=JSON.stringify(like_data);
		}
		store.set("like_data",like_storage);
	}
}

React.render(<Topmenu source="http://api.kuaizhi.imgrids.com/api/index/article_list.html?callback=?" />,
	document.getElementById('mymenu')
);
React.render(<Cardlist source='http://api.kuaizhi.imgrids.com/api/index/article_list.html?callback=?' />,
	document.getElementById('cardlists')
);
React.render(<Datemenu />,
	document.getElementById('datenow')
);
