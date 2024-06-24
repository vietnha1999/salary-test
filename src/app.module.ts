import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { BalanceModule } from './balance/balance.module';
import { EnvironmentVariables } from './env';
import type { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService<EnvironmentVariables>,
      ) => ({
        store: await redisStore({
          ttl: 5000, // 5 seconds
          socket: {
            host: configService.get('REDIS_HOST', { infer: true }),
            port: configService.get('REDIS_PORT', { infer: true }),
          },
        }),
      }),
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async (
        configService: ConfigService<EnvironmentVariables>,
      ) => ({
        uri: configService.get('MONGODB_URI', { infer: true }),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    BalanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
