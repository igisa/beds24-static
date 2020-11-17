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

    var video_mapping = {
        227723: "BIMWgai1wQM",
        227720: "paA80yO1ecg",
        230354: "fkhknM-R2s8"
    };

    var main_images = $(".b24-room-pic");
    for (let i = 0; i < main_images.length; i += 1) {        
        
        var yt_video_id = "";
        
        var classList =  $(main_images[i]).attr("class");
        var classArr = classList.split(/\s+/);
        $.each(classArr, function(index, value){
            if(value.startsWith("b24-room-") && !value.startsWith("b24-room-pic")){
                yt_video_id = video_mapping[value.replace("b24-room-","")];
            }
        });
        
        //get the image to query the width and height
        const image = $(main_images[i]).find("img"); 
        //embed the video with the correct height and the correct id 
        var room_video = $(`<iframe width="`+ image.width()+`" height="`+ image.width()*(9/16) +`" src="https://www.youtube.com/embed/`+yt_video_id+`?autoplay=0&mute=1&loop=1&playlist=`+yt_video_id+`&controls=0&iv_load_policy=3" frameborder="0""></iframe>`);
        $(main_images[i]).append(room_video);
        
        //remove the script and the image elements
        $(main_images[i]).find("script").remove();    
        $(main_images[i]).find("img").remove();    
    }   

    //iterate over all the galleries and update them to the nanogallery2 version
    var galleries = $(".carousel");
    for (let i = 0; i < galleries.length; i += 1) {        
        
        //get the images on the gallery and tore their url in items list
        const images = $(galleries[i]).find(".item img");       
        var items = [];
        for (let x = 0; x < images.length; x += 1) {
            var url = $(images[x]).attr("src");
            if(url==undefined) url = $(images[x]).attr("data-lazy-load-src");
            //set the url and set the thumbnail ul 
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