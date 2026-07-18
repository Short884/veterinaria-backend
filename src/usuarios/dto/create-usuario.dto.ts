import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateUsuarioDto {
  @IsEmail({}, { message: 'Por favor, ingresa un correo electrónico válido' })
  @IsNotEmpty({ message: 'El email no puede estar vacío' })
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20, { message: 'La contraseña debe tener entre 6 y 20 caracteres' })
  password!: string;

  @IsString()
  @IsOptional()
  @IsIn(['cliente', 'veterinario', 'admin'], {
    message: 'El rol debe ser cliente, veterinario o admin',
  })
  rol?: string; // Si no se manda, MySQL le pone 'cliente' por defecto
}