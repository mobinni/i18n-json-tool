const SERVICES = {
    GOOGLE: "google",
    YANDEX: "yandex",
    BING: "bing"
};

module.exports.SERVICES = SERVICES;

const buildBingFetch = (apiKey, isoCode, phrase) => () => {
    const parser = new DOMParser();
    return fetch(
        `https://api.microsofttranslator.com/V2/Http.svc/Translate?text=${encodeURIComponent(
            phrase
        )}&to=${isoCode}`,
        {
            headers: {
                "Ocp-Apim-Subscription-Key": apiKey
            }
        }
    )
        .then(res => res.text())
        .then(res => {
            const xmlDoc = parser.parseFromString(res, "text/xml");
            const string = xmlDoc.getElementsByTagName("string")[0]
                .childNodes[0].nodeValue;
            return string;
        });
};

module.exports.buildBingFetch = buildBingFetch;

const buildGoogleFetch = (apiKey, isoCode, phrase) => () =>
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

module.exports.buildGoogleFetch = buildGoogleFetch;

const buildYandexFetch = (apiKey, isoCode, phrase) => () =>
    fetch(
        `https://translate.yandex.net/api/v1.5/tr.json/translate?lang=${isoCode}` +
            `&key=${apiKey}` +
            `&text=${encodeURIComponent(phrase)}`,
        { method: "POST" }
    )
        .then(res => res.json())
        .then(res => res.text.join());

module.exports.buildYandexFetch = buildYandexFetch;

const translationServices = {
    [SERVICES.BING]: buildBingFetch,
    [SERVICES.GOOGLE]: buildGoogleFetch,
    [SERVICES.YANDEX]: buildYandexFetch
};

const createFetchForService = service => ({ apiKey, isoCode, phrase }) =>
    translationServices[service](apiKey, isoCode, phrase);

module.exports.createFetchForService = createFetchForService;
