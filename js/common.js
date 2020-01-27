if (!window.booking_extras) window.booking_extras = {};

booking_extras.fields = {
    status: {
        label: "Estado",
        type: "options",
        options: [
            { id: "created", show_logo: false, label: "Creado", },
            { id: "client_confirmed", show_logo: true, logo_color: "f1d700", label: "Cliente Confirmó" },
            { id: "provider_confirmed", show_logo: true, logo_color: "4d5ff9", label: "Proveedor Confirmó" },                
            { id: "client_cancelled", show_logo: true, logo_color: "e40000", label: "Cliente Canceló" },
            { id: "service_provided", show_logo: true, logo_color: "45ab45", label: "Servicio Realizado" },                
        ]
    },
    name: {
        label: "Servicio",
        type: "text",
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
        post_label: "cuc",
        is_number: true,
    },
    airline: {
        label:"Aerolinea",
        type: "text"
    },
    fullname:{
        label: "Nombre",
        type: "text",
    },
    numCars: {
        label: "Autos",
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
        is_number: true,
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
        is_number: true,
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
        is_number: true,
    },
    country:{
        label: "País",
        type: "text",
    }        
}

booking_extras.services = {

    transfer_in: {
        description: "Transfer Aeropuerto-Hotel (In)",
        description_short: "Trans.IN",
        price:{
            update_on: ["numCars"],
            cost: "$numCars * 25",
            selling_price: "$cost + $numCars * 10",
            commission: "$numCars * 5",
        },
        correlations:[
            {
                update_on: ["numAdult", "numChild"],
                to:"numCars",
                relation: "Math.ceil( ($numChild+$numAdult) / 3)",
            }
        ],
        icon: "I-plane-arrival",
        fields: ["status", "fullname", "numAdult", "numChild", "date", "flight", "time", "airline", "numCars", "price", "seller", "payed", "notes"],
        provider_fields: ["status", "fullname", "numAdult", "numChild", "date", "flight", "time", "airline", "numCars", "notes"],
        calendar_resume_fields: ["status", "date", "flight", "time", "airline", "payed"]
    },
    
    transfer_hav_tri: {
        description: "Transfer Habana-Trinidad",
        description_short: "Trans.HAB-TRI",
        price:{
            update_on: ["numCars"],
            cost: "$numCars * 160",
            selling_price: "$cost + $numCars * 40",
            commission: "$numCars * 5",
        },
        correlations:[
            {
                update_on: ["numAdult", "numChild"],
                relation: "Math.ceil( ($numChild+$numAdult) / 3)",
                to:"numCars",
            }
        ],
        icon: "I-taxi",        
        fields: ["status", "fullname", "numAdult", "numChild", "date", "time", "numCars", "price", "seller", "payed", "notes"],
        provider_fields: ["status", "fullname", "numAdult", "numChild", "date", "time", "numCars", "notes"],
        calendar_resume_fields: ["status", "date", "time", "payed"]
    },
    
    transfer_out: {
        description: "Transfer Hotel-Aeropuerto (Out)",
        description_short: "Trans.OUT",
        price:{
            update_on: ["numCars"],
            cost: "$numCars * 25",
            selling_price: "$cost + $numCars * 10",
            commission: "$numCars * 5",
        },
        correlations:[
            {
                update_on: ["numAdult", "numChild"],
                relation: "Math.ceil( ($numChild+$numAdult) /3)",
                to:"numCars",
            }
        ],
        icon: "I-plane-departure",
        fields: ["status", "fullname", "numAdult", "numChild", "date", "flight", "time", "airline", "numCars", "price", "seller", "payed", "notes"],
        provider_fields: ["status", "fullname", "numAdult", "numChild", "date", "flight", "time", "airline", "numCars", "notes"],
        calendar_resume_fields: ["status", "date", "flight", "time", "airline", "payed"]
    },
    
    city_tour: {
        description: "City Tour Carro Clásico",
        description_short: "City-Tour",
        price:{
            update_on: ["numChild", "numAdult"],
            selling_price: "({ 1: 75, 2: 110, 3: 135, 4: 180, 5: 225, 6: 270, 7: 315, 8: 360, 9: 405 })[ $numChild+$numAdult ]",
            cost: "({ 1: 61, 2:  77, 3:  93, 4: 109, 5: 145, 6: 166, 7: 182, 8: 198, 9: 214 })[ $numChild+$numAdult ]",
            commission: "($numChild+$numAdult) * 3",
        },
        icon: "I-car-building",
        fields: ["status", "date", "fullname", "numAdult", "numChild", "country", "price", "seller", "payed", "notes"],
        provider_fields: ["status", "date", "fullname", "numAdult", "numChild", "country", "notes"],
        calendar_resume_fields: ["status", "date", "country", "payed"]
    }
}

booking_extras.methods = {

    get_service_field_pretty_value: function(service, field){
        var value = service[field];

        if(field==="name"){
            value = booking_extras.services[value].description;
        }
        else if (fields[field].type === "options") {
            for (let o = 0; o < fields[field].options.length; o++) {
                const option = fields[field].options[o];
                if (option.id === service[field]) {
                    value = option.label;
                    break;
                }
            }
        }

        return value;
    },

    get_price_value: function(service, value) {
        var desc = booking_extras.services[service.name];
        function function_eval(code) { return Function('"use strict";return (' + code + ')'); };
        
        service.cost = function_eval(desc.price.cost.replace(/\$/g, "this.")).call(service);
        service.selling_price = function_eval(desc.price.selling_price.replace(/\$/g, "this.")).call(service);
        service.commission = function_eval(desc.price.commission.replace(/\$/g, "this.")).call(service);

        var result = service[value];

        delete service.cost;
        delete service.selling_price;
        delete service.commission;

        return (result ? result : 0);
    },
    
    get_correlation_value: function (service, correlation) {
        function function_eval(code) { return Function('"use strict";return (' + code + ')'); };
        var result = function_eval(correlation.relation.replace(/\$/g, "this.")).call(service);
        return (result ? result : 0);
    },

    get_service_values: function(service_id) {
        var result = {
            id: $(`#${service_id}_id`).val(),
            name: $(`#${service_id}_name`).val()
        }
        var service = booking_extras.services[result.name];
        for (let i = 0; i < service.fields.length; i++) {
            const field_id = service.fields[i];
            const value = $(`#${service_id}_${field_id}`).val();
            if (booking_extras.fields[field_id].is_number){
                result[field_id] = (!value||value==="")?0:parseFloat(value);
            }
            else{
                result[field_id] = value;
            }
        }
        return result;
    }
};


booking_extras.constants = {

    separator: "--> DO NOT MODIFY OR INCLUDE ANY TEXT AFTER THIS <--"

}