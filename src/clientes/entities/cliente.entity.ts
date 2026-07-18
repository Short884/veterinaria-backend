import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Mascota } from '../../mascotas/entities/mascota.entity';

@Entity('clientes') // Le dice a TypeORM que esta clase representa a la tabla 'clientes' de tu SQL
export class Cliente {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column({ length: 50 })
  nombre!: string;

  @Column({ length: 50 })
  apellido!: string;

  @Column({ length: 10 })
  documento!: string;

  @Column({ length: 50 })
  direccion!: string;

  @Column({ length: 50 })
  localidad!: string;

  @Column({ length: 20 })
  telefono!: string;

  @Column({ length: 255, default: '' })
  foto!: string;

  @Column({ length: 100 })
  email!: string;

  @Column({ name: 'usuario_id', type: 'bigint', nullable: true })
  usuarioId!: number | null;

  // Un cliente puede tener muchas mascotas
  @OneToMany(() => Mascota, (mascota) => mascota.cliente)
  mascotas!: Mascota[];
}