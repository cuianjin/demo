var  AccountApply= function() {
	this.tip = $("#apply-errorMessage");
	this.okpay = $('#ok_pay');
	this.product = {};
	this.couponList = [];
	this.coupon = {
		amount:0
	}
	this.experience=false;
	this.suitable={}
	this.uraParam = GHutils.parseUrlParam(window.location.href)
	this.balance = 0;
	this.enableClick = true;
	this.protocalMessage="";
	return this;
}

AccountApply.prototype =  {
	init: function() {
		GHutils.isLogin()
		this.pageInit();
		this.bindEvent();
	},
	pageInit: function() {
		var _this = this
		if(!(_this.uraParam.productOid && typeof(_this.uraParam.moneyVolume) == "number" && _this.uraParam.moneyVolume > 0  && ('tn,t0'.indexOf(_this.uraParam.pType) > -1))){
			window.location.href="index.html"
		}
		var url = ''
		var isCoupon = false;
		if(_this.uraParam.pType == 'tn'){//定期
			url = GHutils.API.PRODUCT.getproductdetail
			$('.tn_protocool').show()
		}else if(_this.uraParam.pType == 't0'){//活期
			url = GHutils.API.PRODUCT.gett0detail
			if(_this.uraParam.couponId){//体验金
				$("#balancePart").hide()
				isCoupon = true;
				
				$("#unChooseCoupon").addClass("active").parent().hide();
				$("#apply-arrow").hide();
			}
		}
		_this.getUserAccount();
		if(isCoupon){
			_this.getMyCoupon(url)
		}else{
			_this.getProductInfo(url,false)
			_this.getCouponOfProduct();
		}
	},
	bindEvent: function() {
		var _this = this
		//密码框
		GHutils.inputPwd("#payPwd"); 
		//输入框
		GHutils.checkInput("#payPwd",5); 
		//协议复选框
		GHutils.protocolCheck("#agree_t0");
		

		$(".apply_quan").on("click",function(){
			if(!$(this).is('.select_coupon')){
				return false;
			}
			$('#valid li').each(function(i,dom){
				if(dom){
					if($(dom).attr('data-oid')== _this.coupon.couponId){
						$(dom).removeClass('apply_nochoise')
					}
				}
			})
	 		$(".apply-c-div").show();
	 	});
	 	
	 	$(".popup-close").on("click",function(){
	 		$(".apply-c-div").hide();
	 	});

		_this.okpay.on('click',function(){
			if(!_this.enableClick){
				setTimeout(function(){
					_this.enableClick = true;
				},2000);
			}
			_this.enableClick = false;
			if($(this).hasClass('btn_loading')){
				return false;
			}
			_this.tip.html('&nbsp;')
			if(GHutils.validate('hasPayPwd')){
				if(!$('#agree_t0').hasClass('active')){
					_this.tip.html('提示：请同意 '+_this.protocalMessage)
					return false
				}
				$(this).addClass('btn_loading')
				_this.checkPwd();
			}
		})
	},
	getUserAccount:function(){
		var _this = this;
		//用户可用余额
		GHutils.load({
			url: GHutils.API.ACCOUNT.useraccount,
			data: {},
			type: "post",
			async:false,
			callback: function(result) {
				if(GHutils.checkErrorCode(result,_this.tip)){
					_this.balance = (result.applyAvailableBalance+0)
					if(_this.balance < _this.uraParam.moneyVolume && !_this.uraParam.couponId){
						$("#noMoney").show();
					}
					$('#balance').html(GHutils.formatCurrency(_this.balance))
				}
			}
		})
	},
	getProductInfo:function(url,isFlag){
		var _this = this;
		//产品详情
		GHutils.load({
			url: url+'?oid='+_this.uraParam.productOid,
			data: {},
			type: "post",
			async:false,
			callback: function(result) {
				GHutils.log(result,"产品详情==============");
				if(GHutils.checkErrorCode(result,_this.tip)){
					result.investMin +=0;
					GHutils.product = result;
					GHutils.mustcache("#account-apply-productInto-template","#productInfo",{"productName":(result.productName),"moneyVolume":(GHutils.formatCurrency(_this.uraParam.moneyVolume))})
					_this.product = result
					_this.product.addMoney = result.investAdditional*result.netUnitShare
					$('#apply_productName').html(result.productName)

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
			}
		});	
	},
	getMyCoupon:function(url){
		var _this = this;
		GHutils.load({
			url:GHutils.API.ACCOUNT.coupon+'?page=1&rows=100&status=notUsed',
			type:'post',
			callback:function(result){
				if(GHutils.checkErrorCode(result,_this.tip)){
					var isFlag = GHutils.forEach(result.rows,function(idx,item){
						if(item.type =="tasteCoupon" && item.couponId == _this.uraParam.couponId){
							_this.getProductInfo(url,true);
							_this.coupon = item
							_this.experience=true
							$("#selectedCoupon").html('体验金：'+item.amount+'元')
							$("#coupon_list").hide()
							$("#totalPay").html('0')
							return true;
						}
					})
					if(!isFlag){
						$(_this.tip).html('提示：  请选择合适的卡券')
						$('#ok_pay').off().removeClass("gh_btn_orange").addClass("gh_btn_disabled");
						return
					}
				}
			}
		});
	},
	getCouponOfProduct:function(){
		var _this = this;
		//获取我的优惠券
		GHutils.load({
			url: GHutils.API.PRODUCT.mycouponofpro+'?proOid='+_this.uraParam.productOid,
			data: {},
			type: "post",
			callback: function(result) {
				if(result.errorCode != 0){
					return false;
				}
				GHutils.forEach(result.rows,function(idx,coupon){
					if(coupon.type =="rateCoupon" && _this.uraParam.pType == 't0'){
						return false;
					}
					if(!coupon.products ){
						coupon.products="适用全场"
					}
					if(coupon.type =="rateCoupon" && coupon.products=="适用全场"){
						coupon.products ="全场定期产品通用"
					}	
					if(coupon.type == "coupon" || coupon.type =="rateCoupon"){
						coupon["typeDisp"] = _this.turnType(coupon.type);
						if(_this.uraParam.pType == "tn" && coupon.investTime){//剔除 定期 投资期限 》 存续期
								if(coupon.investTime > GHutils.product.durationPeriod){
									return false;
								}
						}
						coupon["typeDisp"] = _this.turnType(coupon.type);
						coupon["unit"]="￥"
						coupon["label"] = coupon.amount
						var investAmountDisp = "满"+coupon.investAmount+'元'
						if(!coupon.investAmount){
							investAmountDisp="任意金额"
						}
						if(coupon.rules == "全场适用"){
							coupon.rules = ""
						}
						coupon["investAmountDisp"] = investAmountDisp
						coupon["compareAmount"] = coupon.amount
						if(coupon.type =="rateCoupon"){
							var investTime = ""
							if(coupon.investTime){
							 	investTime="投资满"+coupon.investTime+"天"
							}
							if(coupon.validPeriod){
								if(investTime){
									coupon["validPeriodDisp"]=investTime+",加息"+coupon.validPeriod+"天"
								}else{
									coupon["validPeriodDisp"]="自使用日起加息"+coupon.validPeriod+"天"
								}
							}else{
								if(investTime){
									coupon["validPeriodDisp"]=investTime+",加息任意天"
								}else{
									coupon["validPeriodDisp"]="自使用日起加息任意天"
								}
							}
						
							coupon["unit"]=null
							coupon["percent"]="%"
							var days = 1;
							if(_this.uraParam.pType == "tn"){
								days = coupon.validPeriod
								if(!days){
									days = GHutils.product.durationPeriod
								}
								days = Number(days);
							}
							coupon["compareAmount"] =  GHutils.Fdiv(GHutils.Fdiv(GHutils.Fmul(coupon.amount,days),100),GHutils.product.durationPeriod)
							coupon["amount"] = 0
						}else if(coupon.type =="tasteCoupon"){
							coupon["validPeriodDisp"]="自使用日起体验任意天"
							if(coupon.validPeriod){
								coupon["validPeriodDisp"]="自使用日起体验"+coupon.validPeriod+"天"
							}
						}else if(coupon.type == 'coupon' && coupon.investTime){
							coupon["validPeriodDisp"]="投资满"+coupon.investTime+"天可使用"
						}
						
						_this.couponList.push(coupon);
					}
				})
				GHutils.log(_this.couponList,"优惠券======")
				_this.getSuitableCoupon(_this.uraParam.moneyVolume,true);
			}
		})
	},
	getSuitableCoupon:function(moneyVolume,isFirst){
		var _this = this;
		var valid =[]
		var invalid = []
		_this.coupon = {"amount":0}
		_this.suitable = {}
		GHutils.forEach(_this.couponList,function(idx,coupon){
			coupon.investAmount+=0
			if(coupon.type == "rateCoupon" && isFirst){
				coupon["compareAmount"] = GHutils.Fmul(moneyVolume,coupon.compareAmount)
			}
			
			if(moneyVolume >= coupon.investAmount && moneyVolume > coupon.compareAmount){
				if(_this.coupon.amount < coupon.compareAmount){
					_this.coupon = coupon
				}
				valid.push(coupon)
			}else{
				invalid.push(coupon)
			}
			_this.suitable[coupon.couponId]=coupon 
		})
		if(_this.coupon.couponId){
			if(_this.coupon.unit){
				$("#selectedCoupon").html(_this.coupon.typeDisp+":"+_this.coupon.unit+_this.coupon.label)
			}else{
				$("#selectedCoupon").html(_this.coupon.typeDisp+":"+_this.coupon.label+_this.coupon.percent)
			}
			$("#unChooseCoupon").removeClass("active").parent().show()
			$("#apply-arrow").show();
		}else{
			$("#selectedCoupon").html("暂无合适的优惠券")
			$("#unChooseCoupon").addClass("active").parent().hide();
			$("#apply-arrow").hide();
		}
		var totalPay = GHutils.Fsub(moneyVolume,_this.coupon.amount)
		if(totalPay > _this.balance && !_this.uraParam.couponId){
			$("#noMoney").show();
		}
		
		$("#totalPay").html(GHutils.formatCurrency(totalPay))
		GHutils.mustcache("#account-apply-coupon-template","#coupon_list",{"valid":valid})
		$(".apply_coupon_list").find('[data-oid='+_this.coupon.couponId+']').addClass('active').find('.choose_point').css('background','#f4551f')
		_this.choseCoupon(moneyVolume,valid);

	},
	checkPwd:function(){
		var _this = this;
		GHutils.load({
			url: GHutils.API.USER.checkpaypwd,
			data:{
				payPwd:$('#payPwd').val()
			},
			type: "post",
			callback: function(result) {
				if(GHutils.checkErrorCode(result,_this.tip)){
					if(_this.experience){//体验金产品
						_this.invest();
					}else{
						_this.checkMoney();
					}
					
				}
			}
		});
	},
	checkMoney:function(){
		var _this = this;
		if(GHutils.label(_this.product.productLabels,'8')){
			_this.tip.html('提示： 体验金 产品无法购买')
			_this.okpay.removeClass('btn_loading')
			return false;
		}
		var investMoney =_this.uraParam.moneyVolume;
		if(GHutils.Fsub(investMoney,_this.coupon.amount) > _this.balance){
			_this.tip.html('提示：账户可用余额不足，请充值')
			_this.okpay.removeClass('btn_loading')
			return false
		}
		if(_this.uraParam.pType=="tn"){//定期
			_this.tnCheckInvestMoney(investMoney);
		}else if(_this.uraParam.pType=="t0"){//活期
			_this.t0MaxInvestMoney(investMoney)
		}
	},
	tnCheckInvestMoney:function(investMoney){
		var _this =this;
		if(!_this.product){
			_this.tip.html('提示：  产品不存在!')
			_this.okpay.removeClass('btn_loading')
			return false;
		}
		if(GHutils.label(_this.product.productLabels,'8')){
			_this.tip.html('提示： 体验金产品无法购买')
			_this.okpay.removeClass('btn_loading')
			return false;
		}
		
		if(_this.product.state == "waitToSale"){
			_this.tip.html('提示： 该产品还未开始募集，敬请期待')
			_this.okpay.removeClass('btn_loading')
			return
		}else if(_this.product.state == "notAllowedSale"){
			_this.tip.html('提示： 该产品不可购买')
			_this.okpay.removeClass('btn_loading')
			return
		}else if(_this.product.state == "saleOut" ){
			_this.tip.html('提示： 该产品已售罄')
			_this.okpay.removeClass('btn_loading')
			return
		}
		
		if(GHutils.label(_this.product.productLabels,'1')){//判断是否是新手标产品
			GHutils.load({
				url: GHutils.API.ACCOUNT.usermoneyinfo,
				data: {},
				type: "post",
				callback: function(result) {
					if(GHutils.checkErrorCode(result,_this.tip)){
						if(result.isFreshman != 'yes' ){
							_this.tip.html('提示： 此产品只限新手申购')
							return false
						}
						checkInvestMoney();
					}
				}
			})
		}else{
			checkInvestMoney();
		}
		
		function checkInvestMoney(){
			var a = GHutils.Fdiv(GHutils.Fsub(investMoney , _this.product.investMin),_this.product.addMoney)
			if(investMoney < _this.product.investMin){
				_this.tip.html('提示： 投资金额不能低于起投金额 '+_this.product.investMin+'元')
				_this.okpay.removeClass('btn_loading')
				return false;
			}else if(GHutils.Fdiv(GHutils.Fsub(investMoney , _this.product.investMin),_this.product.addMoney)%1 != 0){
				_this.tip.html('提示：  投资金额超出'+_this.product.investMin+'元部分必须为'+_this.product.addMoney+'元的整数倍。')
				_this.okpay.removeClass('btn_loading')
				return false;
			}
			var  maxInvestMoney =  GHutils.Fmul(GHutils.Fsub(_this.product.maxSaleVolume, _this.product.lockCollectedVolume), _this.product.netUnitShare)//产品剩余可投金额
			if(_this.product.investMax){
				var singleInvestMax = GHutils.Fmul(_this.product.investMax, _this.product.netUnitShare)
				if(maxInvestMoney > singleInvestMax){
					maxInvestMoney = singleInvestMax
				}
			}else{
			}
			if(investMoney > maxInvestMoney){
				_this.tip.html('提示： 金额不能超过剩余可投金额'+maxInvestMoney+"元")
				_this.okpay.removeClass('btn_loading')
				return false;
			}
			_this.invest();
		}
	
	},
	t0MaxInvestMoney:function(investMoney){
		var _this = this;
		GHutils.load({
			url: GHutils.API.PRODUCT.mholdvol+_this.uraParam.productOid,
			data: {},
			type: "post",
			callback: function(result) {
				if(GHutils.checkErrorCode(result,_this.tip)){
					if(investMoney < _this.product.investMin){
						$(_this.tip).html('提示： 投资金额不能低于起投金额 '+_this.product.investMin+'元')
						_this.okpay.removeClass('btn_loading')
						return false;
					}else if(GHutils.Fdiv(GHutils.Fsub(investMoney , _this.product.investMin),_this.product.addMoney)%1 != 0){
						$(_this.tip).html('提示：  投资金额超出'+_this.product.investMin+'元部分必须为'+_this.product.addMoney+'元的整数倍。')
						_this.okpay.removeClass('btn_loading')
						return false;
					}
					var maxinvestMoney = GHutils.Fmul(GHutils.Fsub(_this.product.maxSaleVolume , _this.product.lockCollectedVolume),_this.product.netUnitShare);
					if(_this.product.maxHold){
						if(maxinvestMoney >  GHutils.Fsub(_this.product.maxHold , result.maxHoldVol)){
							maxinvestMoney =  GHutils.Fsub(_this.product.maxHold , result.maxHoldVol)
						}
						if(_this.product.investMax){
							if(maxinvestMoney > _this.product.investMax){
								maxinvestMoney = _this.product.investMax
							}
						}
					}else{
						if(!_this.product.investMax){
						}else{
							if(maxinvestMoney > _this.product.investMax){
								maxinvestMoney = _this.product.investMax
							}
						}
					}
					if(investMoney > maxinvestMoney){
						$(_this.tip).html('提示： 金额不能超过最大可投金额'+maxinvestMoney+'元')
						_this.okpay.removeClass('btn_loading')
						return false;
					}
					_this.invest();
				}
				
			}
		})
	},
	invest:function(){
		var _this = this;
		var investMoney =_this.uraParam.moneyVolume;
		if(_this.experience){
			investMoney = _this.coupon.amount
			_this.coupon.label = _this.coupon.amount
		}
		GHutils.load({
			url: GHutils.API.PRODUCT.invest,
			data:{
				productOid: _this.product.oid,
				moneyVolume:investMoney ,
				cid:cid,
				ckey:ckey,
				couponId: _this.coupon.couponId == null?'':_this.coupon.couponId,
				couponType:_this.coupon.type == null?'':_this.coupon.type,
				couponDeductibleAmount:_this.coupon.amount,
				couponAmount:_this.coupon.label,
				payAmouont:GHutils.Fsub(investMoney,_this.coupon.amount)
			},
			type: "post",
			callback: function(result) {
				if(GHutils.checkErrorCode(result,_this.tip)){
					window.location.href = 'product-result.html?action=apply'+'&productName='+encodeURI(_this.product.productName)+'&pType='+_this.uraParam.pType+'&moneyVolume='+_this.uraParam.moneyVolume+'&tradeOrderOid='+result.tradeOrderOid
				}
			},
			errcallback: function() {//投资接口请求超时，停止
				_this.tip.html('提示：请求超时，请到&nbsp;<a href="account-tradelist.html" style="color: #ff4f3f;text-decoration:underline;">交易记录</a>&nbsp;查看是否提交成功')
			}
		});
			
	},
	choseCoupon:function(moneyVolume,valid){
		var _this = this;

		if(_this.coupon.couponId){
			$("#coupon-list-container").off().on('mouseover',function(){
				if(!$("#unChooseCoupon").hasClass("active")){
					$("#coupon_list").show();
					$("#apply-arrow").removeClass("apply_arrow_down").addClass("apply_arrow_up")
				}
			}).on('mouseout',function(){
				$("#coupon_list").hide();
				$("#apply-arrow").addClass("apply_arrow_down").removeClass("apply_arrow_up")
			})
		}


		
		
		$("#coupon_list li").off().on('click',function(){
			if($(this).hasClass("active")){
				_this.coupon={'couponId':null,'type':null,'amount':0};
				$(".choose_point").css('background','#c8c8c8')
				$(this).removeClass('active')
				$('#totalPay').html(GHutils.formatCurrency(moneyVolume))
				$('#selectedCoupon').html("请选择优惠券")
				$("#unChooseCoupon").addClass("active")
			}else{
				$(".choose_point").css('background','#c8c8c8')
				$(this).addClass('active').find('.choose_point').css('background','#f4551f')
				$(this).siblings().removeClass("active")
				_this.coupon = _this.suitable[$(this).attr('data-oid')]
				$('#totalPay').html(GHutils.formatCurrency(moneyVolume - _this.coupon.amount))
				if(_this.coupon.unit){
					$("#selectedCoupon").html(_this.coupon.typeDisp+":"+_this.coupon.unit+_this.coupon.label)
				}else{
					$("#selectedCoupon").html(_this.coupon.typeDisp+":"+_this.coupon.label+_this.coupon.percent)
				}
				$("#unChooseCoupon").removeClass("active")
			}
		})
		
		$("#unChooseCoupon").off().on('click',function(){
			if($(this).hasClass("active")){
				$(".choose_point").css('background','#c8c8c8')
				_this.getSuitableCoupon(_this.uraParam.moneyVolume,false);
				$(this).removeClass('active')
			}else{
				_this.coupon={'couponId':null,'type':null,'amount':0};
				$(".choose_point").css('background','#c8c8c8')
				$("#coupon_list li").removeClass('active')
				$(this).addClass('active')
				$('#totalPay').html(GHutils.formatCurrency(_this.uraParam.moneyVolume))
				$('#selectedCoupon').html("不使用优惠券")
			}
		})

	},
	turnType:function (type){
		if(type == 'redPackets'){
			type = '红包'
		}else if(type == 'coupon'){
			type = '代金券'
		}else if(type == 'rateCoupon'){
			type = '加息券'
		}else if(type == 'tasteCoupon'){
			type = '体验金'
		}
		return type;
	},
	callBackFun:function(){
		var _this = this
		_this.pageInit();
		_this.tip.html('')
		_this.bindEvent();
	}
}

$(function() {
	new AccountApply().init();
	window.pageFun = new AccountApply();
})

