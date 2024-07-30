import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/domain/user.entity';

import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/sign-up.dto';
import { BcryptService } from 'src/common/shared/services/bcrypt.service';
import { SignInDto } from './dto/sign-in.dto';
import { ConfigService } from '@nestjs/config';
import { EJwtExpires } from 'src/common/enums/jwt-expires.enum';

@Injectable()
export class AuthService {
	@Inject() private readonly _configService: ConfigService;
	@Inject() private readonly _jwtService: JwtService;
	@Inject() private readonly _userService: UserService;
	@Inject() private readonly _bcryptService: BcryptService;

	public async validateUser(
		email: string,
		password: string,
	): Promise<Omit<User, 'password'> | null> {
		const user = await this._userService.findByEmail(email);

		const passwordIsValid = await bcrypt.compare(password, user.password);
		if (user && passwordIsValid) {
			return user;
		}

		return null;
	}

	public async signIn(dto: SignInDto) {
		const { email, password } = dto;
		const user = await this.validateUser(email, password);

		const payload = { email: user.email, sub: user.id };
		const accessToken = this._jwtService.sign(payload, {
			expiresIn: EJwtExpires.ONE_DAY,
		});
		const refreshToken = this._jwtService.sign(payload, {
			expiresIn: EJwtExpires.ONE_MONTH,
		});

		return {
			accessToken,
			refreshToken,
		};
	}

	public async signUp(dto: SignUpDto) {
		const hashedPassword = await this._bcryptService.hash(dto.password);

		const user = await this._userService.create({
			...dto,
			password: hashedPassword,
		});
		const payload = { email: user.email, sub: user.id };
		const accessToken = this._jwtService.sign(payload, {
			expiresIn: EJwtExpires.ONE_DAY,
		});
		const refreshToken = this._jwtService.sign(payload, {
			expiresIn: EJwtExpires.ONE_MONTH,
		});
		return {
			accessToken,
			refreshToken,
		};
	}

	public refreshToken(refreshToken: string) {
		try {
			const payload = this._jwtService.verify(refreshToken, {
				secret: this._configService.get<string>('JWT_SECRET'),
			});

			const newAccessToken = this._jwtService.sign(
				{ email: payload.email, sub: payload.sub },
				{ expiresIn: EJwtExpires.ONE_MONTH },
			);

			return { accessToken: newAccessToken };
		} catch (error) {
			throw new UnauthorizedException('Unauthorized');
		}
	}
}
