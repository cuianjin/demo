var AccountMyCard = function() {
	return this;
}

AccountMyCard.prototype =  {
	init: function() {
		GHutils.isLogin();
		this.pageInit();
	},
	pageInit: function() {
		_this = this;
		//获取用户账户详情
		GHutils.load({
			url: GHutils.API.ACCOUNT.userinfo,
			data: {},
			type: "post",
			callback: function(result) {
				if(result.errorCode != 0){
					return false;
				}
				GHutils.userinfo = result
				if(!result.bankName){
					$("#bkCardUsrCont").hide();
					$("#getBanklist").show();
				}else{
					$('.gh_icon_logindone_bankcard').addClass('active').attr("title","已完成实名认证");
					$(".con_bank_name span").text(result.name);
					$(".con_bank_tel span").text(result.bankPhone);
					$('.con_bank_num span').text("**** **** "+result.bankCardNum);
					_this.getBankList(function(bankList){
						GHutils.forEach(bankList,function(idx,bank){
							if(bank.bankName == result.bankName){
								$('#pc_oneLimit').html("单笔限额 "+_this.formatAmount(bank.payOneLimit) );
								$('#pc_onedayLimit').html("单日限额 "+_this.formatAmount(bank.payDayLimit));
								$('#pc_onemonthLimit').html("单月限额 "+_this.formatAmount(bank.payMoonLimit));
							}
						})
						GHutils.getBankStyle(result.bankName,bankList,_this.tips,function(res){
							$(".account_bank_icon img").attr("src",res.datas[0].bankBigLogo);
							$("#bkCardUsrCont").show();
							$('#getBanklist').hide().off();
						})
					})
				}
			}
		})
	},
	formatAmount:function(data){
		if(data>=10000){
			data = GHutils.toFixeds(GHutils.Fdiv(data,10000),2)
			return GHutils.formatCurrency(data)+' 万'
		}else{
			return GHutils.formatCurrency(data)
		}
	},
	getBankList:function(cb){//获取银行卡列表信息
		var _this = this;
		GHutils.load({
			url:GHutils.API.ACCOUNT.bankList,
			type:'post',
			callback:function(result){
				GHutils.log(result,"银行卡限额=======");
				if(GHutils.checkErrorCode(result,_this.tips)){
					if(cb && typeof(cb)=="function"){
						cb.apply(null,[result.datas]);
					}
				}
			}
		})
	},
	bindEvent: function() {
	},
	callBackFun:function(){
		var _this = this
		_this.pageInit();
	}
}

$(function() {
	new AccountMyCard().init();
	window.pageFun = new AccountMyCard();
})
