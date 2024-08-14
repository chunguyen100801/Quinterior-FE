export const objectToQueryString = (obj: Record<string, string | number>) => {
  const str = [];
  for (const p in obj)
    if (obj.hasOwnProperty.call(obj, p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  return str.join('&');
};

export const formatPriceSV = (
  price: number,
  locale = 'vi',
  currency = 'VND'
) => {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  });
  return formatter.format(price);
};

// export const checkURLExist = (url: string) => {
//   return fetch(url, {
//     method: 'HEAD',
//   }).then((res) => res.ok);
// };
