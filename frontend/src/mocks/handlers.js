import { http, HttpResponse } from "msw";
import { config } from "../Constants";
import { mockLeftChars } from "./characters";

export const handlers = [
  http.get(`${config.url.BASE_URL}/finds`, () => {
    return HttpResponse.json(mockLeftChars.getChars());
  }),
];
