const { keys } = require("ramda");

const { isoCodes } = require("./iso-codes");

module.exports.verifyISOCode = code =>
    !!isoCodes.find(iso => iso.code === code);

module.exports.traverse = obj => {
    const verify = obj => typeof obj === "string" || typeof obj === "number";
    const results = [];
    function loopKeys(obj, prevPath) {
        const objKeys = keys(obj);
        objKeys.forEach(k => {
            let path = [];
            if (!verify(obj[k])) {
                path.push(k);
                return loopKeys(obj[k], path);
            }
            if (prevPath) path = prevPath;

            results.push({
                path: [].concat(path, k),
                phrase: obj[k]
            });
        });
    }
    loopKeys(obj);
    return results;
};

module.exports.revertInterpolations = placeholder => ({
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

module.exports.replaceInterpolations = placeholder => ({
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
