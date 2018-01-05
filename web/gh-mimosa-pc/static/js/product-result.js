var T0Success = function() {
	return this;
}

T0Success.prototype =  {
	init: function() {
		GHutils.isLogin();
		this.pageInit();
		this.bindEvent();
	},
	pageInit: function() {
		var _this = this
		var uraParam = GHutils.parseUrlParam(window.location.href)
		
		//产品申购
		if(uraParam.action && uraParam.action == 'apply' && uraParam.tradeOrderOid && uraParam.productName &&  typeof(uraParam.moneyVolume) =="number" && uraParam.moneyVolume > 0   &&  uraParam.pType){
			$('#loading').show()
			_this.getTradeStatus(0,uraParam)
				var dataInvestment = {
					type:'investment',
					singleInvestAmount:uraParam.moneyVolume
				}
				REDPACKET.init(dataInvestment);
			if(uraParam.pType == 'tn'){
				$('#toInvest').attr('href','product-tn-list.html')
			}
			return false;
		}
		
		//产品赎回
		if(uraParam.productOid && uraParam.tradeOrderOid && uraParam.action && typeof(uraParam.moneyVolume) =="number" && uraParam.moneyVolume > 0   && uraParam.action == "redeem"){
			$('#loading').show()
			$("#redeemMoney").html(uraParam.moneyVolume)
			$("#toRedeem").attr('href',"product-redeem?"+uraParam.productOid)
			GHutils.getSystime(function(systime){
				$("#redeemTime").html(systime.substr(0,10))
			})
			_this.getTradeStatus(0,uraParam)
			$("#redeemSuccess").show()
			var dataInvestment = {
				type:'redeem',
				singleInvestAmount:uraParam.moneyVolume
			}
			REDPACKET.init(dataInvestment);
			return
		}
		
		//提现成功
		if(uraParam.action && typeof(uraParam.moneyVolume) =="number" && uraParam.moneyVolume > 0   && typeof(uraParam.fee) =="number" && uraParam.fee >= 0 &&  uraParam.action == 'withdraw'){
			$('#withdraw').show()
			$('.withdraw-money').html(GHutils.formatCurrency(uraParam.moneyVolume))
			$("#fee").html(GHutils.formatCurrency(uraParam.fee))
			$("#restMoney").html(GHutils.formatCurrency(GHutils.Fsub(uraParam.moneyVolume,uraParam.fee)))
			GHutils.getSystime(function(systime){
				$("#withdraw-time").html(systime)
			})
			return false;
		}
		
		//充值
		if(uraParam.action=="deposit" && uraParam.bankOrderOid && typeof(uraParam.moneyVolume) =="number" && uraParam.moneyVolume > 0 ){
			$('#loading').show()
			_this.checkBankOrderStatus(0,uraParam.bankOrderOid,uraParam.moneyVolume)
			var dataRecharge = {
					type:'recharge',
					singleInvestAmount:0
				}
			REDPACKET.init(dataRecharge);
			return false;
		}
		
		window.location.href = 'index.html'
	},
	checkBankOrderStatus:function(times,bankOrderOid,moneyVolume){
		var _this = this;
		GHutils.load({
			url:GHutils.API.ORDER.depositisdone,
			data:{
				bankOrderOid:bankOrderOid
			},
			type:'post',
			callback:function(result){
				GHutils.log(result,"充值成功===============")
				if(result.errorCode == 0){//充值成功
					$('#loading').hide()
					$("#deposit-money").html(GHutils.formatCurrency(moneyVolume))
					$("#deposit-success").show()
					$("#deposit").show()
				}else if(result.errorCode == -1){//处理中
					if(times<10){
						times++;
						setTimeout(function(){_this.checkBankOrderStatus(times,bankOrderOid,moneyVolume)},2000)//5秒执行一次
					}else{
						$('#loading').hide()
						$("#waiting-title").html('充值')
						$('#waiting').show()
						//显示等待样式
					}
				}else{//其他异常报错
					//显示错误信息
					$('#loading').hide()
					$("#deposit-failedMessaage").html(result.errorMessage)
					$("#deposit-failed").show()
					$("#deposit").show()
				}
			},
			errcallback:function(){
				if(times<10){
					times++;
					setTimeout(function(){_this.checkBankOrderStatus(times,bankOrderOid,moneyVolume)},2000)//5秒执行一次
				}else{
					$('#loading').hide()
					$("#waiting-title").html('充值')
					$('#waiting').show()
					//显示等待样式
				}
			}
		})
	},
	getTradeStatus:function(times,uraParam){
		var _this = this;
			//订单详情
			GHutils.load({
				url: GHutils.API.ORDER.investisdone+'?tradeOrderOid='+uraParam.tradeOrderOid,
				data:{
					tradeOrderOid:uraParam.tradeOrderOid
				},
				type: "post",
				callback: function(result) {
					if(result.errorCode == -1) {//支付尚未完成
						if(times < 10){
							times +=1;
							setTimeout(function(){_this.getTradeStatus(times,uraParam)},2000)//5秒执行一次
						}else{
							$('#loading').hide()
							if(uraParam.action == "apply"){
//								if(uraParam.pType == 'tn'){
////									$('#waiting').css({"margin-top":"150px"});
////									$('#loading').html('订单已经提交<br />请到 <a href="account-record.html" style="font-size: 24px;">交易记录</a> 查看结果<em></em>')
////									$('.row_img').hide();
////									$('#loading').addClass('result_loading');
//									
//								}else{
//									$('#waiting').css({"margin-top":"150px"});
//									$('#loading').html('订单已经提交<br />请到 <a href="account-record.html" style="font-size: 24px;">交易记录</a> 查看结果<em></em>')
//									$('.row_img').hide();
//									$('#loading').addClass('result_loading');
//								}
								$("#waiting-title").html('申购')
							}else if(uraParam.action == "redeem"){
								$("#waiting-title").html('赎回')
							}
							$("#waiting").show()
						}
						return false;
					}else if(result.errorCode != 0){
						if(uraParam.action == "apply"){
							//失败
							$('#invest_failedMessaage').html(result.errorMessage)
							$('#loading').hide()
							$("#investSuccess").removeClass("gh_none")
							$("#invest_failed").removeClass("gh_none")
							return false;
						}else if(uraParam.action == "redeem"){
							$('#redeem-failedMessaage').html(result.errorMessage)
							$('#loading').hide()
							$("#redeem").removeClass("gh_none")
							$("#redeem-failed").removeClass("gh_none")
							return false;
						}
					}
					
					if(uraParam.action == "apply"){
						$('#result_title').html('恭喜您，成功投资'+decodeURI(uraParam.productName)+' <span>'+uraParam.moneyVolume+'</span>  元')
						$('#success-item').html('<div class="gh_c2">投资'+decodeURI(uraParam.productName)+'<span class="gh_crate gh_ml10">'+uraParam.moneyVolume+'元</span></div>')
						$('#beginInterestDate').html(result.beginInterestDate.replace(/-/g, '/'))
						if(uraParam.pType == 't0'){
							$('#interestArrivedDate').parent().parent().hide();
							$('.line_two').hide();
						}else{
							$('#interestArrivedDate').html(result.interestArrivedDate.replace(/-/g, '/'))
						}
						$('#loading').hide()
						$("#investSuccess").removeClass("gh_none")
						$("#investSuccess2").removeClass("gh_none")
					}else if(uraParam.action == "redeem"){
						$("#redeemArriveTime").html(result.redeemArrivedDate)
						$("#redeemArriveDay").html(GHutils.formatTimestamp({}))
						$('#loading').hide()
						$('#redeem').show()
						$('#redeemSuccess').show()
					}
				},
				errcallback:function(){
					if(times < 10){
						times +=1;
						setTimeout(function(){_this.getTradeStatus(times,uraParam)},2000)//5秒执行一次
					}else{
						$('#loading').hide()
						if(uraParam.action == "apply"){
							$("#waiting-title").html('申购')
						}else if(uraParam.action == "redeem"){
							$("#waiting-title").html('赎回')
						}
						$("#waiting").show()
					}
				}
			});
	},
	bindEvent: function() {
		var _this = this
		$('#toRecord').on('click',function(){
			window.location.href = 'account-tradelist.html'
		})
		$('.account').on('click',function(){
			window.location.href = 'account.html'
		})
	}
}

$(function() {
	new T0Success().init();
})

