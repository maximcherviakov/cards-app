import axios, { AxiosError, AxiosResponse } from "axios";
import { PaginatedResponse } from "../models/pagination";
import { router } from "../router/Routes";
import { store } from "../store/configureStore";

axios.defaults.baseURL = "http://localhost:5000/api/";
axios.defaults.withCredentials = true;

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));
const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use((config) => {
  const token = store.getState().account.user?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

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
    const { status } = error.response as AxiosResponse;

    switch (status) {
      case 401:
        router.navigate("/unauthorized");
        break;
      case 404:
        router.navigate("/not-found");
        break;
    }

    return Promise.reject(error.response);
  }
);

const requests = {
  get: (url: string, params?: URLSearchParams) =>
    axios.get(url, { params }).then(responseBody),
  getRawData: (url: string) =>
    axios.get(url, { responseType: "arraybuffer" }).then(responseBody),
  getRawDataWithParams: (url: string, params?: URLSearchParams) =>
    axios
      .get(url, { params, responseType: "arraybuffer" })
      .then(responseBody),
  post: (url: string, body: object) => axios.post(url, body).then(responseBody),
  postWithParams: (url: string, body: object, params: URLSearchParams) =>
    axios.post(url, body, { params }).then(responseBody),
  put: (url: string, body: object) => axios.put(url, body).then(responseBody),
  putWithParams: (url: string, body: object, params: URLSearchParams) =>
    axios.put(url, body, { params }).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
};

const Class = {
  list: (params?: URLSearchParams) => requests.get(`classes`, params),
  listForCurrentUser: () => requests.get(`classes/current-user`),
  classById: (id: number) => requests.get(`classes/${id}`),
  createClass: (values: any) => requests.post(`classes`, values),
  updateClass: (id: number, values: any) => requests.put(`classes/${id}`, values),
  deleteClass: (id: number) => requests.delete(`classes/${id}`),
};

const Deck = {
  list: (params?: URLSearchParams) => requests.get(`decks`, params),
  listForCurrentUser: () => requests.get(`decks/current-user`),
  deckById: (id: number) => requests.get(`decks/${id}`),
  createDeck: (values: any) => requests.post(`decks`, values),
  updateDeck: (id: number, values: any) => requests.put(`decks/${id}`, values),
  deleteDeck: (id: number) => requests.delete(`decks/${id}`),
  assignToClass: (values: any) => requests.put(`decks/assign-to-class`, values),
  removeFromClass: (values: any) => requests.put(`decks/remove-from-class`, values),
};

const Card = {
  createCard: (id: number, values: any, params: URLSearchParams) =>
    requests.postWithParams(`cards/${id}`, values, params),
  getImage: (fileName: string) =>
    requests.getRawData(`cards/image/${fileName}`),
  updateCard: (id: number, values: any, params: URLSearchParams) =>
    requests.putWithParams(`cards/${id}`, values, params),
  deleteCard: (id: number) => requests.delete(`cards/${id}`),
};

const User = {
  login: (values: any) => requests.post(`user/login`, values),
  register: (values: any) => requests.post(`user/register`, values),
  currentUser: () => requests.get(`user/currentUser`),
};

const Proxy = {
  textToSpeech: (params?: URLSearchParams) =>
    requests.getRawDataWithParams(`proxy/text-to-speech`, params),
};

const agent = {
  Class,
  Deck,
  Card,
  User,
  Proxy,
};

export default agent;
