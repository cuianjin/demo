var ProductTnList = function() {
	this.mytns={};
	this.loginStatus =false
	this.data=[];
//	this.rows = 9;
	this.styles='style1';
	this.param = {
		channelOid : channelOid,
		page : 1,
		rows : 9,
		sort : "",
		order : "asc",
		durationPeriodDaysStart : "",
		durationPeriodDaysEnd : "",
		expArorStart : "",
		expArorEnd : "",
		
	};
	return this;
}

ProductTnList.prototype =  {
	init: function() {
		this.pageInit();
		this.bindEvent();
	},
	pageInit:function(){
		var _this = this;
		var styles= GHutils.getCookie("style");
		if(styles){
			_this.styles=styles
			$("[data-style='"+styles+"']").addClass('active')
		}else{
			$("[data-style]").eq(0).addClass('active')
		}
		_this.getData(true)
		_this.getMyTn();
	},
	bindEvent:function(){
		var _this = this
		$('#sort li a').on('click',function(){
			var order = $(this).is('.desc') ? 'desc':'asc'
			$('#sort').find('a').removeClass('desc').removeClass('active').removeClass('tn_listarrow').removeClass('tn_listarrow2')
			$(this).addClass('active')
			if($(this).is('.no')){
				$(this).removeClass('tn_listarrow2')
				order='';
			}else{
				$('.no').addClass('tn_listarrow2')
				if(order == 'asc'){
					$(this).addClass('desc').addClass('tn_listarrow2')
				}else{
					$(this).addClass('tn_listarrow')
				}
			}
			_this.param.order  = order;
			_this.param.sort = $(this).attr('data-sort')
			_this.param.page = 1;
//			$('#sort').find('a').attr('data-sort','desc')
//			var urlParam = '';
//			if($(this).attr('data-sort')){
//				urlParam = '&sort='+$(this).attr('data-sort')
//			}
			_this.getData(true)
		})
		
		$('.product_tnlist_stylebtn li a').on('click',function(){
			if($(this).hasClass('active')){
				return
			}
			$(this).closest('ul').find('a').removeClass('active')
			$(this).addClass("active")
			var styles = $(this).attr('data-style')
			GHutils.setCookie("style",styles)
			_this.styles=styles
			_this.changeStyle();
		})
		
		$("#filters").on('click','li',function(){
			var dom = $(this);
			if(dom.hasClass('active') || !$(this).attr('data-sort')){
				return;
			}
			dom.addClass('active').siblings().removeClass('active')
			dom.parent().prev().find("span").removeClass("active")
			var sorts = JSON.parse(dom.attr('data-sort')||'{}');
			if(typeof(sorts)=="object"){
				for(var key in sorts){
					_this.param[key] = sorts[key];
				}
			}
			_this.param.page = 1;
			_this.getData(true);
		})
		
		$(".all_choose_btn").on('click',function(){
			var dom = $(this);
			if(dom.hasClass('active')){
				return;
			}
			dom.addClass('active').parent().next().find("li").removeClass('active')
			var sorts = JSON.parse(dom.attr('data-sort')||'{}');
			if(typeof(sorts)=="object"){
				for(var key in sorts){
					_this.param[key] = sorts[key];
				}
			}
			_this.param.page = 1;
			_this.getData(true);
		})
	},
	getMyTn:function(){
		var _this = this
		GHutils.load({
			url:GHutils.API.ACCOUNT.protnlist,
			data:{},
			type:'post',
			async:false,
			callback:function(result){
				if(result.errorCode != 0){
//					_this.getData('&order=asc',1,true)
					return false;
				}
				GHutils.forEach(result.holdingTnDetails.rows,function(idx,product){
					_this.mytns[product.productOid]= true
				})
				
				GHutils.forEach(result.toConfirmTnDetails.rows,function(idx,product){
					_this.mytns[product.productOid]= true
				})
				
				GHutils.forEach(result.closedTnDetails.rows,function(idx,product){
					_this.mytns[product.productOid]= true
				})
			}
		})
	},
	getData:function(isFlag){
		var _this = this
		_this.data=[]
		GHutils.load({
			url: GHutils.API.PRODUCT.gettnproductlist+GHutils.parseParam(_this.param),  
			data: {},
			type: "post",
			async: false,
			callback: function(result) {
				if(result.errorCode != 0) {
					return;
				} else {
					GHutils.forEach(result.rows,function(idx,product){
						if(GHutils.label(product.labelList,'8')){
							return false
						}
						product.labelList = GHutils.parseLabel(product.labelList)
						product.investMin+=0
						product.netUnitShare = 1
						var raisedTotalNumber = product.raisedTotalNumber
						product.raisedTotalNumber = GHutils.formatCurrency(raisedTotalNumber/10000)
						
						product.expArrorDisp  = product.expArrorDisp.replace('~','-')
						var rewardInterest = product.rewardInterest || null
						if(rewardInterest){
							rewardInterest = GHutils.toFixeds(product.rewardInterest, 2)
						}
						product.rewardInterest = rewardInterest
						
						
						var gobuy1={"cssStyle":"block"}
						var gobuy2 = {"clazz":"tnlist-no-buy","notSale":{"text":"已售罄"},"sale":null}
						var amount =0,percent = 100;
						var showProcess = "gh_none"
//						if(product.state == "REVIEWPASS"){
//							gobuy2.notSale.text = "敬请期待"
//							amount = raisedTotalNumber - ((product.lockCollectedVolume*product.netUnitShare)+product.collectedVolume);
//							percent = GHutils.toFixeds(GHutils.Fmul(GHutils.Fdiv(GHutils.Fadd(product.collectedVolume, GHutils.Fmul(product.lockCollectedVolume, product.netUnitShare)), raisedTotalNumber), 100),0);
//						}else 
						if(product.state == "RAISEFAIL" || (product.state == "RAISING" && product.isOpenPurchase == "NO")){
//							percent = 100;
//							amount=0;
							gobuy2.notSale.text = "不可购买"
						}else if(product.state == "RAISING" && (product.maxSaleVolume == product.lockCollectedVolume || GHutils.Fmul(GHutils.Fsub(product.maxSaleVolume, product.lockCollectedVolume), 1) < product.investMin)){
//							percent = 100;
//							amount=0;
//							gobuy2.notSale.text = "已售罄"
						}else if(product.state == "RAISEEND" || product.state == "DURATIONING" || product.state == "DURATIONEND" || product.state == "CLEARING" || product.state == "CLEARED"){
//							percent = 100;
//							amount=0;
//							gobuy2.notSale.text = "已售罄"
						}else{
							amount = raisedTotalNumber - ((product.lockCollectedVolume*product.netUnitShare)+product.collectedVolume);
							percent = GHutils.toFixeds(GHutils.Fmul(GHutils.Fdiv(GHutils.Fadd(product.collectedVolume, GHutils.Fmul(product.lockCollectedVolume, product.netUnitShare)), raisedTotalNumber), 100),0);
							if(product.state == "REVIEWPASS"){
								gobuy2.notSale.text = "敬请期待"
							}else{
								gobuy1["cssStyle"]=""
								gobuy1["sale"]=true
								gobuy2.sale = {"text":"立即抢购"}
								gobuy2.clazz=""
								gobuy2.notSale=null
								showProcess=""
							}
						}
						
						product["amount"] = GHutils.toFixeds(amount,2)
						product["percent"] = percent
						product["showProcess"] = showProcess
						
						product["gobuy1"]=gobuy1
						product["gobuy2"]=gobuy2
						product["clas"]=gobuy2
						_this.data.push(product)
					})
					_this.changeStyle();
					var total = result.total
//					$('.tn_pagenum').html('	第'+_this.param.page+'页  &nbsp;共'+Math.ceil(total/_this.rows)+'页  &nbsp;共'+total+'个产品</div>')
					if(isFlag){
						_this.createPage(Math.ceil(total/_this.param.rows));
					}
				}
			}
		});
	},
	changeStyle:function(){
		var _this = this;
		var data = {}
		if(_this.data.length > 0){
			$("#tn-list-noRecord").addClass("gh_none")
			data[_this.styles] = {"prodTnList":_this.data}
			GHutils.mustcache("#product-tn-list-template","#tn-list",data)
			_this.toProductInfo();
		}else{
			$("#tn-list-noRecord").removeClass("gh_none")
			$("#tn-list").html('')
		}
		
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
				_this.getData(false);
			}
		});
	},
	toProductInfo:function(){
		var _this = this
		$('.tnProductInfo').off().on('click',function(){
			var oid = $(this).attr('data-oid')
			if(oid){
				window.location.href='product-tn.html?productOid='+oid
			}else{
				var noSaleOid = $(this).attr('data-noSale')
				var _msg = $(this).html();
				if(_msg == "敬请期待"){
					_msg = "项目暂未开放购买，敬请期待"
				}else{
					_msg = "项目"+_msg+"，项目详情仅对本项目投资人公开";
				}
				$("#prodStatus").html(_msg)
				if(_this.loginStatus){
					if(_this.mytns[noSaleOid]){
						window.location.href='product-tn.html?productOid='+noSaleOid
					}else{
						$('#content-box').modal('show')
					}
				}else{
					GHutils.isLogin(function(){
						_this.loginStatus = true
						_this.getMyTn()
						if(_this.mytns[noSaleOid]){
							window.location.href='product-tn.html?productOid='+noSaleOid
						}else{
							$('#content-box').modal('show')
						}
					})
				}
			}
			
		})
	}
}
	
$(function() {
	new ProductTnList().init();
})



