var AccountWithdraw = function() {
	this.tips = $("#withdraw-errorMessage");
	this.gowithdraw = $("#gowithdraw");
	this.withdrawCash= $("#withdraw-cash");
	this.balance = 0;
	this.fee = 0
	this.enableClick  = true;
	this.payOneLimit = 0;
	return this;
}

AccountWithdraw.prototype =  {
	init: function() {
		GHutils.isLogin();
		this.pageInit();
		this.bindEvent();
	},
	pageInit: function() {
		var _this = this;
		_this.limitamount();
		_this.getUserInfo();
		_this.getMoneyInfo();
	},
	bindEvent: function() {
		var _this = this
		GHutils.checkInput($("#withdraw-Money"),3);
		GHutils.checkInput($("#payPwd"),5);
		GHutils.inputPwd("#payPwd")
		setTimeout(function(){
			$("#withdraw-Money").val('')
		},50)
		GHutils.IEInputClear("#withdraw-Money",function(){ //ie input点击叉叉清空内容自定义事件
			$('.rest').html('--')
		})    
		    
		$('#allBank').off().on('click',function(){
			_this.tips.html('&nbsp;')
			var columnDefine=[
				{"name":"bankBigLogo","clazz":"col-xs-4","format":function(){return "<img width=130px src="+this.bankBigLogo+">"}},
				{"name":"payOneLimit","format":function(){return GHutils.formatCurrency(this.payOneLimit)}},
				{"name":"payDayLimit","format":function(){return GHutils.formatCurrency(this.payDayLimit)}},
				{"name":"payMoonLimit","format":function(){return GHutils.formatCurrency(this.payMoonLimit)}}
			]
			GHutils.load({
				url:GHutils.API.ACCOUNT.bankList,
				type:'post',
				callback:function(result){
					if(GHutils.checkErrorCode(result,_this.tips)){
						GHutils.table("#modal_content",columnDefine,result.datas,"#modal_content-noRecord")
						$('#content_box').modal('show')
					}
				}
			})
			
		})
	},
	getUserInfo:function(){
		var _this = this;
		GHutils.load({
			url: GHutils.API.ACCOUNT.userinfo,
			data: {},
			type: "post",
			callback: function(result) {
				GHutils.log(result,"用户信息=======")
				if(GHutils.checkErrorCode(result,$(this.tips ))){
					GHutils.userinfo = result
					//判断是否已经设置交易密码
//					if(result.paypwd){
//						$('#hasPayPwd').show().prev().hide()
//					}else{
//						$('#hasPayPwd').hide().prev().show()
//					}
					//判断是否已经绑卡
					var bankName = result.bankName
//					if(bankName){
						$('#cardNo').html(bankName+'(**** **** '+result.bankCardNum.substring(4)+')')
						_this.getBankList(function(bankList){
							GHutils.getBankStyle(bankName,bankList,_this.tips,function(res){
//								$("#hasCard").show().next().hide();
								GHutils.log(res,"银行卡信息=========")
								$("#bankPhone").html(result.bankPhone)
//								if(result.paypwd){
								_this.gowithdraw.addClass("active");
								_this.withdrawEvent();
//								}else{
//									_this.gowithdraw.removeClass("active").off();
//								}
							})
						})
//					}else{
////						$('#hasCard').hide().next().show()
//						_this.gowithdraw.removeClass("active").off();
//					}
				}
			}
		})
	},
    limitamount:function(){//获取用户账户信息
        var _this = this;
        GHutils.load({
            url:GHutils.API.ACCOUNT.limitamount,
            type:'post',
            async:false,
            callback:function(result){
                GHutils.log(result,"限额=======")
                if(GHutils.checkErrorCode(result,_this.tips)){
                    _this.payOneLimit = result.withdrawalsSingleQuota+0

                    var withdrawalsSingleQuota = result.withdrawalsSingleQuota+0;
                    if(withdrawalsSingleQuota > 10000){
                        withdrawalsSingleQuota =  GHutils.formatCurrency(GHutils.toFixeds(withdrawalsSingleQuota/10000,2))+' 万'
                    }else{
                        withdrawalsSingleQuota =  GHutils.formatCurrency(withdrawalsSingleQuota);
                    }
                    var withdrawalsDailyLimit = result.withdrawalsDailyLimit+0;
                    if(withdrawalsDailyLimit > 10000){
                        withdrawalsDailyLimit =  GHutils.formatCurrency(GHutils.toFixeds(withdrawalsDailyLimit/10000,2))+' 万'
                    }else{
                        withdrawalsDailyLimit =  GHutils.formatCurrency(withdrawalsDailyLimit);
                    }

                    $('#singleQuota').append('本卡单次限额 '+withdrawalsSingleQuota+'元，'+'单日限额 '+withdrawalsDailyLimit+'元')





                }
            }
        })
    },
	getBankList:function(cb){//获取银行卡列表信息
		var _this = this;
		GHutils.load({
			url:GHutils.API.ACCOUNT.bankList,
			type:'post',
			callback:function(result){
				GHutils.log(result,"银行卡限额=======");
				if(GHutils.checkErrorCode(result,_this.tips)){
					if(cb && typeof(cb)=="function"){
						cb.apply(null,[result.datas]);
					}
				}
			}
		})
	},
	getMoneyInfo:function(){
		var _this = this;
		GHutils.load({
			url: GHutils.API.ACCOUNT.usermoneyinfo,
			data: {},
			type: "post",
			callback: function(result) {
				GHutils.log(result,"账户信息=========")
				if(GHutils.checkErrorCode(result,_this.tips)){
					_this.balance = (result.withdrawAvailableBalance+0)

                    var canWithDraw = _this.balance;
                    if(_this.payOneLimit && _this.payOneLimit < canWithDraw) {
                        canWithDraw = _this.payOneLimit
                    }

                    //页面显示账户余额
					$('.withdraw_all_cash').html(GHutils.formatCurrency(canWithDraw)+"元")
					$('#withdraw-Money')
					.keyup(function() {
						var _val =$('#withdraw-Money').val();
						if(_val && Number(_val) > Number(_this.balance)){
							_val = _this.balance;
							$('#withdraw-Money').blur().next().hide();
						}
						$('#withdraw-Money').val(_val)
			        	
						if(_val > _this.fee){
							$('.rest').html(GHutils.formatCurrency(GHutils.Fsub(_val,_this.fee)))
						}else{
							$('.rest').html('--')
						}
				      
				    })
				    .on("contextmenu",function(e){//禁止鼠标右键弹出操作选项列表
						e.preventDefault();
					})
					
					
					
					var monthWithdrawCount = result.monthWithdrawCount+0//当月已经提现次数
					GHutils.checkEnable('WithdrawNum','',function(times){//获取免费提现次数
						if(monthWithdrawCount >= Number(times)){
							GHutils.checkEnable('TradingDayWithdrawFee','',function(fee){//获取手续费
								_this.fee = Number(fee)
								$("#fee").html(fee)
							})
						}else{
							$("#fee").html(0)
						}
					})
				}
			}
		})
	},
	withdrawEvent:function(){//提现按钮点击事件
		var _this = this;
		//点击确认提现
		_this.gowithdraw.off().on('click',function(){
			if(!_this.enableClick){
				setTimeout(function(){
					_this.enableClick = true;
				},2000);
			}
			_this.enableClick = false;
			if($(this).is('.btn_loading')){
				return false;
			}
			_this.tips.html('&nbsp;')
			if(!GHutils.userinfo){
				GHutils.userinfo = GHutils.getUserInfo();
			}
			if(!GHutils.userinfo){
				_this.tips.html('数据未加载成功，请等待或刷新页面')
				return false;
			}else if(!GHutils.userinfo.bankName){//没有绑卡
				_this.tips.html('提示：请绑定银行卡再提现')
				return false;
			}
			if(!GHutils.userinfo.paypwd){//没有设置交易密码
				_this.tips.html('提示：请设置交易密码再提现')
				return false;
			}
			if(GHutils.validate('withdraw-box')){
				var money = parseFloat($('#withdraw-Money').val())
				if(money<=0){
					_this.tips.html('提示： 提现金额必须大于0元')
					return false;
				}
				if(_this.fee){//如果有手续费，提现金额必须大于手续费
					if(money<=_this.fee){
						_this.tips.html('提示： 提现金额必须大于手续费'+_this.fee+'元')
						return false;
					}
				}
                if(_this.payOneLimit && _this.payOneLimit < money) {
                    _this.tips.html('提示： 提现金额不能超过'+_this.payOneLimit+'元')
                    return false;
                }
				_this.gowithdraw.addClass('btn_loading')
				GHutils.isLogin(function(){
					_this.checkPayPwd(money);
				});
			}
		})
	},
	checkPayPwd:function(money){//校验支付密码
		var _this = this;
		GHutils.load({
			url: GHutils.API.USER.checkpaypwd,
			data:{
				payPwd:GHutils.trim($('#payPwd').val())
			},
			type: "post",
			callback: function(result) {
				if(GHutils.checkErrorCode(result,_this.tips)){
					if(_this.balance < money){
//						_this.gowithdraw.removeClass('btn_loading')
						_this.tips.html('提示：账户余额不足')
						return false;
					}
					_this.withd(status,money)
				}
				
			}
		});
	},
	withd:function(statu,money){
		var _this = this;
		GHutils.load({
			url: GHutils.API.ACCOUNT.withdraw,
			data:{
				orderAmount:money
			},
			type: "post",
			callback: function(result) {
				_this.gowithdraw.removeClass('btn_loading')
				if(GHutils.checkErrorCode(result,_this.tips)){
					window.location.href = 'product-result.html?action=withdraw&moneyVolume='+money+'&fee='+_this.fee
				}
			}
		});
	},
	callBackFun:function(){
		var _this = this
		_this.pageInit();
		_this.withdrawEvent();
	}
}

$(function() {
	new AccountWithdraw().init();
	window.pageFun = new AccountWithdraw();
})
