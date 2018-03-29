import environment from "dotenv";
import { extractKeys } from "./utils";
import translateAll, {
    verifyISOCode,
    buildEndpoint,
    translate
} from "./translate";

describe("Translation test suite", () => {
    let apiKey;
    const isoCode = "en";
    const invalidCode = "jp";
    const en = {
        key: "World",
        key2: "Soccer",
        key3: "Today is a nice day"
    };
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
    it("should extract the keys of a given object", () => {
        expect(extractKeys(en)).toEqual(["key", "key2", "key3"]);
    });
    it("should verify if an iso code is valid", () => {
        expect(verifyISOCode(isoCode)).toEqual(true);
    });
    it("should error if an iso code is invalid", () => {
        expect(verifyISOCode(invalidCode)).toEqual(false);
    });
    it("should translate a string from yandex", async () => {
        expect(
            translate({ key: "key", url: buildEndpoint(apiKey, "nl", en.key) })
        ).resolves.toEqual({ key: "Wereld" });
    });

    it("should translate a file from yandex", async () => {
        const results = await translateAll({
            apiKey,
            isoCode: "nl",
            translations: en
        });
        expect(results).toEqual([
            { key: "Wereld", key2: "Voetbal", key3: "Vandaag is een mooie dag" }
        ]);
    });
});
