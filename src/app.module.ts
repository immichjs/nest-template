import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './modules/database/database.module';

import { AuthModule } from './modules/auth/auth.module';
import { CacheModule } from './modules/cache/cache.module';
import { UserModule } from './modules/user/user.module';

import appConfig from './common/configs/app.config';
import databaseConfig from './common/configs/database.config';
import jwtConfig from './common/configs/jwt.config';

import { validate } from './common/validations/env.validation';
import { SharedModule } from './common/shared/shared.module';
import { NotificationModule } from './modules/notification/notification.module';
import { EmployeeModule } from './modules/employee/employee.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [appConfig, databaseConfig, jwtConfig],
			validate,
		}),
		AuthModule,
		CacheModule,
		UserModule,
		DatabaseModule,
		SharedModule,
		NotificationModule,
		EmployeeModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
