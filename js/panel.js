
$(function () {
    
    //on beds24 panel config there should be the following config variables:
    if(    !panel_custom_settings 
        || !panel_custom_settings.allowed_users 
        || !panel_custom_settings.user 
        || !panel_custom_settings.filter
        ){
        return;
    }

    const filter = panel_custom_settings.filter;    

    //add a new containsi expression to filter case-insensitive
    $.expr[":"].containsi = $.expr.createPseudo(function (arg) {
        return function (elem) {
            return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
        };
    });

    //new jquery function to get text nodes
    jQuery.fn.textNodes = function () {
        return this.contents().filter(function () {
            return (this.nodeType === Node.TEXT_NODE && this.nodeValue.trim() !== "");
        });
    }

    //check if is an allowed user
    var allowed = panel_custom_settings.allowed_users.indexOf(panel_custom_settings.user)>=0;
    if(!allowed) return;
    

    //if allowed iterate over filtered bookings and replace contents with hover text
    $("#calendartableholder [data-bookid] div:containsi('" + filter + "')").each(function (index) {
        const bookElement = $(this).parent();
        const bookid = bookElement.attr("data-bookid");
        const element = $(this);

        //set the color to semitransparent
        var color = bookElement.css("background-color");
        color = color.replace("rgb", "rgba").replace(")", ",0.75)");
        bookElement.css("background-color", color);
        //hide the text on the booking
        bookElement.css("color", "rgba(0,0,0,0)");

        //get the hover text and replace it
        $.ajax({
            url: "/api/ajax/bookinghover.php?b=" + bookid,
            success: function (result) {
                element.textNodes().remove();
                element.find("br").remove();
                element.append("&nbsp;" + result);
                //show the text on the booking
                bookElement.css("color", "rgb(0,0,0)");
            }
        });
    });
});