export interface Proxy {
  username?: string;
  password?: string;
  host: string;
  port: number;
  microsoft_web_lastChecked?: string;
  microsoft_data?: string;
  service?: boolean;
  gce_cookie?: string;
  gce_status?: string;
  gce_last_checked?: string;
}
export const REDIS_PROXY_PREFIX_KEY = 'PROXY';
export enum PROXY_HOOK {
  PROXY_DIE = 'PROXY_DIE',
}

export interface onProxyDie {
  onProxyDie(proxy: Partial<Proxy>): any;
  listenProxyHook(): any;
}
export interface onProxyQuality {
  onProxyQuality(proxy: Partial<Proxy>): any;
  listenProxyHook(): any;
}
