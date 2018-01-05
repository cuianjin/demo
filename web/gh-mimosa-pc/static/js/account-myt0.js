var AccountMyT0 = function() {
	var that = this;
	this.holdingHtml = ""
	this.action = "redeem";
	//记录明细
	this.paramRecord = {
		page:1,
		orderType:'',
		createTime:'',
		orderTimeBegin:'',
		orderTimeEnd:'',
		productOid:'',
		rows:10
	}
	
	this.columnDefine=[
		{"idx":false,"clazz":"gh_tcenter","format":function(idx){return ((that.paramRecord.page - 1) *that.paramRecord.rows + idx+1) }},
		{"name":"orderCode","clazz":"gh_tcenter"},
		{"name":"orderTime","clazz":"gh_tcenter","format":function(){return this.orderTime.substr(0,10)}},
		{"name":"orderTypeDisp","clazz":"gh_tcenter"},
		{"name":"orderAmount","clazz":"gh_tright"},
		{"name":"orderStatusDisp","clazz":"gh_tcenter"}
	]
	
	return this;
}

AccountMyT0.prototype =  {
	init: function() {
		GHutils.isLogin();
		this.pageInit();
		this.bindEvent();
	},
	pageInit: function() {
		var _this = this
		
	    if(GHutils.getCookie('see')){
			$('#seeAmount').addClass('see').removeClass("gh_icon_eyes").addClass("gh_icon_eyes_closed")
		}else{
			$('#seeAmount').removeClass('see').addClass("gh_icon_eyes").removeClass("gh_icon_eyes_closed")
		}
	    
	    loadMyt0()
	    
	    function loadMyt0(){
	    	//我的活期列表
			GHutils.load({
				url: GHutils.API.ACCOUNT.prot0list,
				data: {},
				type: "post",
				callback: function(result) {
					if(result.errorCode != 0){
						return false;
					}
					seeOrHideData('t0CapitalAmount',GHutils.formatCurrency(result.t0CapitalAmount));
					seeOrHideData('t0YesterdayIncome',GHutils.formatCurrency(result.t0YesterdayIncome));
					seeOrHideData('totalIncomeAmount',GHutils.formatCurrency(result.totalIncomeAmount));
					
					//持有中
					_this.holdingHtml = [];
					GHutils.forEach(result.holdingDetails.rows,function(idx,product){
						_this.gett0detail(product.productOid,product)
					})
					if(_this.holdingHtml.length > 0){
						$("#holdingDetails_div").show()
						$("#incomeTable-noReCord").hide()
						GHutils.mustcache("#holdingT0-template","#holdingDetails",{"products":_this.holdingHtml})
//						$('#holdingDetails').html(_this.holdingHtml)
					}else{
						$("#holdingDetails_div").hide()
						$("#incomeTable-noReCord").show()
					}
					$("#holdingNum").html(result.holdingDetails.total)
					
					//申请中
					var toConfirmHtml = []
					GHutils.forEach(result.toConfirmDetails.rows,function(idx,product){
						product.toConfirmInvestVolume =  GHutils.formatCurrency(product.toConfirmInvestVolume+0)
						toConfirmHtml.push(product)   
					})
					if(toConfirmHtml.length > 0){
						$("#toConfirmDetails_div").show()
						$("#applyTable-noRecord").hide()
						GHutils.mustcache("#toConfirm-template","#toConfirmDetails",{"products":toConfirmHtml})
//						$('#toConfirmDetails').html(toConfirmHtml)
					}else{
						$("#toConfirmDetails_div").hide()
						$("#applyTable-noRecord").show()
					}
					$("#applyingNum").html(result.toConfirmDetails.total)
					
					$(".doInvest").off().on('click', function(){
						window.location.href = "product-t0.html?productOid="+$(this).attr("data-oid")
					})
					
					$(".doRedeem").off().on('click', function(){
						if(GHrisk.checkDWcomplete(true)){
							window.location.href = "product-redeem.html?productOid="+$(this).attr("data-oid")
						}
					})
					
					$('.showRecord').off().on('click',function(){
						_this.paramRecord.productOid = $(this).attr("data-oid")
						_this.paramRecord.page = 1;
						_this.loadTradeRecord(true);
						$("#myt0-detail").modal('show')
					})
				}
			})
	    }
	    
	    function seeOrHideData(id,data){
			var amount = GHutils.formatCurrency(data)
			if(GHutils.getCookie('see')){//隐藏
				$('#'+id).attr('data-amount',amount).html('***')
			}else{//显示
				$('#'+id).attr('data-amount','***').html(amount)
			}
		}
	},
	bindEvent: function() {
		var _this = this
		$.tab();
		//点击眼睛图标
		$('#seeAmount').on('click',function(){
			var amount = ''
			$('[data-amount]').each(function(i,e){
				amount = $(e).html()
				$(e).html($(e).attr('data-amount'))
				$(e).attr('data-amount',amount)
			})
			
			if(GHutils.getCookie('see')){
				GHutils.setCookie('see','')
				$(this).removeClass('see').addClass("gh_icon_eyes").removeClass("gh_icon_eyes_closed")
			}else{
				GHutils.setCookie('see','see')
				$(this).addClass('see').removeClass("gh_icon_eyes").addClass("gh_icon_eyes_closed")
			}
		})
	},
	isOpenRemeed:function(productOid,data,product){
		var _this = this;
		//获取可赎回金额
		GHutils.load({  
			url: GHutils.API.ACCOUNT.prot0detail+'?productOid='+productOid,
			data:{},
			type: "post",
			async:false,
			callback: function(result) {
				if(result.errorCode != 0) {
					return
				}
				var redeemHtml = '', investHtml = '';
				if( data.isOpenRemeed == "YES" && (!result.singleDayRedeemCount || result.dayRedeemCount < result.singleDayRedeemCount)){
                    redeemHtml = '转出'
                   if(data.isExperience  && product.redeemableHoldVolume <= 0){
                          redeemHtml = ''
				   }
				}
				if(!data.isExperience  && data.isOpenPurchase == "YES" && data.maxSaleVolume != data.lockCollectedVolume && GHutils.Fmul(GHutils.Fsub(data.maxSaleVolume, data.lockCollectedVolume), data.netUnitShare) >= data.investMin){
					investHtml = '转入'
				}
                // product["enableRedeemVolume"] = GHutils.formatCurrency(GHutils.Fsub(product.value+0,product.toConfirmRedeemVolume+0))
                // if(data.isExperience){
                //     product["enableRedeemVolume"] =  product.holdTotalIncome+0;
                // }

				product.value = GHutils.formatCurrency(product.value+0)
				product.yesterdayIncome = GHutils.formatCurrency(product.yesterdayIncome+0)
				product.holdTotalIncome = GHutils.formatCurrency(product.holdTotalIncome+0)
				product.toConfirmRedeemVolume = GHutils.formatCurrency(product.toConfirmRedeemVolume+0)
				product["redeemHtml"] = redeemHtml
				product["investHtml"] = investHtml
				_this.holdingHtml.push(product)
			}
		});
	},
	gett0detail:function(productOid,product){
		var _this = this
		GHutils.load({
			url: GHutils.API.PRODUCT.gett0detail+'?oid='+productOid,
			data:{},
			type: "post",
			async:false,
			callback: function(result) {
				if(result.errorCode != 0) {
					return
				}
				if(!result.investMin){
					result.investMin = 0
				}
				result['isExperience']=GHutils.label(result.productLabels,'8')
				_this.isOpenRemeed(productOid,result,product)
			},
			errcallback: function(){

			}
		});
	},
	loadTradeRecord: function(isFlag){
		var _this = this;
		//交易明细
		GHutils.load({
			url: GHutils.API.ACCOUNT.prot0qrydetail+GHutils.parseParam(_this.paramRecord),
			data: {},
			type: "post",
			async:false,
			callback: function(result) {
				if(GHutils.checkErrorCode(result)){
					GHutils.table("#myt0-detail-table",_this.columnDefine,result.rows,"#myt0-detail-table-noRecord","--")
					if(isFlag){
						_this.createPage(Math.ceil(result.total/_this.paramRecord.rows))
					}
				}
			}
		})
	},
	createPage:function(pageCount){
		var _this = this;
		var dom = $("#tradeTablePage")
		dom.hide()
		if(pageCount >1){
			dom.show()
		}
		dom.createPage({
			pageCount: pageCount,
			current: 1,
			backFn: function(page) {
				_this.paramRecord.page = page;
				_this.loadTradeRecord(false)
			}
		});
	},
	toInvestPrapareCallback:function(){
		var _this = this;
		window.location.href="account-validate.html?action="+_this.action+"&actionURL="+window.location.href;
	}
}

$(function() {
	var accountMyT0 = new AccountMyT0()
	accountMyT0.init();
	window.init = accountMyT0;
})