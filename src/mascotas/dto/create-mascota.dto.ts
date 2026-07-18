import { IsInt, IsOptional, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMascotaDto {
  @IsString()
  @Length(1, 50)
  nombre!: string;

  @IsString()
  @Length(1, 50)
  especie!: string;

  @IsString()
  @Length(1, 50)
  raza!: string;

  @IsString()
  @IsOptional() // Se completa desde el interceptor de archivos, no viaja en form-data como texto
  foto?: string;

  @IsString()
  @IsOptional()
  historiaClinica?: string;

  @Type(() => Number) // form-data manda todo como texto; lo convertimos a número
  @IsInt({ message: 'clientesId debe ser el ID numérico del dueño' })
  clientesId!: number;
}