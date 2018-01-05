var HUOQI = function() {
	this.tips = $("#invest_errorMessage");
	this.param = null;
	this.balance = 0;
	this.loginStatus = false;
	this.action = "invest";
	return this;
}

HUOQI.prototype =  {
	init: function() {
		this.pageInit();
		this.bindEvent();
	},
	pageInit: function() {
		var _this = this;
		var content ={
			serviceFilesContent:'',
			investFilesContent:''
		}
		var uraParam = GHutils.parseUrlParam(window.location.href)
		if(uraParam.productOid){
			productInfo(uraParam.productOid)
			_this.getUseraccount();
			return false;
		}else{
			window.location.href="product-tn-list.html"
		}
		
		//产品详情
		function productInfo(oid){
			GHutils.load({
				url: GHutils.API.PRODUCT.getproductdetail+'?oid='+oid,
				data: {},
				type: "post",
				callback: function(result) {
					GHutils.log(result,"定期详情============")
					if(result.errorCode == 90000){
						window.location.href="product-tn-list.html"
						return false;
					}else if(result.errorCode != 0){
						_this.tips.html('提示： '+result.errorMessage)
						$('#goInvest').off().removeClass("gh_btn_orange").addClass("gh_btn_disabled");
						return false;
					}
					result.investMin+=0
					result.investMax+=0
					result.incomeCalcBasis = parseInt(result.incomeCalcBasis)
					_this.param = result
					GHutils.product = result
					_this.param.addMoney = GHutils.Fmul(result.investAdditional,result.netUnitShare)
					$('#productName').html(result.productName)

					var risk = {"R1":"保守型","R2":"稳健型","R3":"平衡型","R4":"积极型","R5":"进取型"}
					var riskLevel = risk[(result.riskLevel)]
					$(".riskLevel").html(riskLevel)
					$(".introduce-risklevel").html(result.riskLevel+"("+riskLevel+")")
					var templateData = '{{annualInterestSec}}%{{#rewardInterest}}<span class="f_35">+{{rewardInterest}}%</span>{{/rewardInterest}}';
					var data = {"annualInterestSec":result.annualInterestSec,"rewardInterest":result.rewardInterest?GHutils.toFixeds(result.rewardInterest, 2):null}
					GHutils.mustcacheStr(templateData,"#annualInterestSec",data)
					
					var labels = "";
					GHutils.forEach(result.productLabels,function(idx,label){
						if(label.labelCode =='1'){
							$(".gh_icon_basical_new").removeClass('gh_none')
						}else{
							labels += '<span class="gh_icon_tag gh_tag_general f_12">' +label.labelName + '</span>';
						}
					})
					$('#tn-label').html(labels)
					var raisedTotalNumber = result.raisedTotalNumber ;
					
					$('#lockPeriodDays').html(result.durationPeriod)
					$('#lockPeriodDays_1').html(result.durationPeriod)
					$('#investMin').html(_this.param.investMin)
					$('#income').html(_this.param.investMin+' 元起投，'+_this.param.addMoney+' 元递增')
					$("#introduct-investMoney").html(_this.param.investMin+' 元起投，'+_this.param.addMoney+' 元递增')
					var processer = GHutils.Fmul(result.raisePercentage,100)
					
					if(result.state == "waitToSale" || result.state == "notAllowedSale" || result.state == "saleOut"){
						$('#goInvest').removeClass("gh_btn_orange").addClass("gh_btn_disabled").html(result.stateDisp).off();
						processer = 100;
					}
					$('#progressbar').css('width',processer+'%').addClass("process_tn").parent().next().html(processer+'%')
					
					var remainMoney =0;
					if(processer != 100){
						remainMoney =result.remainderSaleVolume;
					}
					$('#tnProcess').html('<li class="gh_col_6 gh_line_overflow"><span class="f_14 f_c0 ">募集总额(万元) ：'+GHutils.formatCurrency(raisedTotalNumber/10000)+'</span></li><li class="gh_col_6 gh_tright gh_line_overflow"><span class="f_14 f_c0">剩余可投 (元) ：'+GHutils.formatCurrency(remainMoney)+'</span></li>')
					$("#introduce-purchasingAmount").html(_this.param.investMin)
					$("#introduce-increaseAmount").html(_this.param.addMoney)
					$('.introduce-productName').html(result.productName)
					$('#introduce-investDay').html(result.raiseStartDate)
					$('#introduce-interestsStartDate').html(result.setupDate)
					$('#introduce-repayDate').html(result.matureDate)
					$("#calculator").attr('data-incomeCalcBasis',result.incomeCalcBasis)
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
		      $('#invest').keyup(function (e) {
		      		var money = $(this).val()
		        	$('#income').html('')
		        	$(_this.tips).html('&nbsp;')
		        	investMoney = 0
	        		if(money){
	        			if(GHutils.validate("investValidBox")){
							investMoney = parseFloat(money)
							$('#income').html('预计收益 '+_this.calculateIncome(investMoney))
	        			}
	        		}else{
	        			$('#income').html(_this.param.investMin+' 元起投，'+_this.param.addMoney+' 元递增')
	        		}
	        		if(_this.loginStatus && _this.balance < investMoney){
						$(".toDeposit").show();
					}else{
						$(".toDeposit").hide();
					}
		      }/*.bind(this)*/)
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
		GHutils.IEInputClear("#invest",function(){//ie input点击叉叉清空内容自定义事件
			if(_this.param){
				$('#income').html(_this.param.investMin+' 元起投，'+_this.param.addMoney+' 元递增')
			}
		})

		//点击减号
		$('#descInvest').on('click',function(){
			if(!_this.param){
				return
			}
			var money = $('#invest').val()
			if(money){
				if( !/^\d+(\.\d+)?$/.test(money)){
					_this.tips.html('提示： 金额格式不正确')
					return false;
				}
			}
			investMoney = parseFloat(money == ''?0:money)
			investMoney = GHutils.Fsub(investMoney , _this.param.addMoney)
			if(investMoney < _this.param.investMin || investMoney==0){
				$('#invest').val('')
				investMoney = 0
				$('#income').html(_this.param.investMin+' 元起投，'+_this.param.addMoney+' 元递增')
				return false;
			}
			if(_this.loginStatus && _this.balance < investMoney){
				$(".toDeposit").show();
			}else{
				$(".toDeposit").hide();
			}
			$('#invest').val(investMoney)
			$('#income').html('预计收益 '+_this.calculateIncome(investMoney))
		})
		
		//点击加号图标
		$('#adInvest').on('click',function(){
			if(!_this.param){
				return
			}
			var money = $('#invest').val()
			if(money){
				if(!/^\d+(\.\d+)?$/.test(money)){
					_this.tips.html('提示： 金额格式不正确')
					return false;
				}
			}
			investMoney = parseFloat(money == ''?0:money)
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
			$('#income').html('预计收益 '+_this.calculateIncome(investMoney))
			
		})
		
		//点击立即抢购
		$('#goInvest').on('click',function(){
			_this.action = "invest";
			$(_this.tips).html("&nbsp;")
			GHutils.isLogin(function(){
				if(GHrisk.checkDWcomplete(true)){
					_this.checkInvestMoney();
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
	checkInvestMoney:function(isValid){
		var _this =this;
		var investMoney =  parseFloat($('#invest').val())
		if(isValid){
			window.location.href = 'account-apply.html?moneyVolume=' + investMoney + '&productOid=' + _this.param.oid+'&pType=tn';
			return false;
		}
		//判断体验金产品
		if(GHutils.label(_this.param.productLabels,'8')){
			_this.tips.html('提示： 体验金产品无法购买')
			return false;
		}
		//判断新手标
		var isFresh = GHutils.label(_this.param.productLabels,'1')//判断是否是新手标产品
		_this.usermoneyinfo(function(){
			checkInvestMoney(investMoney);
		},isFresh)
		
		function checkInvestMoney(investMoney){
			// 判断金额
			if(GHutils.validate("investValidBox")){
				if(!_this.param){
					_this.tips.html('提示：  产品不存在!')
					return false;
				}
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
				//剩余可投
				var  maxInvestMoney =  GHutils.Fmul(GHutils.Fsub(_this.param.maxSaleVolume, _this.param.lockCollectedVolume), _this.param.netUnitShare)//产品剩余可投金额
				if(_this.param.investMax){
					var singleInvestMax = GHutils.Fmul(_this.param.investMax, _this.param.netUnitShare)
					if(maxInvestMoney > singleInvestMax){
						maxInvestMoney = singleInvestMax
					}
				}else{
				}
				if(investMoney > maxInvestMoney){
					_this.tips.html('提示： 金额不能超过剩余可投金额'+maxInvestMoney+"元")
					return false;
				}
				if(investMoney > _this.balance){
					$(_this.tips).html('提示：  您的账户可用余额不足')
					return false;
				}
				//投资者与投资产品风险等级是否匹配
				GHrisk.getSid(function(_sid){
					GHrisk.getFxData(_sid,function(grade){
						if(Number((grade || "R1").substring(1)) < Number(GHutils.product.riskLevel.substring(1))){
							$("#pc_risk_level").html(GHutils.parseRiskLevel(grade || "R1").txt)
							$("#noRiskLevel").modal("show")
						}else{
							window.location.href = 'account-apply.html?moneyVolume=' + investMoney + '&productOid=' + _this.param.oid+'&pType=tn';
						}
					})
				});
			}
		}
	},
	usermoneyinfo:function(func,isFresh){
		var _this = this;
		if(isFresh){
			GHutils.load({
				url: GHutils.API.ACCOUNT.usermoneyinfo,
				data: {},
				type: "post",
				callback: function(result) {
					if(GHutils.checkErrorCode(result,_this.tips)){
						if(isFresh){//是新手产品
							if(result.isFreshman != 'yes' ){
								_this.tips.html('提示： 此产品只限新手申购')
								return false
							}
						}
						func()
					}
				}
			})
		}else{
			func()
		}
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
	getData:function(page,isFlag,productOid){
		var _this = this;
		GHutils.load({
			url: GHutils.API.PRODUCT.getTradeRecords+'?productOid='+productOid+'&page='+page+'&rows=10&orderType=invest&order=desc',//&orderStatus=confirmed
			data: {},
			type: "post",
			callback: function(result) {
				GHutils.log(result,"产品购买记录==============")
				if(result.errorCode !=0){
					return false;
				}
				var columnDef = [//format
					{"name":"phoneNum","clazz":"p_l50"},
					{"name":"orderAmount",format:function(){return GHutils.formatCurrency(this.orderAmount)}},
					{"name":"orderTime"}
				]
				GHutils.table('#investRecords',columnDef,result.rows,"#noReCord")
				if(isFlag && result.total > 0){
					_this.createPage(Math.ceil(result.total/10),productOid);
				}
			}
		})
	},
	calculateIncome:function(investMoney){
		var _this = this;
		function countIncome(){
			var procent =null;
			var income = ''
			var rewardInterest = parseFloat(_this.param.rewardInterest+0)
			if(_this.param.annualInterestSec.indexOf('-')>-1){
				procent = _this.param.annualInterestSec.split('-')
				var min = parseFloat(procent[0].split('%')[0])+parseFloat(rewardInterest)
				var max = parseFloat(procent[1].split('%')[0])+parseFloat(rewardInterest)
				income = GHutils.formatCurrency(GHutils.toFixeds(coculateIncome(investMoney,min,_this.param.durationPeriod,_this.param.incomeCalcBasis),2))+'到 '
				income+= GHutils.formatCurrency(GHutils.toFixeds(coculateIncome(investMoney,max,_this.param.durationPeriod,_this.param.incomeCalcBasis),2))+' 元'
			}else{
				procent = parseFloat(_this.param.annualInterestSec.split('%')[0])+parseFloat(rewardInterest)
				income = GHutils.formatCurrency(GHutils.toFixeds(coculateIncome(investMoney,procent,_this.param.durationPeriod,_this.param.incomeCalcBasis),2))+' 元'
			}
			return income
		}
		
		function coculateIncome(investMoney,procent,n,incomeCalcBasis){
			var a = GHutils.Fmul(investMoney , GHutils.Fdiv(procent,100))
			var b = GHutils.Fdiv(n,incomeCalcBasis)
			return GHutils.Fmul(a,b)
		}
		return countIncome();
	},
	successCallback:function(backData){
		var _this = this;
		GHutils.log(backData,"回调数据=====")
		_this.getUseraccount()
	},
	goStillCallback:function(){
		var _this = this;
		_this.checkInvestMoney(true);
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
				}else if(GHutils.checkErrorCode(result,_this.tips)){
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
