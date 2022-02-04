import { IsString, IsNumber } from 'class-validator';
export default class OrganisationFullDto {
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