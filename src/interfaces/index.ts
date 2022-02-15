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
export interface IDevice {
    id: number;
    uid: string;
    deviceName: string;
    deviceModel: string;
    deviceBrand: string;
    deviceSize: string;
    deviceLocation: string;
    deviceStatus: string;
    playingCampaign: string;
    activeCampaigns: 0 | 1;
    createdAt: string;
    updatedAt: string;
    organisationId: number;
    resolutionId: number;
}

// CONTENT
export interface IContent {
    id: number;
    organisationId: number;
    contentName: string;
    contentDescription: string;
    fileType: string;
    fileSize: number;
    downloadUrl: string;
    streamUrl: string | null;
    fileName: string;
    filePath: string;
    createdAt: string;
    updatedAt: string;
}

export interface IContentWithOrganisation extends IContent {
    organisation: IOrganisation;
}

// CAMPAIGNS
export interface ICampaign {
    id?: string;
    organisationId: number;
    campaignName: string;
    campaignDescription: string;
    uid: string;
    campaignStatus: string | 'ACTIVE' | 'INACTIVE';
    startDate: string;
    endDate: string;
    campaignFrequency: number;
    createdAt?: string;
    updatedAt?: string;
    contents: any[];
    devices: any[];
    organisation: IOrganisation;
}