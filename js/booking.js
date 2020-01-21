$(function () {

    //ui parameters
    var tab_name = "Servicios";
    var tab_pos = 4;

    var script_open_bracket = "<" + "script>";
    var script_close_bracket = "<" + "/" + "script>";

    
    var fields = {
        status: {
            label: "Estado",
            type: "options",
            options: [
                { id: "create", label: "Creado" },
                { id: "client_confirmed", label: "Cliente Confirmó" },
                { id: "provider_confirmed", label: "Proveedor Confirmó" },                
                { id: "client_confirmed", label: "Cliente Canceló" },
            ]
        },
        payed: {
            label: "Pagado",
            type: "options",
            options: [
                { id: "no", label: "No" },
                { id: "yes", label: "Si" },
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
            type: "text"
        },
        airline: {
            label:"Aerolinea",
            type: "text"
        },
        fullname:{
            label: "Nombre",
            type: "info",
        },
        numAdult: {
            label: "Adultos",
            type: "info",
        },
        numChild: {
            label: "Niños",
            type: "info",
        },
        country:{
            label: "País",
            type: "info",
        }        
    }

    var services = {        
        transfer_in: {
            description: "Transfer Aeropuerto-Hotel (In)",
            pax_price: { 1: 35, 2: 35, 3: 35, 4: 70, 5: 70, 6: 70, 7: 105, 8: 105, 9: 105 },
            pax_notes: {
                3: "Este transfer in requiere 1 solo auto.",
                6: "Este transfer in requiere 2 autos.",
                9: "Este transfer in requiere 3 autos.",
            },
            fields: ["status", "payed", "fullname", "numAdult", "numChild", "date", "time", "flight", "airline"]
        },
        transfer_hav_tri: {
            description: "Transfer Habana-Trinidad",
            pax_price: { 1: 200, 2: 200, 3: 200, 4: 400, 5: 400, 6: 400, 7: 600, 8: 600, 9: 600 },
            pax_notes: {
                3: "Este transfer in requiere 1 solo auto.",
                6: "Este transfer in requiere 2 autos.",
                9: "Este transfer in requiere 3 autos.",
            },
            fields: ["status", "payed", "fullname", "numAdult", "date", "time"]
        },
        transfer_out: {
            description: "Transfer Hotel-Aeropuerto (Out)",
            pax_price: { 1: 35, 2: 35, 3: 35, 4: 70, 5: 70, 6: 70, 7: 105, 8: 105, 9: 105 },
            pax_notes: {
                3: "Este transfer out requiere 1 solo auto.",
                6: "Este transfer out requiere 2 autos.",
                9: "Este transfer out requiere 3 autos.",
            },
            fields: ["status", "payed", "fullname", "numAdult", "date", "time", "flight", "airline"]
        },
        city_tour: {
            description: "City Tour Carro Clásico",
            pax_price: { 1: 75, 2: 110, 3: 135, 4: 180, 5: 225, 6: 270, 7: 315, 8: 360, 9: 405 },
            fields: ["status", "payed", "date", "fullname", "numAdult", "country"]
        }
    }

    //change the name of the tab and put it after the defined tab
    $("#ui-id-9").text(tab_name);
    $("#ui-id-9").parent().insertAfter($("#ui-id-"+(tab_pos-1)).parent());

    //on beds24 booking config there should be the following config variables:
    if (!booking_custom_settings ||
        !booking_custom_settings.authentication ||
        !booking_custom_settings.authentication.apiKey
    ) {
        return;
    }

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
    <br><br>
    <div class="first twelvecol" id="new_service_container">
    </div>

    <div class="twelvecol first ">
        <div class="setting_title_section">
            <span class="setting_title">Servicios</span>
        </div>
    </div>
    <br><br><br><br><br><br><br><br>
    `

    $("#tabcustom").append(html);
    $('[id^="new_service_button_"]').on("click", function () {
        var service_name = $(this).attr("data");
        var service = services[service_name];
        $("#new_service_container").empty()
        if (!service) return;
        $("#new_service_container").append(create_service_ui(service, false));
        $("#new_service_container").append(service)
    });

    const booking_info = booking_custom_settings.booking_info;
    
    function create_service_ui(service, include_divider) {
        var html = `
        ${include_divider ? '<hr style=" margin-top: 8px; margin-bottom: 8px;" class="editbookingdivider">':''} 
        <strong>${service.description}</strong>
        <br><br>        
        `;
        for (let i = 0; i < service.fields.length; i++) {
            const field = service.fields[i];
            html += get_field_ui_html(field,"new_service");            
        }
        return $(html);
        
    }   
    
    function get_field_ui_html(field_id, service_id){
        if (fields[field_id].type === "text"){
            var html = `
            <div class="twelvecol first setting_row">
                <div class="threecol first clearboth">
                    ${fields[field_id].label}
                </div>
                <div class="ninecol last">
                    <input class="inputtext" type="text" name="${service_id}_${field_id}" id="${service_id}_${field_id}" value="" title="">
                </div>
            </div>
            `;
        }
        else if(fields[field_id].type ==="options"){
            var field_options = ""
            for (let i = 0; i < fields[field_id].options.length; i++) {
                const option = fields[field_id].options[i];
                field_options += `
                    <option ${field_options.length==0?"selected":""} value="${option.id}">${option.label}</option>
                `;
            }
            var html = `
            <div class="twelvecol first setting_row">
                <div class="threecol first clearboth">
                    ${fields[field_id].label}
                </div>
                <div class="ninecol last">
                    <select id="${service_id}_${field_id}" name="${service_id}_${field_id}" class="white inputselect" title="">
                        ${field_options}
                    </select>
                </div>
            </div>
            `;
        }
        else if (fields[field_id].type === "info") {            
            var html=`
            <div class = "twelvecol first setting_row">
                <div class = "threecol first clearboth">
                    ${fields[field_id].label}
                </div>
                <div class="ninecol last">
                    <div class="twelvecol first setting_row">
                        <span class="setting_label" title="">${booking_info[field_id]}</span > 
                    </div>
                </div>
            </div>
            `;
        }
        else if (fields[field_id].type === "date"){
            var html = `
            <div class="twelvecol first setting_row">
                <div class="threecol first clearboth">
                    ${fields[field_id].label}
                </div>
                <div class="ninecol last">
                    <div class="inputdatefancydiv">
                        <input class="inputdatefancy inputdate hasDatepicker" type="text" name="${service_id}_${field_id}" id="${service_id}_${field_id}" value="Sunday, 19 January, 2020" title="">
                        <input type="hidden" name="${service_id}_${field_id}_hide" id="${service_id}_${field_id}_hide" value="2020-01-19">
                    </div>
                    <span id="${service_id}_${field_id}_extrainfo"></span>
                    ${script_open_bracket}
                    $("#${service_id}_${field_id}_hide").val("2020-01-19");
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
                            monthNames: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
                            dayNames: ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sabado"], 
                            onSelect: function (dateText, inst) {
                                var dateVar = $("#${service_id}_${field_id}").datepicker("getDate"); 
                                $("#${service_id}_${field_id}_hide").val($.datepicker.formatDate("yy-mm-dd", dateVar)); 
                                
                                var dateComp = $("#firstnight").datepicker("getDate");
                                
                                if (dateComp > dateVar) {
                                    $("#${service_id}_${field_id}").datepicker("setDate", dateComp);
                                    $("#${service_id}_${field_id}_hide").val($.datepicker.formatDate("yy-mm-dd", dateComp)); 
                                }; 
                            }, 
                            onClose: function (dateText, inst) {
                                var dateVar = $("#${service_id}_${field_id}").datepicker("getDate"); 
                                if (dateVar) {
                                    $("#${service_id}_${field_id}_hide").val($.datepicker.formatDate("yy-mm-dd", dateVar));

                                    var dateComp = $("#firstnight").datepicker("getDate");

                                    if (dateComp > dateVar) {
                                        $("#${service_id}_${field_id}").datepicker("setDate", dateComp);
                                        $("#${service_id}_${field_id}_hide").val($.datepicker.formatDate("yy-mm-dd", dateComp)); 
                                    }; 
                                }
                            }
                        });  
                    });
                    ${script_close_bracket}
                </div>
            </div>`;
        }
        return html;
    }       
});
