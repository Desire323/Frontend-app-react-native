import ApiManager from "./ApiManager";

const auth_login = async data => {
    try {
        const response = await ApiManager.post('/auth/login', data);
        return response;
    } catch (error) {
        return error.response.data;
    }
}

const auth_register = async data => {
    try {
        const response = await ApiManager.post('/auth/register', data);
        return response;
    } catch (error) {
        return error.response.data;
    }
}

export { auth_login, auth_register };
