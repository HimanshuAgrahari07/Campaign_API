import { RequireAtLeastOne, IContent } from '../../interfaces';
import * as query from '../../database/DBQuery';

interface IHydrateContentsLite {
    contents?: IContent[],
    contentIds?: number[]
}

export default async (params: RequireAtLeastOne<IHydrateContentsLite, 'contents' | 'contentIds'>): Promise<IContent[]> => {
    let contents: IContent[];

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
