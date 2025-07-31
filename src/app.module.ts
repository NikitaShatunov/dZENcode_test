import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CommentsModule,
    UsersModule,
    LocalAuthModule,
    OtpCodeModule,
    CacheModule.register({
      ttl: 5000, // 5 seconds
      max: 100,
      isGlobal: true,
      store: 'memory',
    }),
    EventEmitterModule.forRoot({}),
    LogsRecordsModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
