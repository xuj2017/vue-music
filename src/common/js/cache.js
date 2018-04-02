import storage from 'good-storage';

const SEARCH_KEY = '__search__';
const SEARCH_MAX_LENGTH = 15;

function inertArray(arr, val, compare, maxlen) {
    const index = arr.findIndex(compare);
    if (index === 0) {
        return
    }
    if (index > 0) {
        arr.splice(index, 1)
    }
    arr.unshift(val)

    if (maxlen && arr.length > maxlen) {
        arr.pop();
    }
}

export function saveSearch(query) {
    let searches = storage.get(SEARCH_KEY, [])

    inertArray(searches, query, (item) => {
        return item === query
    }, SEARCH_MAX_LENGTH)

    storage.set(SEARCH_KEY, searches)

    return searches;
}


export function delateSearch(query) {
    let searches = storage.get(SEARCH_KEY, []);
    deleteFromArray(searches, (item) => {
        return item === query
    })

    storage.set(SEARCH_KEY,searches);
    return searches;
}

export function clearSearch(){
    storage.remove(SEARCH_KEY);
    return [];
}

function deleteFromArray(arr,compare){
    const index= arr.findIndex(compare);
    if(index>=0){
        arr.splice(index,1)
    }
}

export function loadSearch() {
    return storage.get(SEARCH_KEY, []);
}
