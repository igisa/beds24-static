$(function () {

    //ui parameters
    var tab_name = "Servicios";
    var tab_pos = 4;
    
    var status = {
        client_confirmed: "El cliente confirmó el servicio",
        provider_confirmed: "El proveedor confirmó el servicio",
        client_charged: "El cliente pagó el servicio",
    };

    var services = {        
        transfer_in: {
            description: "Transfer Aeropuerto-Hotel (In)",
            pax_price: { 1: 35, 2: 35, 3: 35, 4: 70, 5: 70, 6: 70, 7: 105, 8: 105, 9: 105 },
            pax_notes: {
                3: "Este transfer in requiere 1 solo auto.",
                6: "Este transfer in requiere 2 autos.",
                9: "Este transfer in requiere 3 autos.",
            },
            requires: ["date", "time", "flight", "airline", "fullname", "numAdult"]            
        },
        transfer_out: {
            description: "Transfer Hotel-Aeropuerto (Out)",
            pax_price: { 1: 35, 2: 35, 3: 35, 4: 70, 5: 70, 6: 70, 7: 105, 8: 105, 9: 105 },
            pax_notes: {
                3: "Este transfer out requiere 1 solo auto.",
                6: "Este transfer out requiere 2 autos.",
                9: "Este transfer out requiere 3 autos.",
            },
            requires: ["date", "time", "flight", "airline", "fullname", "numAdult"]
        },
        city_tour: {
            description: "City Tour Carro Clásico",
            pax_price: { 1: 75, 2: 110, 3: 135, 4: 180, 5: 225, 6: 270, 7: 315, 8: 360, 9: 405 },
            requires: ["date", "fullname", "numAdult"]
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

    

    const apiKey = booking_custom_settings.authentication.apiKey;
});