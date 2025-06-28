import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';

@Controller('health')
@ApiTags('Health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get(['ready', 'live'])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Check system health',
    description: 'Endpoint to check the health of the system.',
  })
  async checkSystemHealth() {
    return this.healthService.getSystemHealth();
  }
}
