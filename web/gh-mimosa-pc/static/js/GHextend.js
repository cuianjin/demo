(function($){
	$.fn.extend({  
		//调用方法： $("#aaa").modal('show/hide')
	    modal:function(action){ 
	    	var selector = this;
	        var _modal = $(".gh_modal.active")
			if(action == "show"){
				if(_modal.length == 0){
					var _scroll =document.body.offsetWidth;
					$('body').css('overflow-y',"hidden")
					var _scroll2 = document.body.offsetWidth;
					$('body').css('padding-right',(_scroll2-_scroll)+'px')
				}
				var _zIndex = 5000+Number(_modal.length)*50;
				$(selector).removeClass('gh_modal')//.css("behavior","url(static/css/plugins/PIE.htc)")
				$(selector).css('z-index',_zIndex).addClass('active').addClass('gh_modal').fadeIn(300)
			}else{
				_modal = $(".gh_modal.active");
				$(selector).hide().removeClass('active');
				if(_modal.length == 1){
					$('body').css('overflow-y',"auto").css('padding-right','0px')
				}
			}
			$(selector).find(".gh_modal_close").off().on('click',function(){
				$(selector).modal('hide')
			})
			
			$(selector).find(".gh_modal_cancel").off().on('click',function(){
				$(selector).modal('hide')
			})
	    }
	}); 
	
	
	$.extend({  
		//调用方法：$.tab()
	    tab:function(){
			$('ul[role="tablist"].gh_tabs_nav').each(function(idx,ele){
				var _tabNav =$(ele);
				var _activeTab = _tabNav.find('li[role="presentation"].active').eq(0);
				if(!_activeTab || _activeTab.length == 0){
					_activeTab = _tabNav.children('li[role="presentation"]').eq(0).addClass("active")
				}
				$.tabAction(_tabNav,_activeTab);
				_tabNav.find('a[role="tab"]').on('click',function(){
					var _tab = $(this).parent();
					if(!_tab.hasClass('active')){
						_tab.addClass('active').siblings().removeClass('active');
						$.tabAction(_tabNav,_tab)
					}
				})
			});
		},
		tabAction:function(_tabNav,activeTab){
			activeTab.siblings().removeClass("active");
			var _paneId = activeTab.attr('data-pane');
			var _activePane = _tabNav.parent().find(_paneId+"[role='tabpanel'].gh_tabs_pane")
			_activePane.siblings().hide().removeClass("active");
			_activePane.fadeIn(300).addClass("active")
		},
		//调用方法：$.validate(selector)
		validate:function(selector){
			var _this = this;
			var result = true;
			var notValid = [];
			$("#" + selector + " input,#" + selector + " select,#" + selector + " textarea").each(function(i, d) {
				if(notValid.length == 1){
					return ;
				}
				var dom = $(d);
				var valid = dom.attr("valid");
				if (valid && result) {
					var e = JSON.parse(valid || "{}");
					var tips = ops.tipsbox || false;
					var _val = dom.val()
					var msg = e.msg;
					if (e.required || _val) {
						if (!_val) {
							_this.showError(dom,tips,tipsMsg+'不能为空');
							notValid.push(dom)
							result = false;
						}else if (e.minLength) {
							if (_val.length < e.minLength) {
								_this.showError(dom,tips,msg + '不能小于' + e.minLength + '位');
								notValid.push(dom)
								result = false;
							}
						}else if (e.between) {
							if (_val.length < e.between[0] || _val.length > e.between[1]) {
								_this.showError(dom,tips,msg + '长度在' + e.between[0] + '-' + e.between[1] + '位之间');
								notValid.push(dom)
								result = false;
							}
						}else if (e.finalLength) {
							if (_val.length != e.finalLength) {
								_this.showError(dom,tips,msg + '为' + e.finalLength + '位');
								notValid.push(dom)
								result = false;
							}
						}else if (e.equals) {
							if (_val != $("#" + e.equals).val()) {
								_this.showError(dom,tips,msg + '和' + e.equalsMsg + '不一致');
								notValid.push(dom)
								result = false;
							}
						}else if (e.mobilePhone) {
							if (!_val.match("^1[3|4|5|7|8][0-9]{9}$")) {
								_this.showError(dom,tips,msg + '格式不正确');
								notValid.push(dom)
								result = false;
							}
						} else if (e.identityCard) {
							if (!_val.match("^\\d{17}[X|\\d|x]$")) {
								_this.showError(dom,tips,msg + '格式不正确');
								notValid.push(dom)
								result = false;
							}
						} else if (e.passWord) {
							if (!_val.match("^([\x21-\x7e]|[a-zA-Z0-9]){6,16}$")) {
								_this.showError(dom,tips,msg + '格式不正确');
								notValid.push(dom)
								result = false;
							}
						} else if (e.payPassWord) {
							if (!_val.match("^[0-9]{6}$")) {
								_this.showError(dom,tips,msg + '格式不正确');
								notValid.push(dom)
								result = false;
							}
						} else if (e.debitCard) {
							if (!_val.match("^\\d{16,19}$")) {
								_this.showError(dom,tips,msg + '格式不正确');
								notValid.push(dom)
								result = false;
							}
						} else if (e.positiveInteger) {
							if (!_val.match("^[0-9]+\\d*$")) {
								_this.showError(dom,tips,msg + '格式不正确');
								notValid.push(dom)
								result = false;
							}
						} else if (e.positiveNumber) {
							if (!_val.match("^[0-9]+\.?[0-9]*$")) {
								_this.showError(dom,tips,msg + '格式不正确');
								notValid.push(dom)
								result = false;
							}
						} else if (e.floatNum) {
							if (!_val.match("^(([1-9]\\d*)|0)(\.\\d{0,2})?$")) {
								_this.showError(dom,tips,msg + '格式不正确');
								notValid.push(dom)
								result = false;
							}
						} else if (e.nickName) {
							if (!_val.match("^[\u4E00-\u9FA5A-Za-z0-9_]{2,15}$")) {
								_this.showError(dom,tips,msg + '格式不正确');
								notValid.push(dom)
								result = false;
							}
						} else if (e.invitationNum) {
							if (!_val.match("^[A-Za-z0-9]{7}$")) {
								_this.showError(dom,tips,msg + '格式不正确');
								notValid.push(dom)
								result = false;
							}
						} else if (e.realName) {
							if (!_val.match("^[\u4E00-\u9FA5A-Za-z0-9_·]{1,20}$")) {
								_this.showError(dom,tips,msg + '格式不正确');
								notValid.push(dom)
								result = false;
							}
						} else if (e.verifycode) {
							if (!_val.match("^[0-9]{6}$")) {
								_this.showError(dom,tips,msg + '格式不正确');
								notValid.push(dom)
								result = false;
							}
						}
					}
				}
			});
			if(!result && notValid.length > 0){
				var browser=navigator.appName 
				var trim_Version=(navigator.appVersion.split(";")[1] || "").replace(/[ ]/g,""); 
				if(browser=="Netscape" || (browser=="Microsoft Internet Explorer" && (trim_Version=="MSIE8.0" || trim_Version=="MSIE9.0") )){
					for(var i = 0 ;i<notValid.length;i++){
						notValid[i].keyup(function(){
							_this.clearError(notValid[i]);
						})
						.on("contextmenu",function(e){//禁止鼠标右键弹出操作选项列表
							e.preventDefault();
						})
						
					}
				}else{
					for(var i = 0 ;i<notValid.length;i++){
						notValid[i].on("input",function(e){
							_this.clearError(notValid[i]);
						})
					}
				}
			}
			return result;
		},
		showError:function(dom,selector,tipsMsg){
	    	dom.addClass("error-input")
	    	var errDom = dom.parent().find(selector);
	    	errDom.removeClass("none")
	    	errDom.html('<span class="fillinfo-error-icon"></span>'+tipsMsg)
	    },
	    clearError:function(dom){
	    	dom.removeClass("error-input")
	    	dom.parent().find(selector).addClass("none")
	    }
		
		
	})
})(jQuery)
