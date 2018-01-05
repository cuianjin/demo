var ProductT0List = function() {
	this.param={
		channelOid:channelOid,
		page:1,
		rows:10
	}
	this.myt0s=[];
	this.loginStatus=false;
	return this;
}

ProductT0List.prototype =  {
	init: function() {
		this.pageInit();
		this.bindEvent();
	},
	pageInit:function(){
		var _this = this;
		_this.getT0List(true);
	},
	bindEvent:function(){
		
	},
	getMyTn:function(){
		
	},
	getT0List:function(isFirst){
		var _this = this;
		GHutils.load({
			url: GHutils.API.PRODUCT.gett0productlist+GHutils.parseParam(_this.param),
			data: {},
			type: "post",
			callback: function(result) {
				GHutils.log(result,"活期列表======");
				if(result.errorCode != 0 && isFirst){
					$("#badRequest").show().next().hide().next().hide();
					return false;
				}
				var products = [];
				GHutils.forEach(result.rows,function(idx,product){
					if(GHutils.label(product.labelList,'8')){
						return false;
					}
					product.labelList = GHutils.parseLabel(product.labelList)
					product.investMin+=0
					product.netUnitShare = 1
					product.expArrorDisp  = product.expArrorDisp.replace('~','-')
					var rewardInterest = product.rewardInterest || null
					if(rewardInterest){
						rewardInterest = GHutils.toFixeds(product.rewardInterest, 2)
					}
					product.rewardInterest = rewardInterest
					var gobuy2 = {"clazz":"tnlist-no-buy","notSale":{"text":"已售罄"},"sale":null}
					
//						if(product.state == "REVIEWPASS"){
//							gobuy2.notSale.text = "敬请期待"
//						}else 
					if(product.state == "DURATIONING" && product.isOpenPurchase == "NO"){
						gobuy2.notSale.text = "不可购买"
					}else if(product.state == "DURATIONING" && (product.maxSaleVolume == product.lockCollectedVolume || GHutils.Fmul(GHutils.Fsub(product.maxSaleVolume, product.lockCollectedVolume), 1) < product.investMin)){
//							gobuy2.notSale.text = "已售罄"
					}else if(product.state == "CLEARING" || product.state == "CLEARED"){
//							gobuy2.notSale.text = "已售罄"
					}else{
						if(product.state == "REVIEWPASS"){
							gobuy2.notSale.text = "敬请期待"
						}else{
							gobuy2.sale = {"text":"立即抢购"}
							gobuy2.clazz=""
							gobuy2.notSale=null
						}
					}
					var incomeDealType = {"reinvest":"收益结转","cash":"现金分红"};
                    product["incomeDealType"]  = incomeDealType[(product.incomeDealType)]
					product["gobuy2"]=gobuy2
					products.push(product)
				})
				if(products.length == 1){
					window.location.href = "product-t0.html?productOid="+products[0].productOid
				}else if(products.length > 0){
					$("#t0-list-container").parent().show().prev().show().prev().hide();
					$("#t0-list-noRecord").addClass("gh_none")
					GHutils.mustcache("#product-t0-list-template","#t0-list",{"prodT0List":products})
					_this.toProductInfo();
				}else{
					$("#t0-list-container").parent().show().prev().show().prev().hide();
					$("#t0-list-noRecord").removeClass("gh_none")
					$("#t0-list").html('')
				}
				if(isFirst){
					_this.createPage(Math.ceil(result.total/_this.param.rows));
				}
			},
			errcallback:function(){
				if(isFirst){
					$("#badRequest").show().next().hide().next().hide();
				}
			}
		});
	},
	createPage: function(pageCount) {
		var _this = this;
		if(pageCount <= 1){
			$(".gh_tcdPageCode").hide()
			return
		}
		$(".gh_tcdPageCode").show().createPage({
			pageCount: pageCount,
			current: 1,
			backFn: function(page) {
				_this.param.page = page;
				_this.getT0List(false);
			}
		});
	},
	toProductInfo:function(){
		var _this = this
		$('.t0ProductInfo').off().on('click',function(){
			var oid = $(this).attr('data-oid')
			window.location.href='product-t0.html?productOid='+oid
		})
	}
}
	
$(function() {
	new ProductT0List().init();
})



