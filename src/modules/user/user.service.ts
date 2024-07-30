import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from './domain/user.repository';
import { User } from './domain/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
	@Inject() private readonly _userRepo: UserRepository;

	public async findById(id: string): Promise<User> {
		return this._userRepo.findById(id);
	}

	public async findByEmail(email: string): Promise<User> {
		return this._userRepo.findByEmail(email);
	}

	public async create(dto: CreateUserDto): Promise<User> {
		return this._userRepo.create(dto);
	}

	public async update(id: string, dto: UpdateUserDto): Promise<User> {
		return this._userRepo.update(id, dto);
	}
}
