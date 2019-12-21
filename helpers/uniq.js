

export const uniq = (a) => {
  const prims = { boolean: {}, number: {}, string: {} };
  const objs = [];

  return a.filter((item) => {
    const type = typeof item;
    if (type in prims) return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
    return objs.indexOf(item) >= 0 ? false : objs.push(item);
  });
};