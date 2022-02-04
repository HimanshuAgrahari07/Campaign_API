import { IsString, IsNumber, IsJSON, IsBoolean, isNumber } from 'class-validator';
import OrganisationFullDto from './organisation.full.dto'
import CountryDto from './country.dto';

export default class UserDto {
  @IsNumber()
  public id: number;

  @IsString()
  public email: string;

  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  @IsString()
  public role: string;

  @IsString()
  public mobile: string;

  @IsNumber()
  public countryId: number;

  @IsNumber()
  public organisationId: number;

  @IsString()
  public createdAt: string;

  @IsString()
  public updatedAt: string;

  @IsBoolean()
  public confirmed: boolean;

  @IsJSON()
  public organisation: OrganisationFullDto;

  @IsJSON()
  public country: CountryDto
}