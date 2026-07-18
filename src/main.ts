import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import * as express from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cors
  // Le permite a un frontend (React, etc.) en otro origen consumir esta API.
  app.enableCors();


  // Guardia Global de los DTOs
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