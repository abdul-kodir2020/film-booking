import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService){}

    async login(email: string, password: string): Promise<AuthEntity>{

        const user = await this.prisma.user.findUnique({where: {email: email}})
        if(!user) throw new BadRequestException("Email ou Mot de passe incorrecte !")

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) throw new UnauthorizedException('Email ou Mot de passe incorrecte !')

        return {token: this.jwtService.sign({userId: user.id}, { expiresIn: '4h' })}
    }
}