import { Request } from 'express';

export const getMockRequest = (user: any): Request => {
  return {
    user,
    get: jest.fn(),
    header: jest.fn(),
    accepts: jest.fn(),
    acceptsCharsets: jest.fn(),
  } as unknown as Request;
};