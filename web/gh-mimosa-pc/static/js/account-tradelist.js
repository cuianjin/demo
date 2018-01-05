var AccountRecord = function() {
	this.param1 = {//交易记录
		page:1,
		productType:'',
		orderType:'',
		orderTimeBegin:'',
		orderTimeEnd:'',
		rows:8
	}
	this.columnDefine1=[   
		{"name":"productName","clazz":"","format":function(){
			return '<p class="gh_f14 gh_c9 gh_mt10 gh_mb10">交易单号：'+this.orderCode+'</p>'+this.productName;
			}
		},
		{"name":"orderTypeDisp","clazz":"gh_tcenter gh_c0"},
		{"name":"orderAmount","clazz":"gh_tcenter gh_c0"},
		{"name":"orderStatusDisp","clazz":"gh_tcenter gh_c0"},
		{"name":"orderTime","clazz":"gh_tcenter gh_c0"}
	]
	this.param2 = {//充提记录
			orderType:'withdraw,withdrawlong,deposit,depositlong,offsetPositive,offsetNegative,redEnvelope',
			orderTimeBegin:'',
			orderTimeEnd:'',
			page:1,
			rows:8
		}
	
	this.columnDefine2=[
		{"name":"orderType","format":function(){
				var data = this;
				var str = '<p class="gh_f14 gh_c9 gh_mt10 gh_mb10">交易单号：{{orderCode}}</p>{{orderTypeDisp}}';
				str = Mustache.to_html(str,data)
				return str;
			}
		},
		{"name":"orderAmount","clazz":"gh_tcenter gh_c0","format":function(){return GHutils.formatCurrency(this.orderAmount)}},
		{"name":"fee","clazz":"gh_tcenter gh_c0"},/*,"format":function(){var _fee='--';if(this.fee){ _fee = "-"+this.fee} return _fee;}*/
		{"name":"orderStatusDisp","clazz":"gh_tcenter gh_c0"},
		{"name":"orderTime","clazz":"gh_tcenter gh_c0"}
	]
	this.today="";
	return this;
}

AccountRecord.prototype =  {
	init: function() {
		this.pageInit();
		this.bindEvent();
		
	},
	pageInit: function() {
		var _this = this
		GHutils.getSystime(function(time){
			_this.today = time.substr(0,10)
		})
		_this.loadTradeRecord(true,1)
		_this.loadDepositRecord(true,1)
	},
	loadTradeRecord:function(isFlag,page){
		var _this = this
		_this.param1.page = page;
		GHutils.isLogin(function(){
			GHutils.load({
				url: GHutils.API.ACCOUNT.prot0qrydetail+_this.parseParam(_this.param1),
				data: _this.param1,
				type: "post",
				callback: function(result) {
					GHutils.log(result,"交易记录======")
					if(result.errorCode !=0){
						return false;
					}
					GHutils.table("#tradeTable",_this.columnDefine1,result.rows,"#tradeTable-noReCord")
					if(isFlag){
						_this.createPage(Math.ceil(result.total/_this.param1.rows),"#tradeTablePage",_this.loadTradeRecord)
					}
				}
			})
		})
	},
	loadDepositRecord:function(isFlag,page){
		var _this = this
		_this.param2.page = page;
		GHutils.load({
			url:GHutils.API.ACCOUNT.depwdrawlist+_this.parseParam(_this.param2),
			data:{},
			type:'post',
			callback:function(result){
				GHutils.log(result,"充提记录============")
				GHutils.table("#depositTable",_this.columnDefine2,result.rows,"#depositTable-noRecord")
				if(isFlag){
					_this.createPage(Math.ceil(result.total/_this.param2.rows),"#depositTablePage",_this.loadDepositRecord)
				}
			},
			errcallback:function(error){
				
			}
		})
	},
	bindEvent:function() {
		var _this = this;	
		$.tab();
		$('#productType li a').on('click',function(){
			if($(this).hasClass('active')){
				return false;
			}
			$(this).closest('ul').find('a').removeClass("active")
			$(this).addClass("active")
			_this.param1.productType = $(this).attr('data-proType')
			_this.loadTradeRecord(true,1)
		})
		
		$("#tradeOrderType li a").on('click',function(){
			if($(this).hasClass('active')){
				return false;
			}
			$(this).closest('ul').find('a').removeClass("active")
			$(this).addClass("active")
			_this.param1.orderType = $(this).attr('data-tradetype')
			_this.loadTradeRecord(true,1)
		})
		
		$("#chargeType li a").on('click',function(){
			if($(this).hasClass('active')){
				return false;
			}
			$(this).closest('ul').find('a').removeClass("active")
			$(this).addClass("active")
			_this.param2.orderType = $(this).attr('data-orderType')
			_this.loadDepositRecord(true,1)
		})
		_this.tabPaneBindEvent("#recoderTrade","trade");
		_this.tabPaneBindEvent("#chargeTrade","deposit");
	},
	tabPaneBindEvent:function(parentSelector,param){
		var _this = this;
		function $$(selector){
			return $(parentSelector).find(selector);
		}
//		var format="YYYY-MM-DD"
//		if(param=="trade"){
//		}else if(param == "deposit"){
//			format="YYYY-MM-DD HH:mm:ss"
//		}
		$$('.form_datetime').datetimepicker({
	    	format:"YYYY-MM-DD",
        	dayViewHeaderFormat: 'YYYY年   MM月',
			showClear: true,
			defaultDate:_this.today
	    })
		$$('.form_datetime').val('')
		$$("#durations li a").on('click',function(){
			$(this).closest('ul').find('a').removeClass("active")
			$(this).addClass("active")
			var month = Number($(this).attr("data-date"))
			clearDate($$(".startTime"))
			clearDate($$(".endTime"))
			if(month){
				var day = new Date(_this.today)
				day.setMonth(day.getMonth()-month)
				day = GHutils.formatTimestamp({"time":day,"showtime":"false"})
				dateChage(day,_this.today);
			}else{
				dateChage('','');
			}
		})
		
		$$(".startTime").on('dp.hide',function(e){
			$$("#durations ul li a").removeClass('active')
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
			$$("#durations ul li a").removeClass('active')
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
			if(param=="trade"){
				_this.param1.orderTimeBegin=formatDate(start,"")
				if(end){
					end = GHutils.addDate(end,1)
				}
				_this.param1.orderTimeEnd=end
				_this.loadTradeRecord(true,1)
			}else if(param == "deposit"){
				_this.param2.orderTimeBegin=formatDate(start," 00:00:00")
				_this.param2.orderTimeEnd=formatDate(end," 23:59:59")
				_this.loadDepositRecord(true,1)
			}
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
	createPage: function(pageCount,selector,callback) {//Math.ceil(result.total/_this.param.rows),createPage,_this.loadIncomeRecord
		var _this = this;
		var dom = $(selector)
		if(pageCount <=1){
			dom.hide();
			return ;
		}
		
		dom.show().createPage({
			pageCount: pageCount,
			current: 1,
			backFn: function(page) {
				callback.apply(_this,[false,page])
			}
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
}

$(function() {
	new AccountRecord().init();
})
		