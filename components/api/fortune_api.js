import ApiManager from "./ApiManager";

const fortune_random = async (token) => {
    try {
        const response = await ApiManager.post('/fortune/random', {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data ? response.data : response;
    } catch (error) {
        return error.response && error.response.data ? error.response.data : error;
    }
}

const fortune_history = async (token) => {
    try {
        const response = await ApiManager.get('/fortune/history', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data ? response.data : response;
    } catch (error) {  
        return error.response && error.response.data ? error.response.data : error;
    }
}

const fortune_history_last = async (token) => {
    try {
        const response = await ApiManager.get('/fortune/history/last', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data ? response.data : response;
    } catch (error) {
        return error.response && error.response.data ? error.response.data : error;
    }
}

export { fortune_random, fortune_history, fortune_history_last };
