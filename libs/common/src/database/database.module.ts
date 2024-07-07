import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationModule } from '../configuration';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigurationModule],
      useFactory: (configSvc: ConfigService) => ({
        type: 'postgres',
        host: configSvc.getOrThrow('database.host'),
        port: configSvc.getOrThrow('database.port'),
        username: configSvc.getOrThrow('database.username'),
        password: configSvc.getOrThrow('database.password'),
        database: configSvc.getOrThrow('database.database'),
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
