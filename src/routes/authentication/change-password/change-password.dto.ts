import { IsString, IsNumber } from 'class-validator';
export default class ChangePasswordDto {
    @IsString()
    public oldPassword: string;
  
    @IsString()
    public newPassword: string;
  
    @IsNumber()
    public userId: number;
  }