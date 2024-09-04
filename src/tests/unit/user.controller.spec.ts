import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../modules/user/user.controller';
import { UserService } from '../../modules/user/user.service';
import { UpdateUserDto } from '../../modules/user/dto/update-user.dto';
import { User } from '../../modules/user/domain/user.entity';
import { NotFoundException } from '@nestjs/common';

describe(`[${UserController.name}]`, () => {
	let controller: UserController;
	let service: UserService;

	const mockUserService = {
		findById: jest.fn(),
		update: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UserController],
			providers: [
				{
					provide: UserService,
					useValue: mockUserService,
				},
			],
		}).compile();

		controller = module.get<UserController>(UserController);
		service = module.get<UserService>(UserService);
	});

	it('Service deve estar definido.', () => {
		expect(service).toBeDefined();
	});

	it('Controller deve estar definido.', () => {
		expect(controller).toBeDefined();
	});

	describe('me():', () => {
		it('Deve retornar dados do usuário autenticado.', async () => {
			const id = '13a9876f-31bb-491b-a5f9-67969b0d1919';
			const user = {
				id: '13a9876f-31bb-491b-a5f9-67969b0d1919',
				name: 'John Doe',
				email: 'john.doe@gmail.com',
				phone: '+5515123456789',
				createdAt: '2024-09-04T02:02:49.667Z',
				updatedAt: '2024-09-04T02:21:17.313Z',
			};

			mockUserService.findById.mockReturnValue(user);

			const result = await controller.me(id);

			expect(result).toEqual(user);
		});

		it('Deve falhar ao tentar buscar dados de usuário inexistente.', async () => {
			const id = '13a9876f-31bb-491b-a5f9-67969b0d1919';

			mockUserService.findById.mockRejectedValue(
				new NotFoundException('User not found'),
			);

			await expect(controller.me(id)).rejects.toThrow('User not found');
		});
	});

	describe('update():', () => {
		it('Deve atualizar e retornar dados atualizados do usuário autenticado.', async () => {
			const id = '13a9876f-31bb-491b-a5f9-67969b0d1919';
			const dto: UpdateUserDto = {
				email: 'jane.doe@example.com',
				name: 'Jane Doe',
			};
			const updatedUser = { id, ...dto } as User;

			mockUserService.update.mockResolvedValue(updatedUser);

			const result = await controller.update(id, dto);

			expect(result).toEqual(updatedUser);
			expect(service.update).toHaveBeenCalledWith(id, dto);
		});

		it('Deve propagar as exceções do serviço.', async () => {
			const id = '13a9876f-31bb-491b-a5f9-67969b0d1919';
			const dto: UpdateUserDto = {
				email: 'jane.doe@example.com',
				name: 'Jane Doe',
			};

			mockUserService.update.mockRejectedValue(
				new NotFoundException('User not found'),
			);

			await expect(controller.update(id, dto)).rejects.toThrow(
				'User not found',
			);
		});
	});
});
