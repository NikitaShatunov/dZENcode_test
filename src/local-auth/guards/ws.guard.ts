import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { LocalAuthService } from '../local-auth.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private authService: LocalAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const client = context.switchToWs().getClient();
    // const token =
    //   client.handshake.auth?.token ||
    //   client.handshake.headers?.authorization?.split(' ')[1];

    // if (!token) {
    //   throw new WsException('Missing auth token');
    // }

    // const user = await this.authService.validateUser(token);
    // if (!user) {
    //   throw new WsException('Invalid token');
    // }

    // client.data.user = user;
    return true;
  }
}
