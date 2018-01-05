define([],
function() {
  return {
  	name: 'bindCard',
    init:function(){
    	var param = {
						bankName:'',
						bankCode:'',
						cardOrderId:''
					}
    	var FUN = (function() {
				
        return {
					init:function(){
						  this.btntime = null;
						  this.btntime2=null;
				      this.pageInit();
				      this.bindEvent();
					},
				    pageInit:function(){
						var _this = FUN;
						
							GHutils.checkInput($("#idCard"),4);
							GHutils.checkInput($("#cardNum"),2);
							GHutils.checkInput($("#bankPone"),0);
							GHutils.checkInput($("#bank_verifyCode"),5);
						
					    _this.clearModle();
					    if($("[template-href='bindCard']").attr('template-onlyJs')){
//				      	_this.getBankList();
				      	if(GHutils.userinfo.name){
				      		$("#realName_bc").val(GHutils.userinfo.name).attr("readonly","readonly").removeAttr("valid")
				      		$("#idCard").val(GHutils.userinfo.idNumb).attr("readonly","readonly").removeAttr("valid")
				      	}
				      }
				    },
				    
				    getBankList:function(){
				    	var _this = FUN;
				    	$('#bankCardListModal').modal('show')
				    	$("#app_tips_bankCardList").html('')
							GHutils.load({
								url: GHutils.API.ACCOUNT.bankList,
								data:{},
								type: "post",
								callback: function(result) {
									$("#chooseBank").removeClass("btn_loading")
									var banks = ''
									GHutils.forEach(result.datas,function(idx,bank){
										banks+='<li class="bank" data-bankCode='+bank.peopleBankCode+' data-bankName='+bank.bankName+'><img src="'+bank.bankBigLogo+'"/></li>'
									})
									$('#bankList').html(banks)
									_this.bindEvent();
									
								}
							});
						},
						bindEvent:function(){
				      var _this = FUN;
				      
				      //是否同意协议
				      GHutils.protocolCheck("#bankCard_protocolCheck")
				      //点开弹窗
				      $('#getBanklist').off().on('click',function(){
				      	_this.clearModle();
				      	if(GHutils.userinfo){
				      		GHutils.userinfo = GHutils.getUserInfo();
				      	}
				      	if(GHutils.userinfo && GHutils.userinfo.name){
				      		$("#realName_bc").val(GHutils.userinfo.name).attr("readOnly","readOnly").removeAttr("valid")
				      		$("#idCard").val(GHutils.userinfo.idNumb).attr("readOnly","readOnly").removeAttr("valid")
				      	}
				      	$('#bindCardModal').modal('show')
							})
				      
				      $("#chooseBank").off().on('click',function(){
				      		if($(this).hasClass('btn_loading')){
					    			return false;
					      	}
				      		$(this).addClass('btn_loading')
					      	GHutils.isLogin(function(){
										_this.getBankList();
									});
				      })
				      
				      //点击选择银行
				      $('li.bank').off().on('click',function(){
								param.bankCode = $(this).attr('data-bankCode');
								param.bankName = $(this).attr('data-bankName');
								$(this).addClass("active").siblings().removeClass("active");
								$('#bank_verifyCode').attr('valid','{"required":true,"tipsbox":"#app_tips_bindcard","msg":"提示： 验证码","finalLength":6,"positiveInteger":true}')
								$("#chooseBank").html("<img src='"+$(this).find('img').attr('src')+"'>")
				      });
							
							$("#nextStep").off().on('click',function(){
								$('#app_tips_bankCardList').html('');
								if($('li.bank.active').length == 0){
									$('#app_tips_bankCardList').html('提示：请选择银行')
									return
								}
								$('#bankCardListModal').modal('hide')
							})
						
							//点击绑卡
							$('#bindCard').off().on('click',function(){
								if($("#bindCard").hasClass('btn_loading')){
				    			return false;
				      	}
								$('#app_tips_bindcard').html('');
								if(!GHutils.validate('userInfForm')){
									return ;
								}
								if(!param.bankName){
									$('#app_tips_bindcard').html('提示：请选择银行')
									return
								}
								if(GHutils.validate('userBankInfoForm')){
									if(!$('#bankCard_protocolCheck').hasClass('active')){
										$('#app_tips_bindcard').html('提示：请同意《国槐科技代扣协议》')
										return false
									}
									if(!param.cardOrderId){
										$('#app_tips_bindcard').html('提示：请先获取验证码')
										return false;
									}
									$("#bindCard").addClass('btn_loading')
									_this.checkBankAndCardNo(function(){
										_this.bankadd();
									});
								}
							})
							
							//点击获取验证码
							$('#card_verifyCode').off().on('click',function(){
								$('#app_tips_bindcard').html('');
								if($(this).is('.btn_loading')){
					    			return false;
					      }
								
								if(!GHutils.validate('userInfForm')){
									return ;
								}
								if(!param.bankName){
									$('#app_tips_bindcard').html('提示：请选择银行')
									return
								}
//								if($('li.bank.active').length == 0){
//									$('#app_tips_bindcard').html('提示：请选择银行')
//									return
//								}
								$("#bank_verifyCode").removeAttr('valid');
								if(GHutils.validate('userBankInfoForm')){
									GHutils.isLogin(function(){
										_this.checkBankAndCardNo(function(){
											_this.valid4ele()
										});
										
									})
								}
								
							})
				   	},				
						valid4ele:function(){
							var _this = FUN;
							GHutils.load({
								url: GHutils.API.ACCOUNT.valid4ele,
								data:{
									realName:(GHutils.userinfo.fullName ||  GHutils.trim($('#realName_bc').val())),
									certificateNo:(GHutils.userinfo.fullIdNumb || GHutils.trim($("#idCard").val())),
									bankName:param.bankName,
									cardNo:GHutils.trim($("#cardNum").val()),
									phone:GHutils.trim($('#bankPone').val())
								},
								type: "post",
								callback: function(result) {
									if(GHutils.checkErrorCode(result,$('#app_tips_bindcard'))){
										$("#card_verifyCode").removeClass("btn_loading");
										param.cardOrderId = result.cardOrderId
										_this.btntime = GHutils.btnTime($("#card_verifyCode"));
										$('#bank_verifyCode').attr('valid','{"required":true,"tipsbox":"#app_tips_bindcard","msg":"提示： 验证码","finalLength":6,"positiveInteger":true}')
									}
								}
							});
						},
						checkBankAndCardNo:function(func){
							var _this = FUN;
							GHutils.load({
								url:GHutils.API.ACCOUNT.getBankCard+'?bankCardNumber='+GHutils.trim($("#cardNum").val()),
								type:'post',
								callback:function(result){
									if(GHutils.checkErrorCode(result,$('#app_tips_bindcard'))){
										GHutils.log(result,"卡片信息============")
										if(param.bankCode != result.bankCode){
											$('#app_tips_bindcard').html('提示：您的银行卡号与选择的银行不匹配')
											$("#bindCard").removeClass('btn_loading')
											return false;
										}
										if(func && typeof(func) == "function"){
											func.apply(null,arguments);
										}
									}
								}
							});
						},
						bankadd:function(){
							var _this = FUN;
							GHutils.load({
								url: GHutils.API.ACCOUNT.bankadd,
								data:{
									cardOrderId:param.cardOrderId,
									smsCode:GHutils.trim($('#bank_verifyCode').val()),
									phone:GHutils.trim($('#bankPone').val())
								},
								type: "post",
								callback: function(result) {
									if(GHutils.checkErrorCode(result,$('#app_tips_bindcard'))){
//										setTimeout(function(){
//												$("#bindCard").removeClass('submiting')
//										},2000)
										if(_this.btntime){
											GHutils.clearBtnTime(_this.btntime,$("#card_verifyCode"));
										}
										var dataRecharge = {
												type:'realname',
												singleInvestAmount:0
										}
										REDPACKET.init(dataRecharge);
										window.pageFun.callBackFun();
										$('#bindCardModal').modal('hide');
									}
								}
							});
						},
				    clearModle:function(){
				    	var _this = FUN;
				        $('#bindCardModal input').val('');
				        $("#app_tips_bindcard").html('');
				        GHutils.clearBtnTime(_this.btntime,$("#card_verifyCode"));
				        $('#bankList').html('<div class="list_tips mt20" align="center">加载中...</div>')
				        $("#chooseBank").html('选择银行卡')
				    }
        };
        
    	})();
    	
    	$(function () {
		    FUN.init();   
			});
    }
  }
})
