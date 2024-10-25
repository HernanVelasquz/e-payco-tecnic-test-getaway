import 'dotenv/config';
import * as joi from 'joi';

interface IEnvironment {
  PORT: number;
  REDIS_PORT: number;
  REDIS_HOST: string;
  REDIS_TIME_TTL: number;
  SERVICE_SOAP: string;
}

const environmentSchema = joi
  .object({
    PORT: joi.number().default(3000),
    REDIS_PORT: joi.number().required(),
    REDIS_HOST: joi.string().required(),
    REDIS_TIME_TTL: joi.number().required(),
    SERVICE_SOAP: joi.string().required(),
  })
  .unknown(true);

const { error, value } = environmentSchema.validate(process.env);

if (error) {
  throw new Error(
    `Config validation error: ${error.message} for environment not configured`,
  );
}

const environmentVariable: IEnvironment = value;

export const envs = {
  port: environmentVariable.PORT,
  redis: {
    host: environmentVariable.REDIS_HOST,
    port: environmentVariable.REDIS_PORT,
    ttl: environmentVariable.REDIS_TIME_TTL
  },
  serviceSoap: environmentVariable.SERVICE_SOAP,
};
