import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RawHeaders } from 'src/shared/decorators/raw-headers.decorator';
import { UserRole } from 'src/shared/enums/UserRolesEnum';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { RoleProtected } from './decorators/role-protected.decorator';
import { CreateUserDTO, LoginDTO } from './dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDTO) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() userLoginDTO: LoginDTO) {
    return this.authService.login(userLoginDTO);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  // @Get('private')
  // @UseGuards(AuthGuard())
  // testPrivateRoute(
  //   @GetUser() user: User,
  //   @GetUser('email') userEmail: string,
  //   @RawHeaders() rawHeaders: string[],
  // ) {
  //   return {
  //     ok: true,
  //     user,
  //     userEmail,
  //     rawHeaders,
  //   };
  // }

  // @Get('private2')
  // @RoleProtected(UserRole.ADMIN)
  // @UseGuards(AuthGuard(), UserRoleGuard)
  // testPrivate2Route(@GetUser() user: User) {
  //   return {
  //     ok: true,
  //     user,
  //   };
  // }

  // @Get('private3')
  // @Auth(UserRole.ADMIN)
  // testPrivate3Route(@GetUser() user: User) {
  //   return {
  //     ok: true,
  //     user,
  //   };
  // }
}
