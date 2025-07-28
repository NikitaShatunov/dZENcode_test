import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { CommentsModule } from './comments/comments.module';
import { UsersModule } from './users/users.module';
import { LocalAuthModule } from './local-auth/local-auth.module';
import { OtpCodeModule } from './otp-code/otp-code.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CommentsModule,
    UsersModule,
    LocalAuthModule,
    OtpCodeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
