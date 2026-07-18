import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import * as express from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. ¡LA MAGIA DE CORS!
  // Le permite a un frontend (React, etc.) en otro origen consumir esta API.
  app.enableCors();
  // Si quisieras ser súper estricto en producción, harías esto:
  // app.enableCors({ origin: 'http://localhost:5173' });

  // Guardia Global de los DTOs (Etapa 2)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Borra automáticamente campos que no estén en el DTO
      forbidNonWhitelisted: true, // Lanza error si mandan campos extraños
      transform: true, // Transforma los payloads a instancias de la clase del DTO
    }),
  );

  // Servidor de archivos estáticos para las fotos de mascotas/clientes (Etapa 4)
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🐾 API Veterinaria corriendo en http://localhost:${port}`);
}
bootstrap();