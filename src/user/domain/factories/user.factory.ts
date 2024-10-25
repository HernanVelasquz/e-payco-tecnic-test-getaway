import { Injectable } from '@nestjs/common';
import { v4 as UUID } from 'uuid';
import { User } from '../user';

@Injectable()
export class UserFactory {
  create(
    typeDocument: string,
    number: string,
    fullName: string,
    email: string,
    phoneNumber: string,
  ) {
    const userId = UUID();
    return new User(userId, typeDocument, number, fullName, email, phoneNumber);
  }
}
