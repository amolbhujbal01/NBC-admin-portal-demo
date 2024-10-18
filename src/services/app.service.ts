import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminCreateUserCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import cognitoConfig from '../config/cognito.config';
import { CreateDentalPracticeDto } from '../dto/create-dental-practice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from 'src/entities/tenant.entity';
import { Repository } from 'typeorm';
import { TenantSearchDto } from '../dto/tenant-search.dto';

@Injectable()
export class AdminService {
  private cognitoClient = new CognitoIdentityProviderClient({
    region: process.env.COGNITO_REGION,
  });

  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
  ) {}

  async createUser(createDentalPracticeDto: CreateDentalPracticeDto): Promise<any> {
    try {
      const { email, sapId } = createDentalPracticeDto;
      const tenantId = `tenant_${sapId}`; 

      const createParams = {
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: email,
        UserAttributes: [
          {
            Name: 'email',
            Value: email,
          },
          {
            Name: 'custom:tenant_id',
            Value: tenantId,
          },
        ],
      };

      const createCommand = new AdminCreateUserCommand(createParams);
      const cognitoResponse: AdminCreateUserCommandOutput = await this.cognitoClient.send(createCommand);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully.',
        data: {
          email,
          tenantId,
          sapId,
          cognitoResponse, 
        },
      };
    } catch (error) {
      const errorMessage = error.response?.message || error.message || 'Error creating user';
      throw new HttpException(
        errorMessage,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async listTenants(tenantSearchDto: TenantSearchDto): Promise<any> {
    const { search, page = 1, limit = 10 } = tenantSearchDto;
    const query = this.tenantRepository.createQueryBuilder('tenant');
  
    if (search) {
      query.andWhere(
        'tenant.tenant_id LIKE :search OR tenant.email LIKE :search',
        { search: `%${search}%` }
      );
    }
  
    const [results, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      results,
      total,
      active: total, // All results are considered active
      inactive: 0,   // No inactive results
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
