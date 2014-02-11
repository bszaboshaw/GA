$("document").ready(function() {
	$("#slideshow").cycle( {
		fx:    'fade', 
    	speed:  2500 
	});

	// $("#slideshow").cycle( { 
 //    fx:      'scrollDown', 
 //    speed:    300
 //    timeout:  2000 

	// });

	// function Slider() {

	// 	$(".slider #1").show("fade", 500);
	// 	$(".slider #1").delay(2500).hide("slide", {direction: 'left'}, 500);

	// 	var sc = $(".slider img").size();
	// 	var count = 2;

	// 	setinterval(function() {
	// 		$(".slider #" + count).show("slide", {direction: 'right'}, 500);
	// 		$(".slider #" + count).delay(2500).hide("slide", {direction: 'left'}, 500);

	// 		if(count == sc) {
	// 			count = 1; 
	// 		} else {
	// 			count = count + 1;
	// 		}
	// 		}, 3500);
	
	// };

});
