let remote = (() => {
    const BASE_URL = "https://baas.kinvey.com/";
    const APP_KEY = "kid_HyiJQEf9m";
    const APP_SECRET = "a5ae7c7894344dfdbb23de4d4727b248";


    function makeAuth(auth) {
        if (auth === 'basic') {
            return `Basic ${btoa(APP_KEY + ":" + APP_SECRET)}`;
        } else {
            return `Kinvey ${sessionStorage.getItem('authtoken')}`
        }
    }


    function signUpUser(res, message) {
        auth.saveSession(res);
        $("#linkLogout > span").text("Welcome" + res.username + "!")
        showInfo(message)
        showHomeView();
    }

    function signInUser(res, message) {
        auth.saveSession(res)

        showInfo(message);
        showHomeView();

    }


    function makeRequest(method, module, endpoint, auth) {
        return {
            url: BASE_URL + module + '/' + APP_KEY + '/' + endpoint,
            method: method,
            headers: {
                'Authorization': makeAuth(auth)
            }

        }

    }


   

    function post(module, endpoint, auth, data, query) {
        let obj = makeRequest('POST', module, endpoint, auth);
        if (data) {
            obj.data = data;
        }
        return $.ajax(obj);
    }

   
    function put(module, endpoint, auth, data, id) {
        let obj = makeRequest('PUT', module, `${endpoint}/${id}`, auth);
        if (data) {
            obj.data = data;
        }
        return $.ajax(obj);
    }
    function get(model, endPoint, auth) {
        return $.ajax(makeRequest('GET', model, endPoint, auth));
    }

    function remove(model, endpoint, auth, data) {
        let obj = $.ajax(makeRequest('DELETE', model, endpoint, auth));

        return obj;
    }


    async function getAllPublicFlight() {
        return await $.ajax({
            method: 'GET',
            url: BASE_URL + 'appdata/' + APP_KEY + '/flights?query={"isPublic":"true"}',
            headers: {
                Authorization: 'Kinvey ' + sessionStorage.getItem('authToken')
            },
        }).then(function (res) {
            return res
        }).catch(err => {
            showError(err)
        })
    }

    async function getMyFlights() {
        return  $.ajax({
            method: 'GET',
            url: BASE_URL + 'appdata/' +
                APP_KEY + `/flights?query={"_acl.creator":"${sessionStorage.getItem("userId")}"}`,
            headers: {
                Authorization: 'Kinvey ' + sessionStorage.getItem('authToken')
            },
        })
    }

    function removeFlight(id) {
        $.ajax({
            method: 'DELETE',
            url: BASE_URL + 'appdata/' + APP_KEY + '/flights/' + id,
            headers: {
                Authorization: 'Kinvey ' + sessionStorage.getItem('authToken')
            },
        }).then(function () {
            showInfo("Flight deleted.")
            $("#linkFlights").trigger('click')
        }).catch(err => {
            showError(err)
        })
    }

    function editFlight(id, destination, origin, departureDate, departureTime, seats,
        cost, img, isPublic) {
        $.ajax({
            method: 'PUT',
            url: BASE_URL + 'appdata/' + APP_KEY + '/flights/' + id,
            headers: {
                Authorization: 'Kinvey ' + sessionStorage.getItem('authToken')
            },
            data: {
                destination,
                origin,
                departureDate,
                departureTime,
                seats,
                cost,
                img,
                isPublic
            }
        }).then(function (res) {
            showInfo("Successfully edited flight.")
            renderDetailsView(res)
        }).catch(err => {
            showError(err)
        })
    }


    return {
        get,
        post,
        remove,
        signInUser,
        signUpUser,
        put,
        getAllPublicFlight,
        getMyFlights,
        removeFlight,
        editFlight

    }
})()