import environment from "dotenv";
import {
    verifyISOCode,
    findInterpolations,
    replaceInterpolations
} from "./utils";
import translateAll, { translate } from "./translate";

describe("Translation test suite", () => {
    let apiKey;
    const isoCode = "en";
    const invalidCode = "jp";
    const en = {
        key: "World",
        key2: "Soccer",
        key3: "Today is a nice day {{random}}",
        deeply: {
            nested: {
                key: {
                    sequence: "seq"
                },
                number: 1,
                letters: "number"
            }
        }
    };

    describe("Yandex suite", () => {
        beforeAll(() => {
            const config = environment.config();
            if (config.error) {
                throw new Error(
                    "Please supply an env file with the YANDEX_API_KEY to test"
                );
            }
            const env = config.parsed;
            apiKey = env.YANDEX_API_KEY;
        });

        it("should verify if an iso code is valid", () => {
            expect(verifyISOCode(isoCode)).toEqual(true);
        });

        it("should error if an iso code is invalid", () => {
            expect(verifyISOCode(invalidCode)).toEqual(false);
        });

        it("should translate a file from yandex", async () => {
            const results = await translateAll({
                apiKey,
                isoCode: "nl",
                translations: en,
                regexp: /{{([^}]+?)}}/g
            });
            expect(results).toEqual({
                deeply: {
                    nested: {
                        key: { letters: "aantal", number: "1", sequence: "seq" }
                    }
                },
                key: "Wereld",
                key2: "Voetbal",
                key3: "Vandaag is een mooie dag {{random}}"
            });
        });
        it("should find all instances of a regex-bound interface in a string", () => {
            expect(
                findInterpolations("{{([^}]+?)}}")({
                    key: "key",
                    phrase: "string with {{string}}"
                })
            ).toEqual({
                interpolations: [{ index: 22, value: "{{string}}" }],
                key: "key",
                phrase: "string with {{string}}"
            });
            expect(
                findInterpolations("{{([^}]+?)}}")({
                    key: "key",
                    phrase: "{{thing}} string with {{string}}"
                })
            ).toEqual({
                interpolations: [
                    { index: 9, value: "{{thing}}" },
                    { index: 32, value: "{{string}}" }
                ],
                key: "key",
                phrase: "{{thing}} string with {{string}}"
            });
        });

        it("should replace all instances of a regex-bound interface in a string", () => {
            expect(
                replaceInterpolations("$$$")({
                    interpolations: [
                        { index: 9, value: "{{thing}}" },
                        { index: 32, value: "{{string}}" }
                    ],
                    key: "key",
                    phrase: "{{thing}} string with {{string}}"
                })
            ).toEqual({
                interpolations: [
                    { index: 9, value: "{{thing}}" },
                    { index: 32, value: "{{string}}" }
                ],
                key: "key",
                phrase: "$$$ string with $$$"
            });
        });
    });

    // tests skipped for rate limiting
    describe.skip("Google translate suite", () => {
        beforeAll(() => {
            const config = environment.config();
            if (config.error) {
                throw new Error(
                    "Please supply an env file with the GOOGLE_API_KEY to test"
                );
            }
            const env = config.parsed;
            apiKey = env.GOOGLE_API_KEY;
        });

        it("should translate a file from google", async () => {
            const results = await translateAll({
                apiKey,
                isoCode: "nl",
                translations: en,
                regexp: /{{([^}]+?)}}/g,
                service: "google"
            });
            expect(results).toEqual({
                deeply: {
                    nested: {
                        key: { letters: "aantal", number: "1", sequence: "seq" }
                    }
                },
                key: "Wereld",
                key2: "Voetbal",
                key3: "Vandaag is een mooie dag {{random}}"
            });
        });
    });

    describe.skip("Bing translate suite", () => {
        beforeAll(() => {
            const config = environment.config();
            if (config.error) {
                throw new Error(
                    "Please supply an env file with the GOOGLE_API_KEY to test"
                );
            }
            const env = config.parsed;
            apiKey = env.BING_API_KEY;
        });

        it("should translate a file from bing", async () => {
            const results = await translateAll({
                apiKey,
                isoCode: "es",
                translations: en,
                regexp: /{{([^}]+?)}}/g,
                service: "bing"
            });
            expect(results).toEqual({
                deeply: {
                    nested: {
                        key: { letters: "número", number: "1", sequence: "Seq" }
                    }
                },
                key: "Mundo",
                key2: "Fútbol",
                key3: "Hoy es un día bonito {{random}}"
            });
        });
    });
});
