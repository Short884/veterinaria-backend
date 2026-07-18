import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  // Le inyectamos el JwtService para poder verificar las firmas
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    // 1. Extraemos el token de la cabecera
    const token = this.extractTokenFromHeader(request);

    // 2. Si no viene ningún token, ¡luz roja!
    if (!token) {
      throw new UnauthorizedException('No se proporcionó un token de autenticación');
    }

    try {
      // 3. Verificamos el token con nuestra palabra súper secreta
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET ?? 'PALABRA_SUPER_SECRETA_VETERINARIA_2026',
      });

      // 4. Inyectamos los datos del usuario en la petición para que los controladores lo conozcan
      (request as any)['user'] = payload;
    } catch {
      // Si el token expiró o la firma no coincide, ¡luz roja!
      throw new UnauthorizedException('Token inválido o expirado');
    }

    // 5. Si todo está perfecto, ¡luz verde!
    return true;
  }

  // Función auxiliar para sacar el token del formato "Bearer <token>"
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}