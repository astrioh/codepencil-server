export type Config = {
  DATABASE_URL: string;
  JWT_SECRET: string;
  CORS_ORIGIN: string;
};

const CONFIG_ENV = {
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
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
