#!/usr/bin/env node
const program = require("commander");
const path = require("path");
const fs = require("fs");

const window = require("window-shim");

program
    .arguments("<file>")
    .option("-k, --key <key>", "Yandex API key")
    .option("-i, --iso <code>", "isoCode to translate to")
    .option("-r, --regexp <expression>", "regular expression to filter on")
    .action(function(file) {
        const { key, iso, regexp = "//g" } = program;
        if (program.key) throw new Error("No Yandex API key supplied");
        if (program.iso)
            throw new Error("No iso code to translate to supplied");

        const filePath = path.normalize(file);
        fs.readFile(filePath, "utf8", function(err, data) {
            if (err) throw err;
            const translate = require("./lib/library");
            const translations = JSON.parse(data);
            translate(key, iso, translations, regexp);
        });
    })
    .parse(process.argv);
