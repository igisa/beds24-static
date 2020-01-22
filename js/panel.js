
$(function () {
    
    //on beds24 panel config there should be the following config variables:
    if(    !panel_custom_settings 
        || !panel_custom_settings.users 
        || !panel_custom_settings.filter
        ){
        return;
    }

    const users = panel_custom_settings.users;
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

    function fix_icons(index) {
        const iconElement = $(this);
        iconElement.css("background-color", "#ffffff");
        iconElement.css("padding", "3px");
        iconElement.css("border-radius", "4px");

        var text = iconElement.attr("title");

        if (text && text.startsWith("#")) {
            var split = text.split(" ");
            if (split[0]) {
                var color = split[0];
                iconElement.css("color", `${color}`);
                iconElement.attr("title", text.substr(split[0].length, text.length - split[0].length));
            }
        }

        const iconParent = $(this).parent();
        iconParent.css("margin-left", "5px");
        iconParent.css("margin-right", "5px");

        if (text && text.indexOf("Cobrado: Si") >= 0) {
            var moneyIcon = $(`
                <i class = "fas fa-dollar-sign" style = "font-size: 80%; color: #45ab45; margin-left: 3px;"></i>
            `);
            iconElement.append(moneyIcon);
        }
    }

    $("#calendartableholder [data-bookid] div i").each(fix_icons);
    $("#tabgrid [data-bookid] div i").each(fix_icons);

    //check if is a valid user for booking text-tooltip replacement
    var allowed = false;
    for (let i = 0; i < users.length; i++) {
        const name = users[i];
        if ($("span.hide_helplink:containsi('" + name + "')").length > 0) {
            allowed = true;
            break;
        }
    }
    //if allowed iterate over filtered bookings and replace contents with hover text
    if (allowed) {
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
    }
});