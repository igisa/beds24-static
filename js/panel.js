$(function () {

    const users = ["maestranzax", "dvdarias", "____lisset"];
    const filter = "dmc";

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

    //check if is a valid user
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
            color = color.replace("rgb", "rgba");
            color = color.replace(")", ",0.7)");            
            bookElement.css("background-color", color);
            bookid.css("background-color");

            //get the hover text and replace it
            $.ajax({
                url: "https://www.beds24.com/api/ajax/bookinghover.php?b=" + bookid,
                success: function (result) {
                    element.textNodes().remove();
                    element.find("br").remove();

                    element.append("&nbsp;" + result);
                }
            });
        });


    }
});