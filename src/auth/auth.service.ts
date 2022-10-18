import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDTO, LoginDTO } from './dto';
import { DBError } from 'src/shared/enums/DbErrorEnum';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDTO) {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);

      return { ...user, token: this.getjwt({ id: user.id }) };
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async login(userLoginDTO: LoginDTO) {
    const { password, email } = userLoginDTO;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, email: true, password: true },
    });

    if (!user || !bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid');

    return { ...user, token: this.getjwt({ id: user.id }) };
  }

  async checkAuthStatus(user: User) {
    return { ...user, token: this.getjwt({ id: user.id }) };
  }

  private handleDBError(error: any) {
    if (error.code === DBError.DUP_ENTRY) {
      throw new BadRequestException(error.sqlMessage);
    }

    console.log(error);

    throw new InternalServerErrorException('Please, check server errors');
  }

  private getjwt(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
