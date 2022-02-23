// joins default values using AND
export const getWhereQuery = (valuesObject: any, joinBy?: 'AND' | 'OR') => {
    const requiredData = Object.entries(valuesObject).filter(e => Boolean(e[1]))
    const where = requiredData.map(e => `${e[0]}='${e[1]}'`).join(` ${joinBy || 'AND'} `)
    console.log('where >>> ', where)
    return where
}

export const getUpdateSetQueryString = (params: {}) => {
    const dateArray = ['updatedAt', 'startDate', 'endDate']
    const requiredData = Object.entries(params).filter(e => e[1])
    return requiredData.map(e => {
        const isADateColumn = dateArray.includes(e[0])
        if (isADateColumn) {
            return `${e[0]}=DATE_FORMAT(STR_TO_DATE('${e[1]}','%Y-%m-%dT%H:%i:%s.000Z'),'%Y-%m-%d %H:%i:%s')`
        }
        return `${e[0]}='${e[1]}'`
    }).join(', ')
}