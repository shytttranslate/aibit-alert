import { BadRequestException, Body, Controller, Inject, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '~@/entities/User.entity';
import { DBService } from '~@/shared/database.service';

@Controller({
  path: '/user',
  version: '1',
})
export class UserController {
  constructor(private dbservice: DBService) {}
  @Post('/login')
  async login(@Body() body) {
    const { email, password } = body;
    const repo = this.dbservice.getRepository(UserEntity);
    const isExisted = await repo.findOne({
      where: {
        email,
        password,
      },
      relations: ['apps'],
    });
    if (isExisted) {
      delete isExisted.password;
      return isExisted;
    } else {
      throw new BadRequestException('Invalid email or password');
    }
  }
}
