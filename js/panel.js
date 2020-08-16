
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
        var icons = $(this).find("i");

        for (var i = icons.length - 1; i >= 0; i--) {
             var iconElement = $(icons[i]);
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
    }
    //---------------CUSTOM REPORT VIEW WITH "SERVICIO" TITLE-------------------------------
    
    var title = $("#title");
    if (title && title.val() && title.val().indexOf("Servicio") >= 0) {

        var fields = ["fullname", "date", "name", "status", "_charged", "_cost", "seller", "_commission", "_net"]
        var numeric_fields={            
            _net: {
                header: "Neto",
                getter: function (service) {
                    var value = 0;
                    if (service.payed == "yes"){
                        var cost = parseFloat(booking_extras.methods.get_price_value(service, "cost"));   
                        var commission = parseFloat(service.commission);
                        var charged = parseFloat(service.price);
                        value = charged - cost - commission;
                    }                    
                    return parseFloat(value);
                }
            },
            _cost: {
                header: "Costo",
                getter: function (service) {
                    var value = 0;
                    if (service.payed == "yes") {
                        var value = booking_extras.methods.get_price_value(service, "cost");
                    }
                    return parseFloat(value);
                }
            },
            _commission:{
                header: "Comisión",
                getter: function(service){
                    var value = 0;
                    if (service.payed == "yes") value = parseFloat(service.commission);
                    return parseFloat(value);
                }
            },
            _charged:{
                header: "Cobrado",
                getter: function (service) {
                    var value = 0;
                    if (service.payed == "yes") value = service.price;
                    return parseFloat(value);
                }
            }
        }
        

        $("#report2 thead tr").empty()
        var headers = $("#report2 thead tr");
        for (let f = 0; f < fields.length; f++) {
            const field = fields[f];
            headers.append(`<th>${booking_extras.fields[field]?booking_extras.fields[field].label:numeric_fields[field].header}</th>`)
        }

        var aggregates = {};

        var all_rows = $("#report2 td:contains('" + booking_extras.constants.separator + "')");
        all_rows.each(function (index) {
            var text = $(this).text();
            var service_data = JSON.parse(text.split(booking_extras.constants.separator)[1]);
            //remove if empty
            if (service_data.services.length == 0) $(this).parent().remove();

            //remove row data         
            var row = $(this).parent();
            row.empty();

            for (let i = 0; i < service_data.services.length; i++) {
                const service = service_data.services[i];

                var current_row = row;
                if(i>0) current_row = row.clone().empty().insertAfter(row);
                
                
                for (let f = 0; f < fields.length; f++) {
                    const field = fields[f];   
                    var value = "";
                    var style = "";

                    if(service[field]){
                        value = booking_extras.methods.get_service_field_pretty_value(service, field);
                    }
                    else{
                        value = numeric_fields[field].getter(service);

                        //aggregate all numeric fields
                        if (field === "_commission"){
                            if (!aggregates[field]) aggregates[field] = {};
                            var seller = service.seller;
                            if (!aggregates[field][seller]) aggregates[field][seller] = 0;
                            aggregates[field][seller] += value;
                        }
                        else{
                            if (!aggregates[field]) aggregates[field] = 0;
                            aggregates[field] += value;
                        }

                        value = `${value.toFixed(2)} cuc`
                        
                    } 

                    //see if is option and has a color
                    var color = "000000"
                    if (booking_extras.fields[field] && booking_extras.fields[field].type === "options") {
                        for (let o = 0; o < booking_extras.fields[field].options.length; o++) {
                            const option = booking_extras.fields[field].options[o];
                            if (option.id === service[field] && option.logo_color) {
                                color = option.logo_color
                                break;
                            }
                        }
                    }
                    if (field == "status") {
                        var rgbaCol = 'rgba(' + parseInt(color.slice(-6, -4), 16) +
                            ',' + parseInt(color.slice(-4, -2), 16) +
                            ',' + parseInt(color.slice(-2), 16) +
                            ',0.2)';
                        current_row.css("background-color", rgbaCol);
                    }
                    current_row.append(`<td style="color: #${color}; ${style}">${value}</td>`);
                    
                    
                }
            }            
        });

        var totals_row = $('<tr class="tooltipbook" style="background-color: rgba(252, 255, 59, 0.31);"> </tr>');

        for (let f = 0; f < fields.length; f++) {
            const field = fields[f];
            var value = "";
            //if is a value to be aggregated
            if (aggregates[field]) {
                if (field === "_commission") {
                    for (const seller in aggregates[field]) {
                        if (aggregates[field].hasOwnProperty(seller)) {
                            const commission = aggregates[field][seller];
                            var name = booking_extras.methods.get_service_field_pretty_value({seller: seller}, "seller");
                            value += `${name}: ${commission.toFixed(2)} cuc<br>`
                        }
                    }
                } else {                   
                    value = `${aggregates[field].toFixed(2)} cuc`
                }
            }
            totals_row.append(`<td style="font-weight: bold; vertical-align: middle;">${value}</td>`);
        }

        $("#report2 tbody").append(totals_row)
    }

    //--------------------BOOKING GRID VIEW-------------------------------

    //do the icons on the booking grid view
    $("#tabgrid [data-bookid] div").each(fix_icons);
    //disable dragging of bookings on the grid view
    $("#tabgrid [data-bookid]").draggable('destroy');

    //--------------------CALENDAR VIEW-------------------------------

    //do the icon upgrade on the calendar view
    $("#calendartableholder [data-bookid] div").each(fix_icons);

    //check if is a valid user for booking text-tooltip replacement
    var allowed = false;
    for (let i = 0; i < users.length; i++) {
        const name = users[i];
        if ($('div[aria-labelledby="topmenuDropdownUser"] a span:containsi("' + name + '")').length > 0) {
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