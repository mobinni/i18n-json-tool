export const extractKeys = obj => Object.keys(obj);
export const compose = (...fs) => fs.reduce((f, g) => (...xs) => f(g(...xs)));
export const pipe = (...fs) => fs.reduceRight((f, g) => (...xs) => f(g(...xs)));
export const curry = (f, ...xs) =>
    xs.length >= f.length ? f(...xs) : (...other) => curry(f, ...xs, ...other);
export const map = fn => x => x.map(fn);
export const flatten = arr => arr.reduce((acc, e) => acc.concat(e), []);
export const merge = arr => {
    const obj = {};
    arr.map(e => Object.assign(obj, e));
    return [obj];
};
