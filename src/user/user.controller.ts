import { Controller, Get, Post, Body, UsePipes } from '@nestjs/common';

import { UserDTO } from './user.dto';
import { UserService } from './user.service';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { User } from './user.decorator';
import { UserEntity } from './user.entity';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('api/user')
  showAllUsers(@User() user: UserEntity) {
    console.log(user);
    return this.userService.showAll();
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  login(@Body() data: UserDTO) {
    return this.userService.login(data);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  register(@Body() data: UserDTO) {
    return this.userService.register(data);
  }
}
