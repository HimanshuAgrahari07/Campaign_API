import { IOrganisation, RequireAtLeastOne, IContent, IContentWithOrganisation } from '../../interfaces';
import * as query from '../../database/DBQuery';
import hydratorsContentLite from './hydratorsContentLite'


interface IHydrateContentsWithOrgsParam {
    organisationId?: number;
    organisation?: IOrganisation;
    contents?: IContent[];
    contentIds?: number[];
}

export default async (params: RequireAtLeastOne<IHydrateContentsWithOrgsParam, 'organisation' | 'organisationId'>): Promise<IContentWithOrganisation[]> => {
    const { organisationId: paramOrganisationId,
        organisation: paramOrganisation,
        contents: paramContents,
        contentIds: paramContentIds } = params;

    let organization: IOrganisation;
    let contents: IContent[];

    if (paramOrganisation) {
        organization = paramOrganisation;
    } else {
        const organizations = await query.getOrganisationById(paramOrganisationId);
        organization = organizations[0]
    }

    const organisationId = organization.id;


    if (paramContents && paramContents.length > 0) {
        contents = await hydratorsContentLite({ contents: paramContents })
    } else if (paramContentIds && paramContentIds.length > 0) {
        contents = await hydratorsContentLite({ contentIds: paramContentIds })
    } else if (organisationId) {
        contents = await query.getAllContentsListForAnOrganisation(organisationId)
    }

    const out: IContentWithOrganisation[] = contents.map(content => ({
        ...content,
        organisation: organization
    }))

    return out;
};
