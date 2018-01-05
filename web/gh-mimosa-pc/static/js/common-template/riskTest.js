/**
 * 风险测评
 */
define([],function(){
	return{
		name:"riskTest",
		init:function(){
			this.pageInit();
			this.bindEvent();
			this.problemNumber = 0;
		},
		pageInit:function(){
			var _this = this;
			
			
		},
		bindEvent:function(){
			var _this = this;
			//打开风险测评
			$(".toRiskTest").on('click',function(){
				GHrisk.getSid(function(_sid){
					_this.sid = _sid;
					_this.getData1(_sid);
				},_this.tips);
			})
			
			//提交风险测评答案
			$("#submitAnswer").off().on('click',function(){
				if($(this).hasClass('btn_loading')){
					return false;
				}
				$(this).addClass('btn_loading')
				if(!GHutils.userinfo){
					GHutils.userinfo = GHutils.getUserInfo();
				}
				if(!GHutils.userinfo){
					$(this).removeClass('btn_loading')
					$("#risk_errorMessage").html("未获取到用户信息，请等待或刷新页面")
					return false;
				}
				$("#risk_errorMessage").html("&nbsp;")
				var answers = []
				$("#risk-appraisal-lists").find(".risk_appraisal_list").each(function(idx,ele){
					var _radio =  $(ele).find("input[type=radio]")
					var name = _radio.attr("name");
					var _val = null;
					_radio.each(function(i,e){
						if($(e).is(":checked")){
							_val = $(e).val()
						}
					})
					if(!_val){
						$("#submitAnswer").removeClass('btn_loading')
						$("#risk_errorMessage").html("请先答题完毕再提交")
						return false;
					}
					answers.push({
						"qid" : name,
						"answers" :[ _val]
					})
				})
				if(answers.length != _this.problemNumber){
					return false;
				}
				GHutils.load({
					url:GHutils.API.ACCOUNT.saveAnswerQue,
					data:{
						sid:_this.sid,
						questions:answers,
						telephone: GHutils.userinfo.userPhone
					},
					type:'post',
					callback:function(result){
						if(GHutils.checkErrorCode(result,$("#risk_errorMessage"))){
							$("#submitAnswer").removeClass('btn_loading')
							GHutils.log(result,"风险测评=====");
							$("#modal_risktesting").modal("hide");
							$(".isRiskAssessment").removeClass("gh_none")
							$(".notRiskAssessment").addClass("gh_none")
							var riskLevel = result.grade || "R1"
							$(".isRiskAssessment_level").addClass("gh_none")
							$(".isRiskAssessment_"+riskLevel).removeClass("gh_none")							
							var risk = GHutils.parseRiskLevel(riskLevel);
							$(".riskLevelImg").attr('class',"riskLevelImg gh_icons "+risk.clazz)
							$(".riskLevelTxt").html(risk.txt);
						}
					}
				})
			})
			
			//弹窗 重新测评
			$("#reRiskTest").on('click',function(){
				$("#modal_risktesting_result").modal('hide');
				GHrisk.getSid(function(_sid){
					_this.sid = _sid;
					_this.getData1(_sid);
				},_this.tips);
			})
			
			
			$("#riskComplete").on('click',function(){
				$("#modal_risktesting_result").modal('hide');
			})
			
		},
		getData1: function(_sid) {//获取风险问题
			var _this = this;
			$.post(GHutils.API.ACCOUNT.qamsQueResultByid, {"sid": _sid}, function(result) {
				GHutils.log(result,"前面的接口======");
				if(result.list.length>0){
					_this.problemNumber = result.list.length;
					var problems = []
					GHutils.forEach(result.list,function(idx,item){
						item['idx']= idx+1;
						problems.push(item)
					})
					GHutils.mustcache("#risk-appraisal-template","#risk-appraisal-lists",{"problems":problems})
					$("#risk_errorMessage").html("&nbsp;")
					$("#modal_risktesting").modal("show")
				}else{
	//				mui.toast('获取答案失败')
				}
			})
		}
	};
})