import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService){}

  async create(createUserDto: CreateUserDto) {
    const emailTaken = await this.prisma.user.findUnique({where: {email: createUserDto.email}})

    if(emailTaken) throw new BadRequestException("Cette email est déjà utilisée");
    // if(emailTaken) throw new Error("Cette email est déjà utilisée");
    
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      roundsOfHashing,
    );

    createUserDto.password = hashedPassword;
    return this.prisma.user.create({data: createUserDto})
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({where: {id}});
    if(!user ) throw new BadRequestException("Cet utilisateur n'existe pas")
    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        roundsOfHashing,
      );
    }
    
    return this.prisma.user.update({
      where: {id: id},
      data: updateUserDto
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({where: {id}});
  }
}
