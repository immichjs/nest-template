import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
	@Inject() private readonly authService: AuthService;

	@Post('sign-in')
	async signIn(@Body() dto: SignInDto) {
		return this.authService.signIn(dto);
	}

	@Post('sign-up')
	async signUp(@Body() dto: SignUpDto) {
		return this.authService.signUp(dto);
	}
}
