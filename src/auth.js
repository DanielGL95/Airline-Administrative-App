let auth = (() => {

    function saveSession(userData) {
        sessionStorage.setItem('username', userData.username);
        sessionStorage.setItem('userId', userData._id);
        sessionStorage.setItem('authtoken', userData._kmd.authtoken);
    }

    function isAuth() {
        return sessionStorage.getItem('authtoken') !== null;
    }

    function login(username, password) {

        return remote.post('user', 'login', 'basic', { username, password })

    }

    function register(username, password) {
        return remote.post('user', '', 'basic', { username, password })

    }

    function logout() {
        return remote.post('user', '_logout', 'kinvey', { authtoken: sessionStorage.getItem('authtoken') });

    }

    return {
        isAuth,
        login,
        register,
        logout,
        saveSession
    }
})()