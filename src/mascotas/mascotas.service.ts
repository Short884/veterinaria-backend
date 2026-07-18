import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Mascota } from './entities/mascota.entity';
import { CreateMascotaDto } from './dto/create-mascota.dto';
import { UpdateMascotaDto } from './dto/update-mascota.dto';

@Injectable()
export class MascotasService {
  constructor(
    @InjectRepository(Mascota)
    private readonly mascotaRepository: Repository<Mascota>,
  ) {}

  async create(createMascotaDto: CreateMascotaDto): Promise<Mascota> {
    const nuevaMascota = this.mascotaRepository.create(createMascotaDto);
    return await this.mascotaRepository.save(nuevaMascota);
  }

  async findAll(): Promise<Mascota[]> {
    // Traemos la mascota junto con los datos de su dueño
    return await this.mascotaRepository.find({ relations: { cliente: true } });
  }

  async findOne(id: number): Promise<Mascota> {
    const mascota = await this.mascotaRepository.findOne({
      where: { id },
      relations: { cliente: true },
    });

    if (!mascota) {
      throw new NotFoundException(`La mascota con ID #${id} no existe`);
    }
    return mascota;
  }

  async findByCliente(clientesId: number): Promise<Mascota[]> {
    return await this.mascotaRepository.find({ where: { clientesId } });
  }

  async update(id: number, updateMascotaDto: UpdateMascotaDto): Promise<Mascota> {
    const mascota = await this.mascotaRepository.findOneBy({ id });

    if (!mascota) {
      throw new NotFoundException(`La mascota con ID #${id} no existe`);
    }

    const mascotaActualizada = this.mascotaRepository.merge(mascota, updateMascotaDto);
    return await this.mascotaRepository.save(mascotaActualizada);
  }

  async remove(id: number): Promise<{ message: string }> {
    const mascota = await this.mascotaRepository.findOneBy({ id });

    if (!mascota) {
      throw new NotFoundException(`No se pudo eliminar: la mascota con ID #${id} no existe`);
    }

    await this.mascotaRepository.remove(mascota);
    return { message: `Mascota #${id} eliminada con éxito` };
  }
}