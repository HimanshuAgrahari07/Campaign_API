import { IsString, IsNumber } from 'class-validator';

class OrganisationDto {
  @IsString()
  public name: string;

  @IsString()
  public uid: string;
}

export default OrganisationDto;
