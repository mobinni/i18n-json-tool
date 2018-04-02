import { keys } from "ramda";

import { isoCodes } from "./iso-codes";

export const verifyISOCode = code => !!isoCodes.find(iso => iso.code === code);

export const traverse = obj => {
    const verify = obj => typeof obj === "string" || typeof obj === "number";
    const results = [];
    (function loopKeys(obj, prevPath) {
        const objKeys = keys(obj);
        objKeys.map(k => {
            let path = [];
            if (prevPath) path = prevPath;
            if (!verify(obj[k])) {
                path.push(k);
                return loopKeys(obj[k], path);
            }

            results.push({
                path: [].concat(path, k),
                phrase: obj[k]
            });
        });
    })(obj);
    return results;
};

export const revertInterpolations = placeholder => ({
    interpolations,
    phrase
}) => {
    let originalPhrase = new String(phrase);
    if (!interpolations || !interpolations.length) return phrase;
    interpolations.map(({ value }) => {
        originalPhrase = originalPhrase.replace(placeholder, () => value);
    });
    return originalPhrase;
};

export const replaceInterpolations = placeholder => ({
    interpolations,
    phrase,
    ...other
}) => {
    let newPhrase = new String(phrase);
    interpolations.map(({ value }) => {
        newPhrase = newPhrase.replace(value, () => placeholder);
    });
    return { phrase: newPhrase.toString(), interpolations, ...other };
};

export const findInterpolations = regexp => ({ phrase, ...other }) => {
    const regex = new RegExp(regexp);
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

export const buildEndpoint = (apiKey, isoCode, phrase) =>
    "https://translate.yandex.net/api/v1.5/tr.json/translate?" +
    `lang=${isoCode}` +
    `&key=${apiKey}` +
    `&text=${encodeURIComponent(phrase)}`;
