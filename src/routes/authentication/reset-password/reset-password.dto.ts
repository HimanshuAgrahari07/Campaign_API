import { IsString, IsNumber } from 'class-validator';
export default class ResetPasswordDto {
  @IsString()
  public email: string;
}