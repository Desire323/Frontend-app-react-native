import ApiManager from "./ApiManager";

const fortune_random = async (token) => {
    try {
        const response = await ApiManager.get('/fortune/random', {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data ? response.data : response;
    } catch (error) {
        return error.response && error.response.data ? error.response.data : error;
    }
}

export default fortune_random;
