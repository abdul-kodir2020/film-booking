import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { AuthEntity } from './entity/auth.entity';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { cp } from 'fs';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private usersService: UsersService) {}

  @Post('login')
  @ApiCreatedResponse({ 
    description: 'Connexion réussie', 
    schema: {
      type: 'object',
      properties: {
        token: { $ref: getSchemaPath(AuthEntity) },
        message: { type: 'string' },
      },
    },
  })
  async login(@Body() {email, password}: LoginDto){
    const {token} = await this.authService.login(email, password)
    return {
      token,
      message: 'Connexion réussie'
    }
  }

  @Post('register')
  @ApiCreatedResponse({ 
    description: 'Inscription réussie', 
    schema: {
      type: 'object',
      properties: {
        user: { $ref: getSchemaPath(UserEntity) },
        message: { type: 'string' },
      },
    },
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return {
      user : new UserEntity(await this.usersService.create(createUserDto)),
      message: "Inscription reussie"
    }
  }
}
