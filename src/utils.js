export const extractKeys = obj => Object.keys(obj);

// Basic composition tools
export const compose = (...fs) => fs.reduce((f, g) => (...xs) => f(g(...xs)));
export const pipe = (...fs) => fs.reduceRight((f, g) => (...xs) => f(g(...xs)));
export const curry = (f, ...xs) =>
    xs.length >= f.length
        ? f(...xs)
        : (...moreXs) => curry(f, ...xs, ...moreXs);
export const map = fn => x => x.map(fn);
