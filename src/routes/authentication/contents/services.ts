import * as query from '../../../database/DBQuery'
import hydratorsContentsWithOrgs from '../../../lib/hydrators/hydratorsContentsWithOrgs';
import hydratorsContentLite from '../../../lib/hydrators/hydratorsContentLite';
import { IContent, IContentWithOrganisation } from 'interfaces';


export const createNew = async (params: {
    organisationId: number;
    contentName: string;
    contentDescription: string;
    fileType: string;
    fileSize: number;
    downloadUrl: string;
    fileName: string;
    filePath: string;
}) => {
    const responseFromDB = await query.createContent(params);
    const insertId = responseFromDB.insertId
    const data = await query.getContentById(insertId, params.organisationId);

    return data
}

export const getAllList = async (organisationId: number) => {
    const contents = await query.getAllContentsListForAnOrganisation(organisationId)
    return await hydratorsContentsWithOrgs({ organisationId, contents })
}

export const getOne = async (organisationId: number, contentId: number): Promise<IContentWithOrganisation> => {
    const liteContents = await hydratorsContentLite({ contentIds: [contentId] })

    if (liteContents.length === 0) return {} as IContentWithOrganisation

    const hydratedContent = await hydratorsContentsWithOrgs({ organisationId, contents: liteContents })
    return hydratedContent[0]
}

export const updateOne = async (contentId: number, params: {
    organisationId: number;
    contentName: string;
    contentDescription: string;
    fileType: string;
    fileSize: number;
    downloadUrl: string;
    fileName: string;
    filePath: string;
}) => {
    const responseFromDB = await query.updateContent(contentId, params);
    if(responseFromDB.affectedRows !== 1) return {} as IContentWithOrganisation

    const data = await query.getContentById(contentId, params.organisationId);
    return data
}