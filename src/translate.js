import fetch from "isomorphic-fetch";
import { concat, curry, pipe, reduce, assocPath, mergeDeepWith } from "ramda";
import {
    traverse,
    buildEndpoint,
    findInterpolations,
    replaceInterpolations,
    revertInterpolations,
    verifyISOCode
} from "./utils";
import { SERVICES, createFetchForService } from "./services";

export const translate = async ({ path, interpolations, promise }) =>
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
        });

const PLACEHOLDER = "$$$";

export default async ({
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
    const promises = [];
    const createFetch = createFetchForService(service);
    translationMap
        .map(findInterpolations(regexp))
        .map(replaceInterpolations(PLACEHOLDER))
        .forEach(({ path, phrase, interpolations }) => {
            const promise = createFetch({ apiKey, isoCode, phrase });
            promises.push(translate({ path, interpolations, promise }));
        });

    return await Promise.all(promises).then(translated =>
        reduce(
            (acc, { path, original }) => assocPath(path, original, acc),
            {},
            translated
        )
    );
};
