import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config.js';
import { HTTPError } from '../errors/errors.js';

const salt = 10;

// Se llama auth porque servirá para authenticate y authorize
export interface TokenPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

export class Auth {
  static createJWT(payload: TokenPayload) {
    // Podríamos no hacer la guarda y hacer una aserción de tipo en este caso
    return jwt.sign(payload, config.secret as string);
  }

  static getTokenPayload(token: string): TokenPayload {
    // Nuestro método verify devuelve un string si no es válido y un objeto con el payload si es correcto
    const verify = jwt.verify(token, config.secret as string);
    if (typeof verify === 'string')
      throw new HTTPError(498, 'Token invalid', verify);
    return verify as TokenPayload;
  }

  // Como no necesitamos el valor de la promesa, nos ahorramos el async - await en el proceso de encriptado

  static hash(value: string) {
    return bcrypt.hash(value, salt);
  }

  static compare(value: string, hash: string) {
    return bcrypt.compare(value, hash);
  }
}
