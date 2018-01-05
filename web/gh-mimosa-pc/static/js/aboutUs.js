var AboutUs=function(){
	return this;
}

AboutUs.prototype = {
	
	init:function(){
		this.bindEvent();
		this.pageInit();
		this.mapInit(0);
	},
	pageInit:function(){
		var _this= this;
		GHutils.smipleTab();
		var _tab = window.location.hash;
		setTimeout(function(){
			$("#about").find('a[data-tab = "' + _tab + '"]').trigger('click');
		},200)
	},
	bindEvent:function(){
		var _this= this;
		$.tab();
		$('#mapTab li').on('click',function(){
			var _index = $(this).index();

			_this.mapInit(_index);
		});
		
		$(".nav_title a").on("click",function(){
			var boxname = $(this).attr("data-tab");
			var topside = $("#"+ boxname).offset().top;
			
			$("body,html").animate({
				scrollTop:topside
			},300);
			
			setTimeout(function(){
				window.location.hash  = boxname
			},350)
		})
		
	},
	mapInit:function(_idx){
		var pointarry = [{x:121.520757,y:31.244275},{x:116.519318,y:39.917356}]
        var map = new BMap.Map("mapbox_view",{enableMapClick:false});
        var point = new BMap.Point(pointarry[_idx].x,pointarry[_idx].y);
        map.centerAndZoom(point, 18);
        var marker = new BMap.Marker(point);  // 创建标注
        map.addOverlay(marker);               // 将标注添加到地图中
        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
	}
	
	
}

$(function(){
	new AboutUs().init();
})
