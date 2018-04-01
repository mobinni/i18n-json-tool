import fetch from "isomorphic-fetch";

import { curry, pipe, map, extractKeys, flatten, merge } from "./utils";
import { isoCodes } from "./iso-codes";

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
    key,
    interpolations,
    phrase
}) => {
    let newPhrase = phrase.slice();
    interpolations.map(({ value }) => {
        newPhrase = newPhrase.replace(value, () => placeholder);
    });
    return { key, phrase: newPhrase, interpolations };
};

export const findInterpolations = regexp => ({ key, phrase }) => {
    const regex = new RegExp(regexp);
    const interpolations = [];
    let match;
    while ((match = regex.exec(phrase))) {
        if (match) {
            interpolations.push({ value: match[0], index: regex.lastIndex });
        }
    }
    return {
        key,
        interpolations,
        phrase
    };
};

export const buildEndpoint = (apiKey, isoCode, phrase) =>
    "https://translate.yandex.net/api/v1.5/tr.json/translate?" +
    `lang=${isoCode}` +
    `&key=${apiKey}` +
    `&text=${encodeURIComponent(phrase)}`;

export const translate = async ({ key, interpolations, url }) =>
    await fetch(url, { method: "POST" })
        .then(res => res.json())
        .then(res => {
            const phrase = res.text.join();
            const original = revertInterpolations(PLACEHOLDER)({
                phrase,
                interpolations
            });
            return Promise.resolve({
                [key]: original
            });
        });

const PLACEHOLDER = "$$$";
export default async ({ apiKey, isoCode, translations, regexp = "//g" }) => {
    if (!verifyISOCode(isoCode))
        return Promise.reject(new Error("Please supply a valid iso code"));

    const endpoints = pipe(
        extractKeys,
        map(key =>
            pipe(
                findInterpolations(regexp),
                replaceInterpolations(PLACEHOLDER)
            )({ key, phrase: translations[key] })
        ),
        map(({ key, phrase, interpolations }) => ({
            key,
            phrase,
            interpolations,
            url: buildEndpoint(apiKey, isoCode, phrase)
        }))
    )(translations);
    return await Promise.all(
        endpoints.map(async ({ key, url, interpolations }) => {
            return await translate({ key, url, interpolations });
        })
    ).then(pipe(flatten, merge));
};

export const verifyISOCode = code => !!isoCodes.find(iso => iso.code === code);
