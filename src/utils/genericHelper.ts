import { AxiosResponse } from 'axios';

export function parseApiResponse(responseBody: AxiosResponse | undefined) {
  const parsedResponse = JSON.parse(JSON.stringify(responseBody));
  return parsedResponse;
}
