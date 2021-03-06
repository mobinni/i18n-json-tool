#!/usr/bin/env node
const program = require("commander");
const path = require("path");
const fs = require("fs");
const translate = require("./src/translate");

program
    .arguments("<file>")
    .option("-s, --service [google, yandex (default), bing]", "Yandex API key")
    .option("-k, --key <key>", "API key")
    .option("-i, --iso <code>", "isoCode to translate to")
    .option("-r, --regexp <expression>", "regular expression to filter on")
    .action(function(file) {
        const { key: apiKey, iso: isoCode, regexp = "//g", service } = program;
        if (!apiKey) throw new Error("No Yandex API key supplied");
        if (!isoCode) throw new Error("No iso code to translate to supplied");
        const filePath = path.normalize(file);
        fs.readFile(filePath, "utf8", async function(err, data) {
            if (err) throw err;
            const translations = JSON.parse(data);
            const result = await translate({
                apiKey,
                isoCode,
                translations,
                regexp,
                service
            });

            fs.writeFile(
                path.dirname(filePath) + path.join(`/${isoCode}.json`),
                JSON.stringify(result)
            );
        });
    })
    .parse(process.argv);
