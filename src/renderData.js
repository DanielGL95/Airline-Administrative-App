function renderHomeView(flights) {
    $("#viewCatalog > div > a").remove();

    for (let flight of flights) {
        let a = $('<a href="" class="added-flight"></a>').on('click', (e) => {
            e.preventDefault();
            renderDetailsView(flight);
        })
        a.append(`<img src=${flight.img} alt="" class="picture-added-flight">`);
        a.append(`<h3>${flight.destination}</h3>`);
        a.append(`<span>${flight.origin}</span><span>${flight.departureDate}</span>`);
        $('#viewCatalog > div').append(a);

    }
}

function renderDetailsView(flight) {
    hideAllViews();
    $('#viewFlightDetails').show();
    $('#viewFlightDetails>div').remove();
    $('#viewFlightDetails').attr('flightId', flight._id);

    let ticketArea = $(' <div class="ticket-area"></div>');

    let imgDiv = $(`<div class="ticket-area-left">
    <img  src=${flight.img} alt="">
    </div>`);

    let infoDiv = $(` <div class="ticket-area-right">
    <h3 class="distination">${flight.destination}</h3>
    <div class = "origin">from ${flight.origin}</div>
    <div class="data-and-time">
    ${flight.departureDate}`);


    let a = $(`<a href="" class="edit-flight-detail"></a>`).on('click', (e) => {
        e.preventDefault();
        hideAllViews();
        renderEditView();
    })
    let lastDiv = (`</div>
        <div class = "seats">
            ${flight.seats} Seats (${flight.cost} per seat)
        </div>
        </div>`);


    infoDiv.append(a);
    infoDiv.append(lastDiv);
    ticketArea.append(imgDiv);
    ticketArea.append(infoDiv);
    $('#viewFlightDetails').append(ticketArea)


}

function renderEditView() {
    $('#viewEditFlight').show();
    let flightId = $('#viewFlightDetails').attr('flightId');

    remote.get('appdata', `flights/${flightId}`, `kinvey`).then(flight => {

        $("#formEditFlight > input[name=destination]").val(flight.destination);
        $("#formEditFlight > input[name=origin]").val(flight.origin);
        $("#formEditFlight > input[name=departureDate]").val(flight.departureDate);
        $("#formEditFlight > input[name=departureTime]").val(flight.departureTime);
        $("#formEditFlight > input[name=seats]").val(Number(flight.seats));
        $("#formEditFlight > input[name=cost]").val(Number(flight.cost));
        $("#formEditFlight > input[name=img]").val(flight.img);
        $("#formEditFlight > input[name=public]").is(":checked");


    })


}
//



function renderMyFlights(flights) {
    $('#viewMyFlights > div').remove()
    for (const f of [...flights]) {
        let mainDiv = $(`<div class="flight-ticket"></div>`)
        mainDiv.append($(`<div class="flight-left"><img src="${f.img}" alt=""></div>`))
        let innerDiv = $('<div class="flight-right"></div>')
        innerDiv.append(`
            <div>
                <h3>${f.destination}</h3><span>${f.departureDate}</span>
            </div>
            <div>
                from ${f.origin} <span>${f.departureTime}</span>
            </div>
            <p>${f.seats} Seats (${f.cost}$ per seat) </p>`)
        innerDiv.append($(`<a href="#" class="remove">REMOVE</a>`).on('click', function (event) {
            remote.remove('appdata', `flights/${f._id}`);
            showInfo("Flight deleted.")
            $("#linkFlights").trigger('click')
        }))
        innerDiv.append($(`<a href="#" class="details">Details</a>`).on('click', function (event) {
            renderDetailsView(f)
        }))
        mainDiv.append(innerDiv)
        $('#viewMyFlights').append(mainDiv)
    }
}