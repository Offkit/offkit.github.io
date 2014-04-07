$(document).ready(function(){

	// variables
	var $menu = $("#nav-offkit"),
		$menuBtn = $("#menu-btn"),
		$topBtn = $("#top-btn"),
		menuOpn = false,
		topHidden = true;

	if($("#main-navigation").lenght != 0){
		var	$nav = $("#main-navigation");
		var navTop = $("#main-section").offset().top - 18,
			st = 0,
			hasNav = true;
			console.log(
				"offset: "+navTop
				+"st: "+st
				+"has nav: "+hasNav
			)
	}else{
		var hasNav = false;
	}


	// init
	$menu.hide();
	st = $(window).scrollTop();
	if(st > 50 && topHidden == true){
			$topBtn.toggleClass("active");
			topHidden = false;
		}

	function checkSize(){
		if(hasNav === true){
			navTop = $("#main-section").offset().top -18;
		}
	}

	$(window).resize(checkSize);

	// menu
	$menuBtn.on("click", toggleMenu);

	function toggleMenu(e){
		$menu.slideToggle(120).addClass("active");
		$menuBtn.toggleClass("active");
		$("#shape-morph").toggleClass("active");
		if(menuOpn == false){
			$("#shape-morph").animate({
				top: 69
			},120);
			document.getElementById("morph-anim").beginElement();
		}else{
			$("#shape-morph").animate({
				top: -10
			},130);
			document.getElementById("morph-anim").beginElement();
		}
		menuOpn = !menuOpn;

		return false;
	}

	$topBtn.on("click", backToTop);

	function backToTop(e){
		e.preventDefault();
		$("html, body").animate({
			scrollTop: 0
		}, 200)
	}

	$(window).on("scroll", scrolling);

	function scrolling(){
		st = $(window).scrollTop();
		console.log(navTop);
		//if nav = open -> hide nav
		if(menuOpn == true){
			toggleMenu();
		}
		if(st > 50 && topHidden == true){
			$topBtn.toggleClass("active");
			topHidden = false;
		}else if(st <= 50 && topHidden == false){
			$topBtn.toggleClass("active");
			topHidden = true;
		}
		//affix internalNav if scrollTop > 150
		if(hasNav == true){
			if(st > navTop){ //AND HAS NOT AFFIX
				console.log("hum")
				//addaffix class if exist
				$nav.addClass("affixed");
			}else{
				$nav.removeClass("affixed");
			}
		}
		
	}
});