/**
 * author liu yanyun
 * 忘记密码
 */
var FindPwd = function() {
	this.tips = $("#find_pwd_tips");
	this.getCode = $("#pwd_vericode_btn");
	this.step1=$("#findpwd_step1");
	this.step2=$("#findpwd_step2");
	return this;
}

FindPwd.prototype =  {
	init: function() {
		GHutils.loginOut();
		this.bindEvent();
	},
	bindEvent: function() {
		var _this = this;
		var btnTime = null
		GHutils.checkInput("#userPhoneNo",0)
		GHutils.checkInput("#verifyCodeNo",5)
		GHutils.checkInput("#password1",1)
		GHutils.checkInput("#password2",1)
		
		//获取验证码
		_this.getCode.click(function() {
			if($(this).hasClass("btn_loading")){
				return
			}
			$(_this.tips).html('');
			if(GHutils.validate("mobilePhone_div")){
				var userPhone = GHutils.trim($("#userPhoneNo").val());
				_this.getCode.addClass("btn_loading")
				btnTime = GHutils.sendvc(userPhone,_this.getCode,_this.tips,"forgetlogin",true);
			}
		});
		
		//第一步
		_this.step1.on('click',function(){
			if($(this).hasClass("btn_loading")){
				return
			}
			$(_this.tips).html('');
			if(GHutils.validate("phoneCode_div")){
				_this.step1.addClass("btn_loading")
				var phone = GHutils.trim($("#userPhoneNo").val())
				var veriCode = GHutils.trim($("#verifyCodeNo").val())
				GHutils.checkvc(phone,veriCode,_this.tips,function(){
					_this.step1.removeClass("btn_loading")
					$('.steps_one').removeClass("on")
					$('.steps_two').addClass("on")
					if(btnTime){
						GHutils.clearBtnTime(btnTime, $("#pwd_vericode_btn"))
					}
				},"forgetlogin");
			}
		});
		
		//第二步
		_this.step2.on('click', function() {
			if($(this).hasClass("btn_loading")){
				return
			}
			$(_this.tips).html('');
			if(GHutils.validate("newPwd_box")){
				_this.setNewPwd();
			}
		})
		
		$('#find_pwd_succes').on('click', function() {
			GHutils.loginOut(null,function(){window.location.href = "login.html";})
		})
	},
	setNewPwd:function(){
		var _this = this;
		_this.step2.addClass("btn_loading");
		GHutils.load({
			url: GHutils.API.USER.updatepassword,
			data: {
				userAcc: GHutils.trim($("#userPhoneNo").val()),
				userPwd: GHutils.trim($('#password1').val()),
				vericode: GHutils.trim($("#verifyCodeNo").val()),
				platform: "pc"
			},
			type: "post",
			callback: function(result) {
				if(GHutils.checkErrorCode(result,_this.tips)){
					_this.step2.removeClass("btn_loading");
					$('.steps_two').removeClass("on")
					$('.steps_three').addClass("on")
				}
			}
		})
	}
}

$(function() {
	new FindPwd().init();
})

