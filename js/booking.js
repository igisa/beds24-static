$(function () {

    //ui parameters
    const tab_name = "Servicios";
    const tab_pos = 4;
    
    const fields = {
        status: {
            label: "Estado",
            type: "options",
            options: [
                { id: "created", show_logo: false, label: "Creado", },
                { id: "client_confirmed", show_logo: true, logo_color: "f1d700", label: "Cliente Confirmó" },
                { id: "provider_confirmed", show_logo: true, logo_color: "4d5ff9", label: "Cliente & Proveedor Confirmaron" },                
                { id: "client_cancelled", show_logo: true, logo_color: "e40000", label: "Cliente Canceló" },
                { id: "service_provided", show_logo: true, logo_color: "45ab45", label: "Servicio Realizado" },                
            ]
        },
        payed: {
            label: "Cobrado",
            type: "options",
            options: [
                { id: "no", label: "No" },
                { id: "yes", label: "Si" },
            ]
        },
        notes: {
            label: "Notas",
            type: "multiline"            
        },
        seller: {
            label: "Vendedor",
            type: "options",
            options: [
                { id: "david", label: "David" },
                { id: "yissel", label: "Yissel" },
                { id: "yolanda", label: "Yolanda" },
                { id: "karla", label: "Karla" },
            ]
        },
        date: {
            label: "Fecha",
            type: "date",
        },
        time:{
            label: "Hora",
            type: "text"
        },
        flight: {
            label: "Vuelo",
            type: "text",
            link: {
                url: "https://www.google.com/search?q=vuelo%20{0}",
                name: "Verificar"
            } 
        },
        price:{
            label: "Precio",
            type: "num",
            post_label: "cuc"
        },
        airline: {
            label:"Aerolinea",
            type: "text"
        },
        fullname:{
            label: "Nombre",
            type: "text",
        },
        numAdult: {
            label: "Adultos",
            type: "options",
            options: [
                { id: "1", label: "1" },
                { id: "2", label: "2" },
                { id: "3", label: "3" },
                { id: "4", label: "4" },
                { id: "5", label: "5" },
                { id: "6", label: "6" },
                { id: "7", label: "7" },
                { id: "8", label: "8" },
                { id: "9", label: "9" },
                { id: "10", label: "10" },
            ],
        },
        numChild: {
            label: "Niños",
            type: "options",
            options: [
                { id: "0", label: "0" },
                { id: "1", label: "1" },
                { id: "2", label: "2" },
                { id: "3", label: "3" },
                { id: "4", label: "4" },
                { id: "5", label: "5" },
                { id: "6", label: "6" },
                { id: "7", label: "7" },
                { id: "8", label: "8" },
                { id: "9", label: "9" },
                { id: "10", label: "10" },
            ],
        },
        country:{
            label: "País",
            type: "text",
        }        
    }

    const services = { 

        transfer_in: {
            description: "Transfer Aeropuerto-Hotel (In)",
            description_short: "Trans.IN",
            pax_price: { 1: 35, 2: 35, 3: 35, 4: 70, 5: 70, 6: 70, 7: 105, 8: 105, 9: 105 },
            pax_notes: {
                3: "Este transfer in requiere 1 solo auto.",
                6: "Este transfer in requiere 2 autos.",
                9: "Este transfer in requiere 3 autos.",
            },
            icon: "I-plane-arrival",
            fields: ["status", "fullname", "numAdult", "numChild", "date", "flight", "time", "airline", "price", "seller", "payed", "notes"],
            calendar_resume_fields: ["status", "date", "flight", "time", "airline", "payed"]
        },
        
        transfer_hav_tri: {
            description: "Transfer Habana-Trinidad",
            description_short: "Trans.HAB-TRI",
            pax_price: { 1: 200, 2: 200, 3: 200, 4: 400, 5: 400, 6: 400, 7: 600, 8: 600, 9: 600 },
            pax_notes: {
                3: "Este transfer in requiere 1 solo auto.",
                6: "Este transfer in requiere 2 autos.",
                9: "Este transfer in requiere 3 autos.",
            },
            icon: "I-taxi",
            fields: ["status", "fullname", "numAdult", "numChild", "date", "time", "price", "seller", "payed", "notes"],
            calendar_resume_fields: ["status", "date", "time", "payed"]
        },
        
        transfer_out: {
            description: "Transfer Hotel-Aeropuerto (Out)",
            description_short: "Trans.OUT",
            pax_price: { 1: 35, 2: 35, 3: 35, 4: 70, 5: 70, 6: 70, 7: 105, 8: 105, 9: 105 },
            pax_notes: {
                3: "Este transfer out requiere 1 solo auto.",
                6: "Este transfer out requiere 2 autos.",
                9: "Este transfer out requiere 3 autos.",
            },
            icon: "I-plane-departure",
            fields: ["status", "fullname", "numAdult", "numChild", "date", "flight", "time", "airline", "price", "seller", "payed", "notes"],
            calendar_resume_fields: ["status", "date", "flight", "time", "airline", "payed"]
        },
        
        city_tour: {
            description: "City Tour Carro Clásico",
            description_short: "City-Tour",
            pax_price: { 1: 75, 2: 110, 3: 135, 4: 180, 5: 225, 6: 270, 7: 315, 8: 360, 9: 405 },
            icon: "I-car-building",
            fields: ["status", "date", "fullname", "numAdult", "numChild", "country", "price", "seller", "payed", "notes"],
            calendar_resume_fields: ["status", "date", "country", "payed"]
        }
    }

    //Helper methods & stuff
    
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

    //change the name of the tab and put it after the defined tab
    $("#ui-id-9").text(tab_name);
    $("#ui-id-9").parent().insertAfter($("#ui-id-"+(tab_pos-1)).parent());

    //on beds24 booking config there should be the following config variables:
    if (!booking_custom_settings ||
        !booking_custom_settings.authentication ||
        !booking_custom_settings.authentication.apiKey
    ) {
        console.log("Some expected configuration values were not present.")
        return;
    }

    const booking_info = booking_custom_settings.booking_info;
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

    var separator = "--> DO NOT MODIFY OR INCLUDE ANY TEXT AFTER THIS <--"
    var field_selector = "#apimessage"
    function get_services_data() {
        var text = $(field_selector).val();
        if(text.indexOf(separator)<0){
            return {
                services: [],
            }
        }
        return JSON.parse(text.split(separator)[1]);
    }

    function set_services_data() {
        updated_service_data = true;
        var text = $(field_selector).val();
        text = text.split(separator)[0].trim();
        $(field_selector).val(`${text}\n\n${separator}\n\n${JSON.stringify(services_data)}`);
    }
    
    //declare the value that holds all the included services data and load it
    var services_data = get_services_data();

    //create the add service option menu
    var service_options = ""
    for (const service in services) {
        if (services.hasOwnProperty(service)) {
            const details = services[service];
            service_options += `
            <li role="presentation" class="">
                <a role="menuitem" tabindex="-1" id="new_service_button_${service}" data="${service}")">
                    ${details.description}
                </a>
            </li>
            `;
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
        var service_name = $(this).attr("data");
        $("#new_service_container").empty();
        $("#include_new_service_button").show();
        $("#new_service_container").append(create_service_ui(service_name, false, "new_service", false));

        var booking_info_clone = JSON.parse(JSON.stringify(booking_info));
        booking_info_clone.id = uuidv4();
        booking_info_clone.name = service_name;
        
        fill_service_values("new_service", booking_info_clone);

        var update_price = function () {
            const service = service_name
            var adults = parseInt($(`#new_service_numAdult`).val());
            var childs = parseInt($(`#new_service_numChild`).val());
            var price = services[service].pax_price[adults + childs];
            $(`#new_service_price`).val(price?price.toFixed(2):"100.00");        
        }

        update_price();

        $(document).on('change', `#new_service_numAdult`, update_price);
        $(document).on('change', `#new_service_numChild`, update_price);
    });

    $("#include_new_service_button").on("click",function (e) {
        $("#include_new_service_button").attr("disabled", true);
        e.preventDefault();
        update_all_included_services();

        var service = get_service_values("new_service");
        services_data.services.push(service);
        set_services_data();        
        $("button[value='Update'][type='submit']").click();

    })

    for (let i = 0; i < services_data.services.length; i++) {
        const service = services_data.services[i];
        $("#existing_services_container").append(create_service_ui(service.name, true, service.id, true));
        fill_service_values(service.id, service);
    }
    
    $("#existing_services_container").on("keydown", "form", function (event) { return event.key != "Enter"; });
    $("#existing_services_container").on('input', "input", update_all_included_services);
    $("#existing_services_container").on('change', "select", update_all_included_services);
    $("#existing_services_container").on('change', "input", update_all_included_services);

    $("#existing_services_container").on("click", "button", function (event) {
        var service_id = $(this).attr("service_id");
        $(this).attr("disabled", true);
        for (let i = 0; i < services_data.services.length; i++) {
            const service = services_data.services[i];
            if(service.id===service_id){
                services_data.services.splice(i,1);
            }
        }
        set_services_data();
        $("button[value='Update'][type='submit']").click();
    });


    //override form sumbit to do ajax on booking codes if needed
    $('#bookingedit').submit(function (event) {
        var self = this;
        event.preventDefault(); //this will prevent the default submit

        //if nothing changed, do the submit
        if(!updated_service_data){
            $(self).unbind('submit').submit();
            return;
        }

        //if something changed, do the submit after a successful ajax call
        set_loading_overlay(true);
        update_booking_infoItems(function (success) {
            if (success){
                $(self).unbind('submit').submit();
            }
            else{
                set_loading_overlay(false);
            }
        }, compute_infoItems_modifications())
    })

    function compute_infoItems_modifications(){
        var objective = get_services_infoItems();
        var current = booking_info.info_items;

        var infoItems=[]

        //find the ones not present and include them
        //find the ones different and modify them
        for (const code in objective) {
            if (objective.hasOwnProperty(code)) {
                const text = objective[code];
                //if not in current or is not a service info item then add it
                if (!current[code]){
                    infoItems.push({
                        code: code,
                        text: text
                    });
                }
                else{
                    var foundIt = false;
                    for (let i = 0; i < current[code].length; i++) {
                        const data = current[code][i];
                        //if is there but with different text then modify it
                        if (is_service_infoItem(data.text)) {
                            foundIt = true;
                            if (data.text !== text){
                                infoItems.push({
                                    code: code,
                                    text: text,
                                    infoItemId: data.infoItemId
                                })
                            }
                        }                        
                    }
                    if(!foundIt){
                        infoItems.push({
                            code: code,
                            text: text
                        });
                    }
                }
            }
        }

        //remove the ones that are not present on the objective set
        for (const code in current) {
            if (current.hasOwnProperty(code)) {
                for (let i = 0; i < current[code].length; i++) {
                    const data = current[code][i];
                    if (is_service_infoItem(data.text) && !objective[data.code]) {
                        infoItems.push({
                            code: "",
                            text: "",
                            infoItemId: data.infoItemId
                        })
                    }
                }
            }
        }

        return infoItems;
    }

    function get_services_infoItems(){
        var items = {}
        for (let i = 0; i < services_data.services.length; i++) {
            const service = services_data.services[i]; 

            for (let i = 0; i < fields.status.options.length; i++) {
                const option = fields.status.options[i];
                if(service.status===option.id){
                    if(option.show_logo){
                        var color = option.logo_color ? option.logo_color : "000000";
                        items[services[service.name].icon] = get_service_resume(service, color);
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

    function get_service_resume(service, color){
        var resume = `#${color} ·${services[service.name].description_short}·\n`
        for (let i = 0; i < services[service.name].calendar_resume_fields.length; i++) {
            const field = services[service.name].calendar_resume_fields[i];
            if(fields[field].type==="options"){
                for (let o = 0; o < fields[field].options.length; o++) {
                    const option = fields[field].options[o];
                    if (option.id === service[field]){
                        resume+=`${fields[field].label}: ${option.label}\n`;            
                        break;
                    }
                }
            }
            else{
                resume+=`${fields[field].label}: ${service[field]}\n`;            
            }
        }
        return resume.trim();
    }

    function update_all_included_services(){
        var updated_services = []
        for (let i = 0; i < services_data.services.length; i++) {
            const service = services_data.services[i];
            updated_services.push(get_service_values(service.id));
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

    function update_booking_infoItems(on_finished, infoItems) {

        if(infoItems.length==0){
            on_finished(true);    
            return;
        }

        var request_body = {
            authentication: {
                apiKey: booking_custom_settings.authentication.apiKey,
                propKey: booking_custom_settings.authentication[booking_info.property]
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

        $.ajax(settings).done(function (response) {
            console.log("Booking info items update request was successful");       
            on_finished(true);    
        }).fail(function (response) {
            console.log("Booking info items update request failed");        
            on_finished(false);  
        });;        
    }

    function fill_service_values(service_id, data){
        $(`#${service_id}_id`).val(data.id);
        $(`#${service_id}_name`).val(data.name);
        for (const field in data) {
            if (data.hasOwnProperty(field)) {
                const value = data[field];
                $(`#${service_id}_${field}`).val(value);
            }
        }
    }
    
    function create_service_ui(service_name, include_divider, service_id, include_delete) {
        var service = services[service_name];
        
        var html =`
            <div id="${service_id}_container" class="twelvecol first ">
        `;

        

        var html = `        
        <br>
        <strong>${service.description}</strong>
        <br><br>        
        <input type="hidden" id="${service_id}_id" value="${uuidv4()}">
        <input type="hidden" id="${service_id}_name" value="${service_name}">
        `;
        for (let i = 0; i < service.fields.length; i++) {
            const field = service.fields[i];
            html += get_field_ui_html(field, service_id);            
        }
        
        if (include_delete) {
            html += `
            <div class="floatleft styleupdatebuttons">
                &nbsp;
                <button name="${service_id}_delete_button" service_id="${service_id}" class="btn btn-danger btn-xs b24-btn" value="Delete" title="">
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

    function get_service_values(service_id) {
        var result = {
            id: $(`#${service_id}_id`).val(),
            name: $(`#${service_id}_name`).val()
        }
        var service = services[result.name];
        for (let i = 0; i < service.fields.length; i++) {
            const field_id = service.fields[i];
            result[field_id] = $(`#${service_id}_${field_id}`).val();
        }
        return result;        
    }
    
    function get_field_ui_html(field_id, service_id){
        var field = fields[field_id];
        
        if (field.type === "text"){
            var link_html = "";
            if(field.link){
                link_html = `                    
                    <a id="${service_id}_${field_id}_link" url="${field.link.url}" target="_blank">${field.link.name}</a>
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
                    <input class="width200" inputtext" type="text" name="${service_id}_${field_id}" id="${service_id}_${field_id}" value="" title="">
                    &nbsp;${field.post_label ? field.post_label : ""}
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
                        <input class="inputnum" type="text" name="${service_id}_${field_id}" id="${service_id}_${field_id}" value="" title="">
                        &nbsp;${field.post_label ? field.post_label : ""}
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
                    <textarea class="" rows="1" id="${service_id}_${field_id}" name="${service_id}_${field_id}" cols="80" onkeyup="sz(this);" onfocus="cv(this,'');" onblur="ob(this,'');" title="" style="color: rgb(136, 136, 136); background-color: rgb(255, 255, 255);"></textarea>
                    &nbsp;${field.post_label ? field.post_label : ""}
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
                    <select id="${service_id}_${field_id}" name="${service_id}_${field_id}" class="white inputselect" title="">
                        ${field_options}
                    </select>
                    &nbsp;${field.post_label ? field.post_label : ""}
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
                        <span class="setting_label" id="${service_id}_${field_id}" title="">${booking_info[field_id]}</span > 
                    </div>
                    &nbsp;${field.post_label ? field.post_label : ""}
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
                        <input class="inputdatefancy inputdate" type="text" name="${service_id}_${field_id}" id="${service_id}_${field_id}" value="" title="">
                        <input type="hidden" name="${service_id}_${field_id}_hide" id="${service_id}_${field_id}_hide" value="">
                        &nbsp;${field.post_label ? field.post_label:""}
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
