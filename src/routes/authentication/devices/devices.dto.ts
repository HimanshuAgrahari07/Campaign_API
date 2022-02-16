import { IsNumber, IsString, IsOptional } from 'class-validator';
export default class DeviceDto {
    @IsString()
    @IsOptional()
    public uid: string;

    @IsString()
    public deviceName: string;

    @IsString()
    public deviceModel: string;

    @IsString()
    public deviceBrand: string;

    @IsNumber()
    public resolutionId: number;

    @IsString()
    public deviceSize: string;

    @IsString()
    public deviceLocation: string;

    @IsString()
    public deviceStatus: string;
}