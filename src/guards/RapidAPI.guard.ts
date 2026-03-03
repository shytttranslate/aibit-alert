import { Injectable, CanActivate, ExecutionContext, HttpException, ForbiddenException } from '@nestjs/common';
import { getClientIp } from 'request-ip';
import { Observable } from 'rxjs';

const secrets = [
  '5cf048c0-13ba-11ee-a37b-d799f0284f13',
  '95ad9000-0b90-11ee-8b8e-f7d944f95b94',
  'Y29tLnRhcF90b190cmFuc2xhdGUuc25hcF90cmFuc2xhdGU=',
  'Y29tLnJlY29nbml6ZV90ZXh0LnRyYW5zbGF0ZS5zY3JlZW4=',
  'com.huynt.screentranslator',
];
@Injectable()
export class RedirectBadRequest extends HttpException {
  constructor() {
    super(`Pricing: https://rapidapi.com/aibitranslator-aibitranslator-default/api/aibit-translator/pricing`, 302);
  }
}
export class RapidAPIGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const isValid = this._validateRequest(request);
    const ip = getClientIp(request);
    const blockedIps = ['171.223.161.182'];
    if (blockedIps.includes(ip)) {
      throw new ForbiddenException();
    }
    if (!isValid) {
      throw new RedirectBadRequest();
    }
    return true;
  }
  _validateRequest(request: any): boolean {
    const secret = request.headers['x-rapidapi-proxy-secret'] || request.headers['x-aibit-key'];
    const isValid = secret && secret.length && secrets.includes(secret);
    return isValid;
  }
}
