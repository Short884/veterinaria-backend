import { PartialType } from '@nestjs/mapped-types';
import { CreateClienteDto } from './create-cliente.dto';

// PartialType hace que todos los campos del CreateClienteDto sean OPCIONALES
export class UpdateClienteDto extends PartialType(CreateClienteDto) {}