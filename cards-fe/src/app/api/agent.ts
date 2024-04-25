import axios, { AxiosError, AxiosResponse } from "axios";
import { PaginatedResponse } from "../models/pagination";

axios.defaults.baseURL = "http://localhost:5000/api/";
axios.defaults.withCredentials = true;

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));
const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.response.use(
  async (response) => {
    await sleep();

    const pagination = response.headers["pagination"];
    if (pagination) {
      response.data = new PaginatedResponse(
        response.data,
        JSON.parse(pagination)
      );
    }

    return response;
  },
  (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse;

    return Promise.reject(error.response);
  }
);

const requests = {
  get: (url: string, params?: URLSearchParams) =>
    axios.get(url, { params }).then(responseBody),
  post: (url: string, body: object) => axios.post(url, body).then(responseBody),
  put: (url: string, body: object) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
};

const Class = {
  list: (params?: URLSearchParams) => requests.get("classes", params),
};

const Deck = {
  list: (params?: URLSearchParams) => requests.get("decks", params),
  deckById: (id: number) => requests.get(`decks/${id}`),
};

const agent = {
  Class,
  Deck,
};

export default agent;
