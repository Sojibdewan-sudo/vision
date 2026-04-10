import { Handler } from "@netlify/functions";
import { handleAiRequest } from "../../lib/ai-service";

export const handler: Handler = async (event) =>
  handleAiRequest({
    method: event.httpMethod,
    headers: event.headers,
    body: event.body
  });
