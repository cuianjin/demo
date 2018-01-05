define([],
function() {
  return {
  	name: 'user-center',
    init:function(eventType){
    	this.eventType = eventType;
    	this.couponTimes = 0;
    	GHutils.getParamHref();
      this.bindEvent();
      this.phoneLoginBindEvent();//手机号登陆绑定事件
      this.userAccLoginBindEvent();//账号登陆绑定事件
      this.registerEvent();
    },
    pageInit:function(){
    	var _this = this;
    	GHutils.load({
				url: GHutils.API.ACCOUNT.userinfo,
				data: {},
				type: "post",
				callback: function(result) {
					if(result.errorCode != 0 || !result.islogin){
						$('#notLogin').show().siblings().hide();
						return false;
					}
				
					GHutils.userinfo = result
					var userAcc = result.userAcc.substring(0,3)+'****'+result.userAcc.substring(7,11)
					$('#nickName').html(result.name || userAcc)
					$('#loginStatus').show().siblings().hide();
					_this.getMessageNoreadnum()
					if(window.init && typeof(window.init.successCallback)=="function")window.init.successCallback(result)
				}
			})
    	
    },
    getMessageNoreadnum:function(){//获取未读站内信数量
	  	GHutils.load({
	  		url:GHutils.API.CMS.messageNoreadnum,
	  		type:'post',
	  		callback:function(data){
					GHutils.log(data,"数量===")
	  			$('#messaageCtrl').html("("+(data.num || 0)+")")
	  		}
	  	})
  	},
    bindEvent:function(){
      var _this = this;
			//点击登陆
			$('.toLogin').off().on('click',function(){
				GHutils.getHrefLinkPage("login.html")
			})
			
			//点击注册
			$('.toRegister').off().on('click',function(){
				GHutils.getHrefLinkPage("register.html")
			})

//			//点击安全退出
//    $('#loginOut').off().on('click',function(){
//      GHutils.loginOut(true);
//    })
      
      $('#nickName').parent().off()
	      .on('mouseover',function(){
	      	$("#headerWechat a").css('border-right-color','#fff')
	      }).on('mouseout',function(){
	      	$("#headerWechat a").css('border-right-color','#d0d0d0')
	      })
      
			$(".popup-logo").on("click",function(){
				$(this).prev().click()
			})
			
			$("#register_close").on('click',function(){
				$("#registerSuccess").hide()
			})
			
			//回车键事件监听
  	 	$(".inputBindKey").off().keyup(function (e) {
				if(e.keyCode == 13){
					if($(this).val() != ''){
						$(this).blur();
						 var trigger = $(this).attr("data-trigger");
			        if(trigger){
			        	$(trigger).trigger("click");
			        }
					}
		    }
			})
  	 	
  	 	 //注册
      GHutils.checkInput($("#register_userPhone"),0);
      GHutils.checkInput($("#regist_verifyCode"),5);
      GHutils.checkInput($("#register_userPassword"),1);
      //手机快捷登录
      GHutils.checkInput("#userPhone",0);
      GHutils.checkInput("#verifyCode",5);
      //账号密码登录
      GHutils.checkInput("#userAccount",0);
      GHutils.checkInput("#userPassword",1);
  	 	 
      //点击登陆
      $(".showUserCentent").off().on("click",function(){
        var item = $(this).attr("data-id");
        $('#userCentent').modal('show');
        _this.clearModle(item);

      });
			
			//点击注册
      $(".showUserCententBox").off().on("click",function(){
        var item = $(this).attr("data-id");
        _this.clearModle(item);

      });
      $.tab();
      //点击账号密码登陆
      $("#login-account").click(function () {
          //当前被点击的div改变背景色
          $(this).addClass("active");
          $("#login-phone").removeClass("active");
          $("#login-in-account").fadeIn(300);
          $("#login-in-phone").hide();
          $("#login-in-account input").val('')
          $("#account-errorMessage").html("&nbsp;");
      });
            
      //点击手机快捷登陆
      $("#login-phone").click(function () {
        $(this).addClass("active");
        $("#login-account").removeClass("active");
        $("#login-in-phone").fadeIn(300);
        $("#login-in-account").hide();
        $("#login-in-phone input").val('')
        $("#phone-errorMessage").html("&nbsp;");
      });
      
      $('#login_imgCode').on('click',function(){
      		$(this).attr('src',GHutils.API.USER.getimgvc+'?t='+new Date().getTime())
      })
      
      $('#goLogin').on('click',function(){
      		GHutils.getHrefLinkPage("login.html");
		})
      
      $('#goRegister').on('click',function(){
      	GHutils.getHrefLinkPage("register.html");
		})
      
      $(".finish_registerbtn").on('click',function(){
      	window.location.href="account-myCoupon.html"
      })
      
      $("#gh_userReg1").on('click', function(){
      	$("#gh_userLoginBox").hide()
      	$("#gh_userRegBox").show()
      })
      
      $("#gh_userReg2").on('click', function(){
      	$("#gh_userLoginBox").hide()
      	$("#gh_userRegBox").show()
      })
      
      $("#gh_userLogin").on('click', function(){
      	$("#gh_userRegBox").hide()
      	$("#gh_userLoginBox").show()
      })
      
      $("#registerForm input").each(function(i, e){
      	GHutils.checkFormSubmit(e,function(){
      			if($("#register_userPhone").val() && $("#regist_verifyCode").val() && $("#register_userPassword").val()){
	      			$("#registerSubmit").removeClass("loading")
	      		}else{
	      			$("#registerSubmit").addClass("loading")
	      		}
      	});
      })
      
      $("#telphone input").each(function(i, e){
      	GHutils.checkFormSubmit(e,function(){
      			if($("#userPhone").val() && $("#verifyCode").val()){
	      			$("#userPhoneLogin").removeClass("loading")
	      		}else{
	      			$("#userPhoneLogin").addClass("loading")
	      		}
      	});
      })
      
      $("#tel-password input").each(function(i, e){
      	GHutils.checkFormSubmit(e,function(){
      			if($("#userAccount").val() && $("#userPassword").val()){
	      			$("#userAccountLogin").removeClass("loading")
	      		}else{
	      			$("#userAccountLogin").addClass("loading")
	      		}
      	});
      })
    },
    clearModle:function(item){
        $('#userCentent input').val('');
        $(".tipstxt").html('&nbsp;');
        $(".userCententBox").hide();
        $("."+item).fadeIn(300);
        $('#account-errorMessage').html('&nbsp;')
        $('#phone-errorMessage').html('&nbsp;')
        $('#register_errorMessage').html('&nbsp;')
        $('#getVerifyCode').removeClass('sending')
        $('#register_getVerifyCode').removeClass('sending')
    },
    phoneLoginBindEvent: function() {//手机验证码登录点击事件
      var _this = this;
      $("#userPhoneLogin").click(function() {
      	$("#phone-errorMessage").html("&nbsp");
      	if($(this).is('.loading')){
	    		return false;
	    	}
        if(GHutils.validate('login-in-phone')){
        	if($(this).is('.submiting')){
        		return false;
        	}
        	$(this).addClass('submiting')
        	_this.cancelSubmiting()
          _this.phoneLogin();
        }
      });
          
		//获取验证码
		$("#getVerifyCode").click(function() {
			if ($(this).hasClass('btn_loading')) {//正在进行倒计时
	      		return;
	      	}
			var errorMessage = $("#phone-errorMessage");
			errorMessage.html('&nbsp;');
			if(GHutils.validate("phoneContainerBox")){
				var userPhone = GHutils.trim($("#userPhone").val());
				$(this).addClass('btn_loading')
				GHutils.sendvc(userPhone,$(this),errorMessage,"login",true)
			}
		})

    },
    phoneLogin:function(){//电话号码登陆
      var _this = this;
      var param = {
          userAcc: GHutils.trim($("#userPhone").val()),
          vericode:  GHutils.trim($("#verifyCode").val()),
          platform: "pc"
      }
      var errorMessage = document.getElementById("phone-errorMessage");
      _this.doLogin(param,errorMessage);
      
    },
    userAccLoginBindEvent:function(){//账号密码登录点击事件
      var _this = this;
      $("#userAccountLogin").on('click',function() {
      	$("#account-errorMessage").html("&nbsp;");
      	if($("#userAccountLogin").is('.loading') ){
      		return false;
      	}
        if(GHutils.validate('login-in-account')){
        	if($("#userAccountLogin").is('.submiting') ){
        		return false;
        	}
        	$("#userAccountLogin").addClass('submiting')
        	_this.cancelSubmiting()
          _this.userAccLogin();
        }
        
      });
    },
    userAccLogin:function(){//账号密码登陆
      var _this = this;
      var param = {
          userAcc: GHutils.trim($("#userAccount").val()),
          userPwd: GHutils.trim($("#userPassword").val()),
          platform: "pc"
      }
      var errorMessage = document.getElementById("account-errorMessage");
      _this.doLogin(param,errorMessage);
    },
    doLogin: function(param,errorMessage) {//登陆方法
      var _this = this;
			GHutils.load({
        url: GHutils.API.USER.doLogin,
        data: param,
        type: "post",
        callback: function(result) {
          $('#userPhoneLogin').removeClass('submiting')
          $("#userAccountLogin").removeClass('submiting')
					if(result.errorCode == 0){
						_this.successCallback();
						$('#userCentent').modal('hide');
//									$("#userLogin").css("display", "none");
					}else{
						errorMessage.innerHTML = '提示： ' +result.errorMessage;
						return false;
					}
        }
      });
      		
    },
    registerEvent: function() {//注册绑定事件
      var _this = this;
      var errorMessage = document.getElementById("register_errorMessage");
      //注册用户点击事件
      $("#registerSubmit").click(function() {
	  		if($(this).hasClass('btn_loading') || $(this).hasClass('loading') ){
	    		return false;
	    	}
	  		$('#register_errorMessage').html("&nbsp;")
        if(GHutils.validate('registerForm')){
          if(!$('#protocolCheck').hasClass('active')){
            $('#register_errorMessage').html('提示： 请同意《国槐科技服务协议》')
            return false;
          }
        	$("#registerSubmit").addClass('btn_loading')
          _this.doRegister();
        }
      });
		
		//同意or不同意  协议
		GHutils.protocolCheck('#protocolCheck');
      
      //获取验证码
      $("#register_getVerifyCode").click(function() {
	      	if ($(this).hasClass('btn_loading')) {
	      		return;
	      	}
	      	var errorMessage = $("#register_errorMessage");
	      	errorMessage.html('&nbsp;');
	        if(GHutils.validate("register_getVerifyCode_container")){
	        	$(this).addClass('btn_loading')
	        	var phone = GHutils.trim($("#register_userPhone").val());
	        	GHutils.sendvc(phone,$(this),errorMessage,"regist",true);
	      	}
      });
    },
    doRegister: function() {//注册
    	var _this = this
    	var userAcc = GHutils.trim($("#register_userPhone").val())
			GHutils.load({
        url: GHutils.API.USER.register,
        data: {
	        userAcc: userAcc,
	        userPwd: GHutils.trim($("#register_userPassword").val()),
	        vericode:GHutils.trim($("#regist_verifyCode").val()),
	        imgvc:GHutils.trim($("#register_imgCode").val()),
	        sceneId: "",
	        platform: "pc",
	        channelid: channelid
	      },
        type: "post",
        callback: function(result) {
        	if(GHutils.checkErrorCode(result,$('#register_errorMessage'))){
        		$("#registerSubmit").removeClass('btn_loading')
        		GHutils.boxSwitch($("#userCentent"),$("#registerSuccess"))
//      		_this.getRegisterCoupon();
        		var dataInvestment = {
							type:'register',
							singleInvestAmount:0
						}
//						REDPACKET.init(dataInvestment,function(){_this.successCallback()},true);
						REDPACKET.init(dataInvestment,null,false);
						
						$("#toInvestPrepare").on('click',function(){
						  var _href = window.location.href
						  if(_href.indexOf("?") > -1){
						  	var idx = _href.indexOf("?")
						  	_href = _href.substring(0,idx)
						  }
							_href =  _href.substring(0,_href.lastIndexOf("/"))+"/account.html";
							window.location.href="account-validate.html?action=invest&actionURL="+_href;
						})
						
						
        	}
        }
      });
      		
    },
//  getRegisterCoupon:function(){
//  	var _this = this;
//  	GHutils.load({
//  		url:GHutils.API.USER.registerCoupon+'?eventType=register&singleInvestAmount=0',
//  		type:'post',
//  		callback:function(result){
//  			GHutils.log(result,"注册活动==========");
//  			if(GHutils.checkErrorCode(result,$('#register_errorMessage'))){
//						if(result.couponList && result.couponList.length > 0){
//							_this.couponTimes = 0;
//							GHutils.getRedPackets(data,result)
//						}else{
//							_this.couponTimes ++
//							setTimeout(function(){
//								if(_this.couponTimes < 10){
//									_this.getRegisterCoupon(data)
//								}else{
//									_this.couponTimes = 0;
//								}
//							}, 1000)
//						}
//  				var data = []
//      		GHutils.forEach(result.rows,function(idx,coupon){
//							var temp = coupon.type
//							coupon["unit"]="元"
//							coupon["durationPeriodDisp"]="任意天数可用"
//							if(temp == "rateCoupon"){
//								coupon["unit"]="%"
//								coupon["durationPeriodDisp"]="自使用日起加息任意天"
//								if(coupon.durationPeriod){
//									coupon["durationPeriodDisp"]="自使用日起加息"+coupon.durationPeriod+"天"
//								}
//							}
//							coupon["typeDisp"] = _this.turnType(temp)
//							if(temp == "tasteCoupon"){
//								coupon["durationPeriodDisp"]="自使用日起体验任意天"
//								if(coupon.validPeriod){
//									coupon["durationPeriodDisp"]="自使用日起体验"+coupon.validPeriod+"天"
//								}
//							}
//							if(!coupon.durationPeriodDisp)
//							temp = "满"+coupon.investAmount+'元'
//							if(!coupon.investAmount){
//								temp="任意金额"
//							}
//							coupon["investAmountDisp"] = temp
//      			data.push(coupon);
//      		})
//  				GHutils.mustcache("#registerCoupon-template",$("#registerCoupon"),{"coupons":data});
//  			}else{
//  				
//						_this.couponTimes ++
//						setTimeout(function(){
//							if(_this.couponTimes < 10){
//								_this.getRegisterCoupon(data)
//							}else{
//								_this.couponTimes = 0;
//							}
//						}, 1000)
//  				
//  				
//  				
//  				
//  			}
//  			
//  		}
//  	})
//  },
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
    cancelSubmiting:function(){
			var time = 10
			var countdown = function (){
				if($('.submiting').length > 0){
					time -= 1
					setTimeout(countdown,1000)
				}else{
					$('.submiting').removeClass('submiting')
				}
			}
			countdown()
   },
    successCallback:function(){
    	var _this = this;
    	if(_this.eventType == "href"){
				//点击登陆跳转登陆页
				//获取地址栏参数  
				//无地址栏参数 or参数格式不对    跳转到首页
				//有地址栏参数 根据参数跳转
				var _href = GHutils._href
				if((_href.indexOf("login.html")+1) || (_href.indexOf("register.html")+1)){
					_href=''
				}
				window.location.href=_href?_href:"index.html";
				
			}else if(_this.eventType == "function"){
				//登陆弹窗
				//获取Ghutils.loginCallback（这是一个方法）变量，并调用
				_this.pageInit();
			}else{
				//其余方式访问登陆页 
				window.location.href = "index.html";
			}
   },
   getEventInfo:function(){
   			GHutils.load({
          url: GHutils.API.ACCOUNT.getRegisterEventInfo,
          data: {
          	
          },
          type: "post",
          callback: function(result) {
            if(result.errorCode != 0) {
              return false;
            } 
           	GHutils.log(result,'zhuceshijian==============')
//          $("#registerSuccess").css("display","none");
//          $("#getVirtualCash").css("display","block");
            return;
          }
        });
   }
  }
})
