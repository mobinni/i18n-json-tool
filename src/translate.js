import fetch from "isomorphic-fetch";
import { assocPath, curry, pipe, map } from "ramda";
import {
    traverse,
    buildEndpoint,
    findInterpolations,
    replaceInterpolations,
    revertInterpolations,
    verifyISOCode
} from "./utils";

export const translate = async ({ path, interpolations, url }) =>
    await fetch(url, { method: "POST" })
        .then(res => res.json())
        .then(res => {
            const phrase = res.text.join();
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

export const constructUrl = ({ apiKey, isoCode }) => phrase =>
    buildEndpoint(apiKey, isoCode, phrase);

export default async ({ apiKey, isoCode, translations, regexp = "//g" }) => {
    if (!verifyISOCode(isoCode))
        return Promise.reject(new Error("Please supply a valid iso code"));
    const constructUrlForPhrase = constructUrl({ apiKey, isoCode });
    const translationMap = traverse(translations);
    const promises = [];
    translationMap
        .map(findInterpolations(regexp))
        .map(replaceInterpolations(PLACEHOLDER))
        .forEach(({ path, phrase, interpolations }) => {
            const url = constructUrlForPhrase(phrase);
            promises.push(translate({ path, interpolations, url }));
        });

    return await Promise.all(promises).then(translated => {
        let translations = {};
        translated.forEach(({ path, original }) => {
            translations = assocPath(path, original, translations);
        });
        return translations;
    });
};
