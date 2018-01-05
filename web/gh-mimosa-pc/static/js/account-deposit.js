var AccountDeposit = function() {
	this.tips = $("#deposit-errorMessage");
	this.verifycode = $('#deposit_verifycode');
	this.goPay = $('#goPay');
	this.btntime = null;
	this.payNo = null;
	this.payOneLimit=null;
	this.payChannel="bankcard";
	this.bankList="";
	this.enableClick = true;
	return this;
}

AccountDeposit.prototype =  {
	init: function() {
		GHutils.isLogin();
		this.pageInit();
		this.bindEvent();
	},
	pageInit: function() {
		var _this = this
		GHutils.checkInput($("#deposit-Money"),3);
		GHutils.checkInput($("#verifycode"),5);
		_this.limitamount();
		_this.getUserinfo();
	},
	getUserinfo:function(){//获取用户账户信息
		var _this = this;
		GHutils.load({
			url:GHutils.API.ACCOUNT.userinfo,
			type:'post',
			callback:function(result){
				GHutils.log(result,"用户信息=======")
				if(GHutils.checkErrorCode(result,_this.tips)){
					GHutils.userinfo = result
					var bankName = result.bankName
//					if(bankName){//已经绑卡
						$('#cardNo').html(bankName+'(**** **** '+result.bankCardNum.substring(4)+')')
						_this.getBankList(function(bankList){
							GHutils.getBankStyle(bankName,bankList,_this.tips,function(res){
//								$("#hasCard").show();
//								$("#noCard").hide();
								GHutils.log(res,"银行卡信息=========")
								var card = res.datas[0]
								$("#bankPhone").html(result.bankPhone)
//								$(".hascard-deposit").show()
								_this.goPay.addClass("active");
								_this.bindEvent()
							})
						})
//					}else{
////						$("#hasCard").hide();
////						$("#noCard").show();
////						$(".hascard-deposit").hide()
//						_this.goPay.removeClass("active").off();
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
                    _this.payOneLimit = result.rechageSingleQuota+0
                	var rechageSingleQuota = result.rechageSingleQuota+0;
                	if(rechageSingleQuota > 10000){
                        rechageSingleQuota =  GHutils.formatCurrency(GHutils.toFixeds(rechageSingleQuota/10000,2))+' 万'
					}else{
                        rechageSingleQuota =  GHutils.formatCurrency(rechageSingleQuota);
					}
                    var rechageDailyLimit = result.rechageDailyLimit+0;
                    if(rechageDailyLimit > 10000){
                        rechageDailyLimit =  GHutils.formatCurrency(GHutils.toFixeds(rechageDailyLimit/10000,2))+' 万'
                    }else{
                        rechageDailyLimit =  GHutils.formatCurrency(rechageDailyLimit);
                    }

                    $('#singleQuota').append('本卡单次限额 '+rechageSingleQuota+'元，'+'单日限额 '+rechageDailyLimit+'元')
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
	bindEvent: function() {
		var _this = this
		// //查看银行卡限额
		// $('#allBank').off().on('click',function(){
		// 	_this.tips.html('&nbsp;')
		// 	var columnDefine=[
		// 		{"name":"bankBigLogo","clazz":"col-xs-4","format":function(){return "<img width=130px src="+this.bankBigLogo+">"}},
		// 		{"name":"payOneLimit","format":function(){return GHutils.formatCurrency(this.payOneLimit)}},
		// 		{"name":"payDayLimit","format":function(){return GHutils.formatCurrency(this.payDayLimit)}},
		// 		{"name":"payMoonLimit","format":function(){return GHutils.formatCurrency(this.payMoonLimit)}}
		// 	]
		// 	_this.getBankList(function(bankList){
		// 		GHutils.table("#modal_content",columnDefine,bankList,"#modal_content-noRecord")
		// 		$('#content_box').modal('show')
		// 	});
		// })
		
		$(".deposit_channel").off().on('click',function(){
			$('.deposit_circle').removeClass("active")
			$(this).find(".deposit_circle").addClass("active")
			_this.payChannel = $(this).attr("data-type");
			if(_this.payChannel == "bankcard"){
				$('.hascard-deposit').show();
			}else if(_this.payChannel == "onlinebank"){
				$('.hascard-deposit').hide();
			}
		})
		
		_this.verifycode.off().on('click',function(){
			if($(this).hasClass('btn_loading')){
				return
			}
			$(this).addClass('btn_loading')
			_this.tips.html('&nbsp;')
			//1.判断是否绑卡
			if(!GHutils.userinfo.bankName){
				$(this).removeClass('btn_loading')
				_this.tips.html('提示：请先绑卡再充值')
				return 
			}
			var orderAmount = GHutils.trim($('#deposit-Money').val());
			if(!orderAmount){
				$(this).removeClass('btn_loading')
				_this.tips.html('提示：充值金额不能为空')
				return 
			}
			orderAmount = Number(orderAmount)
			if(orderAmount < 2){
				$(this).removeClass('btn_loading')
				_this.tips.html('提示：充值金额不可低于2元')
				return 
			}else if (_this.payOneLimit == null) {
				$(this).removeClass('btn_loading')
				_this.tips.html('提示：未获取到充值单笔限额，请刷新数据')
				return 
			}else if (_this.payOneLimit && orderAmount > _this.payOneLimit) {
				$(this).removeClass('btn_loading')
				_this.tips.html('提示：充值单笔限额不超过'+_this.payOneLimit+'元')
				return 
			}
			//2.校验数据格式是否正确
			if(GHutils.validate("moneyContainerDiv")){
				GHutils.load({
					url:GHutils.API.ACCOUNT.sendBankCode,
					data:{
						orderAmount:orderAmount
					},
					type:"post",
					callback:function(result){
						GHutils.log(result,"验证码====")
						if(GHutils.checkErrorCode(result,_this.tips)){
							_this.payNo = result.payNo
							GHutils.btnTime(_this.verifycode)
						}else{
                            $(this).removeClass('btn_loading')
						}
					}
				})
			}else{
				$(this).removeClass('btn_loading')
			}
		})
		
		_this.goPay.off().on('click',function(){
			if(!_this.enableClick){
				setTimeout(function(){
					_this.enableClick = true;
				},2000);
			}
			_this.enableClick = false;
			if($(this).hasClass('btn_loading')){
				return
			}
			_this.tips.html('&nbsp;')
			var orderAmount = GHutils.trim($('#deposit-Money').val());
			if(!orderAmount){
				_this.tips.html('提示：充值金额不能为空')
				return 
			}
			orderAmount = Number(orderAmount)
			if(_this.payChannel == "bankcard"){
				_this.bankCardPay(orderAmount);
			}else if(_this.payChannel == "onlinebank"){
				_this.onlineBankPay(orderAmount);
			}
		})
	},
	bankCardPay:function(orderAmount){//银行卡支付
		var _this = this;
			//1.判断是否绑卡
			if(!GHutils.userinfo){
				_this.tips.html('提示：数据未加载成功，请等待或刷新页面')
			}else if(!GHutils.userinfo.bankName){
				_this.tips.html('提示：请先绑卡再充值')
			}else  if(orderAmount < 2){
				_this.tips.html('提示：充值金额不可低于2元')
			}else if (_this.payOneLimit == null) {
				_this.tips.html('提示：未获取到充值单笔限额，请刷新数据')
			}else if (_this.payOneLimit && orderAmount > _this.payOneLimit) {
				_this.tips.html('提示：充值单笔限额不超过'+_this.payOneLimit+'元')
			}else if(!_this.payNo){
				_this.tips.html('提示：请先获取短信验证码再充值')
			}else{
				//2.校验数据格式是否正确
				if(GHutils.validate("deposit-box")){
					_this.goPay.addClass('btn_loading')
					//3.充值
					GHutils.load({
						url:GHutils.API.ACCOUNT.deposit,
						data:{
							orderAmount:GHutils.trim($('#deposit-Money').val()),
							payNo:_this.payNo,
							smsCode:GHutils.trim($('#verifycode').val())
						},
						type:"post",
						callback:function(result){
//							_this.goPay.html('确认支付')
							if(GHutils.checkErrorCode(result,_this.tips)){
								GHutils.log(result,"充值===========")
								window.location.href="product-result.html?action=deposit&bankOrderOid="+result.bankOrderOid+'&moneyVolume='+GHutils.trim($('#deposit-Money').val())
							}
						},
						errcallback:function(){
							_this.goPay.removeClass("btn_loading")
							_this.tips.html('提示：请求超时，请到用户中心查看交易单记录')
						}
					})
					
				}
			}
	},
	onlineBankPay:function(orderAmount){//网银支付
		var _this = this;
		if(GHutils.validate("moneyContainerDiv")){
			var _url = GHutils.API.ACCOUNT.apideposit+"?orderAmount="+orderAmount+"&returnUrl="+returnUrl+'product-result.html?action=deposit@'+orderAmount;
			_this.goPay.parent().attr('target',"_blank").attr('href',_url);
			setTimeout(function(){
				_this.goPay.parent().removeAttr("target").attr("href","javascript:;")
			},1000)
		}
	},
	callBackFun:function(){
		var _this = this
		_this.pageInit();
		_this.bindEvent()
	}
}

$(function() {
	var accountDeposit = new AccountDeposit()
	accountDeposit.init();
	window.pageFun = accountDeposit;
})

