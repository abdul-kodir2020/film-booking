//src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UsersService) {
    const secret = process.env.JWT_SECRET
    if(!secret) throw new Error("La variable JWT_SECRET n'est pas défini dans les variables d'evironnement !")

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: { userId: string }, request: Request) {
    const user = await this.userService.findOne(payload.userId);
    request.user = user;
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
