import { IsString, IsNumber, IsArray, IsJSON } from 'class-validator';
import OrganisationDto from './../../no-auth/organisations/organisation.dto'
export class BasicCampaignDto {
    @IsString()
    public campaignName: string;

    @IsString()
    public campaignDescription: string;

    @IsString()
    public campaignStatus: string;

    @IsString()
    public startDate: string;

    @IsString()
    public endDate: string;

    @IsNumber()
    public campaignFrequency: number;

    @IsArray()
    public devices: number[];

    @IsArray()
    public contents: number[];
}

export class CampaignDto extends BasicCampaignDto {
    @IsNumber()
    public id: number;

    @IsNumber()
    public organisationId: number;

    @IsString()
    public uid: string;

    @IsJSON()
    public organisation: OrganisationDto
}