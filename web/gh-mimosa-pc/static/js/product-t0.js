var HUOQI = function() {
	this.tips = $("#invest_errorMessage");
	this.param = null;
	this.uraParam = GHutils.parseUrlParam(window.location.href);
	this.couponAmount=0;
	this.coupon = null;
	this.balance = 0;
	this.today = "";
	this.loginStatus = false;
	this.action = "invest";
	return this;
}
HUOQI.prototype =  {
	init: function() {
		this.pageInit();
		this.getUseraccount();
	},
	pageInit: function() {
		var _this = this;
		var uraParam = _this.uraParam
		if(uraParam && uraParam.productOid){
			if(uraParam.pType=="experience"){
				if(!uraParam.couponId){
					$(_this.tips).html('提示：  请选择合适的卡券')
					$('#goInvest').off().removeClass("gh_btn_orange").addClass("gh_btn_disabled");
					return
				}
				GHutils.isLogin(function(){
					_this.getMyCoupon();
				},function(){
					$("#showLogin").trigger("click");
					$('#goInvest').off().removeClass("gh_btn_orange").addClass("gh_btn_disabled");
				})
			}else{
				_this.getProductInfo(uraParam.productOid)
			}
			return false;
		}else{
			_this.getT0List()
		}
		
					
	},
	bindEvent: function() {
		var _this = this;
		$.tab();
		
		var investMoney = 0
		
		//监听投资借文本框change事件
		$('#invest')
			.off()
			.on('focus', function () {
		      	$('#invest').keyup( function (e) {
		        	var money = $(this).val()
		        	$('#income').html('')
		        	$(_this.tips).html('&nbsp;')
					investMoney = 0	
	        		if(money){
	        			if(GHutils.validate("investValidBox")){
							investMoney = parseFloat(money)
							$('#income').html('预计每天可收益 '+ _this.coculateIncome(investMoney,_this.param.incomeCalcBasis) +' 元')
	        			}
	        		}else{
	        			$('#income').html(_this.param.investMin+' 元起投，'+_this.param.addMoney+' 元递增')
	        		}
	        		if(_this.loginStatus && _this.balance < investMoney){
						$(".toDeposit").show();
					}else{
						$(".toDeposit").hide();
					}
			    })
		      	.on('cut',function(){
		      		$(this).keyup()
		      	})
		      	.on("contextmenu",function(e){//禁止鼠标右键弹出操作选项列表
					e.preventDefault();
				})
		    })
		    .on('blur', function () {
		      $(document).off('keyup')
		    })
		
		GHutils.checkInput("#invest",3)//input框输入格式校验
		
		GHutils.IEInputClear("#invest",function(){ //ie input点击叉叉清空内容自定义事件
			if(_this.param){
				$('#income').html(_this.param.investMin+' 元起投，'+_this.param.addMoney+' 元递增')
			}
		})
		
		$('#descInvest').on('click',function(){
			if(!_this.param){
				return
			}
			var money = $('#invest').val()
			investMoney = 0	
			if(money){
				if( !/^\d+(\.\d+)?$/.test(money)){
					$(_this.tips).html('提示：  投资金额格式不正确')
					return false;
				}else{
					investMoney = parseFloat(money)
				}
			}
			investMoney = GHutils.Fsub(investMoney , _this.param.addMoney)
			if(investMoney < _this.param.investMin || investMoney==0){
				$('#invest').val('')
				investMoney = 0
				$('#income').html(_this.param.investMin+' 元起投，'+_this.param.addMoney+' 元递增')
				return false;
			}
			$('#invest').val(investMoney)
			if(_this.loginStatus && _this.balance < investMoney){
				$(".toDeposit").show();
			}else{
				$(".toDeposit").hide();
			}
			var procent = $('#annualInterestSec').html()
			procent = parseFloat(procent.substring(0,procent.length-2));
			$('#income').html('预计每天可收益 '+ _this.coculateIncome(investMoney,_this.param.incomeCalcBasis) +' 元')
		})
			
		//点击加号图标
		$('#adInvest').on('click',function(){
			if(!_this.param){
				return
			}
			var money = $('#invest').val()
			investMoney = 0
			if(money){
				if(!/^\d+(\.\d+)?$/.test(money)){
					$(_this.tips).html('提示：  投资金额格式不正确')
					return false;
				}else{
					investMoney = parseFloat(money)
				}
			}
			if(investMoney == 0 && _this.param.addMoney < _this.param.investMin){
				investMoney = GHutils.Fadd(investMoney ,  _this.param.investMin)
			}else{
				var _money = GHutils.Fadd(investMoney ,  _this.param.addMoney);
				if(_money.toString().length > 9){
					return ;
				}
				investMoney = _money;
			}
			$('#invest').val(investMoney)
			if(_this.loginStatus && _this.balance < investMoney){
				$(".toDeposit").show();
			}else{
				$(".toDeposit").hide();
			}
			var procent = parseFloat($('#annualInterestSec').html().split('%')[0])
			$('#income').html('预计每天可收益 '+ _this.coculateIncome(investMoney,_this.param.incomeCalcBasis) +' 元')
		})
		//点击立即抢购
		$('#goInvest').on('click',function(){
			$(_this.tips).html("&nbsp;")
			_this.action = "invest";
			GHutils.isLogin(function(){
				if(GHrisk.checkDWcomplete(true)){
					_this.productInformation();
				}
			},function(){
				$("#showLogin").trigger("click");
			})
		})
		
		$(".toDeposit").off().on('click',function(){
			_this.action = "deposit";
			if(GHrisk.checkDWcomplete(false,"充值")){
				window.location.href = "account-deposit.html"
			}
		})
	},
	investEvent:function(){
		var _this = this;
		//点击立即抢购
		$('#goInvest').on('click',function(){
			$(_this.tips).html("&nbsp;")
			GHutils.isLogin(function(){
				if(GHrisk.checkDWcomplete(true)){
					window.location.href = 'account-apply.html?moneyVolume=' + _this.couponAmount + '&productOid=' + _this.param.oid+'&pType=t0&couponId='+_this.uraParam.couponId;
				}
			},function(){
				$("#showLogin").trigger("click");
			})
		})
	},
	getT0List:function(){
		var _this = this;
		GHutils.load({
			url: GHutils.API.PRODUCT.gett0productlist+'?channelOid='+channelOid+'&rows=100&page=1',
			data: {},
			type: "post",
			callback: function(result) {
				GHutils.forEach(result.rows,function(idx,product){
					if(!GHutils.label(product.productLabels,'8')){
						_this.getProductInfo(product.productOid)
						return true;
					}
				})
			}
		});
	},
	getProductInfo:function(oid){
		var _this = this;
			GHutils.load({
				url: GHutils.API.PRODUCT.gett0detail+'?oid='+oid,
				data: {},
				type: "post",
				callback: function(result) {
					if(result.errorCode == 90000){
						if(_this.uraParam.pType=="experience"){
							_this.tips.html('提示： '+result.errorMessage)
							$('#goInvest').off().removeClass("gh_btn_orange").addClass("gh_btn_disabled");
							return false;
						}
						_this.getT0List()
						return false;
					}else if(result.errorCode != 0){
						_this.tips.html('提示： '+result.errorMessage)
						$('#goInvest').off().removeClass("gh_btn_orange").addClass("gh_btn_disabled");;
						return false;
					}
					result.investMin+=0
					result.maxHold+=0
					result.incomeCalcBasis = parseInt(result.incomeCalcBasis)
					_this.param = result
					GHutils.product = result
					_this.param.addMoney = result.investAdditional*result.netUnitShare
					
					if(_this.uraParam.pType && _this.uraParam.pType=="experience"){
						var a = _this.coupon
						var day = _this.coupon.validPeriod
						var amount = _this.coupon.amount
						for(var i = 0;i<day;i++){
							amount += parseFloat(_this.coculateIncome(amount,_this.param.incomeCalcBasis));
						}
						$('#income').html('预计可收益 '+ GHutils.formatCurrency(GHutils.Fsub(amount,_this.coupon.amount))+' 元')
						_this.investEvent();
					}else{
						$('#income').html(_this.param.investMin+' 元起投，'+_this.param.addMoney+' 元递增')
						_this.bindEvent();
					}
					
					if(result.state == "REVIEWPASS"){
						$('#goInvest').removeClass("gh_btn_orange").addClass("gh_btn_disabled").html('敬请期待').off()
					}else if(result.state == "DURATIONING" && result.isOpenPurchase == "NO"){
						$('#goInvest').removeClass("gh_btn_orange").addClass("gh_btn_disabled").html('不可购买').off()
					}else if(result.state == "DURATIONING" && (result.maxSaleVolume == result.lockCollectedVolume || GHutils.Fmul(GHutils.Fsub(result.maxSaleVolume, result.lockCollectedVolume), result.netUnitShare) < result.investMin)){
						$('#goInvest').removeClass("gh_btn_orange").addClass("gh_btn_disabled").html('已售罄').off()
					}else if(result.state == "CLEARING" || result.state == "CLEARED" || result.state == "RAISEEND"  || result.state == "DURATIONEND" || result.state == "CLEARED"){
						$('#goInvest').removeClass("gh_btn_orange").addClass("gh_btn_disabled").html('已售罄').off()
					}else if(result.state == "RAISEFAIL"){
						$('#goInvest').removeClass("gh_btn_orange").addClass("gh_btn_disabled").html('已售罄').off()
					}
					
					$('#productName').html(result.productName)
					$('#tableProductName').html(result.productName)
					$('#tenThsPerDayProfit').html(result.tenThsPerDayProfit)

                    var incomeDealType = {"reinvest":"收益结转","cash":"现金分红"};
					$("#incomeDealType").html(incomeDealType[(result.incomeDealType)])
					var templateData = '{{annualInterestSec}}{{#rewardInterest}}<span class="f_20 f_cf6">+{{rewardInterest}}%</span>{{/rewardInterest}}';
					var data = {"annualInterestSec":result.annualInterestSec,"rewardInterest":result.rewardInterest?GHutils.toFixeds(result.rewardInterest, 2):null}
					GHutils.mustcacheStr(templateData,"#annualInterestSec",data)
					
					var labels = "";
					GHutils.forEach(result.productLabels,function(idx,label){
						if(label.labelCode =='1'){
							$(".icon_basical_new").removeClass('none')
						}else{
							labels += '<span class="gh_icon_tag gh_tag_general f_12">' +label.labelName + '</span>';
						}
					})
					$('#label').html(labels)
					
					$('#lockPeriodDays').html(result.lockPeriodDays)
					$('#investMin').html(result.investMin)
					$("#introduce-purchasingAmount").html(_this.param.investMin)
					$("#introduce-increaseAmount").html(_this.param.addMoney)
					$('.introduce-productName').html(result.productName)
					GHutils.getSystime(function(res){
						_this.today = res.substr(0,10);
					})
					$('#introduce-investDay').html(_this.today)
					$('#introduce-income').html(result.interestsFirstDate)
					$('#introduce-incomeDay').html(GHutils.addDate(result.interestsFirstDate,1))
					$("#calculator").attr('data-incomeCalcBasis',result.incomeCalcBasis)
					_this.showCharts(result)
					_this.getData(1,true,oid)

                    //动态展示协议
                    if(result.files && result.files.length > 0){
                        $("#files").parent().removeClass("gh_none")
                    }
                    if(result.investFiles && result.investFiles.length > 0){
                        $("#investFiles").parent().removeClass("gh_none")
                    }
                    if(result.serviceFiles && result.serviceFiles.length > 0){
                        $("#serviceFiles").parent().removeClass("gh_none")
                    }
				}
			});			
		
	},
	getMyCoupon:function(){
		var _this = this;
		GHutils.load({
			url:GHutils.API.ACCOUNT.coupon+'?page=1&rows=100&status=notUsed',
			type:'post',
			callback:function(result){
				if(GHutils.checkErrorCode(result,_this.tips)){
					var isFlag = GHutils.forEach(result.rows,function(idx,item){
						if(item.type =="tasteCoupon" && item.couponId == _this.uraParam.couponId){
							_this.getProductInfo(_this.uraParam.productOid);
							_this.couponAmount = item.amount
							_this.coupon = item
							$("#invest").val(item.amount).attr("disabled","disabled")
							return true;
						}
					})
					if(!isFlag){
						$(_this.tips).html('提示：  请选择合适的卡券')
						$('#goInvest').off().removeClass("gh_btn_orange").addClass("gh_btn_disabled");
						return
					}
				}
			}
		});
	},
	createPage: function(pageCount,proOid) {
		var _this = this;
		if(pageCount <= 1){
			$(".gh_tcdPageCode").hide()
			return
		}
		$(".gh_tcdPageCode").show().createPage({
			pageCount: pageCount,
			current: 1,
			backFn: function(page) {
				_this.getData(page,false,proOid);
			}
		});
	},
	coculateIncome:function(investMoney,n){
		var _this = this;
		function coculateIncome(){
			var result = ''
			var idx  = _this.param.annualInterestSec.indexOf('-')
			if(idx>-1){
				var min = parseFloat(_this.param.annualInterestSec.substring(0,idx).replace("%",""))+parseFloat(_this.param.rewardInterest)
				var max = parseFloat(_this.param.annualInterestSec.substr(idx+1).replace("%",""))+parseFloat(_this.param.rewardInterest)
				result = counts(investMoney,min,n)+' 元到 '+counts(investMoney,max,n)
			}else{
				var procent = parseFloat(_this.param.annualInterestSec.replace("%",""))+parseFloat(_this.param.rewardInterest)
				result = counts(investMoney,procent,n)
			}
			return result;
		}
		//计算收益investMoney 金额   procent收益率    n开n次方
		function counts(investMoney,procent,n){
			return GHutils.formatCurrency(GHutils.toFixeds(GHutils.Fmul(investMoney , GHutils.Fdiv(GHutils.Fdiv(procent,100),n)),2))
		}
		return coculateIncome();
	},
	showCharts:function(tradeObj){
		var _this = this;
		showCharts();
		
		function showCharts () {//echarts
			switch (tradeObj.showType) {
				case "1" : case "2" : 
						   getT0Chart(tradeObj.annualYields, 'chart_1', tradeObj);
						   getT0Chart(tradeObj.perMillionIncomes, 'chart_2', tradeObj);
						   break
				case "4" : case "5" :
						   $("#charts_title2").html("基准收益率走势图(%)")
						   getT0Chart(tradeObj.annualYields, 'chart_2', tradeObj);
						   getT0RewardChart(tradeObj.rewardYields, 'chart_1');
						   break
				default : break
			}
		}
		
		function getT0Chart (ProfitWeek, rid, tradeObj) {
			if(ProfitWeek !=null){
				var xData = [];
				var yData = [];
				var compareData = [];
				for (i = 0; i < ProfitWeek.length; i++) {
					xData[i] = ProfitWeek[i].standard.substring(5);
					yData[i] = ProfitWeek[i].profit;
					compareData[i] = parseFloat(yData[i]);
				}
				var maxY = Math.max.apply({},compareData)+0.3;
				var minY = Math.min.apply({},compareData)-0.3;
				
				var myChart = echarts.init(document.getElementById(rid));
				myChart.setOption(getOption(xData,yData,minY.toFixed(1),maxY.toFixed(1)));
			} else {
				var annualInterestSec = [], tenThsPerDayProfit = [];
				var ainterestSec = "", tprofit = "";
				var profit = "", standard = "";
				switch (tradeObj.showType) {
					case "1" : case "4" : annualInterestSec = tradeObj.annualInterestSec.replace(/\%/g,'').split('-');
										  tenThsPerDayProfit = tradeObj.tenThsPerDayProfit.split('-');
										  ainterestSec = GHutils.Fdiv(GHutils.Fadd(annualInterestSec[0], annualInterestSec[1]), 2);
										  tprofit = GHutils.Fdiv(GHutils.Fadd(tenThsPerDayProfit[0], tenThsPerDayProfit[1]), 2);
										  break
					case "2" : case "5" : ainterestSec = tradeObj.annualInterestSec.replace('%','');
										  tprofit = tradeObj.tenThsPerDayProfit;
										  break
					default : break
				}
				standard = _this.today.substring(5);
				var myChart = echarts.init(document.getElementById(rid));
				
				myChart.setOption(getOption([standard],[profit],profit-1,profit+1));
			}
		}
		
		function getT0RewardChart (ProfitWeek, rid) {
			GHutils.log(ProfitWeek,"shouyi============")
			if(ProfitWeek !=null){
				var xData = [];
				var yData = [];
				var compareData = [];
				for (i = 0; i < ProfitWeek.length; i++) {
					xData[i] = ProfitWeek[i].standard//.substring(5);
					
					yData[i] = ProfitWeek[i].profit;
					compareData[i] = parseFloat(yData[i]);
				}
				var maxY = Math.max.apply({},compareData)+0.3;
				var minY = Math.min.apply({},compareData)-0.3;
				
				var myChart = echarts.init(document.getElementById(rid));
				myChart.setOption(getRewardOption(xData,yData,minY.toFixed(1),maxY.toFixed(1)));
				$("#step").show().next().hide()
				var columnDefine=[
					{"name":"level","format":function(){return "L"+this.level;}},
					{"name":"standard","clazz":"gh_tcentert"},
					{"name":"profit","clazz":"gh_tcentert","format":function(){return this.profit+"%";}},
					{"name":"profit","clazz":"gh_tcentert","format":function(){return this.withoutLadderProfit+"%+"+this.profit+"%";}}
					
				]
				GHutils.table("#t0Table",columnDefine,ProfitWeek,"#t0Table-noReCord")
			}
		}
		
		
		//图标信息数值
		function getOption (xdata, ydata, minY, maxY) {
			var chartOption =  {
				legend: {
					data: [''],
					textStyle: {
						color: '#CCC'
					}
				},
				color: ['#4891fa'],
				grid: {
					x: 40,
					x2: 20,
					y: 30,
					y2: 25
				},
				animation: false,
           		addDataAnimation: false,
				calculable: false,
				xAxis: [{
					type: 'category',
					boundaryGap: false,
					data: xdata,
					splitLine: {
						show: false,
					},
					axisLine: {
						lineStyle: {
							color: '#adadad',
							width: 0.1
						}
					},
					axisTick: {
						show: false,
					},
					axisLabel : {
			            show : true,
			            textStyle : {
			                color : '#adadad'
			            }
			        }
				}],
				yAxis: [{
					type: 'value',
					min: minY||'3',
					max: maxY||'5.5',
					splitLine: {
						show: true,
						lineStyle: {
							color: '#adadad',
							width: 0.1
						}
					},
					axisLine: {
						show: false,
					},
					axisTick: {
						show: false,
					},
					axisLabel : {
			            show : true,
			            textStyle : {
			                color : '#adadad'
			            },
			            formatter: function (value, index) {
							var fixedValue = GHutils.toFixeds(value,2);
							return fixedValue;
						}
			        }
				}],
				series: [{
					type: 'line',
					data: ydata,
					symbolSize: 0,
					
					areaStyle: {
						normal: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
								offset: 0,
								color: 'rgba(72, 145, 250, 0.67)'
							}, {
								offset: 1,
								color: 'rgba(218, 238, 255, 0.33)'
							}])
						}
					}
				}]
			};
			return chartOption;
		}
		
		
		//奖励收益柱状图信息数值
		function getRewardOption (xdata, ydata, minY, maxY) {

			var rewardChartOption =  {
				legend: {
					data: [''],
					textStyle: {
						color: '#CCC'
					}
				},
				color: [new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
					offset: 0,
					color: 'rgba(72, 145, 250, 0.67)'
				}, {
					offset: 1,
					color: 'rgba(218, 238, 255, 0.33)'
				}])],
				grid: {
					x: 50,
					x2: 20,
					y: 30,
					y2: 25
				},
				animation: false,
           		addDataAnimation: false,
				calculable: false,
				xAxis: [{
					type: 'category',
					boundaryGap: true,
					data: xdata,
					splitLine: {
						show: false,
					},
					axisLine: {
						lineStyle: {
							color: '#adadad',
							width: 0.1
						}
					},
					axisTick: {
						show: false,
					},
					axisLabel : {
			            show : true,
			            textStyle : {
			                color : '#adadad',
			                align : 'center'
			            }
			        }
				}],
				yAxis: [{
					type: 'value',
					min: minY||'0',
					max: maxY||'5.5',
					splitLine: {
						show: true,
						lineStyle: {
							color: '#adadad',
							width: 0.1
						}
					},
					axisLine: {
						show: false,
					},
					axisTick: {
						show: false,
					},
					axisLabel : {
			            show : true,
			            textStyle : {
			                color : '#adadad'
			            },
			            formatter: function (value, index) {
							var fixedValue = GHutils.toFixeds(value,2);
							return fixedValue;
						}
			        }
				}],
				series: [{
					type: 'bar',
					itemStyle: {
		                normal: {
		                    label : {
		                    	show: true,
		                    	position: 'top'
		                    }
		                }
		            },
					data: ydata
				}]
			};
			return rewardChartOption;
		}
	},
	getData:function(page,isFlag,productOid){
		var _this = this;
		GHutils.load({
			url: GHutils.API.PRODUCT.getTradeRecords+'?productOid='+productOid+'&page='+page+'&rows=10&orderType=invest&orderType=expGoldInvest&order=desc',//&orderStatus=confirmed
			data: {},
			type: "post",
			callback: function(result) {
				GHutils.log(result,"产品投资记录============")
				if(result.errorCode !=0){
					return false;
				}
				var columnDef = [
					{"name":"phoneNum","clazz":"p_l50"},
					{"name":"orderAmount",format:function(){return GHutils.formatCurrency(this.orderAmount)}},
					{"name":"orderTime"}
				]
				GHutils.table('#investRecords',columnDef,result.rows,"#noReCord")
				if(isFlag && result.total >0){
					_this.createPage(Math.ceil(result.total/10),productOid);
				}
			}
		})
		
	},
	productInformation:function(isValid){
		var _this = this;
		var investMoney =  parseFloat($('#invest').val())
		if(isValid){
			window.location.href = 'account-apply.html?moneyVolume=' + investMoney + '&productOid=' + _this.param.oid+'&pType=t0';
			return false;
		}
		//体验金产品
		if(GHutils.label(_this.param.productLabels,'8')){
			$(_this.tips).html('提示： 体验金 产品无法购买')
			return false;
		}
		if(GHutils.validate("investValidBox")){
			if(!investMoney){
				$(_this.tips).html('提示：  投资金额要大于0元')
				return false;
			}
			if(investMoney < _this.param.investMin){
				$(_this.tips).html('提示：  投资金额不能低于起投金额'+_this.param.investMin+'元')
				return false;
			}
			if(GHutils.Fdiv(GHutils.Fsub(investMoney,_this.param.investMin),_this.param.addMoney)%1 != 0){
				$(_this.tips).html('提示：  投资金额超出'+_this.param.investMin+'元部分必须为'+_this.param.addMoney+'元的整数倍。')
				return false;
			}
			GHutils.load({
				url: GHutils.API.PRODUCT.mholdvol+_this.param.oid,
				data: {},
				type: "post",
				callback: function(result) {
					if(GHutils.checkErrorCode(result,_this.tips)){
						var maxinvestMoney = GHutils.Fmul(GHutils.Fsub(_this.param.maxSaleVolume , _this.param.lockCollectedVolume),_this.param.netUnitShare);
						if(_this.param.maxHold){
							if(maxinvestMoney >  GHutils.Fsub(_this.param.maxHold , result.maxHoldVol)){
								maxinvestMoney =  GHutils.Fsub(_this.param.maxHold , result.maxHoldVol)
							}
							if(_this.param.investMax){
								if(maxinvestMoney > _this.param.investMax){
									maxinvestMoney = _this.param.investMax
								}
							}
						}else{
							if(!_this.param.investMax){
							}else{
								if(maxinvestMoney > _this.param.investMax){
									maxinvestMoney = _this.param.investMax
								}
							}
						}
						if(investMoney > maxinvestMoney){
							$(_this.tips).html('提示： 金额不能超过最大可投金额'+maxinvestMoney+'元')
							return false;
						}
						if(investMoney > _this.balance){
							$(_this.tips).html('提示：  您的账户可用余额不足')//，<a href="account-deposit.html" class="f_cred">去充值</a>
							return false;
						}
						GHrisk.getSid(function(_sid){
							GHrisk.getFxData(_sid,function(grade){
								if(Number((grade || "R1").substring(1)) < Number(GHutils.product.riskLevel.substring(1))){
									$("#pc_risk_level").html(GHutils.parseRiskLevel(grade || "R1").txt)
									$("#noRiskLevel").modal("show")
								}else{
									window.location.href = 'account-apply.html?moneyVolume=' + investMoney + '&productOid=' + _this.param.oid+'&pType=t0';
								}
							})
						});
					}
				}
			})
		}
	},
	successCallback:function(backData){
		var _this = this;
		GHutils.log(backData,"回调数据=====")
		_this.getUseraccount()
	},
	goStillCallback:function(){
		var _this = this;
		_this.productInformation(true);
	},
	toInvestPrapareCallback:function(){
		var _this = this;
		if(_this.action == "invest"){
			window.location.href="account-validate.html?action=invest&actionURL="+window.location.href;
		}else if(_this.action == "deposit"){
			var _href = window.location.href;
			if(_href.indexOf("?") > -1){
			  	var idx = _href.indexOf("?")
			  	_href = _href.substring(0,idx)
			}
			_href =  _href.substring(0,_href.lastIndexOf("/"))+"/account-deposit.html";
			window.location.href="account-validate.html?action=deposit&actionURL="+_href;
		}
	},
	getUseraccount:function(){
		var _this = this;
		GHutils.load({
			url:GHutils.API.ACCOUNT.useraccount,
			type:'post',
			callback:function(result){
				_this.loginStatus = false;
				if(result.errorCode == 10002){
					$("#userBalance").hide().next().hide().next().show()
				}else if(GHutils.checkErrorCode(result,$("#invest_errorMessage"))){
					_this.loginStatus = true;
					_this.balance = result.withdrawAvailableBalance
					$("#userBalance").html('<span>'+GHutils.formatCurrency(result.withdrawAvailableBalance)+'</span>元').show().next().next().hide()
				}
			}
		})
	}
}

$(function() {
	var huoQi = new HUOQI();
	huoQi.init();
	window.init = huoQi
})
