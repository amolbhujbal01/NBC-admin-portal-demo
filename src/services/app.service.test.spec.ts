import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AdminService } from './app.service';
import { 
  CognitoIdentityProviderClient, 
  AdminCreateUserCommand, 
  AdminCreateUserCommandOutput 
} from '@aws-sdk/client-cognito-identity-provider';
import { CreateDentalPracticeDto } from '../dto/create-dental-practice.dto';

jest.mock('@aws-sdk/client-cognito-identity-provider');

describe('AdminService', () => {
  let service: AdminService;
  let mockCognitoClient: jest.Mocked<CognitoIdentityProviderClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminService],
    }).compile();

    service = module.get<AdminService>(AdminService);
    mockCognitoClient = {
      send: jest.fn(),
    } as unknown as jest.Mocked<CognitoIdentityProviderClient>;
    service['cognitoClient'] = mockCognitoClient;
  });

  describe('createUser', () => {
    const mockCreateDentalPracticeDto: CreateDentalPracticeDto = {
      email: 'test@example.com',
      sapId: '12345',
    };

    const mockCognitoResponse: AdminCreateUserCommandOutput = {
      User: {
        Username: 'test@example.com',
        UserCreateDate: new Date(),
        UserLastModifiedDate: new Date(),
        Enabled: true,
        UserStatus: 'FORCE_CHANGE_PASSWORD',
      },
      $metadata: {},
    };

    it('should create a user successfully', async () => {
      (mockCognitoClient.send as jest.Mock).mockResolvedValue(mockCognitoResponse);

      const result = await service.createUser(mockCreateDentalPracticeDto);

      expect(result).toEqual({
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully.',
        data: {
          email: 'test@example.com',
          tenantId: 'tenant_12345',
          sapId: '12345',
          cognitoResponse: mockCognitoResponse,
        },
      });

      expect(mockCognitoClient.send).toHaveBeenCalledWith(
        expect.any(AdminCreateUserCommand)
      );
    });

    it('should throw HttpException when Cognito client throws an error', async () => {
      const mockError = new Error('Cognito error');
      (mockCognitoClient.send as jest.Mock).mockRejectedValue(mockError);

      await expect(service.createUser(mockCreateDentalPracticeDto)).rejects.toThrow(
        new HttpException('Cognito error', HttpStatus.INTERNAL_SERVER_ERROR)
      );
    });

    it('should use custom error message when Cognito error has no message', async () => {
      const mockError = new Error();
      (mockCognitoClient.send as jest.Mock).mockRejectedValue(mockError);

      await expect(service.createUser(mockCreateDentalPracticeDto)).rejects.toThrow(
        new HttpException('Error creating user', HttpStatus.INTERNAL_SERVER_ERROR)
      );
    });

    it('should use error.response.message when available', async () => {
      const mockError = {
        response: {
          message: 'Custom error message',
        },
      };
      (mockCognitoClient.send as jest.Mock).mockRejectedValue(mockError);

      await expect(service.createUser(mockCreateDentalPracticeDto)).rejects.toThrow(
        new HttpException('Custom error message', HttpStatus.INTERNAL_SERVER_ERROR)
      );
    });
  });
});
