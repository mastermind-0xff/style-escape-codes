import { getEnv } from './utils';

const SEC_ENABLED =
  String(getEnv('SEC_ENABLED')).toLowerCase() === 'false' ? false : true;

export const SecSettings = {
  enabled: SEC_ENABLED,
};
