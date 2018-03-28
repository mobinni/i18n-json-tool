import { extractKeys } from "./utils";
import { verifyISOCode, buildEndpoints, translate } from "./translate";

describe("Translation test suite", () => {
    const isoCode = "en";
    const invalidCode = "jp";
    const en = {
        key: "abc",
        key2: 123,
        key3: "test"
    };
    it("should extract the keys of a given object", () => {
        expect(extractKeys(en)).toEqual(["key", "key2", "key3"]);
    });
    it("should verify if an iso code is valid", () => {
        expect(verifyISOCode(isoCode)).toEqual(true);
    });
    it("should error if an iso code is invalid", () => {
        expect(verifyISOCode(invalidCode)).toEqual(false);
    });

    it("should build a url for each string", () => {
        const results = buildEndpoints("en", en);
        expect(results).toEqual([
            "https://translate.yandex.net/api/v1.5/tr.json/translate?lang=en&key=&text=abc",
            "https://translate.yandex.net/api/v1.5/tr.json/translate?lang=en&key=&text=123",
            "https://translate.yandex.net/api/v1.5/tr.json/translate?lang=en&key=&text=test"
        ]);
    });

    it("should translate a string from yandex", async () => {
        const result = await translate(
            "https://translate.yandex.net/api/v1.5/tr.json/translate?lang=nl&key=&text=Wereld"
        );

        expect(result).toEqual([undefined]);
    });
});
