import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('notifications')
export class Notification {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ length: 64 })
	title: string;

	@Column({ length: 512 })
	description: string;

	@Column()
	redirect: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}
