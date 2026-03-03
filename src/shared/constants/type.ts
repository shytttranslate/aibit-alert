import { Request, Response } from 'express';
export type RequestExtra = Request & {
  startTime: number;
  id: string;
};
// export class RequestExtra extends Request {
//   startTime: number;
//   id: string;
// }
