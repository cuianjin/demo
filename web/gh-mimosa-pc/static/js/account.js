var Account = function() {
	this.capitalAmount=0;
	this.balance = 0;
	this.enableRedeem=false;
	this.redeemMsg=""
	return this;
}

Account.prototype =  {
	init: function() {
		GHutils.isLogin();
		this.pageInit();
		this.bindEvent();
	},
	pageInit: function() {
		var _this = this
		if(GHutils.getCookie('see')){
			$('#seeAmount').addClass('see').removeClass("gh_icon_eyes").addClass("gh_icon_eyes_closed")
		}else{
			$('#seeAmount').removeClass('see').addClass("gh_icon_eyes").removeClass("gh_icon_eyes_closed")
		}
		_this.accountCapital();
		_this.accountDetail();
		_this.incomeCharts();
	},
	bindEvent: function() {
		var _this = this
		//点击眼睛图标
		$('#seeAmount').on('click',function(){
			var amount = ''
			$('[data-amount]').each(function(i,e){
				amount = $(e).html()
				$(e).html($(e).attr('data-amount'))
				$(e).attr('data-amount',amount)
			})
			
			if(GHutils.getCookie('see')){
				GHutils.setCookie('see','')
				$(this).removeClass('see').addClass("gh_icon_eyes").removeClass("gh_icon_eyes_closed")
			}else{
				GHutils.setCookie('see','see')
				$(this).addClass('see').removeClass("gh_icon_eyes").addClass("gh_icon_eyes_closed")
			}
		})
		
		//点击充值
		$("#deposit").on('click',function(){
			_this.action = "deposit";
			if(GHrisk.checkDWcomplete(false,"充值")){
				window.location.href = "account-deposit.html"
			}
		})
		//点击提现
		$('#withdraw').on('click',function(){
			_this.action = "withdraw";
			if(GHrisk.checkDWcomplete(false,"提现")){
				if(_this.balance == 0){
					$("#content").html('您的账户可用余额不足')
					$("#content-box").modal("show")
					return
				}
				window.location.href = "account-withdraw.html"
			}
		})
		
		//点击转入
		$("#apply").on('click',function(){
			window.location.href="product-t0.html"
		})
		
		//点击转出
		$("#redeem").on('click',function(){
			_this.redeem();
		})
	},
	accountCapital:function(){
		var _this = this;
		//账户总览
		GHutils.load({
			url: GHutils.API.ACCOUNT.useraccount,
			data: {},
			type: "post",
			callback: function(result) {
				if(result.errorCode != 0){
					return false;
				}
				_this.balance =  result.withdrawAvailableBalance
				_this.capitalAmount = result.capitalAmount
				_this.seeOrHideData("capitalAmount",result.capitalAmount)//总资产
				_this.seeOrHideData('balance',result.withdrawAvailableBalance)//可用余额
				_this.seeOrHideData('t0CapitalAmount',result.t0CapitalAmount)//活期
				_this.seeOrHideData('tnCapitalAmount',result.tnCapitalAmount)//定期
				_this.seeOrHideData('withdrawFrozenBalance',result.withdrawFrozenBalance)//冻结金额
				_this.seeOrHideData('t0YesterdayIncome',result.t0YesterdayIncome)//昨日收益
				_this.seeOrHideData('totalIncomeAmount',result.totalIncomeAmount)//累计收益
			}
		})
	},
	accountDetail:function(){
		var _this = this;
		//资产分部
		GHutils.load({
			url: GHutils.API.ACCOUNT.accountdetail,
			data: {},
			type: "post",
			callback: function(result) {
				if(result.errorCode != 0){
					return false;
				}
				_this.capitalAmount = result.capitalAmount
				_this.seeOrHideData('pie_capitalAmount',result.capitalAmount)//总资产
				_this.seeOrHideData('part_t0CapitalAmount',result.t0CapitalAmount,"part_t0CapitalAmount_percent")//活期
				_this.seeOrHideData('part_tnCapitalAmount',result.tnCapitalAmount,"part_tnCapitalAmount_percent")//定期
				_this.seeOrHideData('part_balance',result.withdrawAvailableBalance,"part_balance_percent")//可用余额
				_this.seeOrHideData("part_applyAmt",result.applyAmt,"part_applyAmt_percent")//申请中
				_this.seeOrHideData('part_withdrawFrozenBalance',result.withdrawFrozenBalance,"part_withdrawFrozenBalance_percent")//冻结金额
//				_this.seeOrHideData("part_experienceCouponAmount",result.experienceCouponAmount,"part_experienceCouponAmount_percent")//体验金
				_this.drawPie(result)//收益饼图
			}
		})
	},
	seeOrHideData:function(id,data,percentId){
		var _this = this;
		function seeOrHideData(){
			var amount = GHutils.formatCurrency(data)
			if(GHutils.getCookie('see')){//隐藏
				$('#'+id).attr('data-amount',amount).html('***')
				$('#'+percentId).attr('data-amount',calculatePercent(data)).html('***')
			}else{//显示
				$('#'+id).attr('data-amount','***').html(amount)
				$('#'+percentId).attr('data-amount','***').html(calculatePercent(data))
			}
		}
		
		function calculatePercent(data){
			if(_this.capitalAmount==0)_this.capitalAmount+=1
			var percent = GHutils.Fmul(GHutils.Fdiv(data,_this.capitalAmount),100) 
			return GHutils.toFixeds(percent,2,"%")
		}
		return seeOrHideData();
	},
	drawPie:function(data){
		var _this = this;					
		
	    var option = {
			    color:['#2d6eff', '#ff7b3c', '#3abaff','#f3b256','#38bd60'],
			    series: [
			        {
			            name:'访问来源',
			            type:'pie',
			           	center:['50%','50%'],
						radius:['65%','100%'],
			            hoverAnimation :false,
			            animation:true,
			            label: {
			                normal: {
			                    show: false,
			                    position: 'center'
			                },
			                emphasis: {
			                    show: false
			                }
			            },
			            labelLine: {
			                normal: {
			                    show: false
			                }
			            },
			            data:[
			                {value:data.t0CapitalAmount, name:'活期资产'},
							{value:data.tnCapitalAmount, name:'定期资产'},
							{value:data.withdrawAvailableBalance, name:'可用余额'},
							{value:data.applyAmt, name:'申请中'},
							{value:data.withdrawFrozenBalance, name:'冻结金额'}
//							,{value:data.experienceCouponAmount, name:'体验金'}
			            ]
			        }
			    ]
			};
		var pieChart = echarts.init(document.getElementById("assetPartsPie"));
		setTimeout(function(){
			pieChart.setOption(option);
		},20)
	},
	incomeCharts:function(){
		//收益曲线图
		var data = "";// new Date();
//		GHutils.getSystime(function(res){
//			data = new Date(res);
//		})
//		var year = data.getMonth() >11?(data.getFullYear()+1):data.getFullYear();
//		var month = data.getMonth() >11?1:(data.getMonth()+1)
		GHutils.load({
			url: GHutils.API.ACCOUNT.monthDaysOfIncome,
			type: "post",
			callback: function(result) {
				if(result.errorCode != 0){
					$('#noReCord').show().next().hide()
					return false;
				}
				if(result.details.rows.length == 0){
					$('#noReCord').show().next().hide()
					return
				}
				$('#assetProfitLine').show().prev().hide()
				var xdatas = [];
				var ydatas = [];
				var maxIcome =0
				
//				data.setMonth(data.getMonth()+1)
//				data.setDate(0)
//				var days = data.getDate();
//				var temp = year+'-'+(month<10?("0"+month):month);
//				for(var j = 1 ;j<=days;j++){
//					var d = temp+"-"+(j<10?("0"+j):j);
//					xdatas[(j-1)]= d.replace(/\-/g,'.')
//					ydatas[(j-1)] = 0;
//					GHutils.forEach(result.details.rows,function(i,income){
//						if(d == income.date){
//							ydatas[(j-1)]=(GHutils.Fadd(income.t0Income,income.tnIncome))
//							if(ydatas[(j-1)] > maxIcome){
//								maxIcome = ydatas[(j-1)]
//							}
//						}
//					})
//				}
				GHutils.forEach(result.details.rows,function(i,income){
					xdatas[i]=income.date;
					ydatas[i]=(GHutils.Fadd(income.t0Income,income.tnIncome))
					if(ydatas[i] > maxIcome){
						maxIcome = ydatas[i]
					}
				})
				var halfIncome = parseFloat(GHutils.toFixeds(GHutils.Fdiv(maxIcome, 2), 2))
				if(maxIcome < 1){
					maxIcome = maxIcome*3
				}else{
					maxIcome = maxIcome+3
				}
				if(maxIcome == 0){
					$('#noReCord').show().next().hide()
					return ;
				}
				var color = []
				ydatas = ydatas.map(function(item){
					if(item){
						color.push("#2d6eff")
						return item
					}else{
						color.push("#CCCCCC")
						return halfIncome
					}
				})
				initIncomeChart(xdatas,ydatas,maxIcome,color)
			}
		})
		
		function initIncomeChart(xdatas,ydatas,maxIcome,color){
//			var myChartOfLine = echarts.init(document.getElementById('assetProfitLine'));
//			option = {
//			    tooltip : {
//			        trigger: 'item'
//			    },
//			    xAxis : [
//			        {
//			            type : 'category',
//			            boundaryGap : false,
//			            scale: false,
//			            axisLabel: {
//			            	textStyle: {
//			            		color: '#a7aab3'
//			            	}
//			            },
//			             // x轴的横坐标边框线
//					    axisLine: {
//					    	show: false
//					    },
//					    axisTick: {
//					    	show: false
//					    },
//					    // 背景图的内置表格中的“边框”的颜色线条， 这个是x轴的竖线
//					    aplitLine: {
//					    	lineStyle: {
//					    		color: '#e4e4e4',
//					    		type: 'solid'
//					    	}
//					    },
//					    data :ydatas 
//			        }
//			    ],
//			    
//			    
//			    yAxis : [
//			        {
//			            type : 'value',
//			            max: maxIcome,
//			            axisLabel : {
//			                formatter: '{value}%'
//			            },
//			            axisLine: {
//			            	show:false,
//			            	lineStyle: {
//			            		color:'e4e4e4'
//			            	}
//			            },
//			            axisLabel:{
//						    show:true,
//						    textStyle:{
//						        fontSize:"8px",
//						        color:"#a7aab3"
//						    }
//						},
//						axisTick: {
//							show: false,
//						},
//						splitLine: {//终于找到了，背景图的内置表格中“边框”的颜色线条   这个是y轴的横线
//					        show: true,
//					     	lineStyle:{
//				                color:"#e4e4e4",
//				                type:"solid",
//					        }
//					    }
//			        }
//			        
//			    ],
//			    dataZoom: {
//			    	type: 'inside',
//			    	width: 500,
//			    	height: 500
//			    },
//			    lineStyle: {
//			    	normal: {
//			    		type: 'solid',
//			    		color: '#28a5fc',
//			    		opacity: '0.5'
//			    	}
//			    },
//			    backgroundColor:"#FFFFFF",//背景颜色
//				borderWidth:0.1,
//			    
//			    series : [
//			        {
//			            name:'收益',
//			            type:'line',
//			            smooth:false,
//			            barGap: '30%',
//			            lineStyle: {
//						    normal: {
//							    type: 'solid',
//							    color:"#4799F0",
//							    opacity :"0.5"
//						    }
//						},
//						/*设置区域渐变色*/
//						areaStyle: {
//							normal: {
//							    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
//							        offset: 0,
//							        color: 'rgba(53, 132, 234, 0.67)'
//							    }, {
//							        offset: 1,
//							        color: 'rgba(218, 245, 253, 0.33)'
//							    }])
//							
//							}
//						},
//			            itemStyle: {
//			            	normal: {
//			            		areaStyle: {type: 'default'}
//			            	}
//			            },
//			            data:  xdatas
//			        }
//			    ]
//			};
//		myChartOfLine.setOption(option);
		
		
		
			var myChartOfLine = echarts.init(document.getElementById('assetProfitLine'));
			option = {
			    tooltip : {
			        trigger: 'item',
			        backgroundColor: '#fff',
			        borderColor: '#97b7ff',
			        borderWidth: 1,
			        padding: 10,
			        textStyle: {
			        	color: '#555',
			        	fontSize: 13
			        },
			        formatter: function(item){
			        	return '<div style="text-align:center;">'+item.name+'</div><div>当日收益：<span style="color:#FF8E58">+'+(item.color == "#2d6eff" ? item.value : "0.00")+'</span></div>'
			        }
			    },
//			    color: ["#2d6eff"],
			    xAxis : [
			        {
			            type : 'category',
			            boundaryGap : false,
			            scale: false,
			            axisLabel: {
			            	show: false,
			            	textStyle: {
			            		color: '#a7aab3'
			            	}
			            },
			             // x轴的横坐标边框线
					    axisLine: {
					    	show: false
					    },
					    axisTick: {
					    	show: false
					    },
					    // 背景图的内置表格中的“边框”的颜色线条， 这个是x轴的竖线
					    aplitLine: {
					    	lineStyle: {
					    		color: '#e4e4e4',
					    		type: 'solid'
					    	}
					    },
					    data :xdatas  //['10/27','10/28','10/29','10/30','10/31','11/01','11/02'],
			        }
			    ],
			    yAxis : [
			        {
			            type : 'value',
			            max: maxIcome,
			            axisLabel : {
			                formatter: '{value}%'
			            },
			            axisLine: {
			            	show:false,
			            	lineStyle: {
			            		color:'e4e4e4'
			            	}
			            },
			            axisLabel:{
						    show:false,
						    textStyle:{
						        fontSize:"8px",
						        color:"#a7aab3"
						    }
						},
						axisTick: {
							show: false,
						},
						splitLine: {//终于找到了，背景图的内置表格中“边框”的颜色线条   这个是y轴的横线
					        show: false,
					     	lineStyle:{
				                color:"#e4e4e4",
				                type:"solid",
					        }
					    }
			        }
			        
			    ],
			    dataZoom: {
			    	type: 'inside',
			    	width: 500,
			    	height: 500
			    },
			    lineStyle: {
			    	normal: {
			    		type: 'solid',
			    		color: '#28a5fc',
			    		opacity: '0.5'
			    	}
			    },
			    backgroundColor:"#FFFFFF",//背景颜色
				borderWidth:0.1,
			    
			    series : [
			        {
			            name:'收益',
			            type:'bar',
			            smooth:false,
			            barGap: '30%',
			            barWidth : 10,
			            lineStyle: {
						    normal: {
							    type: 'solid',
							    color:"#4799F0",
							    opacity :"0.5"
						    }
						},
						/*设置区域渐变色*/
//						areaStyle: {
//							normal: {
//							    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
//							        offset: 0,
//							        color: 'rgba(53, 132, 234, 0.67)'
//							    }, {
//							        offset: 1,
//							        color: 'rgba(218, 245, 253, 0.33)'
//							    }])
//							
//							}
//						},
			            itemStyle: {
			            	emphasis: {
	                            barBorderRadius: 10
	                        },
			            	normal: {
			            		areaStyle: {type: 'default'},
			            		//柱形图圆角，初始化效果
		                        barBorderRadius:10,
			            		color: function(params){
			            			return color[params.dataIndex];
			            		}
			            	}
			            },
			            data:  ydatas //[5.0, 4.5, 5.5, 4.7, 5.8, 5.2, 5.9]
			        }
			    ]
			};
		     //使用刚指定的配置项和数据显示图表。
		    myChartOfLine.setOption(option);
		}
	},
	redeem:function(){
		var _this = this;
		toList()
		function toList(){
			GHutils.load({
				url: GHutils.API.PRODUCT.gett0productlist+'?channeOid='+channelOid+'&rows=100&page=1',
				data: {},
				type: "post",
				callback: function(result) {
					var oids = '' //获取体验金oid拼接字符串
					GHutils.forEach(result.rows,function(idx,product){
						if(GHutils.label(product.productLabels,'8')){
							oids+=product.oid+','
						}
					})
					loadMyt0(oids)
				}
			});
		}
	    
	    
	    function loadMyt0(oids){
	    	//我的活期列表
			GHutils.load({
				url: GHutils.API.ACCOUNT.prot0list,
				data: {},
				type: "post",
				callback: function(result) {
					if(result.errorCode != 0){
						$("#content").html(result.errorMessage)
						$("#content-box").modal("show")
						return false;
					}
					if(result.holdingDetails.rows.length == 0){
						$("#content").html('您没有可赎回的活期产品')
						$("#content-box").modal("show")
						return false;
					}
					//持有中
					var isFlag  = GHutils.forEach(result.holdingDetails.rows,function(idx,product){
						if(oids.indexOf(product.productOid)>-1){//体验金产品
						}else{
							gett0detail(product.productOid)
							return true;
						}
					})
					if(!isFlag){
						$("#content").html('您没有可赎回的活期产品')
						$("#content-box").modal("show")
						return false;
					}
				}
			})
	    }
	    
	    
	    function gett0detail(productOid){
			GHutils.load({  
				url: GHutils.API.PRODUCT.gett0detail+'?oid='+productOid,
				data:{},
				type: "post",
				async:false,
				callback: function(result) {
					if(result.errorCode != 0) {
						return
					}
					if(result.isOpenRemeed == "NO"){
						$("#content").html('产品不可赎回')
						$("#content-box").modal("show")
						return
					}
					isOpenRemeed(productOid,result.isPreviousCurVolume,result.previousCurVolume)
				},
				errcallback: function(){

				}
			});
	    }
	    
	    function isOpenRemeed(productOid,isPreviousCurVolume,previousCurVolume){
			//获取可赎回金额
			GHutils.load({  
				url: GHutils.API.ACCOUNT.prot0detail+'?productOid='+productOid,
				data:{},
				type: "post",
				async:false,
				callback: function(result) {
					if(result.errorCode != 0) {
						return
					}
					
					var msg = ''
					//singleDayRedeemCount单人单日赎回赎回次数 >dayRedeemCount当日已赎回次数
					if(result.singleDayRedeemCount && result.dayRedeemCount >= result.singleDayRedeemCount){
						msg= "您的当日赎回次数已达上限"+result.singleDayRedeemCount+"笔"
					}
					var redeem = result.minRredeem
					if(redeem > result.redeemableHoldVolume){
						//起赎金额 > 持有金额
						msg="您的剩余可赎回金额小于起赎金额"+redeem+"元"
					}
					if(result.singleDailyMaxRedeem && GHutils.Fadd(redeem,result.dayRedeemVolume) >  result.singleDailyMaxRedeem){
						msg="您的当日剩余可赎回金额小于起赎金额"+redeem+"元"
					}
					if(result.maxRredeem && redeem > result.maxRredeem){
						msg="产品的剩余可赎回金额小于起赎金额"+redeem+"元"
					}
					if(result.netMaxRredeemDay && redeem> result.dailyNetMaxRredeem){
						msg="产品的单日净赎回已达上限"
					}
					if(isPreviousCurVolume =="YES" && redeem > previousCurVolume){
						msg="今日累计赎回已超出产品单日可赎回上限，请在下一交易日再发起赎回"
					}
					if(msg){
						$("#content").html(msg)
						$("#content-box").modal("show")
						return
					}
					window.location.href="product-redeem.html?productOid="+productOid
				}
			});
		}
	},
	toInvestPrapareCallback:function(){
		var _this = this;
		window.location.href="account-validate.html?action="+_this.action+"&actionURL="+window.location.href;
	}
}

$(function() {
	var account = new Account();
	account.init();
	window.init = account;
})

