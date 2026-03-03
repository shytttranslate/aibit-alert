import { Column, Entity, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity({
  name: 'httplogs',
})
export class HttpLogEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    unique: true,
  })
  @Index({ unique: true })
  request_id: string;
  @Column()
  path: string;

  @Column()
  method: string;

  @Column({
    type: 'jsonb',
  })
  request_headers: Record<string, string>;

  @Column({
    nullable: true,
    type: 'text',
  })
  request_body?: string;

  @Column()
  status: number;

  @Column({
    nullable: true,
    type: 'text',
  })
  response_body?: string;

  @Column({
    nullable: true,
    type: 'jsonb',
  })
  response_headers?: Record<string, string>;

  @Column()
  start_at: Date;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  axios?: Record<string, string>;

  @Column({
    nullable: true,
  })
  basicError?: string;

  @Column({
    nullable: true,
  })
  @Index()
  user?: string;

  @Column({
    nullable: true,
  })
  user_plan?: string;

  @Column({
    nullable: true,
  })
  @Index()
  ip?: string;

  @Column({
    nullable: true,
  })
  country?: string;

  @Column({
    nullable: true,
  })
  service_host?: string;

  @Column({
    nullable: true,
  })
  duration?: number;
}
