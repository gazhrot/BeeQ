import { UnauthorizedException } from '@nestjs/common';

export class ApiKeyMissingException extends UnauthorizedException {
  constructor() {
    super('API key is missing', 'API_KEY_MISSING');
  }
}
