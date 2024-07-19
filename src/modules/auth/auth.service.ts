import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/sign-up.dto';
import { BcryptService } from 'src/common/shared/services/bcrypt.service';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
	@Inject() private readonly _jwtService: JwtService;
	@Inject() private readonly _userService: UserService;
	@Inject() private readonly _bcryptService: BcryptService;

	public async validateUser(
		email: string,
		password: string,
	): Promise<Omit<User, 'password'> | null> {
		const user = await this._userService.findByEmail(email);

		const validComparison = await bcrypt.compare(password, user.password);
		if (user && validComparison) {
			const { password, ...data } = user;
			return data;
		}

		return null;
	}

	async signIn(dto: SignInDto) {
		const { email, password } = dto;
		const user = await this.validateUser(email, password);

		const payload = { email: user.email, sub: user.id };

		return {
			accessToken: this._jwtService.sign(payload),
		};
	}

	async signUp(dto: SignUpDto) {
		const hashedPassword = await this._bcryptService.hash(dto.password);

		const user = await this._userService.create({
			...dto,
			password: hashedPassword,
		});
		const payload = { email: user.email, sub: user.id };

		return {
			accessToken: this._jwtService.sign(payload),
		};
	}
}
