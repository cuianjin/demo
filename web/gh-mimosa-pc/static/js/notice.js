var Notice = function() {
	return this;
}

Notice.prototype =  {
	init: function() {
		this.pageInit();  
	},
	pageInit:function(page){
		var _this = this ;
		_this.getData(1,true);
	},
	//分页数据
	getData:function(page,isFlag){
		var _this = this;
		GHutils.load({
            url: GHutils.API.CMS.getnotices+'?channelOid='+cmsChannelOid+'&page='+page+'&rows=10',
            data: {},
            type: "post",
            callback: function (result) {
                if (result.errorCode != 0) {
                    return false;
                }
                GHutils.log(result,"========");
                var rows = [];
                GHutils.forEach(result.rows,function(idx,item){
                	if(item.subscript == "无"){
                		item.subscript = ''
                	}
                	rows.push(item)
                })
                result.rows = rows;
				GHutils.mustcache("#notice-template","#notice",result);
				_this.bindEvent()
               if(isFlag && result.total >0){
					_this.createPage(Math.ceil(result.total/10));
				}
			}
		})
	},
	bindEvent:function(){
//		$('#notice li').find(".message-detail").off().on("click",function(){
//			if ($(this).find("a").hasClass("linkhtml")) {
//				var html = $(this).find("a").attr("data-linkhtml");
//				$("#notice-list").hide();
//				$("#notice-contentnr").fadeIn(300);
//				$(".notice-nr").html(decodeURIComponent(html))
//			} else{
//				$("#notice-contentnr").hide();
//				$("#notice-list").fadeIn(300);
//			}
//		});
//		
//		$(".notice-back").click(function(){
//			$("#notice-list").fadeIn(300);
//			$("#notice-contentnr").hide();
//		});

		$('#notice li').find(".message_title").off().on("click",function(){
			var linkUrl = $(this).attr("data-linkUrl")
			if(linkUrl){
				$(this).find('a').attr('href',linkUrl)
			}else{
				$("#title").html($(this).attr('data-title'))
				$("#content").html($(this).attr('data-linkHtml'))
				$("#content-box").modal('show')
				
			}
			
		})
	},
	createPage: function(pageCount) {
		var _this = this;
		if(pageCount <= 1){
			$(".gh_tcdPageCode").hide()
			return
		}
		$(".gh_tcdPageCode").show().createPage({
			pageCount: pageCount,
			current: 1,
			backFn: function(page) {
				_this.getData(page);
			}
		});
	}
}
	
$(function() {
	new Notice().init();
})





