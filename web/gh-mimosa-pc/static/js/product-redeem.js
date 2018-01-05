var  ProductRedeem= function() {
	this.tips1 = $("#buyProduct");
	this.ok_pay = $("#ok_pay")
	this.param = GHutils.parseUrlParam(window.location.href)
	this.isOpenRemeed = '';
	this.previousCur = {};
	this.protocalMessage="";
	return this;
}

ProductRedeem.prototype =  {
	init: function() {
		this.maxRedeemMoney = 0;
		GHutils.isLogin()
		this.pageInit();
		this.bindEvent();
	},
	pageInit: function() {
		var _this = this
//		_this.getUserInfo();
		_this.getRedeemMoney();
		_this.getToDetail();
	},
	bindEvent: function() {
		var _this = this
		//密码框
		GHutils.inputPwd("#inputPayPwd"); 
		//输入框
		GHutils.checkInput($("#redeemMoney"),3);
		GHutils.checkInput($("#inputPayPwd"),5);
		//协议复选框
		GHutils.protocolCheck('#redeem-protocolcheck');
		
		setTimeout(function(){
			$("#redeemMoney").val('')
		},50)
		
		//点击确认支付
		_this.ok_pay.on('click',function(){
			$("#buyProduct").html("&nbsp;")
			if($(this).hasClass("btn_loading")){
				return
			}
			if(GHutils.validate('deposit-box')){
				if(!$('#redeem-protocolcheck').hasClass('active')){
					_this.tips1.html('提示：'+_this.protocalMessage)
					return false
				}
				//1.isOpenRemeed为"YES"可赎回
				if(_this.isOpenRemeed == "NO"){//1.不可超过单笔最大赎回金额
					_this.tips1.html('提示：不可赎回')
					return false;
				}
				var money = parseFloat($("#redeemMoney").val())
				if(_this.previousCur != {} && money >_this.previousCur.previousCurVolume){
					_this.tips1.html('提示：今日累计赎回已超出产品单日可赎回上限，请在下一交易日再发起赎回')
					return 
				}
				_this.ok_pay.addClass("btn_loading")
				//继续校验
				_this.myt0detail();
			}
		})
		
		//点击全部赎回
		$('#redeemAll').on('click',function(){
			//应该是获取全部的金额，放到框中
			var uraParam = GHutils.parseUrlParam(window.location.href)
			GHutils.load({  
				url: GHutils.API.ACCOUNT.prot0detail+'?productOid='+uraParam.productOid,
				data:{},
				type: "post",
				callback: function(result) {
					if(GHutils.checkErrorCode(result,_this.tips1 )){
						_this.maxRedeemMoney = result.redeemableHoldVolume;
						if(result.maxRredeem){
							if(_this.maxRedeemMoney > result.maxRredeem){
								_this.maxRedeemMoney = result.maxRredeem;
							}
						}
						$('#redeemMoney').val(_this.maxRedeemMoney)
					}
				}
			})
		})
	},
//	getUserInfo:function(){
//		var _this = this;
//		GHutils.load({
//			url: GHutils.API.ACCOUNT.userinfo,
//			data: {},
//			type: "post",
//			callback: function(result) {
//				GHutils.log(result,"用户=======");
//				if(GHutils.checkErrorCode(result,_this.tips1)){
////					$('#hasPayPwd').hide()
////	  				$('#noPayPwd').hide()
//	  				GHutils.userinfo = result
////	  				if(result.paypwd){
//	  					_this.ok_pay.addClass("active")
////						$('#hasPayPwd').show()
////						$('#noPayPwd').hide()
////					}else{
////						$('#noPayPwd').show()
////						$('#hasPayPwd').hide()
////						_this.ok_pay.removeClass("active").off();
////					}
//				}
//			}
//		})
//	},
	getRedeemMoney:function(){
		var _this = this;
		//获取可赎回金额
		GHutils.load({  
			url: GHutils.API.ACCOUNT.prot0detail+'?productOid='+_this.param.productOid,
			data:{},
			type: "post",
			callback: function(result) {
				GHutils.log(result,"可赎回金额=====");
				if(GHutils.checkErrorCode(result,_this.tips1 )){
					$('.redeem_money').html(GHutils.formatCurrency(result.redeemableHoldVolume))
					$("#redeemMoney").attr("placeholder",result.minRredeem+"元，"+result.additionalRredeem+"元递增")
					_this.maxRedeemMoney = result.redeemableHoldVolume;
					if(result.maxRredeem){
						if(_this.maxRedeemMoney > result.maxRredeem){
							_this.maxRedeemMoney = result.maxRredeem;
						}
						$("#pc_maxRredeem").html(GHutils.formatCurrency(result.maxRredeem)+'元')
					}else{
						$("#pc_maxRredeem").html('无限制')
					}
					$("#redeemMoney").keyup(function(){
						var _val = $(this).val();
						if(_val && Number(_val) > Number(_this.maxRedeemMoney)){
							_val = _this.maxRedeemMoney;
							$(this).blur().next().hide();
						}
						$(this).val(_val)
					})
				}
			}
		});
	},
	getToDetail:function(){
		var _this = this;
		GHutils.load({  
			url: GHutils.API.PRODUCT.gett0detail+'?oid='+_this.param.productOid,
			data:{},
			type: "post",
			callback: function(result) {
				GHutils.log(result,"产品详情========");
				if(GHutils.checkErrorCode(result,_this.tips1 )){
					GHutils.product = result
					$(".redeem_name").html(result.productName);
					_this.isOpenRemeed =result.isOpenRemeed

					if(result.isPreviousCurVolume == "YES"){
						_this.previousCur ={"previousCurVolume":result.previousCurVolume}
					}
					
					if(result.isOpenRemeed == "NO"){//1.不可超过单笔最大赎回金额
						_this.tips1.html('提示：不可赎回')
						_this.ok_pay.removeClass("btn_loading").removeClass("gh_btn_orange").addClass("gh_btn_disabled").off();
						return false;
					}





                    //动态展示协议
                    if(result.investFiles && result.investFiles.length > 0){
                        $("#investFiles").parent().removeClass("gh_none")
                        _this.protocalMessage="《投资协议》";
                    }
                    if(result.files && result.files.length > 0){
                        $("#files").parent().removeClass("gh_none")
                        if(_this.protocalMessage){
                            _this.protocalMessage+="、《投资说明书》"
                        }
                    }

                    if(result.serviceFiles && result.serviceFiles.length > 0){
                        $("#serviceFiles").parent().removeClass("gh_none")
                        if(_this.protocalMessage){
                            _this.protocalMessage+="和《风险提示书及平台免责声明》"
                        }
                    }
                    if( _this.protocalMessage.indexOf("、") == 0 ||  _this.protocalMessage.indexOf("和") == 0){
                        _this.protocalMessage = _this.protocalMessage.substr(1)
                    }
				}
			},
			errcallback: function(){
				_this.tips1.html("提示: 数据加载失败，刷新页面")
			}
		});
	},
	myt0detail:function(){
		var _this = this;
		GHutils.load({  
			url: GHutils.API.ACCOUNT.prot0detail+'?productOid='+_this.param.productOid,
			data:{},
			type: "post",
			callback: function(result) {
				GHutils.log(result,"产品可赎回金额============")
				if(GHutils.checkErrorCode(result,_this.tips1)){
					var redeemMoney =  Number($('#redeemMoney').val())
					if(result.singleDayRedeemCount && result.dayRedeemCount >= result.singleDayRedeemCount){//7.不可超过单人单数赎回次数上限
						_this.tips1.html("提示：产品已达当日最高赎回限制"+result.singleDayRedeemCount+"笔")
						_this.ok_pay.removeClass("btn_loading")
						return false
					}else if(!redeemMoney){
						_this.tips1.html("提示：请输入赎回金额")
						_this.ok_pay.removeClass("btn_loading")
						return false
					}else if(result.maxRredeem && redeemMoney > result.maxRredeem){//1.不可超过单笔最大赎回金额
						_this.tips1.html('提示：赎回金额不可超过单笔最大赎回金额'+result.maxRredeem+"元")
						_this.ok_pay.removeClass("btn_loading")
						return false;
					}else if(redeemMoney > result.redeemableHoldVolume){//2.不可超过剩余可赎回金额
						_this.tips1.html('提示：输入金额不可大于赎回限额'+result.redeemableHoldVolume+'元')
						_this.ok_pay.removeClass("btn_loading")
						return false;
					}else if(redeemMoney < result.minRredeem){//3.不可小于最低可赎回金额
						_this.tips1.html('提示：赎回金额不可小于起赎金额'+result.minRredeem+'元')
						_this.ok_pay.removeClass("btn_loading")
						return false;
					}else if(GHutils.Fdiv(GHutils.Fsub(redeemMoney, result.minRredeem), result.additionalRredeem).toString().indexOf('.') > 0){//4.赎回金额必须为最低金额+递增金额的整数倍
						_this.tips1.html('提示：赎回金额不可小于起赎金额'+result.minRredeem+'元,且以'+result.additionalRredeem+'元的整数倍递增')
						_this.ok_pay.removeClass("btn_loading")
						return false;
					}else if(result.singleDailyMaxRedeem && redeemMoney > GHutils.Fsub(result.singleDailyMaxRedeem, result.dayRedeemVolume)){//5.不可超过单人单日赎回上限
						_this.tips1.html('提示：赎回金额不可超过您的当日剩余可赎回金额 '+GHutils.Fsub(result.singleDailyMaxRedeem, result.dayRedeemVolume)+"元")
						_this.ok_pay.removeClass("btn_loading")
						return false;
					}else if(result.netMaxRredeemDay && redeemMoney > result.dailyNetMaxRredeem){//6.不可超过产品单日赎回上限
						_this.tips1.html('提示：不可超过产品单日赎回上限')
						_this.ok_pay.removeClass("btn_loading")
						return false;
					}
					_this.checkpaypwd()
				}
			}
		});
	},
	checkpaypwd:function() {
		var _this = this;
		GHutils.load({
			url: GHutils.API.USER.checkpaypwd,
			data:{
				payPwd:$('#inputPayPwd').val()
			},
			type: "post",
			callback: function(result) {
				if(GHutils.checkErrorCode(result,_this.tips1)){
					_this.redeemProduct()
				}
			}
		});
	},
	redeemProduct:function(){//赎回
		var _this = this;
		var productOid = _this.param.productOid, 
		orderAmount = Number($('#redeemMoney').val());
		GHutils.load({  
			url: GHutils.API.PRODUCT.performredeem,
			data:{
				productOid:productOid,
				orderAmount:orderAmount,
				cid:cid,
				ckey:ckey,
			},
			type: "post",
			callback: function(result) {
				if(GHutils.checkErrorCode(result,_this.tips1)){
					_this.ok_pay.removeClass("btn_loading")
					//赎回成功
					window.location.href = 'product-result.html?action=redeem&moneyVolume='+orderAmount+'&tradeOrderOid='+result.tradeOrderOid+"&productOid="+_this.param.productOid
					_this.ok_pay.removeClass("btn_loading")
				}
			}
		})
	},
	callBackFun:function(){
		var _this = this
		_this.pageInit();
	}
}

$(function() {
	new ProductRedeem().init();
	window.pageFun = new ProductRedeem();
})

