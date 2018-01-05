define([],function(){
	return{
		name:"investPrapare",
		init:function(){
			this.bindEvent();
		},
		bindEvent:function(){
			var _this = this;
//			//先去看看
			$(".goStill").on('click',function(){
					$(".pc_modal_out").modal('hide')
				if(window.init && typeof(window.init.goStillCallback)=="function")window.init.goStillCallback()
			})
			
			//开始投资前准备
			$("#toInvestPrapare").on('click',function(){
				if(window.init && typeof(window.init.toInvestPrapareCallback)=="function")window.init.toInvestPrapareCallback()
			})
			
			//开始投资前准备
			$(".toRiskTest").on('click',function(){
				if(window.init && typeof(window.init.toInvestPrapareCallback)=="function")window.init.toInvestPrapareCallback()
			})
			
			$(".popup-logo").on('click',function(){
				$(this).parent().parent().modal('hide');
			})
			
			//开始投资前准备
			$(".toRisk").on('click',function(){
				window.location.href="account-risktesting.html"
			})
			
		}
	};
})