export const SERVICES = {
    GOOGLE: "google",
    YANDEX: "yandex"
};

export const buildGoogleFetch = (apiKey, isoCode, phrase) => () =>
    fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}&q=${encodeURIComponent(
            phrase
        )}&target=${isoCode}`,
        {
            method: "POST",
            headers: {
                "Content-Type": " application/json"
            }
        }
    )
        .then(res => res.json())
        .then(res => res.data.translations[0].translatedText);

export const buildYandexFetch = (apiKey, isoCode, phrase) => () =>
    fetch(
        `https://translate.yandex.net/api/v1.5/tr.json/translate?lang=${isoCode}` +
            `&key=${apiKey}` +
            `&text=${encodeURIComponent(phrase)}`,
        { method: "POST" }
    )
        .then(res => res.json())
        .then(res => Promise.resolve(res.text.join()));

const translationServices = {
    [SERVICES.GOOGLE]: buildGoogleFetch,
    [SERVICES.YANDEX]: buildYandexFetch
};

export const createFetchForService = service => ({ apiKey, isoCode, phrase }) =>
    translationServices[service](apiKey, isoCode, phrase);
