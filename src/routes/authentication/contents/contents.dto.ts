import { IsString } from 'class-validator';
export default class ContentsDto {
    public attachment: string;

    @IsString()
    public contentName: string;

    @IsString()
    public contentDescription: string;
}