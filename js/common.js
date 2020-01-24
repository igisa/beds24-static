if (!window.booking_extras) window.booking_extras = {};

booking_extras.fields = {
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

booking_extras.services = {

    transfer_in: {
        description: "Transfer Aeropuerto-Hotel (In)",
        description_short: "Trans.IN",
        price:{
            ref: ["numCars"],
            selling_price: "ref * 35",
            cost: "ref * 25",
            commission: "ref * 5",
        },
        correlations:[
            {
                from: ["numAdult", "numChild"],
                to:"numCars",
                relation: "Math.ceil( from / 3)",
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
            ref: ["numCars"],
            selling_price: "ref * 200",
            cost: "ref * 160",
            commission: "ref * 5",
        },
        correlations:[
            {
                from: ["numAdult", "numChild"],
                to:"numCars",
                relation: "Math.ceil(from/3)",
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
            ref: ["numCars"],
            selling_price: "ref * 35",
            cost: "ref * 25",
            commission: "ref * 5",
        },
        correlations:[
            {
                from: ["numAdult", "numChild"],
                to:"numCars",
                relation: "Math.ceil(from/3)",
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
            ref: ["numChild", "numAdult"],
            selling_price: "({ 1: 75, 2: 110, 3: 135, 4: 180, 5: 225, 6: 270, 7: 315, 8: 360, 9: 405 })[ref]",
            cost: "({ 1: 61, 2:  77, 3:  93, 4: 109, 5: 145, 6: 166, 7: 182, 8: 198, 9: 214 })[ref]",
            commission: "ref * 3",
        },
        icon: "I-car-building",
        fields: ["status", "date", "fullname", "numAdult", "numChild", "country", "price", "seller", "payed", "notes"],
        provider_fields: ["status", "date", "fullname", "numAdult", "numChild", "country", "notes"],
        calendar_resume_fields: ["status", "date", "country", "payed"]
    }
}

booking_extras.methods = {

    get_price_value: function(service, value) {
        var desc = booking_extras.services[service.name];
        var ref = 0;
        for (let i = 0; i < desc.price.ref.length; i++) {
            const current = desc.price.ref[i];
            ref += parseFloat(service[current]);
        }
        var value = eval(desc.price[value]);
        return (value ? value : 0);
    },
    
    get_correlation_value: function (service, correlation) {
        var from = 0;
        for (let i = 0; i < correlation.from.length; i++) {
            const current = correlation.from[i];
            from += parseFloat(service[current]);
        }
        var value = eval(correlation.relation);
        return (value ? value : 0);
    },

    get_service_values: function(service_id) {
        var result = {
            id: $(`#${service_id}_id`).val(),
            name: $(`#${service_id}_name`).val()
        }
        var service = booking_extras.services[result.name];
        for (let i = 0; i < service.fields.length; i++) {
            const field_id = service.fields[i];
            result[field_id] = $(`#${service_id}_${field_id}`).val();
        }
        return result;
    }
};


booking_extras.constants = {

    separator: "--> DO NOT MODIFY OR INCLUDE ANY TEXT AFTER THIS <--"

}