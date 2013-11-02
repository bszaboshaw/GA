// start off with a document.ready function.

$(document).ready(function(){
  
// write the “scrollToDiv” function that will surprisingly :) scroll to a 
// div of our selection. There are going to be 2 parameters – the element 
// to scroll to, and the height of the navigation at the top of the page  
    $('nav ul li a').click(function(){
    
        var el = $(this).attr('href');
        var elWrapped = $(el);
        
        scrollToDiv(elWrapped,50);
        
        return false;
    
    });
   // declare 3 variables that we need to be able to scroll accurately

   // The “offset” variable is the offset of the element, and the “offsetTop” variable 
   // uses the “offset” variable to withdraw the “top” value. As a result, we get the 
   // distance of an element from the top of the page. The “totalScroll” variable is how 
   // much the browser should scroll. Without a top navigation bar, the amount to scroll 
   // would just be the offset of an element. However, since we have a navigation bar that 
   // blocks the top 40px of the content from view, we have to edit the variable accordingly. 
   // This is what the “navheight” parameter is for.

    // The jQuery “animate” function can also animate the scrollTop of a page, which allows us 
    // to smoothly scroll to a desired spot on the page. Here, the animation takes 500 milliseconds.

    function scrollToDiv(element,navheight){ 
        var offset = element.offset();
        var offsetTop = offset.top;
        var totalScroll = offsetTop-navheight;
        
        $('body,html').animate({
                scrollTop: totalScroll
        }, 500);
    }
});
