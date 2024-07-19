import { plainToInstance } from 'class-transformer';
import {
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	validateSync,
} from 'class-validator';

import { Environment } from '../enums/environment.enum';

class EnvironmentVariables {
	@IsEnum(Environment)
	NODE_ENV: Environment;

	@IsNumber()
	@IsNotEmpty()
	PORT: number;

	@IsString()
	@IsNotEmpty()
	JWT_SECRET: string;

	@IsString()
	@IsNotEmpty()
	DB_HOST: string;

	@IsNumber()
	@IsNotEmpty()
	DB_PORT: number;

	@IsString()
	@IsNotEmpty()
	DB_USERNAME: string;

	@IsString()
	@IsNotEmpty()
	DB_PASSWORD: string;

	@IsString()
	@IsNotEmpty()
	DB_NAME: string;

	// @IsString()
	// @IsNotEmpty()
	// REDIS_HOST: string;

	// @IsNumber()
	// @IsNotEmpty()
	// REDIS_PORT: number;

	// @IsString()
	// @IsOptional()
	// REDIS_USERNAME: string;

	// @IsString()
	// @IsOptional()
	// REDIS_PASSWORD: string;

	// @IsNumber()
	// @IsNotEmpty()
	// REDIS_DATABASE: number;

	// @IsString()
	// @IsNotEmpty()
	// REDIS_KEY_PREFIX: string;
}

export function validate(config: Record<string, unknown>) {
	const validatedConfig = plainToInstance(EnvironmentVariables, config, {
		enableImplicitConversion: true,
	});
	const errors = validateSync(validatedConfig, {
		skipMissingProperties: false,
	});

	let errorMessage = errors
		.map((message) => message.constraints[Object.keys(message.constraints)[0]])
		.join('\n');

	const COLOR = {
		reset: '\x1b[0m',
		bright: '\x1b[1m',
		fgRed: '\x1b[31m',
	};

	errorMessage = `${COLOR.fgRed}${COLOR.bright}${errorMessage}${COLOR.reset}`;

	if (errors.length > 0) {
		throw new Error(errorMessage);
	}

	return validatedConfig;
}
