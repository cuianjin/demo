define([],
function() {
  return {
  	name: 'payPwd',
    init:function(){
    	var btnTime = null
    	var param = {
						bankName:'',
						bankCode:'',
						cardOrderId:''
					}
    	var FUN = (function() {
				
        return {
						init:function(){
				      this.bindEvent();
				      this.tips1 = $("#forget_pay_tips");
						},

						bindEvent:function(){
				      var _this = FUN;
							//绑定回车键
							GHutils.inputBindKey();
							
							
				      //打开设置交易密码的弹窗
				      $('#setPayPwd').off().on('click',function(){
				      	GHutils.isLogin(function(){
				      		_this.clearModle()
									$('#setBankPwd').modal('show');
									GHutils.boxSwitch(".modalBox","#setPayPwdBox");
				      		GHutils.inputPwd("#bank_pay_pwd1")
				      		GHutils.inputPwd("#bank_pay_pwd2")
				      		
				      		GHutils.checkInput("#bank_pay_pwd1",5); 
				      		GHutils.checkInput("#bank_pay_pwd2",5); 
				      	});
							});
							
//							//设置交易密码 步骤一
//							$('#setPayPwd1').off().on('click', function() {
//								//var bankPayPwd1 = $('#bank_pay_pwd1').val().trim();
//								if(GHutils.validate("setPayPwdBox")){							
//									GHutils.boxSwitch(".modalBox","#setPayPwdBoxConfrm");
//									GHutils.inputPwd("#bank_pay_pwd2")
//								}
//
//							});
							
							//设置交易密码 步骤二  先判断是否登录
							$('#setPayPwd2').off().on('click',function(){
								if($(this).hasClass("btn_loading")){
									return false;
								}
								$("#pay_pwd_tips2").html("&nbsp;")
								GHutils.isLogin(function(){
									if(GHutils.validate("setPayPwdBox")){
										$('#setPayPwd2').addClass("btn_loading")
										_this.setPayPwd();
									}
				      	});
							});
							
							//打开修改交易密码弹窗
							$('#modifyPayPassword').off().on('click',function(){
								GHutils.isLogin(function(){
									_this.clearModle();
									var userAcc = GHutils.userinfo.userPhone.substr(0,3)+'***'+GHutils.userinfo.userPhone.substr(8,11)
									$("#modify_phoneNum_input").val(userAcc)
									$('#modifyPaypwd').modal('show');				      		
									GHutils.boxSwitch(".modalBox","#changePayPwdBox");
									GHutils.inputPwd("#oldPayPassword")
									GHutils.inputPwd("#newPayPassword")
									GHutils.inputPwd("#newPayPasswordConfrim")
									
									GHutils.checkInput("#oldPayPassword",5); 
									GHutils.checkInput("#newPayPassword",5); 
									GHutils.checkInput("#newPayPasswordConfrim",5); 
				      	});
							});
							
							//确认修改密码
							$('#modify_pay_pwd').off().on('click', function() {
									if($(this).hasClass('btn_loading')){
										return false;
									}
									$("#modify_pay_tips").html('&nbsp;')
									if(GHutils.validate("changePayPwdBox")){
										if(GHutils.trim($('#newPayPassword').val()) == GHutils.trim($('#oldPayPassword').val())){
												$("#modify_pay_tips").html('提示：新密码不能和交易密码一致')
												return false;
										}
										_this.modifyPaypwdMethod();
										$('#modify_pay_pwd').addClass("btn_loading")
									}
								
							});
							
							//忘记交易密码
							$("#showForgetPwd").off().on("click",function(){
								_this.clearModle()
								GHutils.boxSwitch(".modalBox","#forgetPaypwdBox");
								var phn = GHutils.userinfo.userPhone
								var phna = phn.substring(0,3)+'****'+ phn.substring(7,11)
								$("#foget_phoneNum_input").val(phna).attr("data-phone",phn);
								$("#fogetPaypwd").modal("show");
								GHutils.inputPwd("#newPayPassWord")
								GHutils.inputPwd("#newPayPassWorda")
								GHutils.checkInput("#newPayPassWord",5); 
								GHutils.checkInput("#newPayPassWorda",5)
								GHutils.checkInput("#foget_verifyCodeNo",5)
							});
								
							//获取忘记交易密码短信
							$("#foget_vericode_btn").off().on("click",function(){
								if($(this).hasClass("btn_loading")){
									return
								}
								$(this).addClass("btn_loading")
								_this.tips1.html('&nbsp;');
								var userPhone = GHutils.userinfo.userPhone;
								btnTime = GHutils.sendvc(userPhone,$(this),_this.tips1,"edittradepwd");
							});
							
							//找回密码
							$("#forget_pay_pwd").off().on("click",function(){
								if($(this).hasClass("btn_loading")){
									return
								}
								$(_this.tips1).html('&nbsp;');
								if(GHutils.validate("forgetPaypwdBox")){
									$("#forget_pay_pwd").addClass("btn_loading");
									$(_this.tips1).html('&nbsp;');
									GHutils.checkvc(GHutils.userinfo.userPhone,GHutils.trim($("#foget_verifyCodeNo").val()),_this.tips1,function(){
										_this.setNewPayPwd()
										if(btnTime){
											GHutils.clearBtnTime(btnTime, $("#foget_vericode_btn"))
										}
									},"edittradepwd")
								}
								
							});
							
				   	},
				   	setPayPwd:function(){
				   		var _this = FUN;
				   		GHutils.load({
									url: GHutils.API.USER.setpaypwd,
									data: {
										payPwd: GHutils.trim($('#bank_pay_pwd1').val()),
										newPayPwd: GHutils.trim($('#bank_pay_pwd2').val()),
										payPwdType: "set"
									},
									type: "post",
									callback: function(result) {
										if (result.errorCode == 0) {										
											GHutils.boxSwitch(".modalBox","#setPayPwdSucced");
											window.pageFun.callBackFun();
										} else {											
											GHutils.boxSwitch(".modalBox","#setPayPwdFaild");
										}
										$('#setPayPwd2').removeClass("btn_loading")
									}
								})
				   	},
//				   	checkPayPwd:function(){
//				   		var _this = FUN;
//				   		GHutils.load({
//								url: GHutils.API.USER.checkpaypwd,
//								data: {
//									payPwd: GHutils.trim($('#oldPayPassword').val())
//								},
//								type:'post',
//								callback: function(result) {
//									if(GHutils.checkErrorCode(result,$("#modify_pay_tips"))){
//										_this.modifyPaypwdMethod(GHutils.trim($('#newPayPassword').val()));
//									}
//								}
//							})
//				   	},
				   	//修改支付密码
						modifyPaypwdMethod: function() {
								var _this = this;
								GHutils.load({
									url: GHutils.API.USER.modifypaypwd,
									data: {
										payPwd: GHutils.trim($('#newPayPassword').val()),
										oldPayPwd: GHutils.trim($('#oldPayPassword').val()),
									},
									type: 'post',
									callback: function(result) {
										$("#modify_pay_pwd").removeClass('btn_loading')
										if(GHutils.checkErrorCode(result,$("#modify_pay_tips"))){
											GHutils.boxSwitch(".modalBox","#changeBankPwdSucced");
										}
									}
								})
						},
						setNewPayPwd:function(){
							var _this = this;
							GHutils.load({
								url: GHutils.API.USER.dealpaypwd,
								data: {
									payPwd: $("#newPayPassWord").val(),
									newPayPwd: '',
									payPwdType: "set"
								},
								type: "post",
								callback: function(result) {
									GHutils.log(result,"设置交易密码============")
									if(GHutils.checkErrorCode(result,_this.tips1)){
										$("#forget_pay_pwd").removeClass("btn_loading");
										GHutils.boxSwitch(".modalBox","#forgetBankPwdSucced");
										window.pageFun.callBackFun();
									}
								}
							})
						},
				   	clearModle:function(){
				    	var _this = FUN;
				        $('.fromModel input').val('');
				        $(".form_tips_box").html('&nbsp;');
				        GHutils.clearBtnTime(_this.btntime,$("#card_verifyCode"));
				    }
        };
        
    	})();
    	
    	$(function () {
		    FUN.init();   
			});
    	
			
    }
    
  }
})
