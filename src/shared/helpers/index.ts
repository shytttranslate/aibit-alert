import { AxiosError, CanceledError } from 'axios';
import _ from 'lodash';
import { Proxy } from '~@/shared/proxy-manager/types';
import retry from 'async-retry';

export type StatusList = 'die' | 'timeout' | '429';

export const getAxiosProxyStatus = (payload: AxiosError): StatusList => {
  const proxyCheckedData: any = _.get(payload, 'config.current-proxy');
  if (!proxyCheckedData) return null;
  if (proxyCheckedData.isBadProxy) return 'die';
  if (proxyCheckedData.isTimeout) return 'timeout';
  if (proxyCheckedData.is429) return '429';
};

export const betterRetry = async (retryFunc, finallyFunc, retryconfig: retry.Options) => {
  try {
    return await retry(retryFunc, {
      ...retryconfig,
    });
  } catch {
    return finallyFunc();
  }
};
