import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    // 1. Verificamos si el email ya está registrado
    const usuarioExistente = await this.usuarioRepository.findOneBy({
      email: createUsuarioDto.email,
    });
    if (usuarioExistente) {
      throw new BadRequestException('El correo electrónico ya está registrado en el sistema');
    }

    // 2. ¡Pasamos la contraseña por la licuadora de Bcrypt!
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(createUsuarioDto.password, salt);

    // 3. Reemplazamos la contraseña de texto plano por el Hash ultra seguro
    const nuevoUsuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      password: hashPassword,
    });

    // 4. Guardamos en MySQL y limpiamos la contraseña de la respuesta
    const usuarioGuardado = await this.usuarioRepository.save(nuevoUsuario);
    delete (usuarioGuardado as Partial<Usuario>).password;
    return usuarioGuardado;
  }

  async findAll(): Promise<Usuario[]> {
    const usuarios = await this.usuarioRepository.find();
    // Nunca devolvemos las contraseñas hasheadas al frontend
    return usuarios.map((u) => {
      const { password, ...resto } = u;
      return resto as Usuario;
    });
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`El usuario con ID #${id} no existe`);
    }
    delete (usuario as Partial<Usuario>).password;
    return usuario;
  }

  async findOneByEmail(email: string): Promise<Usuario | null> {
    // Este método SÍ devuelve el password porque lo necesita AuthService para comparar con bcrypt
    return await this.usuarioRepository.findOneBy({ email });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`El usuario con ID #${id} no existe`);
    }

    // Si mandan una nueva contraseña, la volvemos a pasar por la licuadora
    if (updateUsuarioDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateUsuarioDto.password = await bcrypt.hash(updateUsuarioDto.password, salt);
    }

    const usuarioActualizado = this.usuarioRepository.merge(usuario, updateUsuarioDto);
    const guardado = await this.usuarioRepository.save(usuarioActualizado);
    delete (guardado as Partial<Usuario>).password;
    return guardado;
  }

  async remove(id: number): Promise<{ message: string }> {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`No se pudo eliminar: el usuario con ID #${id} no existe`);
    }
    await this.usuarioRepository.remove(usuario);
    return { message: `El usuario #${id} fue eliminado con éxito` };
  }
}