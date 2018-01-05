var AccountMyIncome = function() {
	this.param={
		confirmDateBegin:'',
		confirmDateEnd:'',
		page:1,
		rows:10
	}
	
	this.columnDefine=[
		{"name":"productName"},
		{"name":"time","clazz":"gh_tcenter"},
//		{"name":"time","format":function(){return "类型还没有添加"}},
		{"name":"amount","clazz":"gh_tcenter","format":function(){ return '+'+this.amount}}
	]
	this.today = null;
	return this;
}

AccountMyIncome.prototype =  {
	init: function() {
		var that = this;
		GHutils.isLogin();
		GHutils.getSystime(function(time){
			that.today = time.substr(0,10)
		})
		this.pageInit();
		this.bindEvent();
		this.getData(1,true)
	},
	pageInit:function(){
		var _this = this;	
		GHutils.load({
			url: GHutils.API.ACCOUNT.useraccount,
			data: {},
			type: "post",
			callback: function(result) {
				if(result.errorCode !=0){
					return false
				}
				$('#totalIncome').html(GHutils.formatCurrency(result.totalIncomeAmount))//累计收益(元)
				$('#yesterDayIncome').html(GHutils.formatCurrency(result.t0YesterdayIncome))//今日收益(元)
			}
		})
		
	},
	bindEvent:function(){
		var _this = this;
		function $$(selector){
			return $("#incomeFilter").find(selector);
		}
		
		$$('.form_datetime').datetimepicker({
	    	format:'YYYY-MM-DD',
        	dayViewHeaderFormat: 'YYYY年   MM月',
			showClear: true,
			defaultDate:_this.today
	    })
		$$('.form_datetime').val('')
		$$("ul li a").on('click',function(){
			if($(this).hasClass('active')){
				return false;
			}
			$(this).closest('ul').find('a').removeClass("active")
			$(this).addClass("active")
			var month = Number($(this).attr("data-date"))
			$$('.form_datetime').val('')
			clearDate($$(".startTime"))
			clearDate($$(".endTime"))
			if(month){
				var day = new Date(_this.today)
				var endDay = GHutils.formatTimestamp({time:day})+" 23:59:59"
				day.setMonth(day.getMonth()-month)
				day = GHutils.formatTimestamp({time:day})+" 00:00:00"
				dateChage(day,endDay);
			}else{
				dateChage('','');
			}
		})
		
		
		$$(".startTime").on('dp.hide',function(e){
//			if($$('.form_datetime').hasClass('changing')){
//        		$$('.changing').removeClass('changing')
//        		return ;
//        	}
//			$(this).addClass("changing")
//			$$("ul li a").removeClass('active')
//			var _val = $$(".endTime").val()
//			var minDate = $(this).val()?e.date:false
//			$$(".endTime").data("DateTimePicker").minDate(minDate);
//			if(!_val)$$(".endTime").val('')
//			dateChage($$(".startTime").val(),$$(".endTime").val())
//			$(this).removeClass("changing")
			
			
			$$("ul li a").removeClass('active')
			var _val = $$(".endTime").val()
			var minDate = $(this).val()?$(this).val():false
			$$(".endTime").attr("data-date",minDate)
			if(!_val)$$(".endTime").val('')
			if(!minDate){
				var _date =$(this).attr('data-date')
				var _defaultDate = _this.today;
				if(_date && _date != "false" && (new Date(_date+" 00:0:00").getTime() <= new Date(_this.today+" 00:0:00").getTime())){
					_defaultDate = _date;
				}
				$(this).datetimepicker("defaultDate",_defaultDate);
				$(this).val('')
			}
			dateChage($$(".startTime").val(),$$(".endTime").val())
		})
		.on('dp.show',function(){
			var _date =$(this).attr('data-date')
			if(_date){
				_date == "false"?_date=false:_date=_date
				$(this).data("DateTimePicker").maxDate(_date);
			}
		})
		
		$$(".endTime").on('dp.hide',function(e){
//			$$("ul li a").removeClass('active')
//			var _val = $$(".startTime").val()
//			var maxDate = $(this).val()?e.date:false
//			$$(".startTime").data("DateTimePicker").maxDate(maxDate);
//			if(!_val)$$(".startTime").val('')
//			dateChage($$(".startTime").val(),$$(".endTime").val())
			
			
			$$("ul li a").removeClass('active')
			var _val = $$(".startTime").val()
			var maxDate = $(this).val()?$(this).val():false
			$$(".startTime").attr("data-date",maxDate)
			if(!_val)$$(".startTime").val('')
			if(!maxDate){
				var _date =$(this).attr('data-date')
				var _defaultDate = _this.today;
				if(_date && _date != "false" && (new Date(_date+" 00:0:00").getTime() >= new Date(_this.today+" 00:0:00").getTime())){
					_defaultDate = _date;
				}
				$(this).datetimepicker("defaultDate",_defaultDate);
				$(this).val('')
			}
			dateChage($$(".startTime").val(),$$(".endTime").val())
		})
		.on('dp.show',function(){
			var _date =$(this).attr('data-date') 
			if(_date){
				_date == "false"?_date=false:_date=_date
				$(this).data("DateTimePicker").minDate(_date);
			}
		})
		
		function dateChage(start,end){
			_this.param.confirmDateBegin =formatDate(start," 00:00:00")
			_this.param.confirmDateEnd = formatDate(end," 23:59:59")
			_this.getData(1,true)
		}
		
		function formatDate(d,time){
			if(d){
				d=d.substr(0,10)+time
			}
			return d;
		}
		
		function clearDate(dom){
			dom.val('')
			dom.data("DateTimePicker").minDate(false)
			dom.data("DateTimePicker").maxDate(false);
		}
	
	},
	getData:function(page,isFlag){
		var _this = this;
		_this.param.page = page;
		GHutils.isLogin(function(){
			GHutils.load({
				url: GHutils.API.ACCOUNT.prot0qryincome+_this.parseParam(_this.param),
				type: "post",
				callback: function(result) {
					GHutils.log(result,"我的收益=============")
					if(result.errorCode !=0){
						return false;
					}
					GHutils.table("#incomeTable",_this.columnDefine,result.rows,"#incomeTable-noRecord")					
					if(isFlag){
						_this.createPage(Math.ceil(result.total/_this.param.rows));
					}
				}
			})
		
		});
	},
	parseParam:function(param){
		var _this = this
		var urlParam = ''
		for (var key in param){
		 	if(!param[key] == ''){
		 		var value = param[key];
		 		console.info(value.toString())
		 		if(value.toString().indexOf(',')>-1){
		 			GHutils.forEach(value.split(','),function(idx,type){
		 				urlParam += '&'+key+'='+type
		 			})
		 		}else{
		 			urlParam += '&'+key+'='+param[key]
		 		}
		 	}
	    }
		if(urlParam.indexOf("&")>-1){
			urlParam = '?'+urlParam.substring(1)
		}
		return urlParam;
	},
	createPage: function(pageCount) {
		var _this = this;
		$("#gh_tcdPageCode").show()
		if(pageCount <=1){
			$("#gh_tcdPageCode").hide()
			return ;
		}
		$("#gh_tcdPageCode").createPage({
			pageCount: pageCount,
			current: 1,
			backFn: function(page) {
				_this.getData(page,false);
			}
		});
	}
}

$(function() {
	new AccountMyIncome().init();
})

