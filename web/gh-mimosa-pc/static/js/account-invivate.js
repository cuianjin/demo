var Mycardinvivate = function() {
	this.columnDefine = [
		{"name":"phone","clazz":"text-left"},
		{"name":"realName","clazz":"text-left"},
		{"name":"date","clazz":"text-left"}
	]
	return this;
}

Mycardinvivate.prototype =  {
	init: function() {
		GHutils.isLogin();
		this.pageInit();  
	},
	pageInit:function(){
		var _this = this;
		$.tab();
		this.getInvivateDate();
		this.getMyInvites(1,true);
	},
	getMyInvites:function(page,isFlag){
		var _this = this;	
			GHutils.load({
                url: GHutils.API.ACCOUNT.getmyinvites+'?page='+page+'&rows=8',
                data: {},
                type: "post",
                callback: function (res) {
                	if (res.errorCode != 0) {
                		$("#invivateTable-noRecord").show();
                        return false;
                    }
                	var result = res.pages;
                	$('#user_invite_num').html(res.total)
  					GHutils.table("#invivateTable",_this.columnDefine,res.rows,"#invivateTable-noRecord","--")
                   	if(isFlag){
						_this.createPage(Math.ceil(res.total/8));
					}
				}
			})
	},
	createPage: function(pageCount) {
		var _this = this;
		$(".gh_tcdPageCode").show()
		if(pageCount <=1){
			$(".gh_tcdPageCode").hide()
			return ;
		}
		
		$(".gh_tcdPageCode").createPage({
			pageCount: pageCount,
			current: 1,
			backFn: function(page) {
				_this.getMyInvites(page,false);
			}
		});
	},
	//邀请排行榜
	getInvivateDate:function(){
		var _this = this;
		GHutils.load({
			url:GHutils.API.ACCOUNT.invitecharts,
			data:{},
			type:'post',
			callback:function(result){
				if(result.errorCode !=0){
					return false;
				}
				var columnDefine = [
					{"name":"idx","idx":true},
					{"name":"phoneNum","clazz":"gh_tcenter"},
					{"name":"realName","clazz":"gh_tcenter"},
					{"name":"recommendCount","clazz":"gh_tcenter"}
				]
				GHutils.table("#invivateTop",columnDefine,result.rows,"#invivateTop-noRecord","--")
			},
			errcallback:function(){
				
			}
		})
		
	}
}

$(function() {
	new Mycardinvivate().init();
})








































