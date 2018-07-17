const fs = require('fs');
const path = require('path');
const gettextParser = require("gettext-parser");


const defaults = {
    languages: ['en'],
    domain: 'webpack',
};


module.exports = class ExpandPoFilesPlugin {
    constructor(options) {
        this.options = Object.assign({}, defaults, options);
    }

    static createDefaultCatalog() {
        return {
            charset: 'utf-8',
            headers: {
                "content-type": "text/plain; charset=utf-8",
            },
            translations: {
                '': {}
            }
        }
    }

    apply(compiler) {
        let {input, localeDir, languages, domain} = this.options;
        let plugin = this;
        compiler.plugin("emit", (compilation, cb) => {

            let keys = Object.keys(require(input));

            languages.map(function (language) {
                const poFilePath = path.join(localeDir, language, 'LC_MESSAGES', domain + '.po');
                let translations = ExpandPoFilesPlugin.createDefaultCatalog();
                if (fs.existsSync(poFilePath)) {
                    // if already exists
                    let input = fs.readFileSync(poFilePath);
                    translations = gettextParser.po.parse(input);
                }

                let catalog = translations['translations'][''];
                keys.map(function (key) {

                    if (!(key in catalog))
                        catalog[key] = {
                            msgid: key,
                            comments: {reference: '...'}, // TODO: extract with occurences
                            msgstr: []
                        };
                });
                translations['translations'][''] = catalog;

                let output = gettextParser.po.compile(translations, {foldLength: 82});
                // fs.writeFileSync(poFilePath, output);

                compilation.assets[poFilePath] = {
                    source: function () {
                        return output;
                    },
                    size: function () {
                        return output.length;
                    }
                };
            });


            cb();
        });
    }
};