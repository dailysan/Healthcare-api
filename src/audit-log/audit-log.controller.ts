import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { ParseDatePipe } from '../common/pipes/parse-date.pipe';

@Controller('audit-log')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Post()
  log(@Body() auditLogData: any) {
    return this.auditLogService.log(
      auditLogData.action,
      auditLogData.module,
      auditLogData.entityId,
      auditLogData.data,
      auditLogData.userId,
      auditLogData.ipAddress,
    );
  }

  @Get()
  findAll() {
    return this.auditLogService.findAll();
  }

  @Get('module/:module')
  findByModule(@Param('module') module: string) {
    try {
      return this.auditLogService.findByModule(module.toLowerCase());
    } catch (error) {
      console.error('Error finding audit logs by module:', error);
      throw error;
    }
  }

  @Get('action/:action')
  findByAction(@Param('action') action: string) {
    return this.auditLogService.findByAction(action);
  }

  @Get('date-range')
  findByDateRange(
    @Query('startDate', ParseDatePipe) startDate: Date,
    @Query('endDate', ParseDatePipe) endDate: Date,
  ) {
    return this.auditLogService.findByDateRange(startDate, endDate);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.auditLogService.findByUser(userId);
  }
}