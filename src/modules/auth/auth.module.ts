import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/common/configs/jwt.config';
import { UserModule } from '../user/user.module';
import { SharedModule } from 'src/common/shared/shared.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
	imports: [
		JwtModule.registerAsync(jwtConfig.asProvider()),
		SharedModule,
		UserModule,
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
