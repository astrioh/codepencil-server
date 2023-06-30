export type Config = {
  ENV: string;
  IS_DEV: boolean;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
};

const CONFIG_ENV = {
  ENV: process.env.NODE_ENV,
  IS_DEV:
    typeof process.env.NODE_ENV === 'undefined' ||
    process.env.NODE_ENV === 'development',

  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
};

const parseConfig = (config: Partial<Config>): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }

  return config as Config;
};

export const CONFIG = parseConfig(CONFIG_ENV);
