import { Body, Controller, Post, HttpStatus, HttpException, UseFilters, Get, Query } from '@nestjs/common';
import { AdminService } from '../services/app.service';
import { CreateDentalPracticeDto } from '../dto/create-dental-practice.dto';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { TenantSearchDto } from '../dto/tenant-search.dto';

@Controller('admin')
@UseFilters(HttpExceptionFilter)
export class AdminController {
  constructor(private readonly authService: AdminService) {}

  @Post('practice')
  async onboardPractice (@Body() CreateDentalPracticeDto: CreateDentalPracticeDto): Promise<any> {
    return this.authService.createUser(CreateDentalPracticeDto);
  }

  @Get('practice')
  async listTenants(@Query() tenantSearchDto: TenantSearchDto): Promise<any> {
    return this.authService.listTenants(tenantSearchDto); 
  }
}