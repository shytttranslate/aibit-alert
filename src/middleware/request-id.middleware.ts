import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { RequestExtra } from '~@/shared/constants/type';
@Injectable()
export class RequestID implements NestMiddleware {
  // eslint-disable-next-line @typescript-eslint/ban-types
  use(req: RequestExtra, res: Response, next: Function) {
    req.startTime = Date.now();
    // const user = req.headers['x-mashape-user'];
    // if (user && user.includes('sakura')) {
    //   res.json({
    //     isSuccess: false,
    //     reason:
    //       'you are blocked. please contact thinhpham12051996@gmail.com to know the detail',
    //   });
    //   return;
    // }
    req.id = uuidv4();
    res.header('aibit-request-id', req['id']);
    next();
  }
}
