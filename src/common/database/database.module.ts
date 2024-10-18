import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Tenant } from 'src/entities/tenant.entity';
import * as dotenv from 'dotenv';

dotenv.config();
export const typeOrmConfig = (): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: process.env.DB_HOST || (() => { throw new Error('DB_HOST is not defined'); })(),
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        username: process.env.DB_USER || (() => { throw new Error('DB_USER is not defined'); })(),
        password: process.env.DB_PASSWORD || (() => { throw new Error('DB_PASSWORD is not defined'); })(),
        database: process.env.DB_NAME || (() => { throw new Error('DB_NAME is not defined'); })(),
        entities: [ Tenant ],
        synchronize: false,
  }
);