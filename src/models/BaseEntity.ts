import {CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

export class BaseEntity {
	@PrimaryGeneratedColumn("increment")
	public id!: number;
	@UpdateDateColumn()
	public readonly updatedAt!: Date;
	@CreateDateColumn()
	public readonly createdAt!: Date;
	@DeleteDateColumn()
	public readonly deletedAt?: Date;
}