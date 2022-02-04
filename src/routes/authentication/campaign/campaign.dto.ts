import { IsString, IsNumber, IsArray } from 'class-validator';
export default class CampaignDto {
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