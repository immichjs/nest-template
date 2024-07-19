import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserRepository {
	@InjectRepository(User) private readonly _userRepo: Repository<User>;

	public async create(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
		const userAlreadyExists = await this._userRepo.findOne({
			where: {
				email: dto.email,
			},
		});

		if (userAlreadyExists) {
			throw new ConflictException('User already exists');
		}

		const { password, ...createdUser } = await this._userRepo.save(dto);

		return createdUser;
	}

	public async findByEmail(email: string): Promise<User> {
		const user = await this._userRepo.findOne({
			where: {
				email,
			},
			select: ['id', 'name', 'email', 'password', 'createdAt', 'updatedAt'],
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		return user;
	}

	public async findById(id: string): Promise<Omit<User, 'password'>> {
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
}
