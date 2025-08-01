import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { CommentsModule } from './comments/comments.module';
import { UsersModule } from './users/users.module';
import { LocalAuthModule } from './local-auth/local-auth.module';
import { OtpCodeModule } from './otp-code/otp-code.module';
import { CacheModule } from '@nestjs/cache-manager';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LogsRecordsModule } from './logs-records/logs-records.module';
import { MediaModule } from './media/media.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CommentsModule,
    UsersModule,
    LocalAuthModule,
    OtpCodeModule,
    //For caching and throttling
    CacheModule.register({
      ttl: 5000, // 5 seconds
      max: 100,
      isGlobal: true,
      store: 'memory',
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'short',
          ttl: 60000, // 60 seconds in milliseconds
          limit: 10, // 10 requests per minute
        },
      ],
    }),
    EventEmitterModule.forRoot({}),
    LogsRecordsModule,
    MediaModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
