var AccountValidate=function(){
	this.urlParam = GHutils.parseUrlParam(window.location.href);
	this.authenticationList = null;
	this.activeAuthentication="";
	return this;
}

AccountValidate.prototype={
	init:function(){
		GHutils.isLogin();
		this.pageInit();
		this.bindEvent();
	},
	pageInit:function(){
		var _this = this;
		var actions=	{
				"invest":"投资前准备",
				"redeem":"赎回前准备",
				"withdraw":"提现前准备",
				"deposit":"充值前准备",
				"isRiskAssessment":"风险测评准备",
				"auth":"完善资料准备"
			};
		
		var authentication=	{
				"invest":["bankCardNum","paypwd","isRiskAssessment"],
				"redeem":["bankCardNum","paypwd","isRiskAssessment"],
				"withdraw":["bankCardNum","paypwd"],
				"deposit":["bankCardNum","paypwd"],
				"isRiskAssessment":["bankCardNum","isRiskAssessment"],
				"auth":["bankCardNum","paypwd","isRiskAssessment"]
			};
		if(_this.urlParam.action && authentication.hasOwnProperty(_this.urlParam.action) && _this.urlParam.actionURL){
			document.title = actions[(_this.urlParam.action)]+"-国槐科技"
			_this.authenticationList = authentication[(_this.urlParam.action)];
			
			_this.checkDWcomplete()
			
			if(!GHutils.userinfo){
				GHutils.userinfo = GHutils.getUserInfo();
			}
			var risk = GHutils.parseRiskLevel(GHutils.userinfo.scoreGrade);
			$(".riskLevelImg").attr('class',"riskLevelImg gh_icons "+risk.clazz)
			$(".riskLevelTxt").html(risk.txt);
			if(GHutils.userinfo.isRiskAssessment){
				$(".isRiskAssessment").removeClass("gh_none")
			}else{
				$(".notRiskAssessment").removeClass("gh_none")
			}
			
		}else{
			window.location.href="account.html";
		}
	},
	
	bindEvent:function(){
		var _this = this;
		GHutils.inputPwd("#bank_pay_pwd1")
		GHutils.inputPwd("#bank_pay_pwd2")
		
		$("#sure").on('click',function(){
			if($(this).hasClass("btn_loading")){
				return ;
			}
			$(this).addClass("btn_loading")
			GHrisk.getRiskGrade();
		})
		
		//完成
		$(".goStill").on('click',function(){
			var _href = _this.urlParam.actionURL;
			if(_this.urlParam.action == "invest"){
				if(_this.urlParam.pType == "experience"){
					_href+='&pType=experience&couponId='+_this.urlParam.couponId
					
				}
			}
			window.location.href=_href;
		})
		
//		$(".toIndex").on('click',function(){
//			window.location.href="index.html";
//		})
		
		
	},
	checkDWcomplete: function() {
		var _this = this;
		if(!GHutils.userinfo){
			GHutils.userinfo = GHutils.getUserInfo()
		}
		var userinfo = GHutils.userinfo
		$('.validata_step').addClass("gh_none").removeClass("active")
		$('.validata_con').removeClass("active")
		var _continue = true;
		for (var i = 0; i < _this.authenticationList.length; i++) {
			var progress = $("#"+_this.authenticationList[i]+"Process").removeClass("gh_none");
			progress.find('i').html(i+1)
			if(_continue && !userinfo[(_this.authenticationList[i])]){
				_continue = false;
				progress.addClass("active")
				$("."+_this.authenticationList[i]+"_tips").addClass('active').siblings().removeClass("active")
//				
				_this.activeAuthentication=_this.authenticationList[i];
				$("#"+_this.authenticationList[i]+"Box").addClass("active")
			}
			if(i == _this.authenticationList.length-1){
				progress.addClass("noarrow");
			}
		}
		
		if(_continue){
			$("#completed").modal('show')
		}
	},
//	getBankList:function(){
//		var _this = this;
//		$('#bindCardModal').modal('show')
//		GHutils.load({
//			url: GHutils.API.ACCOUNT.bankList,
//			data:{},
//			type: "post",
//			callback: function(result) {
//				var banks = ''
//				GHutils.forEach(result.datas,function(idx,bank){
//					banks+='<li class="bank" data-bankCode='+bank.peopleBankCode+' data-bankName='+bank.bankName+'><img src="'+bank.bankBigLogo+'"/></li>'
//				})
//				$('#bankList').html(banks)
//				_this.bindEvent();
//				
//			}
//		});
//	},
	callBackFun:function(){
		var _this = this;
		GHutils.userinfo = null;
		$('.validata_tips_box li').removeClass("active")
		if(_this.authenticationList[(_this.authenticationList.length -1)] == _this.activeAuthentication){
			var actions=	{
				"invest":"投资",
				"redeem":"赎回",
				"withdraw":"提现",
				"deposit":"充值",
				"isRiskAssessment":"风险测评",
				"auth":"完善资料"
			};
			$(".action").html(actions[(_this.urlParam.action)])
			$("#completePrepare").modal('show')
		}else{
			_this.checkDWcomplete()
		}
	}
}

$(function(){
	var  accountValidate = new AccountValidate();
	accountValidate.init();
	window.pageFun = accountValidate;
})
