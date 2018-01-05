define([],function() {
	return {
		name: 'accoutTabNav',
	    init:function(){
	      this._link = "";
	      this.pageInit();
//	      this.riskGrade();
	      this.tabHeader();
	      this.bindEvent();
	    },
	    pageInit:function(){
	      var _this = this;
	      var onnav = $("#tabnav-box").attr("data-navname");
	      if(onnav){ 
	      	  _this._link = $("#"+onnav).attr('href');
		      $("#"+onnav).addClass("active").attr("href","javascript:;");
	      }
	      
	    },
	    tabHeader:function(){
	    	var _this = this;
	    	var interval = setInterval(function(){
	    		if(GHutils.userinfo){
	    			clearInterval(interval);
	    			_this.headerInit(GHutils.userinfo);
	    			$("#inviteRisktesting").on('click',function(){
	     				if(GHutils.userinfo.isRiskAssessment){
	     					window.location.href="account-risktesting.html";
	     				}else{
	     					var actionUrl = window.location.href.replace(_this._link,"account-risktesting.html")
	     					window.location.href="account-validate.html?action=isRiskAssessment&actionURL="+actionUrl;
	     				}
	     			})
	    		}
	    	},100)
	    	
	    },
	    headerInit:function(data){
	    	//用户中心部分，左上角的用户详情
	    	var userAcc = data.userAcc.substring(0,3)+'****'+data.userAcc.substring(7,11)
			userAcc = data.name || userAcc
			$('#infoName').html('你好，'+userAcc)
			if(data.bankName){
				$('.gh_icon_logindone_bankcard').addClass('active').attr("title","已完成实名认证");
			}
			if(data.paypwd){
				$('.gh_icon_logindone_pwd').addClass('active').attr("title","已设置安全密码");
			}
			if(data.isRiskAssessment){
				$('.gh_icon_logindone_risk').addClass('active').attr("title","已完成风险测评");
			}
			
			$(".account_icon_info").find("li").removeClass("loading");
			
	    },
	    bindEvent:function(){
	    	var _this = this;
	    	$(".account_icon_info").find("li").off().on("click",function(){
	    		if($(this).hasClass("loading")){
	    			return;
	    		}
	    		if(!$(this).hasClass("active")){
	    			var actionUrl = window.location.href
	    			window.location.href="account-validate.html?action=auth&actionURL=" + actionUrl;
	    		}
	    	})
	    }
	}
})