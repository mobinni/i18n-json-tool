const { keys, path: pathOf } = require("ramda");

const { isoCodes } = require("./iso-codes");

module.exports.verifyISOCode = code =>
    !!isoCodes.find(iso => iso.code === code);

const verify = obj => typeof obj === "string" || typeof obj === "number";

module.exports.traverse = obj => {
    const results = [];

    function loopKeys(obj, prevPath = []) {
        const objKeys = keys(obj);
        return objKeys.map(k => {
            let path = [];
            if (!verify(obj[k])) {
                if (prevPath) path = prevPath;
                path.push(k);
                loopKeys(obj[k], path);
            } else {
                results.push({
                    path: [...prevPath, k],
                    phrase: obj[k]
                });
            }
            path.pop();
        });
    }
    loopKeys(obj);
    return results;
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
