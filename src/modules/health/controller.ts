import { Controller } from '@nestjs/common';
import {
  HealthCheckResult,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller('health-check')
export class HealthCheckController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly indicator: TypeOrmHealthIndicator,
  ) {}

  check(): Promise<HealthCheckResult> {
    return this.health.check([() => this.indicator.pingCheck('PG')]);
  }
}
