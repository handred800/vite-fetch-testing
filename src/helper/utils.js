import _ from 'lodash';

export const thousandFormat = (inputVal) => inputVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// filter
export const filterWithCurry = (year) => {
  return (list) => _.filter(list, (item) => item.createAt.startsWith(year));
}

// sort
export const sortBySize = (list) => {
  return list.sort((a, b) => (a - b));
}

export const sortByCurry = (keyname) => {
  return (list) => _.orderBy(list, [keyname], ['desc']);
}

