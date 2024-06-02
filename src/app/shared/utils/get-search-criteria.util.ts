export const getSearchCriteria = <TEntity extends Record<string, any>>(query: string, fields: Array<keyof Partial<TEntity>>) => {
  return fields.reduce((acc, key) => {
    acc[key] = query;
    return acc;
  }, {} as Record<keyof Partial<TEntity>, string>);
};
