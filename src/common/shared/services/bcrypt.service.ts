import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

@Injectable()
export class BcryptService {
	public async hash(data: string): Promise<string> {
		const salt = 10;
		return hash(data, salt);
	}

	public async compare(data: string, encrypted: string): Promise<boolean> {
		return compare(data, encrypted);
	}
}
