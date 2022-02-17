import { RequireAtLeastOne, IContentLite } from '../../interfaces';
import * as query from '../../database/DBQuery';

interface IHydrateContentsLite {
    contents?: IContentLite[],
    contentIds?: number[]
}

export default async (params: RequireAtLeastOne<IHydrateContentsLite, 'contents' | 'contentIds'>): Promise<IContentLite[]> => {
    let contents: IContentLite[];

    if (params.contents && params.contents.length > 0) {
        contents = params.contents;
    } else if(params.contentIds && params.contentIds.length > 0) {
        contents = await query.getContentsList(params.contentIds)
    } else {
        throw new Error('No contentIds or contents provided')
    }
    
    const out = contents

    return out;
};
