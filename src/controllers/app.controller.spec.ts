import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, HttpException } from '@nestjs/common';
import { AdminController } from './app.controller';
import { AdminService } from '../services/app.service';
import { CreateDentalPracticeDto } from '../dto/create-dental-practice.dto';

describe('AdminController', () => {
  let controller: AdminController;
  let adminService: jest.Mocked<AdminService>;

  beforeEach(async () => {
    const mockAdminService = {
      createUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: mockAdminService,
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    adminService = module.get(AdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('onboardPractice', () => {
    it('should successfully create a user', async () => {
      const createDentalPracticeDto: CreateDentalPracticeDto = {
        email: 'test@example.com',
        sapId: '12345',
      };

      const expectedResult = {
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully',
        data: {
          email: 'test@example.com',
          sapId: '12345',
        },
      };

      adminService.createUser.mockResolvedValue(expectedResult);

      const result = await controller.onboardPractice(createDentalPracticeDto);

      expect(result).toEqual(expectedResult);
      expect(adminService.createUser).toHaveBeenCalledWith(createDentalPracticeDto);
    });

    it('should throw an exception when user creation fails', async () => {
      const createDentalPracticeDto: CreateDentalPracticeDto = {
        email: 'test@example.com',
        sapId: '12345',
      };

      const errorMessage = 'Failed to create user';
      adminService.createUser.mockRejectedValue(new HttpException(errorMessage, HttpStatus.BAD_REQUEST));

      await expect(controller.onboardPractice(createDentalPracticeDto)).rejects.toThrow(HttpException);
      await expect(controller.onboardPractice(createDentalPracticeDto)).rejects.toThrow(errorMessage);
    });

    it('should pass through any HttpException thrown by the service', async () => {
      const createDentalPracticeDto: CreateDentalPracticeDto = {
        email: 'test@example.com',
        sapId: '12345',
      };

      const errorMessage = 'Custom error message';
      adminService.createUser.mockRejectedValue(new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR));

      await expect(controller.onboardPractice(createDentalPracticeDto)).rejects.toThrow(HttpException);
      await expect(controller.onboardPractice(createDentalPracticeDto)).rejects.toThrow(errorMessage);
      await expect(controller.onboardPractice(createDentalPracticeDto)).rejects.toHaveProperty('status', HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });
});
