define([],
function() {
  return {
  	name: 'header',
    init:function(){
      this.pageInit();
      this.getUserInfo();
			this.bindEvent();
    },
    pageInit:function(){
      var _this = this;
     
     //服务器维护中禁止后续操作
     	var pageName = $("body").attr("id");
     	if( pageName == "repair"){
     		return
     	}
      var onnav = $("#header-box").attr("data-navname");
      if(onnav){      	
	      $("."+onnav).addClass("active");
      }
      
      
      var dom = $("#find-pwd")
      if(dom.length>0){
      	$("#header-title").html('找回密码')
      }
      $("#header-title").show()
    },
    getUserInfo:function(){
    	var _this = this;
    	GHutils.load({
				url: GHutils.API.ACCOUNT.userinfo,
				data: {},
				type: "post",
				callback: function(result) {
					GHutils.log(result,"用户信息===")
					if(result.errorCode != 0 || !result.islogin){
						$('#notLogin').hide();
						$('#loginStatus').show();
						return false;
					}
					GHutils.userinfo = result;
					var userAcc = result.userAcc.substring(0,3)+'****'+result.userAcc.substring(7,11)
					userAcc = result.name || userAcc
					$('#nickName').html(userAcc)
					$("#userAcc").html("你好！"+userAcc)
					_this.getMessageNoreadnum()
					$('#loginStatus').show();
					$('#notLogin').hide();
//					$["accoutTabNav"](result);
				}
			})
    },
    bindEvent:function(){
      var _this = this;
      
      	//点击登陆
			$('#toLogin').off().on('click',function(){
				GHutils.getHrefLinkPage("login.html")
			})
			
			//点击注册
			$('#toRegister').off().on('click',function(){
				GHutils.getHrefLinkPage("register.html")
			})

			//点击安全退出
      $('#loginOut').off().on('click',function(){
        GHutils.loginOut(null,function(){
        	if($("body").hasClass("login_tip")){
        		window.location.href="index.html"
        	}else{
        		window.location.reload();
        	}
        });
      })
      
			_this.mouseOverEvent("#real-name-icon");
			_this.mouseOverEvent("#bk-card-icon");
			_this.mouseOverEvent("#user-safe-icon");
			_this.mouseOverEvent("#user-word-icon");

   },
   mouseOverEvent:function(parent){
   		function $$(selector){
   			return $(parent).find(selector)
   		}
   		$$("a").eq(0).on("mouseover",function(){
	   			$(".user-icons-tip").addClass("none")
	   			$(this).next().removeClass("none")
	   	})
	   	$('.user-icons-tip').on("mouseleave",function(){
	   		$(".user-icons-tip").addClass("none")
	   	})
	   	
	   	$(document).on('click',function(){
	   		$(".user-icons-tip").addClass("none")
	   	})
   },
  getMessageNoreadnum:function(){//获取未读站内信数量
  	GHutils.load({
  		url:GHutils.API.CMS.messageNoreadnum,
  		type:'post',
  		callback:function(data){
//			GHutils.log(data,"数量===")
  			$('#messaageCtrl').html("("+(data.num || 0)+")")
  		}
  	})
  }
   
  }
})
