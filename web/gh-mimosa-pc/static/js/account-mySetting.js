var AccountMySetting = function() {
	this.tips1 = $("#pay_pwd_tips1");
	this.tips2 = $("#pay_pwd_tips2");
	this.tips3 = $('#modify_tips');
	this.tips4 = $('#setting_tips');
	this.tips5 = $('#modify_pay_tips');
	this.tips6 = $('#bind_bink_tips');
	this.newpwd = '';
	this.userInfo = '';
	this.setProgress = 0;
	return this;
}

AccountMySetting.prototype =  {
	init: function() {
		GHutils.isLogin();
		this.pageInit();
		this.btntime = null;
	},
	pageInit: function() {
		var _this = this;
		_this.setProgress = 0
		
		GHutils.load({
			url: GHutils.API.ACCOUNT.userinfo,
			data: {},
			type: "post",
			callback: function(result) {
				if(result.errorCode != 0){
					$('#notLogin').show();
					$('#loginStatus').hide();
					$('#safetyCord').html('0');
					return false;
				}
				var score = 30;
				GHutils.userinfo = result;
				if (result.userAcc != '') {
					score +=30 
					//已经手机认证
					$('#phoneIcon').addClass('bg_brown_blue');
					var pho1 = result.userAcc.substr(0,3);
					var pho2 = result.userAcc.substr(7,4);
					var bankphone = pho1 + '****' + pho2;
					$('#bindPhone').html(bankphone);
				}
				
				if (result.paypwd) {
					score +=40
					//已经设置交易密码
					$("#setPayPwd").hide().siblings().show();
				}else{
					$("#setPayPwd").show().siblings().hide();
				}
				$('#safetyCord').html(score);
				$("#progressbar").css("width",score+"%")
				_this.bindEvent()
			}
		})
	},
	bindEvent: function() {
		var _this = this;
		 
		GHutils.checkInput("#oldPassword",1)
		GHutils.checkInput("#newPassword",1)
		
		//修改登录密码  判断是否登录 updateLoginPwd
		$('#modifyLoginPassword').off().on('click',function(){
			GHutils.isLogin(function(){
				$('#updateLoginPwd input').val('')
				$(_this.tips3).html('&nbsp;');
				$('#updateLoginPwd').modal('show');
			})
		})
		
		$('#modify_login_pwd').off().on('click', function() {
			$(_this.tips3).html('&nbsp;');
			var oldpwd = GHutils.trim($('#oldPassword').val());
			var newpwd = GHutils.trim($('#newPassword').val());
			_this.newpwd = newpwd;
			if(GHutils.validate('updateLoginPwd')){
				if( oldpwd == newpwd ){
					$(_this.tips3).html('提示： 原密码和新密码不能一致');
					return ;
				}
				GHutils.load({
					url: GHutils.API.USER.seq,
					data: {
						userPwd: oldpwd,
						platform:'pc'
					},
					type: "post",
					callback: function(result) {
						if (result.errorCode == 0) {
							_this.modifypassword(newpwd);
						}else{
							$(_this.tips3).html('提示： '+result.errorMessage);
						}
					}
				})
			}
			
		})
		
		$('#updatePwdBtn').off().on('click',function(){
			window.location.reload()
		})
		$("#updatePwdBtnFail").off().on('click', function(){
			$('#updateLoginPwdFaild').hide()
		})
		//风险测评
		$('#riskAppraisal').off().on('click',function(){
			GHutils.isLogin(function(){
				window.location.href = "risk-appraisal.html";
			})
		})
		
		
	},
	//修改登录密码
	modifypassword: function(val) {
		var _this = this;
		_this.loginpwdStatus = 'faild';
		
		var newpwd = val;
		GHutils.load({
			url: GHutils.API.USER.modifypassword,
			data: {
				userPwd: newpwd,
				platform:'pc'
			},
			type: "post",
			callback: function(result) {
				$('#updateLoginPwd').modal('hide');
				if (result.errorCode == 0) {
					$('#updateLoginPwdSucced').modal('show');
					GHutils.loginOut()
				} else {
					$('#updateLoginPwdFaild').modal('show');
					if(result.errorMessage){
						$("#updateLoginPwdFaildMsg").html(result.errorMessage)
					}
				} 
			}
		})
	},
	callBackFun:function(){
		var _this = this
//		window.location.reload();
		_this.pageInit();
	}
}

$(function() {
	new AccountMySetting().init();
	window.pageFun = new AccountMySetting();
})

