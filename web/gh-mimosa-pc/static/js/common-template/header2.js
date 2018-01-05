define([],
function() {
  return {
  	name: 'header',
    init:function(){
      this.pageInit();
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
    bindEvent:function(){}
   
  }
})
