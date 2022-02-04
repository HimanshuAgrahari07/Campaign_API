import { IsString, IsNumber } from 'class-validator';
export default class CountryDto {
    @IsNumber()
    public id: number;
  
    @IsString()
    public countryName: string;
  
    @IsString()
    public countryCode: string;
  
    @IsString()
    public phoneCode: string;
  }