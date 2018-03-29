import fetch from "isomorphic-fetch";

import { curry, pipe, map, extractKeys, flatten, merge } from "./utils";
import { isoCodes } from "./iso-codes";

export const findInterpolationInstances = (regexp, string) => {
    const regex = new RegExp(regexp);
    const matches = [];
    const lastIndexes = {};
    let match;
    while ((match = regex.exec(string))) {
        matches.push({ value: match[0], index: regex.lastIndex });
    }
    return matches;
};

export const buildEndpoint = (apiKey, isoCode, string) =>
    "https://translate.yandex.net/api/v1.5/tr.json/translate?" +
    `lang=${isoCode}` +
    `&key=${apiKey}` +
    `&text=${encodeURIComponent(string)}`;

export const translate = async ({ key, url }) =>
    await fetch(url, { method: "POST" })
        .then(res => res.json())
        .then(res =>
            Promise.resolve({
                [key]: res.text.join()
            })
        );

export default async ({ apiKey, isoCode, translations }) => {
    if (!verifyISOCode(isoCode))
        return Promise.reject(new Error("Please supply a valid iso code"));

    const endpoints = pipe(
        extractKeys,
        map(key => ({
            key,
            url: buildEndpoint(apiKey, isoCode, translations[key])
        }))
    )(translations);

    return await Promise.all(
        endpoints.map(async ({ key, url }) => {
            return await translate({ key, url });
        })
    ).then(pipe(flatten, merge));
};

export const verifyISOCode = code => !!isoCodes.find(iso => iso.code === code);
