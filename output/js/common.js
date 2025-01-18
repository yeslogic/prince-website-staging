
$(document).ready(function(){

	//Home - menu	
	$(window).bind('scroll', function(){
		var addmenu = $(window).height();
		if ($(window).scrollTop() > addmenu){
			$('#home .header-container').removeClass('hidden');
		} else {
			$('#home .header-container').addClass('hidden');
		}
	});
	
	//submenu
    if($(window).width() < 750){
        var lastScrollTop = 0;
        $(window).scroll(function(event){
           var st = $(this).scrollTop();
           if (st > lastScrollTop){
               // downscroll code
               $(".subheader-container").addClass("hide-onscroll");
           } else {
              // upscroll code
              $(".subheader-container").removeClass("hide-onscroll");
           }
            lastScrollTop = st;
        });
    };
	
	//mobile menu trigger
	$(".mobile-menu-trigger img").click(function(){
		$(".menu ul").toggleClass("show-mobile-menu");
		if ($(window).scrollTop() < 900){
			$(".header-container").addClass("hidden").css("margin-top", "");
		}
	});
	
	$(".banner .mobile-menu-trigger img").click (function(){
		$(".header-container").removeClass("hidden").css("margin-top", "0px");
	});
	
	//home-banner
        /*
	if(!(/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera)){
		skrollr.init({
			smoothScrolling: false,
			forceHeight: false
		});
		
		function updateContainer(){
			
			var screenheight = $(window).height();
			//var bannerheight = screenheight * 0.85;
			
			if(screenheight < 800){
				$("#home-banner .banner-content-container").attr("id", "small");
				$("#home-banner.banner-container").css("height", "620px");
			} else {
				$("#home-banner .banner-content-container").attr("id", "");
				$("#home-banner.banner-container").css("height", $(window).height()*0.85 );
			}
			
			//$("#home-banner.banner-container").css("height", bannerheight);
		}
		updateContainer();
		$(window).resize(function() {
			updateContainer();
		});
	};
        */
});
