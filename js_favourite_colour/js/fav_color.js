$(


  function(event) {
  	//Start to type below here. Make sure not to delete any "{}" braces. 

var user_color = prompt("What is your favourite colour?");
console.log(user_color);
if (
	( user_color ==="blue") ||
	( user_color ==="red") ||
	( user_color ==="yellow") ||
	( user_color ==="green")
) {
	$('body').css('background-color', user_color);
} else {
	$('h2').text("Sorry, we don't have that colour");
	$('h2').css('color', 'red');
	$('h2').css('font-size', '22px');
	}
}
);





