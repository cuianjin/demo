var GHutils = {}


var HOST = "";

var channelid = "999920170228100000"

//demo环境  36服务器
var channelOid = "2c9280855d9bb0c3015d9bf85df6070d";
var cid = "123456";
var ckey = "123456";
var cmsChannelOid = "40288087602c106901602ea7fe4e0001";
var qsid = "2c9280825d9d20d8015d9d2f312401ce";

//http://106.14.213.92  //92服务器
//var channelOid = "2c9280855d9bb0c3015d9bf85df6070d";
//var cid = "123456";
//var ckey = "123456";
//var cmsChannelOid = "2c92808a5d9826cc015d9bf9bd010000";
//var qsid = "2c9280825d9d20d8015d9d2f312401ce";

//84环境（地址：http://114.215.133.84 ）
// var channelOid = "8a2373945f52e4c9015f5cda09e47837";
// var cid = "12306";
// var ckey = "12306";
// var cmsChannelOid = "8a2373945aa19ab5015aa1ad8f4f0004";



GHutils.constant = {
	userStatus: "userStatus"
}

GHutils.userinfo = null;
GHutils.product = null;
GHutils.API = {
	//用户相关
	USER: {
		doLogin: HOST + '/mimosa/client/investor/baseaccount/login', //登录
		doLogout: HOST + '/mimosa/client/investor/baseaccount/logout', //登出
		checklock: HOST + '/mimosa/client/investor/baseaccount/checklock', // --忘记登录密码，获取验证码之前，查看用户锁定状态
		register: HOST + '/mimosa/client/investor/baseaccount/regist', //注册
		getimgvc: HOST + '/mimosa/client/captcha/getimgvc', //获取图形验证码
		updatepassword: HOST + '/mimosa/client/investor/baseaccount/forgetloginpwd', //重置登录密码
		seq: HOST + '/mimosa/client/investor/baseaccount/checkloginpwd', //修改登录密码时判断是否与之前密码相同
		modifypassword: HOST + '/mimosa/client/investor/baseaccount/editloginpwd', //修改登录密码
		dealpaypwd: HOST + '/mimosa/client/investor/baseaccount/editpaypwd', //设置/修改支付密码
		checkpaypwd: HOST + '/mimosa/client/investor/baseaccount/checkpaypwd', //验证原支付密码
		sendv: HOST + '/mimosa/client/sms/sendvc', //修改交易密码，忘记登录密码，验证码登录，注册
		verify: HOST + '/mimosa/client/sms/checkvc', //--修改交易密码，忘记登录密码，绑卡验证手机验证码是否正确
		setpaypwd: HOST + '/mimosa/client/investor/baseaccount/editpaypwd', //设置交易密码
		modifypaypwd: HOST + '/mimosa/client/investor/baseaccount/modifypaypwd', //修改交易密码
		messages: HOST + '/cms/boot/push/pushQuery', //消息中心
		isLogin: HOST + '/mimosa/client/investor/baseaccount/islogin', //判断用户登陆状态
		registerCoupon: HOST + '/mimosa/client/tulip/couponSoonList' //获取用户注册/申购/实名认证绑卡/赎回/提现/充值活动优惠券
	},
	//账户信息相关
	ACCOUNT: {
		userinfo: HOST + '/mimosa/client/investor/baseaccount/accountinfo', //获取用户信息
		usermoneyinfo: HOST + '/mimosa/client/investor/baseaccount/userinfo', //用户资金相关信息  
		useraccount: HOST + '/mimosa/client/investor/baseaccount/myhome', //我的首页
		accountdetail: HOST + '/mimosa/client/investor/baseaccount/mycaptial', //我的资产详情
//		monthDaysOfIncome: HOST + '/mimosa/client/investor/holdincome/mydatedetail', //查询客户一个月内活期定期收益
		monthDaysOfIncome: HOST + '/mimosa/client/investor/holdincome/mydatedetailbymonth', //查询客户一个月内活期定期收益
		deposit: HOST + '/mimosa/client/investor/bankorder/deposit', //银行卡充值
		apideposit: HOST + '/mimosa/client/investor/bankorder/apideposit',//网银充值
		withdraw: HOST + '/mimosa/client/investor/bankorder/withdraw', //提现
		
		prot0list: HOST + '/mimosa/client/holdconfirm/t0hold', //我的活期列表	
		prot0detail: HOST + '/mimosa/client/holdconfirm/mycurrdetail', //我的活期产品详情
		prot0qryincome: HOST + '/mimosa/client/investor/holdincome/qryincome', //我的活期交易明细--收益
		protnlist: HOST + '/mimosa/client/holdconfirm/tnhold', //我的定期列表
		proholdtndetail: HOST + '/mimosa/client/holdconfirm/holdregularinfo', //我的定期持有中详情
		proclosetndetail: HOST + '/mimosa/client/holdconfirm/closedregularinfo', //我的定期已结清详情
		gettradelist: HOST + '/mimosa/client/platform/investor/cashflow/query', //交易明细
		//			depwdrawlist: HOST + '/mimosa/client/investor/bankorder/myquery',	//充提记录
		depwdrawlist: HOST + '/mimosa/client/investor/bankorder/mng', //充提记录
		cityAll: HOST + '/mimosa/client/city/all', //大额提现查询开户行省市(all)
		feedback: HOST + '/cms/app/addAdvice', //意见反馈
		coupon: HOST + '/mimosa/client/tulip/myallcoupon', //我的卡券
		couponreceive: HOST + '/mimosa/client/investor/coupon/useredpacket', //领取红包
		checkcoupon: HOST + '/mimosa/client/investor/coupon/isredokay', //判断红包领取成功
		expproducts: HOST + '/mimosa/product/client/expproducts', //获取体验金产品
		prot0qrydetail: HOST + '/mimosa/client/tradeorder/mng', //交易明细
		valid4ele: HOST + '/mimosa/client/investor/bank/bindcardapply', //新增银行卡
		bankadd: HOST + '/mimosa/client/investor/bank/add', //新增银行卡
//		getBankCard: HOST + '/settlement/channelBank/findBankInfoByCard', //通过银行卡号获取银行卡信息
		getBankCard: HOST + '/mimosa/client/investor/bank/getbcinfo', //通过银行卡号获取银行卡信息
		getFriendEventInfo: HOST + '/mimosa/client/tulip/getFriendEventInfo', //获取体验金金额及时间
		getRegisterEventInfo: HOST + '/mimosa/client/tulip/getRegisterEventInfo', //未登录状态下获取体验金金额
		getActRuleInfo: HOST + '/cms/app/getActRuleInfo', //获取邀请规则
		getEventInfo: HOST + '/mimosa/client/tulip/getEventInfo',
		checkEnable: HOST + '/mimosa/client/switch/find', //判断用户是否能进行登录/注册/充值/提现/申购/非交易日提现手续费/一个月提现次数/交易日提现手续费	等操作
		getBankStyle: HOST + '/cms/client/bankCard/find', //获取银行卡icon和背景色
		bankList: HOST + '/cms/client/bankCard/findall', //查询所有银行信息
		sendBankCode: HOST + '/mimosa/client/investor/bankorder/apply/dapply', //发送充值验证码
		useRedPackets: HOST + '/mimosa/client/investor/bankorder/receiveredenvelope', //使用红包
		tdetail: HOST + '/mimosa/product/client/tdetail', //体验金详情
		removebank: HOST + '/mimosa/boot/investor/bank/removebank', //解绑银行卡
//		qamsQueTypeResultById: HOST + '/mimosa/qams/que/qamsQueResultByid', //风险测评
//		saveAnswerQue: HOST + '/mimosa/qams/answerQue/saveAnswerQue', //风险测评提交
//		answerQueDetail4Loginer: HOST + '/mimosaui/qams/answerQue/saveInvesterLevel', //答题结果，分数 等级
		
		getAllNameList: HOST + '/mimosaui/qams/que/getAllNameList', //获取所有问卷问题
		qamsQueResultByid: HOST + '/mimosaui/qams/que/qamsQueResultByid', //风险评估
		saveAnswerQue: HOST + '/mimosaui/qams/answerQue/saveAnswerQue', //保存答卷
		qamsScore: HOST + '/mimosaui/qams/answerQue/qamsScore', //判断是否风险测评
		saveInvesterLevel: HOST + '/mimosaui/qams/answerQue/saveInvesterLevel', //确认默认风评
        //invitecharts: HOST + '/mimosa/client/investor/baseaccount/referdetail/rebatetop10', //邀请返佣金-->邀请排行榜
        invitecharts: HOST + '/mimosa/client/investor/baseaccount/referdetail/recomtop10', //邀请排行榜
		//getmyinvites: HOST + '/mimosa/client/investor/baseaccount/referdetail/referlister', //邀请返佣金-->我的邀请
        getmyinvites: HOST + '/mimosa/client/investor/baseaccount/referdetail/referlist', //我的邀请
		payed: HOST+'/mimosa/client/rebatedetail/payed', 									//邀请返佣金-->已结算
		payedDetail: HOST+'/mimosa/client/rebatedetail/payeddetail', 						//邀请返佣金-->已结算明细
		topay: HOST+'/mimosa/client/rebatedetail/topaynew', 								//邀请返佣金-->待结算
        limitamount: HOST+'/mimosa/client/investor/bankorder/limitamount', 					//限额
	},
	//产品相关
	PRODUCT: {
		//			recommends: HOST + '/mimosa/product/client/labelProducts', //根据标签查询产品列表
		recommends: HOST + '/mimosa/product/client/pchome', //根据标签查询产品列表
		getproductlist: HOST + '/mimosa/client/product/pitproduct/apphomeext', //首页产品列表
		gettnproductlist: HOST + '/mimosa/product/client/tnproductsext', //定期产品列表
		//			gettnproductlist: HOST + '/mimosa/product/client/periodics', //定期产品列表
		gett0productlist: HOST + '/mimosa/product/client/t0productsext', //活期产品列表
		getproductdetail: HOST + '/mimosa/product/client/pdetailer', //定期产品详情
		mycouponofpro: HOST + '/mimosa/client/tulip/mycouponofpro', //认购获取优惠券
		gett0detail: HOST + '/mimosa/product/client/cdetail', //活期产品详情
		mholdvol: HOST + '/mimosa/client/holdconfirm/mholdvol?productOid=', //获取活期产品单人已持有金额
		cori: HOST + '/mimosa/product/cori', //产品协议获取企业信息
		invest: HOST + '/mimosa/client/tradeorder/invest', //--产品购买
		performredeem: HOST + '/mimosa/client/tradeorder/redeem', //活期赎回
		systime: HOST + '/systime', //获取系统时间
		getsummoney: location.protocol + '//' + location.host + '/program/ctp/biz/prm/turnoverAction_queryTurnoverInfo', //获取累计成交金额，累计创造客户收益
		getTradeRecords: HOST + '/mimosa/client/tradeorder/iorders', //获取产品的交易记录
		statistics: HOST + '/mimosa/client/platform/baseaccount/deta', //获取首页 平台统计 累计投资 累计为用户赚取(元)
		getAgreement: HOST + '/mimosa/investorbuyrisk/getAgreement'//
	},
	ORDER: {
		depositisdone: HOST + '/mimosa/client/investor/bankorder/isdone', //检测充值订单是否完成
		investisdone: HOST + '/mimosa/client/tradeorder/isdone' //检测申购订单是否完成
	},
	//微信相关
	WX: {
		qrcode: "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=",
		sdkconfig: HOST + '/weixin/getjssdk',
		getsceneid: HOST + '/weixin/getsceneid',
		getopenid: HOST + '/weixin/getopenid',
		sendtplmsg: HOST + '/weixin/sendTplMsg',
		qrcodeticket: HOST + "/weixin1/client/wx/getqrcodeticket"
	},
	//截取URL
	URL: {
		host: location.protocol + '//' + location.host
	},
	//CMS后台管理系统
	CMS: {
		gethome: HOST + '/cms/app/home', //获取主页信息
		getnotices: HOST + '/cms/app/getNotices', //获取公告信息
		infromationtype: HOST + '/cms/app/getInformationType', //获取资讯类型
		getinformations: HOST + '/cms/app/getInformations', //或许资讯信息
		getinformationsalltoapp: HOST + '/cms/app/getInformationsAlltoApp', //获取全部资讯列表
		getBanner: HOST + '/cms/app/banner', //获取banner
		getNoticesH5: HOST + '/cms/app/getNoticesH5', //获取公告
		getNoticeInfo: HOST + '/cms/app/getNoticeInfo', //获取公告详情
		getProtocolInfo: HOST + '/cms/app/getProtocolInfo', //获取各种协议
		elementConfig: HOST + '/cms/client/element/find', //元素配置
		messageDetails: HOST + '/cms/client/mail/detail', //站内信详情
		messageNoreadnum: HOST + '/cms/client/mail/noreadnum', //获取未读站内信数量
		messageAllread: HOST + '/cms/client/mail/allread', //站内信全部置为已读
		messageQueryPage: HOST + '/cms/client/mail/queryPage', //分页查询站内信
		getinformationsalltoapp: HOST + '/cms/app/getInformationsAlltoApp',
		getPartner: HOST + '/cms/client/partner/find', //获取合作伙伴
		pushQuer: HOST + '/cms/app/pushQuery', //推送
		getshareconfig: HOST + '/cms/client/shareconfig/getshareconfig' //获取分享信息
	}
}
//ajax请求
GHutils.load = function(op) {
	if(!op || !op.url) {
		return;
	}

	if(op.params) {
		op.url = op.url + "?" + decodeURIComponent($.param(op.params));
	}

	if(op.sp) {
		GHutils.processingShow();
	}
	
	var set = {
		type: op.type || "post",
		url: op.url,
		async: op.async == false ? false : true,
		data: JSON.stringify(op.data) || "",
		contentType: op.contentType || "application/json",
		dataType: "JSON",
		success: function() {
			if(op.sp) {
				GHutils.processingHide();
			}
			if(op.callback && typeof(op.callback) == 'function') {
				if(GHutils.preErrorHandle(arguments[0])) {
					op.callback.apply(null, arguments);
				}
			}
		},
		timeout: 20000,
		error: function(xhr, type, errorThrown) {
			if(op.sp) {
				GHutils.processingHide();
			}
//			$(".btn_loading").removeClass("btn_loading");
			$(".btn_loading").each(function(idx,ele){
				if(!$(ele).hasClass("btn_vc")){
					$(ele).removeClass("btn_loading")
				}
			})
			$(".submiting").removeClass("submiting");
			if(op.errcallback) {
				op.errcallback();
			}
		}
	};
	$.ajax(set);
}
/**
 * 将对象转换成带参数的形式 &a=1&b=2
 */
GHutils.buildQueryUrl = function(url, param) {
	var x = url
	var ba = true
	if(x.indexOf('?') != -1) {
		if(x.indexOf('?') == url.length - 1) {
			ba = false
		} else {
			ba = true
		}
	} else {
		x = x + '?'
		ba = false
	}
	var builder = ''
	for(var i in param) {
		var p = '&' + i + '='
		if(param[i]) {
			var v = param[i]
			if(Object.prototype.toString.call(v) === '[object Array]') {
				for(var j = 0; j < v.length; j++) {
					builder = builder + p + encodeURIComponent(v[j])
				}
			} else if(typeof(v) == "object" && Object.prototype.toString.call(v).toLowerCase() == "[object object]" && !v.length) {
				builder = builder + p + encodeURIComponent(JSON.stringify(v))
			} else {
				builder = builder + p + encodeURIComponent(v)
			}
		}
	}
	if(!ba) {
		builder = builder.substring(1)
	}
	return x + builder
}
//
GHutils.preErrorHandle = function(resp) {
	var errcode = resp.errorCode

	var isFlag = true
	if(errcode == "40004") {
		window.location.href = "repair.html";
	}
	if(errcode == "E10001") {
		//GHLocalStorage.clear();
		GHutils.loginOut(true);
	}
	return isFlag;
}

//格式化时间格式
/**
 * @param {Object} param 
 *   {time:时间   showtime:("false":显示时分秒     默认不显示时分秒 )}
 */
GHutils.formatTimestamp = function(param) {
	var d = new Date();
	d.setTime(param && param.time || d);
	var datetime = null;
	var x = d.getFullYear() + "-" + (d.getMonth() < 9 ? "0" : "") + (d.getMonth() + 1) + "-" + (d.getDate() < 10 ? "0" : "") + d.getDate();
	var y = (d.getHours() < 10 ? " 0" : " ") + d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes() + ":" + (d.getSeconds() < 10 ? "0" : "") + d.getSeconds();

	if(param.showtime == "false") {
		datetime = x + y;
	} else {
		datetime = x;
	}

	return datetime;
}

/**
 * 日期加减发
 * @param {Object} date
 * @param {Object} days
 */
GHutils.addDate = function(date, days) {
	var d = new Date(date.replace(/-/g,'/'));
	d.setDate(d.getDate() + days);
	var month = d.getMonth() + 1;
	var day = d.getDate();
	if(month < 10) {
		month = "0" + month;
	}
	if(day < 10) {
		day = "0" + day;
	}
	var val = d.getFullYear() + "-" + month + "-" + day;
	return val;
}

/**
 * 获取验证码按钮倒计时
 * @param {Object} obj 按钮对象
 */
GHutils.btnTime = function(obj) {
	var btntime = null;

	if(obj) {
		var t = 120;
		btntime = setInterval(function() {
			if(t >= 0) {
				obj.addClass("btn_loading");
				obj.html('重新获取(' + t + ')');
				t--;
			} else {
				obj.removeClass("btn_loading");
				obj.removeAttr("disabled");
				obj.html("获取验证码");
				clearInterval(btntime);
				t = 120;
			}
		}, 1000)
	}
	return btntime
}

/**
 * 清除按钮倒计时
 * @param {Object} btnTime 计时对象
 * @param {Object} obj     按钮对象
 */
GHutils.clearBtnTime = function(btnTime, obj) {
	if(obj) {
		obj.removeClass("btn_loading");
		obj.removeAttr("disabled");
		obj.html("获取验证码");
		clearInterval(btnTime);
	}
}

/**
 * 将数值截取后2位小数,格式化成金额形式
 * @param num 数值(Number或者String)
 * @return 金额格式的字符串,如'1,234,567.45'
 * @type String
 */
GHutils.formatCurrency = function(num) {
	num += ''
	num = num.toString().replace(/\$|\,/g, '');
	if(isNaN(num))
		num = "0";
	sign = (num == (num = Math.abs(num)));
	num = Math.floor(GHutils.Fmul(num, 100));
	cents = num % 100;
	num = Math.floor(num / 100).toString();
	if(cents < 10)
		cents = "0" + cents;
	for(var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
		num = num.substring(0, num.length - (4 * i + 3)) + ',' +
		num.substring(num.length - (4 * i + 3));
	return(((sign) ? '' : '-') + num + '.' + cents);
}

/**
 * 将数值格式化成金额形式
 * @param {Object} num
 */
GHutils.formatIntCurrency = function(num) {
	num = parseInt(num.toString().replace(/\$|\,/g, '')).toString();
	if(isNaN(num))
		num = "0";
	for(var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
		num = num.substring(0, num.length - (4 * i + 3)) + ',' +
		num.substring(num.length - (4 * i + 3));
	return num;
}

//修复JS浮点的加减乘除运算 Fadd加 Fsub减 Fmul乘 Fdiv除
/**
 * 加法 a+b
 * @param {Object} a
 * @param {Object} b
 */
GHutils.Fadd = function(a, b) {
	var c, d, e;
	try {
		c = a.toString().split(".")[1].length;
	} catch(f) {
		c = 0;
	}
	try {
		d = b.toString().split(".")[1].length;
	} catch(f) {
		d = 0;
	}
	return e = Math.pow(10, Math.max(c, d)), (GHutils.Fmul(a, e) + GHutils.Fmul(b, e)) / e;
}
/**
 * 减法 a-b
 * @param {Object} a
 * @param {Object} b
 */
GHutils.Fsub = function(a, b) {
	var c, d, e;
	try {
		c = a.toString().split(".")[1].length;
	} catch(f) {
		c = 0;
	}
	try {
		d = b.toString().split(".")[1].length;
	} catch(f) {
		d = 0;
	}
	return e = Math.pow(10, Math.max(c, d)), (GHutils.Fmul(a, e) - GHutils.Fmul(b, e)) / e;
}

/**
 * 乘法 a*b
 * @param {Object} a
 * @param {Object} b
 */
GHutils.Fmul = function(a, b) {
	var c = 0,
		d = a.toString(),
		e = b.toString();
	try {
		c += d.split(".")[1].length;
	} catch(f) {}
	try {
		c += e.split(".")[1].length;
	} catch(f) {}
	return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}

/**
 * 除法 a/b
 * @param {Object} a
 * @param {Object} b
 */
GHutils.Fdiv = function(a, b) {
	var c, d, e = 0,
		f = 0;
	try {
		e = a.toString().split(".")[1].length;
	} catch(g) {}
	try {
		f = b.toString().split(".")[1].length;
	} catch(g) {}
	return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), GHutils.Fmul(c / d, Math.pow(10, f - e));
}
/**
 * 转几位小数点（按位数截取），带后缀（单位）GHutils.toFixed(10000,4,"元") = 10000.0000元
 * @param {Object} numb    要格式化的数据
 * @param {Object} digital 要保留的小数位数
 * @param {Object} suffix  单位
 */
GHutils.toFixeds = function(numb, digital, suffix) {
	var digital = digital ? digital : 0;
	var fixed = 1;
	for(var i = 0; i < digital; i++) {
		fixed = fixed * 10;
	}

	if(numb == undefined || numb.length == 0) {
		return "--";
	} else {
		var numb = GHutils.Fmul(Number(numb), fixed);
		return(parseInt(numb) / fixed).toFixed(digital) + (suffix ? suffix : "");
	}
}
/**
 * 获取浏览器URL参数，并转换成json格式
 * @param {Object} url
 */
GHutils.parseUrlParam = function(url) {
	var urlParam = {};
	if(url.indexOf("?") < 0) {
		return urlParam;
	}
	var params = url.substring(url.indexOf("?") + 1).split("&");
	for(var i = 0; i < params.length; i++) {
		var k = params[i].substring(0, params[i].indexOf("="));
		var v = params[i].substring(params[i].indexOf("=") + 1);
		if(v.indexOf("#") > 0) {
			v = v.substring(0, v.indexOf("#"));
		}
		if(v.match(/^(([1-9]\d*)|0)(\.\d{0,2})?$/g)){
			v = Number(v)
		}
		urlParam[k] = v;
	}
	return urlParam;
}

//回退
GHutils.goback = function(trace) {
	if(!trace) {
		history.go(-1);
	} else {
		window.location.href = trace;
	}
}
/**
 * 校验结果集
 * @param {Object} result 结果集
 * @param {Object} tips   错误提示容器对象
 */
GHutils.checkErrorCode = function(result, tips) {
	var that = this;
	var tips = tips || false;
	if(result.errorCode == 0) {
		return true;
	} else {
		$(".submiting").removeClass("submiting");
		$(".btn_loading").each(function(idx,ele){
			if(!$(ele).hasClass("btn_vc")){
				$(ele).removeClass("btn_loading")
			}
		})
		if(tips) {
			$(tips).html("提示：" + result.errorMessage);
		} else {
			alert(result.errorMessage);
		}
		GHutils.processingHide();
		return false;
	}
}

/**
 * 打印信息
 * @param {Object} data 要打印的数据(可不填,可以是各种类型数据)
 * @param {Object} msg  提示信息
 */
GHutils.log = function(data, msg) {
	msg = msg || ""
	if(data && typeof(data)=="object"){
		//console.log(msg+" "+JSON.stringify(data));
	}else{
		//console.log(msg+" "+data);
	}
}
//悬浮提示
//GHutils.warn = function(content,) {
////	$.tips({
////		content: content,
////		stayTime: 2000,
////		type: "warn"
////	})
//}

GHutils.showError = function(content, tips) {
	if(tips) {
//		var icon = '<span class="app-icon app-icon-clear"></span>';
		$(tips).html( content);
		return
	}
	alert(content);
}

GHutils.bindClear = function() {
	$(".ui-icon-close").on("click", function(e) {
		$(this).parent().find("input").val("");
	})
}

//GHutils.processingShow = function(cnt) {
//	var cnt = cnt || "处理中..."
//	this.loading = $.loading({
//		content: cnt
//	})
//}

GHutils.processingHide = function() {
	if(this.loading) {
		this.loading.loading("hide");
	}
}

GHutils.bindEventBanner = function() {
	$(".app_nav_links").on("click", function() {
		var _href = $(this).attr("data-href");
		window.location.href = _href;
	});
}

///**
// * 获取banner
// * @param {Object} obj
// * @param {Object} channel 渠道编号
// * @param {Object} singleChannel ok-只当前渠道 no-当前渠道+all渠道
// */
//GHutils.getBanner = function(obj, channel, singleChannel) {
//	GHutils.load({
//		url: GHutils.API.CMS.getBanner + '?channelCode=' + channel + '&singleChannel=' + singleChannel,
//		data: {},
//		type: "post",
//		async: false,
//		callback: function(result) {
//			if(result.errorCode == 0) {
//				var rows = result.rows;
//				var bannerHtml = '';
//				for(var i in rows) {
//					if(rows[i].linkUrl) {
//						bannerHtml += '<li><img src="' + rows[i].imageUrl + '" class="app_nav_links" data-href="' + rows[i].linkUrl + '"/></li>';
//					} else {
//						bannerHtml += '<li><img src="' + rows[i].imageUrl + '"/></li>';
//					}
//				}
//				$(obj).html(bannerHtml);
//				GHutils.bindEventBanner();
//				//初始化banner
//				var _len = $(".ui-slider-content li").length;
//
//				if(_len > 1) {
//					var slider = new fz.Scroll('.ui-slider', {
//						role: 'slider',
//						indicator: true,
//						autoplay: false,
//						interval: 3000
//					});
//				}
//			}
//		}
//	});
//}

/**
 * 表单输入验证
 * @param {Object} obj    验证的元素对象  
 * @param {Object} regnum 验证的数据格式的编号
 */
GHutils.checkInput = function(_obj, regnum,e) {
	var dom  = $(_obj)
	if(!dom || dom.length < 1){
		return 
	}
	var browser=navigator.appName 
	var trim_Version=(navigator.appVersion.split(";")[1]||"").replace(/[ ]/g,""); 
	if(browser=="Netscape" || (browser=="Microsoft Internet Explorer" && (trim_Version=="MSIE8.0" || trim_Version=="MSIE9.0")) ){ 
		$(_obj).keyup(function(){
			check();
		}).on("paste",function(e){
            $(_obj).keyup();
		}).on("contextmenu",function(e){//禁止鼠标右键弹出操作选项列表
			e.preventDefault();
		})
	}else{ 
		$(_obj).on("input",function(){
			check();
		}).on("paste",function(e){
			check();
		})
	} 
	
	function check(){
		var obj = $(_obj)[0];
		var regTel = /^[0-9]{0,11}$/g; //电话号码(0)
		var regPwd = /^([a-zA-Z0-9]){0,16}$/g; //密码(1)
		var regNum = /^\d+$/g; //纯数字(2)
		var regNump = /^(([1-9]\d*)|0)(\.\d{0,2})?$/g; //含两位小数数字(3)
		var regNumId = /^\d{0,17}(\d|x|X)$/g; //身份验证(4)
		var regYzm = /^\d{0,6}$/g; //纯数字(5)
		var regMoney = /^((([1-9]{1}\d{0,7}))|(100000000))?$/; //1亿以内整数金额(6)
		//var	regTxt    = /^[\u4E00-\u9FA5]$/g;//汉字(4)
	
		var value = obj.value;
		if(3 == regnum || 6 == regnum) {
			value = value.replace(",", "");
		}
		var regs = [regTel, regPwd, regNum, regNump, regNumId, regYzm, regMoney];
		var _val = value.match(regs[regnum]);
		var Start = obj.selectionStart;
	
		//console.log(_val);
	
		if(_val || value == '') {
			value == '' ? _val = value : _val = _val[0];
			obj.setAttribute("app_backvalue", _val);
		} else {
			_val = obj.getAttribute("app_backvalue") || "";
			//Start = Start - 1;
		}
		obj.value = _val;
		//设置光标位置
		obj.selectionStart = obj.selectionEnd = Start;
	}
	
}
/**
 * 表单提交验证
 * @param {Object} scope 要验证的元素容器的id
 */
GHutils.validate = function(scope) {
		var result = true;

		$("#" + scope + " input,#" + scope + " select,#" + scope + " textarea").each(function(d, i) {
			var dom = $(i);
			var valid = dom.attr("valid");
			if(valid && result) {
				var ops = JSON.parse(valid);

				var tips = ops.tipsbox || false;

				//console.log(dom)

				if(ops.required || dom.val()) {
					if(!dom.val()) {

						GHutils.showError(ops.msg + '不能为空', tips);
						result = false;
						return;
					}
					var e = ops;
					if(e.minLength) {
						if(dom.val().length < e.minLength) {
							GHutils.showError(e.msg + '不能小于' + e.minLength + '位', tips);
							result = false;
							return;
						}
					}
//					if(e.maxLength) {
//						if(dom.val().length > e.maxLength) {
//							GHutils.showError(e.msg + '不能大于' + e.minLength + '位', tips);
//							result = false;
//							return;
//						}
//					}
//					if(e.between) {
//						if(dom.val().length < e.between[0] || dom.val().length > e.between[1]) {
//							GHutils.showError(e.msg + '长度要' + e.between[0] + '位和' + e.between[1] + '位之间', tips);
//							result = false;
//							return;
//						}
//					}
					if(e.finalLength) {
						if(dom.val().length != e.finalLength) {
							GHutils.showError(e.msg + '为' + e.finalLength + '位', tips);
							result = false;
							return;
						}
					}
					if(e.equals) {
						if(dom.val() != $("#" + e.equals).val()) {
							GHutils.showError(e.msg + '和' + e.equalsMsg + '不一致', tips);
							result = false;
							return;
						}
					}

					if(e.mobilePhone) {
						if(!dom.val().match("^1[3|4|5|7|8][0-9]{9}$")) {
							GHutils.showError(e.msg + '格式不正确', tips);
							result = false;
						}
					} else if(e.identityCard) {//身份证号
						if(!dom.val().match("^\\d{17}[X|\\d|x]$")) {
							GHutils.showError(e.msg + '格式不正确', tips);
							result = false;
						}
					} else if(e.passWord) {
//						if(!dom.val().match("^([\x21-\x7e]|[a-zA-Z0-9]){6,16}$")) {
//							GHutils.showError(e.msg + '格式不正确', tips);
//							result = false;
//						}
						if(!dom.val().match(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/)) {
							GHutils.showError(e.msg + '格式不正确', tips);
							result = false;
						}
					} else if(e.payPassWord) {
						if(!dom.val().match("^[0-9]{6}$")) {
							GHutils.showError(e.msg + '格式不正确', tips);
							result = false;
						}
					} else if(e.debitCard) {//银行卡号
						if(!dom.val().match("^\\d{16,19}$")) {
							GHutils.showError(e.msg + '格式不正确', tips);
							result = false;
						}
					} else if(e.positiveInteger) {
						if(!dom.val().match("^[0-9]+\\d*$")) {
							GHutils.showError(e.msg + '格式不正确', tips);
							result = false;
						}
					} else if(e.positiveNumber) {
						if(!dom.val().match("^[0-9]+\.?[0-9]*$")) {
							GHutils.showError(e.msg + '格式不正确', tips);
							result = false;
						}
					} else if(e.floatNum) {
						if(!dom.val().match("^(([1-9]\\d*)|0)(\.\\d{0,2})?$")) {
							GHutils.showError(e.msg + '格式不正确', tips);
							result = false;
						}
					} else if(e.nickName) {
						if(!dom.val().match("^[\u4E00-\u9FA5A-Za-z0-9_]{2,15}$")) {
							GHutils.showError(e.msg + '格式不正确', tips);
							result = false;
						}
					} else if(e.invitationNum) {
						if(!dom.val().match("^[A-Za-z0-9]{7}$")) {
							GHutils.showError(e.msg + '格式不正确', tips);
							result = false;
						}
					} else if(e.realName) {
						if(!dom.val().match("^[\u4E00-\u9FA5A-Za-z0-9_·]{1,20}$")) {
							GHutils.showError(e.msg + '格式不正确', tips);
							result = false;
						}
					}

				}
			}
		});
		return result;
	},

	//判断是否登录，未登录跳转登录页面，已登录返回登录信息
	/*参数示例
	 *op = {
	 *	gologin:"true",string类型，默认是"true";
	 *	goback:url,string类型，默认是当前地址，用于登录返回
	 *	callback:function(){}
	 *	errcallback:function(){}
	 *}
	 */
	GHutils.getUserInfo = function(op) {
		var info = null;
		op = op ? op : {};
		var gologin = op.gologin || "false";
		var warn = op.warn || "false";
		var goback = op.goback || window.location.href;
		var goTime = op.times || 3000;
		var loginstate = true;
		var txt = '';
		GHutils.load({
			url: GHutils.API.ACCOUNT.userinfo,
			type: "post",
			async: false,
			callback: function(result) {
				if(result.errorCode == 0) {
					if(result.islogin) {
						info = result;
						if(op.callback && typeof(op.callback) == 'function') {
							op.callback.apply(null, arguments);
						}
					} else {
						loginstate = false;
						txt = '未登录或登录已超时，请先登录。';
						//退出登录
						GHutils.loginOut();
					}
				} else {
					loginstate = false;
					txt = result.errorMessage;
					if(op.errcallback && typeof(op.errcallback) == 'function') {
						op.errcallback.apply(null, arguments);
					}
				}
				if(!loginstate) {
					if(warn == "true") {
						GHutils.showError(txt)
					}
					if(gologin == "true") {
						setTimeout(function() {
							window.location.href = 'login.html?link=' + goback;
						}, goTime);
					}
				}
			}
		});
		return info;
	}
	
/**
 * 购买新手产品时判断用户是否为新手用户
 */
//GHutils.isFreshman = function() {
//	var freshman = false
//	GHutils.load({
//		url: GHutils.API.ACCOUNT.usermoneyinfo,
//		type: "post",
//		async: false,
//		callback: function(result) {
//			if(GHutils.checkErrorCode(result)) {
//				if(result.isFreshman && result.isFreshman == 'yes') {
//					freshman = true
//				} else {
//					GHutils.warn('非新手用户不可购买新手产品')
//				}
//			}
//		}
//	});
//	return freshman
//}

/**
 * 判断是否为数组
 * @param {Object} obj
 */
GHutils.isArray = function(obj) {
	if(!obj) {
		return false;
	}
	return Object.prototype.toString.call(obj) == "[object Array]";
}


/**
 * 获取图形码
 * @param {Object} obj
 */
GHutils.changeVCode1 = function(obj) {
	$(obj).attr('src', '/app/common/verifyImage.jsp?Rand=' + Math.random() * 10000);
}

//获取本地存储数据
var GHLocalStorage = {
	put: function(key, value) {
		if(!key) {
			return;
		}
		if(typeof(value) == "object") {
			localStorage.setItem(key, JSON.stringify(value));
		} else {
			localStorage.setItem(key, value);
		}
	},
	get: function(key) {
		return JSON.parse(localStorage.getItem(key));
	},
	getRaw: function(key) {
		return localStorage.getItem(key) || null;
	},
	remove: function(key) {
		localStorage.removeItem(key);
	},
	clear: function() {
		localStorage.clear();
	}
};


/**
 * 判断产品是否为某种标签产品
 * @param {Object} labelList 标签数组
 * @param {Object} labelCode 标签labelCode
 */
GHutils.label = function(labelList, labelCode) {
	var isFlag = false;
	if(labelList && labelList.length > 0) {
		isFlag = GHutils.forEach(labelList, function(idx, label) {
			if(label.labelCode == labelCode) {
				return true;
			}
		})
	}
	return isFlag;
}

/**
 * 渲染标签集合
 * @param {Object} labelList 标签集合
 */
GHutils.parseLabel = function(labelList) {
//	var labelCode = {
//		'1': true,
//		'2': true,
//		'3': true,
//		'4': true,
//		'5': true,
//		'6': true,
//		'7': true,
//		'8': true,
//		'baopin': true,
//		'010': 'true'
//	}
	var labels = {
		"extend": [],
		"general": [],
		"freshman":[]
	}
	for(var i in labelList) {
		var label = labelList[i]
		var type = label.labelType;
		if(type == "extend") { //扩展标签
			labels.extend.push(label.labelName)
		}
//		if(type == "general" && labelCode[label.labelCode]) { //基础标签
		if(type == "general") { //基础标签
			if(label.labelCode == "1"){
				labels.freshman.push(label.labelName)
			}else{
				labels.general.push(label.labelName)
			}
		}
	}
	if(labels.extend.length == 0) labels.extend = null;
	if(labels.general.length == 0) labels.general = null;
	if(labels.freshman.length == 0) labels.freshman = null;
	return labels;
}


/**
 * 绑定回车键,触发相应的事件
 */
GHutils.inputBindKey = function() {
	$(".inputBindKey").off().on("keyup", function(e) {
		if(e.keyCode == 13) {
			if($(this).val() == '') {
				return
			}
			var trigger = $(this).attr("data-trigger");
			if(trigger) {
				$(trigger).trigger("click");
			}
		}
	})
}

/*
 * set cookie
 * @params : cookie name, value, time
 */
GHutils.setCookie = function(c_name, value, expiredays) {
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + expiredays);
	document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ';path=/';
}
/**
 * 获取cookie
 * @param {Object} name 
 */
GHutils.getCookie = function(name) {
	var str = "; " + document.cookie + "; ",
		index = str.indexOf("; " + name + "=");
	if(index != -1) {
		var tempStr = str.substring(index + name.length + 3, str.length),
			target = tempStr.substring(0, tempStr.indexOf("; "));

		return decodeURIComponent(target);
	}
	return null;
}

/**
 * 退出登录
 * @param {Object} reload  true刷新当前页面
 * @param {Object} callback 回调方法
 */
GHutils.loginOut = function(reload, callback) {
	GHutils.load({
		url: GHutils.API.USER.doLogout,
		data: {},
		type: "post",
		callback: function(result) {
			if(reload) {
				window.location.reload();
			}
			if(callback && typeof(callback) == "function") callback.apply(null, arguments);

		}
	})
}
/**
 * 切换显示
 * @param {Object} hide 要隐藏的元素
 * @param {Object} show 要显示的元素
 */
GHutils.boxSwitch = function(hide, show) {

	if(hide) {
		$(hide).hide();
	}
	if(show) {
		$(show).fadeIn(300)
	}

}
/**
 * 判断用户是否在登陆状态
 * @param {Object} successCallback 在登录状态时回调方法
 * @param {Object} failCallback	      不在登录状态时回调方法
 */
GHutils.isLogin = function(successCallback, failCallback) {
	GHutils.load({
		url: GHutils.API.USER.isLogin,
		data: {},
		type: "post",
		callback: function(result) {
			if(result.errorCode != 0) {
				return false;
			}
			if(result.islogin) {
				if(successCallback && typeof(successCallback) == "function") {
					successCallback()
				}
			} else {
				if(failCallback && typeof(failCallback) == "function") {
					failCallback()
				} else {
					if(successCallback) {
						if($("#showLogin").length) {
							$("#showLogin").trigger('click')
							return
						}
					}
					window.location.href="login.html";

				}
			}

		}
	})
}

GHutils._href = ''
GHutils.getHrefLinkPage = function(toPage) {
	GHutils.getParamHref();
	var _href = window.location.href
	var _link = GHutils._href
	if((_href.indexOf("login.html") + 1) || (_href.indexOf("register.html") + 1)) {
		if((_link.indexOf("login.html") + 1) || (_link.indexOf("register.html") + 1)) {
			_link = "";
		}
	}
	_link = _link ? "?link=" + _link : _link
	window.location.href = toPage + _link
}

/**
 * 
 */
GHutils.getParamHref = function() {
	if(GHutils._href) return
	var _href = window.location.href
	if(_href.indexOf("find-pwd.html") > -1){
		_href = "";
	}
	var urlParam = GHutils.parseUrlParam(_href)
	if(urlParam.link) { //登陆/或注册页
		var _link = urlParam.link;
		urlParam.link = ""
		if(_link.indexOf("?") > -1) _link += GHutils.parseParam(urlParam).replace("?", "&")
		var reg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
//		if(_link && reg.test(_link)){_href = _link}
		if(_link && reg.test("http://114.215.133.84/pages/account-tradelist.html")) {
			_href = _link
		}
	}
	GHutils._href = _href;
}

/**
 * Tab页签切换
 */
GHutils.smipleTab = function() {
	$(".tab_nav").off().on("click", function() {
		var idx = $(this).index();
		//判断是否为当前页签
		if($(this).hasClass("active")) {
			return
		}

		$(this).addClass("active").siblings(".tab_nav").removeClass("active");
		$(".tab_content_box").hide().eq(idx).fadeIn(300);
	})
}
/**
 * 获取地址栏hash值
 */
GHutils.getHash = function() {
	var hash = '';

	if(location.hash.indexOf('?') >= 0) {
		hash = location.hash.substring(1, location.hash.indexOf('?'))
	} else {
		hash = location.hash.substr(1)
	}
	return hash;
}

/**
 * 改变地址栏hash值
 * @param {Object} controls hash值
 */
GHutils.changeHash = function(controls) {
	location.hash = controls;
}

/**
 * 根据配置code查询指定的操作是否允许或相关数据限制
 *或根据配置phone查询置顶的用户是否被限制
 * @param {Object} code
 * @param {Object} phone
 * @param {Object} func
 */
GHutils.checkEnable = function(code, phone, func) {
	var urlParam = '?code=' + code
	if(phone) {
		urlParam += '&phone=' + phone
	}

	GHutils.load({
		url: GHutils.API.ACCOUNT.checkEnable + urlParam,
		data: {},
		type: "post",
		callback: function(result) {
			if(result.errorCode != 0) {
				return false;
			}
			if(typeof(func) == 'function') {
				if(result.type == 'configure') {
					func(result.content)
				} else {
					func(result.status)
				}
			}
		},
		errcallback: function() {
			$('.submiting').removeClass("submiting")
		}
	})
}
/**
 * str.trim()方法ie8不兼容解决方案
 * @param {Object} str
 */
GHutils.trim = function(str) {
	str == null ? str = '' : str += ''
	if(typeof(str) == 'undefined') str = ''
	return str.replace(/^\s+|\s+$/g, '')
}

/**
 * .forEach方法不兼容解决方案
 * @param {Object} list 要遍历的集合
 * @param {Object} func 回调方法
 */
GHutils.forEach = function(list, func) {
	if(!(list instanceof Array)) return
	if(list.length == 0) return
	var rlt = false;
	var len = list.length;
	for(var i = 0; i < len; i++) {
		if(func(i, list[i])) {
			i = len
			rlt = true
		}
	}
	return rlt;

}

/**获取银行卡单笔限额/背景颜色/图片等信息
 * 
 * @param {Object} bankName
 * @param {Object} bankList
 * @param {Object} func
 */
GHutils.getBankStyle = function(bankName,bankList,tips, func) {
	var codes="";
	GHutils.forEach(bankList,function(idx,bank){
		if(bank.bankName == bankName){
			codes=encodeURIComponent('["' + bank.bankCode + '"]');
		}
	});
	if(codes){
		GHutils.load({
			url: GHutils.API.ACCOUNT.getBankStyle + '?codes=' + codes,
			data: {},
			type: "post",
			callback: function(result) {
				if(GHutils.checkErrorCode(result, tips)){
					if(func && typeof(func) == "function") {
						func(result)
					}
				}
			}
		})
	}else{
		//不支持该银行
		
	}
}

/**
 * 封装mustcache 渲染dom
 *  	依赖 mustcache jquery
 * @param {Object} template  mustcache模板元素选择器
 * @param {Object} target    被渲染元素选择器
 * @param {Object} data      渲染数据
 * @param {Object} isAppend  true  渲染结果append  false 渲染结果html
 */
GHutils.mustcache = function(template, target, data,isAppend) {
	var _html = Mustache.to_html($(template).html(), data)
	_html = _html.replace(/\t/g,"").replace(/\r/g,"").replace(/\n/g,"")
	if(isAppend){
		$(target).append(_html)
	}else{
		$(target).html(_html)
	}
	
}

/**
 * 封装mustcache 渲染string
 * 		依赖 mustcache jquery
 * @param {Object} templateStr 	mustcache模板string
 * @param {Object} target		被渲染元素选择器
 * @param {Object} data			渲染数据
 */
GHutils.mustcacheStr = function(templateStr, target, data) {
	var _html = Mustache.to_html(templateStr, data)
	$(target).html(_html)
}

/**
 * 自定义table插件,根据columnDefine取数据填充到table中  
 * 		依赖 mustcache jquery
 * @param {Object} table     	要填充的table元素
 * @param {Object} columnDefine 列字段定义
 * @param {Object} data			填充数据
 * @param {Object} noRecord		无数据图标元素
 * @param {Object} nilStr       值为空的的替换字符串 
 */
GHutils.table = function(table, columnDefine, data, noRecord, nilStr) { //column ={idx clazz   format name}
	var str = ""
	var tdTemplate = '<td class="{{clazz}}">{{value}}</td>'
	GHutils.forEach(data, function(idx, trData) {
		str += '<tr class="gh_tr_w_h gh_tr_coor ">'
		GHutils.forEach(columnDefine, function(i, column) {
			var format = column.format
			var _val = trData[column.name]
			if(format && typeof(format) == "function") {
				_val = format.apply(trData, [idx])
			}
			if(column.idx) {
				_val = idx + 1
			}
			if(nilStr && _val == "") {
				_val = nilStr
			}
			column["value"] = _val
			str += Mustache.to_html(tdTemplate, column)
		})
		str += '</tr>'
	})
	if(str) {
		//字符转义
		str = str.replace(/&quot;/g, '"')
			.replace(/&#x3D;/g, '=')
			.replace(/&gt;/g, '>')
			.replace(/&lt;/g, '<')
			.replace(/&#x2F;/g, '/')
			if(noRecord){
				$(noRecord).hide()
			}
	} else {
		if(noRecord){
			$(noRecord).show()
		}
	}
	$(table).find("tbody").html(str)
}

/**
 * 交易密码 输入效果
 * @param {Object} selector 输入框元素
 */
GHutils.inputPwd = function(selector) {
	$(selector).next().find('li').find('div').html("")
	$(selector).keyup(function() {
		var _val = $(this).val();
		var re = /^\d{0,6}$/g;
		$(this).val(_val.match(re));
		var _ul = $(this).next();
		var parent = $(this).parent()
		_len = _val.match(re) ? _val.length : 0;
		for(var i = 0; i < 6; i++) {
			if(i < _len) {
				_ul.find("li").eq(i).find("div").html("●");
			} else {
				_ul.find("li").eq(i).find("div").html("");
			}
		}
		if(_val.length == 6) {
			$(this).blur();
		} else {
			return
		}
	}).on('focus', function() {
		$(this).next().addClass("gh_onfocus")
	}).on('blur', function() {
		$(this).next().removeClass("gh_onfocus")
	}).on("paste",function(e){//禁止粘贴
		e.preventDefault();
	}).on("contextmenu",function(e){//禁止鼠标右键弹出操作选项列表
		e.preventDefault();
	})
}

/**
 * 协议前面checkbox的选中/取消动作
 * @param {Object} selector 
 */
GHutils.protocolCheck = function(selector) {
	$(selector).off().on('click', function() {
		if($(this).hasClass('active')) {
			$(this).removeClass("active")
		} else {
			$(this).addClass("active")
		}
	})
}

/**
 * 将参数拼接成 ?a=1&b=2的形式
 * @param {Object} param 参数集合,json格式
 */
GHutils.parseParam = function(param) {
	var urlParam = ''
	for(var key in param) {
		if(!param[key] == '') {
			var value = param[key];
			//console.info(value.toString())
			if(value.toString().indexOf(',') > -1) {
				GHutils.forEach(value.split(','), function(idx, type) {
					urlParam += '&' + key + '=' + type
				})
			} else {
				urlParam += '&' + key + '=' + param[key]
			}
		}
	}
	if(urlParam.indexOf("&") > -1) {
		urlParam = '?' + urlParam.substring(1)
	}
	return urlParam;
}

/**
 * 
 * 发送短信验证码
 * @param {Object} userPhone 电话号码()
 * @param {Object} dom 短信验证码按钮元素对象
 * @param {Object} tips 错误提示元素对象
 * @param {Object} smsType 短信smsType 
 * @param {Object} isHotline 是否获取热线电话
 */
GHutils.sendvc = function(userPhone, dom, tips, smsType, isHotline) {
	var btntime = null;
	if(isHotline) {
		GHutils.getHotLine(function(hotline){
			var _values = ["", "2",hotline]
			sendVc(_values);
		});
	} else {
		var _values = ["", "2"]
		sendVc(_values);
	}

	function sendVc(_values) {
		GHutils.load({
			url: GHutils.API.USER.sendv,
			data: {
				phone: userPhone,
				smsType: (smsType || "normal"),
				values:_values
			},
			type: "post",
			async: false,
			callback: function(result) {
				if(GHutils.checkErrorCode(result, tips)) {
					btntime = GHutils.btnTime(dom);
				}
			},
			errcallback: function() {
				if(btntime) {
					GHutils.clearBtnTime(btntime, dom);
				}
			}
		});
	}

	return btntime;

}

/**
 * 校验短信验证码,若正确则触发回调方法
 * @param {Object} userPhone 手机号
 * @param {Object} veriCode  短信验证码
 * @param {Object} tips      错误提示元素对象
 * @param {Object} callback  回调方法
 * @param {Object} smsType   短信类型
 */
GHutils.checkvc = function(userPhone, veriCode, tips, callback, smsType) {
	GHutils.load({
		url: GHutils.API.USER.verify,
		data: {
			phone: userPhone,
			veriCode: veriCode,
			smsType: (smsType || "normal")
		},
		type: "post",
		async: false,
		callback: function(result) {
			if(GHutils.checkErrorCode(result, tips)) {
				if(callback && typeof(callback) == "function") {
					callback.apply(null, arguments)
				}
			}
		}
	});
}

/**
 * 转化风险等级为文字描述和图片
 * @param {Object} riskLevel 风险等级
 */
GHutils.parseRiskLevel = function(riskLevel){
	var riskLevels = {
		"R1":{"txt":"保守型","clazz":"conservative"},
		"R2":{"txt":"稳健型","clazz":"steady"},
		"R3":{"txt":"平衡型","clazz":"balance"},
		"R4":{"txt":"积极型","clazz":"positive"},
		"R5":{"txt":"进取型","clazz":"enterprising"}
		}
	var riskLevel = riskLevels[riskLevel]||{"txt":"保守型","clazz":"conservative"}
	return riskLevel
}

	/**
	 * 获取服务器时间
	 * @param {Object} cb 回调方法
	 */
GHutils.getSystime =  function(cb){
	$.ajax({
		type:"post",
		url: GHutils.API.PRODUCT.systime,
		async: false,
		contentType: 'application/x-www-form-urlencoded',
		success: function(result) {
			if(cb && typeof(cb) == "function"){
				cb.apply(null,[result])
			}
		},
		timeout: 20000,
		error: function(xhr, type, errorThrown) {
			alert("获取系统时间异常!")
		}
	})
}	

/**
 * ie8/9 input输入框叉叉兼容
 * @param {Object} selector
 * @param {Object} cb
 */
GHutils.IEInputClear = function(selector,cb){
	var dom = $(selector);
	var browser=navigator.appName 
	var trim_Version=(navigator.appVersion.split(";")[1] ||"").replace(/[ ]/g,""); 
	if((browser=="Netscape" || browser=="Microsoft Internet Explorer" ) && (trim_Version=="MSIE8.0" || trim_Version=="MSIE9.0")){
		dom.on('focus',function(){
			var _val = $(this).val()
			if(_val){
				$(this).next().show();
			}
		})
		.keyup(function(){
			var _val = $(this).val()
			if(_val){
				$(this).next().show();
			}
		})
		
		$(document).on('click',function(e){
			var _target = $(e.target)
			if(!_target.hasClass("clear-icon")  && (_target[0].id != dom[0].id)){
				dom.next().hide();
			}
		})
	}
	
	$(".clear-icon").on('click',function(){
		$(this).hide();
		dom.val('')
		if(cb && typeof(cb) == "function"){
			cb.apply(null,arguments)
		}
	})
	
}

//获取热线电话
GHutils.getHotLine = function(func,errcb){
	GHutils.load({
		url:GHutils.API.CMS.elementConfig+'?codes='+encodeURIComponent('["hotline"]'),
		type: "post",
		async:false,
		callback: function(result){
			if(result.errorCode == 0){
				GHutils.forEach(result.datas,function(idx,data){
					if(data.code == "hotline"){
						if(func && typeof(func)=="function"){
							func.apply(null,[data.content])
						}
					}
				})
			}else{
				if(errcb && typeof(errcb)=="function"){
					errcb.apply(null,arguments);
				}
			}
		},
		errcallback:function(){
			if(errcb && typeof(errcb)=="function"){
				errcb.apply(null,arguments);
			}
		}
	})
}

//校验表单是否允许提交
GHutils.checkFormSubmit = function(e,cb){
	var browser=navigator.appName 
	var trim_Version=(navigator.appVersion.split(";")[1]||"").replace(/[ ]/g,""); 
	if(browser=="Netscape"  || (browser=="Microsoft Internet Explorer" && (trim_Version=="MSIE8.0" || trim_Version=="MSIE9.0") ) ){ 
		$(e).keyup(function(){
			cb.apply(null,arguments)
		})
	}else{
		$(e).on("input", function(){
			cb.apply(null,arguments)
		})
	}
}


//返回代理地址
GHutils.filterProxyUrl = function(obj) {
	if(!obj) {
		return obj;
	}
	var index = obj.indexOf("/rcp-war");
	if(-1 == index)
		return obj;

	return obj.substring(index);
}
GHutils.tableToExcel = (function() {
	var uri = 'data:application/vnd.ms-excel;base64,',
		template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
		base64 = function(s) {
			return window.btoa(unescape(encodeURIComponent(s)))
		},
		format = function(s, c) {
			return s.replace(/{(\w+)}/g, function(m, p) {
				return c[p];
			})
		}
	return function(table, name) {
		if(!table.nodeType) table = document.getElementById(table)
		var ctx = {
			worksheet: name || 'Worksheet',
			table: table.innerHTML
		}
		window.location.href = uri + base64(format(template, ctx))
	}
})();

//统计代码
//$(function(){
//	var _hmt = _hmt || [];
//	(function() {
//	  var hm = document.createElement("script");
//	  hm.src = "https://hm.baidu.com/hm.js?d361836c2f08b7ed0f588fd60827a759";
//	  var s = document.getElementsByTagName("script")[0]; 
//	  s.parentNode.insertBefore(hm, s);
//	})();
//})
