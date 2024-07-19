import {
	IsEmail,
	IsNotEmpty,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator';

export class SignInDto {
	@IsNotEmpty()
	@IsEmail()
	@MaxLength(319)
	readonly email: string;

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
