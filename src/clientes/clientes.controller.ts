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

import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('clientes')
@UseGuards(AuthGuard, RolesGuard) // ¡Nadie entra a ninguna ruta de clientes sin token válido!
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  @Roles('admin', 'veterinario') // Solo el personal puede registrar clientes nuevos
  @UseInterceptors(
    FileInterceptor('foto', {
      storage: diskStorage({
        destination: './uploads/clientes',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `cliente-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  create(
    @Body() createClienteDto: CreateClienteDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      createClienteDto.foto = file.filename;
    }
    return this.clientesService.create(createClienteDto);
  }

  @Get()
  // Cualquier usuario logueado puede ver la lista de clientes
  findAll() {
    return this.clientesService.findAll();
  }

  @Get(':id')
  // Cualquier usuario logueado puede ver el detalle de un cliente específico
  findOne(@Param('id') id: string) {
    return this.clientesService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin', 'veterinario') // Solo el personal puede editar datos de clientes
  @UseInterceptors(
    FileInterceptor('foto', {
      storage: diskStorage({
        destination: './uploads/clientes',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `cliente-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateClienteDto: UpdateClienteDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      updateClienteDto.foto = file.filename;
    }
    return this.clientesService.update(+id, updateClienteDto);
  }

  @Delete(':id')
  @Roles('admin') // ¡Máxima seguridad! Solo el admin puede borrar un cliente del sistema
  remove(@Param('id') id: string) {
    return this.clientesService.remove(+id);
  }
}