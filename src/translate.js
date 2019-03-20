require("isomorphic-fetch");
const { reduce, assocPath } = require("ramda");

const {
    traverse,
    findInterpolations,
    replaceInterpolations,
    revertInterpolations,
    verifyISOCode
} = require("./utils");
const { SERVICES, createFetchForService } = require("./services");

const PLACEHOLDER = "$$$";

const translatePhrase = async ({ path, interpolations, promise }) =>
    await promise()
        .then(phrase => {
            const original = revertInterpolations(PLACEHOLDER)({
                phrase,
                interpolations
            });
            return Promise.resolve({
                path,
                original
            });
        })
        .catch(e => {
            throw new Error(e);
        });

const translateFile = async ({
    apiKey,
    isoCode,
    translations,
    regexp = "",
    service = SERVICES.YANDEX
}) => {
    if (!verifyISOCode(isoCode)) {
        return Promise.reject(new Error("Please supply a valid iso code"));
    }

    const translationMap = traverse(translations);
    const createFetch = createFetchForService(service);

    const promises = translationMap
        .map(findInterpolations(regexp))
        .map(replaceInterpolations(PLACEHOLDER))
        .map(({ path, phrase, interpolations }) => {
            const promise = createFetch({ apiKey, isoCode, phrase });
            return translatePhrase({ path, interpolations, promise });
        });

    return await Promise.all(promises).then(translated =>
        reduce(
            (acc, { path, original }) => assocPath(path, original, acc),
            {},
            translated
        )
    );
};

module.exports.translate = translatePhrase;
module.exports = translateFile;
