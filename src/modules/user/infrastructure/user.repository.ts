import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { Not, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserRepository {
	@InjectRepository(User) private readonly _userRepo: Repository<User>;

	public async create(dto: CreateUserDto): Promise<User> {
		const userAlreadyExists = await this._userRepo.findOne({
			where: {
				email: dto.email,
			},
		});

		if (userAlreadyExists) {
			throw new ConflictException('User already exists');
		}

		return this._userRepo.save(dto);
	}

	public async findByEmail(email: string): Promise<User> {
		const user = await this._userRepo.findOne({
			where: {
				email,
			},
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return user;
	}

	public async findById(id: string): Promise<User> {
		const user = await this._userRepo.findOne({
			where: {
				id,
			},
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return user;
	}

	public async update(id: string, dto: UpdateUserDto): Promise<User> {
		const hasUser = await this._userRepo.count({
			where: {
				id,
			},
		});

		if (!hasUser) {
			throw new NotFoundException('User not found');
		}

		const hasUserByEmail = await this._userRepo.findOne({
			where: {
				id: Not(id),
				email: dto.email,
			},
		});

		if (hasUserByEmail) {
			throw new ConflictException(
				`User already exists with e-mail "${dto.email}"`,
			);
		}

		await this._userRepo.update(id, dto);
		return this._userRepo.findOne({ where: { id } });
	}
}
