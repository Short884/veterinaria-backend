import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { MascotasService } from './mascotas.service';
import { CreateMascotaDto } from './dto/create-mascota.dto';
import { UpdateMascotaDto } from './dto/update-mascota.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

// Configuración reutilizable de Multer para las fotos de mascotas
const fotoMascotaInterceptor = FileInterceptor('foto', {
  storage: diskStorage({
    destination: './uploads/mascotas',
    filename: (req, file, callback) => {
      // Generamos un nombre único para que no se sobrescriban archivos
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      callback(null, `mascota-${uniqueSuffix}${ext}`);
    },
  }),
});

@Controller('mascotas')
@UseGuards(AuthGuard, RolesGuard) // ¡Ojo al orden! Primero AuthGuard (valida token) y luego RolesGuard (valida rol)
export class MascotasController {
  constructor(private readonly mascotasService: MascotasService) {}

  @Post()
  // Cualquier usuario logueado puede registrar una mascota (no tiene @Roles)
  @UseInterceptors(fotoMascotaInterceptor)
  create(
    @Body() createMascotaDto: CreateMascotaDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      createMascotaDto.foto = file.filename;
    }
    return this.mascotasService.create(createMascotaDto);
  }

  @Get()
  findAll() {
    // Cualquier usuario logueado (cliente, veterinario o admin) puede ver la lista
    return this.mascotasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mascotasService.findOne(+id);
  }

  @Get('cliente/:clientesId')
  findByCliente(@Param('clientesId') clientesId: string) {
    // Útil para el frontend: mostrar todas las mascotas de un cliente en su ficha
    return this.mascotasService.findByCliente(+clientesId);
  }

  @Patch(':id')
  @Roles('admin', 'veterinario') // Solo el personal puede editar historia clínica, raza, etc.
  @UseInterceptors(fotoMascotaInterceptor)
  update(
    @Param('id') id: string,
    @Body() updateMascotaDto: UpdateMascotaDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      updateMascotaDto.foto = file.filename;
    }
    return this.mascotasService.update(+id, updateMascotaDto);
  }

  @Delete(':id')
  @Roles('admin', 'veterinario') // ¡Etiqueta mágica! Solo ellos pasan
  remove(@Param('id') id: string) {
    return this.mascotasService.remove(+id);
  }
}