$(function () {
    if(window.extra_bookingpage_js_executed) return;
    window.extra_bookingpage_js_executed = true;
    
    //change main image by map
    $(".b24-prop-pic img").attr("src", "https://raw.githubusercontent.com/igisa/beds24-static/master/images/salvia/map/map-16x9.jpg");
    
    //move lang selector to the right
    $(`i[class~="fa-map-o"]`).attr("class", "fa fa-map");

    //Fix some icons on the room features list
    $(`i[class~="fa-soccer-ball-o"]`).attr("class", "fa fa-dumbbell");
    $(`i[class~="fa-cutlery"]`).attr("class", "fa fa-coffee-pot");

    //Change the weight og the currency ticker
    $(`span.bookingpagecurrency`).attr("style", "font-weight: 300;");

    var galleries = $(".carousel");
    for (let i = 0; i < galleries.length; i += 1) {        
        
        //
        const images = $(galleries[i]).find(".item img");       
        var items = [];
        for (let x = 0; x < images.length; x += 1) {
            var url = $(images[x]).attr("src");
            if(url==undefined) url = $(images[x]).attr("data-lazy-load-src");
            items.push({
                src: url,
                srct: url.replace(".1200.", ".350."),
            });
        }   

        //set the height of the gallery element gallery
        $(galleries[i]).attr("style", "height: 500 px; overflow: visible");
        //remove scripts controlling the old gallery and change the id to avoid any other code referencing it
        $(galleries[i]).attr("id", "somegalleryid"+i);
        $(galleries[i]).parent().find("script").remove();
        
        //Configure the new one
        $(galleries[i]).nanogallery2({
            // ### gallery settings ### 
            thumbnailWidth: "auto",
            thumbnailHeight: 250,
            thumbnailDisplayTransition: "fadeIn",
            thumbnailAlignment: "fillWidth",
            thumbnailGutterWidth: 0,
            thumbnailGutterHeight: 0,
            thumbnailBorderHorizontal: 0,
            thumbnailBorderVertical: 0,
            galleryDisplayMode: "rows",
            galleryMaxRows: 2,
            galleryTheme: {
                thumbnail: {
                    background: '#f4f4f4',
                    backgroundImage: 'linear-gradient(315deg, #f4f4f4 0%, #ffffff 90%)',
                    borderColor: '#000',
                    borderRadius: '0px',
                    stackBackground: '#aaa'
                },
            },
            // ### gallery content ### 
            items: items
        });
    }    
});