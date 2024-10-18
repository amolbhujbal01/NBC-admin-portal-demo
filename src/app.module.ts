import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AdminController } from './controllers/app.controller';
import { HttpModule } from '@nestjs/axios';  
import { TerminusModule } from '@nestjs/terminus';
import { AdminService } from './services/app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CustomLoggerService } from './common/loggers/logger.service';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './common/database/database.module';
import { Tenant } from './entities/tenant.entity';

@Module({
  imports: [ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'PATIENT_SERVICE', 
        transport: Transport.TCP,
        options: {
          host: 'patient-service.service.local',
          port: 4000,
        },
      },
    ]), 
    TypeOrmModule.forRoot(typeOrmConfig()),
    TypeOrmModule.forFeature([Tenant]),
    TerminusModule, HttpModule
  ],
  controllers: [AdminController],
  providers: [AdminService, CustomLoggerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); 
  }
}

