import { IsString, IsNumber } from 'class-validator';

class SignInDto {
  @IsString()
  public email: string;

  @IsString()
  public password: string;
}

export default SignInDto;
