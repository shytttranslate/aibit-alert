import { Injectable } from '@nestjs/common';
import _ from 'lodash';
@Injectable()
export class UserAgentService {
  getFireFox() {
    return 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.10; rv:62.0) Gecko/20100101 Firefox/62.0';
  }
  getGoogle() {
    return 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';
  }
  getGoogleBrowser() {
    const userAgents = [
      {
        userAgent: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36`,
        'Sec-Ch-Ua-Platform': 'macOS',
        'Sec-Ch-Ua': `Not.A/Brand";v="8.0", "Chromium";v="114", "Google Chrome";v="114"`,
      },
      {
        userAgent: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36`,
        'Sec-Ch-Ua-Platform': 'Windows',
        'Sec-Ch-Ua': `Not.A/Brand";v="8.0", "Chromium";v="114", "Google Chrome";v="114"`,
      },
      {
        userAgent: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36`,
        'Sec-Ch-Ua-Platform': 'Windows',
        'Sec-Ch-Ua': `Not.A/Brand";v="8.0", "Chromium";v="113", "Google Chrome";v="113"`,
      },
      {
        userAgent: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36`,
        'Sec-Ch-Ua-Platform': 'Windows',
        'Sec-Ch-Ua': `Not.A/Brand";v="8.0", "Chromium";v="109", "Google Chrome";v="109"`,
      },
      {
        userAgent: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.3`,
        'Sec-Ch-Ua-Platform': 'macOS',
        'Sec-Ch-Ua': `Not.A/Brand";v="8", "Chromium";v="111", "Google Chrome";v="111"`,
      },
      {
        userAgent: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36`,
        'Sec-Ch-Ua-Platform': 'macOS',
        'Sec-Ch-Ua': `Not.A/Brand";v="8", "Chromium";v="111", "Google Chrome";v="113"`,
      },
    ];
    return _.sample(userAgents);
  }
}
