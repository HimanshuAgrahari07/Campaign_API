import { IsString, IsNumber } from 'class-validator';
export default class OrganisationDto {
    @IsNumber()
    public id: number;
  
    @IsString()
    public name: string;
  
    @IsString()
    public uid: string;
  
    @IsString()
    public createdAt: string;
  
    @IsString()
    public updatedAt: string;
  }