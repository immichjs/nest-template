import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

export class SignUpDto extends CreateUserDto {
	@IsNotEmpty()
	@MinLength(8, {
		message: 'Password too short',
	})
	@MaxLength(20, {
		message: 'Password too long',
	})
	@Match('password', { message: 'Passwords do not match' })
	readonly confirmPassword: string;
}
