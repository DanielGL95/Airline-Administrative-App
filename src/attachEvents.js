function showHidenLinks() {

    hideAllLinks();

    if (sessionStorage.getItem('authtoken')) {
        $("#linkFlights").show();
        $("#divLogout").show();
    } else {
        $("#linkLogin").show();
        $("#linkRegister").show();
    }
}

function hideAllLinks() {
    $("#linkFlights").hide();
    $("#divLogout").hide();
    $("#linkLogin").hide();
    $("#linkRegister").hide();
}

function hideAllViews() {
    $("#container > section").hide();
}

function attachLinkEvents() {
    $("#linkFlights").on("click", function () {
        hideAllViews()
     remote.get('appdata','flights','kinvey').then(flights=>{
        renderMyFlights(flights);
     })
       
        $('#viewMyFlights').show()
    });
    $("#divLogout").on("click", () => {

    });
    $("#linkLogin").on("click", () => {
        hideAllViews();
        $("#viewLogin").show()
    });
    $("#linkRegister").on("click", () => {
        hideAllViews();
        $("#viewRegister").show()
    });
    $("#linkHome").on("click", (e) => {
        e.preventDefault();
        hideAllViews();
        showHomeView();
    });
    $("#viewCatalog > a[class=add-flight]").on("click", (e) => {
        e.preventDefault();
        hideAllViews();
        $("#viewAddFlight").show();
    });
}

function showHomeView() {
    $("#username").text("Welcome " + sessionStorage.getItem('username') + "!");
    hideAllViews();
    showHidenLinks();
    $("#viewCatalog >div>a").hide();
    if (sessionStorage.getItem('authtoken')) {
        listFlights();
    } else {
        $("#viewCatalog").show();
        $("#viewCatalog>a").hide();

    }


}

function attachButtonEvents() {
    $("#formRegister").on("submit", (e) => {
        e.preventDefault();
        let username = $("#formRegister > input[name=username]").val();
        let password = $("#formRegister > input[name=pass]").val();
        let checkPassword = $("#formRegister > input[name=checkPass]").val();

        if (username.length < 5 && password === checkPassword && password) {
            auth.register(username, password).then(res => {
                remote.signUpUser(res, "Successfull registration")
            });
        }

    })

    $("#formLogin").on('submit', (e) => {
        e.preventDefault();
        let username = $("#formLogin > input[name=username]").val();
        let password = $("#formLogin > input[name=pass]").val();

        auth.login(username, password).then(res => {
            remote.signInUser(res, "Successfull Login");
        })

    })

    $('#divLogout > a').on('click', (e) => {
        e.preventDefault();
        auth.logout().then(res => {

            sessionStorage.clear();
            showHomeView();
            showInfo("Successfull Logout")
        })
    })

    $("#formAddFlight > input[type=submit]").on('click', (e) => {
        e.preventDefault();
        let destination = $("#formAddFlight > input[name=destination]").val();
        let origin = $("#formAddFlight > input[name=origin]").val();
        let departureDate = $("#formAddFlight > input[name=departureDate]").val();
        let departureTime = $("#formAddFlight > input[name=departureTime]").val();
        let seats = $("#formAddFlight > input[name=seats]").val();
        let cost = $("#formAddFlight > input[name=cost]").val();
        let img = $("#formAddFlight > input[name=img]").val();
        let isPublic = $("#formAddFlight > input[name=public]").is(":checked");

        if (destination && origin && departureDate && departureTime && seats && cost) {
            remote.post('appdata', 'flights', 'Kinvey', {
                destination,
                origin,
                departureDate,
                departureTime,
                departureTime,
                seats,
                cost,
                img,
                isPublic
            }).then(flight => {
                showHomeView();
                showInfo('Created Flight');
                $('#formAddFlight').trigger('reset')

            }).catch(err => {
                showError(err)
            })
        } else {
            showError("Please fill in all the fields");
        }
    })

    $('#formEditFlight').on('submit', (e) => {
        e.preventDefault();
        let flightId = $('#viewFlightDetails').attr('flightId');
        let destination = $("#formEditFlight > input[name=destination]").val();
        let origin = $("#formEditFlight > input[name=origin]").val();
        let departureDate = $("#formEditFlight > input[name=departureDate]").val();
        let departureTime = $("#formEditFlight > input[name=departureTime]").val();
        let seats = $("#formEditFlight > input[name=seats]").val();
        let cost = $("#formEditFlight > input[name=cost]").val();
        let img = $("#formEditFlight > input[name=img]").val();
        let isPublic = $("#formEditFlight > input[name=public]").is(":checked");

        remote.put('appdata', `flights`, 'kinvey', {
            destination,
            origin,
            departureDate,
            departureTime,
            seats,
            cost,
            img,
            isPublic
        }, flightId).then(flight => {
            hideAllViews();
            showHomeView();
            showInfo("Successfully Updated Flight")


        }).catch(err => {
            showError(err)
        });
    })
}

function listFlights() {

    remote.get('appdata', 'flights', 'kinvey', {
        'isPublic': 'true'
    }).then(flights => {
        $("#viewCatalog").show();
        $("#viewCatalog>a").show();
        renderHomeView(flights)
    })
}