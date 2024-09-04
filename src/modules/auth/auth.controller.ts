import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
	@Inject() private readonly authService: AuthService;

	@Post('signin')
	async signIn(@Body() dto: SignInDto) {
		return this.authService.signIn(dto);
	}

	@Post('signup')
	async signUp(@Body() dto: SignUpDto) {
		return this.authService.signUp(dto);
	}

	@Post('refresh')
	public async refreshToken(@Body() { refreshToken }: RefreshDto) {
		return this.authService.refreshToken(refreshToken);
	}
}
