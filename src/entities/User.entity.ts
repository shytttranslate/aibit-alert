import { Column, Entity, PrimaryGeneratedColumn, Index, OneToMany } from 'typeorm';
import { AppEntity } from './App.entity';

@Entity({
  name: 'users',
})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({
    nullable: true,
  })
  rapidAPIuser: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @OneToMany(() => AppEntity, (app) => app.User)
  apps: AppEntity[];
}
