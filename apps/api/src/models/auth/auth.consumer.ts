import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { User } from '@prisma/client';

@Controller()
export class AuthConsumer {
  private readonly logger = new Logger(AuthConsumer.name);

  @EventPattern('auth.user.registered')
  async handleUserRegisteredEvent(data: User) {
    // Sleep for 5 seconds to simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 5000));

    this.logger.log('User registered:', data);
    // You can add your business logic here, like sending a welcome email or logging the event
  }
}
