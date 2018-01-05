var GHrisk={
	getSid: function(cb,tips) {
		var _this = this;
		GHutils.load({
			url: GHutils.API.ACCOUNT.getAllNameList,
			type: 'post',
			callback: function(data) {
				GHutils.log(data,"选择题======");
				if(GHutils.checkErrorCode(data,tips)){
					for(var i in data.rows) {
						var _sid = data.rows[i].sid;
						if(cb && typeof(cb) =="function"){
							cb.apply(null,[_sid]);
						}
					}
				}
			},
			errcallback: function() {
				alert("网络错误，请稍后再试")
			}
		})
	},
	//获取风险测评等级
	getFxData: function(_sid,cb) {
		var _this = this;
		GHutils.load({
			url: GHutils.API.ACCOUNT.qamsScore + '?queId=' + _sid,
			type: 'post',
			async: true,
			callback: function(result) {
				GHutils.log(result,'获取风险测评等级======')
				if(result.errorCode == 0 && result.grade != '') {//有
					if(cb && typeof(cb) =="function"){
						cb.apply(null,[(result.grade)]);
					}
				} else {//没有测评过
//					GHutils.OPENPAGE({
//						url: '../../html/account/account-risk-wenti.html',
//						extras: {
//							actionURL:window.location.href
//						}
//					})
				}
			}
		})
	},
	//判断认证
	checkDWcomplete: function(isRiskAssessment,action) {
//		var authentication = authentication || ["fullName", "paypwd", "isRiskAssessment"]; //认证类型
		var iftrue = true;
		if(!GHutils.userinfo){
			GHutils.userinfo = GHutils.getUserInfo()
		}
		var userinfo = GHutils.userinfo
		if(!userinfo.bankCardNum || !userinfo.paypwd){
			iftrue=false;
			$(".preAction").html(action ||"投资")
			$("#noComplateInfo").modal("show")
		}else if(isRiskAssessment && !userinfo.isRiskAssessment){
			iftrue=false;
			$(".preAction").html(action ||"投资")
			$("#noRiskAssessment").modal("show")
		}
		
//		for(var i = 0; i < authentication.length; i++) {
////			if(!userinfo[(authentication[i])] ) {
////				window.location.href="account-validate.html?action="+action+"&actionURL="+window.location.href;
////				iftrue = false;
////				break;
////			}
//			
//			if(cb && typeof(cb) =="function"){
//				cb.apply(null,arguments);
//			}
//			
//		}
		
		return iftrue;
	},
	getRiskGrade:function(){
		var _this = this;
		GHutils.load({
			url:GHutils.API.ACCOUNT.saveInvesterLevel,
			params: {
				queId: 1
			},
			type:'post',
			callback:function(result){
				if(GHutils.checkErrorCode(result)){
//					$("#sure").removeClass("btn_loading")
					$(".isRiskAssessment").removeClass("gh_none")
					$(".notRiskAssessment").addClass("gh_none")
					var risk = GHutils.parseRiskLevel(result.grade || "R1");
					$(".riskLevelImg").attr('class',"riskLevelImg gh_icons "+risk.clazz)
					$(".riskLevelTxt").html(risk.txt);
					$(".isRiskAssessment_"+(result.grade || "R1")).removeClass("gh_none")
				}
			}
		})
	}
	
	
	
}
