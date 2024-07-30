import {
	Body,
	Controller,
	Get,
	Inject,
	Patch,
	UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserAuthenticated } from 'src/common/decorators/user.decorator';
import { UserService } from './user.service';
import { User } from './domain/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
	@Inject() private readonly _userService: UserService;

	@Get('me')
	public async me(@UserAuthenticated('sub') id: string): Promise<User> {
		console.log(id);
		return this._userService.findById(id);
	}

	@Patch()
	public async update(
		@UserAuthenticated('sub') id: string,
		@Body() dto: UpdateUserDto,
	): Promise<User> {
		console.log(id, dto);
		return this._userService.update(id, dto);
	}
}
