import ApiManager from "./ApiManager";

const getPerson = async (id, token) => {
    try {
        const response = await ApiManager.get(`/persons/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return response.data ? response.data : response;
    } catch (error) {
        return error.response && error.response.data ? error.response.data : error;
    }
}

const getAllPersons = async (token) => {
    try {
        const response = await ApiManager.get('/persons', {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return response.data ? response.data : response;
    } catch (error) {
        return error.response && error.response.data ? error.response.data : error;
    }
}

const createPerson = async (person, token) => {
    try {
        const response = await ApiManager.post('/persons', person, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return response.data ? response.data : response;
    } catch (error) {
        return error.response && error.response.data ? error.response.data : error;
    }
}

const makeFriends = async (currentUserId, friendId, token) => {
    try {
        const response = await ApiManager.put(`/persons/${friendId}`, null, {
            headers: { 
                "x-auth-user-id": currentUserId,
                'Authorization': `Bearer ${token}` 
            },
        });
        return response.data ? response.data : response;
    } catch (error) {
        return error.response && error.response.data ? error.response.data : error;
    }
}

const getFriends = async (id, token) => {
    try {
        const response = await ApiManager.get(`/persons/${id}/friends`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        return response.data ? response.data : response;
    } catch (error) {
        return error.response && error.response.data ? error.response.data : error;
    }
}

export { getPerson, getAllPersons, createPerson, makeFriends, getFriends };
