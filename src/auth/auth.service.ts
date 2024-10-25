import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async signup(email: string, password: string): Promise<any> {
    const hashedPassword = await argon2.hash(password);
    const newUser = new this.userModel({ email, password: hashedPassword });
    await newUser.save();
    return { message: 'User created successfully' };
  }

  async signin(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new Error('Invalid credentials');

    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid) throw new Error('Invalid credentials');

    const payload = { email: user.email, sub: user._id };
    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async refreshToken(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken);
    const newAccessToken = this.jwtService.sign({ email: payload.email, sub: payload.sub });

    return {
      access_token: newAccessToken,
      refresh_token: this.jwtService.sign({ email: payload.email, sub: payload.sub }, { expiresIn: '7d' }),
      message: 'Token refreshed successfully',
    };
  }
}
