import { randomUUID } from 'node:crypto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { StorageService } from 'src/storage/storage.service';
import { type User } from 'interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(private readonly storage: StorageService) {}

  register(email: string, password: string): { apiKey: string } {
    const users = this.storage.read<User[]>('users.json');

    if (users.some((user) => user.email === email)) {
      throw new ConflictException(`Email ${email} is already registered`); // → 409
    }

    const now = new Date();
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      password,
      firstName: '',
      lastName: '',
      role: 'user',
      apiKey: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    this.storage.write('users.json', [...users, newUser]);
    return { apiKey: newUser.apiKey };
  }

  getMe(apiKey: string): Omit<User, 'apiKey'> & { apiKey: string } {
    const users = this.storage.read<User[]>('users.json');
    const user = users.find((u) => u.apiKey === apiKey);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  regenerateKey(apiKey: string): { apiKey: string } {
    const users = this.storage.read<User[]>('users.json');
    const index = users.findIndex((user) => user.apiKey === apiKey);
    if (index === -1) throw new NotFoundException('User not found');

    const newKey = randomUUID();
    users[index] = { ...users[index], apiKey: newKey, updatedAt: new Date() };
    this.storage.write('users.json', users);
    return { apiKey: newKey };
  }

  deleteAccount(apiKey: string): void {
    const users = this.storage.read<User[]>('users.json');
    const index = users.findIndex((u) => u.apiKey === apiKey);
    if (index === -1) {
      throw new NotFoundException('User not found');
    }

    users.splice(index, 1);
    this.storage.write('users.json', users);
  }

  findByApiKey(apiKey: string): User | undefined {
    return this.storage
      .read<User[]>('users.json')
      .find((user) => user.apiKey === apiKey);
  }
}
