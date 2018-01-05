var accountMessage = function() {
	this.rows = 10;
	return this;
}
accountMessage.prototype =  {
	init: function() {
		this.pageInit();
	},
	pageInit:function(){
		var _this = this;
		_this.getInfomationType();
	},
	getInfomationType:function(){
		var _this = this; 
		//加载资讯分类
		GHutils.load({
			url: GHutils.API.CMS.infromationtype,
			data: {},
			type: "post",
			async: false,
			callback: function(result) {
				GHutils.log(result,"资讯分类==========")
				var nameList = "";
				var idxs=[]
				GHutils.forEach(result,function(idx,info){
					idxs.push({"tabIndex":idx})
					nameList += '<a data-type="'+info.name+'" data-index="'+idx+'" class="tab_nav" href="javascript:void(0);">'+info.name+'</a>';	
				})
				$('#tab_nav').html(nameList);
				GHutils.mustcache("#newList-tab","#newTabs",{"typeTab":idxs});
				GHutils.forEach(result,function(idx,info){
					_this.getInformationByType(idx,info.name,1,true);
				})
				_this.bindEvent();
				$('#tab_nav').find('a').eq(0).trigger('click')
			}
		});
	},
	getInformationByType: function(tabIndex,type,page,isFlag) {
			var _this = this;
			GHutils.load({
				url: GHutils.API.CMS.getinformations + "?type=" +encodeURIComponent(type) + "&status=published" + "&page=" +page+"&rows="+_this.rows  + "&channelOid="+cmsChannelOid,
				data: {},
				type: "post",
				async: true,
				sw: true,
				callback: function(result){
					GHutils.log(result,"type==================")
					if(result && result.errorCode == 0){
						GHutils.mustcache("#newList-template","#type_"+tabIndex,result);
						_this.bindEvent();
						if(result.total > 0){
							if(isFlag){
								_this.createPage(tabIndex,type,Math.ceil(result.total/_this.rows));
							}
						}else{
							$("#noReCord_"+tabIndex).show()
						}
					}
				}

			});
	},
	bindEvent:function(){
		var _this = this;
		//资讯类型
		$('#tab_nav').find('a').off().on('click',function(){
			if($(this).hasClass('active')){
				return false;
			}
			$(this).addClass('active').siblings().removeClass('active');
			var _type = $(this).attr('data-type');
			$('.card_font').html(_type);
			var tabIndex = $(this).attr('data-index')
			$(".tab_content_box").hide()
			$('#type_'+tabIndex).parent().show()
		})
		
		$(".new-detail").off().on('click',function(){
			var temp = $(this).attr('data-linkUrl')
			if(temp){
				$(this).attr("target","_blank").attr('href',temp)
			}else{
				temp= $(this).attr('data-title')
				$('#new-title').html(temp)
				temp = $(this).attr('data-content')
				$('#new-content').html(temp)
				temp = $(this).attr('data-time')
				$("#new-pushtime").html("发布于 "+temp)
				$("#new-detail").show().prev().hide()
			}
		})
		
		$("#newlist-back-button").off().on('click',function(){
			$("#new-detail").hide().prev().show()
		})
		
		
		
	},
	createPage: function(tabIndex,type,pageCount) {
		var _this = this;
		GHutils.log(pageCount,"总页数===")
		if(pageCount <= 1 ){
			$(".page_"+tabIndex).hide()
			return 
		}
		$(".page_"+tabIndex).show().createPage({
			pageCount: pageCount,
			current: 1,
			backFn: function(page) {
				_this.getInformationByType(tabIndex,type,page,false);
			}
		});
	},
}
$(function() {
	new accountMessage().init();
})


