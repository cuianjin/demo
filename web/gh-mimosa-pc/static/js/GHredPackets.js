/*
 Title:redpackets
 Author:cui xu
 Date:2017-7-22 11:22:45
 Version:v1.0
*/
var REDPACKET = {
	init: function(data,func) {
		this.couponTimes = 0;
		this.getCouponActivity(data,func);
	},
	//执行检测红包
	getCouponActivity: function(data,func) {
		var _this = this;
		GHutils.load({
			url: GHutils.API.USER.registerCoupon,
			params: {
				eventType: data.type,
				singleInvestAmount: data.singleInvestAmount
			},
			type: 'post',
			callback: function(result) {
				console.log(JSON.stringify(result));
				console.log(JSON.stringify(data));
				if(result && result.errorCode == 0) {
					if(result.couponList && result.couponList.length > 0) {
						_this.couponTimes = 0;
						_this.setRedPackets(data, result)
					} else {
						_this.couponTimes++
							setTimeout(function() {
								if(_this.couponTimes <= 10) {
									_this.getCouponActivity(data,func)
								} else {
									_this.couponTimes = 0;
									if(func && typeof(func) == "function"){func.apply(null,arguments)}
								}
							}, 1000)
					}
				} else {
					_this.couponTimes++
						setTimeout(function() {
							if(_this.couponTimes <= 10) {
								_this.getCouponActivity(data,func)
							} else {
								if(func && typeof(func) == "function"){func.apply(null,arguments)}
								_this.couponTimes = 0;
							}
						}, 1000)
				}
			},
			errcallback: function() {
				_this.couponTimes++
					setTimeout(function() {
						if(_this.couponTimes <= 10) {
							_this.getCouponActivity(data,func)
						} else {
							if(func && typeof(func) == "function"){func.apply(null,arguments)}
							_this.couponTimes = 0;
						}
					}, 1000)
			}
		})
	},
	setRedPackets: function(data, result) {
		var _this = this;
		//初始化红包弹窗
		console.log(JSON.stringify(data)+'33333333');
		_this.buildRedPackets();
		
		if(data.couponType == 'random' || data.type == 'random') {
			console.log('33333333');
			$('#red_container').removeClass('gh_hidden').addClass('gh_show');
			$('.hongbao.noSuccess').removeClass('gh_none');
			$('.couponCheck1').removeClass('gh_none');
			$('#chai').off().on('click', function() {
				if($(this).hasClass("app_btn_loading")) {
					return
				}
				$('#chai').addClass("rotate");
				_this.receiveCoupon(data.couponOid, data.amountModal,'random');
				if(result){
					_this.receiveCoupon(result.couponOid, result.amountModal,'random');
				}
			})
		} else if(data.couponType == 'fixed' || data.type == 'fixed') {
			console.log(data.couponOid);
			_this.receiveCoupon(data.couponOid, data.amountModal,'fixed');
			if(result){
				_this.receiveCoupon(result.couponOid, result.amountModal,'fixed');
			}
		} else if(result.couponList && result.couponList.length > 0) {
			if("random" == _this.hasRedPackets(result.couponList)) {
				$('#red_container').removeClass('gh_hidden').addClass('gh_show');
				$('.hongbao.noSuccess').removeClass('gh_none');

				$('#chai').off().on('click', function() {
					if($(this).hasClass("app_btn_loading")) {
						return
					}
					$('#chai').addClass("rotate");
					_this.receiveCoupon(result.couponList[0].couponOid, result.couponList[0].couponAmount,'random');
				})
			} else if("fixed" == _this.hasRedPackets(result.couponList)) {
				_this.receiveCoupon(result.couponList[0].couponOid, result.couponList[0].couponAmount, "fixed");
			} else {
				$('#red_container').removeClass('gh_hidden').addClass('gh_show');
				$('.hongbao.success').removeClass('gh_none');
				$('.description').html('您收到优惠券')
				$('#redpacket_num').html(result.couponList.length + '<span style="font-size:18px;margin-left:5px;">张</span>');
				$('#red_container .couponCheck').removeClass('gh_none').html('<button>立即查看</button>');
				$('#red_container .couponCheck').off().on('click', function() {
					window.location.href="account-myCoupon.html";
				})
			}
		}
	},
	receiveCoupon: function(couponOid, amountModal,fixed) {
		var _this = this;
		$('#chai').addClass("app_btn_loading");
		GHutils.load({
			url: GHutils.API.ACCOUNT.useRedPackets+"?couponId="+couponOid,
			type: "post",
			callback: function(result) {
				console.log(JSON.stringify(result))
				if(GHutils.checkErrorCode(result)) {
					if(window.init && typeof(window.init.successCallback) == "function"){
						window.init.successCallback();
					}
					if(fixed == 'fixed') {
						$('#red_container').removeClass('gh_hidden').addClass('gh_show');
						$('.hongbao.success').removeClass('gh_none');
						$('.description').html('您收到1个现金红包')
						$('#redpacket_num').html(amountModal + '<span style="font-size:20px;margin-left:5px;">元</span>');
						$('#red_container .couponCheck1').removeClass('gh_none');
					}else if(fixed == 'random') {
						setTimeout(function() {
							$('#red_container').addClass('gh_show').removeClass('gh_hidden');
							$('.hongbao.noSuccess').addClass('gh_none');
							$('.hongbao.success').removeClass('gh_none');
							$('#chai').removeClass("app_btn_loading");
							$('.description').html("您收到1个随机红包")
							$('.couponCheck1').removeClass('gh_none');
							$('#redpacket_num').html(GHutils.formatCurrency(amountModal) + '<span style="font-size:18px;margin-left:5px;">元</span>');
							$('#nowCheck').off().on('click', function() {
								window.location.href="account-myCoupon.html"
							})
						}, 1500)
					}
					
				}else {
					setTimeout(function() {
						$('#red_container').removeClass('gh_show').addClass('gh_hidden');
					}, 1500);
				}
			},
			errcallback: function() {
				if(fixed) {
					setTimeout(function() {
						GHutils.toast("网络错误，请稍后重试");
					}, 200)
				} else {
					setTimeout(function() {
						$('#red_container').removeClass('gh_show').addClass('gh_hidden');
						$('#chai').removeClass("app_btn_loading");
					}, 1500)
					setTimeout(function() {
						GHutils.toast("网络错误，请稍后重试");
					}, 1500)
				}
			}
		})
	},
	hasRedPackets: function(couponList) {
		var hasRed = false,_this = this
		if(couponList && couponList.length == 1) {
			if(couponList[0].couponType == "fixed") {
				hasRed = "fixed"
			} else if(couponList[0].couponType == "random") {
				hasRed = "random"
			}
		}
		return hasRed;
	},
	//拆红包弹层
	buildRedPackets: function() {
		var _this = this;
		if($('#red_container').length > 0) {
			$('#red_container').remove();
		}

		var firsthtml = '';
		firsthtml += '<div class="red_container gh_active gh_hidden" id="red_container">';
		firsthtml += '	<div class="hongbao noSuccess gh_none">';
		firsthtml += '		<div class="topcontent">';
		firsthtml += '			<div class="avatar">';
		firsthtml += '				<span class="close close_txt">+</span>';
		firsthtml += '			</div>';
		firsthtml += '			<h3 id="sendName">国槐科技</h3>';
		firsthtml += '			<span class="gh_cf gh_f20">给您发了一个红包</span>';
		firsthtml += '			<div class="description">投资到产品，会是一笔不小的收益</div>';
		firsthtml += '		</div>';
		firsthtml += '		<div class="chai_redPackets" id="chai">';
		firsthtml += '			<span>拆</span>';
		firsthtml += '		</div>';
		firsthtml += '		<div class="bottom_img">';
		firsthtml += '			<img src="static/images/redPackets_bottom_img.png" alt="" />';
		firsthtml += '		</div>';
		firsthtml += '	</div>	';
		firsthtml += '	<div class="hongbao success gh_none">';
		firsthtml += '		<div class="topcontent success ">';
		firsthtml += '			<div class="avatar">';
		firsthtml += '				<span class="close"></span>';
		firsthtml += '			</div>';
		firsthtml += '			<h3 id="sendName">恭喜您</h3>';
		firsthtml += '			<div class="description gh_f15" style="margin:0px;"></div>';
		firsthtml += '			<div class="chai_success">';
		firsthtml += '				<span id="redpacket_num">&nbsp;</span>';
		firsthtml += '			</div>';
		firsthtml += '		</div>';
		firsthtml += '		<div class="couponCheck gh_none"></div>';
		firsthtml += '		<div class="couponCheck1 gh_f16 gh_none"><span>已存入可用余额</span><br><span>可直接使用</span></div>';
		firsthtml += '		<div class="bottom_img success ">';
		firsthtml += '			<img src="static/images/redPackets_bottom_img.png" alt="" />';
		firsthtml += '		</div>';
		firsthtml += '	</div>';
		firsthtml += '</div>';

		$("body").append(firsthtml);
		_this.bindEvent();
	},
	//红包显示弹层
	bindEvent: function() {
		$('#red_container .close').off().on("click", function() {
			$('#red_container').remove();
//			window.location.href = 'account-myCoupon.html'
			
		});
	}
}