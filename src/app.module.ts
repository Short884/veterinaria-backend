import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientesModule } from './clientes/clientes.module';
import { MascotasModule } from './mascotas/mascotas.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Carga el archivo .env y lo hace disponible globalmente vía ConfigService
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Acá configuramos la conexión a MySQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', '127.0.0.1'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get<string>('DB_USERNAME', 'root'),
        password: config.get<string>('DB_PASSWORD', ''),
        database: config.get<string>('DB_DATABASE', 'veterinaria'),
        autoLoadEntities: true, // Carga automáticamente las entidades registradas en cada módulo
        synchronize: false, // false porque veterinaria.sql ya trae las tablas creadas
      }),
    }),

    ClientesModule,
    MascotasModule,
    UsuariosModule,
    AuthModule,
  ],
})
export class AppModule {}