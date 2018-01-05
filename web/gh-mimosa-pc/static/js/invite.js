var Invite=function(){
	return this;
}
Invite.prototype={
	init:function(){
		this.pageInit();
		this.loadMore();
	},
	pageInit:function(){
		var _this = this;
		_this.getRule();
		_this.getEventInfo();
		GHutils.isLogin(function(){
			$("#myInvite").removeClass("gh_none").prev().addClass("gh_none")
			_this.getInviteUrl();
			_this.getMyInvites(1,false);
			$("#copyLink").prev().addClass("gh_none")
		},function(){
			$("#myInvite").addClass("gh_none").prev().removeClass("gh_none")
			$("#copyLink").addClass('gh_none').prev().removeClass("gh_none")
		});
		_this.getInvivateDate();
	},
	getRule:function(){
		GHutils.load({
			url:GHutils.API.ACCOUNT.getActRuleInfo+'?typeId=INVITE',
			type:'post',
			callback:function(result){
				$("#rule").html(result.content)
			}
		})
	},

	getEventInfo:function(){
		GHutils.load({
			url:GHutils.API.ACCOUNT.getEventInfo,
			data:{
				eventType: "friend",
				couponType: "coupon"
			},
			type:'post',
			callback:function(result){
				if(result.errorCode == 0){
					$("#invitiveMoneyBox").show()
					$("#invitiveMoney").html(result.money)
				}
			}
		})
	},
	getInviteUrl:function () {
		var _this = this;
        GHutils.load({
            url: GHutils.API.CMS.getshareconfig+"?pageCode=invite",
            data: {},
            type: "post",
            callback: function(result) {
                if(result.errorCode != 0){
					$("#noData").removeClass("gh_none")
                    return false;
                }
                $("#copyLink").removeClass('gh_none')
                if(!GHutils.userinfo){
                    GHutils.userinfo = GHutils.getUserInfo();
				}
				var _href = "";
                if(result.shareUrl.indexOf('?') > -1) {
                    _href = result.shareUrl + '&inviteCode=' + result.sceneid + "&telnum=" + GHutils.userinfo.userAcc
                } else {
                    _href = result.shareUrl + '?inviteCode=' +result.sceneid+ "&telnum=" + GHutils.userinfo.userAcc
                }
                $('#copyBtn').attr('data-clipboard-text',_href).prev().html(_href)
                _this.bindEvent();
            }
        })
    },
	// getUserInfo:function(){
	// 	var _this = this;
	// 	// 获取用户信息  生成邀请二维码
	// 	GHutils.load({
	// 		url: GHutils.API.ACCOUNT.userinfo,
	// 		data: {},
	// 		type: "post",
	// 		callback: function(result) {
	// 			if(result.errorCode != 0){
	// 				return false;
	// 			}
	// 			var invitUrl = h5Url+'/share/register.html?inviteCode='+result.sceneid+'&telnum='+result.userAcc;
	// 			$('#copyBtn').attr('data-clipboard-text',invitUrl).prev().html(invitUrl)
	// 			_this.bindEvent();
	// 		}
	// 	})
	// },
	bindEvent:function(){
		var _this = this;
		var clipboard = new Clipboard('#copyBtn');
		clipboard.on('success', function(e) {
			alert("复制成功")
		    e.clearSelection();
		});
		clipboard.on('error', function(e) {
			alert("您使用的浏览器不支持此复制功能，请使用Ctrl+C或鼠标右键。")
		    console.error('Action:', e.action);
		    console.error('Trigger:', e.trigger);
		});
	},
	getMyInvites:function(page,isAppend){
		var _this = this;	
			page = Number(page)
			GHutils.load({
                url: GHutils.API.ACCOUNT.getmyinvites+'?page='+page+'&rows=10',
                data: {},
                type: "post",
                callback: function (result) {
                	var _data= []
                	if(page == 1 && result.errorCode != 0 ){
                		$("#myInvite").html('<div class="gh_tcenter gh_mt35">暂无数据</div>');
                	}else if(result.errorCode == 0){
                		if(page != 1){
                			$("#myInvite").css('overflow-y',"auto")
                		}else{
                			$("#myInvite").css('overflow-y',"hidden")
                		}
                		GHutils.mustcache("#invite-template","#myInvite",{"invites":(_this.parseData(result,'myInvite',page))},isAppend);
                		if(GHutils.Fsub(result.total,GHutils.Fmul(page,10)) > 0){
                			$("#myInvite").attr('data-page',(page+1)).attr('data-more','yes')
                		}else{
                			$("#myInvite").removeAttr("data-page").removeAttr("data-more");         //attr('data-page',(page+1)).attr('data-more',true)
                		}
                	}
				}
			})
	},
	//邀请排行榜
	getInvivateDate:function(){
		var _this = this;
		GHutils.load({
			url:GHutils.API.ACCOUNT.invitecharts,
			data:{},
			type:'post',
			callback:function(result){
				if(result.errorCode !=0 ){
					$("#topInvite").html('<div class="gh_tcenter gh_mt35">暂无数据</div>');
				}else{
					GHutils.mustcache("#invite-template","#topInvite",{"invites":(_this.parseData(result.rows,"top",1))});
				}
			},
			errcallback:function(){
				
			}
		})
		
	},
	parseData:function(data,dataType,page){
		var _this = this;
		var  invites = [];
		GHutils.forEach(data,function(idx,item){
			item["idx"] = (page - 1) *10 + idx +1;
			item.realName = item.realName || "--"
			item[dataType]=dataType
			item["phone"]=item.phone || item.phoneNum || "--"
			invites.push(item);
		})
		if(invites.length  == 0){
			invites = null;
		}
		return invites;
	},
	loadMore:function(){
		var _this = this;
		$("#myInvite").unbind("scroll").bind("scroll", function(e){  
	        var sum = this.scrollHeight;
	        var page = $(this).attr('data-page');
	        var more = $(this).attr('data-more');
	        if(more == "yes" && sum <= $(this).scrollTop() + $(this).height()){
	        	_this.getMyInvites(page,true)
	        }
	    }).on('mouseover',function(){
	    	 var page = $(this).attr('data-page');
	    	var more = $(this).attr('data-more');
	    	if(page == "2" && more == "yes"){
	    		_this.getMyInvites(page,true);
	    	}
	    }).on('mouseout',function(){
	    	
	    });
	}
}

$(function(){
	new Invite().init();
})
