import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
	@Inject() private readonly _userRepo: UserRepository;

	public async findById(id: string): Promise<Omit<User, 'password'>> {
		return this._userRepo.findById(id);
	}

	public async findByEmail(email: string): Promise<User> {
		return this._userRepo.findByEmail(email);
	}

	public async create(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
		return this._userRepo.create(dto);
	}
}
