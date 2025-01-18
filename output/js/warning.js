window.addEventListener('load', function (event) {
    var version = document.location.href.match(/(5.1|6.0|7.1|8.1|9.0|10|11|12|13|14|15|16)/g)[0];
    switch (version) {
        case '5.1':
        case '6.0':
        case '7.1':
        case '8.1':
        case '9.0':
            if (document.location.href.match(/properties\/[a-z]/)) {
                var loc = document.location.href.replace(/5.1\/|6.0\/|7.1\/|8.1\/|9.0\//, '').replace(/properties\//,'css-props/#prop-').slice(0, -1);
            } else if (document.location.href.match(/properties\/$/)) {
                var loc = document.location.href.replace(/5.1\/|6.0\/|7.1\/|8.1\/|9.0\//, '').replace(/properties/,'css-props');
            } else {
                var loc = document.location.href.replace(/5.1\/|6.0\/|7.1\/|8.1\/|9.0\//, '').replace(/troubleshooting/,'help-install').replace(/java|dotnet|python|perl|php|asp|coldfusion|\/com\//,'server-integration').replace(/apply-css|xml-input|xml-style|xinclude/,'prince-input').replace(/properties/,'css-props').replace(/pdf-output|pdf-bookmarks|pdf-metadata|pdf-profiles/,'prince-output').replace(/tables|lists|fonts/,'styling').replace(/page-size|page-style|page-headers-footers|page-selectors|page-numbers|page-breaks/,'paged').replace(/selectors/,'css-selectors').replace(/counters|cross-references|script-func/,'gen-content').replace(/images|svg|color/,'graphics').replace(/css21/,'css-refs');
            };
            var place = document.getElementById("intro");
            break;
        case '10':
        case '11':
            if (document.location.href.match(/properties\/[a-z]/)) {
                var loc = document.location.href.replace(/10\/|11\//, '').replace(/properties\//,'css-props/#prop-').slice(0, -1);
            } else if (document.location.href.match(/properties\/$/)) {
                var loc = document.location.href.replace(/10\/|11\//, '').replace(/properties/,'css-props')
            } else if (document.location.href.match(/(hyphenation|ligatures|watermarks|rotating|two-pass)/)) {
                var loc = document.location.href.replace(/10\/|11\//, '').replace(/hyphenation|ligatures|watermarks|rotating|two-pass/,'cookbook');
                if (document.location.href.match(/hyphenation/)) {
                    var loc = loc.replace(/\#hyphenation/,'') + '#hyphenation';
                } else if (document.location.href.match(/ligatures/)) {
                    var loc = loc.replace(/\#ligatures/,'') + '#typographic-ligatures';
                } else if (document.location.href.match(/watermarks/)) {
                    var loc = loc.replace(/\#watermarks/,'') + '#watermarks';
                } else if (document.location.href.match(/rotating/)) {
                    var loc = loc.replace(/\#rotating/,'') + '#rotating-content-in-table-cells';
                } else if (document.location.href.match(/two-pass/)) {
                    var loc = loc.replace(/\#two-pass/,'') + '#the-multi-pass-solution';
                }
            } else {
                var loc = document.location.href.replace(/10\/|11\//, '').replace(/troubleshooting/,'help-install').replace(/css-box|tables|lists|fonts|layout|redefining-font-families|text-formatting|writing-mode|columns|floats|footnotes/,'styling').replace(/images|svg/,'graphics').replace(/apply-css|apply-javascript|xml\//,'prince-input').replace(/pdf-output|pdf-bookmarks|pdf-metadata|pdf-profiles/,'prince-output').replace(/java\/|dotnet|python|perl|php|asp|coldfusion|activex/,'server-integration').replace(/imaging|color\/|color-management|filters|images|svg|rasterization/,'graphics').replace(/selectors/,'css-selectors').replace(/css21/,'css-refs').replace(/advanced-paged/,'paged').replace(/troubleshooting|faq/,'help').replace(/cmd-control/,'command-line')
            };
            var place = document.getElementsByClassName("header-container")[0];
            break;
        case '12':
            var loc = mapToNewURL(document.location);
            var place = document.getElementsByClassName("header-container")[0];
            break;
        case '13':
        case '14':
        case '15':
        case '16':
            var loc = document.location.href.replace(/13\/|14\/|15\/|16\//, '');
            var place = document.getElementById("__docusaurus");
            break;
    }
    var warning = document.createElement("div");
    warning.className = "annoying-warning";
    warning.innerHTML = "<p style='margin: 0 !important; max-width: 100% !important; text-align: center; color: red;'><strong>Note:</strong> This documentation is for Prince version " + version + ". The latest documentation is available <a id='warning-href' href='" + loc + "'>here</a>.</p>";
    warning.style.setProperty("position", "fixed");
    warning.style.setProperty("z-index", "3");
    warning.style.setProperty("bottom", "2em");
    warning.style.setProperty("left", "1em");
    warning.style.setProperty("right", "1em");
    warning.style.setProperty("text-align", "center");
    warning.style.setProperty("box-shadow", "0 2px 8px black");
    warning.style.setProperty("background", "#fdd");
    warning.style.setProperty("color", "red");
    warning.style.setProperty("font-weight", "bold");
    warning.style.setProperty("padding", "0.75em 1em");
    warning.style.setProperty("border", "solid red");
    warning.style.setProperty("border-radius", "1em");
    warning.style.setProperty("margin-top", "1.2em");
    if (version.match(/(13|14|15|16)/g)) {
        place.parentNode.insertBefore(warning, place);
    } else {
        place.parentNode.insertBefore(warning, place.nextSibling);
    }
});

window.addEventListener('hashchange', function (event) {
    var version = document.location.href.match(/(5.1|6.0|7.1|8.1|9.0|10|11|12|13|14|15|16)/g)[0];
    switch (version) {
        case '5.1':
        case '6.0':
        case '7.1':
        case '8.1':
        case '9.0':
            break;
        case '10':
        case '11':
            break;
        case '12':
            var loc = mapToNewURL(document.location);
            document.getElementById('warning-href').href = loc;
            break;
        case '13':
        case '14':
        case '15':
        case '16':
            document.getElementById('warning-href').href = event.newURL.replace(/13\/|14\/|15\/|16\//, '');
            break;
    }
});


function mapToNewURL(oldUrl) {
    var hash = oldUrl.hash;
    if (hash.startsWith('#prop-')) {
        return oldUrl.href.replace(/12\//, '').replace(/doc-refs/, 'css-props');
    } else if (hash.startsWith('#window.')) {
        return oldUrl.href.replace(/12\//, '').replace(/doc-refs/, 'js-support');
    } else {
        switch (hash) {
            case '#start':
            case '#installing':
            case '#windows':
            case '#macos':
            case '#linux':
            case '#install-debian':
            case '#install-centos':
            case '#install-generic':
            case '#license-install':
            case '#license-install-windows':
            case '#license-install-other':
            case '#installation-layout':
            case '#windows-layout':
            case '#macosx-layout':
            case '#linux-layout':
                return oldUrl.href.replace(/12\//, '').replace(/doc-install/, 'installing');
            case '#first-doc':
            case '#lab-report':
            case '#running-prince':
            case '#styling-lab-report':
                return oldUrl.href.replace(/12\//, '').replace(/doc-install/, 'first-doc');
            case '#help-install':
            case '#troubleshooting-install':
            case '#missing-fonts':
            case '#fontconfig':
            case '#shared-libraries':
            case '#trouble-path-issues':
            case '#faq-install':
                return oldUrl.href.replace(/12\//, '').replace(/doc-install/, 'help-install');
            case '#styling':
            case '#fonts':
            case '#font-family':
            case '#opentype-features':
            case '#font-families':
            case '#redifining-font-families':
            case '#layout':
            case '#text-formatting':
            case '#paragraph-formatting':
            case '#writing-mode':
            case '#box-model':
            case '#margin':
            case '#border':
            case '#padding':
            case '#background':
            case '#display':
            case '#transformations':
            case '#lists':
            case '#content-list-markers':
            case '#list-markers':
            case '#list-marker-type':
            case '#list-marker-style':
            case '#tables':
            case '#table-auto-layout':
            case '#table-fixed-layout':
            case '#table-borders-separate':
            case '#table-border-collapse':
            case '#table-column-span':
            case '#table-row-span':
            case '#tables-numbering-rows':
            case '#tables-running-headers-footers':
            case '#tables-caption':
            case '#columns':
            case '#floats':
            case '#float-extensions':
            case '#float-extension-page-column':
            case '#float-extension-spread':
            case '#float-extension-footnotes':
            case '#float-extension-conditionals':
            case '#footnotes':
            case '#footnote-calls':
            case '#footnote-markers':
            case '#footnotes-styling':
            case '#flexbox':
            case '#flex-containers':
            case '#flex-items':
                return oldUrl.href.replace(/12\//, '').replace(/doc-prince/, 'styling');
            case '#paged':
            case '#page-size':
            case '#page-style':
            case '#page-regions':
            case '#page-gen-content':
            case '#content-copying-text':
            case '#content-taking-elements':
            case '#page-rules':
            case '#named-pages':
            case '#paged-blank':
            case '#page-groups':
            case '#controlling-pagination':
            case '#page-breaks':
            case '#page-breaks-decoration':
            case '#widows-and-orphans':
            case '#page-marks':
                return oldUrl.href.replace(/12\//, '').replace(/doc-prince/, 'paged');
            case '#gen-content':
            case '#gen-content-functions':
            case '#gen-content-functions-pagepolicy':
            case '#content-before-after':
            case '#counters':
            case '#counters-reset-increment':
            case '#counters-display':
            case '#counters-nested':
            case '#counter-styles':
            case '#crossref':
            case '#counter-target':
            case '#target-content':
            case '#scriptfunc':
            case '#content-date-time':
            case '#counter-user-styles':
                return oldUrl.href.replace(/12\//, '').replace(/doc-prince/, 'gen-content');
            case '#javascript':
            case '#js-print':
            case '#js-prince':
            case '#js-logging':
            case '#js-console':
            case '#js-event':
            case '#js-document-stats':
            case '#js-prince-obj':
            case '#js-pdf':
            case '#js-box':
            case '#js-unsupported':
                return oldUrl.href.replace(/12\//, '').replace(/doc-prince/, 'javascript');
            case '#graphics':
            case '#color':
            case '#color-rgb':
            case '#color-cmyk':
            case '#color-hsl':
            case '#color-spot':
            case '#color-management':
            case '#colman-intro':
            case '#pdf-colman':
            case '#prince-colman':
            case '#color-conversion':
            case '#richt-true-black':
            case '#page-color-space':
            case '#filters':
            case '#images':
            case '#images-html':
            case '#images-docbook':
            case '#images-xml':
            case '#images-css':
            case '#images-background':
            case '#images-orientation':
            case '#images-size':
            case '#svg':
            case '#viewbox-viewport':
            case '#svg-rect':
            case '#svg-circles':
            case '#svg-elipses':
            case '#svg-lines':
            case '#svg-masks':
            case '#svg-polylines':
            case '#svg-polygons':
            case '#svg-paths':
            case '#svg-text':
            case '#svg-images':
            case '#svg-links':
            case '#svg-transformations':
            case '#svg-style':
            case '#rasterization':
                return oldUrl.href.replace(/12\//, '').replace(/doc-prince/, 'graphics');
            case '#tips-and-tricks':
            case '#table-of-content':
            case '#table-of-content-simple':
            case '#table-of-content-multifile':
            case '#thinking-in-spreads':
            case '#spread-pagination':
            case '#spread-layout':
            case '#long-tables':
            case '#fancy-table-captions':
            case '#page-headers-footers':
            case '#dictionary-page-headers':
            case '#page-numbering':
            case '#footnotes-per-column':
            case '#multiple-footnotes':
            case '#sidenotes':
            case '#sidenote-footnote':
            case '#sidenote-floating':
            case '#endnotes':
            case '#hyperlinks-in-print':
            case '#image-magic':
            case '#hyphenation':
            case '#ligatures':
            case '#watermarks':
            case '#rotating':
            case '#wide-content-sideways':
            case '#rotating-table-cells':
            case '#two-pass':
            case '#pdf-doc':
                return oldUrl.href.replace(/12\//, '').replace(/doc-prince/, 'cookbook').replace(/\#table-of-content$/,'#table-of-contents').replace(/\#table-of-content-simple/,'#simple-table-of-contents').replace(/\#table-of-content-multifile/,'#multifile-table-of-contents').replace(/\#spread-pagination/,'#pagination-on-a-page-spread').replace(/\#spread-layout/,'#layout-on-a-page-spread').replace(/\#page-headers-footers/,'#page-headers-and-footers').replace(/\#sidenote-footnote/,'#positioning-the-footnote-area').replace(/\#sidenote-floating/,'#floating-the-footnote-left-or-right').replace(/\#ligatures/,'#typographic-ligatures').replace(/\#rotating$/,'#rotating-content').replace(/\#wide-content-sideways/,'#printing-wide-content-sideways').replace(/\#rotating-table-cells/,'#rotating-content-in-table-cells').replace(/\#two-pass/,'#the-multi-pass-solution').replace(/\#pdf-doc/,'#build-your-own-docu-pdf');
            case '#help':
            case '#troubleshooting':
            case '#output-log':
            case '#image-formats':
            case '#capturereplay':
            case '#princedebug':
            case '#faq':
                return oldUrl.href.replace(/12\//, '').replace(/doc-prince/, 'help');
            case '#prince-input':
            case '#apply-css':
            case '#css-import':
            case '#css-conflicting-declarations':
            case '#css-priorities':
            case '#applying-javascript':
            case '#xml':
            case '#xml-input':
            case '#xml-validation':
            case '#xml-lang':
            case '#xml-id':
            case '#xml-base':
            case '#xml-style':
            case '#xinclude':
            case '#xml-include':
            case '#xml-include-text':
            case '#xml-fallback':
                return oldUrl.href.replace(/12\//, '').replace(/doc-prince/, 'prince-input');
            case '#pdf-output':
            case '#pdf-profiles':
            case '#pdfa':
            case '#pdfua':
            case '#pdfx':
            case '#pdf-features':
            case '#pdf-links':
            case '#pdf-actions':
            case '#pdf-pages':
            case '#pdf-printing':
            case '#pdf-compression':
            case '#pdf-encryption':
            case '#pdf-font-embedding':
            case '#pdf-bookmarks':
            case '#bookmark-levels':
            case '#bookmark-labels':
            case '#bookmarks-targets':
            case '#pdf-tags':
            case '#pdf-metadata':
            case '#pdf-xmp-metadata':
                return oldUrl.href.replace(/12\//, '').replace(/doc-prince/, 'prince-output');
            case '#prince-networking':
            case '#prince-networking-auth':
            case '#prince-networking-cookies':
            case '#prince-networking-ssl':
            case '#prince-networking-client-certs':
            case '#prince-networking-misc':
                return oldUrl.href.replace(/12\//, '').replace(/doc-prince/, 'prince-networking');
            case '#server-integration':
            case '#security':
            case '#wrappers':
            case '#java':
            case '#csharp':
            case '#csharp-csharp':
            case '#vb-net':
            case '#php':
            case '#activex-com':
            case '#asp':
            case '#activex':
            case '#coldfusion':
            case '#cf-java':
            case '#cf-activex':
            case '#python':
            case '#perl':
            case '#third-party-wrappers':
            case '#advanced-cmd':
            case '#cmd-control':
            case '#structured-log':
                return oldUrl.href.replace(/12\//, '').replace(/doc-prince/, 'server-integration');
            case '#pfb':
            case '#pfb-linebreaking':
            case '#pfb-princewrapinside':
            case '#pfb-princelinebreakchoices':
            case '#pfb-princeforcedbreaks':
            case '#pfb-spreadbalancing':
            case '#pfb-princepagefill':
            case '#pfb-princenlines':
            case '#pfb-fractionalwidows':
                return oldUrl.href.replace(/12\//, '').replace(/doc-prince/, 'prince-for-books');
            case '#command-line':
            case '#cmd-examples':
            case '#cmd-input-output':
            case '#cmd-options':
            case '#cmd-general-options':
            case '#cmd-logging':
            case '#cmd-input':
            case '#cmd-network':
            case '#cmd-js':
            case '#cmd-css':
            case '#cmd-pdf':
            case '#cmd-pdf-metadata':
            case '#cmd-pdf-crypto':
            case '#cmd-raster':
            case '#cmd-util':
            case '#cmd-ctrl':
                return oldUrl.href.replace(/12\//, '').replace(/doc-refs/, 'command-line');
            case '#css-refs':
            case '#css-features':
                return oldUrl.href.replace(/12\//, '').replace(/doc-refs/, 'css-refs');
            case '#length-units':
            case '#absolute-length-units':
            case '#font-length-units':
            case '#pixel-unit':
                return oldUrl.href.replace(/12\//, '').replace(/doc-refs/, 'css-length-units');
            case '#properties':
                return oldUrl.href.replace(/12\//, '').replace(/doc-refs/, 'css-props');
            case '#selectors':
            case '#terminology':
            case '#sel-logical':
            case '#sel-elemental':
            case '#sel-attribute':
            case '#sel-linguistic':
            case '#sel-input':
            case '#sel-location':
            case '#sel-structural':
            case '#sel-combinators':
            case '#sel-treepseudo':
            case '#sel-typographic':
            case '#sel-footnotes':
            case '#sel-pages':
                return oldUrl.href.replace(/12\//, '').replace(/doc-refs/, 'css-selectors');
            case '#media-queries':
            case '#mq-mediaqueries':
            case '#mq-prefix':
            case '#mq-types':
            case '#mq-features':
            case '#mq-dimension':
            case '#mq-display':
            case '#mq-color':
            case '#mq-interaction':
            case '#mq-scripting':
                return oldUrl.href.replace(/12\//, '').replace(/doc-refs/, 'css-media-queries');
            case '#css-functions':
                return oldUrl.href.replace(/12\//, '').replace(/doc-refs/, 'css-functions');
            case '#css-atrules':
            case '#atrules-initial':
            case '#atrules-nested':
                return oldUrl.href.replace(/12\//, '').replace(/doc-refs/, 'css-at-rules');
            case '#js-support':
                return oldUrl.href.replace(/12\//, '').replace(/doc-refs/, 'js-support');
            case '#page-size-keywords':
            case '#characters':
            case '#accented-letters':
            case '#symbols':
            case '#quotes':
            case '#accents':
            case '#space-chars':
            case '#chars-mixc':
                return oldUrl.href.replace(/12\//, '').replace(/doc-refs/, 'characters');
            case '#acknowledgments':
                return oldUrl.href.replace(/12\//, '').replace(/doc-refs/, 'acknowledgements');
            default:
                return oldUrl.href.replace(/12\//, '').replace(/doc-install/, 'installing').replace(/doc-prince/, 'styling').replace(/doc-refs/, 'command-line');
        }
    }
}
