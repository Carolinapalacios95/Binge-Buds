import { React } from 'react';
import { useQuery } from '@apollo/client';
import { SEARCH_MOVIE } from '../utils/queries';
const SearchList = ( {query} ) => {
    const{ loading, data } = useQuery(SEARCH_MOVIE, {
        variables: { query: query }
    });
    if(loading) {
        return <h1>loading...</h1>
    }
    return (
        <div>
            {data}
        </div>
    )
}
export default SearchList;