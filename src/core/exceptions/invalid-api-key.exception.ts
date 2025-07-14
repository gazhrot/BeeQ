import { UnauthorizedException } from '@nestjs/common';

export class InvalidApiKeyException extends UnauthorizedException {
  constructor() {
    super('Invalid API key', 'INVALID_API_KEY');
  }
}
