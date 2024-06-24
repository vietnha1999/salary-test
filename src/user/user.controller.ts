import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserReq, CreateUserRes } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { FindUserRes } from './dto/find-user.dto';
import { ParseObjectIdPipe } from '../common/pipe/ParseObjectIdPipe';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('user')
@UseInterceptors(CacheInterceptor)
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserReq: CreateUserReq): Promise<CreateUserRes> {
    return await this.userService.create(createUserReq);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<FindUserRes> {
    return await this.userService.findOne(id);
  }
}
