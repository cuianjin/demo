/**
 * 收益计算器
 */
define([],function(){
	return {
		name:"calculator",
		init:function(){
			this.t0tip=$('#t0-calculate-errorMessaage');
			this.tntip = $('#tn-calculate-errorMessaage');
			this.pageInit();
			this.bindEvent()
		},
		pageInit:function(){
			
		},
		bindEvent:function(){
			var _this = this
			//活期
			GHutils.checkInput($("#current").find("#money"),3);
			GHutils.checkInput($("#current").find("#invertMonth"),6);
			GHutils.checkInput($("#current").find("#preIncome"),3);

			var incomeCalcBasis = 0 ;
			//点击收益计算器图标
			$('#calculator').click(function(){
				incomeCalcBasis = $(this).attr('data-incomeCalcBasis');
				incomeCalcBasis = incomeCalcBasis?Number(incomeCalcBasis):365
				_this.clearModle()
				$('#popup-box-bg').modal("show")
			})
			
			//活期计算器
			$("#current-count").on('click',function(){
				_this.t0tip.html("")
				$("#totalProfit").html('0.00')
				$("#totalMoney").html('0.00')
				if(GHutils.validate("current")){
					GHutils.log($('#preIncome').val())
					if(parseFloat($('#preIncome').val()) > 100){
						_this.t0tip.html("提示： 预计收益不能大于100%")
						return
					}
					var last = colculateIncome()
					$("#totalProfit").html(GHutils.formatCurrency(GHutils.Fsub(last,parseFloat($('#money').val()))))
					$("#totalMoney").html(GHutils.formatCurrency(last))
				}
			})
			
			
			$(".calculate-reset-btn").on('click',function(){
				_this.clearModle()
			})
		
			function colculateIncome(){
				var money = $('#money').val()
				var day = parseInt($('#invertMonth').val())
				var preIncome = GHutils.Fadd(GHutils.Fdiv(parseFloat($('#preIncome').val()),100),1)
				money =GHutils.Fadd(GHutils.Fmul(GHutils.Fmul(money,GHutils.Fsub(preIncome,1)),GHutils.Fdiv(day,incomeCalcBasis)),money)  
				money = GHutils.toFixeds(money,2) 
				return money
			}
		},
		clearModle:function(){
	    	var _this = this;
	        $('.errorMsg').html('')//清除错误提示
			$('#calculateContainer input').val('')//清空文本框
			$("#totalProfit").html('0.00')
			$("#totalMoney").html('0.00')
	    }
	}
})