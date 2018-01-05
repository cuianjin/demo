var AccountMyTn = function() {
	var that = this;
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
		{"name":"orderCode"},
		{"name":"orderTime","format":function(){return this.orderTime.substr(0,10)}},
		{"name":"orderTypeDisp"},
		{"name":"orderAmount"},
		{"name":"orderStatusDisp"}
	]
	return this;
}

AccountMyTn.prototype =  {
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
		
		GHutils.load({
			url:GHutils.API.ACCOUNT.protnlist,
			data:{},
			type:'post',
			callback:function(result){
				GHutils.log(result,"我的定期============")
				_this.seeOrHideData('tnCapitalAmount',GHutils.formatCurrency(result.tnCapitalAmount));
				_this.seeOrHideData('tnYesterdayIncome',GHutils.formatCurrency(result.tnYesterdayIncome));
				_this.seeOrHideData('totalIncomeAmount',GHutils.formatCurrency(result.totalIncomeAmount));
				
				//持有中
				$("#holdNum").html("持有中("+result.holdingTnDetails.rows.length+")")
				if(result.holdingTnDetails.rows.length == 0){
					$("#holdTn-noReCord").removeClass("gh_none")
				}else{
					GHutils.mustcache("#holdingTn-template","#holdingTn",{"products":_this.parseProducts(result.holdingTnDetails.rows)})
				}
				//申请中
				$("#toConfirmNum").html("申请中("+result.toConfirmTnDetails.rows.length+")")
				if(result.toConfirmTnDetails.rows.length == 0){
					$("#toConfirmTn-noReCord").removeClass("gh_none")
				}else{
					GHutils.mustcache("#toConfirmTn-template","#toConfirmTn",{"products":_this.parseProducts(result.toConfirmTnDetails.rows)})
				}
				//已结清
				$("#closedNum").html("已结清("+result.closedTnDetails.rows.length+")")
				if(result.closedTnDetails.rows.length == 0){
					$("#closedTn-noReCord").removeClass("gh_none")
				}else{
					GHutils.mustcache("#closedTn-template","#closedTn",{"products":_this.parseProducts(result.closedTnDetails.rows)})
				}
				_this.bindEvent()
			},
			errcallback:function(error){
			}
		})
	},
	bindEvent: function() {
		var _this = this
		$.tab();
		//点击眼睛图标
		$('#seeAmount').off().on('click',function(){
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
		
		$('.mngInfo').off().on('click',function(){
			_this.paramRecord.productOid = $(this).attr('data-oid')
			_this.paramRecord.page = 1;
			_this.loadTradeRecord(true);
			$("#mytn-detail").modal('show')
		})
	},
	seeOrHideData: function(id,data){
		var amount = GHutils.formatCurrency(data)
		if(GHutils.getCookie('see')){//隐藏
			$('#'+id).attr('data-amount',amount).html('***')
		}else{//显示
			$('#'+id).attr('data-amount','***').html(amount)
		}
	},
	parseProducts:function(productList){
		var _this = this;
		var products =[];
		GHutils.forEach(productList,function(idx,product){
			product[(product.status)] = product.status
			product["investAmount"] = GHutils.formatCurrency(product.investAmount || 0)
			product["refundAmount"] = GHutils.formatCurrency(product.refundAmount || 0)
			product["acceptedAmount"] = GHutils.formatCurrency(product.acceptedAmount || 0)
			product["toConfirmInvestAmount"] = GHutils.formatCurrency(product.toConfirmInvestAmount || 0)
			product["orderAmount"] = GHutils.formatCurrency(product.orderAmount || 0)
			products.push(product)
		})
		if(products.length == 0){
			products=null;
		}
		return products;
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
				GHutils.log(result,"交易明细=========")
				if(GHutils.checkErrorCode(result)){
					GHutils.table("#mytn-detail-table",_this.columnDefine,result.rows,"#mytn-detail-table-noRecord","--")
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
			dom.show().parent().css('height','62px')
		}
		dom.createPage({
			pageCount: pageCount,
			current: 1,
			backFn: function(page) {
				_this.paramRecord.page = page;
				_this.loadTradeRecord(false)
			}
		});
	}
}

$(function() {
	new AccountMyTn().init();
})
