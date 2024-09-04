import {
	IsEmail,
	IsNotEmpty,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator';

export class CreateUserDto {
	@IsNotEmpty()
	@MaxLength(100)
	name: string;

	@IsNotEmpty()
	@IsEmail()
	readonly email: string;

	@IsNotEmpty()
	readonly phone: string;

	@IsNotEmpty()
	@MinLength(8, {
		message: 'Password too short',
	})
	@MaxLength(20, {
		message: 'Password too long',
	})
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: 'Password too weak',
	})
	readonly password: string;
}
