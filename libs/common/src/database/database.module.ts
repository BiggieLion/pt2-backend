import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationModule } from '../configuration';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

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
        autoLoadEntities: true,
        logging: false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {
  static forFeature(entity: EntityClassOrSchema[]) {
    console.log('entity...', entity);
    return TypeOrmModule.forFeature(entity);
  }
}
