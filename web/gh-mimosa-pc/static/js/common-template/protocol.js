define([],
function(){
	return{
		name:"protocol",
		init:function(){
			this.pageInit();
			this.bindEvent();
		},
		pageInit:function(){
			var _this = this;
		},
		bindEvent:function(){
			var _this = this;
			//风险提示书 活期/定期公用
			$("#serviceFiles").off().on("click", function(){
				if($(this).hasClass("btn_loading")){
					return
				}
				if(!GHutils.product){ //没有获取到产品详情
					return
				}
				var dom = $(this)
				dom.addClass("btn_loading")
				var serviceFiles = GHutils.product.serviceFiles
				if(serviceFiles && serviceFiles.length > 0 && serviceFiles[0].furl){
					$("#protocal-title").html("风险提示书及平台免责声明")
					$("#protocal-content").html('');
					var furl = GHutils.product.serviceFiles[0].furl;
					if(furl.indexOf(".html") == -1){
							$("#protocal-name").html('产品协议《风险提示书及平台免责声明》文件格式不对')
							$("#protocal-warn-box").modal("show")
							dom.removeClass("btn_loading")
							return ;
					}
					$.get(furl,function(templates,status,xhr){//templates
						var begin = templates.indexOf('<body');
						var end = templates.indexOf('</body>');
						var temp = templates.substr(begin, end);
						$("#protocal-content").html(temp);
						$("#protocal-box").modal("show")
						dom.removeClass("btn_loading")
					},"html");
				}else{
					$("#protocal-name").html('该产品没有录入《风险提示书及平台免责声明》')
					$("#protocal-warn-box").modal("show")
				}
//				$(this).removeClass("btn_loading")
			})
			
			//定向委托投资协议 活期/定期公用
			$("#investFiles").off().on("click", function(){
				if($(this).hasClass("btn_loading")){
					return
				}
				var dom = $(this)
				dom.addClass("btn_loading")
				GHutils.isLogin(function(){
					if(!GHutils.product){ //没有获取到产品详情
						dom.removeClass("btn_loading")
						return
					}
					var investFiles = GHutils.product.investFiles
					if(investFiles && investFiles.length > 0 && investFiles[0].furl){
						if(!GHutils.userinfo){
							_this.getUserInfo(dom.attr('data-tips'));
						}
						if(!GHutils.userinfo){//获取用户详情报错了或者没有获取到
							dom.removeClass("btn_loading")
							return
						}
						var rlts = GHutils.userinfo
						GHutils.load({ //协议接口
							url: GHutils.API.PRODUCT.getAgreement + "?productOid=" + GHutils.product.oid,
							type: "post",
							sw: true,
							callback: function(result) {
								if(GHutils.checkErrorCode(result,$(dom.attr('data-tips')))) {
									$("#protocal-title").html("投资协议")
									$("#protocal-content").html('');
									var furl = GHutils.product.investFiles[0].furl;
									if(furl.indexOf(".html") == -1){
											$("#protocal-name").html('产品协议《投资协议》文件格式不对')
											$("#protocal-warn-box").modal("show")
											dom.removeClass("btn_loading")
											return ;
									}
//									setTimeout(function(){
//										dom.removeClass("btn_loading")
//									},2000)
									$.get(furl,function(templates){
										var begin = templates.indexOf('<body');
										var end = templates.indexOf('</body>');
										var temp = templates.substr(begin, end);
										temp = temp.replace('#code', result.code)
												   .replace('#publishername',hasOrNot(rlts.fullName))
												   .replace('#userAcc',hasOrNot(rlts.userAcc))
												   .replace('#idNumb',hasOrNot(rlts.idNumb))
										$("#protocal-content").html(temp);
										$("#protocal-box").modal("show")
										dom.removeClass("btn_loading")
									},"html")
								}
							}
						});
					}else{
						$("#protocal-name").html('该产品没有录入《投资协议》')
						$("#protocal-warn-box").modal("show")
						dom.removeClass("btn_loading")
					}
				})
			})

		
			//定向委托投资管理交易说明书  定期
			$("#files").off().on("click", function(){
				if($(this).hasClass("btn_loading")){
					return
				}
				var dom = $(this)
				var tips = dom.attr('data-tips')
				if(!GHutils.product){ //没有获取到产品详情
					return
				}
				dom.addClass("btn_loading")
				GHutils.isLogin(function(){
					var prodoct = GHutils.product
					if(prodoct.files && prodoct.files.length > 0 && prodoct.files[0].furl){
						if(!GHutils.userinfo){
							_this.getUserInfo(tips);
						}
						if(!GHutils.userinfo){//获取用户详情报错了或者没有获取到
							dom.removeClass("btn_loading")
							return
						}
						$("#protocal-title").html("投资说明书")
						$("#protocal-content").html('');
						GHutils.load({ //协议接口
							url: GHutils.API.PRODUCT.getAgreement + "?productOid=" + prodoct.oid,
							type: "post",
							callback: function(result) {
								if(GHutils.checkErrorCode(result, $(dom.attr('data-tips')))) {
//									setTimeout(function(){
//										dom.removeClass("btn_loading")
//									},2000)
									var furl = GHutils.product.files[0].furl;
									if(furl.indexOf(".html") == -1){
											$("#protocal-name").html('产品协议《投资说明书》文件格式不对')
											$("#protocal-warn-box").modal("show")
											dom.removeClass("btn_loading")
											return ;
									}
									$.get(furl, function(templates) {
										var money = 0;
										var temp = GHutils.parseUrlParam(window.location.href);
										if(temp && typeof(temp.moneyVolume) == "number"){
											money = temp.moneyVolume;
										}
										temp = $("#invest");
										if(temp.length > 0){
											money = Number(temp.val() || '0')
										}
										var userinfo = GHutils.userinfo;
										var begin = templates.indexOf('<body');
										var end = templates.indexOf('</body>');
										var temp = templates.substr(begin, end);
										temp = temp.replace('#fullName', prodoct.productName)
											.replace('#code', result.code)
											.replace('#administrator', result.administrator)
											.replace('#riskLevel', result.riskLevel)
											.replace('#raisedTotalNumber', result.raisedTotalNumber)
//											.replace('#expectIncomeExt', Math.floor(money*result.expArorSec*result.durationPeriodDays/365/100*100)/100)
											.replace('#expArorSec', result.expArorSec)
											.replace('#investMin', result.investMin)
											.replace('#investMin', result.investMin)
											.replace('#investAdditional', result.investAdditional)
											.replace('#investAdditional', result.investAdditional)
											.replace('#durationPeriodEndDate', result.durationPeriodEndDate)
											.replace('#durationPeriodDays', result.durationPeriodDays)
											.replace('#repayDate', result.repayDate)
											.replace('#operationRate', result.operationRate)
											.replace('#expectIncomeExt', countIncome())//$("#income").html().replace("预计收益","").replace("元","").replace("预计每天可收益","") || 0.00
											.replace('#orderAccount', money || 0.00)
											.replace('#investorLevel', result.riskLevel)
											.replace('#investorLevel1', result.investorLevel1)
											.replace('#investorLevel2', result.investorLevel2)
											.replace('#investorLevel3', result.investorLevel3)
											.replace('#investorLevel4', result.investorLevel4)
											.replace('#investorLevel5', result.investorLevel5)
											.replace('#raiseStartDate', result.raiseStartDate)
											.replace('#raiseEndDate', result.raiseEndDate)
											.replace('#matureDate', result.matureDate)
											.replace('#durationPeriodDays', result.durationPeriodDays)
											.replace('#expArorSec', result.expArorSec)
											.replace('#expArorSec', result.expArorSec)
											.replace('#durationPeriodDays', result.durationPeriodDays)
											.replace('#incomes', Math.floor(10000*result.expArorSec*result.durationPeriodDays/365/100*100)/100)
											.replace("#newinvestorLevel", result.newInvestorLevel)
										$("#protocal-content").html(temp);
										$("#protocal-box").modal("show")
										dom.removeClass("btn_loading")
									},"html");
								}
							}
						})
//						$.get(prodoct.files[0].furl,function(templates){
//							var begin = templates.indexOf('<body');
//							var end = templates.indexOf('</body>');
//							var temp = templates.substr(begin, end);
//							var currentDate = GHutils.formatTimestamp({'showtime':true})
//							var annualInterest = GHutils.toFixeds(prodoct.rewardInterest, 2)
//							if(annualInterest > 0){
//								annualInterest +='%' 
//							}else{
//								annualInterest = ''
//							}
//							annualInterest = prodoct.annualInterestSec+annualInterest
//							temp = temp.replace('#productName',prodoct.productName)
//									   .replace('#incomeCalcBasis',prodoct.incomeCalcBasis)
//									   .replace('#year',currentDate.split("-")[0])
//									   .replace('#month',currentDate.split("-")[1])
//									   .replace('#day',currentDate.split("-")[2])
//		//													   .replace('#money',result.money)
//									   .replace('#money',GHutils.formatCurrency(parseFloat($('.investMoney').val())+0))
//									   .replace('#interestsStartDate0',prodoct.interestsStartDate.split("-")[0])
//									   .replace('#interestsStartDate1',prodoct.interestsStartDate.split("-")[1])
//									   .replace('#interestsStartDate2',prodoct.interestsStartDate.split("-")[2])
//									   .replace('#interestsEndDate0',prodoct.interestsEndDate.split("-")[0])
//									   .replace('#interestsEndDate1',prodoct.interestsEndDate.split("-")[1])
//									   .replace('#interestsEndDate2',prodoct.interestsEndDate.split("-")[2])
//									   .replace('#durationPeriod',prodoct.durationPeriod)
//									   .replace('#annualInterest',annualInterest)
//									   .replace('#incomeCalcBasis1',prodoct.incomeCalcBasis)
//							
//						});
					}else{
						$("#protocal-name").html('该产品没有录入《投资说明书》')
						$("#protocal-warn-box").modal("show")
						dom.removeClass("btn_loading")
					}
				})
			})
			function hasOrNot(param){
				if(typeof(param) == "undefined")param='暂无'
				return param
			}
			
			function countIncome(){
				var procent =null;
				var income = '';
				var product = GHutils.product;
				var rewardInterest = parseFloat(product.rewardInterest+0)
				var investMoney = $("#invest").length > 0  ? Number($("#invest").val() || 0):GHutils.parseUrlParam(window.location.href).moneyVolume

				var days = 0;
				if(product.type == "PRODUCTTYPE_01"){
                    days = product.durationPeriod;
				}else if(product.type == "PRODUCTTYPE_01"){
                    days = 1;
				}
				if(product.annualInterestSec.indexOf('-')>-1){
					procent = product.annualInterestSec.split('-')
					var min = parseFloat(procent[0].split('%')[0])+parseFloat(rewardInterest)
					var max = parseFloat(procent[1].split('%')[0])+parseFloat(rewardInterest)
					income = GHutils.formatCurrency(GHutils.toFixeds(coculateIncome(investMoney,min,days,product.incomeCalcBasis),2))+'到'
					income+= GHutils.formatCurrency(GHutils.toFixeds(coculateIncome(investMoney,max,days,product.incomeCalcBasis),2))
				}else{
					procent = parseFloat(product.annualInterestSec.split('%')[0])+parseFloat(rewardInterest)
					income = GHutils.formatCurrency(GHutils.toFixeds(coculateIncome(investMoney,procent,days,product.incomeCalcBasis),2))
				}
				return income
			}
			
			function coculateIncome(investMoney,procent,n,incomeCalcBasis){
				var a = GHutils.Fmul(investMoney , GHutils.Fdiv(procent,100))
				var b = GHutils.Fdiv(n,Number(incomeCalcBasis))
				return GHutils.Fmul(a,b)
			}
			
			//相关协议点击事件
	    	$('.protocol').off().on('click',function(){
	    		var dom = $(this);
	    		var tile = dom.html().replace("《","").replace("》","")
	    		
	    		GHutils.load({
		        url: GHutils.API.CMS.getProtocolInfo+'?typeId='+dom.attr('data-typeId'),
		        data: {},
		        type: "post",
		        callback: function(result) {
		        	if(result.errorCode != 0){
		        		$(dom.attr("data-tips")).html('提示：'+result.errorMessage)
		        		return
		        	}
		        	$("#protocal-title").html(tile)
					$("#protocal-content").html(result.content);
					$("#protocal-box").modal("show")
		        }
		      });
	    		
	    		
	    	})
	    	
//	    	$("#protocal-box .popup-logo,#protocal-warn-box .popup-logo").off().on('click',function(){
//	    		$("#files").removeClass("btn_loading")
//	    		$("#investFiles").removeClass("btn_loading")
//	    		$("#serviceFiles").removeClass("btn_loading")
//	    		$(".protocol").removeClass("btn_loading")
//	    	})
			
		},
		getUserInfo:function(tips){
	    	var _this = this;
	    	GHutils.load({
				url: GHutils.API.ACCOUNT.userinfo,
				data: {},
				type: "post",
				async:false,
				callback: function(result) {
					if(result.errorCode != 0){
						$(tips).html("提示："+result.errorMessage)
						return false;
					}
					GHutils.userinfo = result;
				}
			})
		}
	}
})