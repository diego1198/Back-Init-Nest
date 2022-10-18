import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { get } from 'lodash';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: get(process, 'env.DB_HOST', ''),
      port: +get(process, 'env.DB_PORT', '3306'),
      username: get(process, 'env.DB_USER', ''),
      password: get(process, 'env.DB_PASSWORD', ''),
      database: get(process, 'env.DB_NAME', ''),
      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
