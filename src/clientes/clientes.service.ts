import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  // ¡Esta función guarda los datos en MySQL! (Etapa 2)
  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    const nuevoCliente = this.clienteRepository.create(createClienteDto);
    return await this.clienteRepository.save(nuevoCliente);
  }

  async findAll(): Promise<Cliente[]> {
    return await this.clienteRepository.find();
  }

  async findOne(id: number): Promise<Cliente> {
    // Traemos también sus mascotas para tener el combo completo
    const cliente = await this.clienteRepository.findOne({
      where: { id },
      relations: { mascotas: true },
    });

    if (!cliente) {
      throw new NotFoundException(`El cliente con ID #${id} no existe en la veterinaria`);
    }
    return cliente;
  }

  // Etapa 3: UPDATE
  async update(id: number, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOneBy({ id });

    if (!cliente) {
      throw new NotFoundException(`El cliente con ID #${id} no existe en la veterinaria`);
    }

    const clienteActualizado = this.clienteRepository.merge(cliente, updateClienteDto);
    return await this.clienteRepository.save(clienteActualizado);
  }

  // Etapa 3: REMOVE
  async remove(id: number): Promise<{ message: string }> {
    const cliente = await this.clienteRepository.findOneBy({ id });

    if (!cliente) {
      throw new NotFoundException(`No se pudo eliminar: el cliente con ID #${id} no existe`);
    }

    await this.clienteRepository.remove(cliente);
    return { message: `El cliente #${id} (y sus datos asociados) fue eliminado con éxito` };
  }
}