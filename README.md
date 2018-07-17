# Webpack propagate translation keys plugin [WIP]
For usage with webpack-extract-translation-keys-plugin:

```javascript
const path = require('path');
const ExtractTranslationKeysPlugin = require('webpack-extract-translation-keys-plugin');
const ExpandPoFilesPlugin = require('webpack-propagate-translation-keys-plugin');

const translations = path.join(__dirname, 'translation-keys.json');

module.exports = {
    ...,
    plugins: [
        new ExtractTranslationKeysPlugin({
            functionName: '_',
            output: translations
        }),
        new ExpandPoFilesPlugin({
            input: translations,
            localeDir: path.resolve(__dirname, 'locale'), // path to django locale dir
            languages: ['cs'],
            domain: 'webpack'
        })
    ]
};
```

### TODO:
- correct compiler plugin register
- parse also VueJs render functions 