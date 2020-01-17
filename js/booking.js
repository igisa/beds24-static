
var booking_custom_settings = {
    authentication: {
        apiKey: "5yOTvQPuhAMPXTzBL2zeBcelgOH40KEN",
        100042: "8CUM6y7MXGEvCV7UbGCo7XJl4YXvorcY",
        99848: "cwmKN99w5XDzj1JKL4iKAKQfifI3Tgvj"
    }
}


$(function () {

    //on beds24 booking config there should be the following config variables:
    if (!booking_custom_settings ||
        !booking_custom_settings.authentication ||
        !booking_custom_settings.authentication.apiKey
    ) {
        return;
    }

    const apiKey = booking_custom_settings.authentication.apiKey;
});