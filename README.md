# Description

i18n-translate-tool was built out of the necessity to leverage internationalization before the copywriters are done translating your strings. It allows you to leverage either a CLI interface, or translate on the fly within your app returning you a JSON copy of whatever you give it.

Currently it supports:

*   Yandex Translation API
*   Google Translate

# Examples

**CLI Usage**

```
  Usage: translate [options] <file>

  Options:
    -s  --service <service>    google or yandex
    -k, --key <key>            API key
    -i, --iso <code>           isoCode to translate to
    -r, --regexp <expression>  regular expression to filter interpolations
    -h, --help                 output usage information
```

example execution

```
translate ./example/en.json -i nl -k some_key -r "{{([^}]+?)}}"
```

**Web Usage**
```javascript
import translate from "i18n-json-tool";
const translations = {
    key1: "Hello world!"
};
translate({
    apiKey,
    isoCode: "nl",
    translations,
    service, // defaults to yandex (optional)
    regexp // defaults to nothing (optional)
}).then(results => console.log(results));
```
# Roadmap
- Add support for google translate API
- Create website example for translating through an interface

# Contributing
Please feel free to open any tickets with feature requests but make sure to document:
- Use case
- Reasoning
