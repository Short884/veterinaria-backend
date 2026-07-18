import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';

@Entity('mascotas')
export class Mascota {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column({ length: 50 })
  nombre!: string;

  @Column({ length: 50 })
  especie!: string;

  @Column({ length: 50 })
  raza!: string;

  @Column({ length: 255, default: '' })
  foto!: string;

  @Column({ name: 'historia_clinica', type: 'longtext', default: '' })
  historiaClinica!: string;

  @Column({ name: 'clientes_id', type: 'bigint' })
  clientesId!: number;

  // ¡Muchas mascotas pertenecen a UN cliente!
  @ManyToOne(() => Cliente, (cliente) => cliente.mascotas)
  @JoinColumn({ name: 'clientes_id' })
  cliente!: Cliente;
}