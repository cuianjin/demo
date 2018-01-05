var AccountMyCoupon = function() {
	this.rows = 6;
	return this;
}

AccountMyCoupon.prototype =  {
	init: function() {
		GHutils.isLogin();
		this.pageInit();
	},
	pageInit: function(){
		var _this = this
		$.tab();
		_this.getRecords(1,'notUsed',true)
		_this.getRecords(1,'used',true)
		_this.getRecords(1,'expired',true)
	},
	getRecords: function(page,status,isFlag) {
		var _this = this
		GHutils.load({
			url:GHutils.API.ACCOUNT.coupon+'?page='+page+'&rows='+_this.rows+'&status='+status,
			data:{},
			type:'post',
			callback:function(result){
				GHutils.log(result,status+"=============");
				var coupons = []
				GHutils.forEach(result.rows,function(idx,coupon){
					var temp = coupon.type
					coupon["unit"]="￥"
					coupon["amountDisp"] = coupon.amount;
					coupon[(coupon.type)] = coupon.type;
					if(!coupon.products){
						coupon.products="适用全场"
					}
					if(temp == "rateCoupon"){
						if(coupon.products=="适用全场"){
							coupon.products ="全场定期产品通用"
						}
						coupon["unit"]=null
						coupon["percent"]="%"
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
					}
					if(temp == "redPackets"){
						coupon["products"]=""
					}
					if(temp == "redPackets" && status != "used" && coupon.amountType != "fixed"){
						coupon["amountDisp"] = "???";
						coupon[status] = status;
					}
					
					var typeInfo = turnType(coupon)
					coupon["typeDisp"] = typeInfo.typeDisp;
					coupon["btnTxt"] = typeInfo.btnTxt;
					if(typeInfo.type){
						coupon.type = typeInfo.type;
					}
					if(temp == "tasteCoupon"){
						coupon["validPeriodDisp"]="自使用日起体验任意天"
						if(coupon.validPeriod){
							coupon["validPeriodDisp"]="自使用日起体验"+coupon.validPeriod+"天"
						}
						coupon["products"]=''
					}
					
					if(temp == 'coupon' && coupon.investTime){
						coupon["validPeriodDisp"]="投资满"+coupon.investTime+"天可使用"
					}
					
					if(status == "notUsed"){
						coupon["enable"] =true
					}
					
					if(coupon.rules == "全场适用"){
						coupon.rules = ""
					}
					
					
					
					temp ="投资满"+coupon.investAmount+"元使用"
					if(!coupon.investAmount){
						temp ="任意金额使用"
					}
					coupon["investAmountDisp"] =temp
					coupon.eventType = turnEventType(coupon.eventType)
					coupons.push(coupon)
				})
				$('#'+status+"Num").html(result.total)
				if(result.total){
					GHutils.mustcache("#account-myCoupon-template","#"+status+"Box",{"coupons":coupons})
					_this.bindEvent();
					$("#"+status+"-noRecord").hide()
					if(isFlag)_this.createPage(Math.ceil(result.total/_this.rows),status)
				}else{
					$("#"+status+"Box").html('')
					$("#"+status+"-noRecord").show()
				}
			},
			errcallback:function(error){
				
			}
		})
		
		function turnStatus(status){
			if(status == 'notUsed'){
				status = '立即使用'
			}else if(status == 'used'){
				status = '已使用'
			}else if(status == 'expired'){
				status = '已失效'
			}
			return status;
		}
		
		function turnType(coupon){
			var type = coupon.type;
			if(type == 'redPackets'){
				if(coupon.amountType == "fixed"){
					type = {"typeDisp":"现金红包","btnTxt":"立即领取","type":type+"fixed"}
				}else{
					type = {"typeDisp":"随机红包","btnTxt":"拆红包"}
				}
			}else if(type == 'coupon'){
				type = {"typeDisp":"代金券","btnTxt":"立即使用"}
			}else if(type == 'rateCoupon'){
				type = {"typeDisp":"加息券","btnTxt":"立即使用"}
			}else if(type == 'tasteCoupon'){
				type = {"typeDisp":"体验金","btnTxt":"立即使用"}
			}
			return type;
		}
		
		function turnEventType(eventType){
			var type = eventType
			switch(eventType){
				case 'sign':
					type="签到";
					break;
				case 'register':
					type="注册";
					break;
				case 'investment':
					type="申购";
					break;
				case 'authentication':
					type="实名认证";
					break;
				case 'redeem':
					type="赎回";
					break;
				case 'bearer':
					type="到期兑付";
					break;
				case 'cash':
					type="提现 ";
					break;
				case 'refund':
					type="退款";
					break;
				case 'firstFriendInvest':
					type="被推荐人首次投资";
					break;
				case 'forwarded':
					type="软文转发";
					break;
				case '流标':
					type='invalidBids';
					break;
				case 'friend':
					type='推荐人活动';
					break;
				case 'recharge':
					type='充值';
					break;
				case 'phoneAuthentication':
					type='手机认证';
					break;
				case 'bindingCard':
					type='绑卡';
					break;
				case 'schedule':
					type='调度活动';
					break;
				case 'custom':
					type='活动';
					break;
				case 'birthday':
					type='用户生日';
					break;
			}
			return type;
		}
		
	},
	createPage: function(pageCount,status) {
		var _this = this;
		$("."+status).show()
		if(pageCount <=1){
			$("."+status).hide()
			return ;
		}
		$("."+status).createPage({
			pageCount: pageCount,
			current: 1,
			backFn: function(page) {
				_this.getRecords(page,status,false);
			}
		});
	},
	bindEvent: function() {
		var _this = this
		
		//随机红包
		$(".notUsed_redPackets,.notUsed_redPacketsfixed").off().on('click',function(){
//			if($(this).hasClass('btn_loading')){
//				return false;
//			}
//			$(this).addClass('btn_loading')
			
			var amountModal = $(this).attr('data-amount');
			var couponOid = $(this).attr('data-id');
			var type = $(this).attr("data-amountType");
			console.log(amountModal)
			console.log(type)
			var couponData = {
				type: type,
				couponOid: couponOid,
				amountModal: amountModal
			}
			REDPACKET.setRedPackets(couponData,'');
		})
		
		//体验金
		$(".notUsed_tasteCoupon").off().on('click',function(){
			if($(this).hasClass('btn_loading')){
				return false;
			}
			$(this).addClass('btn_loading')
			var couponId = $(this).attr('data-id')
			GHutils.load({
				url:GHutils.API.ACCOUNT.tdetail+'?channelOid='+channelOid,
				data:{},
				type:'post',
				callback:function(result){
					$(".notUsed_tasteCoupon").removeClass('btn_loading')
					if(result.errorCode != 0){
						$("#content").html(result.errorMessage)
						$("#content-box").modal('show')
						return false;
					}
					GHutils.log(result,"结果============")
					window.location.href="product-t0.html?productOid="+result.oid+'&pType=experience'+'&couponId='+couponId
				},
				errcallback:function(){
					$(".notUsed_tasteCoupon").removeClass('btn_loading')
				}
			})
		}) 
		
		$(".notUsed_coupon,.notUsed_rateCoupon").off().on('click',function(){
			window.location.href="product-tn-list.html"
		})
	},
	//拆红包成功回调
	successCallback:function(){
		var _this = this;
		_this.pageInit();
	}

}

$(function() {
	var accountMyCoupon = new AccountMyCoupon();
	accountMyCoupon.init();
	window.init = accountMyCoupon;
})
