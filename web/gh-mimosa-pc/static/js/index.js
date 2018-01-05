var Index = function() {
	this.mytns = null;
	this.myt0s = null;
	return this;
}

Index.prototype = {
	init: function() {
		this.pageinit();
		this.bindEvent();
	},
	pageinit: function() {
		var _this = this;
		_this.getPcHome();
		_this.getProducts();
		_this.getStatistics();
		_this.getPartner();
		_this.InvestGuid();
		_this.bannerTip();
	},
	getPcHome: function() {
		var _this = this;
		GHutils.load({
			url: GHutils.API.CMS.gethome + '?channelOid=' + cmsChannelOid,
			data: {},
			type: "post",
			callback: function(result) {
                if(result.errorCode != 0) {
					GHutils.log(result, "=========");
					$("#carousel-example-generic").html('<img src="static/images/index_banner.jpg" height="460"/>')
					$("#index_notice").html("暂无公告")
					return;
				} else {
					var banners = []
					var clazz = null;
					GHutils.forEach(result.info.banner.rows, function(idx, item) {
						clazz = ""
						if(idx == 0) {
							clazz = "active"
						}
						item["clazz"] = clazz
						banners.push(item)
					})
					var data = {
						"banner": banners
					}
					var len = banners.length;
					if(len == 0 || len == 1) {
						var _imageUrl = "static/images/index_banner.jpg";
						if(len == 1){
                            _imageUrl = data.banner[0].imageUrl;
						}
                        $("#carousel-example-generic").html('<img src="'+_imageUrl+'" height="460"/>')
					}else{
                        GHutils.mustcache("#index-banner-template", "#carousel-example-generic", data)
                        var mySwiper = new Swiper ('.swiper-container', {
                            direction: 'horizontal',
                            autoplay : 5000,
                            speed:800,
                            loop: true,
                            // 如果需要分页器
                            pagination: '.pagination',
                            paginationClickable: true,
                        })
					}

					var notice = result.info.notice;
					if(notice && notice.rows.length > 0) {
						var notices = notice.rows[0];
						var _noticeLabel = '';
						if(notices.subscript != "无"){
							_noticeLabel = '<i class="notice_'+notices.subscript+'">'+notices.subscript+'</i>'
						}else if(notices.subscript == "无"){
							_noticeLabel = ''
						}
						$("#index_notice").html(notices.title).parent().append(_noticeLabel);
					} else {
						$("#index_notice").html("暂无公告")
					}

//					//限制首页新闻动态3条
//					var newList = [];//媒体报道
//					var noticeList = [];//公司动态
//					
//					
//					var information = []
//					GHutils.forEach(result.info.information, function(idx, item) {
//						if(item.type == "媒体报道" && newList.length <5){
//							newList.push(item)
//						}
//						
//						if(item.type == "公司动态" && noticeList.length <5){
//							noticeList.push(item)
//						}
////						information.push(item)
////						if(idx == 2) return true;
//					})
//					
//					var newHtml="";
//					var imgUlr=""
//					GHutils.forEach(newList,function(idx, item){
//						if(idx == 0 && !imgUlr && item.thumbnailUrl){
//							imgUlr=true;
//							$("#newList-img").attr('src',item.thumbnailUrl);
//						}
//						newHtml+='<li data-url="'+item.url+'" data-title="'+item.title+'" data-content="'+item.content+'">·<a href="javascript:;">'+item.title+'</a><span class="pull-right">'+item.publishTime+'</span></li>'
//					})
//					$("#newList").html(newHtml)
//					
//					var noticeHtml=""
//					GHutils.forEach(noticeList,function(idx, item){
//						noticeHtml+='<li data-url="'+item.url+'" data-title="'+item.title+'" data-content="'+encodeURIComponent(item.content)+'">·<a href="javascript:;">'+item.title+'</a><span class="pull-right">'+item.publishTime+'</span></li>'
//					})
//					$("#noticeList").html(noticeHtml)
//					
					
//					GHutils.mustcache("#index-hotNews-template", "#newList", {
//						"information": information
//					})
//					_this.bindEvent()
				}
			}
		});
	},
	bannerTip:function(){
		var _this = this;
		GHutils.isLogin(function(){
			$("#IndexBannerSupernatant_login_done").removeClass("gh_none")
			if(!GHutils.userinfo){
				GHutils.userinfo = GHutils.getUserInfo();
			}
			var userinfo = GHutils.userinfo;
			var userAcc = userinfo.userAcc.substring(0,3)+'****'+userinfo.userAcc.substring(7,11)
			$("#pc_user_number").html(userAcc)
			var authens = ["bankName","paypwd","isRiskAssessment"]
			var isComplete = true;
			for(var i = 0 ;i<authens.length;i++){
				var auth = authens[i];
				if(userinfo[auth]){
					$("."+auth+"_icon").addClass("active")
				}else{
					isComplete = false;
					$("."+auth+"_icon").removeClass("active")
				}
			}
			
			if(isComplete){
				$("#infoComplete").removeClass("gh_none")
			}else{
				$("#infoNotComplete").removeClass("gh_none")
			}
			
			
		},function(){
			$("#IndexBannerSupernatant").removeClass("gh_none")
			
			
		})
	},
	getProducts: function() {
		var _this = this;
		GHutils.load({
			url: GHutils.API.PRODUCT.getproductlist + '?channelOid=' + channelOid,
			type: "post",
			callback: function(result) {
				if(result.errorCode != 0) {
					return;
				} else {
					var productstarlist = [], productemployeelist = [], productlist = [];
					for(var i = 0; i < result.rows.length; i++) {
						var item = result.rows[i];
						item[(item.type)] = item.type;
						switch (result.rows[i].pitCode) {
							case "1" : 
								productstarlist.push(_this.protnlist(result.rows[i]))
								break
							case "2" : case "3" : case "4" : 
								productemployeelist.push(_this.protnlist(result.rows[i]));
								break
							case "5" : case "6" : case "7" : 
								productlist.push(_this.protnlist(result.rows[i]));
								break
							default : break
						}
					}
					if(productstarlist.length > 0){
						$("#productstarlist").show()
						GHutils.mustcache("#index-productstar-list-template", "#index_product_t0", productstarlist[0])
					}else{
						$("#productstarlist").hide()
					}
					if(productemployeelist.length > 0){
						$("#productemployeelist").show()
						GHutils.mustcache("#index-employee-list-template", "#index_product_staff", {
							"productemployeelist": productemployeelist
						})
					}else{
						$("#productemployeelist").hide()
					}
					if(productlist.length > 0){
						$("#productlist").show()
						switch (productlist.length) {
							case 1 : 
								productlist[0]["ml"] = '376'
								break
							case 2 : 
								productlist[0]["ml"] = '173'
								break
							default : break
						}
						GHutils.mustcache("#index-producttn-list-template", "#index_product_tn", {
							"prodTnList": productlist
						})
					}else{
						$("#productlist").hide()
					}
					_this.bindEvent()
				}
			}
		});
	},
	getStatistics: function() {
		var _this = this;
		GHutils.load({
			url: GHutils.API.PRODUCT.statistics,
			type: 'post',
			callback: function(data) {
				$('#totalAmountInvest').html(GHutils.formatCurrency(data.totalTradeAmount + 0))
				$('#totalAmountGet').html(GHutils.formatIntCurrency(data.registerAmount+0))
			}
		})
	},
	getPartner: function() {
		var _this = this;
		GHutils.load({
			url: GHutils.API.CMS.getPartner + '?channelOid=' + cmsChannelOid,
			type: "post",
			callback: function(result) {
				if(result.errorCode != 0) {
					$("#partner").hide()
					return;
				} else {
					var partners = {}
					GHutils.forEach(result.rows, function(idx, partner) {
						partners[idx] = partner
					})
					_this.scrollPartner(partners, result.rows.length);
				}
			}
		});
	},
	prot0list: function(product, type) {
		var _this = this;
		product.labelList = GHutils.parseLabel(product.labelList);
		product.expArrorDisp = product.expArrorDisp.replace('~', '-')
		var rewardInterest = product.rewardInterest || null
		if(rewardInterest) {
			rewardInterest = GHutils.toFixeds(product.rewardInterest, 2)
		}
		product.rewardInterest = rewardInterest
		product.investMin += 0
		var gobuy = {
			"noSale": null,
			"sale": null
		};
		
		if(product.state == "waitToSale" || product.state == "notAllowedSale" || product.state == "saleOut"){
			gobuy.noSale = true;
		}else if(product.state == "saling"){
			gobuy.sale = true;
		}
		
		gobuy.btnTxt = product.stateDisp;
		
		product["gobuy"] = gobuy
		GHutils.log(product, "活期=============");
		return product
	},
	protnlist: function(product) {
		var _this = this;

		product.labelList = GHutils.parseLabel(product.labelList);
		

		product.expArrorDisp = product.expArrorDisp.replace('~', '-')
		var rewardInterest = product.rewardInterest || null
		if(rewardInterest) {
			rewardInterest = GHutils.toFixeds(product.rewardInterest, 2)
		}
		product.rewardInterest = rewardInterest
		product.investMin += 0

		
		product.netUnitShare = 1;
		var percent = GHutils.toFixeds(GHutils.Fmul(GHutils.Fdiv(GHutils.Fadd(product.collectedVolume, GHutils.Fmul(product.lockCollectedVolume, product.netUnitShare)), product.raisedTotalNumber), 100), 0);
		
		var gobuy = {
			"noSale": null,
			"sale": null
		};
		if(product.state == "waitToSale" || product.state == "notAllowedSale" || product.state == "saleOut"){
			gobuy.noSale = true;
			percent = 100;
		}else if(product.state == "saling"){
			gobuy.sale = true;
		}
		
		if(percent === "100.00") {
			percent = 100;
		}
		product["percent"] = percent
		
		
		gobuy.btnTxt=product.stateDisp
		product.raisedTotalNumber = GHutils.toFixeds(GHutils.Fdiv(product.raisedTotalNumber, 10000), 2)

//		product["progh_none"] = progh_none
		product["gobuy"] = gobuy
		return product;
	},
	scrollPartner: function(partners, total) {
		var box = $('#parners'),
			scrollIndex = 0

		$("#go_right").off().on("click", function() {
			if($("#go_right").hasClass('go_right')) {
				return false;
			}
			scrollIndex += 5
			joinPartners()
			changeBtn()
		})

		$("#go_left").off().on("click", function() {
			if($("#go_left").hasClass('go_left')) {
				return false;
			}
			scrollIndex -= 5
			joinPartners()
			changeBtn()
		})

		function joinPartners() {
			var partnerstr = ''
			var max = scrollIndex + 5 >= total ? total : scrollIndex + 5
			var ml = ''
			switch (total) {
				case 1 : 
					ml = 465
					break
				case 2 : 
					ml = 372
					break
				case 3 : 
					ml = 279
					break
				case 4 : 
					ml = 186
					break
				case 5 : 
					ml = 93
					break
				default : break
			}
			ml = 'margin-left: '+ml+'px;'
			for(var i = scrollIndex; i < total; i++) {
				var partner = partners[i]
				var _href="javascript:;"
				var target = ""
				if(partner.isLink == 'is'){
					_href=partner.linkUrl 
					target='target="_blank"'
				}
				partnerstr += '<li style="'+(i ? "" : ml)+'z-index:0"><a href="'+_href+'" '+target+'><img src="' + partner.imageUrl + '" alt="合作伙伴_国槐科技" /></a></li>'
			}
			if(partnerstr){
				$(box).html(partnerstr)
				$("#partner").show()
			}else{
				$("#partner").hide()
			}
		}

		function changeBtn() {
			if(scrollIndex == 0) $("#go_left").attr('class', 'go_left');
			else $("#go_left").attr('class', 'leftOn');
			if(scrollIndex + 5 >= total) {
				$("#go_right").attr('class', 'go_right')
			} else {
				$("#go_right").attr('class', 'rightOn')
			}
		}

		joinPartners()
		changeBtn()

	},
	bindEvent: function() {
		var _this = this;
		//兼容ie8 forEach循环；
		if(!Array.prototype.forEach) {
			Array.prototype.forEach = function forEach(callback, thisArg) {
				var T, k;
				if(this == null) {
					throw new TypeError("this is null or not defined");
				}
				var O = Object(this);
				var len = O.length >>> 0;
				if(typeof callback !== "function") {
					throw new TypeError(callback + " is not a function");
				}
				if(arguments.length > 1) {
					T = thisArg;
				}
				k = 0;
				while(k < len) {
					var kValue;
					if(k in O) {
						kValue = O[k];
						callback.call(T, kValue, k, O);
					}
					k++;
				}
			};
		}

		function placeholderSupport() {
			return 'placeholder' in document.createElement('input');
		}
		//placeholder兼容ie浏览器
		if(!placeholderSupport()) { // 判断浏览器是否支持 placeholder
			$('[placeholder]').focus(function() {
				var input = $(this);
				if(input.val() == input.attr('placeholder')) {
					input.val('');
					input.removeClass('placeholder');
				}
			}).blur(function() {
				var input = $(this);
				if(input.val() == '' || input.val() == input.attr('placeholder')) {
					input.addClass('placeholder');
					input.val(input.attr('placeholder'));
				}
			}).blur();
		};

		//banner跳转
		$(".item-link").off().on("click", function() {
			var links = $(this).attr("data-url") || '';
			var topage = $(this).attr("data-topage") || '';
			if(topage == 'T1') {
				window.location.href = "product-t0.html"
			} else if(topage == 'T2') {
				window.location.href = "product-tn-list.html"
			} else if(topage == 'T3') {
				$("#userRegister").css({
					"display": "block"
				})
			} else if(links != '') {
				window.location.href = links
			}
		});

		//公告跳转
		$(".pro_notice").find("span").off().on("click", function() {
			window.location.href = "notice.html"
		})

		
		$(".toAccount").off().on("click", function() {
			window.location.href = "account.html"
		})

		$('.t0ProductInfo').off().on('click', function() {
			window.location.href = 'product-t0.html?productOid=' + $(this).attr("data-oid");
		})
		
//		$(".t0SoldOut").off().on('click', function() {
//			var dom = $(this)
//			GHutils.isLogin(function() {
//				var oid = dom.attr('data-noSaleOid')
//				var _msg = dom.html();
//				if(_msg == "敬请期待"){
//					_msg = "项目暂未开放购买，敬请期待"
//				}else{
//					_msg = "项目"+_msg+"，项目详情仅对本项目投资人公开";
//				}
//				$("#prodStatus").html(_msg)
//				if(_this.myt0s) {
//					if(_this.myt0s[oid]) {
//						window.location.href = 'product-t0.html?productOid=' + oid
//					} else {
//						$('#content-box').modal('show')
//					}
//				} else {
//					_this.getMyT0(oid);
//				}
//			}, function() {
//				$(".toLogin").trigger('click')
//			})
//		})
		
		$('.tnProductInfo').off().on('click', function() {
			window.location.href = 'product-tn.html?productOid=' + $(this).attr("data-oid");
		})

		$('.tnSoldOut').off().on('click', function() {
			var dom = $(this)
			GHutils.isLogin(function() {
				var oid = dom.attr('data-noSaleOid')
				var _msg = dom.html();
				if(_msg == "敬请期待"){
					_msg = "项目暂未开放购买，敬请期待"
				}else{
					_msg = "项目"+_msg+"，项目详情仅对本项目投资人公开";
				}
				$("#prodStatus").html(_msg)
				if(_this.mytns) {
					if(_this.mytns[oid]) {
						window.location.href = 'product-tn.html?productOid=' + oid
					} else {
						$('#content-box').modal('show')
					}
				} else {
					_this.getMyTn(oid);
				}
			}, function() {
				$(".toLogin").trigger('click')
			})
		})

		//热门资讯跳转
		$('.informationDetail').off().on('click','li',  function() {
			var urlArr = $(this).attr('data-url');
			if(urlArr) {
				$(this).find("a").attr("target","_blank").attr('href', urlArr);
			} else {
				var title = $(this).attr('data-title');
				var content = decodeURIComponent($(this).attr('data-content') || "");
				$('#content_box').modal('show');
				$('#modalTitle').html(title);
				$('#modalBody').html(content);
			}
		})
		//跳转安全保障
		$('.index_safe_box').find(".gh_warp.safe").on('click', function() {
			window.location.href = "safety.html";
		})
		
		$("#toCompleteInfo").on('click',function(){
			window.location.href="account-validate.html?action=auth&actionURL="+window.location.href;
		})
		
		// $('.index_platform_data_box .gh_warp').on('click',function(){
		// 	window.location.href="account.html"
		// })
	},
	getMyTn: function(oid) {
		var _this = this
		GHutils.load({
			url: GHutils.API.ACCOUNT.protnlist,
			data: {},
			type: 'post',
			async: false,
			callback: function(result) {
				if(result.errorCode != 0) {
					//					_this.getData('&order=asc',1,true)
					return false;
				}
				_this.mytns = []
				result.holdingTnDetails.rows.forEach(function(product) {
					_this.mytns[product.productOid] = true
				})
				result.toConfirmTnDetails.rows.forEach(function(product) {
					_this.mytns[product.productOid] = true
				})

				result.closedTnDetails.rows.forEach(function(product) {
					_this.mytns[product.productOid] = true
				})
				if(_this.mytns[oid]) {
					window.location.href = 'product-tn.html?productOid=' + oid
				} else {
					$('#content-box').modal('show')
				}
			}
		})
	},
//	getMyT0: function(oid) {
//		var _this = this
//		GHutils.load({
//			url: GHutils.API.ACCOUNT.prot0list,
//			data: {},
//			type: "post",
//			callback: function(result) {
//				GHutils.log(result,"我的活期======")
//				if(result.errorCode != 0){
//					return false;
//				}
//				//持有中
//				GHutils.forEach(result.holdingDetails.rows,function(idx,product){
//					_this.myt0s[product.productOid] = true
//				})
//				//持有中
//				GHutils.forEach(result.toConfirmDetails.rows,function(idx,product){
//					_this.myt0s[product.productOid] = true
//				})
//				
//				if(_this.myt0s[oid]) {
//					window.location.href = 'product-t0.html?productOid=' + oid
//				} else {
//					$('#content-box').modal('show')
//				}
//			}
//		})
//	},
	InvestGuid: function() {
		GHutils.isLogin(function() {
			$("#goRigester").html("立即加入").parent().attr('href', "product-t0.html")
		}, function() {
			$("#goRigester").html("立即注册").parent().attr('href', "register.html")
		})
	}

}

$(function() {
	new Index().init();
})
