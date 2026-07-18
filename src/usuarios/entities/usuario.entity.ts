import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'usuarios' }) // Vincula directamente con la tabla `usuarios` de veterinaria.sql
export class Usuario {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id!: number;

  @Column({ unique: true, length: 100 })
  email!: string;

  @Column({ length: 255 })
  password!: string;

  @Column({ length: 20, default: 'cliente' })
  rol!: string; // 'cliente' | 'veterinario' | 'admin'

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;
}