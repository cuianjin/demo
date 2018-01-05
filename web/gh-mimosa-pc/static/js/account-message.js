var accountMessage = function() {
	return this;
}

accountMessage.prototype =  {
	init: function() {
		this.bindEvent();
		GHutils.isLogin();
		this.getData(1,true,"activity");
		this.getData(1,true,"notice");
		this.getAllMail(1,true);
	},
	bindEvent:function(){
		var _this = this;
		$("#myTab li a").off().on('click',function(){
			$("#messageMark").hide()
			if($(this).parent().attr('data-pane') == "#sitenews"){
				$("#messageMark").show();
			}
		})
		
		$.tab();
//		//推送
//		$(".push .message-detail").off().on("click",function(){
//			$(this).parent().hide().next().fadeIn(200)
//		});
		
		$("#mailBox .message-detail").off().on("click",function(){
			$(this).parent().hide().next().fadeIn(200)
			$(this).closest('li').find('.noread-icon').removeClass('noread-icon')
			if($(this).attr('data-isRead')=="no"){
				var oid = $(this).attr('data-oid')
				$(this).attr('data-isRead','is')
				_this.getMailDetail(oid)
			}
		})
		
		$("#mailBox .message-nodetail").off().on("click",function(){
			$(this).parent().hide().prev().show()
		})
		
		$("#messageMark").off().on("click",function(){
			if($(this).hasClass('active')){
				return false;
			}
			$(this).addClass("active")
			_this.mailAllread();
		});
		
		
	},
	//分页数据
	getData:function(page,isFlag,type){
		var _this = this;	
		GHutils.load({
            url: GHutils.API.CMS.pushQuer+'?page='+page+'&rows=10&type='+type+'&&status=on',
            data: {},
            type: "post",
            callback: function (result) {
            	GHutils.log(result,type+"=========")
            	var msgs= [];
				$("#"+type+'Num').html(result.total)
				var data = {"msg":result.rows}
				data[type]=type;
				GHutils.mustcache("#message-template","#"+type+"Box",data)
				_this.bindEvent();
				if(result.rows.length == 0){
					$('#'+type+'-noRecord').show()
					return 
				}
				if(isFlag){
					_this.createPage(Math.ceil(result.total/10),type,function(page,isFlag,type){_this.getData(page,isFlag,type)});
				}
			}
		})
	},
	getAllMail:function(page,isFlag){//获取所有的站内信
		var _this = this;
		GHutils.load({
			url:GHutils.API.CMS.messageQueryPage+'?page='+page+'&rows=10',
			type:'post',
			callback:function(result){
				GHutils.log(result,"所有的站内信========")
				$("#sitenewsNum").html(result.total)
				var mails = []
				GHutils.forEach(result.rows,function(idx,mail){
					var mesContent = mail.mesContent;
					if(mesContent.length > 50){
						mesContent = mesContent.substr(0,50)+"……"
					}
					mail[(mail.isRead)] = mail.isRead;
					mail["partMesContent"]= mesContent;
					mails.push(mail)
				})
				GHutils.mustcache("#mail-template","#mailBox",{"mail":mails})
				_this.bindEvent();
				if(result.rows.length == 0){
					$('#mail-noRecord').show()
					return 
				}
				if(isFlag){
					_this.createPage(Math.ceil(result.total/10),"mail",function(page,isFlag){_this.getAllMail(page,isFlag)});
				}
			}
		})
	},
	mailAllread: function(){//标记全部已读
		var _this = this;
		GHutils.load({
			url: GHutils.API.CMS.messageAllread,
			data: {},
			type: "post",
			callback: function(result){
				GHutils.log(result,"标记全部已读=======")
				$(".noread-icon").removeClass("noread-icon")
			}
		})
	},
	getMailDetail: function(mailOid){//阅读站内信
		var _this = this;
		GHutils.load({
			url: GHutils.API.CMS.messageDetails+'?mailOid='+mailOid,
			data: {},
			type: "post",
			callback: function(result){
			}
		})
	},
	createPage: function(pageCount,type,func) {
		var _this = this;
		if(pageCount <= 1){
			$("."+type+"_page").hide()
			return ;
		}
		
		$("."+type+"_page").show().createPage({
			pageCount: pageCount,
			current: 1,
			backFn: function(page) {
				func.apply(null,[page,false,type]);
			}
		});
	}
}

$(function() {
	new accountMessage().init();
})


