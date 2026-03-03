import { Test, TestingModule } from '@nestjs/testing';
import { TestModule } from '../test/test.module';
import { SharedModule } from '../shared.module';
import { PubsubService } from '../pubsub/pubsub.service';
import { RequestService } from './request.service';
import { Proxy } from '../proxy-manager/types';
jest.setTimeout(60 * 1000);
describe('Request Service', () => {
  let module: TestingModule;
  let requestService: RequestService;
  let pubsub: PubsubService;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [SharedModule, TestModule],
    }).compile();
    pubsub = module.get<PubsubService>(PubsubService);
    requestService = module.get<RequestService>(RequestService);
  });
  afterEach(async () => {
    jest.clearAllMocks();
  });
  it(`should able to timeout proxy connection`, async () => {
    const proxy: Proxy = {
      host: '154.0.157.10',
      port: 8080,
    };
    const [client] = await requestService.generate({
      proxy,
      axiosConfig: {
        timeout: 3000,
        signal: AbortSignal.timeout(3000),
      },
    });
    jest.spyOn(pubsub, 'publish');
    try {
      await client.get(`https://google.com`, {});
    } catch (err) {
      console.error(err);
    }
    expect(pubsub.publish).toBeCalledTimes(1);
  });

  it(`should able to detect invalid proxy`, async () => {
    const proxy: Proxy = {
      host: '0.0.0.0',
      port: 321,
    };
    const [client] = await requestService.generate({
      proxy,
    });
    jest.spyOn(pubsub, 'publish');
    try {
      await client.get(`https://google.com`, {});
    } catch (err) {
      console.error(err);
    }
    expect(pubsub.publish).toBeCalledTimes(1);
  });
  it(`should able to detect died proxy`, async () => {
    const proxy: Proxy = {
      host: '127.0.0.1',
      port: 3000,
    };
    const [client] = await requestService.generate({
      proxy,
    });
    jest.spyOn(pubsub, 'publish');
    try {
      await client.get(`https://google.com`, {});
    } catch (err) {
      console.error(err);
    }
    expect(pubsub.publish).toBeCalledTimes(1);
  });
});
