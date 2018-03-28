import fetch from "isomorphic-fetch";

import { curry, pipe, map, extractKeys } from "./utils";
import { isoCodes } from "./iso-codes";

const apiKey =
    ""
    
export const buildEndpoints = (isoCode, translations) =>
    pipe(
        extractKeys,
        map(
            key =>
                "https://translate.yandex.net/api/v1.5/tr.json/translate?" +
                `lang=${isoCode}` +
                `&key=${apiKey}` +
                `&text=${encodeURIComponent(translations[key])}`
        )
    )(translations);

export const translate = async url =>
    await fetch(url, { method: "POST" })
        .then(res => res.json())
        .then(res => Promise.resolve(res.text));

export default async (isoCode, translations) => {
    if (!verifyISOCode(isoCode))
        return Promise.reject(new Error("Please supply a valid iso code"));
    const endpoints = buildEndpoints(translations);
    return await Promise.all(
        endpoints.map(async e => {
            return await translate(e);
        })
    );
};

export const verifyISOCode = code => !!isoCodes.find(iso => iso.code === code);
