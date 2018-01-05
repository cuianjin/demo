define([],
function() {
  return {
  	name: 'custom-service',
    init:function(){

    	var FUN = (function() {
				
        return {
						init:function(){
				      this.pageInit();
				      this.bindEvent();
						},
				    pageInit:function(){
							var _this = FUN;
				    },
				    
				    
						bindEvent:function(){
				      var _this = FUN;

				    	//返回顶部
				    	$("#sidebarTop").off().on("click",function(){
				    		
				    		$('html, body').stop().animate({'scrollTop':'0px'},300);
						
				    	})
				    	//客服相关
				    	BizQQWPA.addCustom({aty: '0', a: '0', nameAccount: 4008738677, selector: 'BizQQWPA'}); 
				      
				    }   
        };
        
    	})();
    	
    	$(function () {
//		    FUN.init();   
			});
    	
    }

  }
})