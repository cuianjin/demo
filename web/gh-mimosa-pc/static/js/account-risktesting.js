var AccountRiskTestIng=function(){
	this.tips = "";
	this.sid = "";
	return this;
}
AccountRiskTestIng.prototype={
	init:function(){
		GHutils.isLogin();
		this.pageInit();
		this.bindEvent();
	},
	pageInit:function(){
		var _this = this;
//		GHrisk.getSid(function(_sid){
//			GHrisk.getFxData(_sid,function(){
//				if(Number(_sid)> Number(GHutils.product.riskLevel.substring(1))){
//					$("#noRiskLevel").modal("show")
//				}else{
//					_this.productInformation(investMoney);
//				}
//			})
//		});
		
		if(!GHutils.userinfo){
			GHutils.userinfo = GHutils.getUserInfo();
		}
		var risk = GHutils.parseRiskLevel(GHutils.userinfo.scoreGrade || "R1");
		$(".riskLevelImg").attr('class',"riskLevelImg gh_icons "+risk.clazz)
		$(".riskLevelTxt").html(risk.txt);
		if(GHutils.userinfo.isRiskAssessment){
			$(".isRiskAssessment_"+(GHutils.userinfo.scoreGrade || "R1")).removeClass("gh_none")
		}else{
			$(".notRiskAssessment").removeClass("gh_none")
		}
	},
	bindEvent:function(){
		var _this = this;
		$("#sure").on('click',function(){
			if($(this).hasClass("btn_loading")){
				return ;
			}
			$(this).addClass("btn_loading")
			GHrisk.getRiskGrade();
		})
	}
}

$(function(){
	var accountRiskTestIng =  new AccountRiskTestIng();
	accountRiskTestIng.init();
})
