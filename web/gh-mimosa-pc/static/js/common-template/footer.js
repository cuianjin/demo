define([],
	function() {
		return {
			name: 'footer',
			init: function() {
				this.pageInit()
			},
			pageInit: function() {
				var aqImg = $("#anquanBox").find("img");
				setTimeout(function() {
					$("#anquanImg").html(aqImg[0]).css({
						"width": aqImg.width(),
						"height": aqImg.height()
					})
				}, 1000);
				$('li[data-tab="problems"]').on("click",function(){
					var idx = $(this).index();
					$("#tab_nav").find("a").eq(idx).trigger('click');
				})
			}
		}
	})
