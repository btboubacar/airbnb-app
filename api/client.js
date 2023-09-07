import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb",
});

export default apiClient;
