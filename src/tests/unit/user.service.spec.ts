import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../modules/user/user.service';
import { UserRepository } from '../../modules/user/infrastructure/user.repository';
import { SignUpDto } from 'src/modules/auth/dto/sign-up.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';

describe(`[${UserService.name}]`, () => {
	let service: UserService;

	const user = {
		id: '13a9876f-31bb-491b-a5f9-67969b0d1919',
		name: 'John Doe',
		email: 'john.doe@gmail.com',
		phone: '+5515123456789',
		createdAt: '2024-09-04T02:02:49.667Z',
		updatedAt: '2024-09-04T02:21:17.313Z',
	};
	const mockUserRepository = {
		findById: jest.fn().mockResolvedValue(user),
		findByEmail: jest.fn().mockResolvedValue(user),
		create: jest.fn().mockResolvedValue(user),
		update: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UserService,
				{ provide: UserRepository, useValue: mockUserRepository },
			],
		}).compile();

		service = module.get<UserService>(UserService);
	});

	it('Deve estar definido.', () => {
		expect(service).toBeDefined();
	});

	describe('create():', () => {
		it('Deve criar e retornar os dados do usuário.', async () => {
			const dto: SignUpDto = {
				name: 'John Doe',
				email: 'john.doe@gmail.com',
				phone: '+5515123456789',
				password: 'John.doe12345',
				confirmPassword: 'John.doe12345',
			};
			const result = await service.create(dto);

			expect(result).toEqual(user);
		});

		it('Deve falhar ao tentar criar um usuário com e-mail existente.', async () => {
			const dto: SignUpDto = {
				name: 'John Doe',
				email: 'john.doe@gmail.com',
				phone: '+5515123456789',
				password: 'John.doe12345',
				confirmPassword: 'John.doe12345',
			};
			mockUserRepository.create.mockRejectedValue(
				new ConflictException('User already exists'),
			);

			await expect(service.create(dto)).rejects.toThrow('User already exists');
		});
	});

	describe('findByEmail():', () => {
		it('Deve retornar os dados do usuário com base no e-mail.', async () => {
			const email = 'john.doe@gmail.com';
			const result = await service.findByEmail(email);

			expect(result).toEqual(user);
		});

		it('Deve falhar ao não encontrar usuário com base no e-mail.', async () => {
			const email = 'john.doe@gmail.com';
			mockUserRepository.findByEmail.mockRejectedValue(
				new NotFoundException('User not found'),
			);

			await expect(service.findByEmail(email)).rejects.toThrow(
				'User not found',
			);
		});
	});

	describe('findById():', () => {
		it('Deve retornar os dados do usuário com base no id.', async () => {
			const id = '13a9876f-31bb-491b-a5f9-67969b0d1919';
			const result = await service.findById(id);

			expect(result).toEqual(user);
		});

		it('Deve falhar ao não encontrar usuário com base no id.', async () => {
			const id = '13a9876f-31bb-491b-a5f9-67969b0d1919';
			mockUserRepository.findById.mockRejectedValue(
				new NotFoundException('User not found'),
			);

			await expect(service.findById(id)).rejects.toThrow('User not found');
		});
	});

	describe('update():', () => {
		it(`Deve atualizar os dados do usuário autenticado.`, async () => {
			const id = '13a9876f-31bb-491b-a5f9-67969b0d1919';
			const dto: UpdateUserDto = {
				email: 'john.doe@outlook.com',
			};

			mockUserRepository.update.mockReturnValue({
				...user,
				...dto,
			});

			const result = await service.update(id, dto);

			expect(result).toEqual({
				...user,
				...dto,
			});
		});

		it(`Deve falhar ao tentar atualizar o usuário autenticado.`, async () => {
			const id = '13a9876f-31bb-491b-a5f9-67969b0d1919';
			const dto: UpdateUserDto = {
				email: 'john.doe@outlook.com',
			};

			mockUserRepository.update.mockRejectedValue(
				new NotFoundException('User not found'),
			);

			await expect(service.update(id, dto)).rejects.toThrow('User not found');
		});
	});
});
