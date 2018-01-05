var Mynotice = function() {
	return this;
	
}

Mynotice.prototype =  {
	init: function() {
		this.bindEvent();	
		this.pageInit();
	},
	pageInit:function(){
		var type =GHutils.getHash()
		var len = $("#notice-tab ").find(".tab_nav[data-type = '"+type+"']").length
		if(len > 0){
			len = $("[data-type = '"+type+"']").index()
		}else{
			len = 0
		}
		$("#notice-tab").find(".tab_nav").eq(len).trigger("click")
	},
	
	
	
	//分页数据
	getData:function(type,page,idx,isFlag){
		var _this = this;	
		GHutils.load({
            url: GHutils.API.CMS.getinformations+'?type='+ type +'&status=published&page='+page+'&rows=10&channelOid='+cmsChannelOid,
            data: {},
            type: "post",
            callback: function (result) {
  				var tds = ' ';
				GHutils.forEach(result.rows,function(idx,information){
					tds+='<li class=" " data-url="'
						+ information.url +'" data-content="'
						+ encodeURIComponent(information.content) +'" data-title="'+ information.title +'" ><table><tr><td class="tcell_1"><span class="mynoticeCircle"></span></td><td class="tcell_2 pop_title">'
						+ information.title +'</td><td class="tcell_3 pop_content">'
						+ information.summary +'</td><td class="tcell_4">'+information.publishTime+'</td></tr></table></li>'
				})
				if(result.rows.length == 0){
					tds = '<img src="static/images/app-nodata1.png" class="dataTipsImg"/>'
				}
				$(".noticetable_"+idx).html(tds);
				$(".tab_nav").eq(idx).removeClass("dataLoaded")
				_this.bindEvent();
            	if(isFlag){
					_this.createPage(Math.ceil(result.total/10),type,idx);
				}
			}
		})
	},
	bindEvent:function(){
		//tab切换
		var _this = this;
		
		$(".tab_nav").on("click",function(){
			var type = $(this).attr("data-type");
			var alodade = $(this).attr("data-loaded");
			
			var idx = $(this).index();
			$(".public-content-box").show();
			$(".information-box").hide();
			
			
			if($(this).hasClass("active")){
				return
			}
			$(".tab_nav").siblings().removeClass("active");
			$(this).addClass("active");
			$(".tab_content_box").hide()
			GHutils.changeHash(type)
			if ($(this).hasClass("dataLoaded")) {
				var divhtml='<div class="tab_content_box"><div class="mynoticeHead clearfix"><span class="mynotice_l">'
					          +type+'</span></div><ul class="clearfix mynoticetable noticetable_'+idx+'"><div class="list_tips"></div></ul><div class="gh_tcdPageCode" id="contPages_'
					          + idx +'"></div></div>'
				$(".public-content-box").append(divhtml)
				_this.getData(type,1,idx,true);
			}
			$('.noticetable_'+idx).parent().fadeIn(300);
		})
		
		
		
		$(".public-content-box").find("li").off().on("click",function(){
			if ($(this).attr("data-url").length==0) {
				var html = $(this).attr("data-content");
				var title = $(this).attr("data-title");
		        $("#content_box").modal("show");	
		        $("#modal_title").html(title);
				$("#modal_content").html(decodeURIComponent(html))
				
			} else{
				
				window.open($(this).attr("data-url"));
			}
		});
		
		
		
		
		$(".notice-back").on("click",function(){
			$(".public-content-box").show();
			$(".information-box").hide();
		});

	},
	createPage: function(pageCount,type,idx) {
		var _this = this;
		if(pageCount <= 1){
			$("#contPages_" + idx).hide()
			return 
		}
		$("#contPages_"+idx).show().createPage({
			pageCount: pageCount,
			current: 1,
			backFn: function(page) {
				_this.getData(type,page,idx);
			}
		});
	}
}

$(function() {
	new Mynotice().init();
})


