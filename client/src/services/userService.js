import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000'

const apiEndpoint = baseURL + '/api/users';

export const register = async userInput => {
    return await axios.post(apiEndpoint, userInput);
}

export const getUsers = () => {
    return axios.get(apiEndpoint);
}