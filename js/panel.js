
$(function () {
    
    //on beds24 panel config there should be the following extras variables:
    if (!booking_extras ||
        !booking_extras.users ||
        !booking_extras.filter 
        ){
        return;
    }

    const users = booking_extras.users;
    const filter = booking_extras.filter;    

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

    /*
    This goes over each icon and:
    - makes the background white, bigger and with rounded corners
    - looks for a color specification on the title and tints the icon
    - removes tha color specification from the icon title
    - If has "Cobrado: SI" in the title adds a dollar icon
    */
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
    //---------------CUSTOM REPORT VIEW WITH "SERVICIO" TITLE-------------------------------
    
    // if($("#title").val().indexOf("Servicio")>=0){

    //     $("#report2 th:contains('API Message')").text("Servicios");
    //     $("#report2 td:contains('" + booking_extras.constants.separator + "')").each(function (index) {
    //         var text = $(this).text();
    //         var service_data = JSON.parse(text.split(booking_extras.constants.separator)[1]);
    //         for (let i = 0; i < service_data.services.length; i++) {
    //             const service = service_data.services[i];
    //             console.log(service.name);            
    //         }
    //     });
    // }

    //--------------------BOOKING GRID VIEW-------------------------------

    //do the icons on the booking grid view
    $("#tabgrid [data-bookid] div i").each(fix_icons);
    //disable dragging of bookings on the grid view
    $("#tabgrid [data-bookid]").draggable('destroy');

    //--------------------CALENDAR VIEW-------------------------------

    //do the icon upgrade on the calendar view
    $("#calendartableholder [data-bookid] div i").each(fix_icons);

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