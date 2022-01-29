import { IsString, IsNumber, IsJSON } from 'class-validator';
import OrganisationDto from './organization.dto'

class SignUpCommonPropsDto {
  @IsString()
  public email: string;

  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  @IsString()
  public mobile: string;

  @IsNumber()
  public countryId: number;
}

export class SignUpUserWithExistingOrgDto extends SignUpCommonPropsDto {
  @IsNumber()
  public organisationId: number;

  @IsString()
  public role: string;
}

export class SignUpUserWithNewOrgDto extends SignUpCommonPropsDto {
  @IsJSON()
  public organisation: OrganisationDto;
}

export class SignUpUserHydratedDto extends SignUpCommonPropsDto {
  @IsNumber()
  public organisationId: number;

  @IsString()
  public role: string;

  @IsJSON()
  public organisation: OrganisationDto;
}