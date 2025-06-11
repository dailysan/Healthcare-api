export function expectOkResponse(response: any, statusCode: number = 200) {
  expect(response.status).toBe(statusCode);
  expect(response.body).toBeDefined();
}

export function expectArrayResponse(response: any) {
  expect(Array.isArray(response.body)).toBe(true);
}
