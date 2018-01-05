(function() {
  var TEMP =  (function(){
      return {
        init:function(){
          var _this = this;
		        // requirejs.config({
		        //   baseUrl: 'static/js',
		        //   paths: {
		        //     page: '/'
		        //   }
		        // })
		        _this.times = 1;
		        _this.hotLine="";
		        _this.getHotLines();
//		        //requirejs([], function() {
		        	 	_this.loadTemplates($('body'));	
		        //})
        },
        loadTemplates: function(dom){
        	var _this = this;
        	_this.hotlineReplace();
          var doms = dom.find('[template-href]');
          
          doms.each(function(index, item){
            var templateHref = $(item).attr('template-href');
            var onlyJs = $(item).attr('template-onlyJs');
            if(onlyJs){
            	 _this.loadTemplateJs(templateHref,"href")
            }else{
            	$(item).load('common-template/' + templateHref + '.html', function (e) {
	            	this.innerHTML = e;
	            	_this.hotlineReplace();
	            	_this.loadTemplates($(this));
	              _this.loadTemplateJs(templateHref,"function")
	            })
            }
          })
        },
        loadTemplateJs:function(templateHref,eventType){
        	var fnlist = ['./static/js/common-template/' + templateHref];
          requirejs(fnlist, function () {
		        for (var key in arguments) {
		          if (arguments[key] != undefined && arguments[key].name != undefined) {
		              arguments[key].init(eventType);
		          }
		        }
          })
        },
        getHotLines:function(){
        	var _this = this;
        	GHutils.getHotLine(function(hotline){
		        	_this.hotLine = hotline;
		        	if(_this.hotLine){
		        		$(".hotline").html(_this.hotLine).parent().removeClass("gh_none")
		        	}
		        },function(){
		        		if(_this.times<3){
		        			_this.times++;
		        			_this.getHotLines();
		        		}else{
		        			$(".hotline").parent().addClass("gh_none")
		        			$(".hotlineReplace").removeClass("gh_none")
		        		}
		        		
		        });
        },
        hotlineReplace:function(){
        	var _this  = this;
        	if(_this.hotLine){
        		$(".hotline").html(_this.hotLine).parent().removeClass("gh_none")
        	}else if(_this.times>3){
        		$(".hotline").parent().addClass("gh_none")
	    			$(".hotlineReplace").removeClass("gh_none")
        	}
        }
      }
  })
  
  $(function() {
    new TEMP().init();
  });
})(jQuery);