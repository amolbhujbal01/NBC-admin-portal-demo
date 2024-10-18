import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('tenant', {synchronize: false})
export class Tenant {
  @PrimaryColumn()
  tenant_id: string;

  @Column()
  email: string;
}