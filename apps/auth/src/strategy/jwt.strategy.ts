import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configSvc: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) =>
          request?.headers?.authorization?.replace('Bearer ', '') ||
          request?.Authentication,
      ]),
      ignoreExpiration: false,
      _audience: configSvc.getOrThrow('cognito.clientId'),
      issuer: configSvc.getOrThrow('cognito.authority'),
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${configSvc.getOrThrow('cognito.authority')}/.well-known/jwks.json`,
      }),
    });
  }

  async validate(payload: any) {
    return {
      rol: payload?.['cognito:groups'][0],
      id: payload?.sub,
    };
  }
}
