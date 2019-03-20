const { chain, type, toPairs, fromPairs, map, keys } = require("ramda");

const { isoCodes } = require("./iso-codes");

module.exports.verifyISOCode = code =>
    !!isoCodes.find(iso => iso.code === code);

// https://github.com/ramda/ramda/wiki/Cookbook#flatten-a-nested-object-into-dot-separated-key--value-pairs
const flattenObj = obj => {
    const go = obj_ =>
        chain(([k, v]) => {
            if (type(v) === "Object" || type(v) === "Array") {
                return map(([k_, v_]) => [`${k}.${k_}`, v_], go(v));
            } else {
                return [[k, v]];
            }
        }, toPairs(obj_));

    return fromPairs(go(obj));
};

module.exports.traverse = obj => {
    const flattened = flattenObj(obj);
    return keys(flattened).map(k => ({
        path: k.split("."),
        phrase: flattened[k]
    }));
};

module.exports.revertInterpolations = placeholder => ({
    interpolations,
    phrase
}) => {
    let originalPhrase = phrase;
    if (!interpolations || !interpolations.length) return phrase;
    interpolations.map(({ value }) => {
        originalPhrase = originalPhrase.replace(placeholder, () => value);
    });
    return originalPhrase;
};

module.exports.replaceInterpolations = placeholder => ({
    interpolations,
    phrase,
    ...other
}) => {
    let newPhrase = phrase;
    interpolations.map(({ value }) => {
        newPhrase = newPhrase.replace(value, () => placeholder);
    });
    return { phrase: newPhrase.toString(), interpolations, ...other };
};

module.exports.findInterpolations = regexp => ({ phrase, ...other }) => {
    const regex = new RegExp(regexp.toString(), "g");
    const interpolations = [];
    let match;
    while ((match = regex.exec(phrase))) {
        if (match) {
            interpolations.push({ value: match[0], index: regex.lastIndex });
        }
    }
    return {
        interpolations,
        phrase,
        ...other
    };
};
