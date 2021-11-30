$(function () {

    if(window.extra_booking_js_executed) return;
    window.extra_booking_js_executed = true;

    //============================================ BOOKING INFO MODIFIER ============================================

    // add the edit button on the info item
    var items = $("#tabinfo div.booking-info-item");
    var info_items = {}
    window.custom_status_options = ["", "Confirmed", "Cancelled", "Pending"];
    for (let i = 0; i < items.length; i+=3) {
        const key   = items[i].innerText.trim();
        const value = items[i+1].innerText.trim();
        const date  = items[i+2].innerText.trim();
        const click_event = $(items[i]).find(">:first-child").attr("onclick");
        const event_name = "dodeletebookinginfo";
        const id = click_event.substr(event_name.length+1, click_event.length-event_name.length-2 )
        if(!info_items[key]) info_items[key] = [];
        var item = {
            text: value,
            time: date,
            code: key,
            infoItemId: id
        };
        info_items[key].push(item);        
        items.eq(i+1).prepend('<span class="btn btn-info btn-xs glyphicon glyphicon-edit" aria-hidden="true" title="dismiss" onclick=\'customeditbookinginfo('+JSON.stringify(item)+', this, false)\'></span>');
        if(item.code==="TRANSFER_OUT"||item.code==="TRANSFER_IN"||item.code==="HOTEL"){
            var options = window.custom_status_options;
            var selector = '<select aria-hidden="true" title="dismiss"  title="dismiss" onchange=\'customeditbookinginfo('+JSON.stringify(item)+', this, true)\'>';
            var selected = 0;            
            for (let i = 1; i < options.length; i++) {
                if(item.text.indexOf(options[i])>=0){
                    selected=i;
                    break;
                }
            }
            for (let i = 0; i < options.length; i++) {
                selector+= '<option ' + (selected===i?'selected=""':' ') + ' value="'+i+'">'+ options[i] +'</option>';
            }
            selector+= '</select>';
            items.eq(i+1).append(selector);
        }
    }

    window.customeditbookinginfo = function (booking_info, element, is_selector) {
        var new_value = null;
        if(!is_selector){
            new_value = window.prompt(booking_info.code,booking_info.text);
        }
        else{
            var options = window.custom_status_options;
            var option = options[element.selectedIndex];
            for (let i = 1; i < options.length; i++) {
                booking_info.text = booking_info.text.replace(" "+options[i]," ");
            }
            if(option!=="") booking_info.text += booking_info.text.trim() + " "+option;
            new_value = booking_info.text;
        }
        if(new_value!=null){
            $("#bookinginfocode").val(booking_info.code);
            $("#bookinginfodata").val(new_value);
            var input = $("<input>").attr("type", "hidden").attr("name", "dosubbookinginfo").val(1);
            $("#bookingedit").append($(input));
            input = $("<input>").attr("type", "hidden").attr("name", "dodeletebookinginfo").val(booking_info.infoItemId);
            $("#bookingedit").append($(input));
            $("#bookingedit").submit();
        }
    }

    //============================================ SERVICES TAB ============================================

    //skip the Services Tab on specific properties
    if(booking_extras.constants.skip_properties.indexOf($("#changepropid").val())>-1) return;

    //ui parameters
    const tab_name = "Servicios";
    const tab_pos = 4;
    const fields = booking_extras.fields
    const services = booking_extras.services;

    //------------------Helper methods & constants------------------------------
    
    //to avoid nested script tag closing by jquery
    const script_open_bracket = "<" + "script>";
    const script_close_bracket = "<" + "/" + "script>";

    //Format strings (used in flight verification link)
    if (!String.format) {
        String.format = function (format) {
            var args = Array.prototype.slice.call(arguments, 1);
            return format.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined' ?
                args[number] :
                match;
            });
        };
    }
    //Create uuid (used to id services)
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    //function to copy a text to the clipboard
    function copyToClipboard(text) {
        if (window.clipboardData && window.clipboardData.setData) {
            // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
            return clipboardData.setData("Text", text);

        } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in Microsoft Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand("copy"); // Security exception may be thrown by some browsers.
            } catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    }

    //change the name of the tab and put it after the defined tab
    $('a[href="#tabcustom"]').text(tab_name);
    $('a[href="#tabcustom"]').parent().insertAfter($("#ui-id-" + (tab_pos - 1)).parent());

    //on beds24 booking extras there should be the following config variables:
    if (!booking_extras ||
        !booking_extras.authentication ||
        !booking_extras.user ||
        !booking_extras.user_restrictions ||
        !booking_extras.authentication.apiKey
    ) {
        console.log("Some expected configuration values were not present.")
        return;
    }

    /*
    desk: restricts to only services modfications
    */
    var restrictions = booking_extras.user_restrictions[booking_extras.user];

    if (restrictions == "desk") {
        $("#bookingcopyasnewbutton").remove();
        $('button[name="dosubdelete"]').remove();
        
        $('a[href="#tabdetail"]').parent().hide()
        $('#tabdetail').hide()
        
        disable_booking_tab ('#tabsummary');
        disable_booking_tab ('#tabinfo');
    }

    function disable_booking_tab(selector){
        $(`${selector} textarea`).attr("disabled", true);
        $(`${selector} input`).attr("disabled", true);
        $(`${selector} select`).attr("disabled", true);
        $(`${selector} button`).attr("disabled", true);
        $(`${selector} span.jPicker`).hide();
        $(`${selector} div.btn`).attr("disabled", true);
        $(`${selector} a.btn`).attr("disabled", true);
        $(`${selector} span.btn`).attr("disabled", true);
        $(`${selector} #openslicemodal`).hide();
    }
    
    const booking_info = booking_extras.booking_info;
    var updated_service_data = false;

    //get booking info items from the info tab
    var items = $("#tabinfo div.booking-info-item");
    booking_info.info_items = {}
    for (let i = 0; i < items.length; i+=3) {
        const key = items[i].innerText.trim();
        const value = items[i+1].innerText.trim();
        const date = items[i + 2].innerText.trim();
        const click_event = $(items[i]).find(">:first-child").attr("onclick");
        const event_name = "dodeletebookinginfo";
        const id = click_event.substr(event_name.length+1, click_event.length-event_name.length-2 )
        if(!booking_info.info_items[key]){
            booking_info.info_items[key] = [];
        } 
        booking_info.info_items[key].push({
            text: value,
            time: date,
            code: key,
            infoItemId: id
        });        
    }

    var separator = booking_extras.constants.separator;
    // var field_selector = "#apimessage"
    var field_selector = "#hostcomments"
    
    function get_services_data() {
        var text = $(field_selector).val();
        if (text.indexOf(separator) >= 0) {
            return JSON.parse(text.split(separator)[1]);
        }
        return {
            services: [],
        }
    }
    
    function set_services_data() {
        updated_service_data = true;
        var text = $(field_selector).val();        
        if (text.indexOf(separator) >= 0) {
            var text_sections = text.split(separator)
            text = text_sections[0].trim() + text_sections[2].trim();
        }
        $(field_selector).val(`${text}\n${separator}\n${JSON.stringify(services_data)}\n${separator}`);
    }
    
    //declare the value that holds all the included services data and load it
    var services_data = get_services_data();

    //if role disabled the data_field enable it so it posts it as the form data when saving it
    $(`${field_selector}`).attr("disabled", false);
    $(`${field_selector}`).attr("readonly", true);

    
    //create the add service option menu
    var service_options = ""
    for (const service in services) {
        if (services.hasOwnProperty(service)) {
            const details = services[service];
            //skip option if already included in the booking
            var skip = false;
            for (let i = 0; i < services_data.services.length; i++) {
                if (services_data.services[i].name === service) {
                    skip=true;
                }
            }
            if(!skip){
                service_options += `
                <li role="presentation" class="">
                    <a role="menuitem" tabindex="-1" id="new_service_button_${service}" data="${service}")">
                        ${details.description}
                    </a>
                </li>
                `;
            }
        }
    }

    var html = `
    <br><br>
    <div class="btn btn-primary btn-xs b24-btn dropdown" style="display:inline-block; cursor:pointer;">
        <div class="dropdown-toggle" type="button" id="addservicedropdownMenu" data-toggle="dropdown" aria-expanded="true">
            <span><span class="glyphicon glyphicon-plus" aria-hidden="true">
            </span>&nbsp;Agregar Servicio</span>
        </div>
        <ul class="dropdown-menu" role="menu" aria-labelledby="addservicedropdownMenu">
            ${service_options}
        </ul>
    </div>
    
    <div style="background-color: #add8e694; padding-left: 20px;" class="first twelvecol" id="new_service_container">
    </div>

    <div class="floatright styleupdatebuttons">
        <button style="display:none" type="button" id="include_new_service_button" class="btn btn-primary btn-xs b24-btn" title="">
            &nbsp;
            <span class="glyphicon glyphicon-save" aria-hidden="true"></span> Incluir
        </button>
    </div>

    <div class="twelvecol first ">
        <div class="setting_title_section">
            <span class="setting_title">Servicios</span>
        </div>
    </div>

    <div class="first twelvecol">
        <div id="existing_services_container"></div>
        <div class="twelvecol" style= "height:300px;"></div>
    </div>

    
    `
    //append it to the tab
    $("#tabcustom").append(html);

    //on service clicked add a service html UI and prepopulate the values with booking_info
    $('[id^="new_service_button_"]').on("click", function () {
        const service_name = $(this).attr("data");
        $("#new_service_container").empty();
        $("#include_new_service_button").show();
        $("#new_service_container").append(create_service_ui(service_name, false, "new_service", false, false));

        var booking_info_clone = JSON.parse(JSON.stringify(booking_info));
        booking_info_clone.id = uuidv4();
        booking_info_clone.name = service_name;
        
        fill_service_values("new_service", booking_info_clone);

        var update_price = function () {
            var new_service = booking_extras.methods.get_service_values("new_service");
            var price = booking_extras.methods.get_price_value(new_service, "selling_price");            
            $(`#new_service_price`).val(price ? price.toFixed(2) : "0.00").change();         
        }

        update_price();

        for (let i = 0; i < services[service_name].price.update_on.length; i++) {
            const current = services[service_name].price.update_on[i];
            $(`#new_service_${current}`).on("input change", update_price);
        }

        if(services[service_name].correlations){
            //update link all the correlations in the service: when "update_on" changes, "to" changes with the "relation"
            for (let i = 0; i < services[service_name].correlations.length; i++) {
                const correlation = services[service_name].correlations[i];
                for (let f = 0; f < correlation.update_on.length; f++) {
                    const field = correlation.update_on[f];
                    var func = function (corr) {
                        var self_corr = corr;
                        return function () {
                            var new_service = booking_extras.methods.get_service_values("new_service");
                            var value = booking_extras.methods.get_correlation_value(new_service, self_corr)
                            $(`#new_service_${self_corr.to}`).val(value).change();
                        }
                    }(correlation);

                    $(`#new_service_${field}`).on("input change", func);
                }
            }

            //update the correlations now!
            for (let i = 0; i < services[service_name].correlations.length; i++) {
                const correlation = services[service_name].correlations[i];
                const field = correlation.update_on[0];
                $(`#new_service_${field}`).change();
            }
        }
    });

    $("#include_new_service_button").on("click",function (e) {
        $("#include_new_service_button").attr("disabled", true);
        e.preventDefault();
        update_all_included_services();

        var service = booking_extras.methods.get_service_values("new_service");
        services_data.services.push(service);
        set_services_data();        
        var update_button = $("button[value='Update'][type='submit']")
        if(update_button.length>0) update_button.click();
        else $("button[value='Actualizar'][type='submit']").click();

    })

    for (let i = 0; i < services_data.services.length; i++) {
        const service = services_data.services[i];
        $("#existing_services_container").append(create_service_ui(service.name, true, service.id, true, true));
        fill_service_values(service.id, service);
    }
    
    $("#existing_services_container").on("keydown", "form", function (event) { return event.key != "Enter"; });
    $("#existing_services_container").on('input change', "input", update_all_included_services);
    $("#existing_services_container").on('input change', "select", update_all_included_services);
    $("#existing_services_container").on('input change', "textarea", update_all_included_services);
    
    $("#existing_services_container").on("click", 'button[name="copy_service_text"]', function (event) {
        event.preventDefault();
        var service_id = $(this).attr("service_id");        
        for (let i = 0; i < services_data.services.length; i++) {
            const service = services_data.services[i];
            if (service.id === service_id) {
                var text = get_service_provider_text(service);
                copyToClipboard(text);
            }
        }
    });

    $("#existing_services_container").on("click", 'button[name="delete_button"]', function (event) {
        event.preventDefault();
        var service_id = $(this).attr("service_id");
        $(this).attr("disabled", true);
        for (let i = 0; i < services_data.services.length; i++) {
            const service = services_data.services[i];
            if(service.id===service_id){
                services_data.services.splice(i,1);
            }
        }
        set_services_data();
        
        var update_button = $("button[value='Update'][type='submit']")
        if (update_button.length > 0) update_button.click();
        else $("button[value='Actualizar'][type='submit']").click();
    });

    var click_handler = function(event) {
        event.preventDefault(); //this will prevent the default submit
        var self = this;
        
        //if nothing changed, do the click()
        if (!updated_service_data) {
            $(self).off(".services")
            $(self).click();
            console.log("nothing changed")
            return;
        }
        
        //if something changed, do the submit after a successful ajax call
        set_loading_overlay(true);
        update_booking_infoItems(function (success) {
            set_loading_overlay(false);
            if (success) {
                $(self).off(".services")
                $(self).click();
            }
        }, compute_infoItems_modifications())
    }

    $("button[value='Update'][type='submit']").on("click.services",click_handler);
    $("button[value='Actualizar'][type='submit']").on("click.services", click_handler);
    
    $("button[value='Save'][type='submit']").on("click.services", click_handler);
    $("button[value='Guardar'][type='submit']").on("click.services", click_handler);

    // $("button[value='Delete'][type='submit']").on("click.services", click_handler);
    // $("button[value='Close'][type='submit']").on("click.services", click_handler);

    function compute_infoItems_modifications(){
        var objective = get_services_infoItems();
        var current = booking_info.info_items;

        var infoItems=[]

        //remove the info items in current
        for (const code in current) {
            if (current.hasOwnProperty(code)) {
                for (let i = 0; i < current[code].length; i++) {
                    const data = current[code][i];
                    if (is_service_infoItem(data.text)) {
                        infoItems.push({
                            code: "",
                            text: "",
                            infoItemId: data.infoItemId
                        });
                    }
                }
            }
        }

        //add all the info items in current
        for (let i = 0; i < objective.length; i++) {
            const element = objective[i];
            infoItems.push({
                code: element.code,
                text: element.text
            });                        
        }

        return infoItems;
    }

    function get_services_infoItems(){
        var items = []
        for (let i = 0; i < services_data.services.length; i++) {
            const service = services_data.services[i]; 

            for (let i = 0; i < fields.status.options.length; i++) {
                const option = fields.status.options[i];
                if(service.status===option.id){
                    if(option.show_logo){
                        var color = option.logo_color ? option.logo_color : "000000";
                        items.push({
                            code: services[service.name].icon,
                            text: get_service_calendar_resume(service, color)
                        });
                        //items[services[service.name].icon] = get_service_calendar_resume(service, color);
                    }
                    break;
                }
            }
        }
        return items;
    }   

    function is_service_infoItem(item_text){
        return item_text.indexOf("·")>=0
    }

    function get_service_provider_text(service) {
        var header = `Confirmación ${services[service.name].description}\n\n`;

        var body = `Servicio: ${services[service.name].description}\n`;        
        for (let i = 0; i < services[service.name].provider_fields.length; i++) {
            const field = services[service.name].provider_fields[i];
            if (fields[field].type === "options") {
                for (let o = 0; o < fields[field].options.length; o++) {
                    const option = fields[field].options[o];
                    if ( option.id.toString() === service[field].toString()) {
                        body += `${fields[field].label}: ${option.label}\n`;
                        break;
                    }
                }
            } else {
                body += `${fields[field].label}: ${service[field]}\n`;
            }
        }
        return (header+body).trim();
    }

    function get_service_calendar_resume(service, color){
        var resume = `#${color} ·${services[service.name].description_short}·\n`
        for (let i = 0; i < services[service.name].calendar_resume_fields.length; i++) {
            const field = services[service.name].calendar_resume_fields[i];
            resume += `${fields[field].label}: ${booking_extras.methods.get_service_field_pretty_value(service, field)}\n`            
        }
        return resume.trim();
    }

    function update_all_included_services(){
        var updated_services = []
        for (let i = 0; i < services_data.services.length; i++) {
            const service = services_data.services[i];
            updated_services.push(booking_extras.methods.get_service_values(service.id));
        }
        services_data.services = updated_services;
        set_services_data();        
    }
    
    function set_loading_overlay(enabled){
        if ($('#full_screen_overlay').length==0){
            $('body').append($(`
                <style>
                    #full_screen_overlay {
                        width: 100%;
                        height: 100%;
                        position: fixed;
                        left: 0px;
                        top: 0px;
                        background-color: #000;
                        opacity: .50;
                        text-align: center;
                        vertical-align: middle;
                        z-index:1000;
                    }
                </style>
                <div id="full_screen_overlay" style="display:none"></div>
            `));
        }
        if(enabled){
            $('#full_screen_overlay').fadeIn(100);
            $.fancybox.showLoading();
        }
        else{
            $('#full_screen_overlay').fadeOut(100);
            $.fancybox.hideLoading();
        }
    }

    //failsafe to run it only once per session
    var ran_once = false;
    function update_booking_infoItems(on_finished, infoItems) {

        if(infoItems.length==0 || ran_once){
            on_finished(true);
            if(ran_once) console.log("Failsafe for API abuse triggered, request skipped.")
            else console.log("Empty Info items");    
            return;
        }

        var request_body = {
            authentication: {
                apiKey: booking_extras.authentication.apiKey,
                propKey: booking_extras.authentication[booking_info.property]
            },
            bookId: booking_info.id,
            infoItems: infoItems
        }

        var settings = {
            async: true,
            crossDomain: true,
            url: "/api/json/setBooking",
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            processData: false,
            data: JSON.stringify(request_body)
        }

        ran_once = true;
        $.ajax(settings).done(function (response) {
            console.log("Booking info items update request was successful");       
            on_finished(true);    
        }).fail(function (response) {
            console.log("Booking info items update request failed");        
            on_finished(false);  
        });;        
    }

    function fill_service_values(service_id, data){
        $(`#${service_id}_id`).val(data.id).change();
        $(`#${service_id}_name`).val(data.name).change();
        for (const field in data) {
            if (data.hasOwnProperty(field)) {
                const value = data[field];
                $(`#${service_id}_${field}`).val(value).change();
            }
        }
    }
    
    function create_service_ui(service_name, include_divider, service_id, include_delete, include_copy_button) {
        var service = services[service_name];
        var html =`<div id="${service_id}_container" class="twelvecol first">`;
        html += `        
        <br>
        <strong>${service.description}</strong>
        `
        if(include_copy_button){
            html+=`
            <span>
                <button service_id="${service_id}" name="copy_service_text" class="btn btn-info btn-xs" title="">
                <span class="glyphicon glyphicon-copy" aria-hidden="true"></span>
                    Copiar Texto
                </button>
            </span>
            `
        }
        html+=`
        <br><br>        
        <input type="hidden" id="${service_id}_id" value="${uuidv4()}">
        <input type="hidden" id="${service_id}_name" value="${service_name}">
        `;
        for (let i = 0; i < service.fields.length; i++) {
            const field = service.fields[i];
            html += get_field_ui_html(field, service_id, service_name);
        }
        
        if (include_delete) {
            html += `
            <div class="floatleft styleupdatebuttons">
                &nbsp;
                <button name="delete_button" service_id="${service_id}" class="btn btn-danger btn-xs b24-btn" value="Delete" title="">
                    <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                    <span class="glyphicon glyphicon-" aria-hidden="true"></span> 
                    Eliminar Servicio
                </button>
            </div>
            `;
        }
        
        html+=`
        <div class="twelvecol first ">        
        ${include_divider ? '<hr style=" margin-top: 8px; margin-bottom: 8px;" class="editbookingdivider">' : ''} 
        </div>
        `;


        html += `</div>`;

        return $(html);        
    }      
    
    function get_field_ui_html(field_id, service_id, name){
        var field = fields[field_id];
        
        if (field.type === "text"){
            var link_html = "";
            if(field.link){
                link_html = `                    
                    <a service="${name}" id="${service_id}_${field_id}_link" url="${field.link.url}" target="_blank">${field.link.name}</a>
                    ${script_open_bracket}                    
                    $("#${service_id}_${field_id}_link").on('click', function(e){ 
                        e.preventDefault();  
                        window.open(
                            String.format($(this).attr("url"), $("#${service_id}_${field_id}").val()), 
                            '_blank'
                        );
                    });
                    ${script_close_bracket} 
                `;
            }
            var html = `
            <div class="twelvecol first setting_row">
                <div class="threecol first clearboth">
                    ${field.label}
                </div>
                <div class="ninecol last">
                    <input class="width200" inputtext" type="text" service="${name}" name="${service_id}_${field_id}" id="${service_id}_${field_id}" value="" title="">
                    &nbsp;<span service="${name}" id="${service_id}_${field_id}_post_label">${field.post_label ? field.post_label : ""}</span>
                    ${link_html}               
                </div>
            </div>
            `;
        }
        else if (field.type==="num"){
            var html = `
                <div class="twelvecol first setting_row">
                    <div class="threecol first clearboth setting_name">
                        ${field.label}
                    </div>
                    <div class="ninecol last">
                        <input class="inputnum" type="text" service="${name}" name="${service_id}_${field_id}" id="${service_id}_${field_id}" value="" title="">
                        &nbsp;<span service="${name}" id="${service_id}_${field_id}_post_label">${field.post_label ? field.post_label : ""}</span>
                    </div>
                </div>            
            `;
        }
        else if(field.type==="multiline"){
            var html = `
            <div class="twelvecol first setting_row">
                <div class="threecol first clearboth setting_name">
                    ${field.label}
                </div>
                <div class="ninecol last">
                    <textarea class="" rows="1" service="${name}" id="${service_id}_${field_id}" name="${service_id}_${field_id}" cols="80" onkeyup="sz(this);" onfocus="cv(this,'');" onblur="ob(this,'');" title="" style="color: rgb(136, 136, 136); background-color: rgb(255, 255, 255);"></textarea>
                    &nbsp;<span service="${name}" id="${service_id}_${field_id}_post_label">${field.post_label ? field.post_label : ""}</span>
                    ${script_open_bracket}
                        document.getElementById("${service_id}_${field_id}").rows=1;
                        sz(document.getElementById("${service_id}_${field_id}"));
                    ${script_close_bracket}
                </div>
            </div>
            `;
        }
        else if(field.type ==="options"){
            var field_options = ""
            for (let i = 0; i < field.options.length; i++) {
                const option = field.options[i];
                var selected = i==0;
                field_options += `
                    <option ${selected?"selected":""} value="${option.id}">${option.label}</option>
                `;
            }
            var html = `
            <div class="twelvecol first setting_row">
                <div class="threecol first clearboth">
                    ${field.label}
                </div>
                <div class="ninecol last">
                    <select service="${name}" id="${service_id}_${field_id}" name="${service_id}_${field_id}" class="white inputselect" title="">
                        ${field_options}
                    </select>
                    &nbsp;<span service="${name}" id="${service_id}_${field_id}_post_label">${field.post_label ? field.post_label : ""}</span>
                </div>
            </div>
            `;
        }
        else if (field.type === "label") {            
            var html=`
            <div class = "twelvecol first setting_row">
                <div class = "threecol first clearboth">
                    ${field.label}
                </div>
                <div class="ninecol last">
                    <div class="twelvecol first setting_row">
                        <span class="setting_label" service="${name}" id="${service_id}_${field_id}" title="">${booking_info[field_id]}</span > 
                    </div>
                    &nbsp;<span service="${name}" id="${service_id}_${field_id}_post_label">${field.post_label ? field.post_label : ""}</span>
                </div>
            </div>
            `;
        }
        else if (field.type === "date"){
            var html = `
            <div class="twelvecol first setting_row">
                <div class="threecol first clearboth">
                    ${field.label}
                </div>
                <div class="ninecol last">
                    <div class="inputdatefancydiv">
                        <input class="inputdatefancy inputdate" type="text" service="${name}" name="${service_id}_${field_id}" id="${service_id}_${field_id}" value="" title="">
                        <input type="hidden" service="${name}" name="${service_id}_${field_id}_hide" id="${service_id}_${field_id}_hide" value="">
                        &nbsp;<span service="${name}" id="${service_id}_${field_id}_post_label">${field.post_label ? field.post_label : ""}</span>
                    </div>
                    <span id="${service_id}_${field_id}_extrainfo"></span>
                    ${script_open_bracket}
                    $(function() {
                        var df = "DD, d MM, yy";
                        $( "#${service_id}_${field_id}" ).datepicker({
                            showOtherMonths: true,
                            selectOtherMonths: true,
                            changeMonth: true,
                            changeYear: true,
                            yearRange: "2006:+10",
                            firstDay: 1,
                            dateFormat: df,
                            monthNames: ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"],
                            dayNames: ["domingo","lunes","martes","miércoles","jueves","viernes","sabado"], 
                            onSelect: function (dateText, date, inst) {
                                var dateVar = $("#${service_id}_${field_id}").datepicker("getDate"); 
                                $("#${service_id}_${field_id}_hide").val($.datepicker.formatDate("yy-mm-dd", dateVar)); 
                                
                                var dateComp = $("#firstnight").datepicker("getDate");
                                
                                if (dateComp > dateVar) {
                                    $("#${service_id}_${field_id}").datepicker("setDate", dateComp);
                                    $("#${service_id}_${field_id}_hide").val($.datepicker.formatDate("yy-mm-dd", dateComp)); 
                                }; 
                                
                                $("#${service_id}_${field_id}").trigger('change');
                            }, 
                            onClose: function (dateText, date, inst) {
                                var dateVar = $("#${service_id}_${field_id}").datepicker("getDate"); 
                                if (dateVar) {
                                    $("#${service_id}_${field_id}_hide").val($.datepicker.formatDate("yy-mm-dd", dateVar));

                                    var dateComp = $("#firstnight").datepicker("getDate");

                                    if (dateComp > dateVar) {
                                        $("#${service_id}_${field_id}").datepicker("setDate", dateComp);
                                        $("#${service_id}_${field_id}_hide").val($.datepicker.formatDate("yy-mm-dd", dateComp)); 
                                    }; 
                                }

                                $("#${service_id}_${field_id}").trigger('change');
                            }
                        });  
                    });
                    $("#${service_id}_${field_id}").datepicker("setDate", $("#firstnight").datepicker("getDate"));
                    
                    ${script_close_bracket}
                </div>
            </div>`;
        }
        return html;
    }       
});
