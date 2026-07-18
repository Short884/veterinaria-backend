import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';

// PartialType hace que todos los campos del CreateUsuarioDto sean OPCIONALES
export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {}