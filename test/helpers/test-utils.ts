export const expectOkResponse = (response: any, statusCode: number = 200) => {
  expect(response.status).toBe(statusCode);
  expect(response.body).toBeDefined();
};

export const expectErrorResponse = (response: any, statusCode: number = 500) => {
  expect(response.status).toBe(statusCode);
  expect(response.body).toBeDefined();
  expect(response.body.message).toBeDefined();
};

export const expectArrayResponse = (response: any) => {
  expect(Array.isArray(response.body)).toBe(true);
};
