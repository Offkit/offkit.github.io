$(document).ready(function(){
	console.log("offKit says hello to you, sailor!");

	// variables
	var $menu = $("#nav-offkit"),
		$menuBtn = $("#menu-btn"),
		$topBtn = $("#top-btn"),
		menuOpn = false,
		topHidden = true,
		noSvg = false,
		errorlog = false;

	//animate svg var
	var speed = 200,
		speedBack = 200,
        easing = mina.easeout;
       	s = Snap( "#shape-morph" ), 
       	path = s.select( 'path' ),
        pathConfig = {
            from : path.attr( 'd' ),
            to : "M0e-10,0 L100,0 L100,10 C70,80 30,80 -10e-10,10 C0e-10,10 0e-10,0 0e-10,0 Z"
        },
        pathConfigBack = {
            from : path.attr( 'd' ),
            to : "M0e-10,0 L100,0 L100,50 C50,0e-10 50,0 0,50 C10e-10,50 0e-10,0 0e-10,0 Z"
        };

    var sl = Snap( "#header-logo svg" ),
    	slCircle = sl.select("#offkit-circle circle"),
    	slBorder = sl.select("#offkit-circle path"),
    	slLetter = sl.select("#offkit-letter");
    $("#header-logo svg").on("mouseenter", function(){
    	slCircle.stop().animate({r : 34 }, 420, mina.elastic);
    	slBorder.stop().animate({fill : "whitesmoke" }, 200, easing);
    	slLetter.stop().animate({fill : "whitesmoke" }, 200, easing);
    })
    $("#header-logo svg").on("mouseout, mouseleave", function(){
    	slCircle.stop().animate({r : 0 }, 100, easing);
    	slBorder.stop().animate({fill : "black" }, 200, easing);
    	slLetter.stop().animate({fill : "black" }, 200, easing);
    })

	/*******************************
	 * INIT
	 *******************************/

	//if has sub navigation
	if($("#main-navigation").length != 0){
		var	$nav = $("#main-navigation"),
			$navLink = $("#main-navigation li a");
		var navTop = $("#main-section").offset().top - 18,
			st = 0,
			hasNav = true;
		var hookNav = [];

		function generateOffsets(){
			hookNav = [];
			$navLink.each(function(){
				hookNav.push(
					{
						hook: $(this).attr("href"),
						offset: $($(this).attr("href")).offset().top
					}
				);
			});

		}
		generateOffsets();

		$navLink.on("click", function(e){
			e.preventDefault();
			slideTo($(this).attr("href"));
		});
	}else{
		var hasNav = false;
	}

	if($(".internal").length != 0){
		$(".internal").on("click", function(e){
			e.preventDefault();
			slideTo($(this).attr("href"));
		});
	}
	//detect if inlinesvg
	if(!Modernizr.inlinesvg){
		$("#shape-morph").remove();
		noSvg = true;
		$menu.find("ul").css("padding", "0.85em 0 1.5em 0");
	}

	//hide main nav, show/hide backToTop btn
	//$menu.hide();
	st = $(window).scrollTop();
	if(st > 50 && topHidden == true){
			$topBtn.toggleClass("active");
			topHidden = false;
		}


	function checkSize(){
		if(hasNav === true){
			navTop = $("#main-section").offset().top -18;
		}
		generateOffsets();
	}

	$(window).resize(checkSize);

	//live search (if available)
	if($("#live-search").length != 0){
		$("#l-s-input").on("keyup blur", function(){
			var $this = $(this),
				value = $this.val()
				searching = false,
				count = 0;

			$("#l-s-find-next").unbind("click");
			$("#l-s-icon").text("…");

			//check if empty or only space
			if(value == "" || value.length <= 2 || value.match(/^\s*$/)){
				searching = false;
				$("#content").find(".l-s-highlight").contents().unwrap();
				$(".l-s-faded").removeClass("l-s-faded").fadeIn();
				$("#intro-text").fadeIn();
				$("#l-s-find-next").fadeOut();
				$nav.find("a").removeClass("l-s-striked");
				$("#l-s-icon").text("S");
				$("#l-s-icon").unbind("click");
			}else{
				searching = true;
				//there's somthing
				//get the regExp & hide the previous higlights
				var searchRE = new RegExp("("+value+"+(?![^<>]*>))", "igm"); 
				$("#content").find(".l-s-highlight").contents().unwrap();

				//for each article
				//if has the search term => add highlight
				//else hide the article
				$("#content article").each(function(){
					var lsid = $(this).attr("id");
					if($(this).html().search(searchRE) < 0){
						$(this).addClass("l-s-faded");
						$nav.find("a[href=#"+lsid+"]").addClass("l-s-striked");
					}else{
						var contentHtml = $(this).html();
						var newContent = contentHtml.replace(searchRE ,"<span class='l-s-highlight'>$1</span>");
						$(this).html(newContent);
						count++;
						if($(this).addClass("l-s-faded")){
							$(this).removeClass("l-s-faded").fadeIn();
							$nav.find("a[href=#"+lsid+"]").removeClass("l-s-striked");
						}
					}
				});

				var numberItems = count;
				//if search, successful =>
				if(numberItems > 0){
					var countdown = false;
					$("#intro-text").fadeOut();
					$(".l-s-faded").fadeOut();
					

					//get offsets top of each highlight;	
					var max_length = $(".l-s-highlight").length;
					$("#l-s-find-next").fadeIn(100);

					$("#l-s-find-next").bind("click",function(){
					    st = $(window).scrollTop();
					    count = -1;
					    //determine where we are and set the "count"
					    $(".l-s-highlight").each(function(){
					    	count++;
					    	if($(this).offset().top >= st+1){
					    		console.log("finished");
					    		return false;
					    	}
					    })

					    if(count == max_length || countdown == true)
					    	count=0;
					    if(count == max_length - 1)
					    	countdown = true
					    if(count == 0)
					    	countdown = false;

						$("html, body").animate({
							scrollTop: $($(".l-s-highlight")[count]).offset().top
						}, 200);
					});

					


					
				}else{
					//create error log if doesn't exist
					if(!errorlog == true){
						//create error log
						$errorlog = $('<div id="#l-s-error" class="error" style="display:none;">nothing was found</div>');
						//append error log 
						$("#live-search").append($errorlog);
						errorlog = true;
					}
					clearTimeout(toerror);
					//if stopped typing
					//fadeIn error log, add class="active" 
					// fade out remove class="active" after 3sec  (add this to the éif result)
					$errorlog.fadeIn(function(){
						toerror = setTimeout(function(){
									$errorlog.fadeOut();
								},2000);
					});

					$(".l-s-faded").removeClass("l-s-faded").fadeIn();
					$("#intro-text").fadeIn();
					$("#l-s-find-next").fadeOut();
					$nav.find("a").removeClass("l-s-striked");
					
				}
				
				$("#l-s-icon").text("X");
				$("#l-s-icon").bind("click", function(){
					$("#l-s-input").val("");
					$("#l-s-input").trigger("keyup");
				});

			}
		});
	}

	// menu
	$menuBtn.on("click", toggleMenu);

	function toggleMenu(e){
		if(menuOpn == false && noSvg == false){
			//document.getElementById("morph-anim").beginElement();
			//$("#morph-anim").attr("from","M0,0L100,0L100,10,C100 10, 0 10,0 10Z")
			//				.attr("to","M0,0L100,0L100,10,C100 10, 0 10,0 10Z")
			//				.attr("values","M0,0L100,0L100,10,C100 10, 0 10,0 10Z;M0,0L100,0L100,10,C98 18, 2 12,0 10Z;M0,0L100,0L100,10,C95 15, 5 15,0 10Z;M0,0L100,0L100,10,C90 20, 10 20,0 10Z;M0,0L100,0L100,10,C80 30, 20 30,0 10Z;M0,0L100,0L100,10,C70 40, 30 40,0 10Z;M0,0L100,0L100,10,C65 45, 35 45,0 10Z;M0,0L100,0L100,10,C60 50, 40 50,0 10Z;M0,0L100,0L100,10,C65 45, 35 45,0 10Z;M0,0L100,0L100,10,C70 40, 30 40,0 10Z;M0,0L100,0L100,10,C80 30, 20 30,0 10Z;M0,0L100,0L100,10,C90 20, 10 20,0 10Z;M0,0L100,0L100,10,C95 15, 5 15,0 10Z;M0,0L100,0L100,10,C98 18, 2 12,0 10Z;M0,0L100,0L100,10,C100 10, 0 10,0 10Z;");
                path.animate( { 'path' : pathConfig.to }, speed, easing, function(){
                	path.animate( { 'path' : pathConfig.from }, speedBack, easing );
                });
		}else if(menuOpn == true && noSvg == false){
			//document.getElementById("morph-anim").beginElement();
			//$("#morph-anim").attr("from","M0,0L100,0L100,20,C100 10, 0 10,0 20Z")
			//				.attr("to","M0,0L100,0L100,40,C65 0, 35 0,0 40Z")
			//				.attr("values","M0,0L100,0L100,10,C100 10, 0 10,0 10Z;M0,0L100,0L100,12,C98 9, 2 9,0 12Z;M0,0L100,0L100,16,C95 7, 5 7,0 16Z;M0,0L100,0L100,20,C90 5, 10 5,0 20Z;M0,0L100,0L100,26,C80 3, 20 3,0 26Z;M0,0L100,0L100,32,C70 1, 30 1,0 32Z;M0,0L100,0L100,40,C65 0, 35 0,0 40Z;M0,0L100,0L100,30,C65 0, 35 0,0 30Z;M0,0L100,0L100,20,C65 0, 35 0,0 20Z;M0,0L100,0L100,10,C65 0, 35 0,0 10Z;");
			path.animate( { 'path' : pathConfigBack.to }, speed, easing, function(){
                	path.animate( { 'path' : pathConfigBack.from }, speedBack, easing );
                });	
		}
		$menu.show().toggleClass("active");
		$menuBtn.toggleClass("active");
		$("#shape-morph").toggleClass("active");

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

	function slideTo(anchor){
		$("html, body").animate({
				scrollTop: $(anchor).offset().top
			}, 200)
	}

	$(window).on("scroll", scrolling);

	function scrolling(){
		st = $(window).scrollTop();
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
				//addaffix class if exist
				$nav.addClass("affixed");
			}else{
				$nav.removeClass("affixed");
			}
			
			//get scroll hook
			for ( var i=0; i<hookNav.length; i++ ) {
				if(st >= hookNav[i].offset - 10)
				{
					if(!$("#main-navigation li a[href='"+hookNav[i].hook+"']").hasClass("active")){
						$navLink.removeClass("active");
						$("#main-navigation li a[href='"+hookNav[i].hook+"']").addClass("active");
					}
				}
			}
		}
		
	}
});