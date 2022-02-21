import { Router } from 'express';

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> =
    Pick<T, Exclude<keyof T, Keys>>
    & {
        [K in Keys]-?:
        Required<Pick<T, K>>
        & Partial<Record<Exclude<Keys, K>, undefined>>
    }[Keys]

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
    Pick<T, Exclude<keyof T, Keys>>
    & {
        [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
    }[Keys]

export interface IToken {
    token: string;
}

export interface IOrganisation {
    name: string;
    uid: string;
    id?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface RoutersI {
    path?: string
    router: Router
}

export interface ICountry {
    countryName: string;
    countryCode: string;
    phoneCode: string;
    id: number;
}

export interface IUser {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    mobile: string;
    countryId: number;
    organisationId: number;
    role: string;
    createdAt: string;
    updatedAt: string;
    confirmed: 0 | 1;
    password: string;
}

export interface IHydrateUser extends IUser {
    country: ICountry;
    organisation: IOrganisation;
}

export interface IHydrateUserParameters {
    email: string;
    id?: number;
    mobile?: string;
}

// DEVICE
export interface IDeviceResolution {
    id: number;
    resolutionType: string;
    commonName: string;
    aspectRatio: string;
    pixelSize: string;
}
export interface IDeviceBasics {
    uid: string;
    deviceName: string;
    deviceModel: string;
    deviceBrand?: string;
    deviceSize: string;
    deviceLocation: string;
    deviceStatus?: 'Configured' | 'Not Configured';
    resolutionId: number;
}
export interface IDeviceNewRequest extends IDeviceBasics {
    // can add if POST body accepts few more parameters
}
export interface IDeviceLite extends IDeviceBasics {
    id?: number;
    playingCampaign?: 'YES' | 'NO';
    activeCampaigns?: 0 | 1;
    createdAt?: string;
    updatedAt?: string;
    organisationId: number;
}

export interface IDevice extends IDeviceLite {
    deviceResolution: IDeviceResolution,
    organisation: IOrganisation;
    campaigns: ICampaign[];
}

// CONTENT

export interface IBasicContent {
    organisationId: number;
    contentName: string;
    contentDescription: string;
    fileType: string;
    fileSize: number;
    downloadUrl: string;
    fileName: string;
    filePath: string;
}
export interface IContentLite extends IBasicContent {
    id: number;
    streamUrl: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface IContent extends IContentLite {
    organisation: IOrganisation;
}



// CAMPAIGNS
export interface ICampaignBasics {
    campaignName: string;
    campaignDescription: string;
    campaignStatus: string | 'ACTIVE' | 'INACTIVE';
    startDate: string;
    endDate: string;
    campaignFrequency: number;
    devices: any[];
    contents: any[];
}
export interface ICampaign extends ICampaignBasics {
    id?: number;
    organisationId: number;
    uid: string;
    createdAt?: string;
    updatedAt?: string;
    organisation: IOrganisation;
}