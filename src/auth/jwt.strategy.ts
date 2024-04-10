/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { authConstants } from "./auth.constants";
import { ExtractJwt, Strategy } from "passport-jwt";


@Injectable()
export class JwtStratey extends PassportStrategy(Strategy) {
    constructor() {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          ignoreExpiration: false,
          secretOrKey: authConstants[0].secretKey,
        });
      }
    
      async validate(payload: any) {
        return { userId: payload._id, fullname: payload.fullname };
      }
}