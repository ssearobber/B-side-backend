import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.request.dto';
import { AuthDto2 } from './dto/auth.request2.dto';
import { UserRequestDto } from '../users/\bdto/users.request.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async signUp(createUserDto: UserRequestDto): Promise<any> {
    // Check if user exists
    const emailExists = await this.usersService.findByUsername(
      createUserDto.email,
    );
    if (emailExists) {
      throw new BadRequestException('email already exists');
    }

    // Hash password
    const hash = await this.hashData(createUserDto.password);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hash,
    });
    const tokens = await this.getTokens(newUser._id, newUser.email);
    await this.updateRefreshToken(newUser._id, tokens.refreshToken);
    return tokens;
  }

  async signIn(data: AuthDto) {
    // Check if user exists
    const user = await this.usersService.findByUsername(data.email);
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(user._id, user.email);
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    return tokens;
  }

  async login(data: AuthDto2) {
    const tokens = await this.getTokens(data.socialToken, data.type);
    switch (data.type) {
      case 'kakao': {
        await this.getUserByKakaoAccessToken(
          data.socialToken,
          tokens.refreshToken,
        );
        break;
      }
      case 'apple': {
        await this.createAndUpdateUser(
          'apple',
          data.email,
          tokens.refreshToken,
        );
        break;
      }
      default: {
        // throw new InvalidVendorNameException(); //소셜로그인 선택 실패 예외처리
      }
    }
    return tokens;
  }

  async logout(userId: string) {
    return this.usersService.update(userId, { refreshToken: null });
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '5m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async getUserByKakaoAccessToken(
    accessToken: string,
    refreshToken: string,
  ): Promise<string> {
    try {
      const user = await this.httpService
        .get('https://kapi.kakao.com/v2/user/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .toPromise();
      console.log('user.data', user.data.kakao_account.email);

      const userId = await this.createAndUpdateUser(
        'kakao',
        user.data.kakao_account.email,
        refreshToken,
      );

      return userId; // 회원이 이미 있다면 있는 유저의 아이디 반환
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  async createAndUpdateUser(type: string, email: string, refreshToken: string) {
    try {
      const userId = await this.usersService.findByUserId(type, email);

      if (!userId) {
        const createUserDto: UserRequestDto = new UserRequestDto();
        createUserDto.type = type;
        createUserDto.email = email;
        createUserDto.refreshToken = refreshToken;
        const newUser = await this.usersService.create({
          ...createUserDto,
        }); // 회원이 없으면 회원가입 후 아이디 반환
        return newUser.id;
      } else {
        const filter = { type: type, email: email };
        const update = { refreshToken };
        const updateRefreshToken = await this.usersService.findOneAndUpdate(
          filter,
          update,
        ); // 회원이 있으면 RefreshToken만 갱신
        console.log('updateRefreshToken', updateRefreshToken);
      }
      return userId.id; // 회원이 이미 있다면 있는 유저의 아이디 반환
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  async getAccessTokenByRefreshToken(refreshToken: string) {
    const result = await this.usersService.findByRefreshToken(refreshToken);
    console.log('result', result);
    if (!result) throw new ForbiddenException('Access Denied');

    if (result.refreshToken === refreshToken) {
      const accessToken = 'sadfdf2342fs';
      return {
        accessToken,
        refreshToken,
      };
    }
  }
}
