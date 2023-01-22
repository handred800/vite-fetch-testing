import _ from 'lodash';

export const thousandFormat = (inputVal) => inputVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// filter
export const filterWith = (year) => {
    return (list) => _.filter(list, (item) => item.createAt.startsWith(year));
}

// order
export const orderWith = (keyname) => {
    return (list) => _.orderBy(list, [keyname], ['desc']);
}

