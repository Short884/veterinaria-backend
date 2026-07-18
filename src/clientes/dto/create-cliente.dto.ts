import { IsEmail, IsInt, IsOptional, IsString, Length } from 'class-validator';

export class CreateClienteDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @Length(2, 50, { message: 'El nombre debe tener entre 2 y 50 caracteres' })
  nombre!: string;

  @IsString()
  @Length(2, 50)
  apellido!: string;

  @IsString()
  @Length(7, 10, { message: 'El documento debe tener entre 7 y 10 dígitos' })
  documento!: string;

  @IsString()
  @Length(1, 50)
  direccion!: string;

  @IsString()
  @Length(1, 50)
  localidad!: string;

  @IsString()
  @Length(1, 20)
  telefono!: string;

  @IsString()
  @IsOptional() // La foto se completa desde el interceptor de subida de archivos, no viene en el JSON
  foto?: string;

  @IsEmail({}, { message: 'Por favor, ingresa un correo electrónico válido' })
  email!: string;

  @IsInt()
  @IsOptional()
  usuarioId?: number;
}