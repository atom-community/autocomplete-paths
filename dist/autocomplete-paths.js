var $igPDg$atom = require("atom");
var $igPDg$events = require("events");
var $igPDg$path = require("path");
var $igPDg$zadeh = require("zadeh");
var $igPDg$child_process = require("child_process");
var $igPDg$util = require("util");
var $igPDg$buffer = require("buffer");
var $igPDg$fs = require("fs");
var $igPDg$os = require("os");
var $igPDg$stream = require("stream");

function $parcel$exportWildcard(dest, source) {
  Object.keys(source).forEach(function(key) {
    if (key === 'default' || key === '__esModule' || dest.hasOwnProperty(key)) {
      return;
    }

    Object.defineProperty(dest, key, {
      enumerable: true,
      get: function get() {
        return source[key];
      }
    });
  });

  return dest;
}
function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
var $parcel$global =
typeof globalThis !== 'undefined'
  ? globalThis
  : typeof self !== 'undefined'
  ? self
  : typeof window !== 'undefined'
  ? window
  : typeof global !== 'undefined'
  ? global
  : {};
var $parcel$modules = {};
var $parcel$inits = {};

var parcelRequire = $parcel$global["parcelRequireb3ef"];
if (parcelRequire == null) {
  parcelRequire = function(id) {
    if (id in $parcel$modules) {
      return $parcel$modules[id].exports;
    }
    if (id in $parcel$inits) {
      var init = $parcel$inits[id];
      delete $parcel$inits[id];
      var module = {id: id, exports: {}};
      $parcel$modules[id] = module;
      init.call(module.exports, module, module.exports);
      return module.exports;
    }
    var err = new Error("Cannot find module '" + id + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  };

  parcelRequire.register = function register(id, init) {
    $parcel$inits[id] = init;
  };

  $parcel$global["parcelRequireb3ef"] = parcelRequire;
}
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.activate = $94e1e7fd37d7fa19$var$activate;
Object.defineProperty(module.exports, "config", {
    enumerable: true,
    get: function() {
        return $661f0ec0189dd3b0$exports.config;
    }
});
module.exports.consumeStatusBar = $94e1e7fd37d7fa19$var$consumeStatusBar;
module.exports.deactivate = $94e1e7fd37d7fa19$var$deactivate;
module.exports.getProvider = $94e1e7fd37d7fa19$var$getProvider;
parcelRequire.register("fdUTB", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.default = void 0;


var $b15434387a78119d$var$_path = $b15434387a78119d$var$_interopRequireDefault($igPDg$path);
parcelRequire("faG0G");
var $kP9Ce = parcelRequire("kP9Ce");
var $9SR8t = parcelRequire("9SR8t");
var $ihbNM = parcelRequire("ihbNM");

var $b15434387a78119d$var$_slash = $b15434387a78119d$var$_interopRequireDefault((parcelRequire("ihZc5")));

var $b15434387a78119d$var$_pathsCache = $b15434387a78119d$var$_interopRequireDefault((parcelRequire("bAmIK")));


var $dcGSX = parcelRequire("dcGSX");

function $b15434387a78119d$var$_interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
class $b15434387a78119d$var$PathsProvider extends $igPDg$events.EventEmitter {
    /** Reloads the scopes */ reloadScopes() {
        this._scopes = atom.config.get("autocomplete-paths.scopes").slice(0) || [];
        if (!atom.config.get("autocomplete-paths.ignoreBuiltinScopes")) this._scopes = this._scopes.concat($dcGSX.DefaultScopes);
        for(const key in $5bdf4495e20ef6ab$exports.OptionScopes)if (atom.config.get(`autocomplete-paths.${key}`)) this._scopes = this._scopes.slice(0).concat($5bdf4495e20ef6ab$exports.OptionScopes[key]);
    }
    /**
   * Gets called when the PathsCache is starting to rebuild the cache
   *
   * @private
   */ _onRebuildCache() {
        this.emit("rebuild-cache");
    }
    /**
   * Gets called when the PathsCache is done rebuilding the cache
   *
   * @private
   */ _onRebuildCacheDone() {
        this.emit("rebuild-cache-done");
    }
    /**
   * Returns the suggestions for the given scope and the given request
   *
   * @private
   * @param {Object} scope
   * @param {Object} request
   * @returns {Promise}
   */ _getSuggestionsForScope(scope1, request2, match1) {
        const line = $b15434387a78119d$var$_getLineTextForRequest(request2);
        const pathPrefix = line.substr(match1.index + match1[0].length);
        const trailingSlashPresent = pathPrefix.match(/[/\\|]$/);
        const directoryGiven = pathPrefix.indexOf("./") === 0 || pathPrefix.indexOf("../") === 0;
        const parsedPathPrefix = $b15434387a78119d$var$_path.default.parse(pathPrefix); // path.parse ignores trailing slashes, so we handle this manually
        if (trailingSlashPresent) {
            parsedPathPrefix.dir = $b15434387a78119d$var$_path.default.join(parsedPathPrefix.dir, parsedPathPrefix.base);
            parsedPathPrefix.base = "";
            parsedPathPrefix.name = "";
        }
        const projectDirectory = $b15434387a78119d$var$_getProjectDirectory(request2.editor);
        if (!projectDirectory) return Promise.resolve([]);
        const currentDirectory = $b15434387a78119d$var$_path.default.dirname(request2.editor.getPath());
        const requestedDirectoryPath = $b15434387a78119d$var$_path.default.resolve(currentDirectory, parsedPathPrefix.dir);
        let files = directoryGiven ? this._pathsCache.getFilePathsForProjectDirectory(projectDirectory, requestedDirectoryPath) : this._pathsCache.getFilePathsForProjectDirectory(projectDirectory);
        const fuzzyMatcher = directoryGiven ? parsedPathPrefix.base : pathPrefix;
        const { extensions: extensions  } = scope1;
        if (extensions) {
            const regex = new RegExp(`.(${extensions.join("|")})$`);
            files = files.filter((pth)=>regex.test(pth)
            );
        }
        if (fuzzyMatcher) files = (0, $igPDg$zadeh.filter)(files, fuzzyMatcher, {
            maxResults: 10
        });
        const suggestions = files.map((pathName)=>{
            let text = pathName;
            const normalizeSlashes = atom.config.get("autocomplete-paths.normalizeSlashes");
            const projectRelativePath = atom.project.relativizePath(text)[1];
            let displayText = projectRelativePath;
            if (directoryGiven) displayText = $b15434387a78119d$var$_path.default.relative(requestedDirectoryPath, text);
            if (normalizeSlashes) displayText = (0, $b15434387a78119d$var$_slash.default)(displayText);
             // Relativize path to current file if necessary
            let relativePath = $b15434387a78119d$var$_path.default.relative($b15434387a78119d$var$_path.default.dirname(request2.editor.getPath()), text);
            if (normalizeSlashes) relativePath = (0, $b15434387a78119d$var$_slash.default)(relativePath);
            if (scope1.relative !== false) {
                text = relativePath;
                if (scope1.includeCurrentDirectory !== false) {
                    if (text[0] !== ".") text = `./${text}`;
                }
            }
            if (scope1.projectRelativePath) text = (0, $b15434387a78119d$var$_slash.default)(projectRelativePath);
             // Replace stuff if necessary
            if (scope1.replaceOnInsert) // let originalPathName = text
            scope1.replaceOnInsert.forEach(([from, to])=>{
                const regex = new RegExp(from);
                if (regex.test(text)) text = text.replace(regex, to);
            });
             // Calculate distance to file
            const distanceToFile = relativePath.split($b15434387a78119d$var$_path.default.sep).length;
            return {
                text: text,
                replacementPrefix: pathPrefix,
                displayText: displayText,
                type: "import",
                iconHTML: '<i class="icon-file-code"></i>',
                score: (0, $igPDg$zadeh.score)(displayText, request2.prefix),
                distanceToFile: distanceToFile
            };
        }); // Modify score to incorporate distance
        const suggestionsCount = suggestions.length;
        if (suggestions.length) {
            const maxDistance = (0, $kP9Ce.default)(suggestions, (s)=>s.distanceToFile
            ).distanceToFile;
            suggestions.forEach((s, i)=>{
                s.score = suggestionsCount - i + (maxDistance - s.distanceToFile);
            }); // Sort again
            suggestions.sort((a, b)=>b.score - a.score
            );
        }
        return Promise.resolve(suggestions);
    }
    /**
   * Returns the suggestions for the given request
   *
   * @param {Object} request
   * @returns {Promise}
   */ async getSuggestions(request1) {
        const matches = this._scopes.map((scope)=>[
                scope,
                $b15434387a78119d$var$_scopeMatchesRequest(scope, request1)
            ]
        ).filter((result)=>result[1]
        ); // Filter scopes that match
        const promises = matches.map(([scope, match])=>this._getSuggestionsForScope(scope, request1, match)
        );
        const suggestions = (0, $9SR8t.default)(await Promise.all(promises));
        if (!suggestions.length) return false;
        return suggestions;
    }
    /**
   * Rebuilds the cache
   *
   * @returns {Promise}
   */ async rebuildCache() {
        const result = await this._pathsCache.rebuildCache();
        this._isReady = true;
        return result;
    }
    isReady() {
        return this._isReady;
    }
    get suggestionPriority() {
        return atom.config.get("autocomplete-paths.suggestionPriority");
    }
    get fileCount() {
        return atom.project.getDirectories().reduce((accumulated, directory)=>{
            const filePaths = this._pathsCache.getFilePathsForProjectDirectory(directory);
            return accumulated + filePaths.length;
        }, 0);
    }
    /** Disposes this provider */ dispose() {
        this._pathsCache.removeListener("rebuild-cache", this._onRebuildCache);
        this._pathsCache.removeListener("rebuild-cache-done", this._onRebuildCacheDone);
        this._pathsCache.dispose(true);
    }
    constructor(){
        super();
        this.reloadScopes();
        this._pathsCache = new $b15434387a78119d$var$_pathsCache.default();
        this._isReady = false;
        this._onRebuildCache = this._onRebuildCache.bind(this);
        this._onRebuildCacheDone = this._onRebuildCacheDone.bind(this);
        this._pathsCache.on("rebuild-cache", this._onRebuildCache);
        this._pathsCache.on("rebuild-cache-done", this._onRebuildCacheDone);
    }
}
module.exports.default = $b15434387a78119d$var$PathsProvider;
$b15434387a78119d$var$PathsProvider.prototype.selector = "*";
$b15434387a78119d$var$PathsProvider.prototype.inclusionPriority = 1;
/**
 * Checks if the given scope config matches the given request
 *
 * @private
 * @param {Object} scope
 * @param {Object} request
 * @returns {Array} The match object
 */ function $b15434387a78119d$var$_scopeMatchesRequest(scope, request) {
    const sourceScopes = Array.isArray(scope.scopes) ? scope.scopes : [
        scope.scopes
    ]; // Check if the scope descriptors match
    const scopeMatches = (0, $ihbNM.default)(request.scopeDescriptor.getScopesArray(), sourceScopes).length > 0;
    if (!scopeMatches) return false;
     // Check if the line matches the prefixes
    const line = $b15434387a78119d$var$_getLineTextForRequest(request);
    let lineMatch = null;
    const scopePrefixes = Array.isArray(scope.prefixes) ? scope.prefixes : [
        scope.prefixes
    ];
    scopePrefixes.forEach((prefix)=>{
        const regex = new RegExp(prefix, "i");
        lineMatch = lineMatch || line.match(regex);
    });
    return lineMatch;
}
/**
 * Returns the project directory that contains the file opened in the given editor
 *
 * @private
 * @param {TextEditor} editor
 * @returns {Directory}
 */ function $b15434387a78119d$var$_getProjectDirectory(editor) {
    const filePath = editor.getBuffer().getPath();
    let projectDirectory = null;
    atom.project.getDirectories().forEach((directory)=>{
        if (directory.contains(filePath)) projectDirectory = directory;
    });
    return projectDirectory;
}
/**
 * Returns the whole line text for the given request
 *
 * @private
 * @param {Object} request
 * @returns {String}
 */ function $b15434387a78119d$var$_getLineTextForRequest(request) {
    const { editor: editor , bufferPosition: bufferPosition  } = request;
    return editor.getTextInRange([
        [
            bufferPosition.row,
            0
        ],
        bufferPosition
    ]);
}
module.exports = module.exports.default;

});
parcelRequire.register("faG0G", function(module, exports) {

var $j7I0H = parcelRequire("j7I0H");

var $lMudI = parcelRequire("lMudI");
$parcel$exportWildcard(module.exports, $lMudI);

});
parcelRequire.register("j7I0H", function(module, exports) {
parcelRequire("lMudI");
var $bG3Ar = parcelRequire("bG3Ar");
var $lMudI = parcelRequire("lMudI");
parcelRequire("lMudI");
var $bG3Ar = parcelRequire("bG3Ar");
var $lMudI = parcelRequire("lMudI");
// Add all of the Underscore functions to the wrapper object.
var $dec0cf4e9d0144f2$var$_ = $bG3Ar.default($lMudI);
// Legacy Node.js API.
$dec0cf4e9d0144f2$var$_._ = $dec0cf4e9d0144f2$var$_;
var // Export the Underscore API.
$dec0cf4e9d0144f2$export$2e2bcd8739ae039 = $dec0cf4e9d0144f2$var$_;

});
parcelRequire.register("lMudI", function(module, exports) {

$parcel$defineInteropFlag(module.exports);

$parcel$export(module.exports, "VERSION", () => (parcelRequire("9dO2A")).VERSION);
$parcel$export(module.exports, "restArguments", () => (parcelRequire("6hviD")).default);
$parcel$export(module.exports, "isObject", () => (parcelRequire("kUJUF")).default);
$parcel$export(module.exports, "isNull", () => (parcelRequire("20NM3")).default);
$parcel$export(module.exports, "isUndefined", () => (parcelRequire("leAUX")).default);
$parcel$export(module.exports, "isBoolean", () => (parcelRequire("7u0f3")).default);
$parcel$export(module.exports, "isElement", () => (parcelRequire("gbyj9")).default);
$parcel$export(module.exports, "isString", () => (parcelRequire("9s5yQ")).default);
$parcel$export(module.exports, "isNumber", () => (parcelRequire("1sv59")).default);
$parcel$export(module.exports, "isDate", () => (parcelRequire("gQq2z")).default);
$parcel$export(module.exports, "isRegExp", () => (parcelRequire("lMdn9")).default);
$parcel$export(module.exports, "isError", () => (parcelRequire("caQ10")).default);
$parcel$export(module.exports, "isSymbol", () => (parcelRequire("lFrDK")).default);
$parcel$export(module.exports, "isArrayBuffer", () => (parcelRequire("csySa")).default);
$parcel$export(module.exports, "isDataView", () => (parcelRequire("3QkkI")).default);
$parcel$export(module.exports, "isArray", () => (parcelRequire("9isuX")).default);
$parcel$export(module.exports, "isFunction", () => (parcelRequire("gzjvQ")).default);
$parcel$export(module.exports, "isArguments", () => (parcelRequire("guNrV")).default);
$parcel$export(module.exports, "isFinite", () => (parcelRequire("bAJdo")).default);
$parcel$export(module.exports, "isNaN", () => (parcelRequire("lGDHN")).default);
$parcel$export(module.exports, "isTypedArray", () => (parcelRequire("69zTm")).default);
$parcel$export(module.exports, "isEmpty", () => (parcelRequire("fiFlc")).default);
$parcel$export(module.exports, "isMatch", () => (parcelRequire("1VFFA")).default);
$parcel$export(module.exports, "isEqual", () => (parcelRequire("9M5F5")).default);
$parcel$export(module.exports, "isMap", () => (parcelRequire("17TOs")).default);
$parcel$export(module.exports, "isWeakMap", () => (parcelRequire("c3C1Q")).default);
$parcel$export(module.exports, "isSet", () => (parcelRequire("diuHC")).default);
$parcel$export(module.exports, "isWeakSet", () => (parcelRequire("cWrYK")).default);
$parcel$export(module.exports, "keys", () => (parcelRequire("3C7Wx")).default);
$parcel$export(module.exports, "allKeys", () => (parcelRequire("cBY3u")).default);
$parcel$export(module.exports, "values", () => (parcelRequire("jl8SM")).default);
$parcel$export(module.exports, "pairs", () => (parcelRequire("8o4xP")).default);
$parcel$export(module.exports, "invert", () => (parcelRequire("dar4T")).default);
$parcel$export(module.exports, "functions", () => (parcelRequire("apdmN")).default);
$parcel$export(module.exports, "methods", () => (parcelRequire("apdmN")).default);
$parcel$export(module.exports, "extend", () => (parcelRequire("ddYNh")).default);
$parcel$export(module.exports, "extendOwn", () => (parcelRequire("hRDBc")).default);
$parcel$export(module.exports, "assign", () => (parcelRequire("hRDBc")).default);
$parcel$export(module.exports, "defaults", () => (parcelRequire("jux9i")).default);
$parcel$export(module.exports, "create", () => (parcelRequire("i50Vd")).default);
$parcel$export(module.exports, "clone", () => (parcelRequire("7oKeL")).default);
$parcel$export(module.exports, "tap", () => (parcelRequire("37uUu")).default);
$parcel$export(module.exports, "get", () => (parcelRequire("edW5k")).default);
$parcel$export(module.exports, "has", () => (parcelRequire("e9YpB")).default);
$parcel$export(module.exports, "mapObject", () => (parcelRequire("fhwT5")).default);
$parcel$export(module.exports, "identity", () => (parcelRequire("ckYla")).default);
$parcel$export(module.exports, "constant", () => (parcelRequire("eQ8Qy")).default);
$parcel$export(module.exports, "noop", () => (parcelRequire("19Lbq")).default);
$parcel$export(module.exports, "toPath", () => (parcelRequire("fhrzh")).default);
$parcel$export(module.exports, "property", () => (parcelRequire("65dt8")).default);
$parcel$export(module.exports, "propertyOf", () => (parcelRequire("a7xIY")).default);
$parcel$export(module.exports, "matcher", () => (parcelRequire("fJBs5")).default);
$parcel$export(module.exports, "matches", () => (parcelRequire("fJBs5")).default);
$parcel$export(module.exports, "times", () => (parcelRequire("2sKuv")).default);
$parcel$export(module.exports, "random", () => (parcelRequire("iBZ1m")).default);
$parcel$export(module.exports, "now", () => (parcelRequire("biBxH")).default);
$parcel$export(module.exports, "escape", () => (parcelRequire("6p0Sg")).default);
$parcel$export(module.exports, "unescape", () => (parcelRequire("iHGtn")).default);
$parcel$export(module.exports, "templateSettings", () => (parcelRequire("ebup1")).default);
$parcel$export(module.exports, "template", () => (parcelRequire("3nf7o")).default);
$parcel$export(module.exports, "result", () => (parcelRequire("6bwuT")).default);
$parcel$export(module.exports, "uniqueId", () => (parcelRequire("5F3qO")).default);
$parcel$export(module.exports, "chain", () => (parcelRequire("kGd3g")).default);
$parcel$export(module.exports, "iteratee", () => (parcelRequire("erIZ2")).default);
$parcel$export(module.exports, "partial", () => (parcelRequire("2Z0z7")).default);
$parcel$export(module.exports, "bind", () => (parcelRequire("eB57c")).default);
$parcel$export(module.exports, "bindAll", () => (parcelRequire("lxBj2")).default);
$parcel$export(module.exports, "memoize", () => (parcelRequire("jCyBK")).default);
$parcel$export(module.exports, "delay", () => (parcelRequire("9l0rK")).default);
$parcel$export(module.exports, "defer", () => (parcelRequire("g1V2Y")).default);
$parcel$export(module.exports, "throttle", () => (parcelRequire("gYt8Y")).default);
$parcel$export(module.exports, "debounce", () => (parcelRequire("1MRWn")).default);
$parcel$export(module.exports, "wrap", () => (parcelRequire("izr7m")).default);
$parcel$export(module.exports, "negate", () => (parcelRequire("2ZQFv")).default);
$parcel$export(module.exports, "compose", () => (parcelRequire("iDFxW")).default);
$parcel$export(module.exports, "after", () => (parcelRequire("3JIxF")).default);
$parcel$export(module.exports, "before", () => (parcelRequire("5jfUT")).default);
$parcel$export(module.exports, "once", () => (parcelRequire("5QWK4")).default);
$parcel$export(module.exports, "findKey", () => (parcelRequire("4jK7I")).default);
$parcel$export(module.exports, "findIndex", () => (parcelRequire("5y7X0")).default);
$parcel$export(module.exports, "findLastIndex", () => (parcelRequire("hw5rs")).default);
$parcel$export(module.exports, "sortedIndex", () => (parcelRequire("2DJLe")).default);
$parcel$export(module.exports, "indexOf", () => (parcelRequire("277r6")).default);
$parcel$export(module.exports, "lastIndexOf", () => (parcelRequire("eeVf2")).default);
$parcel$export(module.exports, "find", () => (parcelRequire("kwVcS")).default);
$parcel$export(module.exports, "detect", () => (parcelRequire("kwVcS")).default);
$parcel$export(module.exports, "findWhere", () => (parcelRequire("dFfWJ")).default);
$parcel$export(module.exports, "each", () => (parcelRequire("i8zKf")).default);
$parcel$export(module.exports, "forEach", () => (parcelRequire("i8zKf")).default);
$parcel$export(module.exports, "map", () => (parcelRequire("i2eAT")).default);
$parcel$export(module.exports, "collect", () => (parcelRequire("i2eAT")).default);
$parcel$export(module.exports, "reduce", () => (parcelRequire("jSFoK")).default);
$parcel$export(module.exports, "foldl", () => (parcelRequire("jSFoK")).default);
$parcel$export(module.exports, "inject", () => (parcelRequire("jSFoK")).default);
$parcel$export(module.exports, "reduceRight", () => (parcelRequire("3vBke")).default);
$parcel$export(module.exports, "foldr", () => (parcelRequire("3vBke")).default);
$parcel$export(module.exports, "filter", () => (parcelRequire("2OqkP")).default);
$parcel$export(module.exports, "select", () => (parcelRequire("2OqkP")).default);
$parcel$export(module.exports, "reject", () => (parcelRequire("aTIy7")).default);
$parcel$export(module.exports, "every", () => (parcelRequire("fp58Y")).default);
$parcel$export(module.exports, "all", () => (parcelRequire("fp58Y")).default);
$parcel$export(module.exports, "some", () => (parcelRequire("3jk7q")).default);
$parcel$export(module.exports, "any", () => (parcelRequire("3jk7q")).default);
$parcel$export(module.exports, "contains", () => (parcelRequire("aaQGi")).default);
$parcel$export(module.exports, "includes", () => (parcelRequire("aaQGi")).default);
$parcel$export(module.exports, "include", () => (parcelRequire("aaQGi")).default);
$parcel$export(module.exports, "invoke", () => (parcelRequire("9m9zi")).default);
$parcel$export(module.exports, "pluck", () => (parcelRequire("97nfa")).default);
$parcel$export(module.exports, "where", () => (parcelRequire("4Vi1N")).default);
$parcel$export(module.exports, "max", () => (parcelRequire("kP9Ce")).default);
$parcel$export(module.exports, "min", () => (parcelRequire("iyGTK")).default);
$parcel$export(module.exports, "shuffle", () => (parcelRequire("5sFD1")).default);
$parcel$export(module.exports, "sample", () => (parcelRequire("43EEo")).default);
$parcel$export(module.exports, "sortBy", () => (parcelRequire("TjjEJ")).default);
$parcel$export(module.exports, "groupBy", () => (parcelRequire("hdMk2")).default);
$parcel$export(module.exports, "indexBy", () => (parcelRequire("5ut6d")).default);
$parcel$export(module.exports, "countBy", () => (parcelRequire("6ZwcZ")).default);
$parcel$export(module.exports, "partition", () => (parcelRequire("fUCLb")).default);
$parcel$export(module.exports, "toArray", () => (parcelRequire("jdJ5H")).default);
$parcel$export(module.exports, "size", () => (parcelRequire("dtm9O")).default);
$parcel$export(module.exports, "pick", () => (parcelRequire("iYTRo")).default);
$parcel$export(module.exports, "omit", () => (parcelRequire("k2Srg")).default);
$parcel$export(module.exports, "first", () => (parcelRequire("ituRu")).default);
$parcel$export(module.exports, "head", () => (parcelRequire("ituRu")).default);
$parcel$export(module.exports, "take", () => (parcelRequire("ituRu")).default);
$parcel$export(module.exports, "initial", () => (parcelRequire("2XW1r")).default);
$parcel$export(module.exports, "last", () => (parcelRequire("dfBre")).default);
$parcel$export(module.exports, "rest", () => (parcelRequire("fsGLq")).default);
$parcel$export(module.exports, "tail", () => (parcelRequire("fsGLq")).default);
$parcel$export(module.exports, "drop", () => (parcelRequire("fsGLq")).default);
$parcel$export(module.exports, "compact", () => (parcelRequire("ieBQ4")).default);
$parcel$export(module.exports, "flatten", () => (parcelRequire("9SR8t")).default);
$parcel$export(module.exports, "without", () => (parcelRequire("a1Oko")).default);
$parcel$export(module.exports, "uniq", () => (parcelRequire("efmrf")).default);
$parcel$export(module.exports, "unique", () => (parcelRequire("efmrf")).default);
$parcel$export(module.exports, "union", () => (parcelRequire("e6zxt")).default);
$parcel$export(module.exports, "intersection", () => (parcelRequire("ihbNM")).default);
$parcel$export(module.exports, "difference", () => (parcelRequire("8YoDB")).default);
$parcel$export(module.exports, "unzip", () => (parcelRequire("4sMLU")).default);
$parcel$export(module.exports, "transpose", () => (parcelRequire("4sMLU")).default);
$parcel$export(module.exports, "zip", () => (parcelRequire("lDgjS")).default);
$parcel$export(module.exports, "object", () => (parcelRequire("5EHE3")).default);
$parcel$export(module.exports, "range", () => (parcelRequire("6kH7B")).default);
$parcel$export(module.exports, "chunk", () => (parcelRequire("6QkRy")).default);
$parcel$export(module.exports, "mixin", () => (parcelRequire("bG3Ar")).default);
$parcel$export(module.exports, "default", () => (parcelRequire("9jUaK")).default);

var $9dO2A = parcelRequire("9dO2A");

var $6hviD = parcelRequire("6hviD");

var $kUJUF = parcelRequire("kUJUF");

var $20NM3 = parcelRequire("20NM3");

var $leAUX = parcelRequire("leAUX");

var $7u0f3 = parcelRequire("7u0f3");

var $gbyj9 = parcelRequire("gbyj9");

var $9s5yQ = parcelRequire("9s5yQ");

var $1sv59 = parcelRequire("1sv59");

var $gQq2z = parcelRequire("gQq2z");

var $lMdn9 = parcelRequire("lMdn9");

var $caQ10 = parcelRequire("caQ10");

var $lFrDK = parcelRequire("lFrDK");

var $csySa = parcelRequire("csySa");

var $3QkkI = parcelRequire("3QkkI");

var $9isuX = parcelRequire("9isuX");

var $gzjvQ = parcelRequire("gzjvQ");

var $guNrV = parcelRequire("guNrV");

var $bAJdo = parcelRequire("bAJdo");

var $lGDHN = parcelRequire("lGDHN");

var $69zTm = parcelRequire("69zTm");

var $fiFlc = parcelRequire("fiFlc");

var $1VFFA = parcelRequire("1VFFA");

var $9M5F5 = parcelRequire("9M5F5");

var $17TOs = parcelRequire("17TOs");

var $c3C1Q = parcelRequire("c3C1Q");

var $diuHC = parcelRequire("diuHC");

var $cWrYK = parcelRequire("cWrYK");

var $3C7Wx = parcelRequire("3C7Wx");

var $cBY3u = parcelRequire("cBY3u");

var $jl8SM = parcelRequire("jl8SM");

var $8o4xP = parcelRequire("8o4xP");

var $dar4T = parcelRequire("dar4T");

var $apdmN = parcelRequire("apdmN");

var $ddYNh = parcelRequire("ddYNh");

var $hRDBc = parcelRequire("hRDBc");

var $jux9i = parcelRequire("jux9i");

var $i50Vd = parcelRequire("i50Vd");

var $7oKeL = parcelRequire("7oKeL");

var $37uUu = parcelRequire("37uUu");

var $edW5k = parcelRequire("edW5k");

var $e9YpB = parcelRequire("e9YpB");

var $fhwT5 = parcelRequire("fhwT5");

var $ckYla = parcelRequire("ckYla");

var $eQ8Qy = parcelRequire("eQ8Qy");

var $19Lbq = parcelRequire("19Lbq");

var $fhrzh = parcelRequire("fhrzh");

var $65dt8 = parcelRequire("65dt8");

var $a7xIY = parcelRequire("a7xIY");

var $fJBs5 = parcelRequire("fJBs5");

var $2sKuv = parcelRequire("2sKuv");

var $iBZ1m = parcelRequire("iBZ1m");

var $biBxH = parcelRequire("biBxH");

var $6p0Sg = parcelRequire("6p0Sg");

var $iHGtn = parcelRequire("iHGtn");

var $ebup1 = parcelRequire("ebup1");

var $3nf7o = parcelRequire("3nf7o");

var $6bwuT = parcelRequire("6bwuT");

var $5F3qO = parcelRequire("5F3qO");

var $kGd3g = parcelRequire("kGd3g");

var $erIZ2 = parcelRequire("erIZ2");

var $2Z0z7 = parcelRequire("2Z0z7");

var $eB57c = parcelRequire("eB57c");

var $lxBj2 = parcelRequire("lxBj2");

var $jCyBK = parcelRequire("jCyBK");

var $9l0rK = parcelRequire("9l0rK");

var $g1V2Y = parcelRequire("g1V2Y");

var $gYt8Y = parcelRequire("gYt8Y");

var $1MRWn = parcelRequire("1MRWn");

var $izr7m = parcelRequire("izr7m");

var $2ZQFv = parcelRequire("2ZQFv");

var $iDFxW = parcelRequire("iDFxW");

var $3JIxF = parcelRequire("3JIxF");

var $5jfUT = parcelRequire("5jfUT");

var $5QWK4 = parcelRequire("5QWK4");

var $4jK7I = parcelRequire("4jK7I");

var $5y7X0 = parcelRequire("5y7X0");

var $hw5rs = parcelRequire("hw5rs");

var $2DJLe = parcelRequire("2DJLe");

var $277r6 = parcelRequire("277r6");

var $eeVf2 = parcelRequire("eeVf2");

var $kwVcS = parcelRequire("kwVcS");

var $dFfWJ = parcelRequire("dFfWJ");

var $i8zKf = parcelRequire("i8zKf");

var $i2eAT = parcelRequire("i2eAT");

var $jSFoK = parcelRequire("jSFoK");

var $3vBke = parcelRequire("3vBke");

var $2OqkP = parcelRequire("2OqkP");

var $aTIy7 = parcelRequire("aTIy7");

var $fp58Y = parcelRequire("fp58Y");

var $3jk7q = parcelRequire("3jk7q");

var $aaQGi = parcelRequire("aaQGi");

var $9m9zi = parcelRequire("9m9zi");

var $97nfa = parcelRequire("97nfa");

var $4Vi1N = parcelRequire("4Vi1N");

var $kP9Ce = parcelRequire("kP9Ce");

var $iyGTK = parcelRequire("iyGTK");

var $5sFD1 = parcelRequire("5sFD1");

var $43EEo = parcelRequire("43EEo");

var $TjjEJ = parcelRequire("TjjEJ");

var $hdMk2 = parcelRequire("hdMk2");

var $5ut6d = parcelRequire("5ut6d");

var $6ZwcZ = parcelRequire("6ZwcZ");

var $fUCLb = parcelRequire("fUCLb");

var $jdJ5H = parcelRequire("jdJ5H");

var $dtm9O = parcelRequire("dtm9O");

var $iYTRo = parcelRequire("iYTRo");

var $k2Srg = parcelRequire("k2Srg");

var $ituRu = parcelRequire("ituRu");

var $2XW1r = parcelRequire("2XW1r");

var $dfBre = parcelRequire("dfBre");

var $fsGLq = parcelRequire("fsGLq");

var $ieBQ4 = parcelRequire("ieBQ4");

var $9SR8t = parcelRequire("9SR8t");

var $a1Oko = parcelRequire("a1Oko");

var $efmrf = parcelRequire("efmrf");

var $e6zxt = parcelRequire("e6zxt");

var $ihbNM = parcelRequire("ihbNM");

var $8YoDB = parcelRequire("8YoDB");

var $4sMLU = parcelRequire("4sMLU");

var $lDgjS = parcelRequire("lDgjS");

var $5EHE3 = parcelRequire("5EHE3");

var $6kH7B = parcelRequire("6kH7B");

var $6QkRy = parcelRequire("6QkRy");

var $bG3Ar = parcelRequire("bG3Ar");

var $9jUaK = parcelRequire("9jUaK");

});
parcelRequire.register("9dO2A", function(module, exports) {

$parcel$export(module.exports, "VERSION", () => $6b6c25012a872cd9$export$a4ad2735b021c132);
$parcel$export(module.exports, "root", () => $6b6c25012a872cd9$export$e8e78c978b129247);
$parcel$export(module.exports, "ArrayProto", () => $6b6c25012a872cd9$export$aabeece9448a227a);
$parcel$export(module.exports, "ObjProto", () => $6b6c25012a872cd9$export$e77bb59b5e655b3d);
$parcel$export(module.exports, "SymbolProto", () => $6b6c25012a872cd9$export$e229dcb397ceea81);
$parcel$export(module.exports, "push", () => $6b6c25012a872cd9$export$4cbf152802aa238);
$parcel$export(module.exports, "slice", () => $6b6c25012a872cd9$export$58adb3bec8346d0f);
$parcel$export(module.exports, "toString", () => $6b6c25012a872cd9$export$f84e8e69fd4488a5);
$parcel$export(module.exports, "hasOwnProperty", () => $6b6c25012a872cd9$export$5a15a386532a5ea4);
$parcel$export(module.exports, "supportsArrayBuffer", () => $6b6c25012a872cd9$export$20eaf89d899ede58);
$parcel$export(module.exports, "supportsDataView", () => $6b6c25012a872cd9$export$a2e478ad34dac33e);
$parcel$export(module.exports, "nativeIsArray", () => $6b6c25012a872cd9$export$552cf9b635cef256);
$parcel$export(module.exports, "nativeKeys", () => $6b6c25012a872cd9$export$e676cf06d7fd2114);
$parcel$export(module.exports, "nativeCreate", () => $6b6c25012a872cd9$export$5b53dc95b548c58c);
$parcel$export(module.exports, "nativeIsView", () => $6b6c25012a872cd9$export$35fc70fc5e80d5a7);
$parcel$export(module.exports, "_isNaN", () => $6b6c25012a872cd9$export$a739ba33a90be0a1);
$parcel$export(module.exports, "_isFinite", () => $6b6c25012a872cd9$export$8b48b92f6c9d5ad);
$parcel$export(module.exports, "hasEnumBug", () => $6b6c25012a872cd9$export$7dcea4d27900b116);
$parcel$export(module.exports, "nonEnumerableProps", () => $6b6c25012a872cd9$export$f8fa596d5e31cb19);
$parcel$export(module.exports, "MAX_ARRAY_INDEX", () => $6b6c25012a872cd9$export$63b3abc5cd28bc48);
var $6b6c25012a872cd9$export$a4ad2735b021c132 = '1.13.1';
var $6b6c25012a872cd9$export$e8e78c978b129247 = typeof self == 'object' && self.self === self && self || typeof $parcel$global == 'object' && $parcel$global.global === $parcel$global && $parcel$global || Function('return this')() || {
};
var $6b6c25012a872cd9$export$aabeece9448a227a = Array.prototype, $6b6c25012a872cd9$export$e77bb59b5e655b3d = Object.prototype;
var $6b6c25012a872cd9$export$e229dcb397ceea81 = typeof Symbol !== 'undefined' ? Symbol.prototype : null;
var $6b6c25012a872cd9$export$4cbf152802aa238 = $6b6c25012a872cd9$export$aabeece9448a227a.push, $6b6c25012a872cd9$export$58adb3bec8346d0f = $6b6c25012a872cd9$export$aabeece9448a227a.slice, $6b6c25012a872cd9$export$f84e8e69fd4488a5 = $6b6c25012a872cd9$export$e77bb59b5e655b3d.toString, $6b6c25012a872cd9$export$5a15a386532a5ea4 = $6b6c25012a872cd9$export$e77bb59b5e655b3d.hasOwnProperty;
var $6b6c25012a872cd9$export$20eaf89d899ede58 = typeof ArrayBuffer !== 'undefined', $6b6c25012a872cd9$export$a2e478ad34dac33e = typeof DataView !== 'undefined';
var $6b6c25012a872cd9$export$552cf9b635cef256 = Array.isArray, $6b6c25012a872cd9$export$e676cf06d7fd2114 = Object.keys, $6b6c25012a872cd9$export$5b53dc95b548c58c = Object.create, $6b6c25012a872cd9$export$35fc70fc5e80d5a7 = $6b6c25012a872cd9$export$20eaf89d899ede58 && ArrayBuffer.isView;
var $6b6c25012a872cd9$export$a739ba33a90be0a1 = isNaN, $6b6c25012a872cd9$export$8b48b92f6c9d5ad = isFinite;
var $6b6c25012a872cd9$export$7dcea4d27900b116 = !({
    toString: null
}).propertyIsEnumerable('toString');
var $6b6c25012a872cd9$export$f8fa596d5e31cb19 = [
    'valueOf',
    'isPrototypeOf',
    'toString',
    'propertyIsEnumerable',
    'hasOwnProperty',
    'toLocaleString'
];
var $6b6c25012a872cd9$export$63b3abc5cd28bc48 = Math.pow(2, 53) - 1;

});

parcelRequire.register("6hviD", function(module, exports) {

$parcel$export(module.exports, "default", () => $492c9c0ad34a1d1a$export$2e2bcd8739ae039);
function $492c9c0ad34a1d1a$export$2e2bcd8739ae039(func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function() {
        var length = Math.max(arguments.length - startIndex, 0), rest = Array(length), index = 0;
        for(; index < length; index++)rest[index] = arguments[index + startIndex];
        switch(startIndex){
            case 0:
                return func.call(this, rest);
            case 1:
                return func.call(this, arguments[0], rest);
            case 2:
                return func.call(this, arguments[0], arguments[1], rest);
        }
        var args = Array(startIndex + 1);
        for(index = 0; index < startIndex; index++)args[index] = arguments[index];
        args[startIndex] = rest;
        return func.apply(this, args);
    };
}

});

parcelRequire.register("kUJUF", function(module, exports) {

$parcel$export(module.exports, "default", () => $f39ca6f7f04a40fc$export$2e2bcd8739ae039);
function $f39ca6f7f04a40fc$export$2e2bcd8739ae039(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
}

});

parcelRequire.register("20NM3", function(module, exports) {

$parcel$export(module.exports, "default", () => $177230f703eb1910$export$2e2bcd8739ae039);
function $177230f703eb1910$export$2e2bcd8739ae039(obj) {
    return obj === null;
}

});

parcelRequire.register("leAUX", function(module, exports) {

$parcel$export(module.exports, "default", () => $f7578adc99473c58$export$2e2bcd8739ae039);
function $f7578adc99473c58$export$2e2bcd8739ae039(obj) {
    return obj === void 0;
}

});

parcelRequire.register("7u0f3", function(module, exports) {

$parcel$export(module.exports, "default", () => $572b85c5c6d68a89$export$2e2bcd8739ae039);

var $9dO2A = parcelRequire("9dO2A");
function $572b85c5c6d68a89$export$2e2bcd8739ae039(obj) {
    return obj === true || obj === false || $9dO2A.toString.call(obj) === '[object Boolean]';
}

});

parcelRequire.register("gbyj9", function(module, exports) {

$parcel$export(module.exports, "default", () => $bc884943b7a2fb15$export$2e2bcd8739ae039);
function $bc884943b7a2fb15$export$2e2bcd8739ae039(obj) {
    return !!(obj && obj.nodeType === 1);
}

});

parcelRequire.register("9s5yQ", function(module, exports) {

$parcel$export(module.exports, "default", () => $6e1b0ae7a7243a5f$export$2e2bcd8739ae039);

var $eyZQq = parcelRequire("eyZQq");
var $6e1b0ae7a7243a5f$export$2e2bcd8739ae039 = $eyZQq.default('String');

});
parcelRequire.register("eyZQq", function(module, exports) {

$parcel$export(module.exports, "default", () => $a9a436b6f37ec8b0$export$2e2bcd8739ae039);

var $9dO2A = parcelRequire("9dO2A");
function $a9a436b6f37ec8b0$export$2e2bcd8739ae039(name) {
    var tag = '[object ' + name + ']';
    return function(obj) {
        return $9dO2A.toString.call(obj) === tag;
    };
}

});


parcelRequire.register("1sv59", function(module, exports) {

$parcel$export(module.exports, "default", () => $1100843375bb4a9d$export$2e2bcd8739ae039);

var $eyZQq = parcelRequire("eyZQq");
var $1100843375bb4a9d$export$2e2bcd8739ae039 = $eyZQq.default('Number');

});

parcelRequire.register("gQq2z", function(module, exports) {

$parcel$export(module.exports, "default", () => $c435b3beb6d7330c$export$2e2bcd8739ae039);

var $eyZQq = parcelRequire("eyZQq");
var $c435b3beb6d7330c$export$2e2bcd8739ae039 = $eyZQq.default('Date');

});

parcelRequire.register("lMdn9", function(module, exports) {

$parcel$export(module.exports, "default", () => $fda87425797ecb95$export$2e2bcd8739ae039);

var $eyZQq = parcelRequire("eyZQq");
var $fda87425797ecb95$export$2e2bcd8739ae039 = $eyZQq.default('RegExp');

});

parcelRequire.register("caQ10", function(module, exports) {

$parcel$export(module.exports, "default", () => $8dcec459cfc2f7af$export$2e2bcd8739ae039);

var $eyZQq = parcelRequire("eyZQq");
var $8dcec459cfc2f7af$export$2e2bcd8739ae039 = $eyZQq.default('Error');

});

parcelRequire.register("lFrDK", function(module, exports) {

$parcel$export(module.exports, "default", () => $fc62de0cf61e5282$export$2e2bcd8739ae039);

var $eyZQq = parcelRequire("eyZQq");
var $fc62de0cf61e5282$export$2e2bcd8739ae039 = $eyZQq.default('Symbol');

});

parcelRequire.register("csySa", function(module, exports) {

$parcel$export(module.exports, "default", () => $91232686a237d72f$export$2e2bcd8739ae039);

var $eyZQq = parcelRequire("eyZQq");
var $91232686a237d72f$export$2e2bcd8739ae039 = $eyZQq.default('ArrayBuffer');

});

parcelRequire.register("3QkkI", function(module, exports) {

$parcel$export(module.exports, "default", () => $2cc6002dbdfbc061$export$2e2bcd8739ae039);

var $eyZQq = parcelRequire("eyZQq");

var $gzjvQ = parcelRequire("gzjvQ");

var $csySa = parcelRequire("csySa");

var $frHu4 = parcelRequire("frHu4");
var $2cc6002dbdfbc061$var$isDataView = $eyZQq.default('DataView');
// In IE 10 - Edge 13, we need a different heuristic
// to determine whether an object is a `DataView`.
function $2cc6002dbdfbc061$var$ie10IsDataView(obj) {
    return obj != null && $gzjvQ.default(obj.getInt8) && $csySa.default(obj.buffer);
}
var $2cc6002dbdfbc061$export$2e2bcd8739ae039 = $frHu4.hasStringTagBug ? $2cc6002dbdfbc061$var$ie10IsDataView : $2cc6002dbdfbc061$var$isDataView;

});
parcelRequire.register("gzjvQ", function(module, exports) {

$parcel$export(module.exports, "default", () => $c0ff0d09973483b4$export$2e2bcd8739ae039);

var $eyZQq = parcelRequire("eyZQq");

var $9dO2A = parcelRequire("9dO2A");
var $c0ff0d09973483b4$var$isFunction = $eyZQq.default('Function');
// Optimize `isFunction` if appropriate. Work around some `typeof` bugs in old
// v8, IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
var $c0ff0d09973483b4$var$nodelist = $9dO2A.root.document && $9dO2A.root.document.childNodes;
if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof $c0ff0d09973483b4$var$nodelist != 'function') $c0ff0d09973483b4$var$isFunction = function(obj) {
    return typeof obj == 'function' || false;
};
var $c0ff0d09973483b4$export$2e2bcd8739ae039 = $c0ff0d09973483b4$var$isFunction;

});

parcelRequire.register("frHu4", function(module, exports) {

$parcel$export(module.exports, "hasStringTagBug", () => $b3eb1baba452de87$export$834f1807c25991c1);
$parcel$export(module.exports, "isIE11", () => $b3eb1baba452de87$export$f7bad96d83325a34);

var $9dO2A = parcelRequire("9dO2A");

var $lkD4o = parcelRequire("lkD4o");
var $b3eb1baba452de87$export$834f1807c25991c1 = $9dO2A.supportsDataView && $lkD4o.default(new DataView(new ArrayBuffer(8))), $b3eb1baba452de87$export$f7bad96d83325a34 = typeof Map !== 'undefined' && $lkD4o.default(new Map);

});
parcelRequire.register("lkD4o", function(module, exports) {

$parcel$export(module.exports, "default", () => $f879c5ab4c54e945$export$2e2bcd8739ae039);

var $eyZQq = parcelRequire("eyZQq");
var $f879c5ab4c54e945$export$2e2bcd8739ae039 = $eyZQq.default('Object');

});



parcelRequire.register("9isuX", function(module, exports) {

$parcel$export(module.exports, "default", () => $6c4be6a49fbf3ff6$export$2e2bcd8739ae039);

var $9dO2A = parcelRequire("9dO2A");

var $eyZQq = parcelRequire("eyZQq");
var // Is a given value an array?
// Delegates to ECMA5's native `Array.isArray`.
$6c4be6a49fbf3ff6$export$2e2bcd8739ae039 = $9dO2A.nativeIsArray || $eyZQq.default('Array');

});

parcelRequire.register("guNrV", function(module, exports) {

$parcel$export(module.exports, "default", () => $c025ce51ddb23299$export$2e2bcd8739ae039);

var $eyZQq = parcelRequire("eyZQq");

var $j2bC2 = parcelRequire("j2bC2");
var $c025ce51ddb23299$var$isArguments = $eyZQq.default('Arguments');
(function() {
    if (!$c025ce51ddb23299$var$isArguments(arguments)) $c025ce51ddb23299$var$isArguments = function(obj) {
        return $j2bC2.default(obj, 'callee');
    };
})();
var $c025ce51ddb23299$export$2e2bcd8739ae039 = $c025ce51ddb23299$var$isArguments;

});
parcelRequire.register("j2bC2", function(module, exports) {

$parcel$export(module.exports, "default", () => $ddb7363d72231b25$export$2e2bcd8739ae039);

var $9dO2A = parcelRequire("9dO2A");
function $ddb7363d72231b25$export$2e2bcd8739ae039(obj, key) {
    return obj != null && $9dO2A.hasOwnProperty.call(obj, key);
}

});


parcelRequire.register("bAJdo", function(module, exports) {

$parcel$export(module.exports, "default", () => $8706213fcddf499d$export$2e2bcd8739ae039);

var $9dO2A = parcelRequire("9dO2A");

var $lFrDK = parcelRequire("lFrDK");
function $8706213fcddf499d$export$2e2bcd8739ae039(obj) {
    return !$lFrDK.default(obj) && $9dO2A._isFinite(obj) && !isNaN(parseFloat(obj));
}

});

parcelRequire.register("lGDHN", function(module, exports) {

$parcel$export(module.exports, "default", () => $fc9c51e576aa39d9$export$2e2bcd8739ae039);

var $9dO2A = parcelRequire("9dO2A");

var $1sv59 = parcelRequire("1sv59");
function $fc9c51e576aa39d9$export$2e2bcd8739ae039(obj) {
    return $1sv59.default(obj) && $9dO2A._isNaN(obj);
}

});

parcelRequire.register("69zTm", function(module, exports) {

$parcel$export(module.exports, "default", () => $47af6cb5ca570bb0$export$2e2bcd8739ae039);

var $9dO2A = parcelRequire("9dO2A");

var $3QkkI = parcelRequire("3QkkI");

var $eQ8Qy = parcelRequire("eQ8Qy");

var $blvJd = parcelRequire("blvJd");
// Is a given value a typed array?
var $47af6cb5ca570bb0$var$typedArrayPattern = /\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;
function $47af6cb5ca570bb0$var$isTypedArray(obj) {
    // `ArrayBuffer.isView` is the most future-proof, so use it when available.
    // Otherwise, fall back on the above regular expression.
    return $9dO2A.nativeIsView ? $9dO2A.nativeIsView(obj) && !$3QkkI.default(obj) : $blvJd.default(obj) && $47af6cb5ca570bb0$var$typedArrayPattern.test($9dO2A.toString.call(obj));
}
var $47af6cb5ca570bb0$export$2e2bcd8739ae039 = $9dO2A.supportsArrayBuffer ? $47af6cb5ca570bb0$var$isTypedArray : $eQ8Qy.default(false);

});
parcelRequire.register("eQ8Qy", function(module, exports) {

$parcel$export(module.exports, "default", () => $acdcc8c2830b29fe$export$2e2bcd8739ae039);
function $acdcc8c2830b29fe$export$2e2bcd8739ae039(value) {
    return function() {
        return value;
    };
}

});

parcelRequire.register("blvJd", function(module, exports) {

$parcel$export(module.exports, "default", () => $842a446fa3b9654a$export$2e2bcd8739ae039);

var $7y0aI = parcelRequire("7y0aI");

var $f0b6D = parcelRequire("f0b6D");
var // Internal helper to determine whether we should spend extensive checks against
// `ArrayBuffer` et al.
$842a446fa3b9654a$export$2e2bcd8739ae039 = $7y0aI.default($f0b6D.default);

});
parcelRequire.register("7y0aI", function(module, exports) {

$parcel$export(module.exports, "default", () => $57ebd779f3b31e26$export$2e2bcd8739ae039);

var $9dO2A = parcelRequire("9dO2A");
function $57ebd779f3b31e26$export$2e2bcd8739ae039(getSizeProperty) {
    return function(collection) {
        var sizeProperty = getSizeProperty(collection);
        return typeof sizeProperty == 'number' && sizeProperty >= 0 && sizeProperty <= $9dO2A.MAX_ARRAY_INDEX;
    };
}

});

parcelRequire.register("f0b6D", function(module, exports) {

$parcel$export(module.exports, "default", () => $aebf7888356e8b30$export$2e2bcd8739ae039);

var $045vJ = parcelRequire("045vJ");
var // Internal helper to obtain the `byteLength` property of an object.
$aebf7888356e8b30$export$2e2bcd8739ae039 = $045vJ.default('byteLength');

});
parcelRequire.register("045vJ", function(module, exports) {

$parcel$export(module.exports, "default", () => $00c4a62ba6701e66$export$2e2bcd8739ae039);
function $00c4a62ba6701e66$export$2e2bcd8739ae039(key) {
    return function(obj) {
        return obj == null ? void 0 : obj[key];
    };
}

});




parcelRequire.register("fiFlc", function(module, exports) {

$parcel$export(module.exports, "default", () => $b2389ae9ec80bf45$export$2e2bcd8739ae039);

var $kGFoo = parcelRequire("kGFoo");

var $9isuX = parcelRequire("9isuX");

var $9s5yQ = parcelRequire("9s5yQ");

var $guNrV = parcelRequire("guNrV");

var $3C7Wx = parcelRequire("3C7Wx");
function $b2389ae9ec80bf45$export$2e2bcd8739ae039(obj) {
    if (obj == null) return true;
    // Skip the more expensive `toString`-based type checks if `obj` has no
    // `.length`.
    var length = $kGFoo.default(obj);
    if (typeof length == 'number' && ($9isuX.default(obj) || $9s5yQ.default(obj) || $guNrV.default(obj))) return length === 0;
    return $kGFoo.default($3C7Wx.default(obj)) === 0;
}

});
parcelRequire.register("kGFoo", function(module, exports) {

$parcel$export(module.exports, "default", () => $f0f7d68d0bf1e6e4$export$2e2bcd8739ae039);

var $045vJ = parcelRequire("045vJ");
var // Internal helper to obtain the `length` property of an object.
$f0f7d68d0bf1e6e4$export$2e2bcd8739ae039 = $045vJ.default('length');

});

parcelRequire.register("3C7Wx", function(module, exports) {

$parcel$export(module.exports, "default", () => $2a1b1508980930a4$export$2e2bcd8739ae039);

var $kUJUF = parcelRequire("kUJUF");

var $9dO2A = parcelRequire("9dO2A");

var $j2bC2 = parcelRequire("j2bC2");

var $eLJkO = parcelRequire("eLJkO");
function $2a1b1508980930a4$export$2e2bcd8739ae039(obj) {
    if (!$kUJUF.default(obj)) return [];
    if ($9dO2A.nativeKeys) return $9dO2A.nativeKeys(obj);
    var keys = [];
    for(var key in obj)if ($j2bC2.default(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if ($9dO2A.hasEnumBug) $eLJkO.default(obj, keys);
    return keys;
}

});
parcelRequire.register("eLJkO", function(module, exports) {

$parcel$export(module.exports, "default", () => $ac089f04552523ad$export$2e2bcd8739ae039);

var $9dO2A = parcelRequire("9dO2A");

var $gzjvQ = parcelRequire("gzjvQ");

var $j2bC2 = parcelRequire("j2bC2");
// Internal helper to create a simple lookup structure.
// `collectNonEnumProps` used to depend on `_.contains`, but this led to
// circular imports. `emulatedSet` is a one-off solution that only works for
// arrays of strings.
function $ac089f04552523ad$var$emulatedSet(keys) {
    var hash = {
    };
    for(var l = keys.length, i = 0; i < l; ++i)hash[keys[i]] = true;
    return {
        contains: function(key) {
            return hash[key];
        },
        push: function(key) {
            hash[key] = true;
            return keys.push(key);
        }
    };
}
function $ac089f04552523ad$export$2e2bcd8739ae039(obj, keys) {
    keys = $ac089f04552523ad$var$emulatedSet(keys);
    var nonEnumIdx = $9dO2A.nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = $gzjvQ.default(constructor) && constructor.prototype || $9dO2A.ObjProto;
    // Constructor is a special case.
    var prop = 'constructor';
    if ($j2bC2.default(obj, prop) && !keys.contains(prop)) keys.push(prop);
    while(nonEnumIdx--){
        prop = $9dO2A.nonEnumerableProps[nonEnumIdx];
        if (prop in obj && obj[prop] !== proto[prop] && !keys.contains(prop)) keys.push(prop);
    }
}

});



parcelRequire.register("1VFFA", function(module, exports) {

$parcel$export(module.exports, "default", () => $167b7011f1c66754$export$2e2bcd8739ae039);

var $3C7Wx = parcelRequire("3C7Wx");
function $167b7011f1c66754$export$2e2bcd8739ae039(object, attrs) {
    var _keys = $3C7Wx.default(attrs), length = _keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for(var i = 0; i < length; i++){
        var key = _keys[i];
        if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
}

});

parcelRequire.register("9M5F5", function(module, exports) {

$parcel$export(module.exports, "default", () => $71dcfd078c3a5b86$export$2e2bcd8739ae039);

var $lwlxm = parcelRequire("lwlxm");

var $9dO2A = parcelRequire("9dO2A");

var $f0b6D = parcelRequire("f0b6D");

var $69zTm = parcelRequire("69zTm");

var $gzjvQ = parcelRequire("gzjvQ");

var $frHu4 = parcelRequire("frHu4");

var $3QkkI = parcelRequire("3QkkI");

var $3C7Wx = parcelRequire("3C7Wx");

var $j2bC2 = parcelRequire("j2bC2");

var $dbyTU = parcelRequire("dbyTU");
// We use this string twice, so give it a name for minification.
var $71dcfd078c3a5b86$var$tagDataView = '[object DataView]';
// Internal recursive comparison function for `_.isEqual`.
function $71dcfd078c3a5b86$var$eq(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](https://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself (strict comparison).
    if (a == null || b == null) return false;
    // `NaN`s are equivalent, but non-reflexive.
    if (a !== a) return b !== b;
    // Exhaust primitive checks
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
    return $71dcfd078c3a5b86$var$deepEq(a, b, aStack, bStack);
}
// Internal recursive comparison function for `_.isEqual`.
function $71dcfd078c3a5b86$var$deepEq(a, b, aStack, bStack) {
    // Unwrap any wrapped objects.
    if (a instanceof $lwlxm.default) a = a._wrapped;
    if (b instanceof $lwlxm.default) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = $9dO2A.toString.call(a);
    if (className !== $9dO2A.toString.call(b)) return false;
    // Work around a bug in IE 10 - Edge 13.
    if ($frHu4.hasStringTagBug && className == '[object Object]' && $3QkkI.default(a)) {
        if (!$3QkkI.default(b)) return false;
        className = $71dcfd078c3a5b86$var$tagDataView;
    }
    switch(className){
        // These types are compared by value.
        case '[object RegExp]':
        // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
        case '[object String]':
            // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
            // equivalent to `new String("5")`.
            return '' + a === '' + b;
        case '[object Number]':
            // `NaN`s are equivalent, but non-reflexive.
            // Object(NaN) is equivalent to NaN.
            if (+a !== +a) return +b !== +b;
            // An `egal` comparison is performed for other numeric values.
            return +a === 0 ? 1 / +a === 1 / b : +a === +b;
        case '[object Date]':
        case '[object Boolean]':
            // Coerce dates and booleans to numeric primitive values. Dates are compared by their
            // millisecond representations. Note that invalid dates with millisecond representations
            // of `NaN` are not equivalent.
            return +a === +b;
        case '[object Symbol]':
            return $9dO2A.SymbolProto.valueOf.call(a) === $9dO2A.SymbolProto.valueOf.call(b);
        case '[object ArrayBuffer]':
        case $71dcfd078c3a5b86$var$tagDataView:
            // Coerce to typed array so we can fall through.
            return $71dcfd078c3a5b86$var$deepEq($dbyTU.default(a), $dbyTU.default(b), aStack, bStack);
    }
    var areArrays = className === '[object Array]';
    if (!areArrays && $69zTm.default(a)) {
        var byteLength = $f0b6D.default(a);
        if (byteLength !== $f0b6D.default(b)) return false;
        if (a.buffer === b.buffer && a.byteOffset === b.byteOffset) return true;
        areArrays = true;
    }
    if (!areArrays) {
        if (typeof a != 'object' || typeof b != 'object') return false;
        // Objects with different constructors are not equivalent, but `Object`s or `Array`s
        // from different frames are.
        var aCtor = a.constructor, bCtor = b.constructor;
        if (aCtor !== bCtor && !($gzjvQ.default(aCtor) && aCtor instanceof aCtor && $gzjvQ.default(bCtor) && bCtor instanceof bCtor) && 'constructor' in a && 'constructor' in b) return false;
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while(length--){
        // Linear search. Performance is inversely proportional to the number of
        // unique nested structures.
        if (aStack[length] === a) return bStack[length] === b;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    // Recursively compare objects and arrays.
    if (areArrays) {
        // Compare array lengths to determine if a deep comparison is necessary.
        length = a.length;
        if (length !== b.length) return false;
        // Deep compare the contents, ignoring non-numeric properties.
        while(length--){
            if (!$71dcfd078c3a5b86$var$eq(a[length], b[length], aStack, bStack)) return false;
        }
    } else {
        // Deep compare objects.
        var _keys = $3C7Wx.default(a), key;
        length = _keys.length;
        // Ensure that both objects contain the same number of properties before comparing deep equality.
        if ($3C7Wx.default(b).length !== length) return false;
        while(length--){
            // Deep compare each member
            key = _keys[length];
            if (!($j2bC2.default(b, key) && $71dcfd078c3a5b86$var$eq(a[key], b[key], aStack, bStack))) return false;
        }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
}
function $71dcfd078c3a5b86$export$2e2bcd8739ae039(a, b) {
    return $71dcfd078c3a5b86$var$eq(a, b);
}

});
parcelRequire.register("lwlxm", function(module, exports) {

$parcel$export(module.exports, "default", () => $faad4af44582cddb$export$2e2bcd8739ae039);

var $9dO2A = parcelRequire("9dO2A");
function $faad4af44582cddb$export$2e2bcd8739ae039(obj) {
    if (obj instanceof $faad4af44582cddb$export$2e2bcd8739ae039) return obj;
    if (!(this instanceof $faad4af44582cddb$export$2e2bcd8739ae039)) return new $faad4af44582cddb$export$2e2bcd8739ae039(obj);
    this._wrapped = obj;
}
$faad4af44582cddb$export$2e2bcd8739ae039.VERSION = $9dO2A.VERSION;
// Extracts the result from a wrapped and chained object.
$faad4af44582cddb$export$2e2bcd8739ae039.prototype.value = function() {
    return this._wrapped;
};
// Provide unwrapping proxies for some methods used in engine operations
// such as arithmetic and JSON stringification.
$faad4af44582cddb$export$2e2bcd8739ae039.prototype.valueOf = $faad4af44582cddb$export$2e2bcd8739ae039.prototype.toJSON = $faad4af44582cddb$export$2e2bcd8739ae039.prototype.value;
$faad4af44582cddb$export$2e2bcd8739ae039.prototype.toString = function() {
    return String(this._wrapped);
};

});

parcelRequire.register("dbyTU", function(module, exports) {

$parcel$export(module.exports, "default", () => $99975ffcb910ff82$export$2e2bcd8739ae039);

var $f0b6D = parcelRequire("f0b6D");
function $99975ffcb910ff82$export$2e2bcd8739ae039(bufferSource) {
    return new Uint8Array(bufferSource.buffer || bufferSource, bufferSource.byteOffset || 0, $f0b6D.default(bufferSource));
}

});


parcelRequire.register("17TOs", function(module, exports) {

$parcel$export(module.exports, "default", () => $0d21bd2d6b187b8d$export$2e2bcd8739ae039);

var $eyZQq = parcelRequire("eyZQq");

var $frHu4 = parcelRequire("frHu4");

var $a1x92 = parcelRequire("a1x92");
var $0d21bd2d6b187b8d$export$2e2bcd8739ae039 = $frHu4.isIE11 ? $a1x92.ie11fingerprint($a1x92.mapMethods) : $eyZQq.default('Map');

});
parcelRequire.register("a1x92", function(module, exports) {

$parcel$export(module.exports, "ie11fingerprint", () => $74c3b5410624c388$export$15230eca1f400e40);
$parcel$export(module.exports, "weakMapMethods", () => $74c3b5410624c388$export$2f74b890a72cf48);
$parcel$export(module.exports, "mapMethods", () => $74c3b5410624c388$export$de9acb94190bb764);
$parcel$export(module.exports, "setMethods", () => $74c3b5410624c388$export$60e14a5e2a057f78);

var $kGFoo = parcelRequire("kGFoo");

var $gzjvQ = parcelRequire("gzjvQ");

var $cBY3u = parcelRequire("cBY3u");
function $74c3b5410624c388$export$15230eca1f400e40(methods) {
    var length = $kGFoo.default(methods);
    return function(obj) {
        if (obj == null) return false;
        // `Map`, `WeakMap` and `Set` have no enumerable keys.
        var keys = $cBY3u.default(obj);
        if ($kGFoo.default(keys)) return false;
        for(var i = 0; i < length; i++){
            if (!$gzjvQ.default(obj[methods[i]])) return false;
        }
        // If we are testing against `WeakMap`, we need to ensure that
        // `obj` doesn't have a `forEach` method in order to distinguish
        // it from a regular `Map`.
        return methods !== $74c3b5410624c388$export$2f74b890a72cf48 || !$gzjvQ.default(obj[$74c3b5410624c388$var$forEachName]);
    };
}
// In the interest of compact minification, we write
// each string in the fingerprints only once.
var $74c3b5410624c388$var$forEachName = 'forEach', $74c3b5410624c388$var$hasName = 'has', $74c3b5410624c388$var$commonInit = [
    'clear',
    'delete'
], $74c3b5410624c388$var$mapTail = [
    'get',
    $74c3b5410624c388$var$hasName,
    'set'
];
var $74c3b5410624c388$export$de9acb94190bb764 = $74c3b5410624c388$var$commonInit.concat($74c3b5410624c388$var$forEachName, $74c3b5410624c388$var$mapTail), $74c3b5410624c388$export$2f74b890a72cf48 = $74c3b5410624c388$var$commonInit.concat($74c3b5410624c388$var$mapTail), $74c3b5410624c388$export$60e14a5e2a057f78 = [
    'add'
].concat($74c3b5410624c388$var$commonInit, $74c3b5410624c388$var$forEachName, $74c3b5410624c388$var$hasName);

});
parcelRequire.register("cBY3u", function(module, exports) {

$parcel$export(module.exports, "default", () => $92e78678b30fa389$export$2e2bcd8739ae039);

var $kUJUF = parcelRequire("kUJUF");

var $9dO2A = parcelRequire("9dO2A");

var $eLJkO = parcelRequire("eLJkO");
function $92e78678b30fa389$export$2e2bcd8739ae039(obj) {
    if (!$kUJUF.default(obj)) return [];
    var keys = [];
    for(var key in obj)keys.push(key);
    // Ahem, IE < 9.
    if ($9dO2A.hasEnumBug) $eLJkO.default(obj, keys);
    return keys;
}

});



parcelRequire.register("c3C1Q", function(module, exports) {

$parcel$export(module.exports, "default", () => $8c73438e1c1a04ab$export$2e2bcd8739ae039);

var $eyZQq = parcelRequire("eyZQq");

var $frHu4 = parcelRequire("frHu4");

var $a1x92 = parcelRequire("a1x92");
var $8c73438e1c1a04ab$export$2e2bcd8739ae039 = $frHu4.isIE11 ? $a1x92.ie11fingerprint($a1x92.weakMapMethods) : $eyZQq.default('WeakMap');

});

parcelRequire.register("diuHC", function(module, exports) {

$parcel$export(module.exports, "default", () => $9ae4c5ae6f67c66d$export$2e2bcd8739ae039);

var $eyZQq = parcelRequire("eyZQq");

var $frHu4 = parcelRequire("frHu4");

var $a1x92 = parcelRequire("a1x92");
var $9ae4c5ae6f67c66d$export$2e2bcd8739ae039 = $frHu4.isIE11 ? $a1x92.ie11fingerprint($a1x92.setMethods) : $eyZQq.default('Set');

});

parcelRequire.register("cWrYK", function(module, exports) {

$parcel$export(module.exports, "default", () => $96c09ad6a341c61e$export$2e2bcd8739ae039);

var $eyZQq = parcelRequire("eyZQq");
var $96c09ad6a341c61e$export$2e2bcd8739ae039 = $eyZQq.default('WeakSet');

});

parcelRequire.register("jl8SM", function(module, exports) {

$parcel$export(module.exports, "default", () => $e146de61120ec5c7$export$2e2bcd8739ae039);

var $3C7Wx = parcelRequire("3C7Wx");
function $e146de61120ec5c7$export$2e2bcd8739ae039(obj) {
    var _keys = $3C7Wx.default(obj);
    var length = _keys.length;
    var values = Array(length);
    for(var i = 0; i < length; i++)values[i] = obj[_keys[i]];
    return values;
}

});

parcelRequire.register("8o4xP", function(module, exports) {

$parcel$export(module.exports, "default", () => $61b41714a51e2136$export$2e2bcd8739ae039);

var $3C7Wx = parcelRequire("3C7Wx");
function $61b41714a51e2136$export$2e2bcd8739ae039(obj) {
    var _keys = $3C7Wx.default(obj);
    var length = _keys.length;
    var pairs = Array(length);
    for(var i = 0; i < length; i++)pairs[i] = [
        _keys[i],
        obj[_keys[i]]
    ];
    return pairs;
}

});

parcelRequire.register("dar4T", function(module, exports) {

$parcel$export(module.exports, "default", () => $996136a2ef0d744c$export$2e2bcd8739ae039);

var $3C7Wx = parcelRequire("3C7Wx");
function $996136a2ef0d744c$export$2e2bcd8739ae039(obj) {
    var result = {
    };
    var _keys = $3C7Wx.default(obj);
    for(var i = 0, length = _keys.length; i < length; i++)result[obj[_keys[i]]] = _keys[i];
    return result;
}

});

parcelRequire.register("apdmN", function(module, exports) {

$parcel$export(module.exports, "default", () => $79369b85f61463d1$export$2e2bcd8739ae039);

var $gzjvQ = parcelRequire("gzjvQ");
function $79369b85f61463d1$export$2e2bcd8739ae039(obj) {
    var names = [];
    for(var key in obj)if ($gzjvQ.default(obj[key])) names.push(key);
    return names.sort();
}

});

parcelRequire.register("ddYNh", function(module, exports) {

$parcel$export(module.exports, "default", () => $9a0ba5a2e7237e45$export$2e2bcd8739ae039);

var $cdkU3 = parcelRequire("cdkU3");

var $cBY3u = parcelRequire("cBY3u");
var // Extend a given object with all the properties in passed-in object(s).
$9a0ba5a2e7237e45$export$2e2bcd8739ae039 = $cdkU3.default($cBY3u.default);

});
parcelRequire.register("cdkU3", function(module, exports) {

$parcel$export(module.exports, "default", () => $8e46e9dde5df05a6$export$2e2bcd8739ae039);
function $8e46e9dde5df05a6$export$2e2bcd8739ae039(keysFunc, defaults) {
    return function(obj) {
        var length = arguments.length;
        if (defaults) obj = Object(obj);
        if (length < 2 || obj == null) return obj;
        for(var index = 1; index < length; index++){
            var source = arguments[index], keys = keysFunc(source), l = keys.length;
            for(var i = 0; i < l; i++){
                var key = keys[i];
                if (!defaults || obj[key] === void 0) obj[key] = source[key];
            }
        }
        return obj;
    };
}

});


parcelRequire.register("hRDBc", function(module, exports) {

$parcel$export(module.exports, "default", () => $d0161a72c296faf5$export$2e2bcd8739ae039);

var $cdkU3 = parcelRequire("cdkU3");

var $3C7Wx = parcelRequire("3C7Wx");
var // Assigns a given object with all the own properties in the passed-in
// object(s).
// (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
$d0161a72c296faf5$export$2e2bcd8739ae039 = $cdkU3.default($3C7Wx.default);

});

parcelRequire.register("jux9i", function(module, exports) {

$parcel$export(module.exports, "default", () => $e30a885c52e91222$export$2e2bcd8739ae039);

var $cdkU3 = parcelRequire("cdkU3");

var $cBY3u = parcelRequire("cBY3u");
var // Fill in a given object with default properties.
$e30a885c52e91222$export$2e2bcd8739ae039 = $cdkU3.default($cBY3u.default, true);

});

parcelRequire.register("i50Vd", function(module, exports) {

$parcel$export(module.exports, "default", () => $d29968a8438f95a9$export$2e2bcd8739ae039);

var $bPRPB = parcelRequire("bPRPB");

var $hRDBc = parcelRequire("hRDBc");
function $d29968a8438f95a9$export$2e2bcd8739ae039(prototype, props) {
    var result = $bPRPB.default(prototype);
    if (props) $hRDBc.default(result, props);
    return result;
}

});
parcelRequire.register("bPRPB", function(module, exports) {

$parcel$export(module.exports, "default", () => $89de36e47de1ea2e$export$2e2bcd8739ae039);

var $kUJUF = parcelRequire("kUJUF");

var $9dO2A = parcelRequire("9dO2A");
// Create a naked function reference for surrogate-prototype-swapping.
function $89de36e47de1ea2e$var$ctor() {
    return function() {
    };
}
function $89de36e47de1ea2e$export$2e2bcd8739ae039(prototype) {
    if (!$kUJUF.default(prototype)) return {
    };
    if ($9dO2A.nativeCreate) return $9dO2A.nativeCreate(prototype);
    var Ctor = $89de36e47de1ea2e$var$ctor();
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
}

});


parcelRequire.register("7oKeL", function(module, exports) {

$parcel$export(module.exports, "default", () => $562ea405bbab9817$export$2e2bcd8739ae039);

var $kUJUF = parcelRequire("kUJUF");

var $9isuX = parcelRequire("9isuX");

var $ddYNh = parcelRequire("ddYNh");
function $562ea405bbab9817$export$2e2bcd8739ae039(obj) {
    if (!$kUJUF.default(obj)) return obj;
    return $9isuX.default(obj) ? obj.slice() : $ddYNh.default({
    }, obj);
}

});

parcelRequire.register("37uUu", function(module, exports) {

$parcel$export(module.exports, "default", () => $245a00a1564f5d5d$export$2e2bcd8739ae039);
function $245a00a1564f5d5d$export$2e2bcd8739ae039(obj, interceptor) {
    interceptor(obj);
    return obj;
}

});

parcelRequire.register("edW5k", function(module, exports) {

$parcel$export(module.exports, "default", () => $a5af56062581f06f$export$2e2bcd8739ae039);

var $2FNRT = parcelRequire("2FNRT");

var $8zJRR = parcelRequire("8zJRR");

var $leAUX = parcelRequire("leAUX");
function $a5af56062581f06f$export$2e2bcd8739ae039(object, path, defaultValue) {
    var value = $8zJRR.default(object, $2FNRT.default(path));
    return $leAUX.default(value) ? defaultValue : value;
}

});
parcelRequire.register("2FNRT", function(module, exports) {

$parcel$export(module.exports, "default", () => $1f2617ec8c6f2c0d$export$2e2bcd8739ae039);

var $lwlxm = parcelRequire("lwlxm");
parcelRequire("fhrzh");
function $1f2617ec8c6f2c0d$export$2e2bcd8739ae039(path) {
    return $lwlxm.default.toPath(path);
}

});
parcelRequire.register("fhrzh", function(module, exports) {

$parcel$export(module.exports, "default", () => $b1fdd3faddf98194$export$2e2bcd8739ae039);

var $lwlxm = parcelRequire("lwlxm");

var $9isuX = parcelRequire("9isuX");
function $b1fdd3faddf98194$export$2e2bcd8739ae039(path) {
    return $9isuX.default(path) ? path : [
        path
    ];
}
$lwlxm.default.toPath = $b1fdd3faddf98194$export$2e2bcd8739ae039;

});


parcelRequire.register("8zJRR", function(module, exports) {

$parcel$export(module.exports, "default", () => $63e52bf6d9a06b02$export$2e2bcd8739ae039);
function $63e52bf6d9a06b02$export$2e2bcd8739ae039(obj, path) {
    var length = path.length;
    for(var i = 0; i < length; i++){
        if (obj == null) return void 0;
        obj = obj[path[i]];
    }
    return length ? obj : void 0;
}

});


parcelRequire.register("e9YpB", function(module, exports) {

$parcel$export(module.exports, "default", () => $a4f0c47f0ae67ef9$export$2e2bcd8739ae039);

var $j2bC2 = parcelRequire("j2bC2");

var $2FNRT = parcelRequire("2FNRT");
function $a4f0c47f0ae67ef9$export$2e2bcd8739ae039(obj, path) {
    path = $2FNRT.default(path);
    var length = path.length;
    for(var i = 0; i < length; i++){
        var key = path[i];
        if (!$j2bC2.default(obj, key)) return false;
        obj = obj[key];
    }
    return !!length;
}

});

parcelRequire.register("fhwT5", function(module, exports) {

$parcel$export(module.exports, "default", () => $b201f457abab1a15$export$2e2bcd8739ae039);

var $f5gHN = parcelRequire("f5gHN");

var $3C7Wx = parcelRequire("3C7Wx");
function $b201f457abab1a15$export$2e2bcd8739ae039(obj, iteratee, context) {
    iteratee = $f5gHN.default(iteratee, context);
    var _keys = $3C7Wx.default(obj), length = _keys.length, results = {
    };
    for(var index = 0; index < length; index++){
        var currentKey = _keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
}

});
parcelRequire.register("f5gHN", function(module, exports) {

$parcel$export(module.exports, "default", () => $afb448019d328bdc$export$2e2bcd8739ae039);

var $lwlxm = parcelRequire("lwlxm");

var $gs9i6 = parcelRequire("gs9i6");

var $erIZ2 = parcelRequire("erIZ2");
function $afb448019d328bdc$export$2e2bcd8739ae039(value, context, argCount) {
    if ($lwlxm.default.iteratee !== $erIZ2.default) return $lwlxm.default.iteratee(value, context);
    return $gs9i6.default(value, context, argCount);
}

});
parcelRequire.register("gs9i6", function(module, exports) {

$parcel$export(module.exports, "default", () => $bfa677e06313d90e$export$2e2bcd8739ae039);

var $ckYla = parcelRequire("ckYla");

var $gzjvQ = parcelRequire("gzjvQ");

var $kUJUF = parcelRequire("kUJUF");

var $9isuX = parcelRequire("9isuX");

var $fJBs5 = parcelRequire("fJBs5");

var $65dt8 = parcelRequire("65dt8");

var $6emyW = parcelRequire("6emyW");
function $bfa677e06313d90e$export$2e2bcd8739ae039(value, context, argCount) {
    if (value == null) return $ckYla.default;
    if ($gzjvQ.default(value)) return $6emyW.default(value, context, argCount);
    if ($kUJUF.default(value) && !$9isuX.default(value)) return $fJBs5.default(value);
    return $65dt8.default(value);
}

});
parcelRequire.register("ckYla", function(module, exports) {

$parcel$export(module.exports, "default", () => $8fb628a4bb67a64e$export$2e2bcd8739ae039);
function $8fb628a4bb67a64e$export$2e2bcd8739ae039(value) {
    return value;
}

});

parcelRequire.register("fJBs5", function(module, exports) {

$parcel$export(module.exports, "default", () => $b7481c31240f97bb$export$2e2bcd8739ae039);

var $hRDBc = parcelRequire("hRDBc");

var $1VFFA = parcelRequire("1VFFA");
function $b7481c31240f97bb$export$2e2bcd8739ae039(attrs) {
    attrs = $hRDBc.default({
    }, attrs);
    return function(obj) {
        return $1VFFA.default(obj, attrs);
    };
}

});

parcelRequire.register("65dt8", function(module, exports) {

$parcel$export(module.exports, "default", () => $46dda85b99b3f1e3$export$2e2bcd8739ae039);

var $8zJRR = parcelRequire("8zJRR");

var $2FNRT = parcelRequire("2FNRT");
function $46dda85b99b3f1e3$export$2e2bcd8739ae039(path) {
    path = $2FNRT.default(path);
    return function(obj) {
        return $8zJRR.default(obj, path);
    };
}

});

parcelRequire.register("6emyW", function(module, exports) {

$parcel$export(module.exports, "default", () => $48958d51bb1a87e9$export$2e2bcd8739ae039);
function $48958d51bb1a87e9$export$2e2bcd8739ae039(func, context, argCount) {
    if (context === void 0) return func;
    switch(argCount == null ? 3 : argCount){
        case 1:
            return function(value) {
                return func.call(context, value);
            };
        // The 2-argument case is omitted because we’re not using it.
        case 3:
            return function(value, index, collection) {
                return func.call(context, value, index, collection);
            };
        case 4:
            return function(accumulator, value, index, collection) {
                return func.call(context, accumulator, value, index, collection);
            };
    }
    return function() {
        return func.apply(context, arguments);
    };
}

});


parcelRequire.register("erIZ2", function(module, exports) {

$parcel$export(module.exports, "default", () => $a8467b1ac3df0566$export$2e2bcd8739ae039);

var $lwlxm = parcelRequire("lwlxm");

var $gs9i6 = parcelRequire("gs9i6");
function $a8467b1ac3df0566$export$2e2bcd8739ae039(value, context) {
    return $gs9i6.default(value, context, Infinity);
}
$lwlxm.default.iteratee = $a8467b1ac3df0566$export$2e2bcd8739ae039;

});



parcelRequire.register("19Lbq", function(module, exports) {

$parcel$export(module.exports, "default", () => $0d7b3b566fb00391$export$2e2bcd8739ae039);
function $0d7b3b566fb00391$export$2e2bcd8739ae039() {
}

});

parcelRequire.register("a7xIY", function(module, exports) {

$parcel$export(module.exports, "default", () => $75e4b7ca9b835cf2$export$2e2bcd8739ae039);

var $19Lbq = parcelRequire("19Lbq");

var $edW5k = parcelRequire("edW5k");
function $75e4b7ca9b835cf2$export$2e2bcd8739ae039(obj) {
    if (obj == null) return $19Lbq.default;
    return function(path) {
        return $edW5k.default(obj, path);
    };
}

});

parcelRequire.register("2sKuv", function(module, exports) {

$parcel$export(module.exports, "default", () => $1cb24275677300b2$export$2e2bcd8739ae039);

var $6emyW = parcelRequire("6emyW");
function $1cb24275677300b2$export$2e2bcd8739ae039(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = $6emyW.default(iteratee, context, 1);
    for(var i = 0; i < n; i++)accum[i] = iteratee(i);
    return accum;
}

});

parcelRequire.register("iBZ1m", function(module, exports) {

$parcel$export(module.exports, "default", () => $d8cb042a08bd9dd8$export$2e2bcd8739ae039);
function $d8cb042a08bd9dd8$export$2e2bcd8739ae039(min, max) {
    if (max == null) {
        max = min;
        min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
}

});

parcelRequire.register("biBxH", function(module, exports) {

$parcel$export(module.exports, "default", () => $839e7f4f60ead7a2$export$2e2bcd8739ae039);
var // A (possibly faster) way to get the current timestamp as an integer.
$839e7f4f60ead7a2$export$2e2bcd8739ae039 = Date.now || function() {
    return new Date().getTime();
};

});

parcelRequire.register("6p0Sg", function(module, exports) {

$parcel$export(module.exports, "default", () => $4a95c17a0872e304$export$2e2bcd8739ae039);

var $aZ5P8 = parcelRequire("aZ5P8");

var $8KfeE = parcelRequire("8KfeE");
var // Function for escaping strings to HTML interpolation.
$4a95c17a0872e304$export$2e2bcd8739ae039 = $aZ5P8.default($8KfeE.default);

});
parcelRequire.register("aZ5P8", function(module, exports) {

$parcel$export(module.exports, "default", () => $7ff41e6143ccfb47$export$2e2bcd8739ae039);

var $3C7Wx = parcelRequire("3C7Wx");
function $7ff41e6143ccfb47$export$2e2bcd8739ae039(map) {
    var escaper = function(match) {
        return map[match];
    };
    // Regexes for identifying a key that needs to be escaped.
    var source = '(?:' + $3C7Wx.default(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
        string = string == null ? '' : '' + string;
        return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
}

});

parcelRequire.register("8KfeE", function(module, exports) {

$parcel$export(module.exports, "default", () => $65de70009c25b0bb$export$2e2bcd8739ae039);
var // Internal list of HTML entities for escaping.
$65de70009c25b0bb$export$2e2bcd8739ae039 = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
};

});


parcelRequire.register("iHGtn", function(module, exports) {

$parcel$export(module.exports, "default", () => $d9dd30603224136e$export$2e2bcd8739ae039);

var $aZ5P8 = parcelRequire("aZ5P8");

var $h6TdV = parcelRequire("h6TdV");
var // Function for unescaping strings from HTML interpolation.
$d9dd30603224136e$export$2e2bcd8739ae039 = $aZ5P8.default($h6TdV.default);

});
parcelRequire.register("h6TdV", function(module, exports) {

$parcel$export(module.exports, "default", () => $c74dd577e01518a8$export$2e2bcd8739ae039);

var $dar4T = parcelRequire("dar4T");

var $8KfeE = parcelRequire("8KfeE");
var // Internal list of HTML entities for unescaping.
$c74dd577e01518a8$export$2e2bcd8739ae039 = $dar4T.default($8KfeE.default);

});


parcelRequire.register("ebup1", function(module, exports) {

$parcel$export(module.exports, "default", () => $a539ad1803df5fb3$export$2e2bcd8739ae039);

var $lwlxm = parcelRequire("lwlxm");
var // By default, Underscore uses ERB-style template delimiters. Change the
// following template settings to use alternative delimiters.
$a539ad1803df5fb3$export$2e2bcd8739ae039 = $lwlxm.default.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
};

});

parcelRequire.register("3nf7o", function(module, exports) {

$parcel$export(module.exports, "default", () => $274f3f3e2743d86e$export$2e2bcd8739ae039);

var $jux9i = parcelRequire("jux9i");

var $lwlxm = parcelRequire("lwlxm");
parcelRequire("ebup1");
// When customizing `_.templateSettings`, if you don't want to define an
// interpolation, evaluation or escaping regex, we need one that is
// guaranteed not to match.
var $274f3f3e2743d86e$var$noMatch = /(.)^/;
// Certain characters need to be escaped so that they can be put into a
// string literal.
var $274f3f3e2743d86e$var$escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
};
var $274f3f3e2743d86e$var$escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;
function $274f3f3e2743d86e$var$escapeChar(match) {
    return '\\' + $274f3f3e2743d86e$var$escapes[match];
}
// In order to prevent third-party code injection through
// `_.templateSettings.variable`, we test it against the following regular
// expression. It is intentionally a bit more liberal than just matching valid
// identifiers, but still prevents possible loopholes through defaults or
// destructuring assignment.
var $274f3f3e2743d86e$var$bareIdentifier = /^\s*(\w|\$)+\s*$/;
function $274f3f3e2743d86e$export$2e2bcd8739ae039(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = $jux9i.default({
    }, settings, $lwlxm.default.templateSettings);
    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
        (settings.escape || $274f3f3e2743d86e$var$noMatch).source,
        (settings.interpolate || $274f3f3e2743d86e$var$noMatch).source,
        (settings.evaluate || $274f3f3e2743d86e$var$noMatch).source
    ].join('|') + '|$', 'g');
    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
        source += text.slice(index, offset).replace($274f3f3e2743d86e$var$escapeRegExp, $274f3f3e2743d86e$var$escapeChar);
        index = offset + match.length;
        if (escape) source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
        else if (interpolate) source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
        else if (evaluate) source += "';\n" + evaluate + "\n__p+='";
        // Adobe VMs need the match returned to produce the correct offset.
        return match;
    });
    source += "';\n";
    var argument = settings.variable;
    if (argument) {
        // Insure against third-party code injection. (CVE-2021-23358)
        if (!$274f3f3e2743d86e$var$bareIdentifier.test(argument)) throw new Error('variable is not a bare identifier: ' + argument);
    } else {
        // If a variable is not specified, place data values in local scope.
        source = 'with(obj||{}){\n' + source + '}\n';
        argument = 'obj';
    }
    source = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + source + 'return __p;\n';
    var render;
    try {
        render = new Function(argument, '_', source);
    } catch (e) {
        e.source = source;
        throw e;
    }
    var template = function(data) {
        return render.call(this, data, $lwlxm.default);
    };
    // Provide the compiled source as a convenience for precompilation.
    template.source = 'function(' + argument + '){\n' + source + '}';
    return template;
}

});

parcelRequire.register("6bwuT", function(module, exports) {

$parcel$export(module.exports, "default", () => $480cfa6f334156f9$export$2e2bcd8739ae039);

var $gzjvQ = parcelRequire("gzjvQ");

var $2FNRT = parcelRequire("2FNRT");
function $480cfa6f334156f9$export$2e2bcd8739ae039(obj, path, fallback) {
    path = $2FNRT.default(path);
    var length = path.length;
    if (!length) return $gzjvQ.default(fallback) ? fallback.call(obj) : fallback;
    for(var i = 0; i < length; i++){
        var prop = obj == null ? void 0 : obj[path[i]];
        if (prop === void 0) {
            prop = fallback;
            i = length; // Ensure we don't continue iterating.
        }
        obj = $gzjvQ.default(prop) ? prop.call(obj) : prop;
    }
    return obj;
}

});

parcelRequire.register("5F3qO", function(module, exports) {

$parcel$export(module.exports, "default", () => $41f3717acf5a25ab$export$2e2bcd8739ae039);
// Generate a unique integer id (unique within the entire client session).
// Useful for temporary DOM ids.
var $41f3717acf5a25ab$var$idCounter = 0;
function $41f3717acf5a25ab$export$2e2bcd8739ae039(prefix) {
    var id = ++$41f3717acf5a25ab$var$idCounter + '';
    return prefix ? prefix + id : id;
}

});

parcelRequire.register("kGd3g", function(module, exports) {

$parcel$export(module.exports, "default", () => $f0e1dab1d34e5d49$export$2e2bcd8739ae039);

var $lwlxm = parcelRequire("lwlxm");
function $f0e1dab1d34e5d49$export$2e2bcd8739ae039(obj) {
    var instance = $lwlxm.default(obj);
    instance._chain = true;
    return instance;
}

});

parcelRequire.register("2Z0z7", function(module, exports) {

$parcel$export(module.exports, "default", () => $22c1b79505e1e9de$export$2e2bcd8739ae039);

var $6hviD = parcelRequire("6hviD");

var $gkIus = parcelRequire("gkIus");

var $lwlxm = parcelRequire("lwlxm");
// Partially apply a function by creating a version that has had some of its
// arguments pre-filled, without changing its dynamic `this` context. `_` acts
// as a placeholder by default, allowing any combination of arguments to be
// pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
var $22c1b79505e1e9de$var$partial = $6hviD.default(function(func, boundArgs) {
    var placeholder = $22c1b79505e1e9de$var$partial.placeholder;
    var bound = function() {
        var position = 0, length = boundArgs.length;
        var args = Array(length);
        for(var i = 0; i < length; i++)args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
        while(position < arguments.length)args.push(arguments[position++]);
        return $gkIus.default(func, bound, this, this, args);
    };
    return bound;
});
$22c1b79505e1e9de$var$partial.placeholder = $lwlxm.default;
var $22c1b79505e1e9de$export$2e2bcd8739ae039 = $22c1b79505e1e9de$var$partial;

});
parcelRequire.register("gkIus", function(module, exports) {

$parcel$export(module.exports, "default", () => $be41067269ff957e$export$2e2bcd8739ae039);

var $bPRPB = parcelRequire("bPRPB");

var $kUJUF = parcelRequire("kUJUF");
function $be41067269ff957e$export$2e2bcd8739ae039(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = $bPRPB.default(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if ($kUJUF.default(result)) return result;
    return self;
}

});


parcelRequire.register("eB57c", function(module, exports) {

$parcel$export(module.exports, "default", () => $aa087d268fcfcd87$export$2e2bcd8739ae039);

var $6hviD = parcelRequire("6hviD");

var $gzjvQ = parcelRequire("gzjvQ");

var $gkIus = parcelRequire("gkIus");
var // Create a function bound to a given object (assigning `this`, and arguments,
// optionally).
$aa087d268fcfcd87$export$2e2bcd8739ae039 = $6hviD.default(function(func, context, args) {
    if (!$gzjvQ.default(func)) throw new TypeError('Bind must be called on a function');
    var bound = $6hviD.default(function(callArgs) {
        return $gkIus.default(func, bound, context, this, args.concat(callArgs));
    });
    return bound;
});

});

parcelRequire.register("lxBj2", function(module, exports) {

$parcel$export(module.exports, "default", () => $fae99e3ebac13d70$export$2e2bcd8739ae039);

var $6hviD = parcelRequire("6hviD");

var $leGk2 = parcelRequire("leGk2");

var $eB57c = parcelRequire("eB57c");
var // Bind a number of an object's methods to that object. Remaining arguments
// are the method names to be bound. Useful for ensuring that all callbacks
// defined on an object belong to it.
$fae99e3ebac13d70$export$2e2bcd8739ae039 = $6hviD.default(function(obj, keys) {
    keys = $leGk2.default(keys, false, false);
    var index = keys.length;
    if (index < 1) throw new Error('bindAll must be passed function names');
    while(index--){
        var key = keys[index];
        obj[key] = $eB57c.default(obj[key], obj);
    }
    return obj;
});

});
parcelRequire.register("leGk2", function(module, exports) {

$parcel$export(module.exports, "default", () => $f75bbc1b267f4652$export$2e2bcd8739ae039);

var $kGFoo = parcelRequire("kGFoo");

var $4bGzx = parcelRequire("4bGzx");

var $9isuX = parcelRequire("9isuX");

var $guNrV = parcelRequire("guNrV");
function $f75bbc1b267f4652$export$2e2bcd8739ae039(input, depth, strict, output) {
    output = output || [];
    if (!depth && depth !== 0) depth = Infinity;
    else if (depth <= 0) return output.concat(input);
    var idx = output.length;
    for(var i = 0, length = $kGFoo.default(input); i < length; i++){
        var value = input[i];
        if ($4bGzx.default(value) && ($9isuX.default(value) || $guNrV.default(value))) {
            // Flatten current level of array or arguments object.
            if (depth > 1) {
                $f75bbc1b267f4652$export$2e2bcd8739ae039(value, depth - 1, strict, output);
                idx = output.length;
            } else {
                var j = 0, len = value.length;
                while(j < len)output[idx++] = value[j++];
            }
        } else if (!strict) output[idx++] = value;
    }
    return output;
}

});
parcelRequire.register("4bGzx", function(module, exports) {

$parcel$export(module.exports, "default", () => $30c9366e52f5d04b$export$2e2bcd8739ae039);

var $7y0aI = parcelRequire("7y0aI");

var $kGFoo = parcelRequire("kGFoo");
var // Internal helper for collection methods to determine whether a collection
// should be iterated as an array or as an object.
// Related: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
// Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
$30c9366e52f5d04b$export$2e2bcd8739ae039 = $7y0aI.default($kGFoo.default);

});



parcelRequire.register("jCyBK", function(module, exports) {

$parcel$export(module.exports, "default", () => $e48c694e21fa5fde$export$2e2bcd8739ae039);

var $j2bC2 = parcelRequire("j2bC2");
function $e48c694e21fa5fde$export$2e2bcd8739ae039(func, hasher) {
    var memoize = function(key) {
        var cache = memoize.cache;
        var address = '' + (hasher ? hasher.apply(this, arguments) : key);
        if (!$j2bC2.default(cache, address)) cache[address] = func.apply(this, arguments);
        return cache[address];
    };
    memoize.cache = {
    };
    return memoize;
}

});

parcelRequire.register("9l0rK", function(module, exports) {

$parcel$export(module.exports, "default", () => $6cc66bdf0027e2d0$export$2e2bcd8739ae039);

var $6hviD = parcelRequire("6hviD");
var // Delays a function for the given number of milliseconds, and then calls
// it with the arguments supplied.
$6cc66bdf0027e2d0$export$2e2bcd8739ae039 = $6hviD.default(function(func, wait, args) {
    return setTimeout(function() {
        return func.apply(null, args);
    }, wait);
});

});

parcelRequire.register("g1V2Y", function(module, exports) {

$parcel$export(module.exports, "default", () => $bab8fdb1942d7efd$export$2e2bcd8739ae039);

var $2Z0z7 = parcelRequire("2Z0z7");

var $9l0rK = parcelRequire("9l0rK");

var $lwlxm = parcelRequire("lwlxm");
var // Defers a function, scheduling it to run after the current call stack has
// cleared.
$bab8fdb1942d7efd$export$2e2bcd8739ae039 = $2Z0z7.default($9l0rK.default, $lwlxm.default, 1);

});

parcelRequire.register("gYt8Y", function(module, exports) {

$parcel$export(module.exports, "default", () => $c5b8db47642b11f9$export$2e2bcd8739ae039);

var $biBxH = parcelRequire("biBxH");
function $c5b8db47642b11f9$export$2e2bcd8739ae039(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {
    };
    var later = function() {
        previous = options.leading === false ? 0 : $biBxH.default();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };
    var throttled = function() {
        var _now = $biBxH.default();
        if (!previous && options.leading === false) previous = _now;
        var remaining = wait - (_now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = _now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) timeout = setTimeout(later, remaining);
        return result;
    };
    throttled.cancel = function() {
        clearTimeout(timeout);
        previous = 0;
        timeout = context = args = null;
    };
    return throttled;
}

});

parcelRequire.register("1MRWn", function(module, exports) {

$parcel$export(module.exports, "default", () => $14d41d98f678bfa6$export$2e2bcd8739ae039);

var $6hviD = parcelRequire("6hviD");

var $biBxH = parcelRequire("biBxH");
function $14d41d98f678bfa6$export$2e2bcd8739ae039(func, wait, immediate) {
    var timeout, previous, args, result, context;
    var later = function() {
        var passed = $biBxH.default() - previous;
        if (wait > passed) timeout = setTimeout(later, wait - passed);
        else {
            timeout = null;
            if (!immediate) result = func.apply(context, args);
            // This check is needed because `func` can recursively invoke `debounced`.
            if (!timeout) args = context = null;
        }
    };
    var debounced = $6hviD.default(function(_args) {
        context = this;
        args = _args;
        previous = $biBxH.default();
        if (!timeout) {
            timeout = setTimeout(later, wait);
            if (immediate) result = func.apply(context, args);
        }
        return result;
    });
    debounced.cancel = function() {
        clearTimeout(timeout);
        timeout = args = context = null;
    };
    return debounced;
}

});

parcelRequire.register("izr7m", function(module, exports) {

$parcel$export(module.exports, "default", () => $d85087ea2c3d1f2a$export$2e2bcd8739ae039);

var $2Z0z7 = parcelRequire("2Z0z7");
function $d85087ea2c3d1f2a$export$2e2bcd8739ae039(func, wrapper) {
    return $2Z0z7.default(wrapper, func);
}

});

parcelRequire.register("2ZQFv", function(module, exports) {

$parcel$export(module.exports, "default", () => $22ea222474e7eaf0$export$2e2bcd8739ae039);
function $22ea222474e7eaf0$export$2e2bcd8739ae039(predicate) {
    return function() {
        return !predicate.apply(this, arguments);
    };
}

});

parcelRequire.register("iDFxW", function(module, exports) {

$parcel$export(module.exports, "default", () => $d91c18c77ef23a06$export$2e2bcd8739ae039);
function $d91c18c77ef23a06$export$2e2bcd8739ae039() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
        var i = start;
        var result = args[start].apply(this, arguments);
        while(i--)result = args[i].call(this, result);
        return result;
    };
}

});

parcelRequire.register("3JIxF", function(module, exports) {

$parcel$export(module.exports, "default", () => $2b882030e6b05389$export$2e2bcd8739ae039);
function $2b882030e6b05389$export$2e2bcd8739ae039(times, func) {
    return function() {
        if (--times < 1) return func.apply(this, arguments);
    };
}

});

parcelRequire.register("5jfUT", function(module, exports) {

$parcel$export(module.exports, "default", () => $3ddb12d547c702aa$export$2e2bcd8739ae039);
function $3ddb12d547c702aa$export$2e2bcd8739ae039(times, func) {
    var memo;
    return function() {
        if (--times > 0) memo = func.apply(this, arguments);
        if (times <= 1) func = null;
        return memo;
    };
}

});

parcelRequire.register("5QWK4", function(module, exports) {

$parcel$export(module.exports, "default", () => $442f600772b46b39$export$2e2bcd8739ae039);

var $2Z0z7 = parcelRequire("2Z0z7");

var $5jfUT = parcelRequire("5jfUT");
var // Returns a function that will be executed at most one time, no matter how
// often you call it. Useful for lazy initialization.
$442f600772b46b39$export$2e2bcd8739ae039 = $2Z0z7.default($5jfUT.default, 2);

});

parcelRequire.register("4jK7I", function(module, exports) {

$parcel$export(module.exports, "default", () => $324cb6e8288106d0$export$2e2bcd8739ae039);

var $f5gHN = parcelRequire("f5gHN");

var $3C7Wx = parcelRequire("3C7Wx");
function $324cb6e8288106d0$export$2e2bcd8739ae039(obj, predicate, context) {
    predicate = $f5gHN.default(predicate, context);
    var _keys = $3C7Wx.default(obj), key;
    for(var i = 0, length = _keys.length; i < length; i++){
        key = _keys[i];
        if (predicate(obj[key], key, obj)) return key;
    }
}

});

parcelRequire.register("5y7X0", function(module, exports) {

$parcel$export(module.exports, "default", () => $40a64b97d54b1be2$export$2e2bcd8739ae039);

var $7YnAn = parcelRequire("7YnAn");
var // Returns the first index on an array-like that passes a truth test.
$40a64b97d54b1be2$export$2e2bcd8739ae039 = $7YnAn.default(1);

});
parcelRequire.register("7YnAn", function(module, exports) {

$parcel$export(module.exports, "default", () => $5ce06ea7e34a4af5$export$2e2bcd8739ae039);

var $f5gHN = parcelRequire("f5gHN");

var $kGFoo = parcelRequire("kGFoo");
function $5ce06ea7e34a4af5$export$2e2bcd8739ae039(dir) {
    return function(array, predicate, context) {
        predicate = $f5gHN.default(predicate, context);
        var length = $kGFoo.default(array);
        var index = dir > 0 ? 0 : length - 1;
        for(; index >= 0 && index < length; index += dir){
            if (predicate(array[index], index, array)) return index;
        }
        return -1;
    };
}

});


parcelRequire.register("hw5rs", function(module, exports) {

$parcel$export(module.exports, "default", () => $cc09a575cb1393ee$export$2e2bcd8739ae039);

var $7YnAn = parcelRequire("7YnAn");
var // Returns the last index on an array-like that passes a truth test.
$cc09a575cb1393ee$export$2e2bcd8739ae039 = $7YnAn.default(-1);

});

parcelRequire.register("2DJLe", function(module, exports) {

$parcel$export(module.exports, "default", () => $1ec2b87383a719c6$export$2e2bcd8739ae039);

var $f5gHN = parcelRequire("f5gHN");

var $kGFoo = parcelRequire("kGFoo");
function $1ec2b87383a719c6$export$2e2bcd8739ae039(array, obj, iteratee, context) {
    iteratee = $f5gHN.default(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = $kGFoo.default(array);
    while(low < high){
        var mid = Math.floor((low + high) / 2);
        if (iteratee(array[mid]) < value) low = mid + 1;
        else high = mid;
    }
    return low;
}

});

parcelRequire.register("277r6", function(module, exports) {

$parcel$export(module.exports, "default", () => $18a200e5d946a276$export$2e2bcd8739ae039);

var $2DJLe = parcelRequire("2DJLe");

var $5y7X0 = parcelRequire("5y7X0");

var $igrDW = parcelRequire("igrDW");
var // Return the position of the first occurrence of an item in an array,
// or -1 if the item is not included in the array.
// If the array is large and already in sort order, pass `true`
// for **isSorted** to use binary search.
$18a200e5d946a276$export$2e2bcd8739ae039 = $igrDW.default(1, $5y7X0.default, $2DJLe.default);

});
parcelRequire.register("igrDW", function(module, exports) {

$parcel$export(module.exports, "default", () => $d4bf29fdf9211588$export$2e2bcd8739ae039);

var $kGFoo = parcelRequire("kGFoo");

var $9dO2A = parcelRequire("9dO2A");

var $lGDHN = parcelRequire("lGDHN");
function $d4bf29fdf9211588$export$2e2bcd8739ae039(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
        var i = 0, length = $kGFoo.default(array);
        if (typeof idx == 'number') {
            if (dir > 0) i = idx >= 0 ? idx : Math.max(idx + length, i);
            else length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        } else if (sortedIndex && idx && length) {
            idx = sortedIndex(array, item);
            return array[idx] === item ? idx : -1;
        }
        if (item !== item) {
            idx = predicateFind($9dO2A.slice.call(array, i, length), $lGDHN.default);
            return idx >= 0 ? idx + i : -1;
        }
        for(idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir){
            if (array[idx] === item) return idx;
        }
        return -1;
    };
}

});


parcelRequire.register("eeVf2", function(module, exports) {

$parcel$export(module.exports, "default", () => $a5dec6766ac7bec2$export$2e2bcd8739ae039);

var $hw5rs = parcelRequire("hw5rs");

var $igrDW = parcelRequire("igrDW");
var // Return the position of the last occurrence of an item in an array,
// or -1 if the item is not included in the array.
$a5dec6766ac7bec2$export$2e2bcd8739ae039 = $igrDW.default(-1, $hw5rs.default);

});

parcelRequire.register("kwVcS", function(module, exports) {

$parcel$export(module.exports, "default", () => $ef232bdc906a727f$export$2e2bcd8739ae039);

var $4bGzx = parcelRequire("4bGzx");

var $5y7X0 = parcelRequire("5y7X0");

var $4jK7I = parcelRequire("4jK7I");
function $ef232bdc906a727f$export$2e2bcd8739ae039(obj, predicate, context) {
    var keyFinder = $4bGzx.default(obj) ? $5y7X0.default : $4jK7I.default;
    var key = keyFinder(obj, predicate, context);
    if (key !== void 0 && key !== -1) return obj[key];
}

});

parcelRequire.register("dFfWJ", function(module, exports) {

$parcel$export(module.exports, "default", () => $9f2b79472e92ff74$export$2e2bcd8739ae039);

var $kwVcS = parcelRequire("kwVcS");

var $fJBs5 = parcelRequire("fJBs5");
function $9f2b79472e92ff74$export$2e2bcd8739ae039(obj, attrs) {
    return $kwVcS.default(obj, $fJBs5.default(attrs));
}

});

parcelRequire.register("i8zKf", function(module, exports) {

$parcel$export(module.exports, "default", () => $d344b38e2b17ddcf$export$2e2bcd8739ae039);

var $6emyW = parcelRequire("6emyW");

var $4bGzx = parcelRequire("4bGzx");

var $3C7Wx = parcelRequire("3C7Wx");
function $d344b38e2b17ddcf$export$2e2bcd8739ae039(obj, iteratee, context) {
    iteratee = $6emyW.default(iteratee, context);
    var i, length;
    if ($4bGzx.default(obj)) for(i = 0, length = obj.length; i < length; i++)iteratee(obj[i], i, obj);
    else {
        var _keys = $3C7Wx.default(obj);
        for(i = 0, length = _keys.length; i < length; i++)iteratee(obj[_keys[i]], _keys[i], obj);
    }
    return obj;
}

});

parcelRequire.register("i2eAT", function(module, exports) {

$parcel$export(module.exports, "default", () => $d213bbfa2d437c13$export$2e2bcd8739ae039);

var $f5gHN = parcelRequire("f5gHN");

var $4bGzx = parcelRequire("4bGzx");

var $3C7Wx = parcelRequire("3C7Wx");
function $d213bbfa2d437c13$export$2e2bcd8739ae039(obj, iteratee, context) {
    iteratee = $f5gHN.default(iteratee, context);
    var _keys = !$4bGzx.default(obj) && $3C7Wx.default(obj), length = (_keys || obj).length, results = Array(length);
    for(var index = 0; index < length; index++){
        var currentKey = _keys ? _keys[index] : index;
        results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
}

});

parcelRequire.register("jSFoK", function(module, exports) {

$parcel$export(module.exports, "default", () => $e7932c43046d1a1a$export$2e2bcd8739ae039);

var $jBuWN = parcelRequire("jBuWN");
var // **Reduce** builds up a single result from a list of values, aka `inject`,
// or `foldl`.
$e7932c43046d1a1a$export$2e2bcd8739ae039 = $jBuWN.default(1);

});
parcelRequire.register("jBuWN", function(module, exports) {

$parcel$export(module.exports, "default", () => $e4597a803306aa11$export$2e2bcd8739ae039);

var $4bGzx = parcelRequire("4bGzx");

var $3C7Wx = parcelRequire("3C7Wx");

var $6emyW = parcelRequire("6emyW");
function $e4597a803306aa11$export$2e2bcd8739ae039(dir) {
    // Wrap code that reassigns argument variables in a separate function than
    // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
    var reducer = function(obj, iteratee, memo, initial) {
        var _keys = !$4bGzx.default(obj) && $3C7Wx.default(obj), length = (_keys || obj).length, index = dir > 0 ? 0 : length - 1;
        if (!initial) {
            memo = obj[_keys ? _keys[index] : index];
            index += dir;
        }
        for(; index >= 0 && index < length; index += dir){
            var currentKey = _keys ? _keys[index] : index;
            memo = iteratee(memo, obj[currentKey], currentKey, obj);
        }
        return memo;
    };
    return function(obj, iteratee, memo, context) {
        var initial = arguments.length >= 3;
        return reducer(obj, $6emyW.default(iteratee, context, 4), memo, initial);
    };
}

});


parcelRequire.register("3vBke", function(module, exports) {

$parcel$export(module.exports, "default", () => $28e1385d52c45c8f$export$2e2bcd8739ae039);

var $jBuWN = parcelRequire("jBuWN");
var // The right-associative version of reduce, also known as `foldr`.
$28e1385d52c45c8f$export$2e2bcd8739ae039 = $jBuWN.default(-1);

});

parcelRequire.register("2OqkP", function(module, exports) {

$parcel$export(module.exports, "default", () => $20c4add74d8424fb$export$2e2bcd8739ae039);

var $f5gHN = parcelRequire("f5gHN");

var $i8zKf = parcelRequire("i8zKf");
function $20c4add74d8424fb$export$2e2bcd8739ae039(obj, predicate, context) {
    var results = [];
    predicate = $f5gHN.default(predicate, context);
    $i8zKf.default(obj, function(value, index, list) {
        if (predicate(value, index, list)) results.push(value);
    });
    return results;
}

});

parcelRequire.register("aTIy7", function(module, exports) {

$parcel$export(module.exports, "default", () => $7ef19903988ee2a2$export$2e2bcd8739ae039);

var $2OqkP = parcelRequire("2OqkP");

var $2ZQFv = parcelRequire("2ZQFv");

var $f5gHN = parcelRequire("f5gHN");
function $7ef19903988ee2a2$export$2e2bcd8739ae039(obj, predicate, context) {
    return $2OqkP.default(obj, $2ZQFv.default($f5gHN.default(predicate)), context);
}

});

parcelRequire.register("fp58Y", function(module, exports) {

$parcel$export(module.exports, "default", () => $b36d2e40c8244fe1$export$2e2bcd8739ae039);

var $f5gHN = parcelRequire("f5gHN");

var $4bGzx = parcelRequire("4bGzx");

var $3C7Wx = parcelRequire("3C7Wx");
function $b36d2e40c8244fe1$export$2e2bcd8739ae039(obj, predicate, context) {
    predicate = $f5gHN.default(predicate, context);
    var _keys = !$4bGzx.default(obj) && $3C7Wx.default(obj), length = (_keys || obj).length;
    for(var index = 0; index < length; index++){
        var currentKey = _keys ? _keys[index] : index;
        if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
}

});

parcelRequire.register("3jk7q", function(module, exports) {

$parcel$export(module.exports, "default", () => $2692c09d64b9438e$export$2e2bcd8739ae039);

var $f5gHN = parcelRequire("f5gHN");

var $4bGzx = parcelRequire("4bGzx");

var $3C7Wx = parcelRequire("3C7Wx");
function $2692c09d64b9438e$export$2e2bcd8739ae039(obj, predicate, context) {
    predicate = $f5gHN.default(predicate, context);
    var _keys = !$4bGzx.default(obj) && $3C7Wx.default(obj), length = (_keys || obj).length;
    for(var index = 0; index < length; index++){
        var currentKey = _keys ? _keys[index] : index;
        if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
}

});

parcelRequire.register("aaQGi", function(module, exports) {

$parcel$export(module.exports, "default", () => $7683b3f80c29ee70$export$2e2bcd8739ae039);

var $4bGzx = parcelRequire("4bGzx");

var $jl8SM = parcelRequire("jl8SM");

var $277r6 = parcelRequire("277r6");
function $7683b3f80c29ee70$export$2e2bcd8739ae039(obj, item, fromIndex, guard) {
    if (!$4bGzx.default(obj)) obj = $jl8SM.default(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return $277r6.default(obj, item, fromIndex) >= 0;
}

});

parcelRequire.register("9m9zi", function(module, exports) {

$parcel$export(module.exports, "default", () => $6cfd9730c785dce3$export$2e2bcd8739ae039);

var $6hviD = parcelRequire("6hviD");

var $gzjvQ = parcelRequire("gzjvQ");

var $i2eAT = parcelRequire("i2eAT");

var $8zJRR = parcelRequire("8zJRR");

var $2FNRT = parcelRequire("2FNRT");
var // Invoke a method (with arguments) on every item in a collection.
$6cfd9730c785dce3$export$2e2bcd8739ae039 = $6hviD.default(function(obj, path, args) {
    var contextPath, func;
    if ($gzjvQ.default(path)) func = path;
    else {
        path = $2FNRT.default(path);
        contextPath = path.slice(0, -1);
        path = path[path.length - 1];
    }
    return $i2eAT.default(obj, function(context) {
        var method = func;
        if (!method) {
            if (contextPath && contextPath.length) context = $8zJRR.default(context, contextPath);
            if (context == null) return void 0;
            method = context[path];
        }
        return method == null ? method : method.apply(context, args);
    });
});

});

parcelRequire.register("97nfa", function(module, exports) {

$parcel$export(module.exports, "default", () => $01b68fae5d8368ab$export$2e2bcd8739ae039);

var $i2eAT = parcelRequire("i2eAT");

var $65dt8 = parcelRequire("65dt8");
function $01b68fae5d8368ab$export$2e2bcd8739ae039(obj, key) {
    return $i2eAT.default(obj, $65dt8.default(key));
}

});

parcelRequire.register("4Vi1N", function(module, exports) {

$parcel$export(module.exports, "default", () => $395a7842b908b76b$export$2e2bcd8739ae039);

var $2OqkP = parcelRequire("2OqkP");

var $fJBs5 = parcelRequire("fJBs5");
function $395a7842b908b76b$export$2e2bcd8739ae039(obj, attrs) {
    return $2OqkP.default(obj, $fJBs5.default(attrs));
}

});

parcelRequire.register("kP9Ce", function(module, exports) {

$parcel$export(module.exports, "default", () => $f290078bd4e4a235$export$2e2bcd8739ae039);

var $4bGzx = parcelRequire("4bGzx");

var $jl8SM = parcelRequire("jl8SM");

var $f5gHN = parcelRequire("f5gHN");

var $i8zKf = parcelRequire("i8zKf");
function $f290078bd4e4a235$export$2e2bcd8739ae039(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity, value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
        obj = $4bGzx.default(obj) ? obj : $jl8SM.default(obj);
        for(var i = 0, length = obj.length; i < length; i++){
            value = obj[i];
            if (value != null && value > result) result = value;
        }
    } else {
        iteratee = $f5gHN.default(iteratee, context);
        $i8zKf.default(obj, function(v, index, list) {
            computed = iteratee(v, index, list);
            if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
                result = v;
                lastComputed = computed;
            }
        });
    }
    return result;
}

});

parcelRequire.register("iyGTK", function(module, exports) {

$parcel$export(module.exports, "default", () => $d82cadac8633e229$export$2e2bcd8739ae039);

var $4bGzx = parcelRequire("4bGzx");

var $jl8SM = parcelRequire("jl8SM");

var $f5gHN = parcelRequire("f5gHN");

var $i8zKf = parcelRequire("i8zKf");
function $d82cadac8633e229$export$2e2bcd8739ae039(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity, value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
        obj = $4bGzx.default(obj) ? obj : $jl8SM.default(obj);
        for(var i = 0, length = obj.length; i < length; i++){
            value = obj[i];
            if (value != null && value < result) result = value;
        }
    } else {
        iteratee = $f5gHN.default(iteratee, context);
        $i8zKf.default(obj, function(v, index, list) {
            computed = iteratee(v, index, list);
            if (computed < lastComputed || computed === Infinity && result === Infinity) {
                result = v;
                lastComputed = computed;
            }
        });
    }
    return result;
}

});

parcelRequire.register("5sFD1", function(module, exports) {

$parcel$export(module.exports, "default", () => $3f9fdbcd918d3802$export$2e2bcd8739ae039);

var $43EEo = parcelRequire("43EEo");
function $3f9fdbcd918d3802$export$2e2bcd8739ae039(obj) {
    return $43EEo.default(obj, Infinity);
}

});
parcelRequire.register("43EEo", function(module, exports) {

$parcel$export(module.exports, "default", () => $2f46f993413e4589$export$2e2bcd8739ae039);

var $4bGzx = parcelRequire("4bGzx");

var $7oKeL = parcelRequire("7oKeL");

var $jl8SM = parcelRequire("jl8SM");

var $kGFoo = parcelRequire("kGFoo");

var $iBZ1m = parcelRequire("iBZ1m");
function $2f46f993413e4589$export$2e2bcd8739ae039(obj, n, guard) {
    if (n == null || guard) {
        if (!$4bGzx.default(obj)) obj = $jl8SM.default(obj);
        return obj[$iBZ1m.default(obj.length - 1)];
    }
    var sample = $4bGzx.default(obj) ? $7oKeL.default(obj) : $jl8SM.default(obj);
    var length = $kGFoo.default(sample);
    n = Math.max(Math.min(n, length), 0);
    var last = length - 1;
    for(var index = 0; index < n; index++){
        var rand = $iBZ1m.default(index, last);
        var temp = sample[index];
        sample[index] = sample[rand];
        sample[rand] = temp;
    }
    return sample.slice(0, n);
}

});


parcelRequire.register("TjjEJ", function(module, exports) {

$parcel$export(module.exports, "default", () => $0a641eee405692d5$export$2e2bcd8739ae039);

var $f5gHN = parcelRequire("f5gHN");

var $97nfa = parcelRequire("97nfa");

var $i2eAT = parcelRequire("i2eAT");
function $0a641eee405692d5$export$2e2bcd8739ae039(obj, iteratee, context) {
    var index = 0;
    iteratee = $f5gHN.default(iteratee, context);
    return $97nfa.default($i2eAT.default(obj, function(value, key, list) {
        return {
            value: value,
            index: index++,
            criteria: iteratee(value, key, list)
        };
    }).sort(function(left, right) {
        var a = left.criteria;
        var b = right.criteria;
        if (a !== b) {
            if (a > b || a === void 0) return 1;
            if (a < b || b === void 0) return -1;
        }
        return left.index - right.index;
    }), 'value');
}

});

parcelRequire.register("hdMk2", function(module, exports) {

$parcel$export(module.exports, "default", () => $c8992253ab5ce427$export$2e2bcd8739ae039);

var $jdhwP = parcelRequire("jdhwP");

var $j2bC2 = parcelRequire("j2bC2");
var // Groups the object's values by a criterion. Pass either a string attribute
// to group by, or a function that returns the criterion.
$c8992253ab5ce427$export$2e2bcd8739ae039 = $jdhwP.default(function(result, value, key) {
    if ($j2bC2.default(result, key)) result[key].push(value);
    else result[key] = [
        value
    ];
});

});
parcelRequire.register("jdhwP", function(module, exports) {

$parcel$export(module.exports, "default", () => $dfccd3ff6f229325$export$2e2bcd8739ae039);

var $f5gHN = parcelRequire("f5gHN");

var $i8zKf = parcelRequire("i8zKf");
function $dfccd3ff6f229325$export$2e2bcd8739ae039(behavior, partition) {
    return function(obj, iteratee, context) {
        var result = partition ? [
            [],
            []
        ] : {
        };
        iteratee = $f5gHN.default(iteratee, context);
        $i8zKf.default(obj, function(value, index) {
            var key = iteratee(value, index, obj);
            behavior(result, value, key);
        });
        return result;
    };
}

});


parcelRequire.register("5ut6d", function(module, exports) {

$parcel$export(module.exports, "default", () => $3ff6539b6ef0d3e1$export$2e2bcd8739ae039);

var $jdhwP = parcelRequire("jdhwP");
var // Indexes the object's values by a criterion, similar to `_.groupBy`, but for
// when you know that your index values will be unique.
$3ff6539b6ef0d3e1$export$2e2bcd8739ae039 = $jdhwP.default(function(result, value, key) {
    result[key] = value;
});

});

parcelRequire.register("6ZwcZ", function(module, exports) {

$parcel$export(module.exports, "default", () => $51716c884877b641$export$2e2bcd8739ae039);

var $jdhwP = parcelRequire("jdhwP");

var $j2bC2 = parcelRequire("j2bC2");
var // Counts instances of an object that group by a certain criterion. Pass
// either a string attribute to count by, or a function that returns the
// criterion.
$51716c884877b641$export$2e2bcd8739ae039 = $jdhwP.default(function(result, value, key) {
    if ($j2bC2.default(result, key)) result[key]++;
    else result[key] = 1;
});

});

parcelRequire.register("fUCLb", function(module, exports) {

$parcel$export(module.exports, "default", () => $b95a26ec63bd9ffd$export$2e2bcd8739ae039);

var $jdhwP = parcelRequire("jdhwP");
var // Split a collection into two arrays: one whose elements all pass the given
// truth test, and one whose elements all do not pass the truth test.
$b95a26ec63bd9ffd$export$2e2bcd8739ae039 = $jdhwP.default(function(result, value, pass) {
    result[pass ? 0 : 1].push(value);
}, true);

});

parcelRequire.register("jdJ5H", function(module, exports) {

$parcel$export(module.exports, "default", () => $dfe23551818eba65$export$2e2bcd8739ae039);

var $9isuX = parcelRequire("9isuX");

var $9dO2A = parcelRequire("9dO2A");

var $9s5yQ = parcelRequire("9s5yQ");

var $4bGzx = parcelRequire("4bGzx");

var $i2eAT = parcelRequire("i2eAT");

var $ckYla = parcelRequire("ckYla");

var $jl8SM = parcelRequire("jl8SM");
// Safely create a real, live array from anything iterable.
var $dfe23551818eba65$var$reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
function $dfe23551818eba65$export$2e2bcd8739ae039(obj) {
    if (!obj) return [];
    if ($9isuX.default(obj)) return $9dO2A.slice.call(obj);
    if ($9s5yQ.default(obj)) // Keep surrogate pair characters together.
    return obj.match($dfe23551818eba65$var$reStrSymbol);
    if ($4bGzx.default(obj)) return $i2eAT.default(obj, $ckYla.default);
    return $jl8SM.default(obj);
}

});

parcelRequire.register("dtm9O", function(module, exports) {

$parcel$export(module.exports, "default", () => $9cef2bc0c631073f$export$2e2bcd8739ae039);

var $4bGzx = parcelRequire("4bGzx");

var $3C7Wx = parcelRequire("3C7Wx");
function $9cef2bc0c631073f$export$2e2bcd8739ae039(obj) {
    if (obj == null) return 0;
    return $4bGzx.default(obj) ? obj.length : $3C7Wx.default(obj).length;
}

});

parcelRequire.register("iYTRo", function(module, exports) {

$parcel$export(module.exports, "default", () => $dd1929439219807d$export$2e2bcd8739ae039);

var $6hviD = parcelRequire("6hviD");

var $gzjvQ = parcelRequire("gzjvQ");

var $6emyW = parcelRequire("6emyW");

var $cBY3u = parcelRequire("cBY3u");

var $iRvKW = parcelRequire("iRvKW");

var $leGk2 = parcelRequire("leGk2");
var // Return a copy of the object only containing the allowed properties.
$dd1929439219807d$export$2e2bcd8739ae039 = $6hviD.default(function(obj, keys) {
    var result = {
    }, iteratee = keys[0];
    if (obj == null) return result;
    if ($gzjvQ.default(iteratee)) {
        if (keys.length > 1) iteratee = $6emyW.default(iteratee, keys[1]);
        keys = $cBY3u.default(obj);
    } else {
        iteratee = $iRvKW.default;
        keys = $leGk2.default(keys, false, false);
        obj = Object(obj);
    }
    for(var i = 0, length = keys.length; i < length; i++){
        var key = keys[i];
        var value = obj[key];
        if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
});

});
parcelRequire.register("iRvKW", function(module, exports) {

$parcel$export(module.exports, "default", () => $dbb5cf56bc6c5162$export$2e2bcd8739ae039);
function $dbb5cf56bc6c5162$export$2e2bcd8739ae039(value, key, obj) {
    return key in obj;
}

});


parcelRequire.register("k2Srg", function(module, exports) {

$parcel$export(module.exports, "default", () => $e97e38f90d74fb83$export$2e2bcd8739ae039);

var $6hviD = parcelRequire("6hviD");

var $gzjvQ = parcelRequire("gzjvQ");

var $2ZQFv = parcelRequire("2ZQFv");

var $i2eAT = parcelRequire("i2eAT");

var $leGk2 = parcelRequire("leGk2");

var $aaQGi = parcelRequire("aaQGi");

var $iYTRo = parcelRequire("iYTRo");
var // Return a copy of the object without the disallowed properties.
$e97e38f90d74fb83$export$2e2bcd8739ae039 = $6hviD.default(function(obj, keys) {
    var iteratee = keys[0], context;
    if ($gzjvQ.default(iteratee)) {
        iteratee = $2ZQFv.default(iteratee);
        if (keys.length > 1) context = keys[1];
    } else {
        keys = $i2eAT.default($leGk2.default(keys, false, false), String);
        iteratee = function(value, key) {
            return !$aaQGi.default(keys, key);
        };
    }
    return $iYTRo.default(obj, iteratee, context);
});

});

parcelRequire.register("ituRu", function(module, exports) {

$parcel$export(module.exports, "default", () => $d732dfe76335d844$export$2e2bcd8739ae039);

var $2XW1r = parcelRequire("2XW1r");
function $d732dfe76335d844$export$2e2bcd8739ae039(array, n, guard) {
    if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
    if (n == null || guard) return array[0];
    return $2XW1r.default(array, array.length - n);
}

});
parcelRequire.register("2XW1r", function(module, exports) {

$parcel$export(module.exports, "default", () => $228e1979ed662a1b$export$2e2bcd8739ae039);

var $9dO2A = parcelRequire("9dO2A");
function $228e1979ed662a1b$export$2e2bcd8739ae039(array, n, guard) {
    return $9dO2A.slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
}

});


parcelRequire.register("dfBre", function(module, exports) {

$parcel$export(module.exports, "default", () => $9a59b783dc42df3f$export$2e2bcd8739ae039);

var $fsGLq = parcelRequire("fsGLq");
function $9a59b783dc42df3f$export$2e2bcd8739ae039(array, n, guard) {
    if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
    if (n == null || guard) return array[array.length - 1];
    return $fsGLq.default(array, Math.max(0, array.length - n));
}

});
parcelRequire.register("fsGLq", function(module, exports) {

$parcel$export(module.exports, "default", () => $b41aa492f584e0ea$export$2e2bcd8739ae039);

var $9dO2A = parcelRequire("9dO2A");
function $b41aa492f584e0ea$export$2e2bcd8739ae039(array, n, guard) {
    return $9dO2A.slice.call(array, n == null || guard ? 1 : n);
}

});


parcelRequire.register("ieBQ4", function(module, exports) {

$parcel$export(module.exports, "default", () => $d466e2d48c1c1555$export$2e2bcd8739ae039);

var $2OqkP = parcelRequire("2OqkP");
function $d466e2d48c1c1555$export$2e2bcd8739ae039(array) {
    return $2OqkP.default(array, Boolean);
}

});

parcelRequire.register("9SR8t", function(module, exports) {

$parcel$export(module.exports, "default", () => $73225fd9759cd8cb$export$2e2bcd8739ae039);

var $leGk2 = parcelRequire("leGk2");
function $73225fd9759cd8cb$export$2e2bcd8739ae039(array, depth) {
    return $leGk2.default(array, depth, false);
}

});

parcelRequire.register("a1Oko", function(module, exports) {

$parcel$export(module.exports, "default", () => $74d109787663cad1$export$2e2bcd8739ae039);

var $6hviD = parcelRequire("6hviD");

var $8YoDB = parcelRequire("8YoDB");
var // Return a version of the array that does not contain the specified value(s).
$74d109787663cad1$export$2e2bcd8739ae039 = $6hviD.default(function(array, otherArrays) {
    return $8YoDB.default(array, otherArrays);
});

});
parcelRequire.register("8YoDB", function(module, exports) {

$parcel$export(module.exports, "default", () => $688709dfb0f73059$export$2e2bcd8739ae039);

var $6hviD = parcelRequire("6hviD");

var $leGk2 = parcelRequire("leGk2");

var $2OqkP = parcelRequire("2OqkP");

var $aaQGi = parcelRequire("aaQGi");
var // Take the difference between one array and a number of other arrays.
// Only the elements present in just the first array will remain.
$688709dfb0f73059$export$2e2bcd8739ae039 = $6hviD.default(function(array, rest) {
    rest = $leGk2.default(rest, true, true);
    return $2OqkP.default(array, function(value) {
        return !$aaQGi.default(rest, value);
    });
});

});


parcelRequire.register("efmrf", function(module, exports) {

$parcel$export(module.exports, "default", () => $a5f3df3b75ca394a$export$2e2bcd8739ae039);

var $7u0f3 = parcelRequire("7u0f3");

var $f5gHN = parcelRequire("f5gHN");

var $kGFoo = parcelRequire("kGFoo");

var $aaQGi = parcelRequire("aaQGi");
function $a5f3df3b75ca394a$export$2e2bcd8739ae039(array, isSorted, iteratee, context) {
    if (!$7u0f3.default(isSorted)) {
        context = iteratee;
        iteratee = isSorted;
        isSorted = false;
    }
    if (iteratee != null) iteratee = $f5gHN.default(iteratee, context);
    var result = [];
    var seen = [];
    for(var i = 0, length = $kGFoo.default(array); i < length; i++){
        var value = array[i], computed = iteratee ? iteratee(value, i, array) : value;
        if (isSorted && !iteratee) {
            if (!i || seen !== computed) result.push(value);
            seen = computed;
        } else if (iteratee) {
            if (!$aaQGi.default(seen, computed)) {
                seen.push(computed);
                result.push(value);
            }
        } else if (!$aaQGi.default(result, value)) result.push(value);
    }
    return result;
}

});

parcelRequire.register("e6zxt", function(module, exports) {

$parcel$export(module.exports, "default", () => $a44d3187a6c696a1$export$2e2bcd8739ae039);

var $6hviD = parcelRequire("6hviD");

var $efmrf = parcelRequire("efmrf");

var $leGk2 = parcelRequire("leGk2");
var // Produce an array that contains the union: each distinct element from all of
// the passed-in arrays.
$a44d3187a6c696a1$export$2e2bcd8739ae039 = $6hviD.default(function(arrays) {
    return $efmrf.default($leGk2.default(arrays, true, true));
});

});

parcelRequire.register("ihbNM", function(module, exports) {

$parcel$export(module.exports, "default", () => $d4e2f82429a81678$export$2e2bcd8739ae039);

var $kGFoo = parcelRequire("kGFoo");

var $aaQGi = parcelRequire("aaQGi");
function $d4e2f82429a81678$export$2e2bcd8739ae039(array) {
    var result = [];
    var argsLength = arguments.length;
    for(var i = 0, length = $kGFoo.default(array); i < length; i++){
        var item = array[i];
        if ($aaQGi.default(result, item)) continue;
        var j;
        for(j = 1; j < argsLength; j++){
            if (!$aaQGi.default(arguments[j], item)) break;
        }
        if (j === argsLength) result.push(item);
    }
    return result;
}

});

parcelRequire.register("4sMLU", function(module, exports) {

$parcel$export(module.exports, "default", () => $33ff9c042508d9fd$export$2e2bcd8739ae039);

var $kP9Ce = parcelRequire("kP9Ce");

var $kGFoo = parcelRequire("kGFoo");

var $97nfa = parcelRequire("97nfa");
function $33ff9c042508d9fd$export$2e2bcd8739ae039(array) {
    var length = array && $kP9Ce.default(array, $kGFoo.default).length || 0;
    var result = Array(length);
    for(var index = 0; index < length; index++)result[index] = $97nfa.default(array, index);
    return result;
}

});

parcelRequire.register("lDgjS", function(module, exports) {

$parcel$export(module.exports, "default", () => $fbf9e633784fbb45$export$2e2bcd8739ae039);

var $6hviD = parcelRequire("6hviD");

var $4sMLU = parcelRequire("4sMLU");
var // Zip together multiple lists into a single array -- elements that share
// an index go together.
$fbf9e633784fbb45$export$2e2bcd8739ae039 = $6hviD.default($4sMLU.default);

});

parcelRequire.register("5EHE3", function(module, exports) {

$parcel$export(module.exports, "default", () => $41e28b2a997fdcdf$export$2e2bcd8739ae039);

var $kGFoo = parcelRequire("kGFoo");
function $41e28b2a997fdcdf$export$2e2bcd8739ae039(list, values) {
    var result = {
    };
    for(var i = 0, length = $kGFoo.default(list); i < length; i++)if (values) result[list[i]] = values[i];
    else result[list[i][0]] = list[i][1];
    return result;
}

});

parcelRequire.register("6kH7B", function(module, exports) {

$parcel$export(module.exports, "default", () => $49c60f6658cc4930$export$2e2bcd8739ae039);
function $49c60f6658cc4930$export$2e2bcd8739ae039(start, stop, step) {
    if (stop == null) {
        stop = start || 0;
        start = 0;
    }
    if (!step) step = stop < start ? -1 : 1;
    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);
    for(var idx = 0; idx < length; idx++, start += step)range[idx] = start;
    return range;
}

});

parcelRequire.register("6QkRy", function(module, exports) {

$parcel$export(module.exports, "default", () => $4fb7c84b2c02e531$export$2e2bcd8739ae039);

var $9dO2A = parcelRequire("9dO2A");
function $4fb7c84b2c02e531$export$2e2bcd8739ae039(array, count) {
    if (count == null || count < 1) return [];
    var result = [];
    var i = 0, length = array.length;
    while(i < length)result.push($9dO2A.slice.call(array, i, i += count));
    return result;
}

});

parcelRequire.register("bG3Ar", function(module, exports) {

$parcel$export(module.exports, "default", () => $88066639f129ec5c$export$2e2bcd8739ae039);

var $lwlxm = parcelRequire("lwlxm");

var $i8zKf = parcelRequire("i8zKf");

var $apdmN = parcelRequire("apdmN");

var $9dO2A = parcelRequire("9dO2A");

var $j64m5 = parcelRequire("j64m5");
function $88066639f129ec5c$export$2e2bcd8739ae039(obj) {
    $i8zKf.default($apdmN.default(obj), function(name) {
        var func = $lwlxm.default[name] = obj[name];
        $lwlxm.default.prototype[name] = function() {
            var args = [
                this._wrapped
            ];
            $9dO2A.push.apply(args, arguments);
            return $j64m5.default(this, func.apply($lwlxm.default, args));
        };
    });
    return $lwlxm.default;
}

});
parcelRequire.register("j64m5", function(module, exports) {

$parcel$export(module.exports, "default", () => $de71f4b69d0ab2b6$export$2e2bcd8739ae039);

var $lwlxm = parcelRequire("lwlxm");
function $de71f4b69d0ab2b6$export$2e2bcd8739ae039(instance, obj) {
    return instance._chain ? $lwlxm.default(obj).chain() : obj;
}

});


parcelRequire.register("9jUaK", function(module, exports) {

$parcel$export(module.exports, "default", () => $6c91760bafc3318a$export$2e2bcd8739ae039);

var $lwlxm = parcelRequire("lwlxm");

var $i8zKf = parcelRequire("i8zKf");

var $9dO2A = parcelRequire("9dO2A");

var $j64m5 = parcelRequire("j64m5");
// Add all mutator `Array` functions to the wrapper.
$i8zKf.default([
    'pop',
    'push',
    'reverse',
    'shift',
    'sort',
    'splice',
    'unshift'
], function(name) {
    var method = $9dO2A.ArrayProto[name];
    $lwlxm.default.prototype[name] = function() {
        var obj = this._wrapped;
        if (obj != null) {
            method.apply(obj, arguments);
            if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
        }
        return $j64m5.default(this, obj);
    };
});
// Add all accessor `Array` functions to the wrapper.
$i8zKf.default([
    'concat',
    'join',
    'slice'
], function(name) {
    var method = $9dO2A.ArrayProto[name];
    $lwlxm.default.prototype[name] = function() {
        var obj = this._wrapped;
        if (obj != null) obj = method.apply(obj, arguments);
        return $j64m5.default(this, obj);
    };
});
var $6c91760bafc3318a$export$2e2bcd8739ae039 = $lwlxm.default;

});




parcelRequire.register("ihZc5", function(module, exports) {

$parcel$defineInteropFlag(module.exports);

$parcel$export(module.exports, "default", () => $d5094862ea25e849$export$2e2bcd8739ae039);
function $d5094862ea25e849$export$2e2bcd8739ae039(path) {
    const isExtendedLengthPath = /^\\\\\?\\/.test(path);
    const hasNonAscii = /[^\u0000-\u0080]+/.test(path); // eslint-disable-line no-control-regex
    if (isExtendedLengthPath || hasNonAscii) return path;
    return path.replace(/\\/g, '/');
}

});

parcelRequire.register("bAmIK", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.default = void 0;


var $86f4ae5dea82edbc$var$_minimatch = $86f4ae5dea82edbc$var$_interopRequireDefault((parcelRequire("26OyA")));



var $dLNl0 = parcelRequire("dLNl0");

var $ggBRY = parcelRequire("ggBRY");

var $86f4ae5dea82edbc$var$_fastGlob = $86f4ae5dea82edbc$var$_interopRequireDefault((parcelRequire("IkqER")));

var $86f4ae5dea82edbc$var$chokidar = $86f4ae5dea82edbc$var$_interopRequireWildcard((parcelRequire("57kbZ")));
function $86f4ae5dea82edbc$var$_getRequireWildcardCache(nodeInterop1) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return ($86f4ae5dea82edbc$var$_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop1);
}
function $86f4ae5dea82edbc$var$_interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) return obj;
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") return {
        default: obj
    };
    var cache = $86f4ae5dea82edbc$var$_getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) return cache.get(obj);
    var newObj = {
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj)if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
        if (desc && (desc.get || desc.set)) Object.defineProperty(newObj, key, desc);
        else newObj[key] = obj[key];
    }
    newObj.default = obj;
    if (cache) cache.set(obj, newObj);
    return newObj;
}
function $86f4ae5dea82edbc$var$_interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
class $86f4ae5dea82edbc$var$PathsCache extends $igPDg$events.EventEmitter {
    updateConfig() {
        this.config = {
            excludeVcsIgnoredPaths: atom.config.get("core.excludeVcsIgnoredPaths"),
            ignoreSubmodules: atom.config.get("autocomplete-paths.ignoreSubmodules"),
            shouldIgnoredNames: atom.config.get("autocomplete-paths.ignoredNames"),
            ignoredNames: atom.config.get("core.ignoredNames"),
            ignoredPatterns: atom.config.get("autocomplete-paths.ignoredPatterns"),
            maxFileCount: atom.config.get("autocomplete-paths.maxFileCount")
        };
    }
    /**
   * Rebuilds the paths cache
   *
   * @returns {Promise<string[][]>}
   */ async rebuildCache() {
        this.dispose();
        this._cancelled = false;
        this.emit("rebuild-cache");
        await this._cacheProjectPathsAndRepositories();
        const results = await this._cachePaths();
        await this._addWatchers();
        this.emit("rebuild-cache-done");
        return results;
    }
    /**
   * Returns the file paths for the given project directory with the given (optional) relative path
   *
   * @param {Directory} projectDirectory
   * @param {string | null} [relativeToPath=null] Default is `null`
   * @returns {string[]}
   */ getFilePathsForProjectDirectory(projectDirectory1, relativeToPath = null) {
        const filePaths = this._filePathsByProjectDirectory.get(projectDirectory1.path) || [];
        if (relativeToPath) return filePaths.filter((filePath)=>filePath.indexOf(relativeToPath) === 0
        );
        return filePaths;
    }
    /**
   * Disposes this PathsCache
   *
   * @param {boolean} isPackageDispose
   */ dispose(isPackageDispose) {
        this._fileWatchersByDirectory.forEach(async (watcher)=>{
            await watcher.close();
        });
        this._fileWatchersByDirectory.clear();
        this._filePathsByProjectDirectory.clear();
        this._filePathsByDirectory.clear();
        this._repositories = [];
        if (this._projectWatcher) {
            this._projectWatcher.dispose();
            this._projectWatcher = null;
        }
        if (isPackageDispose && this._projectChangeWatcher) {
            this._projectChangeWatcher.dispose();
            this._projectChangeWatcher = null;
        }
    }
    /**
   * Checks if the given path is ignored
   *
   * @private
   * @param {string} path
   * @returns {boolean}
   */ _isPathIgnored(path1) {
        if (this.config.excludeVcsIgnoredPaths && this._repositories.some((repository)=>{
            return repository.isPathIgnored(path1);
        })) return true;
        if (this.config.ignoreSubmodules && this._repositories.some((repository)=>{
            return repository.isSubmodule(path1);
        })) return true;
        if (this.config.shouldIgnoredNames && this.config.ignoredNames.some((ignoredName)=>{
            return (0, $86f4ae5dea82edbc$var$_minimatch.default)(path1, ignoredName, {
                matchBase: true,
                dot: true
            });
        })) return true;
        if (this.config.ignoredPatterns && this.config.ignoredPatterns.some((ignoredPattern)=>{
            return (0, $86f4ae5dea82edbc$var$_minimatch.default)(path1, ignoredPattern, {
                dot: true
            });
        })) return true;
        return false;
    }
    /**
   * Caches the project paths and repositories
   *
   * @private
   */ async _cacheProjectPathsAndRepositories() {
        this._projectDirectories = atom.project.getDirectories(); // get the repositories asynchronously
        const projectNum = this._projectDirectories.length;
        const repositoriesP = new Array(projectNum);
        for(let i = 0; i < projectNum; i++)repositoriesP[i] = atom.project.repositoryForDirectory(this._projectDirectories[i]);
        const repositories = await Promise.all(repositoriesP);
        this._repositories = repositories.filter((r)=>r !== null
        ); // filter out non-repository directories
    }
    /**
   * Add watchers for all the projectDirectories
   *
   * @private
   * @returns {Promise<void>}
   */ async _addWatchers() {
        await Promise.all(this._projectDirectories.map((projectDirectory)=>this._addWatcherForDirectory(projectDirectory)
        ));
    }
    /**
   * Add a watcher for the projectDirectory
   *
   * @private
   * @param {Directory} projectDirectory
   */ async _addWatcherForDirectory(projectDirectory7) {
        // close if already added
        let watcher = this._fileWatchersByDirectory.get(projectDirectory7);
        if (watcher !== undefined && typeof watcher.close === "function") await watcher.close();
         // add a watcher to run `this._onDirectoryChanged`
        const projectPath = projectDirectory7.getPath();
        if (this._filePathsByProjectDirectory.get(projectPath).length >= this.config.maxFileCount) {
            console.warn($dLNl0.dedent`autocomplete-paths: Maximum file count of ${this.config.maxFileCount} has been exceeded,
        so the subequent changes in the project are not tracked.
        See these link to learn more:
        https://github.com/atom-community/autocomplete-paths/wiki/Troubleshooting#maximum-file-limit-exceeded
        https://github.com/atom-community/autocomplete-paths/issues/270
      `);
            return;
        }
        const ignored = this._allIgnoredGlobByDirectory.get(projectDirectory7.path); // TODO smarter handling of directory changes
        // TODO get paths from the watcher itself
        // TODO track gitignore file
        watcher = $86f4ae5dea82edbc$var$chokidar.watch([
            projectPath,
            ...ignored
        ], {
            persistent: true,
            ignoreInitial: true,
            // do not run the listeners on the initial scan
            followSymlinks: false,
            interval: 1000,
            binaryInterval: 1000
        }).on("add", (addedFile)=>{
            // we should track it too!
            // if (basename(addedFile) === ".gitignore") {
            //   // if a gitignore file is added re-process the folder
            //   this.onRemoveDir(projectDirectory, removedDir)
            //   this.onAddDir(projectDirectory, removedDir)
            //   return
            // }
            this.onAddFile(projectDirectory7, addedFile);
        }).on("unlink", (removedFile)=>{
            this.onRemoveFile(projectDirectory7, removedFile);
        }).on("addDir", (addedDir)=>{
            this.onAddDir(addedDir);
        }).on("unlinkDir", (removedDir)=>{
            this.onRemoveDir(projectDirectory7, removedDir);
        });
        this._fileWatchersByDirectory.set(projectDirectory7, watcher);
    }
    /**
   * @param projectDirectory {Directory}
   * @param addedFile {string}
   */ onAddFile(projectDirectory2, addedFile) {
        const filePaths = this._filePathsByProjectDirectory.get(projectDirectory2.path);
        filePaths.push(addedFile);
        this._filePathsByProjectDirectory.set(projectDirectory2.path, filePaths);
    }
    /**
   * @param projectDirectory {Directory}
   * @param removedFile {string}
   */ onRemoveFile(projectDirectory3, removedFile) {
        /** @type {string[]} */ const filePaths = this._filePathsByProjectDirectory.get(projectDirectory3.path); // delete the removed file
        const fileIndex = filePaths.indexOf(removedFile);
        delete filePaths[fileIndex];
        this._filePathsByProjectDirectory.set(projectDirectory3.path, filePaths);
    }
    /** @param addedDir {string} */ async onAddDir(addedDir) {
        await this._cachePathsForDirectoryWithGlob(addedDir);
    }
    /**
   * @param projectDirectory {Directory}
   * @param removedDir {string}
   */ onRemoveDir(projectDirectory4, removedDir) {
        const directory = new $igPDg$atom.Directory(removedDir);
        this._removeFilePathsForDirectory(projectDirectory4, directory);
    }
    /**
   * Invoked when the content of the given `directory` has changed
   *
   * @private
   * @param {Directory} projectDirectory
   * @param {Directory} directory
   * @returns {Promise<void>}
   */ async _onDirectoryChanged(projectDirectory5, directory) {
        this.emit("rebuild-cache");
        this._removeFilePathsForDirectory(projectDirectory5, directory);
        this._cleanWatchersForDirectory(directory);
        await this._cachePathsForDirectory(projectDirectory5, directory);
        this.emit("rebuild-cache-done");
    }
    /**
   * Removes all watchers inside the given directory
   *
   * @private
   * @param {Directory} directory
   */ _cleanWatchersForDirectory(directory1) {
        // TODO promise all
        this._fileWatchersByDirectory.forEach(async (watcher, otherDirectory)=>{
            if (directory1.contains(otherDirectory.path)) {
                await await watcher.close();
                this._fileWatchersByDirectory.delete(otherDirectory);
            }
        });
    }
    /**
   * Removes all cached file paths in the given directory
   *
   * @private
   * @param {Directory} projectDirectory
   * @param {Directory} directory
   */ _removeFilePathsForDirectory(projectDirectory6, directory2) {
        let filePaths = this._filePathsByProjectDirectory.get(projectDirectory6.path);
        if (!filePaths) return;
        filePaths = filePaths.filter((path)=>!directory2.contains(path)
        );
        this._filePathsByProjectDirectory.set(projectDirectory6.path, filePaths);
        this._filePathsByDirectory.delete(directory2.path);
    }
    _onDidChangeFiles(events) {
        events.filter((event)=>event.action !== "modified"
        ).forEach((event)=>{
            if (!this._projectDirectories) return;
            const { action: action , path: path , oldPath: oldPath  } = event;
            const projectDirectory = this._projectDirectories.find((pd)=>path.indexOf(pd.path) === 0
            );
            if (!projectDirectory) return;
            const directoryPath = projectDirectory.path;
            const ignored = this._isPathIgnored(path);
            if (ignored) return;
            const files = this._filePathsByProjectDirectory.get(directoryPath) || [];
            switch(action){
                case "created":
                    files.push(path);
                    break;
                case "deleted":
                    {
                        const i = files.indexOf(path);
                        if (i > -1) files.splice(i, 1);
                        break;
                    }
                case "renamed":
                    {
                        const j = files.indexOf(oldPath);
                        if (j > -1) files[j] = path;
                        break;
                    }
                default:
                    console.error(`unkown _onDidChangeFiles action: ${action}`);
                    break;
            }
            if (!this._filePathsByProjectDirectory.has(directoryPath)) this._filePathsByProjectDirectory.set(directoryPath, files);
        });
    }
    /**
   * Caches file paths with Glob or Atom
   *
   * @private
   * @returns {Promise<((string)[])[]}
   */ _cachePaths() {
        try {
            return this._cachePathsWithGlob();
        } catch (e) {
            console.error(e);
            return this._cachePathsWithAtom();
        }
    }
    /**
   * Caches file paths for the given directory with Glob or Atom
   *
   * @private
   * @param {Directory} projectDirectory
   * @param {Directory} directory
   * @returns {Promise}
   */ _cachePathsForDirectory(projectDirectory8, directory3) {
        try {
            return this._cachePathsForDirectoryWithGlob(directory3.path);
        } catch (e) {
            // fallback to Atom
            console.error(e);
            return this._cachePathsForDirectoryWithAtom(projectDirectory8, directory3);
        }
    }
    /*
   ██████  ██       ██████  ██████
  ██       ██      ██    ██ ██   ██
  ██   ███ ██      ██    ██ ██████
  ██    ██ ██      ██    ██ ██   ██
   ██████  ███████  ██████  ██████
  */ /**
   * Builds the file cache with `glob`
   *
   * @private
   * @returns {Promise<string[][]>}
   */ async _cachePathsWithGlob() {
        const result = await Promise.all(this._projectDirectories.map((projectDirectory)=>this._cachePathsForDirectoryWithGlob(projectDirectory.path)
        ));
        return result;
    }
    /**
   * Returns a list of ignore patterns for a directory
   *
   * @private
   * @param {string} directoryPath
   * @returns {Promise<string[]>} An array of glob patterns
   */ async _getIgnoredPatternsGlob(directoryPath3) {
        const patterns = [];
        if (this.config.shouldIgnoredNames) patterns.push(...this.config.ignoredNames);
        if (this.config.ignoredPatterns) patterns.push(...this.config.ignoredPatterns);
        const patternsNum = patterns.length;
        const globEntries = new Array(patternsNum);
        for(let iEntry = 0; iEntry < patternsNum; iEntry++){
            // eslint-disable-next-line no-await-in-loop
            const globifyOutput = await (0, $ggBRY.globifyPath)(patterns[iEntry], directoryPath3); // Check if `globifyPath` returns a pair or a string
            if (typeof globifyOutput === "string") // string
            globEntries[iEntry] = globifyOutput; // Place the entry in the output array
            else {
                // pair
                globEntries[iEntry] = globifyOutput[0]; // Place the entry in the output array
                globEntries.push(globifyOutput[1]); // Push the additional entry
            }
        }
        return globEntries;
    }
    /**
   * Returns the glob pattern of all gitignore files in a directory
   *
   * @private
   * @param {string} rootDirectory
   * @param {string[]} ignoredPatternsGlob
   * @returns {Promise<string[]>} An array of glob patterns
   */ async _getAllGitIgnoreGlob(rootDirectory, ignoredPatternsGlob) {
        if (this.config.excludeVcsIgnoredPaths) {
            // get gitignore files
            const gitignoreFiles = await (0, $86f4ae5dea82edbc$var$_fastGlob.default)([
                "**/.gitignore",
                ...ignoredPatternsGlob
            ], {
                dot: true,
                cwd: rootDirectory,
                onlyFiles: true,
                absolute: true
            });
            return (await Promise.all(gitignoreFiles.map((gitignoreFile)=>$86f4ae5dea82edbc$var$_getDirectoryGitIgnoreGlob((0, $igPDg$path.dirname)(gitignoreFile))
            ))).flat();
        }
        return [];
    }
    /**
   * Get all ignored glob using `this._getGitIgnoreGlob` and `this._getIgnoredPatternsGlob`
   *
   * @param {string} directoryPath The given directory path
   * @returns {Promise<string[]>}
   */ async _getAllIgnoredGlob(directoryPath1) {
        const ignoredPatternsGlob = await this._getIgnoredPatternsGlob(directoryPath1);
        const gitignoreGlob = await this._getAllGitIgnoreGlob(directoryPath1, ignoredPatternsGlob);
        return [
            ...gitignoreGlob,
            ...ignoredPatternsGlob
        ];
    }
    /**
   * Populates cache for the given directory
   *
   * @private
   * @param {string} directoryPath The given directory path
   * @returns {Promise<string[]>}
   */ async _cachePathsForDirectoryWithGlob(directoryPath2) {
        const directoryGlob = (0, $ggBRY.globifyDirectory)(directoryPath2);
        const allIgnoredGlob = await this._getAllIgnoredGlob(directoryPath2);
        this._allIgnoredGlobByDirectory.set(directoryPath2, allIgnoredGlob);
        const files = await (0, $86f4ae5dea82edbc$var$_fastGlob.default)([
            directoryGlob,
            ...allIgnoredGlob
        ], {
            dot: true,
            cwd: directoryPath2,
            onlyFiles: true
        });
        this._filePathsByProjectDirectory.set(directoryPath2, files);
        return files;
    }
    /*
  ███████  █████  ██      ██      ██████   █████   ██████ ██   ██
  ██      ██   ██ ██      ██      ██   ██ ██   ██ ██      ██  ██
  █████   ███████ ██      ██      ██████  ███████ ██      █████
  ██      ██   ██ ██      ██      ██   ██ ██   ██ ██      ██  ██
  ██      ██   ██ ███████ ███████ ██████  ██   ██  ██████ ██   ██
  */ /**
   * Builds the file cache using Atom
   *
   * @private
   * @returns {Promise<string[][]>}
   */ async _cachePathsWithAtom() {
        const result = await Promise.all(this._projectDirectories.map((projectDirectory)=>{
            return this._cachePathsForDirectoryWithAtom(projectDirectory, projectDirectory);
        }));
        return result;
    }
    /**
   * Caches file paths for the given directory with Atom
   *
   * @private
   * @param {Directory} projectDirectory
   * @param {Directory} directory
   * @returns {Promise<string[]>}
   */ async _cachePathsForDirectoryWithAtom(projectDirectory, directory4) {
        if (this._cancelled) return [];
        const entries = await this._getDirectoryEntries(directory4);
        if (this._cancelled) return [];
         // Filter: Files and Directories that are not ignored
        const filePaths = [];
        const directories = [];
        for(let i = 0, len = entries.length; i < len; i++){
            const entry = entries[i];
            if (entry instanceof $igPDg$atom.File && !this._isPathIgnored(entry.path)) filePaths.push(entry.path);
            else if (entry instanceof $igPDg$atom.Directory && !this._isPathIgnored(entry.path)) directories.push(entry);
        } // Merge file paths into existing array (which contains *all* file paths)
        let filePathsArray = this._filePathsByProjectDirectory.get(projectDirectory.path) || [];
        const newPathsCount = filePathsArray.length + filePaths.length;
        if (newPathsCount > this.config.maxFileCount && !this._cancelled) {
            atom.notifications.addError("autocomplete-paths", {
                description: `Maximum file count of ${this.config.maxFileCount} has been exceeded. Path autocompletion will not work in this project.<br /><br /><a href="https://github.com/atom-community/autocomplete-paths/wiki/Troubleshooting#maximum-file-limit-exceeded">Click here to learn more.</a>`,
                dismissable: true
            });
            this._filePathsByProjectDirectory.clear();
            this._filePathsByDirectory.clear();
            this._cancelled = true;
            return;
        }
        this._filePathsByProjectDirectory.set(projectDirectory.path, (0, $dLNl0.union)(filePathsArray, filePaths)); // Merge file paths into existing array (which contains file paths for a specific directory)
        filePathsArray = this._filePathsByDirectory.get(directory4.path) || [];
        this._filePathsByDirectory.set(directory4.path, (0, $dLNl0.union)(filePathsArray, filePaths));
        return Promise.all(directories.map((dir)=>this._cachePathsForDirectoryWithAtom(projectDirectory, dir)
        ));
    }
    constructor(){
        super();
        const rebuildCacheBound = this.rebuildCache.bind(this);
        this._projectChangeWatcher = atom.project.onDidChangePaths(rebuildCacheBound);
        const _onDidChangeFilesBound = this._onDidChangeFiles.bind(this);
        this._projectWatcher = atom.project.onDidChangeFiles(_onDidChangeFilesBound);
        this._repositories = []; // TODO remove _filePathsByProjectDirectory and only use _filePathsByDirectory
        this._filePathsByProjectDirectory = new Map();
        this._filePathsByDirectory = new Map();
        this._fileWatchersByDirectory = new Map();
        this._allIgnoredGlobByDirectory = new Map();
        this.updateConfig();
    }
}
/**
 * Returns the glob pattern of a gitignore of a directory
 *
 * @private
 * @param {string} directoryPath
 * @returns {Promise<string[]>} An array of glob patterns
 */ module.exports.default = $86f4ae5dea82edbc$var$PathsCache;
function $86f4ae5dea82edbc$var$_getDirectoryGitIgnoreGlob(directoryPath) {
    try {
        return (0, $ggBRY.globifyGitIgnoreFile)(directoryPath);
    } catch (err) {
        // .gitignore does not exist for this directory, ignoring
        return [];
    }
}
module.exports = module.exports.default;

});
parcelRequire.register("26OyA", function(module, exports) {
module.exports = $18935bd581441675$var$minimatch;
$18935bd581441675$var$minimatch.Minimatch = $18935bd581441675$var$Minimatch;
var $18935bd581441675$var$path = {
    sep: '/'
};

try {
    $18935bd581441675$var$path = $18935bd581441675$import$bb654e07daaf8c3a;
} catch (er) {
}
var $18935bd581441675$var$GLOBSTAR = $18935bd581441675$var$minimatch.GLOBSTAR = $18935bd581441675$var$Minimatch.GLOBSTAR = {
};

var $geXdj = parcelRequire("geXdj");
var $18935bd581441675$var$plTypes = {
    '!': {
        open: '(?:(?!(?:',
        close: '))[^/]*?)'
    },
    '?': {
        open: '(?:',
        close: ')?'
    },
    '+': {
        open: '(?:',
        close: ')+'
    },
    '*': {
        open: '(?:',
        close: ')*'
    },
    '@': {
        open: '(?:',
        close: ')'
    }
};
// any single thing other than /
// don't need to escape / when using new RegExp()
var $18935bd581441675$var$qmark = '[^/]';
// * => any number of characters
var $18935bd581441675$var$star = $18935bd581441675$var$qmark + '*?';
// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
var $18935bd581441675$var$twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?';
// not a ^ or / followed by a dot,
// followed by anything, any number of times.
var $18935bd581441675$var$twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?';
// characters that need to be escaped in RegExp.
var $18935bd581441675$var$reSpecials = $18935bd581441675$var$charSet('().*{}+?[]^$\\!');
// "abc" -> { a:true, b:true, c:true }
function $18935bd581441675$var$charSet(s) {
    return s.split('').reduce(function(set, c) {
        set[c] = true;
        return set;
    }, {
    });
}
// normalizes slashes.
var $18935bd581441675$var$slashSplit = /\/+/;
$18935bd581441675$var$minimatch.filter = $18935bd581441675$var$filter;
function $18935bd581441675$var$filter(pattern, options) {
    options = options || {
    };
    return function(p, i, list) {
        return $18935bd581441675$var$minimatch(p, pattern, options);
    };
}
function $18935bd581441675$var$ext(a, b) {
    a = a || {
    };
    b = b || {
    };
    var t = {
    };
    Object.keys(b).forEach(function(k) {
        t[k] = b[k];
    });
    Object.keys(a).forEach(function(k) {
        t[k] = a[k];
    });
    return t;
}
$18935bd581441675$var$minimatch.defaults = function(def) {
    if (!def || !Object.keys(def).length) return $18935bd581441675$var$minimatch;
    var orig = $18935bd581441675$var$minimatch;
    var m = function minimatch(p, pattern, options) {
        return orig.minimatch(p, pattern, $18935bd581441675$var$ext(def, options));
    };
    m.Minimatch = function Minimatch(pattern, options) {
        return new orig.Minimatch(pattern, $18935bd581441675$var$ext(def, options));
    };
    return m;
};
$18935bd581441675$var$Minimatch.defaults = function(def) {
    if (!def || !Object.keys(def).length) return $18935bd581441675$var$Minimatch;
    return $18935bd581441675$var$minimatch.defaults(def).Minimatch;
};
function $18935bd581441675$var$minimatch(p, pattern, options) {
    if (typeof pattern !== 'string') throw new TypeError('glob pattern string required');
    if (!options) options = {
    };
    // shortcut: comments match nothing.
    if (!options.nocomment && pattern.charAt(0) === '#') return false;
    // "" only matches ""
    if (pattern.trim() === '') return p === '';
    return new $18935bd581441675$var$Minimatch(pattern, options).match(p);
}
function $18935bd581441675$var$Minimatch(pattern, options) {
    if (!(this instanceof $18935bd581441675$var$Minimatch)) return new $18935bd581441675$var$Minimatch(pattern, options);
    if (typeof pattern !== 'string') throw new TypeError('glob pattern string required');
    if (!options) options = {
    };
    pattern = pattern.trim();
    // windows support: need to use /, not \
    if ($18935bd581441675$var$path.sep !== '/') pattern = pattern.split($18935bd581441675$var$path.sep).join('/');
    this.options = options;
    this.set = [];
    this.pattern = pattern;
    this.regexp = null;
    this.negate = false;
    this.comment = false;
    this.empty = false;
    // make the set of regexps etc.
    this.make();
}
$18935bd581441675$var$Minimatch.prototype.debug = function() {
};
$18935bd581441675$var$Minimatch.prototype.make = $18935bd581441675$var$make;
function $18935bd581441675$var$make() {
    // don't do it more than once.
    if (this._made) return;
    var pattern = this.pattern;
    var options = this.options;
    // empty patterns and comments match nothing.
    if (!options.nocomment && pattern.charAt(0) === '#') {
        this.comment = true;
        return;
    }
    if (!pattern) {
        this.empty = true;
        return;
    }
    // step 1: figure out negation, etc.
    this.parseNegate();
    // step 2: expand braces
    var set = this.globSet = this.braceExpand();
    if (options.debug) this.debug = console.error;
    this.debug(this.pattern, set);
    // step 3: now we have a set, so turn each one into a series of path-portion
    // matching patterns.
    // These will be regexps, except in the case of "**", which is
    // set to the GLOBSTAR object for globstar behavior,
    // and will not contain any / characters
    set = this.globParts = set.map(function(s) {
        return s.split($18935bd581441675$var$slashSplit);
    });
    this.debug(this.pattern, set);
    // glob --> regexps
    set = set.map(function(s, si, set) {
        return s.map(this.parse, this);
    }, this);
    this.debug(this.pattern, set);
    // filter out everything that didn't compile properly.
    set = set.filter(function(s) {
        return s.indexOf(false) === -1;
    });
    this.debug(this.pattern, set);
    this.set = set;
}
$18935bd581441675$var$Minimatch.prototype.parseNegate = $18935bd581441675$var$parseNegate;
function $18935bd581441675$var$parseNegate() {
    var pattern = this.pattern;
    var negate = false;
    var options = this.options;
    var negateOffset = 0;
    if (options.nonegate) return;
    for(var i = 0, l = pattern.length; i < l && pattern.charAt(i) === '!'; i++){
        negate = !negate;
        negateOffset++;
    }
    if (negateOffset) this.pattern = pattern.substr(negateOffset);
    this.negate = negate;
}
// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
$18935bd581441675$var$minimatch.braceExpand = function(pattern, options) {
    return $18935bd581441675$var$braceExpand(pattern, options);
};
$18935bd581441675$var$Minimatch.prototype.braceExpand = $18935bd581441675$var$braceExpand;
function $18935bd581441675$var$braceExpand(pattern, options) {
    if (!options) {
        if (this instanceof $18935bd581441675$var$Minimatch) options = this.options;
        else options = {
        };
    }
    pattern = typeof pattern === 'undefined' ? this.pattern : pattern;
    if (typeof pattern === 'undefined') throw new TypeError('undefined pattern');
    if (options.nobrace || !pattern.match(/\{.*\}/)) // shortcut. no need to expand.
    return [
        pattern
    ];
    return $geXdj(pattern);
}
// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
$18935bd581441675$var$Minimatch.prototype.parse = $18935bd581441675$var$parse;
var $18935bd581441675$var$SUBPARSE = {
};
function $18935bd581441675$var$parse(pattern, isSub) {
    if (pattern.length > 65536) throw new TypeError('pattern is too long');
    var options = this.options;
    // shortcuts
    if (!options.noglobstar && pattern === '**') return $18935bd581441675$var$GLOBSTAR;
    if (pattern === '') return '';
    var re = '';
    var hasMagic = !!options.nocase;
    var escaping = false;
    // ? => one single character
    var patternListStack = [];
    var negativeLists = [];
    var stateChar;
    var inClass = false;
    var reClassStart = -1;
    var classStart = -1;
    // . and .. never match anything that doesn't start with .,
    // even when options.dot is set.
    var patternStart = pattern.charAt(0) === '.' ? '' // anything
     : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))' : '(?!\\.)';
    var self = this;
    function clearStateChar() {
        if (stateChar) {
            // we had some state-tracking character
            // that wasn't consumed by this pass.
            switch(stateChar){
                case '*':
                    re += $18935bd581441675$var$star;
                    hasMagic = true;
                    break;
                case '?':
                    re += $18935bd581441675$var$qmark;
                    hasMagic = true;
                    break;
                default:
                    re += '\\' + stateChar;
                    break;
            }
            self.debug('clearStateChar %j %j', stateChar, re);
            stateChar = false;
        }
    }
    for(var i = 0, len = pattern.length, c; i < len && (c = pattern.charAt(i)); i++){
        this.debug('%s\t%s %s %j', pattern, i, re, c);
        // skip over any that are escaped.
        if (escaping && $18935bd581441675$var$reSpecials[c]) {
            re += '\\' + c;
            escaping = false;
            continue;
        }
        switch(c){
            case '/':
                // completely not allowed, even escaped.
                // Should already be path-split by now.
                return false;
            case '\\':
                clearStateChar();
                escaping = true;
                continue;
            // the various stateChar values
            // for the "extglob" stuff.
            case '?':
            case '*':
            case '+':
            case '@':
            case '!':
                this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c);
                // all of those are literals inside a class, except that
                // the glob [!a] means [^a] in regexp
                if (inClass) {
                    this.debug('  in class');
                    if (c === '!' && i === classStart + 1) c = '^';
                    re += c;
                    continue;
                }
                // if we already have a stateChar, then it means
                // that there was something like ** or +? in there.
                // Handle the stateChar, then proceed with this one.
                self.debug('call clearStateChar %j', stateChar);
                clearStateChar();
                stateChar = c;
                // if extglob is disabled, then +(asdf|foo) isn't a thing.
                // just clear the statechar *now*, rather than even diving into
                // the patternList stuff.
                if (options.noext) clearStateChar();
                continue;
            case '(':
                if (inClass) {
                    re += '(';
                    continue;
                }
                if (!stateChar) {
                    re += '\\(';
                    continue;
                }
                patternListStack.push({
                    type: stateChar,
                    start: i - 1,
                    reStart: re.length,
                    open: $18935bd581441675$var$plTypes[stateChar].open,
                    close: $18935bd581441675$var$plTypes[stateChar].close
                });
                // negation is (?:(?!js)[^/]*)
                re += stateChar === '!' ? '(?:(?!(?:' : '(?:';
                this.debug('plType %j %j', stateChar, re);
                stateChar = false;
                continue;
            case ')':
                if (inClass || !patternListStack.length) {
                    re += '\\)';
                    continue;
                }
                clearStateChar();
                hasMagic = true;
                var pl = patternListStack.pop();
                // negation is (?:(?!js)[^/]*)
                // The others are (?:<pattern>)<type>
                re += pl.close;
                if (pl.type === '!') negativeLists.push(pl);
                pl.reEnd = re.length;
                continue;
            case '|':
                if (inClass || !patternListStack.length || escaping) {
                    re += '\\|';
                    escaping = false;
                    continue;
                }
                clearStateChar();
                re += '|';
                continue;
            // these are mostly the same in regexp and glob
            case '[':
                // swallow any state-tracking char before the [
                clearStateChar();
                if (inClass) {
                    re += '\\' + c;
                    continue;
                }
                inClass = true;
                classStart = i;
                reClassStart = re.length;
                re += c;
                continue;
            case ']':
                //  a right bracket shall lose its special
                //  meaning and represent itself in
                //  a bracket expression if it occurs
                //  first in the list.  -- POSIX.2 2.8.3.2
                if (i === classStart + 1 || !inClass) {
                    re += '\\' + c;
                    escaping = false;
                    continue;
                }
                // handle the case where we left a class open.
                // "[z-a]" is valid, equivalent to "\[z-a\]"
                if (inClass) {
                    // split where the last [ was, make sure we don't have
                    // an invalid re. if so, re-walk the contents of the
                    // would-be class to re-translate any characters that
                    // were passed through as-is
                    // TODO: It would probably be faster to determine this
                    // without a try/catch and a new RegExp, but it's tricky
                    // to do safely.  For now, this is safe and works.
                    var cs = pattern.substring(classStart + 1, i);
                    try {
                        RegExp('[' + cs + ']');
                    } catch (er) {
                        // not a valid class!
                        var sp = this.parse(cs, $18935bd581441675$var$SUBPARSE);
                        re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]';
                        hasMagic = hasMagic || sp[1];
                        inClass = false;
                        continue;
                    }
                }
                // finish up the class.
                hasMagic = true;
                inClass = false;
                re += c;
                continue;
            default:
                // swallow any state char that wasn't consumed
                clearStateChar();
                if (escaping) // no need
                escaping = false;
                else if ($18935bd581441675$var$reSpecials[c] && !(c === '^' && inClass)) re += '\\';
                re += c;
        } // switch
    } // for
    // handle the case where we left a class open.
    // "[abc" is valid, equivalent to "\[abc"
    if (inClass) {
        // split where the last [ was, and escape it
        // this is a huge pita.  We now have to re-walk
        // the contents of the would-be class to re-translate
        // any characters that were passed through as-is
        cs = pattern.substr(classStart + 1);
        sp = this.parse(cs, $18935bd581441675$var$SUBPARSE);
        re = re.substr(0, reClassStart) + '\\[' + sp[0];
        hasMagic = hasMagic || sp[1];
    }
    // handle the case where we had a +( thing at the *end*
    // of the pattern.
    // each pattern list stack adds 3 chars, and we need to go through
    // and escape any | chars that were passed through as-is for the regexp.
    // Go through and escape them, taking care not to double-escape any
    // | chars that were already escaped.
    for(pl = patternListStack.pop(); pl; pl = patternListStack.pop()){
        var tail = re.slice(pl.reStart + pl.open.length);
        this.debug('setting tail', re, pl);
        // maybe some even number of \, then maybe 1 \, followed by a |
        tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function(_, $1, $2) {
            if (!$2) // the | isn't already escaped, so escape it.
            $2 = '\\';
            // need to escape all those slashes *again*, without escaping the
            // one that we need for escaping the | character.  As it works out,
            // escaping an even number of slashes can be done by simply repeating
            // it exactly after itself.  That's why this trick works.
            //
            // I am sorry that you have to see this.
            return $1 + $1 + $2 + '|';
        });
        this.debug('tail=%j\n   %s', tail, tail, pl, re);
        var t = pl.type === '*' ? $18935bd581441675$var$star : pl.type === '?' ? $18935bd581441675$var$qmark : '\\' + pl.type;
        hasMagic = true;
        re = re.slice(0, pl.reStart) + t + '\\(' + tail;
    }
    // handle trailing things that only matter at the very end.
    clearStateChar();
    if (escaping) // trailing \\
    re += '\\\\';
    // only need to apply the nodot start if the re starts with
    // something that could conceivably capture a dot
    var addPatternStart = false;
    switch(re.charAt(0)){
        case '.':
        case '[':
        case '(':
            addPatternStart = true;
    }
    // Hack to work around lack of negative lookbehind in JS
    // A pattern like: *.!(x).!(y|z) needs to ensure that a name
    // like 'a.xyz.yz' doesn't match.  So, the first negative
    // lookahead, has to look ALL the way ahead, to the end of
    // the pattern.
    for(var n = negativeLists.length - 1; n > -1; n--){
        var nl = negativeLists[n];
        var nlBefore = re.slice(0, nl.reStart);
        var nlFirst = re.slice(nl.reStart, nl.reEnd - 8);
        var nlLast = re.slice(nl.reEnd - 8, nl.reEnd);
        var nlAfter = re.slice(nl.reEnd);
        nlLast += nlAfter;
        // Handle nested stuff like *(*.js|!(*.json)), where open parens
        // mean that we should *not* include the ) in the bit that is considered
        // "after" the negated section.
        var openParensBefore = nlBefore.split('(').length - 1;
        var cleanAfter = nlAfter;
        for(i = 0; i < openParensBefore; i++)cleanAfter = cleanAfter.replace(/\)[+*?]?/, '');
        nlAfter = cleanAfter;
        var dollar = '';
        if (nlAfter === '' && isSub !== $18935bd581441675$var$SUBPARSE) dollar = '$';
        var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast;
        re = newRe;
    }
    // if the re is not "" at this point, then we need to make sure
    // it doesn't match against an empty path part.
    // Otherwise a/* will match a/, which it should not.
    if (re !== '' && hasMagic) re = '(?=.)' + re;
    if (addPatternStart) re = patternStart + re;
    // parsing just a piece of a larger pattern.
    if (isSub === $18935bd581441675$var$SUBPARSE) return [
        re,
        hasMagic
    ];
    // skip the regexp for non-magical patterns
    // unescape anything in it, though, so that it'll be
    // an exact match against a file etc.
    if (!hasMagic) return $18935bd581441675$var$globUnescape(pattern);
    var flags = options.nocase ? 'i' : '';
    try {
        var regExp = new RegExp('^' + re + '$', flags);
    } catch (er) {
        // If it was an invalid regular expression, then it can't match
        // anything.  This trick looks for a character after the end of
        // the string, which is of course impossible, except in multi-line
        // mode, but it's not a /m regex.
        return new RegExp('$.');
    }
    regExp._glob = pattern;
    regExp._src = re;
    return regExp;
}
$18935bd581441675$var$minimatch.makeRe = function(pattern, options) {
    return new $18935bd581441675$var$Minimatch(pattern, options || {
    }).makeRe();
};
$18935bd581441675$var$Minimatch.prototype.makeRe = $18935bd581441675$var$makeRe;
function $18935bd581441675$var$makeRe() {
    if (this.regexp || this.regexp === false) return this.regexp;
    // at this point, this.set is a 2d array of partial
    // pattern strings, or "**".
    //
    // It's better to use .match().  This function shouldn't
    // be used, really, but it's pretty convenient sometimes,
    // when you just want to work with a regex.
    var set = this.set;
    if (!set.length) {
        this.regexp = false;
        return this.regexp;
    }
    var options = this.options;
    var twoStar = options.noglobstar ? $18935bd581441675$var$star : options.dot ? $18935bd581441675$var$twoStarDot : $18935bd581441675$var$twoStarNoDot;
    var flags = options.nocase ? 'i' : '';
    var re = set.map(function(pattern) {
        return pattern.map(function(p) {
            return p === $18935bd581441675$var$GLOBSTAR ? twoStar : typeof p === 'string' ? $18935bd581441675$var$regExpEscape(p) : p._src;
        }).join('\\\/');
    }).join('|');
    // must match entire pattern
    // ending in a * or ** will make it less strict.
    re = '^(?:' + re + ')$';
    // can match anything, as long as it's not this.
    if (this.negate) re = '^(?!' + re + ').*$';
    try {
        this.regexp = new RegExp(re, flags);
    } catch (ex) {
        this.regexp = false;
    }
    return this.regexp;
}
$18935bd581441675$var$minimatch.match = function(list, pattern, options) {
    options = options || {
    };
    var mm = new $18935bd581441675$var$Minimatch(pattern, options);
    list = list.filter(function(f) {
        return mm.match(f);
    });
    if (mm.options.nonull && !list.length) list.push(pattern);
    return list;
};
$18935bd581441675$var$Minimatch.prototype.match = $18935bd581441675$var$match;
function $18935bd581441675$var$match(f, partial) {
    this.debug('match', f, this.pattern);
    // short-circuit in the case of busted things.
    // comments, etc.
    if (this.comment) return false;
    if (this.empty) return f === '';
    if (f === '/' && partial) return true;
    var options = this.options;
    // windows: need to use /, not \
    if ($18935bd581441675$var$path.sep !== '/') f = f.split($18935bd581441675$var$path.sep).join('/');
    // treat the test path as a set of pathparts.
    f = f.split($18935bd581441675$var$slashSplit);
    this.debug(this.pattern, 'split', f);
    // just ONE of the pattern sets in this.set needs to match
    // in order for it to be valid.  If negating, then just one
    // match means that we have failed.
    // Either way, return on the first hit.
    var set = this.set;
    this.debug(this.pattern, 'set', set);
    // Find the basename of the path by looking for the last non-empty segment
    var filename;
    var i;
    for(i = f.length - 1; i >= 0; i--){
        filename = f[i];
        if (filename) break;
    }
    for(i = 0; i < set.length; i++){
        var pattern = set[i];
        var file = f;
        if (options.matchBase && pattern.length === 1) file = [
            filename
        ];
        var hit = this.matchOne(file, pattern, partial);
        if (hit) {
            if (options.flipNegate) return true;
            return !this.negate;
        }
    }
    // didn't get any hits.  this is success if it's a negative
    // pattern, failure otherwise.
    if (options.flipNegate) return false;
    return this.negate;
}
// set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.
$18935bd581441675$var$Minimatch.prototype.matchOne = function(file, pattern, partial) {
    var options = this.options;
    this.debug('matchOne', {
        'this': this,
        file: file,
        pattern: pattern
    });
    this.debug('matchOne', file.length, pattern.length);
    for(var fi = 0, pi = 0, fl = file.length, pl = pattern.length; fi < fl && pi < pl; fi++, pi++){
        this.debug('matchOne loop');
        var p = pattern[pi];
        var f = file[fi];
        this.debug(pattern, p, f);
        // should be impossible.
        // some invalid regexp stuff in the set.
        if (p === false) return false;
        if (p === $18935bd581441675$var$GLOBSTAR) {
            this.debug('GLOBSTAR', [
                pattern,
                p,
                f
            ]);
            // "**"
            // a/**/b/**/c would match the following:
            // a/b/x/y/z/c
            // a/x/y/z/b/c
            // a/b/x/b/x/c
            // a/b/c
            // To do this, take the rest of the pattern after
            // the **, and see if it would match the file remainder.
            // If so, return success.
            // If not, the ** "swallows" a segment, and try again.
            // This is recursively awful.
            //
            // a/**/b/**/c matching a/b/x/y/z/c
            // - a matches a
            // - doublestar
            //   - matchOne(b/x/y/z/c, b/**/c)
            //     - b matches b
            //     - doublestar
            //       - matchOne(x/y/z/c, c) -> no
            //       - matchOne(y/z/c, c) -> no
            //       - matchOne(z/c, c) -> no
            //       - matchOne(c, c) yes, hit
            var fr = fi;
            var pr = pi + 1;
            if (pr === pl) {
                this.debug('** at the end');
                // a ** at the end will just swallow the rest.
                // We have found a match.
                // however, it will not swallow /.x, unless
                // options.dot is set.
                // . and .. are *never* matched by **, for explosively
                // exponential reasons.
                for(; fi < fl; fi++){
                    if (file[fi] === '.' || file[fi] === '..' || !options.dot && file[fi].charAt(0) === '.') return false;
                }
                return true;
            }
            // ok, let's see if we can swallow whatever we can.
            while(fr < fl){
                var swallowee = file[fr];
                this.debug('\nglobstar while', file, fr, pattern, pr, swallowee);
                // XXX remove this slice.  Just pass the start index.
                if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
                    this.debug('globstar found match!', fr, fl, swallowee);
                    // found a match.
                    return true;
                } else {
                    // can't swallow "." or ".." ever.
                    // can only swallow ".foo" when explicitly asked.
                    if (swallowee === '.' || swallowee === '..' || !options.dot && swallowee.charAt(0) === '.') {
                        this.debug('dot detected!', file, fr, pattern, pr);
                        break;
                    }
                    // ** swallows a segment, and continue.
                    this.debug('globstar swallow a segment, and continue');
                    fr++;
                }
            }
            // no match was found.
            // However, in partial mode, we can't say this is necessarily over.
            // If there's more *pattern* left, then
            if (partial) {
                // ran out of file
                this.debug('\n>>> no match, partial?', file, fr, pattern, pr);
                if (fr === fl) return true;
            }
            return false;
        }
        // something other than **
        // non-magic patterns just have to match exactly
        // patterns with magic have been turned into regexps.
        var hit;
        if (typeof p === 'string') {
            if (options.nocase) hit = f.toLowerCase() === p.toLowerCase();
            else hit = f === p;
            this.debug('string match', p, f, hit);
        } else {
            hit = f.match(p);
            this.debug('pattern match', p, f, hit);
        }
        if (!hit) return false;
    }
    // Note: ending in / means that we'll get a final ""
    // at the end of the pattern.  This can only match a
    // corresponding "" at the end of the file.
    // If the file ends in /, then it can only match a
    // a pattern that ends in /, unless the pattern just
    // doesn't have any more for it. But, a/b/ should *not*
    // match "a/b/*", even though "" matches against the
    // [^/]*? pattern, except in partial mode, where it might
    // simply not be reached yet.
    // However, a/b/ should still satisfy a/*
    // now either we fell off the end of the pattern, or we're done.
    if (fi === fl && pi === pl) // ran out of pattern and filename at the same time.
    // an exact hit!
    return true;
    else if (fi === fl) // ran out of file, but still had pattern left.
    // this is ok if we're doing the match as part of
    // a glob fs traversal.
    return partial;
    else if (pi === pl) {
        // ran out of pattern, still have file left.
        // this is only acceptable if we're on the very last
        // empty segment of a file with a trailing slash.
        // a/* should match a/b/
        var emptyFileEnd = fi === fl - 1 && file[fi] === '';
        return emptyFileEnd;
    }
    // should be unreachable.
    throw new Error('wtf?');
};
// replace stuff like \* with *
function $18935bd581441675$var$globUnescape(s) {
    return s.replace(/\\(.)/g, '$1');
}
function $18935bd581441675$var$regExpEscape(s) {
    return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

});
parcelRequire.register("geXdj", function(module, exports) {

var $iToJb = parcelRequire("iToJb");

var $f1RpY = parcelRequire("f1RpY");
module.exports = $bd2be2bb91789d17$var$expandTop;
var $bd2be2bb91789d17$var$escSlash = '\0SLASH' + Math.random() + '\0';
var $bd2be2bb91789d17$var$escOpen = '\0OPEN' + Math.random() + '\0';
var $bd2be2bb91789d17$var$escClose = '\0CLOSE' + Math.random() + '\0';
var $bd2be2bb91789d17$var$escComma = '\0COMMA' + Math.random() + '\0';
var $bd2be2bb91789d17$var$escPeriod = '\0PERIOD' + Math.random() + '\0';
function $bd2be2bb91789d17$var$numeric(str) {
    return parseInt(str, 10) == str ? parseInt(str, 10) : str.charCodeAt(0);
}
function $bd2be2bb91789d17$var$escapeBraces(str) {
    return str.split('\\\\').join($bd2be2bb91789d17$var$escSlash).split('\\{').join($bd2be2bb91789d17$var$escOpen).split('\\}').join($bd2be2bb91789d17$var$escClose).split('\\,').join($bd2be2bb91789d17$var$escComma).split('\\.').join($bd2be2bb91789d17$var$escPeriod);
}
function $bd2be2bb91789d17$var$unescapeBraces(str) {
    return str.split($bd2be2bb91789d17$var$escSlash).join('\\').split($bd2be2bb91789d17$var$escOpen).join('{').split($bd2be2bb91789d17$var$escClose).join('}').split($bd2be2bb91789d17$var$escComma).join(',').split($bd2be2bb91789d17$var$escPeriod).join('.');
}
// Basically just str.split(","), but handling cases
// where we have nested braced sections, which should be
// treated as individual members, like {a,{b,c},d}
function $bd2be2bb91789d17$var$parseCommaParts(str) {
    if (!str) return [
        ''
    ];
    var parts = [];
    var m = $f1RpY('{', '}', str);
    if (!m) return str.split(',');
    var pre = m.pre;
    var body = m.body;
    var post = m.post;
    var p = pre.split(',');
    p[p.length - 1] += '{' + body + '}';
    var postParts = $bd2be2bb91789d17$var$parseCommaParts(post);
    if (post.length) {
        p[p.length - 1] += postParts.shift();
        p.push.apply(p, postParts);
    }
    parts.push.apply(parts, p);
    return parts;
}
function $bd2be2bb91789d17$var$expandTop(str) {
    if (!str) return [];
    // I don't know why Bash 4.3 does this, but it does.
    // Anything starting with {} will have the first two bytes preserved
    // but *only* at the top level, so {},a}b will not expand to anything,
    // but a{},b}c will be expanded to [a}c,abc].
    // One could argue that this is a bug in Bash, but since the goal of
    // this module is to match Bash's rules, we escape a leading {}
    if (str.substr(0, 2) === '{}') str = '\\{\\}' + str.substr(2);
    return $bd2be2bb91789d17$var$expand($bd2be2bb91789d17$var$escapeBraces(str), true).map($bd2be2bb91789d17$var$unescapeBraces);
}
function $bd2be2bb91789d17$var$identity(e) {
    return e;
}
function $bd2be2bb91789d17$var$embrace(str) {
    return '{' + str + '}';
}
function $bd2be2bb91789d17$var$isPadded(el) {
    return /^-?0\d/.test(el);
}
function $bd2be2bb91789d17$var$lte(i, y) {
    return i <= y;
}
function $bd2be2bb91789d17$var$gte(i, y) {
    return i >= y;
}
function $bd2be2bb91789d17$var$expand(str, isTop) {
    var expansions = [];
    var m = $f1RpY('{', '}', str);
    if (!m || /\$$/.test(m.pre)) return [
        str
    ];
    var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
    var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
    var isSequence = isNumericSequence || isAlphaSequence;
    var isOptions = m.body.indexOf(',') >= 0;
    if (!isSequence && !isOptions) {
        // {a},b}
        if (m.post.match(/,.*\}/)) {
            str = m.pre + '{' + m.body + $bd2be2bb91789d17$var$escClose + m.post;
            return $bd2be2bb91789d17$var$expand(str);
        }
        return [
            str
        ];
    }
    var n;
    if (isSequence) n = m.body.split(/\.\./);
    else {
        n = $bd2be2bb91789d17$var$parseCommaParts(m.body);
        if (n.length === 1) {
            // x{{a,b}}y ==> x{a}y x{b}y
            n = $bd2be2bb91789d17$var$expand(n[0], false).map($bd2be2bb91789d17$var$embrace);
            if (n.length === 1) {
                var post = m.post.length ? $bd2be2bb91789d17$var$expand(m.post, false) : [
                    ''
                ];
                return post.map(function(p) {
                    return m.pre + n[0] + p;
                });
            }
        }
    }
    // at this point, n is the parts, and we know it's not a comma set
    // with a single entry.
    // no need to expand pre, since it is guaranteed to be free of brace-sets
    var pre = m.pre;
    var post = m.post.length ? $bd2be2bb91789d17$var$expand(m.post, false) : [
        ''
    ];
    var N;
    if (isSequence) {
        var x = $bd2be2bb91789d17$var$numeric(n[0]);
        var y = $bd2be2bb91789d17$var$numeric(n[1]);
        var width = Math.max(n[0].length, n[1].length);
        var incr = n.length == 3 ? Math.abs($bd2be2bb91789d17$var$numeric(n[2])) : 1;
        var test = $bd2be2bb91789d17$var$lte;
        var reverse = y < x;
        if (reverse) {
            incr *= -1;
            test = $bd2be2bb91789d17$var$gte;
        }
        var pad = n.some($bd2be2bb91789d17$var$isPadded);
        N = [];
        for(var i = x; test(i, y); i += incr){
            var c;
            if (isAlphaSequence) {
                c = String.fromCharCode(i);
                if (c === '\\') c = '';
            } else {
                c = String(i);
                if (pad) {
                    var need = width - c.length;
                    if (need > 0) {
                        var z = new Array(need + 1).join('0');
                        if (i < 0) c = '-' + z + c.slice(1);
                        else c = z + c;
                    }
                }
            }
            N.push(c);
        }
    } else N = $iToJb(n, function(el) {
        return $bd2be2bb91789d17$var$expand(el, false);
    });
    for(var j = 0; j < N.length; j++)for(var k = 0; k < post.length; k++){
        var expansion = pre + N[j] + post[k];
        if (!isTop || isSequence || expansion) expansions.push(expansion);
    }
    return expansions;
}

});
parcelRequire.register("iToJb", function(module, exports) {
module.exports = function(xs, fn) {
    var res = [];
    for(var i = 0; i < xs.length; i++){
        var x = fn(xs[i], i);
        if ($dc108b7b4eef718f$var$isArray(x)) res.push.apply(res, x);
        else res.push(x);
    }
    return res;
};
var $dc108b7b4eef718f$var$isArray = Array.isArray || function(xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};

});

parcelRequire.register("f1RpY", function(module, exports) {
'use strict';
module.exports = $af1062b7dbf94aa9$var$balanced;
function $af1062b7dbf94aa9$var$balanced(a, b, str) {
    if (a instanceof RegExp) a = $af1062b7dbf94aa9$var$maybeMatch(a, str);
    if (b instanceof RegExp) b = $af1062b7dbf94aa9$var$maybeMatch(b, str);
    var r = $af1062b7dbf94aa9$var$range(a, b, str);
    return r && {
        start: r[0],
        end: r[1],
        pre: str.slice(0, r[0]),
        body: str.slice(r[0] + a.length, r[1]),
        post: str.slice(r[1] + b.length)
    };
}
function $af1062b7dbf94aa9$var$maybeMatch(reg, str) {
    var m = str.match(reg);
    return m ? m[0] : null;
}
$af1062b7dbf94aa9$var$balanced.range = $af1062b7dbf94aa9$var$range;
function $af1062b7dbf94aa9$var$range(a, b, str) {
    var begs, beg, left, right, result;
    var ai = str.indexOf(a);
    var bi = str.indexOf(b, ai + 1);
    var i = ai;
    if (ai >= 0 && bi > 0) {
        begs = [];
        left = str.length;
        while(i >= 0 && !result){
            if (i == ai) {
                begs.push(i);
                ai = str.indexOf(a, i + 1);
            } else if (begs.length == 1) result = [
                begs.pop(),
                bi
            ];
            else {
                beg = begs.pop();
                if (beg < left) {
                    left = beg;
                    right = bi;
                }
                bi = str.indexOf(b, i + 1);
            }
            i = ai < bi && ai >= 0 ? ai : bi;
        }
        if (begs.length) result = [
            left,
            right
        ];
    }
    return result;
}

});



parcelRequire.register("dLNl0", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.MAX_STRING_LENGTH = void 0;
module.exports.dedent = $a065ef9f39a41d69$var$dedent;
module.exports.exec = void 0;
module.exports.merge = $a065ef9f39a41d69$var$merge;
module.exports.union = $a065ef9f39a41d69$var$union;
module.exports.unique = $a065ef9f39a41d69$var$unique;



// exec
const $a065ef9f39a41d69$var$exec = (0, $igPDg$util.promisify)($igPDg$child_process.exec);
module.exports.exec = $a065ef9f39a41d69$var$exec;
const $a065ef9f39a41d69$var$MAX_STRING_LENGTH = $igPDg$buffer.constants.MAX_STRING_LENGTH; // fast merge function
// https://uilicious.com/blog/javascript-array-push-is-945x-faster-than-array-concat/
module.exports.MAX_STRING_LENGTH = $a065ef9f39a41d69$var$MAX_STRING_LENGTH;
function $a065ef9f39a41d69$var$merge(arr1, arr2) {
    if (!arr2.length) return;
    Array.prototype.push.apply(arr1, arr2);
} // get unique entries of an array
function $a065ef9f39a41d69$var$unique(arr) {
    return [
        ...new Set(arr)
    ];
} // fast union function (replacement for _.union)
function $a065ef9f39a41d69$var$union(arr1, arr2) {
    $a065ef9f39a41d69$var$merge(arr1, arr2);
    return $a065ef9f39a41d69$var$unique(arr1);
}
/** @param {string[]} str */ function $a065ef9f39a41d69$var$dedent(str) {
    return String(str).replace(/(\n)\s+/g, "$1");
}

});

parcelRequire.register("ggBRY", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: !0
});


var $bd7b8417a0cf746e$var$e = function(t) {
    if ("string" != typeof t || "" === t) return !1;
    for(var r; r = /(\\).|([@?!+*]\(.*\))/g.exec(t);){
        if (r[2]) return !0;
        t = t.slice(r.index + r[0].length);
    }
    return !1;
}, $bd7b8417a0cf746e$var$n = {
    "{": "}",
    "(": ")",
    "[": "]"
}, $bd7b8417a0cf746e$var$i = /\\(.)|(^!|\*|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/, $bd7b8417a0cf746e$var$o = /\\(.)|(^!|[*?{}()[\]]|\(\?)/, $bd7b8417a0cf746e$var$s = function(t, r) {
    if ("string" != typeof t || "" === t) return !1;
    if ($bd7b8417a0cf746e$var$e(t)) return !0;
    var s, a = $bd7b8417a0cf746e$var$i;
    for(r && !1 === r.strict && (a = $bd7b8417a0cf746e$var$o); s = a.exec(t);){
        if (s[2]) return !0;
        var u = s.index + s[0].length, c = s[1], f = c ? $bd7b8417a0cf746e$var$n[c] : null;
        if (c && f) {
            var l = t.indexOf(f, u);
            -1 !== l && (u = l + 1);
        }
        t = t.slice(u);
    }
    return !1;
}, $bd7b8417a0cf746e$var$a = /[‘“!#$%&+^<=>`]/, $bd7b8417a0cf746e$var$u = function(t) {
    return "string" != typeof t || $bd7b8417a0cf746e$var$s(t) || $bd7b8417a0cf746e$var$a.test(t);
}, $bd7b8417a0cf746e$var$c = function(t) {
    return !1 === $bd7b8417a0cf746e$var$u(t);
};
var $bd7b8417a0cf746e$var$f = {
    exports: function(t1) {
        var r1 = void 0;
        r1 = "string" == typeof t1 ? [
            t1
        ] : t1.raw;
        for(var e1 = "", n = 0; n < r1.length; n++)e1 += r1[n].replace(/\\\n[ \t]*/g, "").replace(/\\`/g, "`"), n < (arguments.length <= 1 ? 0 : arguments.length - 1) && (e1 += arguments.length <= n + 1 ? void 0 : arguments[n + 1]);
        var i = e1.split("\n"), o = null;
        return i.forEach(function(t) {
            var r = t.match(/^(\s+)\S+/);
            if (r) {
                var e = r[1].length;
                o = o ? Math.min(o, e) : e;
            }
        }), null !== o && (e1 = i.map(function(t) {
            return " " === t[0] ? t.slice(o) : t;
        }).join("\n")), (e1 = e1.trim()).replace(/\\n/g, "\n");
    }
}, $bd7b8417a0cf746e$var$l = $bd7b8417a0cf746e$var$f.exports;
const { readFile: $bd7b8417a0cf746e$var$p , stat: $bd7b8417a0cf746e$var$g  } = $igPDg$fs.promises;
function $bd7b8417a0cf746e$var$h(r) {
    return $igPDg$path.normalize(r).replace(/\\/g, "/");
}
function $bd7b8417a0cf746e$var$y(t) {
    return $bd7b8417a0cf746e$var$h(t).replace(/\/$/, "");
}
async function $bd7b8417a0cf746e$var$x(t3, r2) {
    const e = $bd7b8417a0cf746e$var$l(t3).split("\n").filter((t)=>{
        var r;
        return !(/^\s*$/.test(t) || (r = t, "#" === r[0]));
    }).map((t4)=>(function(t) {
            return t.replace(/^\s+/, "");
        })(function(t) {
            return /\\\s+$/.test(t) ? t.replace(/\\(\s+)$/, "$1") : t.replace(/\s+$/, "");
        }(t4))
    ), n = e.length, i = new Array(n);
    for(let t2 = 0; t2 < n; t2++){
        const n = await $bd7b8417a0cf746e$var$v(e[t2], r2);
        "string" == typeof n ? i[t2] = n : (i[t2] = n[0], i.push(n[1]));
    }
    return [
        ...new Set(i)
    ];
}
async function $bd7b8417a0cf746e$var$v(r, e) {
    let n = r, i = !1;
    "!" === n[0] && (n = n.substring(1), i = !0);
    let o = $bd7b8417a0cf746e$var$E.OTHER;
    if ("/" === n[0]) n = n.substring(1), $bd7b8417a0cf746e$var$c(n) && (o = await $bd7b8417a0cf746e$var$R(e ? $igPDg$path.join(e, n) : n));
    else {
        const r = n.indexOf("/");
        -1 === r ? n.startsWith("**/") || (n = `**/${n}`) : r === n.length - 1 ? o = $bd7b8417a0cf746e$var$E.DIRECTORY : $bd7b8417a0cf746e$var$c(n) && (o = await $bd7b8417a0cf746e$var$R(e ? $igPDg$path.join(e, n) : n));
    }
    return e && (n = `${$bd7b8417a0cf746e$var$h(e)}/${n}`), n = i ? n : `!${n}`, o === $bd7b8417a0cf746e$var$E.DIRECTORY ? n.endsWith("/") ? `${n}**` : `${n}/**` : o === $bd7b8417a0cf746e$var$E.FILE || n.endsWith("/**") ? n : [
        n,
        `${n}/**`
    ];
}
var $bd7b8417a0cf746e$var$E;
async function $bd7b8417a0cf746e$var$R(t) {
    let r;
    try {
        r = await $bd7b8417a0cf746e$var$g(t);
    } catch (t5) {
        return $bd7b8417a0cf746e$var$E.OTHER;
    }
    return r.isDirectory() ? $bd7b8417a0cf746e$var$E.DIRECTORY : r.isFile() ? $bd7b8417a0cf746e$var$E.FILE : $bd7b8417a0cf746e$var$E.OTHER;
}
!function(t) {
    t[t.OTHER = 0] = "OTHER", t[t.DIRECTORY = 1] = "DIRECTORY", t[t.FILE = 2] = "FILE";
}($bd7b8417a0cf746e$var$E || ($bd7b8417a0cf746e$var$E = {
})), module.exports.globifyDirectory = function(t) {
    return `${$bd7b8417a0cf746e$var$y(t)}/**`;
}, module.exports.globifyGitIgnore = $bd7b8417a0cf746e$var$x, module.exports.globifyGitIgnoreFile = async function(r) {
    return $bd7b8417a0cf746e$var$x(await $bd7b8417a0cf746e$var$p($igPDg$path.join(r, ".gitignore"), "utf-8"), r);
}, module.exports.globifyPath = function(t, r = process.cwd()) {
    return $bd7b8417a0cf746e$var$v($bd7b8417a0cf746e$var$h(t), r);
}, module.exports.posixifyPath = $bd7b8417a0cf746e$var$h, module.exports.posixifyPathNormalized = $bd7b8417a0cf746e$var$y;

});

parcelRequire.register("IkqER", function(module, exports) {
"use strict";

var $6Rmqc = parcelRequire("6Rmqc");

var $aQhOg = parcelRequire("aQhOg");

var $3TSY1 = parcelRequire("3TSY1");

var $3t5nY = parcelRequire("3t5nY");

var $htzNp = parcelRequire("htzNp");

var $6e4CR = parcelRequire("6e4CR");
async function $0853f4f156234821$var$FastGlob(source, options) {
    $0853f4f156234821$var$assertPatternsInput(source);
    const works = $0853f4f156234821$var$getWorks(source, $aQhOg.default, options);
    const result = await Promise.all(works);
    return $6e4CR.array.flatten(result);
}
// https://github.com/typescript-eslint/typescript-eslint/issues/60
// eslint-disable-next-line no-redeclare
(function(FastGlob) {
    function sync(source, options) {
        $0853f4f156234821$var$assertPatternsInput(source);
        const works = $0853f4f156234821$var$getWorks(source, $3t5nY.default, options);
        return $6e4CR.array.flatten(works);
    }
    FastGlob.sync = sync;
    function stream(source, options) {
        $0853f4f156234821$var$assertPatternsInput(source);
        const works = $0853f4f156234821$var$getWorks(source, $3TSY1.default, options);
        /**
         * The stream returned by the provider cannot work with an asynchronous iterator.
         * To support asynchronous iterators, regardless of the number of tasks, we always multiplex streams.
         * This affects performance (+25%). I don't see best solution right now.
         */ return $6e4CR.stream.merge(works);
    }
    FastGlob.stream = stream;
    function generateTasks(source, options) {
        $0853f4f156234821$var$assertPatternsInput(source);
        const patterns = [].concat(source);
        const settings = new $htzNp.default(options);
        return $6Rmqc.generate(patterns, settings);
    }
    FastGlob.generateTasks = generateTasks;
    function isDynamicPattern(source, options) {
        $0853f4f156234821$var$assertPatternsInput(source);
        const settings = new $htzNp.default(options);
        return $6e4CR.pattern.isDynamicPattern(source, settings);
    }
    FastGlob.isDynamicPattern = isDynamicPattern;
    function escapePath(source) {
        $0853f4f156234821$var$assertPatternsInput(source);
        return $6e4CR.path.escape(source);
    }
    FastGlob.escapePath = escapePath;
})($0853f4f156234821$var$FastGlob || ($0853f4f156234821$var$FastGlob = {
}));
function $0853f4f156234821$var$getWorks(source, _Provider, options) {
    const patterns = [].concat(source);
    const settings = new $htzNp.default(options);
    const tasks = $6Rmqc.generate(patterns, settings);
    const provider = new _Provider(settings);
    return tasks.map(provider.read, provider);
}
function $0853f4f156234821$var$assertPatternsInput(input) {
    const source = [].concat(input);
    const isValidSource = source.every((item)=>$6e4CR.string.isString(item) && !$6e4CR.string.isEmpty(item)
    );
    if (!isValidSource) throw new TypeError('Patterns must be a string (non empty) or an array of strings');
}
module.exports = $0853f4f156234821$var$FastGlob;

});
parcelRequire.register("6Rmqc", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.convertPatternGroupToTask = module.exports.convertPatternGroupsToTasks = module.exports.groupPatternsByBaseDirectory = module.exports.getNegativePatternsAsPositive = module.exports.getPositivePatterns = module.exports.convertPatternsToTasks = module.exports.generate = void 0;

var $6e4CR = parcelRequire("6e4CR");
function $4fe915c0ccb04199$var$generate(patterns, settings) {
    const positivePatterns = $4fe915c0ccb04199$var$getPositivePatterns(patterns);
    const negativePatterns = $4fe915c0ccb04199$var$getNegativePatternsAsPositive(patterns, settings.ignore);
    const staticPatterns = positivePatterns.filter((pattern)=>$6e4CR.pattern.isStaticPattern(pattern, settings)
    );
    const dynamicPatterns = positivePatterns.filter((pattern)=>$6e4CR.pattern.isDynamicPattern(pattern, settings)
    );
    const staticTasks = $4fe915c0ccb04199$var$convertPatternsToTasks(staticPatterns, negativePatterns, /* dynamic */ false);
    const dynamicTasks = $4fe915c0ccb04199$var$convertPatternsToTasks(dynamicPatterns, negativePatterns, /* dynamic */ true);
    return staticTasks.concat(dynamicTasks);
}
module.exports.generate = $4fe915c0ccb04199$var$generate;
/**
 * Returns tasks grouped by basic pattern directories.
 *
 * Patterns that can be found inside (`./`) and outside (`../`) the current directory are handled separately.
 * This is necessary because directory traversal starts at the base directory and goes deeper.
 */ function $4fe915c0ccb04199$var$convertPatternsToTasks(positive, negative, dynamic) {
    const tasks = [];
    const patternsOutsideCurrentDirectory = $6e4CR.pattern.getPatternsOutsideCurrentDirectory(positive);
    const patternsInsideCurrentDirectory = $6e4CR.pattern.getPatternsInsideCurrentDirectory(positive);
    const outsideCurrentDirectoryGroup = $4fe915c0ccb04199$var$groupPatternsByBaseDirectory(patternsOutsideCurrentDirectory);
    const insideCurrentDirectoryGroup = $4fe915c0ccb04199$var$groupPatternsByBaseDirectory(patternsInsideCurrentDirectory);
    tasks.push(...$4fe915c0ccb04199$var$convertPatternGroupsToTasks(outsideCurrentDirectoryGroup, negative, dynamic));
    /*
     * For the sake of reducing future accesses to the file system, we merge all tasks within the current directory
     * into a global task, if at least one pattern refers to the root (`.`). In this case, the global task covers the rest.
     */ if ('.' in insideCurrentDirectoryGroup) tasks.push($4fe915c0ccb04199$var$convertPatternGroupToTask('.', patternsInsideCurrentDirectory, negative, dynamic));
    else tasks.push(...$4fe915c0ccb04199$var$convertPatternGroupsToTasks(insideCurrentDirectoryGroup, negative, dynamic));
    return tasks;
}
module.exports.convertPatternsToTasks = $4fe915c0ccb04199$var$convertPatternsToTasks;
function $4fe915c0ccb04199$var$getPositivePatterns(patterns) {
    return $6e4CR.pattern.getPositivePatterns(patterns);
}
module.exports.getPositivePatterns = $4fe915c0ccb04199$var$getPositivePatterns;
function $4fe915c0ccb04199$var$getNegativePatternsAsPositive(patterns, ignore) {
    const negative = $6e4CR.pattern.getNegativePatterns(patterns).concat(ignore);
    const positive = negative.map($6e4CR.pattern.convertToPositivePattern);
    return positive;
}
module.exports.getNegativePatternsAsPositive = $4fe915c0ccb04199$var$getNegativePatternsAsPositive;
function $4fe915c0ccb04199$var$groupPatternsByBaseDirectory(patterns) {
    const group = {
    };
    return patterns.reduce((collection, pattern)=>{
        const base = $6e4CR.pattern.getBaseDirectory(pattern);
        if (base in collection) collection[base].push(pattern);
        else collection[base] = [
            pattern
        ];
        return collection;
    }, group);
}
module.exports.groupPatternsByBaseDirectory = $4fe915c0ccb04199$var$groupPatternsByBaseDirectory;
function $4fe915c0ccb04199$var$convertPatternGroupsToTasks(positive, negative, dynamic) {
    return Object.keys(positive).map((base)=>{
        return $4fe915c0ccb04199$var$convertPatternGroupToTask(base, positive[base], negative, dynamic);
    });
}
module.exports.convertPatternGroupsToTasks = $4fe915c0ccb04199$var$convertPatternGroupsToTasks;
function $4fe915c0ccb04199$var$convertPatternGroupToTask(base, positive, negative, dynamic) {
    return {
        dynamic: dynamic,
        positive: positive,
        negative: negative,
        base: base,
        patterns: [].concat(positive, negative.map($6e4CR.pattern.convertToNegativePattern))
    };
}
module.exports.convertPatternGroupToTask = $4fe915c0ccb04199$var$convertPatternGroupToTask;

});
parcelRequire.register("6e4CR", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.string = module.exports.stream = module.exports.pattern = module.exports.path = module.exports.fs = module.exports.errno = module.exports.array = void 0;

var $9MvCa = parcelRequire("9MvCa");
module.exports.array = $9MvCa;

var $57UND = parcelRequire("57UND");
module.exports.errno = $57UND;

var $h3BWX = parcelRequire("h3BWX");
module.exports.fs = $h3BWX;

var $bTKPR = parcelRequire("bTKPR");
module.exports.path = $bTKPR;

var $4brce = parcelRequire("4brce");
module.exports.pattern = $4brce;

var $5EV8S = parcelRequire("5EV8S");
module.exports.stream = $5EV8S;

var $7l6KD = parcelRequire("7l6KD");
module.exports.string = $7l6KD;

});
parcelRequire.register("9MvCa", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.splitWhen = module.exports.flatten = void 0;
function $71f11ec551eccf59$var$flatten(items) {
    return items.reduce((collection, item)=>[].concat(collection, item)
    , []);
}
module.exports.flatten = $71f11ec551eccf59$var$flatten;
function $71f11ec551eccf59$var$splitWhen(items, predicate) {
    const result = [
        []
    ];
    let groupIndex = 0;
    for (const item of items)if (predicate(item)) {
        groupIndex++;
        result[groupIndex] = [];
    } else result[groupIndex].push(item);
    return result;
}
module.exports.splitWhen = $71f11ec551eccf59$var$splitWhen;

});

parcelRequire.register("57UND", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.isEnoentCodeError = void 0;
function $3bb9aa674bda06f4$var$isEnoentCodeError(error) {
    return error.code === 'ENOENT';
}
module.exports.isEnoentCodeError = $3bb9aa674bda06f4$var$isEnoentCodeError;

});

parcelRequire.register("h3BWX", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.createDirentFromStats = void 0;
class $c6b027911f834d36$var$DirentFromStats {
    constructor(name1, stats1){
        this.name = name1;
        this.isBlockDevice = stats1.isBlockDevice.bind(stats1);
        this.isCharacterDevice = stats1.isCharacterDevice.bind(stats1);
        this.isDirectory = stats1.isDirectory.bind(stats1);
        this.isFIFO = stats1.isFIFO.bind(stats1);
        this.isFile = stats1.isFile.bind(stats1);
        this.isSocket = stats1.isSocket.bind(stats1);
        this.isSymbolicLink = stats1.isSymbolicLink.bind(stats1);
    }
}
function $c6b027911f834d36$var$createDirentFromStats(name, stats) {
    return new $c6b027911f834d36$var$DirentFromStats(name, stats);
}
module.exports.createDirentFromStats = $c6b027911f834d36$var$createDirentFromStats;

});

parcelRequire.register("bTKPR", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.removeLeadingDotSegment = module.exports.escape = module.exports.makeAbsolute = module.exports.unixify = void 0;

const $8a99295016a7aa2d$var$LEADING_DOT_SEGMENT_CHARACTERS_COUNT = 2; // ./ or .\\
const $8a99295016a7aa2d$var$UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([()*?[\]{|}]|^!|[!+@](?=\())/g;
/**
 * Designed to work only with simple paths: `dir\\file`.
 */ function $8a99295016a7aa2d$var$unixify(filepath) {
    return filepath.replace(/\\/g, '/');
}
module.exports.unixify = $8a99295016a7aa2d$var$unixify;
function $8a99295016a7aa2d$var$makeAbsolute(cwd, filepath) {
    return $igPDg$path.resolve(cwd, filepath);
}
module.exports.makeAbsolute = $8a99295016a7aa2d$var$makeAbsolute;
function $8a99295016a7aa2d$var$escape(pattern) {
    return pattern.replace($8a99295016a7aa2d$var$UNESCAPED_GLOB_SYMBOLS_RE, '\\$2');
}
module.exports.escape = $8a99295016a7aa2d$var$escape;
function $8a99295016a7aa2d$var$removeLeadingDotSegment(entry) {
    // We do not use `startsWith` because this is 10x slower than current implementation for some cases.
    // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
    if (entry.charAt(0) === '.') {
        const secondCharactery = entry.charAt(1);
        if (secondCharactery === '/' || secondCharactery === '\\') return entry.slice($8a99295016a7aa2d$var$LEADING_DOT_SEGMENT_CHARACTERS_COUNT);
    }
    return entry;
}
module.exports.removeLeadingDotSegment = $8a99295016a7aa2d$var$removeLeadingDotSegment;

});

parcelRequire.register("4brce", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.matchAny = module.exports.convertPatternsToRe = module.exports.makeRe = module.exports.getPatternParts = module.exports.expandBraceExpansion = module.exports.expandPatternsWithBraceExpansion = module.exports.isAffectDepthOfReadingPattern = module.exports.endsWithSlashGlobStar = module.exports.hasGlobStar = module.exports.getBaseDirectory = module.exports.isPatternRelatedToParentDirectory = module.exports.getPatternsOutsideCurrentDirectory = module.exports.getPatternsInsideCurrentDirectory = module.exports.getPositivePatterns = module.exports.getNegativePatterns = module.exports.isPositivePattern = module.exports.isNegativePattern = module.exports.convertToNegativePattern = module.exports.convertToPositivePattern = module.exports.isDynamicPattern = module.exports.isStaticPattern = void 0;


var $64Oh3 = parcelRequire("64Oh3");

var $fTFCn = parcelRequire("fTFCn");
const $30bd491e342eddaf$var$GLOBSTAR = '**';
const $30bd491e342eddaf$var$ESCAPE_SYMBOL = '\\';
const $30bd491e342eddaf$var$COMMON_GLOB_SYMBOLS_RE = /[*?]|^!/;
const $30bd491e342eddaf$var$REGEX_CHARACTER_CLASS_SYMBOLS_RE = /\[.*]/;
const $30bd491e342eddaf$var$REGEX_GROUP_SYMBOLS_RE = /(?:^|[^!*+?@])\(.*\|.*\)/;
const $30bd491e342eddaf$var$GLOB_EXTENSION_SYMBOLS_RE = /[!*+?@]\(.*\)/;
const $30bd491e342eddaf$var$BRACE_EXPANSIONS_SYMBOLS_RE = /{.*(?:,|\.\.).*}/;
function $30bd491e342eddaf$var$isStaticPattern(pattern, options = {
}) {
    return !$30bd491e342eddaf$var$isDynamicPattern(pattern, options);
}
module.exports.isStaticPattern = $30bd491e342eddaf$var$isStaticPattern;
function $30bd491e342eddaf$var$isDynamicPattern(pattern, options = {
}) {
    /**
     * A special case with an empty string is necessary for matching patterns that start with a forward slash.
     * An empty string cannot be a dynamic pattern.
     * For example, the pattern `/lib/*` will be spread into parts: '', 'lib', '*'.
     */ if (pattern === '') return false;
    /**
     * When the `caseSensitiveMatch` option is disabled, all patterns must be marked as dynamic, because we cannot check
     * filepath directly (without read directory).
     */ if (options.caseSensitiveMatch === false || pattern.includes($30bd491e342eddaf$var$ESCAPE_SYMBOL)) return true;
    if ($30bd491e342eddaf$var$COMMON_GLOB_SYMBOLS_RE.test(pattern) || $30bd491e342eddaf$var$REGEX_CHARACTER_CLASS_SYMBOLS_RE.test(pattern) || $30bd491e342eddaf$var$REGEX_GROUP_SYMBOLS_RE.test(pattern)) return true;
    if (options.extglob !== false && $30bd491e342eddaf$var$GLOB_EXTENSION_SYMBOLS_RE.test(pattern)) return true;
    if (options.braceExpansion !== false && $30bd491e342eddaf$var$BRACE_EXPANSIONS_SYMBOLS_RE.test(pattern)) return true;
    return false;
}
module.exports.isDynamicPattern = $30bd491e342eddaf$var$isDynamicPattern;
function $30bd491e342eddaf$var$convertToPositivePattern(pattern) {
    return $30bd491e342eddaf$var$isNegativePattern(pattern) ? pattern.slice(1) : pattern;
}
module.exports.convertToPositivePattern = $30bd491e342eddaf$var$convertToPositivePattern;
function $30bd491e342eddaf$var$convertToNegativePattern(pattern) {
    return '!' + pattern;
}
module.exports.convertToNegativePattern = $30bd491e342eddaf$var$convertToNegativePattern;
function $30bd491e342eddaf$var$isNegativePattern(pattern) {
    return pattern.startsWith('!') && pattern[1] !== '(';
}
module.exports.isNegativePattern = $30bd491e342eddaf$var$isNegativePattern;
function $30bd491e342eddaf$var$isPositivePattern(pattern) {
    return !$30bd491e342eddaf$var$isNegativePattern(pattern);
}
module.exports.isPositivePattern = $30bd491e342eddaf$var$isPositivePattern;
function $30bd491e342eddaf$var$getNegativePatterns(patterns) {
    return patterns.filter($30bd491e342eddaf$var$isNegativePattern);
}
module.exports.getNegativePatterns = $30bd491e342eddaf$var$getNegativePatterns;
function $30bd491e342eddaf$var$getPositivePatterns(patterns) {
    return patterns.filter($30bd491e342eddaf$var$isPositivePattern);
}
module.exports.getPositivePatterns = $30bd491e342eddaf$var$getPositivePatterns;
/**
 * Returns patterns that can be applied inside the current directory.
 *
 * @example
 * // ['./*', '*', 'a/*']
 * getPatternsInsideCurrentDirectory(['./*', '*', 'a/*', '../*', './../*'])
 */ function $30bd491e342eddaf$var$getPatternsInsideCurrentDirectory(patterns) {
    return patterns.filter((pattern)=>!$30bd491e342eddaf$var$isPatternRelatedToParentDirectory(pattern)
    );
}
module.exports.getPatternsInsideCurrentDirectory = $30bd491e342eddaf$var$getPatternsInsideCurrentDirectory;
/**
 * Returns patterns to be expanded relative to (outside) the current directory.
 *
 * @example
 * // ['../*', './../*']
 * getPatternsInsideCurrentDirectory(['./*', '*', 'a/*', '../*', './../*'])
 */ function $30bd491e342eddaf$var$getPatternsOutsideCurrentDirectory(patterns) {
    return patterns.filter($30bd491e342eddaf$var$isPatternRelatedToParentDirectory);
}
module.exports.getPatternsOutsideCurrentDirectory = $30bd491e342eddaf$var$getPatternsOutsideCurrentDirectory;
function $30bd491e342eddaf$var$isPatternRelatedToParentDirectory(pattern) {
    return pattern.startsWith('..') || pattern.startsWith('./..');
}
module.exports.isPatternRelatedToParentDirectory = $30bd491e342eddaf$var$isPatternRelatedToParentDirectory;
function $30bd491e342eddaf$var$getBaseDirectory(pattern) {
    return $64Oh3(pattern, {
        flipBackslashes: false
    });
}
module.exports.getBaseDirectory = $30bd491e342eddaf$var$getBaseDirectory;
function $30bd491e342eddaf$var$hasGlobStar(pattern) {
    return pattern.includes($30bd491e342eddaf$var$GLOBSTAR);
}
module.exports.hasGlobStar = $30bd491e342eddaf$var$hasGlobStar;
function $30bd491e342eddaf$var$endsWithSlashGlobStar(pattern) {
    return pattern.endsWith('/' + $30bd491e342eddaf$var$GLOBSTAR);
}
module.exports.endsWithSlashGlobStar = $30bd491e342eddaf$var$endsWithSlashGlobStar;
function $30bd491e342eddaf$var$isAffectDepthOfReadingPattern(pattern) {
    const basename = $igPDg$path.basename(pattern);
    return $30bd491e342eddaf$var$endsWithSlashGlobStar(pattern) || $30bd491e342eddaf$var$isStaticPattern(basename);
}
module.exports.isAffectDepthOfReadingPattern = $30bd491e342eddaf$var$isAffectDepthOfReadingPattern;
function $30bd491e342eddaf$var$expandPatternsWithBraceExpansion(patterns) {
    return patterns.reduce((collection, pattern)=>{
        return collection.concat($30bd491e342eddaf$var$expandBraceExpansion(pattern));
    }, []);
}
module.exports.expandPatternsWithBraceExpansion = $30bd491e342eddaf$var$expandPatternsWithBraceExpansion;
function $30bd491e342eddaf$var$expandBraceExpansion(pattern) {
    return $fTFCn.braces(pattern, {
        expand: true,
        nodupes: true
    });
}
module.exports.expandBraceExpansion = $30bd491e342eddaf$var$expandBraceExpansion;
function $30bd491e342eddaf$var$getPatternParts(pattern, options) {
    let { parts: parts  } = $fTFCn.scan(pattern, Object.assign(Object.assign({
    }, options), {
        parts: true
    }));
    /**
     * The scan method returns an empty array in some cases.
     * See micromatch/picomatch#58 for more details.
     */ if (parts.length === 0) parts = [
        pattern
    ];
    /**
     * The scan method does not return an empty part for the pattern with a forward slash.
     * This is another part of micromatch/picomatch#58.
     */ if (parts[0].startsWith('/')) {
        parts[0] = parts[0].slice(1);
        parts.unshift('');
    }
    return parts;
}
module.exports.getPatternParts = $30bd491e342eddaf$var$getPatternParts;
function $30bd491e342eddaf$var$makeRe(pattern, options) {
    return $fTFCn.makeRe(pattern, options);
}
module.exports.makeRe = $30bd491e342eddaf$var$makeRe;
function $30bd491e342eddaf$var$convertPatternsToRe(patterns, options) {
    return patterns.map((pattern)=>$30bd491e342eddaf$var$makeRe(pattern, options)
    );
}
module.exports.convertPatternsToRe = $30bd491e342eddaf$var$convertPatternsToRe;
function $30bd491e342eddaf$var$matchAny(entry, patternsRe) {
    return patternsRe.some((patternRe)=>patternRe.test(entry)
    );
}
module.exports.matchAny = $30bd491e342eddaf$var$matchAny;

});
parcelRequire.register("64Oh3", function(module, exports) {
'use strict';

var $jR9BM = parcelRequire("jR9BM");

var $46ca1d2e1cbc08f6$var$pathPosixDirname = $igPDg$path.posix.dirname;

var $46ca1d2e1cbc08f6$var$isWin32 = $igPDg$os.platform() === 'win32';
var $46ca1d2e1cbc08f6$var$slash = '/';
var $46ca1d2e1cbc08f6$var$backslash = /\\/g;
var $46ca1d2e1cbc08f6$var$enclosure = /[\{\[].*[\}\]]$/;
var $46ca1d2e1cbc08f6$var$globby = /(^|[^\\])([\{\[]|\([^\)]+$)/;
var $46ca1d2e1cbc08f6$var$escaped = /\\([\!\*\?\|\[\]\(\)\{\}])/g;
/**
 * @param {string} str
 * @param {Object} opts
 * @param {boolean} [opts.flipBackslashes=true]
 * @returns {string}
 */ module.exports = function globParent(str, opts) {
    var options = Object.assign({
        flipBackslashes: true
    }, opts);
    // flip windows path separators
    if (options.flipBackslashes && $46ca1d2e1cbc08f6$var$isWin32 && str.indexOf($46ca1d2e1cbc08f6$var$slash) < 0) str = str.replace($46ca1d2e1cbc08f6$var$backslash, $46ca1d2e1cbc08f6$var$slash);
    // special case for strings ending in enclosure containing path separator
    if ($46ca1d2e1cbc08f6$var$enclosure.test(str)) str += $46ca1d2e1cbc08f6$var$slash;
    // preserves full path in case of trailing path separator
    str += 'a';
    // remove path parts that are globby
    do str = $46ca1d2e1cbc08f6$var$pathPosixDirname(str);
    while ($jR9BM(str) || $46ca1d2e1cbc08f6$var$globby.test(str))
    // remove escape chars and return result
    return str.replace($46ca1d2e1cbc08f6$var$escaped, '$1');
};

});
parcelRequire.register("jR9BM", function(module, exports) {

var $2EHQO = parcelRequire("2EHQO");
var $e74a6b9841a26bde$var$chars = {
    '{': '}',
    '(': ')',
    '[': ']'
};
var $e74a6b9841a26bde$var$strictCheck = function(str) {
    if (str[0] === '!') return true;
    var index = 0;
    var pipeIndex = -2;
    var closeSquareIndex = -2;
    var closeCurlyIndex = -2;
    var closeParenIndex = -2;
    var backSlashIndex = -2;
    while(index < str.length){
        if (str[index] === '*') return true;
        if (str[index + 1] === '?' && /[\].+)]/.test(str[index])) return true;
        if (closeSquareIndex !== -1 && str[index] === '[' && str[index + 1] !== ']') {
            if (closeSquareIndex < index) closeSquareIndex = str.indexOf(']', index);
            if (closeSquareIndex > index) {
                if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) return true;
                backSlashIndex = str.indexOf('\\', index);
                if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) return true;
            }
        }
        if (closeCurlyIndex !== -1 && str[index] === '{' && str[index + 1] !== '}') {
            closeCurlyIndex = str.indexOf('}', index);
            if (closeCurlyIndex > index) {
                backSlashIndex = str.indexOf('\\', index);
                if (backSlashIndex === -1 || backSlashIndex > closeCurlyIndex) return true;
            }
        }
        if (closeParenIndex !== -1 && str[index] === '(' && str[index + 1] === '?' && /[:!=]/.test(str[index + 2]) && str[index + 3] !== ')') {
            closeParenIndex = str.indexOf(')', index);
            if (closeParenIndex > index) {
                backSlashIndex = str.indexOf('\\', index);
                if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) return true;
            }
        }
        if (pipeIndex !== -1 && str[index] === '(' && str[index + 1] !== '|') {
            if (pipeIndex < index) pipeIndex = str.indexOf('|', index);
            if (pipeIndex !== -1 && str[pipeIndex + 1] !== ')') {
                closeParenIndex = str.indexOf(')', pipeIndex);
                if (closeParenIndex > pipeIndex) {
                    backSlashIndex = str.indexOf('\\', pipeIndex);
                    if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) return true;
                }
            }
        }
        if (str[index] === '\\') {
            var open = str[index + 1];
            index += 2;
            var close = $e74a6b9841a26bde$var$chars[open];
            if (close) {
                var n = str.indexOf(close, index);
                if (n !== -1) index = n + 1;
            }
            if (str[index] === '!') return true;
        } else index++;
    }
    return false;
};
var $e74a6b9841a26bde$var$relaxedCheck = function(str) {
    if (str[0] === '!') return true;
    var index = 0;
    while(index < str.length){
        if (/[*?{}()[\]]/.test(str[index])) return true;
        if (str[index] === '\\') {
            var open = str[index + 1];
            index += 2;
            var close = $e74a6b9841a26bde$var$chars[open];
            if (close) {
                var n = str.indexOf(close, index);
                if (n !== -1) index = n + 1;
            }
            if (str[index] === '!') return true;
        } else index++;
    }
    return false;
};
module.exports = function isGlob(str, options) {
    if (typeof str !== 'string' || str === '') return false;
    if ($2EHQO(str)) return true;
    var check = $e74a6b9841a26bde$var$strictCheck;
    // optionally relax check
    if (options && options.strict === false) check = $e74a6b9841a26bde$var$relaxedCheck;
    return check(str);
};

});
parcelRequire.register("2EHQO", function(module, exports) {
/*!
 * is-extglob <https://github.com/jonschlinkert/is-extglob>
 *
 * Copyright (c) 2014-2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */ module.exports = function isExtglob(str) {
    if (typeof str !== 'string' || str === '') return false;
    var match;
    while(match = /(\\).|([@?!+*]\(.*\))/g.exec(str)){
        if (match[2]) return true;
        str = str.slice(match.index + match[0].length);
    }
    return false;
};

});



parcelRequire.register("fTFCn", function(module, exports) {
'use strict';


var $eJXPY = parcelRequire("eJXPY");

var $faTXT = parcelRequire("faTXT");

var $98nIR = parcelRequire("98nIR");
const $b92c4686ceccee1e$var$isEmptyString = (val)=>val === '' || val === './'
;
/**
 * Returns an array of strings that match one or more glob patterns.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm(list, patterns[, options]);
 *
 * console.log(mm(['a.js', 'a.txt'], ['*.js']));
 * //=> [ 'a.js' ]
 * ```
 * @param {String|Array<string>} `list` List of strings to match.
 * @param {String|Array<string>} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options)
 * @return {Array} Returns an array of matches
 * @summary false
 * @api public
 */ const $b92c4686ceccee1e$var$micromatch = (list, patterns, options)=>{
    patterns = [].concat(patterns);
    list = [].concat(list);
    let omit = new Set();
    let keep = new Set();
    let items = new Set();
    let negatives = 0;
    let onResult = (state)=>{
        items.add(state.output);
        if (options && options.onResult) options.onResult(state);
    };
    for(let i = 0; i < patterns.length; i++){
        let isMatch = $faTXT(String(patterns[i]), {
            ...options,
            onResult: onResult
        }, true);
        let negated = isMatch.state.negated || isMatch.state.negatedExtglob;
        if (negated) negatives++;
        for (let item of list){
            let matched = isMatch(item, true);
            let match = negated ? !matched.isMatch : matched.isMatch;
            if (!match) continue;
            if (negated) omit.add(matched.output);
            else {
                omit.delete(matched.output);
                keep.add(matched.output);
            }
        }
    }
    let result = negatives === patterns.length ? [
        ...items
    ] : [
        ...keep
    ];
    let matches = result.filter((item)=>!omit.has(item)
    );
    if (options && matches.length === 0) {
        if (options.failglob === true) throw new Error(`No matches found for "${patterns.join(', ')}"`);
        if (options.nonull === true || options.nullglob === true) return options.unescape ? patterns.map((p)=>p.replace(/\\/g, '')
        ) : patterns;
    }
    return matches;
};
/**
 * Backwards compatibility
 */ $b92c4686ceccee1e$var$micromatch.match = $b92c4686ceccee1e$var$micromatch;
/**
 * Returns a matcher function from the given glob `pattern` and `options`.
 * The returned function takes a string to match as its only argument and returns
 * true if the string is a match.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.matcher(pattern[, options]);
 *
 * const isMatch = mm.matcher('*.!(*a)');
 * console.log(isMatch('a.a')); //=> false
 * console.log(isMatch('a.b')); //=> true
 * ```
 * @param {String} `pattern` Glob pattern
 * @param {Object} `options`
 * @return {Function} Returns a matcher function.
 * @api public
 */ $b92c4686ceccee1e$var$micromatch.matcher = (pattern, options)=>$faTXT(pattern, options)
;
/**
 * Returns true if **any** of the given glob `patterns` match the specified `string`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.isMatch(string, patterns[, options]);
 *
 * console.log(mm.isMatch('a.a', ['b.*', '*.a'])); //=> true
 * console.log(mm.isMatch('a.a', 'b.*')); //=> false
 * ```
 * @param {String} `str` The string to test.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `[options]` See available [options](#options).
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */ $b92c4686ceccee1e$var$micromatch.isMatch = (str, patterns, options)=>$faTXT(patterns, options)(str)
;
/**
 * Backwards compatibility
 */ $b92c4686ceccee1e$var$micromatch.any = $b92c4686ceccee1e$var$micromatch.isMatch;
/**
 * Returns a list of strings that _**do not match any**_ of the given `patterns`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.not(list, patterns[, options]);
 *
 * console.log(mm.not(['a.a', 'b.b', 'c.c'], '*.a'));
 * //=> ['b.b', 'c.c']
 * ```
 * @param {Array} `list` Array of strings to match.
 * @param {String|Array} `patterns` One or more glob pattern to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Array} Returns an array of strings that **do not match** the given patterns.
 * @api public
 */ $b92c4686ceccee1e$var$micromatch.not = (list, patterns, options = {
})=>{
    patterns = [].concat(patterns).map(String);
    let result = new Set();
    let items = [];
    let onResult = (state)=>{
        if (options.onResult) options.onResult(state);
        items.push(state.output);
    };
    let matches = $b92c4686ceccee1e$var$micromatch(list, patterns, {
        ...options,
        onResult: onResult
    });
    for (let item of items)if (!matches.includes(item)) result.add(item);
    return [
        ...result
    ];
};
/**
 * Returns true if the given `string` contains the given pattern. Similar
 * to [.isMatch](#isMatch) but the pattern can match any part of the string.
 *
 * ```js
 * var mm = require('micromatch');
 * // mm.contains(string, pattern[, options]);
 *
 * console.log(mm.contains('aa/bb/cc', '*b'));
 * //=> true
 * console.log(mm.contains('aa/bb/cc', '*d'));
 * //=> false
 * ```
 * @param {String} `str` The string to match.
 * @param {String|Array} `patterns` Glob pattern to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if any of the patterns matches any part of `str`.
 * @api public
 */ $b92c4686ceccee1e$var$micromatch.contains = (str, pattern, options)=>{
    if (typeof str !== 'string') throw new TypeError(`Expected a string: "${$igPDg$util.inspect(str)}"`);
    if (Array.isArray(pattern)) return pattern.some((p)=>$b92c4686ceccee1e$var$micromatch.contains(str, p, options)
    );
    if (typeof pattern === 'string') {
        if ($b92c4686ceccee1e$var$isEmptyString(str) || $b92c4686ceccee1e$var$isEmptyString(pattern)) return false;
        if (str.includes(pattern) || str.startsWith('./') && str.slice(2).includes(pattern)) return true;
    }
    return $b92c4686ceccee1e$var$micromatch.isMatch(str, pattern, {
        ...options,
        contains: true
    });
};
/**
 * Filter the keys of the given object with the given `glob` pattern
 * and `options`. Does not attempt to match nested keys. If you need this feature,
 * use [glob-object][] instead.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.matchKeys(object, patterns[, options]);
 *
 * const obj = { aa: 'a', ab: 'b', ac: 'c' };
 * console.log(mm.matchKeys(obj, '*b'));
 * //=> { ab: 'b' }
 * ```
 * @param {Object} `object` The object with keys to filter.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Object} Returns an object with only keys that match the given patterns.
 * @api public
 */ $b92c4686ceccee1e$var$micromatch.matchKeys = (obj, patterns, options)=>{
    if (!$98nIR.isObject(obj)) throw new TypeError('Expected the first argument to be an object');
    let keys = $b92c4686ceccee1e$var$micromatch(Object.keys(obj), patterns, options);
    let res = {
    };
    for (let key of keys)res[key] = obj[key];
    return res;
};
/**
 * Returns true if some of the strings in the given `list` match any of the given glob `patterns`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.some(list, patterns[, options]);
 *
 * console.log(mm.some(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
 * // true
 * console.log(mm.some(['foo.js'], ['*.js', '!foo.js']));
 * // false
 * ```
 * @param {String|Array} `list` The string or array of strings to test. Returns as soon as the first match is found.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if any `patterns` matches any of the strings in `list`
 * @api public
 */ $b92c4686ceccee1e$var$micromatch.some = (list, patterns, options)=>{
    let items = [].concat(list);
    for (let pattern of [].concat(patterns)){
        let isMatch = $faTXT(String(pattern), options);
        if (items.some((item)=>isMatch(item)
        )) return true;
    }
    return false;
};
/**
 * Returns true if every string in the given `list` matches
 * any of the given glob `patterns`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.every(list, patterns[, options]);
 *
 * console.log(mm.every('foo.js', ['foo.js']));
 * // true
 * console.log(mm.every(['foo.js', 'bar.js'], ['*.js']));
 * // true
 * console.log(mm.every(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
 * // false
 * console.log(mm.every(['foo.js'], ['*.js', '!foo.js']));
 * // false
 * ```
 * @param {String|Array} `list` The string or array of strings to test.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if all `patterns` matches all of the strings in `list`
 * @api public
 */ $b92c4686ceccee1e$var$micromatch.every = (list, patterns, options)=>{
    let items = [].concat(list);
    for (let pattern of [].concat(patterns)){
        let isMatch = $faTXT(String(pattern), options);
        if (!items.every((item)=>isMatch(item)
        )) return false;
    }
    return true;
};
/**
 * Returns true if **all** of the given `patterns` match
 * the specified string.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.all(string, patterns[, options]);
 *
 * console.log(mm.all('foo.js', ['foo.js']));
 * // true
 *
 * console.log(mm.all('foo.js', ['*.js', '!foo.js']));
 * // false
 *
 * console.log(mm.all('foo.js', ['*.js', 'foo.js']));
 * // true
 *
 * console.log(mm.all('foo.js', ['*.js', 'f*', '*o*', '*o.js']));
 * // true
 * ```
 * @param {String|Array} `str` The string to test.
 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */ $b92c4686ceccee1e$var$micromatch.all = (str, patterns, options)=>{
    if (typeof str !== 'string') throw new TypeError(`Expected a string: "${$igPDg$util.inspect(str)}"`);
    return [].concat(patterns).every((p)=>$faTXT(p, options)(str)
    );
};
/**
 * Returns an array of matches captured by `pattern` in `string, or `null` if the pattern did not match.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.capture(pattern, string[, options]);
 *
 * console.log(mm.capture('test/*.js', 'test/foo.js'));
 * //=> ['foo']
 * console.log(mm.capture('test/*.js', 'foo/bar.css'));
 * //=> null
 * ```
 * @param {String} `glob` Glob pattern to use for matching.
 * @param {String} `input` String to match
 * @param {Object} `options` See available [options](#options) for changing how matches are performed
 * @return {Array|null} Returns an array of captures if the input matches the glob pattern, otherwise `null`.
 * @api public
 */ $b92c4686ceccee1e$var$micromatch.capture = (glob, input, options)=>{
    let posix = $98nIR.isWindows(options);
    let regex = $faTXT.makeRe(String(glob), {
        ...options,
        capture: true
    });
    let match = regex.exec(posix ? $98nIR.toPosixSlashes(input) : input);
    if (match) return match.slice(1).map((v)=>v === void 0 ? '' : v
    );
};
/**
 * Create a regular expression from the given glob `pattern`.
 *
 * ```js
 * const mm = require('micromatch');
 * // mm.makeRe(pattern[, options]);
 *
 * console.log(mm.makeRe('*.js'));
 * //=> /^(?:(\.[\\\/])?(?!\.)(?=.)[^\/]*?\.js)$/
 * ```
 * @param {String} `pattern` A glob pattern to convert to regex.
 * @param {Object} `options`
 * @return {RegExp} Returns a regex created from the given pattern.
 * @api public
 */ $b92c4686ceccee1e$var$micromatch.makeRe = (...args)=>$faTXT.makeRe(...args)
;
/**
 * Scan a glob pattern to separate the pattern into segments. Used
 * by the [split](#split) method.
 *
 * ```js
 * const mm = require('micromatch');
 * const state = mm.scan(pattern[, options]);
 * ```
 * @param {String} `pattern`
 * @param {Object} `options`
 * @return {Object} Returns an object with
 * @api public
 */ $b92c4686ceccee1e$var$micromatch.scan = (...args)=>$faTXT.scan(...args)
;
/**
 * Parse a glob pattern to create the source string for a regular
 * expression.
 *
 * ```js
 * const mm = require('micromatch');
 * const state = mm(pattern[, options]);
 * ```
 * @param {String} `glob`
 * @param {Object} `options`
 * @return {Object} Returns an object with useful properties and output to be used as regex source string.
 * @api public
 */ $b92c4686ceccee1e$var$micromatch.parse = (patterns, options)=>{
    let res = [];
    for (let pattern of [].concat(patterns || []))for (let str of $eJXPY(String(pattern), options))res.push($faTXT.parse(str, options));
    return res;
};
/**
 * Process the given brace `pattern`.
 *
 * ```js
 * const { braces } = require('micromatch');
 * console.log(braces('foo/{a,b,c}/bar'));
 * //=> [ 'foo/(a|b|c)/bar' ]
 *
 * console.log(braces('foo/{a,b,c}/bar', { expand: true }));
 * //=> [ 'foo/a/bar', 'foo/b/bar', 'foo/c/bar' ]
 * ```
 * @param {String} `pattern` String with brace pattern to process.
 * @param {Object} `options` Any [options](#options) to change how expansion is performed. See the [braces][] library for all available options.
 * @return {Array}
 * @api public
 */ $b92c4686ceccee1e$var$micromatch.braces = (pattern, options)=>{
    if (typeof pattern !== 'string') throw new TypeError('Expected a string');
    if (options && options.nobrace === true || !/\{.*\}/.test(pattern)) return [
        pattern
    ];
    return $eJXPY(pattern, options);
};
/**
 * Expand braces
 */ $b92c4686ceccee1e$var$micromatch.braceExpand = (pattern, options)=>{
    if (typeof pattern !== 'string') throw new TypeError('Expected a string');
    return $b92c4686ceccee1e$var$micromatch.braces(pattern, {
        ...options,
        expand: true
    });
};
/**
 * Expose micromatch
 */ module.exports = $b92c4686ceccee1e$var$micromatch;

});
parcelRequire.register("eJXPY", function(module, exports) {
'use strict';

var $2p2dz = parcelRequire("2p2dz");

var $igEIX = parcelRequire("igEIX");

var $lTpbj = parcelRequire("lTpbj");

var $jJJKk = parcelRequire("jJJKk");
/**
 * Expand the given pattern or create a regex-compatible string.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces('{a,b,c}', { compile: true })); //=> ['(a|b|c)']
 * console.log(braces('{a,b,c}')); //=> ['a', 'b', 'c']
 * ```
 * @param {String} `str`
 * @param {Object} `options`
 * @return {String}
 * @api public
 */ const $abb3af123296b277$var$braces = (input, options = {
})=>{
    let output = [];
    if (Array.isArray(input)) for (let pattern of input){
        let result = $abb3af123296b277$var$braces.create(pattern, options);
        if (Array.isArray(result)) output.push(...result);
        else output.push(result);
    }
    else output = [].concat($abb3af123296b277$var$braces.create(input, options));
    if (options && options.expand === true && options.nodupes === true) output = [
        ...new Set(output)
    ];
    return output;
};
/**
 * Parse the given `str` with the given `options`.
 *
 * ```js
 * // braces.parse(pattern, [, options]);
 * const ast = braces.parse('a/{b,c}/d');
 * console.log(ast);
 * ```
 * @param {String} pattern Brace pattern to parse
 * @param {Object} options
 * @return {Object} Returns an AST
 * @api public
 */ $abb3af123296b277$var$braces.parse = (input, options = {
})=>$jJJKk(input, options)
;
/**
 * Creates a braces string from an AST, or an AST node.
 *
 * ```js
 * const braces = require('braces');
 * let ast = braces.parse('foo/{a,b}/bar');
 * console.log(stringify(ast.nodes[2])); //=> '{a,b}'
 * ```
 * @param {String} `input` Brace pattern or AST.
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */ $abb3af123296b277$var$braces.stringify = (input, options = {
})=>{
    if (typeof input === 'string') return $2p2dz($abb3af123296b277$var$braces.parse(input, options), options);
    return $2p2dz(input, options);
};
/**
 * Compiles a brace pattern into a regex-compatible, optimized string.
 * This method is called by the main [braces](#braces) function by default.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces.compile('a/{b,c}/d'));
 * //=> ['a/(b|c)/d']
 * ```
 * @param {String} `input` Brace pattern or AST.
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */ $abb3af123296b277$var$braces.compile = (input, options = {
})=>{
    if (typeof input === 'string') input = $abb3af123296b277$var$braces.parse(input, options);
    return $igEIX(input, options);
};
/**
 * Expands a brace pattern into an array. This method is called by the
 * main [braces](#braces) function when `options.expand` is true. Before
 * using this method it's recommended that you read the [performance notes](#performance))
 * and advantages of using [.compile](#compile) instead.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces.expand('a/{b,c}/d'));
 * //=> ['a/b/d', 'a/c/d'];
 * ```
 * @param {String} `pattern` Brace pattern
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */ $abb3af123296b277$var$braces.expand = (input, options = {
})=>{
    if (typeof input === 'string') input = $abb3af123296b277$var$braces.parse(input, options);
    let result = $lTpbj(input, options);
    // filter out empty strings if specified
    if (options.noempty === true) result = result.filter(Boolean);
    // filter out duplicates if specified
    if (options.nodupes === true) result = [
        ...new Set(result)
    ];
    return result;
};
/**
 * Processes a brace pattern and returns either an expanded array
 * (if `options.expand` is true), a highly optimized regex-compatible string.
 * This method is called by the main [braces](#braces) function.
 *
 * ```js
 * const braces = require('braces');
 * console.log(braces.create('user-{200..300}/project-{a,b,c}-{1..10}'))
 * //=> 'user-(20[0-9]|2[1-9][0-9]|300)/project-(a|b|c)-([1-9]|10)'
 * ```
 * @param {String} `pattern` Brace pattern
 * @param {Object} `options`
 * @return {Array} Returns an array of expanded values.
 * @api public
 */ $abb3af123296b277$var$braces.create = (input, options = {
})=>{
    if (input === '' || input.length < 3) return [
        input
    ];
    return options.expand !== true ? $abb3af123296b277$var$braces.compile(input, options) : $abb3af123296b277$var$braces.expand(input, options);
};
/**
 * Expose "braces"
 */ module.exports = $abb3af123296b277$var$braces;

});
parcelRequire.register("2p2dz", function(module, exports) {
'use strict';

var $bc2Yw = parcelRequire("bc2Yw");
module.exports = (ast, options = {
})=>{
    let stringify = (node, parent = {
    })=>{
        let invalidBlock = options.escapeInvalid && $bc2Yw.isInvalidBrace(parent);
        let invalidNode = node.invalid === true && options.escapeInvalid === true;
        let output = '';
        if (node.value) {
            if ((invalidBlock || invalidNode) && $bc2Yw.isOpenOrClose(node)) return '\\' + node.value;
            return node.value;
        }
        if (node.value) return node.value;
        if (node.nodes) for (let child of node.nodes)output += stringify(child);
        return output;
    };
    return stringify(ast);
};

});
parcelRequire.register("bc2Yw", function(module, exports) {

$parcel$export(module.exports, "isInteger", () => $82631f7bc8d7582c$export$a287f47fed4544b8, (v) => $82631f7bc8d7582c$export$a287f47fed4544b8 = v);
$parcel$export(module.exports, "exceedsLimit", () => $82631f7bc8d7582c$export$fbadac39f36b1e16, (v) => $82631f7bc8d7582c$export$fbadac39f36b1e16 = v);
$parcel$export(module.exports, "encloseBrace", () => $82631f7bc8d7582c$export$ea0f721b77fd5acc, (v) => $82631f7bc8d7582c$export$ea0f721b77fd5acc = v);
$parcel$export(module.exports, "isInvalidBrace", () => $82631f7bc8d7582c$export$25a78c310c11373f, (v) => $82631f7bc8d7582c$export$25a78c310c11373f = v);
$parcel$export(module.exports, "isOpenOrClose", () => $82631f7bc8d7582c$export$582fc44003e67ec6, (v) => $82631f7bc8d7582c$export$582fc44003e67ec6 = v);
$parcel$export(module.exports, "reduce", () => $82631f7bc8d7582c$export$533b26079ad0b4b, (v) => $82631f7bc8d7582c$export$533b26079ad0b4b = v);
$parcel$export(module.exports, "flatten", () => $82631f7bc8d7582c$export$bffa455ba8c619a6, (v) => $82631f7bc8d7582c$export$bffa455ba8c619a6 = v);
var $82631f7bc8d7582c$export$a287f47fed4544b8;
/**
 * Find a node of the given type
 */ var $82631f7bc8d7582c$export$71aa6c912b956294;
/**
 * Find a node of the given type
 */ var $82631f7bc8d7582c$export$fbadac39f36b1e16;
/**
 * Escape the given node with '\\' before node.value
 */ var $82631f7bc8d7582c$export$92e39b1e2c1e6e56;
/**
 * Returns true if the given brace node should be enclosed in literal braces
 */ var $82631f7bc8d7582c$export$ea0f721b77fd5acc;
/**
 * Returns true if a brace node is invalid.
 */ var $82631f7bc8d7582c$export$25a78c310c11373f;
/**
 * Returns true if a node is an open or close node
 */ var $82631f7bc8d7582c$export$582fc44003e67ec6;
/**
 * Reduce an array of text nodes.
 */ var $82631f7bc8d7582c$export$533b26079ad0b4b;
/**
 * Flatten an array
 */ var $82631f7bc8d7582c$export$bffa455ba8c619a6;
'use strict';
$82631f7bc8d7582c$export$a287f47fed4544b8 = (num)=>{
    if (typeof num === 'number') return Number.isInteger(num);
    if (typeof num === 'string' && num.trim() !== '') return Number.isInteger(Number(num));
    return false;
};
$82631f7bc8d7582c$export$71aa6c912b956294 = (node1, type)=>node1.nodes.find((node)=>node.type === type
    )
;
$82631f7bc8d7582c$export$fbadac39f36b1e16 = (min, max, step = 1, limit)=>{
    if (limit === false) return false;
    if (!$82631f7bc8d7582c$export$a287f47fed4544b8(min) || !$82631f7bc8d7582c$export$a287f47fed4544b8(max)) return false;
    return (Number(max) - Number(min)) / Number(step) >= limit;
};
$82631f7bc8d7582c$export$92e39b1e2c1e6e56 = (block, n = 0, type)=>{
    let node = block.nodes[n];
    if (!node) return;
    if (type && node.type === type || node.type === 'open' || node.type === 'close') {
        if (node.escaped !== true) {
            node.value = '\\' + node.value;
            node.escaped = true;
        }
    }
};
$82631f7bc8d7582c$export$ea0f721b77fd5acc = (node)=>{
    if (node.type !== 'brace') return false;
    if (node.commas >> 0 + node.ranges >> 0 === 0) {
        node.invalid = true;
        return true;
    }
    return false;
};
$82631f7bc8d7582c$export$25a78c310c11373f = (block)=>{
    if (block.type !== 'brace') return false;
    if (block.invalid === true || block.dollar) return true;
    if (block.commas >> 0 + block.ranges >> 0 === 0) {
        block.invalid = true;
        return true;
    }
    if (block.open !== true || block.close !== true) {
        block.invalid = true;
        return true;
    }
    return false;
};
$82631f7bc8d7582c$export$582fc44003e67ec6 = (node)=>{
    if (node.type === 'open' || node.type === 'close') return true;
    return node.open === true || node.close === true;
};
$82631f7bc8d7582c$export$533b26079ad0b4b = (nodes)=>nodes.reduce((acc, node)=>{
        if (node.type === 'text') acc.push(node.value);
        if (node.type === 'range') node.type = 'text';
        return acc;
    }, [])
;
$82631f7bc8d7582c$export$bffa455ba8c619a6 = (...args)=>{
    const result = [];
    const flat = (arr)=>{
        for(let i = 0; i < arr.length; i++){
            let ele = arr[i];
            Array.isArray(ele) ? flat(ele, result) : ele !== void 0 && result.push(ele);
        }
        return result;
    };
    flat(args);
    return result;
};

});


parcelRequire.register("igEIX", function(module, exports) {
'use strict';

var $fYJjs = parcelRequire("fYJjs");

var $bc2Yw = parcelRequire("bc2Yw");
const $d4c94f97886df01f$var$compile = (ast, options = {
})=>{
    let walk = (node, parent = {
    })=>{
        let invalidBlock = $bc2Yw.isInvalidBrace(parent);
        let invalidNode = node.invalid === true && options.escapeInvalid === true;
        let invalid = invalidBlock === true || invalidNode === true;
        let prefix = options.escapeInvalid === true ? '\\' : '';
        let output = '';
        if (node.isOpen === true) return prefix + node.value;
        if (node.isClose === true) return prefix + node.value;
        if (node.type === 'open') return invalid ? prefix + node.value : '(';
        if (node.type === 'close') return invalid ? prefix + node.value : ')';
        if (node.type === 'comma') return node.prev.type === 'comma' ? '' : invalid ? node.value : '|';
        if (node.value) return node.value;
        if (node.nodes && node.ranges > 0) {
            let args = $bc2Yw.reduce(node.nodes);
            let range = $fYJjs(...args, {
                ...options,
                wrap: false,
                toRegex: true
            });
            if (range.length !== 0) return args.length > 1 && range.length > 1 ? `(${range})` : range;
        }
        if (node.nodes) for (let child of node.nodes)output += walk(child, node);
        return output;
    };
    return walk(ast);
};
module.exports = $d4c94f97886df01f$var$compile;

});
parcelRequire.register("fYJjs", function(module, exports) {
/*!
 * fill-range <https://github.com/jonschlinkert/fill-range>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Licensed under the MIT License.
 */ 'use strict';


var $h7Brj = parcelRequire("h7Brj");
const $ba1f9bc7aa3799f9$var$isObject = (val)=>val !== null && typeof val === 'object' && !Array.isArray(val)
;
const $ba1f9bc7aa3799f9$var$transform = (toNumber)=>{
    return (value)=>toNumber === true ? Number(value) : String(value)
    ;
};
const $ba1f9bc7aa3799f9$var$isValidValue = (value)=>{
    return typeof value === 'number' || typeof value === 'string' && value !== '';
};
const $ba1f9bc7aa3799f9$var$isNumber = (num)=>Number.isInteger(+num)
;
const $ba1f9bc7aa3799f9$var$zeros = (input)=>{
    let value = `${input}`;
    let index = -1;
    if (value[0] === '-') value = value.slice(1);
    if (value === '0') return false;
    while(value[++index] === '0');
    return index > 0;
};
const $ba1f9bc7aa3799f9$var$stringify = (start, end, options)=>{
    if (typeof start === 'string' || typeof end === 'string') return true;
    return options.stringify === true;
};
const $ba1f9bc7aa3799f9$var$pad = (input, maxLength, toNumber)=>{
    if (maxLength > 0) {
        let dash = input[0] === '-' ? '-' : '';
        if (dash) input = input.slice(1);
        input = dash + input.padStart(dash ? maxLength - 1 : maxLength, '0');
    }
    if (toNumber === false) return String(input);
    return input;
};
const $ba1f9bc7aa3799f9$var$toMaxLen = (input, maxLength)=>{
    let negative = input[0] === '-' ? '-' : '';
    if (negative) {
        input = input.slice(1);
        maxLength--;
    }
    while(input.length < maxLength)input = '0' + input;
    return negative ? '-' + input : input;
};
const $ba1f9bc7aa3799f9$var$toSequence = (parts, options)=>{
    parts.negatives.sort((a, b)=>a < b ? -1 : a > b ? 1 : 0
    );
    parts.positives.sort((a, b)=>a < b ? -1 : a > b ? 1 : 0
    );
    let prefix = options.capture ? '' : '?:';
    let positives = '';
    let negatives = '';
    let result;
    if (parts.positives.length) positives = parts.positives.join('|');
    if (parts.negatives.length) negatives = `-(${prefix}${parts.negatives.join('|')})`;
    if (positives && negatives) result = `${positives}|${negatives}`;
    else result = positives || negatives;
    if (options.wrap) return `(${prefix}${result})`;
    return result;
};
const $ba1f9bc7aa3799f9$var$toRange = (a, b, isNumbers, options)=>{
    if (isNumbers) return $h7Brj(a, b, {
        wrap: false,
        ...options
    });
    let start = String.fromCharCode(a);
    if (a === b) return start;
    let stop = String.fromCharCode(b);
    return `[${start}-${stop}]`;
};
const $ba1f9bc7aa3799f9$var$toRegex = (start, end, options)=>{
    if (Array.isArray(start)) {
        let wrap = options.wrap === true;
        let prefix = options.capture ? '' : '?:';
        return wrap ? `(${prefix}${start.join('|')})` : start.join('|');
    }
    return $h7Brj(start, end, options);
};
const $ba1f9bc7aa3799f9$var$rangeError = (...args)=>{
    return new RangeError('Invalid range arguments: ' + $igPDg$util.inspect(...args));
};
const $ba1f9bc7aa3799f9$var$invalidRange = (start, end, options)=>{
    if (options.strictRanges === true) throw $ba1f9bc7aa3799f9$var$rangeError([
        start,
        end
    ]);
    return [];
};
const $ba1f9bc7aa3799f9$var$invalidStep = (step, options)=>{
    if (options.strictRanges === true) throw new TypeError(`Expected step "${step}" to be a number`);
    return [];
};
const $ba1f9bc7aa3799f9$var$fillNumbers = (start, end, step = 1, options = {
})=>{
    let a = Number(start);
    let b = Number(end);
    if (!Number.isInteger(a) || !Number.isInteger(b)) {
        if (options.strictRanges === true) throw $ba1f9bc7aa3799f9$var$rangeError([
            start,
            end
        ]);
        return [];
    }
    // fix negative zero
    if (a === 0) a = 0;
    if (b === 0) b = 0;
    let descending = a > b;
    let startString = String(start);
    let endString = String(end);
    let stepString = String(step);
    step = Math.max(Math.abs(step), 1);
    let padded = $ba1f9bc7aa3799f9$var$zeros(startString) || $ba1f9bc7aa3799f9$var$zeros(endString) || $ba1f9bc7aa3799f9$var$zeros(stepString);
    let maxLen = padded ? Math.max(startString.length, endString.length, stepString.length) : 0;
    let toNumber = padded === false && $ba1f9bc7aa3799f9$var$stringify(start, end, options) === false;
    let format = options.transform || $ba1f9bc7aa3799f9$var$transform(toNumber);
    if (options.toRegex && step === 1) return $ba1f9bc7aa3799f9$var$toRange($ba1f9bc7aa3799f9$var$toMaxLen(start, maxLen), $ba1f9bc7aa3799f9$var$toMaxLen(end, maxLen), true, options);
    let parts = {
        negatives: [],
        positives: []
    };
    let push = (num)=>parts[num < 0 ? 'negatives' : 'positives'].push(Math.abs(num))
    ;
    let range = [];
    let index = 0;
    while(descending ? a >= b : a <= b){
        if (options.toRegex === true && step > 1) push(a);
        else range.push($ba1f9bc7aa3799f9$var$pad(format(a, index), maxLen, toNumber));
        a = descending ? a - step : a + step;
        index++;
    }
    if (options.toRegex === true) return step > 1 ? $ba1f9bc7aa3799f9$var$toSequence(parts, options) : $ba1f9bc7aa3799f9$var$toRegex(range, null, {
        wrap: false,
        ...options
    });
    return range;
};
const $ba1f9bc7aa3799f9$var$fillLetters = (start, end, step = 1, options = {
})=>{
    if (!$ba1f9bc7aa3799f9$var$isNumber(start) && start.length > 1 || !$ba1f9bc7aa3799f9$var$isNumber(end) && end.length > 1) return $ba1f9bc7aa3799f9$var$invalidRange(start, end, options);
    let format = options.transform || ((val)=>String.fromCharCode(val)
    );
    let a = `${start}`.charCodeAt(0);
    let b = `${end}`.charCodeAt(0);
    let descending = a > b;
    let min = Math.min(a, b);
    let max = Math.max(a, b);
    if (options.toRegex && step === 1) return $ba1f9bc7aa3799f9$var$toRange(min, max, false, options);
    let range = [];
    let index = 0;
    while(descending ? a >= b : a <= b){
        range.push(format(a, index));
        a = descending ? a - step : a + step;
        index++;
    }
    if (options.toRegex === true) return $ba1f9bc7aa3799f9$var$toRegex(range, null, {
        wrap: false,
        options: options
    });
    return range;
};
const $ba1f9bc7aa3799f9$var$fill = (start, end, step, options = {
})=>{
    if (end == null && $ba1f9bc7aa3799f9$var$isValidValue(start)) return [
        start
    ];
    if (!$ba1f9bc7aa3799f9$var$isValidValue(start) || !$ba1f9bc7aa3799f9$var$isValidValue(end)) return $ba1f9bc7aa3799f9$var$invalidRange(start, end, options);
    if (typeof step === 'function') return $ba1f9bc7aa3799f9$var$fill(start, end, 1, {
        transform: step
    });
    if ($ba1f9bc7aa3799f9$var$isObject(step)) return $ba1f9bc7aa3799f9$var$fill(start, end, 0, step);
    let opts = {
        ...options
    };
    if (opts.capture === true) opts.wrap = true;
    step = step || opts.step || 1;
    if (!$ba1f9bc7aa3799f9$var$isNumber(step)) {
        if (step != null && !$ba1f9bc7aa3799f9$var$isObject(step)) return $ba1f9bc7aa3799f9$var$invalidStep(step, opts);
        return $ba1f9bc7aa3799f9$var$fill(start, end, 1, step);
    }
    if ($ba1f9bc7aa3799f9$var$isNumber(start) && $ba1f9bc7aa3799f9$var$isNumber(end)) return $ba1f9bc7aa3799f9$var$fillNumbers(start, end, step, opts);
    return $ba1f9bc7aa3799f9$var$fillLetters(start, end, Math.max(Math.abs(step), 1), opts);
};
module.exports = $ba1f9bc7aa3799f9$var$fill;

});
parcelRequire.register("h7Brj", function(module, exports) {
/*!
 * to-regex-range <https://github.com/micromatch/to-regex-range>
 *
 * Copyright (c) 2015-present, Jon Schlinkert.
 * Released under the MIT License.
 */ 'use strict';

var $NvH8y = parcelRequire("NvH8y");
const $c77021d09a8f8b11$var$toRegexRange = (min, max, options)=>{
    if ($NvH8y(min) === false) throw new TypeError('toRegexRange: expected the first argument to be a number');
    if (max === void 0 || min === max) return String(min);
    if ($NvH8y(max) === false) throw new TypeError('toRegexRange: expected the second argument to be a number.');
    let opts = {
        relaxZeros: true,
        ...options
    };
    if (typeof opts.strictZeros === 'boolean') opts.relaxZeros = opts.strictZeros === false;
    let relax = String(opts.relaxZeros);
    let shorthand = String(opts.shorthand);
    let capture = String(opts.capture);
    let wrap = String(opts.wrap);
    let cacheKey = min + ':' + max + '=' + relax + shorthand + capture + wrap;
    if ($c77021d09a8f8b11$var$toRegexRange.cache.hasOwnProperty(cacheKey)) return $c77021d09a8f8b11$var$toRegexRange.cache[cacheKey].result;
    let a = Math.min(min, max);
    let b = Math.max(min, max);
    if (Math.abs(a - b) === 1) {
        let result = min + '|' + max;
        if (opts.capture) return `(${result})`;
        if (opts.wrap === false) return result;
        return `(?:${result})`;
    }
    let isPadded = $c77021d09a8f8b11$var$hasPadding(min) || $c77021d09a8f8b11$var$hasPadding(max);
    let state = {
        min: min,
        max: max,
        a: a,
        b: b
    };
    let positives = [];
    let negatives = [];
    if (isPadded) {
        state.isPadded = isPadded;
        state.maxLen = String(state.max).length;
    }
    if (a < 0) {
        let newMin = b < 0 ? Math.abs(b) : 1;
        negatives = $c77021d09a8f8b11$var$splitToPatterns(newMin, Math.abs(a), state, opts);
        a = state.a = 0;
    }
    if (b >= 0) positives = $c77021d09a8f8b11$var$splitToPatterns(a, b, state, opts);
    state.negatives = negatives;
    state.positives = positives;
    state.result = $c77021d09a8f8b11$var$collatePatterns(negatives, positives, opts);
    if (opts.capture === true) state.result = `(${state.result})`;
    else if (opts.wrap !== false && positives.length + negatives.length > 1) state.result = `(?:${state.result})`;
    $c77021d09a8f8b11$var$toRegexRange.cache[cacheKey] = state;
    return state.result;
};
function $c77021d09a8f8b11$var$collatePatterns(neg, pos, options) {
    let onlyNegative = $c77021d09a8f8b11$var$filterPatterns(neg, pos, '-', false, options) || [];
    let onlyPositive = $c77021d09a8f8b11$var$filterPatterns(pos, neg, '', false, options) || [];
    let intersected = $c77021d09a8f8b11$var$filterPatterns(neg, pos, '-?', true, options) || [];
    let subpatterns = onlyNegative.concat(intersected).concat(onlyPositive);
    return subpatterns.join('|');
}
function $c77021d09a8f8b11$var$splitToRanges(min, max) {
    let nines = 1;
    let zeros = 1;
    let stop = $c77021d09a8f8b11$var$countNines(min, nines);
    let stops = new Set([
        max
    ]);
    while(min <= stop && stop <= max){
        stops.add(stop);
        nines += 1;
        stop = $c77021d09a8f8b11$var$countNines(min, nines);
    }
    stop = $c77021d09a8f8b11$var$countZeros(max + 1, zeros) - 1;
    while(min < stop && stop <= max){
        stops.add(stop);
        zeros += 1;
        stop = $c77021d09a8f8b11$var$countZeros(max + 1, zeros) - 1;
    }
    stops = [
        ...stops
    ];
    stops.sort($c77021d09a8f8b11$var$compare);
    return stops;
}
/**
 * Convert a range to a regex pattern
 * @param {Number} `start`
 * @param {Number} `stop`
 * @return {String}
 */ function $c77021d09a8f8b11$var$rangeToPattern(start, stop, options) {
    if (start === stop) return {
        pattern: start,
        count: [],
        digits: 0
    };
    let zipped = $c77021d09a8f8b11$var$zip(start, stop);
    let digits = zipped.length;
    let pattern = '';
    let count = 0;
    for(let i = 0; i < digits; i++){
        let [startDigit, stopDigit] = zipped[i];
        if (startDigit === stopDigit) pattern += startDigit;
        else if (startDigit !== '0' || stopDigit !== '9') pattern += $c77021d09a8f8b11$var$toCharacterClass(startDigit, stopDigit, options);
        else count++;
    }
    if (count) pattern += options.shorthand === true ? '\\d' : '[0-9]';
    return {
        pattern: pattern,
        count: [
            count
        ],
        digits: digits
    };
}
function $c77021d09a8f8b11$var$splitToPatterns(min, max, tok, options) {
    let ranges = $c77021d09a8f8b11$var$splitToRanges(min, max);
    let tokens = [];
    let start = min;
    let prev;
    for(let i = 0; i < ranges.length; i++){
        let max = ranges[i];
        let obj = $c77021d09a8f8b11$var$rangeToPattern(String(start), String(max), options);
        let zeros = '';
        if (!tok.isPadded && prev && prev.pattern === obj.pattern) {
            if (prev.count.length > 1) prev.count.pop();
            prev.count.push(obj.count[0]);
            prev.string = prev.pattern + $c77021d09a8f8b11$var$toQuantifier(prev.count);
            start = max + 1;
            continue;
        }
        if (tok.isPadded) zeros = $c77021d09a8f8b11$var$padZeros(max, tok, options);
        obj.string = zeros + obj.pattern + $c77021d09a8f8b11$var$toQuantifier(obj.count);
        tokens.push(obj);
        start = max + 1;
        prev = obj;
    }
    return tokens;
}
function $c77021d09a8f8b11$var$filterPatterns(arr, comparison, prefix, intersection, options) {
    let result = [];
    for (let ele of arr){
        let { string: string  } = ele;
        // only push if _both_ are negative...
        if (!intersection && !$c77021d09a8f8b11$var$contains(comparison, 'string', string)) result.push(prefix + string);
        // or _both_ are positive
        if (intersection && $c77021d09a8f8b11$var$contains(comparison, 'string', string)) result.push(prefix + string);
    }
    return result;
}
/**
 * Zip strings
 */ function $c77021d09a8f8b11$var$zip(a, b) {
    let arr = [];
    for(let i = 0; i < a.length; i++)arr.push([
        a[i],
        b[i]
    ]);
    return arr;
}
function $c77021d09a8f8b11$var$compare(a, b) {
    return a > b ? 1 : b > a ? -1 : 0;
}
function $c77021d09a8f8b11$var$contains(arr, key, val) {
    return arr.some((ele)=>ele[key] === val
    );
}
function $c77021d09a8f8b11$var$countNines(min, len) {
    return Number(String(min).slice(0, -len) + '9'.repeat(len));
}
function $c77021d09a8f8b11$var$countZeros(integer, zeros) {
    return integer - integer % Math.pow(10, zeros);
}
function $c77021d09a8f8b11$var$toQuantifier(digits) {
    let [start = 0, stop = ''] = digits;
    if (stop || start > 1) return `{${start + (stop ? ',' + stop : '')}}`;
    return '';
}
function $c77021d09a8f8b11$var$toCharacterClass(a, b, options) {
    return `[${a}${b - a === 1 ? '' : '-'}${b}]`;
}
function $c77021d09a8f8b11$var$hasPadding(str) {
    return /^-?(0+)\d/.test(str);
}
function $c77021d09a8f8b11$var$padZeros(value, tok, options) {
    if (!tok.isPadded) return value;
    let diff = Math.abs(tok.maxLen - String(value).length);
    let relax = options.relaxZeros !== false;
    switch(diff){
        case 0:
            return '';
        case 1:
            return relax ? '0?' : '0';
        case 2:
            return relax ? '0{0,2}' : '00';
        default:
            return relax ? `0{0,${diff}}` : `0{${diff}}`;
    }
}
/**
 * Cache
 */ $c77021d09a8f8b11$var$toRegexRange.cache = {
};
$c77021d09a8f8b11$var$toRegexRange.clearCache = ()=>$c77021d09a8f8b11$var$toRegexRange.cache = {
    }
;
/**
 * Expose `toRegexRange`
 */ module.exports = $c77021d09a8f8b11$var$toRegexRange;

});
parcelRequire.register("NvH8y", function(module, exports) {
/*!
 * is-number <https://github.com/jonschlinkert/is-number>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Released under the MIT License.
 */ 'use strict';
module.exports = function(num) {
    if (typeof num === 'number') return num - num === 0;
    if (typeof num === 'string' && num.trim() !== '') return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
    return false;
};

});




parcelRequire.register("lTpbj", function(module, exports) {
'use strict';

var $fYJjs = parcelRequire("fYJjs");

var $2p2dz = parcelRequire("2p2dz");

var $bc2Yw = parcelRequire("bc2Yw");
const $ff024487ec088115$var$append = (queue = '', stash = '', enclose = false)=>{
    let result = [];
    queue = [].concat(queue);
    stash = [].concat(stash);
    if (!stash.length) return queue;
    if (!queue.length) return enclose ? $bc2Yw.flatten(stash).map((ele)=>`{${ele}}`
    ) : stash;
    for (let item of queue){
        if (Array.isArray(item)) for (let value of item)result.push($ff024487ec088115$var$append(value, stash, enclose));
        else for (let ele of stash){
            if (enclose === true && typeof ele === 'string') ele = `{${ele}}`;
            result.push(Array.isArray(ele) ? $ff024487ec088115$var$append(item, ele, enclose) : item + ele);
        }
    }
    return $bc2Yw.flatten(result);
};
const $ff024487ec088115$var$expand = (ast, options = {
})=>{
    let rangeLimit = options.rangeLimit === void 0 ? 1000 : options.rangeLimit;
    let walk = (node, parent = {
    })=>{
        node.queue = [];
        let p = parent;
        let q = parent.queue;
        while(p.type !== 'brace' && p.type !== 'root' && p.parent){
            p = p.parent;
            q = p.queue;
        }
        if (node.invalid || node.dollar) {
            q.push($ff024487ec088115$var$append(q.pop(), $2p2dz(node, options)));
            return;
        }
        if (node.type === 'brace' && node.invalid !== true && node.nodes.length === 2) {
            q.push($ff024487ec088115$var$append(q.pop(), [
                '{}'
            ]));
            return;
        }
        if (node.nodes && node.ranges > 0) {
            let args = $bc2Yw.reduce(node.nodes);
            if ($bc2Yw.exceedsLimit(...args, options.step, rangeLimit)) throw new RangeError('expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.');
            let range = $fYJjs(...args, options);
            if (range.length === 0) range = $2p2dz(node, options);
            q.push($ff024487ec088115$var$append(q.pop(), range));
            node.nodes = [];
            return;
        }
        let enclose = $bc2Yw.encloseBrace(node);
        let queue = node.queue;
        let block = node;
        while(block.type !== 'brace' && block.type !== 'root' && block.parent){
            block = block.parent;
            queue = block.queue;
        }
        for(let i = 0; i < node.nodes.length; i++){
            let child = node.nodes[i];
            if (child.type === 'comma' && node.type === 'brace') {
                if (i === 1) queue.push('');
                queue.push('');
                continue;
            }
            if (child.type === 'close') {
                q.push($ff024487ec088115$var$append(q.pop(), queue, enclose));
                continue;
            }
            if (child.value && child.type !== 'open') {
                queue.push($ff024487ec088115$var$append(queue.pop(), child.value));
                continue;
            }
            if (child.nodes) walk(child, node);
        }
        return queue;
    };
    return $bc2Yw.flatten(walk(ast));
};
module.exports = $ff024487ec088115$var$expand;

});

parcelRequire.register("jJJKk", function(module, exports) {
'use strict';

var $2p2dz = parcelRequire("2p2dz");

var $kJLh5 = parcelRequire("kJLh5");
var $e5e5b48e7d8622be$require$MAX_LENGTH = $kJLh5.MAX_LENGTH;
var $e5e5b48e7d8622be$require$CHAR_BACKSLASH = $kJLh5.CHAR_BACKSLASH;
var $e5e5b48e7d8622be$require$CHAR_BACKTICK = $kJLh5.CHAR_BACKTICK;
var $e5e5b48e7d8622be$require$CHAR_COMMA = $kJLh5.CHAR_COMMA;
var $e5e5b48e7d8622be$require$CHAR_DOT = $kJLh5.CHAR_DOT;
var $e5e5b48e7d8622be$require$CHAR_LEFT_PARENTHESES = $kJLh5.CHAR_LEFT_PARENTHESES;
var $e5e5b48e7d8622be$require$CHAR_RIGHT_PARENTHESES = $kJLh5.CHAR_RIGHT_PARENTHESES;
var $e5e5b48e7d8622be$require$CHAR_LEFT_CURLY_BRACE = $kJLh5.CHAR_LEFT_CURLY_BRACE;
var $e5e5b48e7d8622be$require$CHAR_RIGHT_CURLY_BRACE = $kJLh5.CHAR_RIGHT_CURLY_BRACE;
var $e5e5b48e7d8622be$require$CHAR_LEFT_SQUARE_BRACKET = $kJLh5.CHAR_LEFT_SQUARE_BRACKET;
var $e5e5b48e7d8622be$require$CHAR_RIGHT_SQUARE_BRACKET = $kJLh5.CHAR_RIGHT_SQUARE_BRACKET;
var $e5e5b48e7d8622be$require$CHAR_DOUBLE_QUOTE = $kJLh5.CHAR_DOUBLE_QUOTE;
var $e5e5b48e7d8622be$require$CHAR_SINGLE_QUOTE = $kJLh5.CHAR_SINGLE_QUOTE;
var $e5e5b48e7d8622be$require$CHAR_NO_BREAK_SPACE = $kJLh5.CHAR_NO_BREAK_SPACE;
var $e5e5b48e7d8622be$require$CHAR_ZERO_WIDTH_NOBREAK_SPACE = $kJLh5.CHAR_ZERO_WIDTH_NOBREAK_SPACE;
/**
 * parse
 */ const $e5e5b48e7d8622be$var$parse = (input, options = {
})=>{
    if (typeof input !== 'string') throw new TypeError('Expected a string');
    let opts = options || {
    };
    let max = typeof opts.maxLength === 'number' ? Math.min($e5e5b48e7d8622be$require$MAX_LENGTH, opts.maxLength) : $e5e5b48e7d8622be$require$MAX_LENGTH;
    if (input.length > max) throw new SyntaxError(`Input length (${input.length}), exceeds max characters (${max})`);
    let ast = {
        type: 'root',
        input: input,
        nodes: []
    };
    let stack = [
        ast
    ];
    let block = ast;
    let prev = ast;
    let brackets = 0;
    let length = input.length;
    let index = 0;
    let depth = 0;
    let value;
    let memo = {
    };
    /**
   * Helpers
   */ const advance = ()=>input[index++]
    ;
    const push = (node)=>{
        if (node.type === 'text' && prev.type === 'dot') prev.type = 'text';
        if (prev && prev.type === 'text' && node.type === 'text') {
            prev.value += node.value;
            return;
        }
        block.nodes.push(node);
        node.parent = block;
        node.prev = prev;
        prev = node;
        return node;
    };
    push({
        type: 'bos'
    });
    while(index < length){
        block = stack[stack.length - 1];
        value = advance();
        /**
     * Invalid chars
     */ if (value === $e5e5b48e7d8622be$require$CHAR_ZERO_WIDTH_NOBREAK_SPACE || value === $e5e5b48e7d8622be$require$CHAR_NO_BREAK_SPACE) continue;
        /**
     * Escaped chars
     */ if (value === $e5e5b48e7d8622be$require$CHAR_BACKSLASH) {
            push({
                type: 'text',
                value: (options.keepEscaping ? value : '') + advance()
            });
            continue;
        }
        /**
     * Right square bracket (literal): ']'
     */ if (value === $e5e5b48e7d8622be$require$CHAR_RIGHT_SQUARE_BRACKET) {
            push({
                type: 'text',
                value: '\\' + value
            });
            continue;
        }
        /**
     * Left square bracket: '['
     */ if (value === $e5e5b48e7d8622be$require$CHAR_LEFT_SQUARE_BRACKET) {
            brackets++;
            let closed = true;
            let next;
            while(index < length && (next = advance())){
                value += next;
                if (next === $e5e5b48e7d8622be$require$CHAR_LEFT_SQUARE_BRACKET) {
                    brackets++;
                    continue;
                }
                if (next === $e5e5b48e7d8622be$require$CHAR_BACKSLASH) {
                    value += advance();
                    continue;
                }
                if (next === $e5e5b48e7d8622be$require$CHAR_RIGHT_SQUARE_BRACKET) {
                    brackets--;
                    if (brackets === 0) break;
                }
            }
            push({
                type: 'text',
                value: value
            });
            continue;
        }
        /**
     * Parentheses
     */ if (value === $e5e5b48e7d8622be$require$CHAR_LEFT_PARENTHESES) {
            block = push({
                type: 'paren',
                nodes: []
            });
            stack.push(block);
            push({
                type: 'text',
                value: value
            });
            continue;
        }
        if (value === $e5e5b48e7d8622be$require$CHAR_RIGHT_PARENTHESES) {
            if (block.type !== 'paren') {
                push({
                    type: 'text',
                    value: value
                });
                continue;
            }
            block = stack.pop();
            push({
                type: 'text',
                value: value
            });
            block = stack[stack.length - 1];
            continue;
        }
        /**
     * Quotes: '|"|`
     */ if (value === $e5e5b48e7d8622be$require$CHAR_DOUBLE_QUOTE || value === $e5e5b48e7d8622be$require$CHAR_SINGLE_QUOTE || value === $e5e5b48e7d8622be$require$CHAR_BACKTICK) {
            let open = value;
            let next;
            if (options.keepQuotes !== true) value = '';
            while(index < length && (next = advance())){
                if (next === $e5e5b48e7d8622be$require$CHAR_BACKSLASH) {
                    value += next + advance();
                    continue;
                }
                if (next === open) {
                    if (options.keepQuotes === true) value += next;
                    break;
                }
                value += next;
            }
            push({
                type: 'text',
                value: value
            });
            continue;
        }
        /**
     * Left curly brace: '{'
     */ if (value === $e5e5b48e7d8622be$require$CHAR_LEFT_CURLY_BRACE) {
            depth++;
            let dollar = prev.value && prev.value.slice(-1) === '$' || block.dollar === true;
            let brace = {
                type: 'brace',
                open: true,
                close: false,
                dollar: dollar,
                depth: depth,
                commas: 0,
                ranges: 0,
                nodes: []
            };
            block = push(brace);
            stack.push(block);
            push({
                type: 'open',
                value: value
            });
            continue;
        }
        /**
     * Right curly brace: '}'
     */ if (value === $e5e5b48e7d8622be$require$CHAR_RIGHT_CURLY_BRACE) {
            if (block.type !== 'brace') {
                push({
                    type: 'text',
                    value: value
                });
                continue;
            }
            let type = 'close';
            block = stack.pop();
            block.close = true;
            push({
                type: type,
                value: value
            });
            depth--;
            block = stack[stack.length - 1];
            continue;
        }
        /**
     * Comma: ','
     */ if (value === $e5e5b48e7d8622be$require$CHAR_COMMA && depth > 0) {
            if (block.ranges > 0) {
                block.ranges = 0;
                let open = block.nodes.shift();
                block.nodes = [
                    open,
                    {
                        type: 'text',
                        value: $2p2dz(block)
                    }
                ];
            }
            push({
                type: 'comma',
                value: value
            });
            block.commas++;
            continue;
        }
        /**
     * Dot: '.'
     */ if (value === $e5e5b48e7d8622be$require$CHAR_DOT && depth > 0 && block.commas === 0) {
            let siblings = block.nodes;
            if (depth === 0 || siblings.length === 0) {
                push({
                    type: 'text',
                    value: value
                });
                continue;
            }
            if (prev.type === 'dot') {
                block.range = [];
                prev.value += value;
                prev.type = 'range';
                if (block.nodes.length !== 3 && block.nodes.length !== 5) {
                    block.invalid = true;
                    block.ranges = 0;
                    prev.type = 'text';
                    continue;
                }
                block.ranges++;
                block.args = [];
                continue;
            }
            if (prev.type === 'range') {
                siblings.pop();
                let before = siblings[siblings.length - 1];
                before.value += prev.value + value;
                prev = before;
                block.ranges--;
                continue;
            }
            push({
                type: 'dot',
                value: value
            });
            continue;
        }
        /**
     * Text
     */ push({
            type: 'text',
            value: value
        });
    }
    // Mark imbalanced braces and brackets as invalid
    do {
        block = stack.pop();
        if (block.type !== 'root') {
            block.nodes.forEach((node)=>{
                if (!node.nodes) {
                    if (node.type === 'open') node.isOpen = true;
                    if (node.type === 'close') node.isClose = true;
                    if (!node.nodes) node.type = 'text';
                    node.invalid = true;
                }
            });
            // get the location of the block on parent.nodes (block's siblings)
            let parent = stack[stack.length - 1];
            let index = parent.nodes.indexOf(block);
            // replace the (invalid) block with it's nodes
            parent.nodes.splice(index, 1, ...block.nodes);
        }
    }while (stack.length > 0)
    push({
        type: 'eos'
    });
    return ast;
};
module.exports = $e5e5b48e7d8622be$var$parse;

});
parcelRequire.register("kJLh5", function(module, exports) {
'use strict';
module.exports = {
    MAX_LENGTH: 65536,
    // Digits
    CHAR_0: '0',
    /* 0 */ CHAR_9: '9',
    /* 9 */ // Alphabet chars.
    CHAR_UPPERCASE_A: 'A',
    /* A */ CHAR_LOWERCASE_A: 'a',
    /* a */ CHAR_UPPERCASE_Z: 'Z',
    /* Z */ CHAR_LOWERCASE_Z: 'z',
    /* z */ CHAR_LEFT_PARENTHESES: '(',
    /* ( */ CHAR_RIGHT_PARENTHESES: ')',
    /* ) */ CHAR_ASTERISK: '*',
    /* * */ // Non-alphabetic chars.
    CHAR_AMPERSAND: '&',
    /* & */ CHAR_AT: '@',
    /* @ */ CHAR_BACKSLASH: '\\',
    /* \ */ CHAR_BACKTICK: '`',
    /* ` */ CHAR_CARRIAGE_RETURN: '\r',
    /* \r */ CHAR_CIRCUMFLEX_ACCENT: '^',
    /* ^ */ CHAR_COLON: ':',
    /* : */ CHAR_COMMA: ',',
    /* , */ CHAR_DOLLAR: '$',
    /* . */ CHAR_DOT: '.',
    /* . */ CHAR_DOUBLE_QUOTE: '"',
    /* " */ CHAR_EQUAL: '=',
    /* = */ CHAR_EXCLAMATION_MARK: '!',
    /* ! */ CHAR_FORM_FEED: '\f',
    /* \f */ CHAR_FORWARD_SLASH: '/',
    /* / */ CHAR_HASH: '#',
    /* # */ CHAR_HYPHEN_MINUS: '-',
    /* - */ CHAR_LEFT_ANGLE_BRACKET: '<',
    /* < */ CHAR_LEFT_CURLY_BRACE: '{',
    /* { */ CHAR_LEFT_SQUARE_BRACKET: '[',
    /* [ */ CHAR_LINE_FEED: '\n',
    /* \n */ CHAR_NO_BREAK_SPACE: '\u00A0',
    /* \u00A0 */ CHAR_PERCENT: '%',
    /* % */ CHAR_PLUS: '+',
    /* + */ CHAR_QUESTION_MARK: '?',
    /* ? */ CHAR_RIGHT_ANGLE_BRACKET: '>',
    /* > */ CHAR_RIGHT_CURLY_BRACE: '}',
    /* } */ CHAR_RIGHT_SQUARE_BRACKET: ']',
    /* ] */ CHAR_SEMICOLON: ';',
    /* ; */ CHAR_SINGLE_QUOTE: '\'',
    /* ' */ CHAR_SPACE: ' ',
    /*   */ CHAR_TAB: '\t',
    /* \t */ CHAR_UNDERSCORE: '_',
    /* _ */ CHAR_VERTICAL_LINE: '|',
    /* | */ CHAR_ZERO_WIDTH_NOBREAK_SPACE: '\uFEFF' /* \uFEFF */ 
};

});



parcelRequire.register("faTXT", function(module, exports) {
'use strict';

module.exports = (parcelRequire("e3UBt"));

});
parcelRequire.register("e3UBt", function(module, exports) {
'use strict';


var $2Aw9I = parcelRequire("2Aw9I");

var $hK3j1 = parcelRequire("hK3j1");

var $98nIR = parcelRequire("98nIR");

var $1hKS4 = parcelRequire("1hKS4");
const $a3cd40c327ba5b2f$var$isObject = (val)=>val && typeof val === 'object' && !Array.isArray(val)
;
/**
 * Creates a matcher function from one or more glob patterns. The
 * returned function takes a string to match as its first argument,
 * and returns true if the string is a match. The returned matcher
 * function also takes a boolean as the second argument that, when true,
 * returns an object with additional information.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch(glob[, options]);
 *
 * const isMatch = picomatch('*.!(*a)');
 * console.log(isMatch('a.a')); //=> false
 * console.log(isMatch('a.b')); //=> true
 * ```
 * @name picomatch
 * @param {String|Array} `globs` One or more glob patterns.
 * @param {Object=} `options`
 * @return {Function=} Returns a matcher function.
 * @api public
 */ const $a3cd40c327ba5b2f$var$picomatch = (glob, options, returnState = false)=>{
    if (Array.isArray(glob)) {
        const fns = glob.map((input)=>$a3cd40c327ba5b2f$var$picomatch(input, options, returnState)
        );
        const arrayMatcher = (str)=>{
            for (const isMatch of fns){
                const state = isMatch(str);
                if (state) return state;
            }
            return false;
        };
        return arrayMatcher;
    }
    const isState = $a3cd40c327ba5b2f$var$isObject(glob) && glob.tokens && glob.input;
    if (glob === '' || typeof glob !== 'string' && !isState) throw new TypeError('Expected pattern to be a non-empty string');
    const opts = options || {
    };
    const posix = $98nIR.isWindows(options);
    const regex = isState ? $a3cd40c327ba5b2f$var$picomatch.compileRe(glob, options) : $a3cd40c327ba5b2f$var$picomatch.makeRe(glob, options, false, true);
    const state1 = regex.state;
    delete regex.state;
    let isIgnored = ()=>false
    ;
    if (opts.ignore) {
        const ignoreOpts = {
            ...options,
            ignore: null,
            onMatch: null,
            onResult: null
        };
        isIgnored = $a3cd40c327ba5b2f$var$picomatch(opts.ignore, ignoreOpts, returnState);
    }
    const matcher = (input, returnObject = false)=>{
        const { isMatch: isMatch , match: match , output: output  } = $a3cd40c327ba5b2f$var$picomatch.test(input, regex, options, {
            glob: glob,
            posix: posix
        });
        const result = {
            glob: glob,
            state: state1,
            regex: regex,
            posix: posix,
            input: input,
            output: output,
            match: match,
            isMatch: isMatch
        };
        if (typeof opts.onResult === 'function') opts.onResult(result);
        if (isMatch === false) {
            result.isMatch = false;
            return returnObject ? result : false;
        }
        if (isIgnored(input)) {
            if (typeof opts.onIgnore === 'function') opts.onIgnore(result);
            result.isMatch = false;
            return returnObject ? result : false;
        }
        if (typeof opts.onMatch === 'function') opts.onMatch(result);
        return returnObject ? result : true;
    };
    if (returnState) matcher.state = state1;
    return matcher;
};
/**
 * Test `input` with the given `regex`. This is used by the main
 * `picomatch()` function to test the input string.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.test(input, regex[, options]);
 *
 * console.log(picomatch.test('foo/bar', /^(?:([^/]*?)\/([^/]*?))$/));
 * // { isMatch: true, match: [ 'foo/', 'foo', 'bar' ], output: 'foo/bar' }
 * ```
 * @param {String} `input` String to test.
 * @param {RegExp} `regex`
 * @return {Object} Returns an object with matching info.
 * @api public
 */ $a3cd40c327ba5b2f$var$picomatch.test = (input, regex, options, { glob: glob , posix: posix  } = {
})=>{
    if (typeof input !== 'string') throw new TypeError('Expected input to be a string');
    if (input === '') return {
        isMatch: false,
        output: ''
    };
    const opts = options || {
    };
    const format = opts.format || (posix ? $98nIR.toPosixSlashes : null);
    let match = input === glob;
    let output = match && format ? format(input) : input;
    if (match === false) {
        output = format ? format(input) : input;
        match = output === glob;
    }
    if (match === false || opts.capture === true) {
        if (opts.matchBase === true || opts.basename === true) match = $a3cd40c327ba5b2f$var$picomatch.matchBase(input, regex, options, posix);
        else match = regex.exec(output);
    }
    return {
        isMatch: Boolean(match),
        match: match,
        output: output
    };
};
/**
 * Match the basename of a filepath.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.matchBase(input, glob[, options]);
 * console.log(picomatch.matchBase('foo/bar.js', '*.js'); // true
 * ```
 * @param {String} `input` String to test.
 * @param {RegExp|String} `glob` Glob pattern or regex created by [.makeRe](#makeRe).
 * @return {Boolean}
 * @api public
 */ $a3cd40c327ba5b2f$var$picomatch.matchBase = (input, glob, options, posix = $98nIR.isWindows(options))=>{
    const regex = glob instanceof RegExp ? glob : $a3cd40c327ba5b2f$var$picomatch.makeRe(glob, options);
    return regex.test($igPDg$path.basename(input));
};
/**
 * Returns true if **any** of the given glob `patterns` match the specified `string`.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.isMatch(string, patterns[, options]);
 *
 * console.log(picomatch.isMatch('a.a', ['b.*', '*.a'])); //=> true
 * console.log(picomatch.isMatch('a.a', 'b.*')); //=> false
 * ```
 * @param {String|Array} str The string to test.
 * @param {String|Array} patterns One or more glob patterns to use for matching.
 * @param {Object} [options] See available [options](#options).
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */ $a3cd40c327ba5b2f$var$picomatch.isMatch = (str, patterns, options)=>$a3cd40c327ba5b2f$var$picomatch(patterns, options)(str)
;
/**
 * Parse a glob pattern to create the source string for a regular
 * expression.
 *
 * ```js
 * const picomatch = require('picomatch');
 * const result = picomatch.parse(pattern[, options]);
 * ```
 * @param {String} `pattern`
 * @param {Object} `options`
 * @return {Object} Returns an object with useful properties and output to be used as a regex source string.
 * @api public
 */ $a3cd40c327ba5b2f$var$picomatch.parse = (pattern, options)=>{
    if (Array.isArray(pattern)) return pattern.map((p)=>$a3cd40c327ba5b2f$var$picomatch.parse(p, options)
    );
    return $hK3j1(pattern, {
        ...options,
        fastpaths: false
    });
};
/**
 * Scan a glob pattern to separate the pattern into segments.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.scan(input[, options]);
 *
 * const result = picomatch.scan('!./foo/*.js');
 * console.log(result);
 * { prefix: '!./',
 *   input: '!./foo/*.js',
 *   start: 3,
 *   base: 'foo',
 *   glob: '*.js',
 *   isBrace: false,
 *   isBracket: false,
 *   isGlob: true,
 *   isExtglob: false,
 *   isGlobstar: false,
 *   negated: true }
 * ```
 * @param {String} `input` Glob pattern to scan.
 * @param {Object} `options`
 * @return {Object} Returns an object with
 * @api public
 */ $a3cd40c327ba5b2f$var$picomatch.scan = (input, options)=>$2Aw9I(input, options)
;
/**
 * Compile a regular expression from the `state` object returned by the
 * [parse()](#parse) method.
 *
 * @param {Object} `state`
 * @param {Object} `options`
 * @param {Boolean} `returnOutput` Intended for implementors, this argument allows you to return the raw output from the parser.
 * @param {Boolean} `returnState` Adds the state to a `state` property on the returned regex. Useful for implementors and debugging.
 * @return {RegExp}
 * @api public
 */ $a3cd40c327ba5b2f$var$picomatch.compileRe = (state, options, returnOutput = false, returnState = false)=>{
    if (returnOutput === true) return state.output;
    const opts = options || {
    };
    const prepend = opts.contains ? '' : '^';
    const append = opts.contains ? '' : '$';
    let source = `${prepend}(?:${state.output})${append}`;
    if (state && state.negated === true) source = `^(?!${source}).*$`;
    const regex = $a3cd40c327ba5b2f$var$picomatch.toRegex(source, options);
    if (returnState === true) regex.state = state;
    return regex;
};
/**
 * Create a regular expression from a parsed glob pattern.
 *
 * ```js
 * const picomatch = require('picomatch');
 * const state = picomatch.parse('*.js');
 * // picomatch.compileRe(state[, options]);
 *
 * console.log(picomatch.compileRe(state));
 * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
 * ```
 * @param {String} `state` The object returned from the `.parse` method.
 * @param {Object} `options`
 * @param {Boolean} `returnOutput` Implementors may use this argument to return the compiled output, instead of a regular expression. This is not exposed on the options to prevent end-users from mutating the result.
 * @param {Boolean} `returnState` Implementors may use this argument to return the state from the parsed glob with the returned regular expression.
 * @return {RegExp} Returns a regex created from the given pattern.
 * @api public
 */ $a3cd40c327ba5b2f$var$picomatch.makeRe = (input, options = {
}, returnOutput = false, returnState = false)=>{
    if (!input || typeof input !== 'string') throw new TypeError('Expected a non-empty string');
    let parsed = {
        negated: false,
        fastpaths: true
    };
    if (options.fastpaths !== false && (input[0] === '.' || input[0] === '*')) parsed.output = $hK3j1.fastpaths(input, options);
    if (!parsed.output) parsed = $hK3j1(input, options);
    return $a3cd40c327ba5b2f$var$picomatch.compileRe(parsed, options, returnOutput, returnState);
};
/**
 * Create a regular expression from the given regex source string.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.toRegex(source[, options]);
 *
 * const { output } = picomatch.parse('*.js');
 * console.log(picomatch.toRegex(output));
 * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
 * ```
 * @param {String} `source` Regular expression source string.
 * @param {Object} `options`
 * @return {RegExp}
 * @api public
 */ $a3cd40c327ba5b2f$var$picomatch.toRegex = (source, options)=>{
    try {
        const opts = options || {
        };
        return new RegExp(source, opts.flags || (opts.nocase ? 'i' : ''));
    } catch (err) {
        if (options && options.debug === true) throw err;
        return /$^/;
    }
};
/**
 * Picomatch constants.
 * @return {Object}
 */ $a3cd40c327ba5b2f$var$picomatch.constants = $1hKS4;
/**
 * Expose "picomatch"
 */ module.exports = $a3cd40c327ba5b2f$var$picomatch;

});
parcelRequire.register("2Aw9I", function(module, exports) {
'use strict';

var $98nIR = parcelRequire("98nIR");

var $1hKS4 = parcelRequire("1hKS4");
var $1e27e306c7c17bcb$require$CHAR_ASTERISK = $1hKS4.CHAR_ASTERISK;
var $1e27e306c7c17bcb$require$CHAR_AT = $1hKS4.CHAR_AT;
var $1e27e306c7c17bcb$require$CHAR_BACKWARD_SLASH = $1hKS4.CHAR_BACKWARD_SLASH;
var $1e27e306c7c17bcb$require$CHAR_COMMA = $1hKS4.CHAR_COMMA;
var $1e27e306c7c17bcb$require$CHAR_DOT = $1hKS4.CHAR_DOT;
var $1e27e306c7c17bcb$require$CHAR_EXCLAMATION_MARK = $1hKS4.CHAR_EXCLAMATION_MARK;
var $1e27e306c7c17bcb$require$CHAR_FORWARD_SLASH = $1hKS4.CHAR_FORWARD_SLASH;
var $1e27e306c7c17bcb$require$CHAR_LEFT_CURLY_BRACE = $1hKS4.CHAR_LEFT_CURLY_BRACE;
var $1e27e306c7c17bcb$require$CHAR_LEFT_PARENTHESES = $1hKS4.CHAR_LEFT_PARENTHESES;
var $1e27e306c7c17bcb$require$CHAR_LEFT_SQUARE_BRACKET = $1hKS4.CHAR_LEFT_SQUARE_BRACKET;
var $1e27e306c7c17bcb$require$CHAR_PLUS = $1hKS4.CHAR_PLUS;
var $1e27e306c7c17bcb$require$CHAR_QUESTION_MARK = $1hKS4.CHAR_QUESTION_MARK;
var $1e27e306c7c17bcb$require$CHAR_RIGHT_CURLY_BRACE = $1hKS4.CHAR_RIGHT_CURLY_BRACE;
var $1e27e306c7c17bcb$require$CHAR_RIGHT_PARENTHESES = $1hKS4.CHAR_RIGHT_PARENTHESES;
var $1e27e306c7c17bcb$require$CHAR_RIGHT_SQUARE_BRACKET = $1hKS4.CHAR_RIGHT_SQUARE_BRACKET;
const $1e27e306c7c17bcb$var$isPathSeparator = (code)=>{
    return code === $1e27e306c7c17bcb$require$CHAR_FORWARD_SLASH || code === $1e27e306c7c17bcb$require$CHAR_BACKWARD_SLASH;
};
const $1e27e306c7c17bcb$var$depth = (token)=>{
    if (token.isPrefix !== true) token.depth = token.isGlobstar ? Infinity : 1;
};
/**
 * Quickly scans a glob pattern and returns an object with a handful of
 * useful properties, like `isGlob`, `path` (the leading non-glob, if it exists),
 * `glob` (the actual pattern), `negated` (true if the path starts with `!` but not
 * with `!(`) and `negatedExtglob` (true if the path starts with `!(`).
 *
 * ```js
 * const pm = require('picomatch');
 * console.log(pm.scan('foo/bar/*.js'));
 * { isGlob: true, input: 'foo/bar/*.js', base: 'foo/bar', glob: '*.js' }
 * ```
 * @param {String} `str`
 * @param {Object} `options`
 * @return {Object} Returns an object with tokens and regex source string.
 * @api public
 */ const $1e27e306c7c17bcb$var$scan = (input, options)=>{
    const opts = options || {
    };
    const length = input.length - 1;
    const scanToEnd = opts.parts === true || opts.scanToEnd === true;
    const slashes = [];
    const tokens = [];
    const parts = [];
    let str = input;
    let index = -1;
    let start = 0;
    let lastIndex = 0;
    let isBrace = false;
    let isBracket = false;
    let isGlob = false;
    let isExtglob = false;
    let isGlobstar = false;
    let braceEscaped = false;
    let backslashes = false;
    let negated = false;
    let negatedExtglob = false;
    let finished = false;
    let braces = 0;
    let prev;
    let code;
    let token = {
        value: '',
        depth: 0,
        isGlob: false
    };
    const eos = ()=>index >= length
    ;
    const peek = ()=>str.charCodeAt(index + 1)
    ;
    const advance = ()=>{
        prev = code;
        return str.charCodeAt(++index);
    };
    while(index < length){
        code = advance();
        let next;
        if (code === $1e27e306c7c17bcb$require$CHAR_BACKWARD_SLASH) {
            backslashes = token.backslashes = true;
            code = advance();
            if (code === $1e27e306c7c17bcb$require$CHAR_LEFT_CURLY_BRACE) braceEscaped = true;
            continue;
        }
        if (braceEscaped === true || code === $1e27e306c7c17bcb$require$CHAR_LEFT_CURLY_BRACE) {
            braces++;
            while(eos() !== true && (code = advance())){
                if (code === $1e27e306c7c17bcb$require$CHAR_BACKWARD_SLASH) {
                    backslashes = token.backslashes = true;
                    advance();
                    continue;
                }
                if (code === $1e27e306c7c17bcb$require$CHAR_LEFT_CURLY_BRACE) {
                    braces++;
                    continue;
                }
                if (braceEscaped !== true && code === $1e27e306c7c17bcb$require$CHAR_DOT && (code = advance()) === $1e27e306c7c17bcb$require$CHAR_DOT) {
                    isBrace = token.isBrace = true;
                    isGlob = token.isGlob = true;
                    finished = true;
                    if (scanToEnd === true) continue;
                    break;
                }
                if (braceEscaped !== true && code === $1e27e306c7c17bcb$require$CHAR_COMMA) {
                    isBrace = token.isBrace = true;
                    isGlob = token.isGlob = true;
                    finished = true;
                    if (scanToEnd === true) continue;
                    break;
                }
                if (code === $1e27e306c7c17bcb$require$CHAR_RIGHT_CURLY_BRACE) {
                    braces--;
                    if (braces === 0) {
                        braceEscaped = false;
                        isBrace = token.isBrace = true;
                        finished = true;
                        break;
                    }
                }
            }
            if (scanToEnd === true) continue;
            break;
        }
        if (code === $1e27e306c7c17bcb$require$CHAR_FORWARD_SLASH) {
            slashes.push(index);
            tokens.push(token);
            token = {
                value: '',
                depth: 0,
                isGlob: false
            };
            if (finished === true) continue;
            if (prev === $1e27e306c7c17bcb$require$CHAR_DOT && index === start + 1) {
                start += 2;
                continue;
            }
            lastIndex = index + 1;
            continue;
        }
        if (opts.noext !== true) {
            const isExtglobChar = code === $1e27e306c7c17bcb$require$CHAR_PLUS || code === $1e27e306c7c17bcb$require$CHAR_AT || code === $1e27e306c7c17bcb$require$CHAR_ASTERISK || code === $1e27e306c7c17bcb$require$CHAR_QUESTION_MARK || code === $1e27e306c7c17bcb$require$CHAR_EXCLAMATION_MARK;
            if (isExtglobChar === true && peek() === $1e27e306c7c17bcb$require$CHAR_LEFT_PARENTHESES) {
                isGlob = token.isGlob = true;
                isExtglob = token.isExtglob = true;
                finished = true;
                if (code === $1e27e306c7c17bcb$require$CHAR_EXCLAMATION_MARK && index === start) negatedExtglob = true;
                if (scanToEnd === true) {
                    while(eos() !== true && (code = advance())){
                        if (code === $1e27e306c7c17bcb$require$CHAR_BACKWARD_SLASH) {
                            backslashes = token.backslashes = true;
                            code = advance();
                            continue;
                        }
                        if (code === $1e27e306c7c17bcb$require$CHAR_RIGHT_PARENTHESES) {
                            isGlob = token.isGlob = true;
                            finished = true;
                            break;
                        }
                    }
                    continue;
                }
                break;
            }
        }
        if (code === $1e27e306c7c17bcb$require$CHAR_ASTERISK) {
            if (prev === $1e27e306c7c17bcb$require$CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
            isGlob = token.isGlob = true;
            finished = true;
            if (scanToEnd === true) continue;
            break;
        }
        if (code === $1e27e306c7c17bcb$require$CHAR_QUESTION_MARK) {
            isGlob = token.isGlob = true;
            finished = true;
            if (scanToEnd === true) continue;
            break;
        }
        if (code === $1e27e306c7c17bcb$require$CHAR_LEFT_SQUARE_BRACKET) {
            while(eos() !== true && (next = advance())){
                if (next === $1e27e306c7c17bcb$require$CHAR_BACKWARD_SLASH) {
                    backslashes = token.backslashes = true;
                    advance();
                    continue;
                }
                if (next === $1e27e306c7c17bcb$require$CHAR_RIGHT_SQUARE_BRACKET) {
                    isBracket = token.isBracket = true;
                    isGlob = token.isGlob = true;
                    finished = true;
                    break;
                }
            }
            if (scanToEnd === true) continue;
            break;
        }
        if (opts.nonegate !== true && code === $1e27e306c7c17bcb$require$CHAR_EXCLAMATION_MARK && index === start) {
            negated = token.negated = true;
            start++;
            continue;
        }
        if (opts.noparen !== true && code === $1e27e306c7c17bcb$require$CHAR_LEFT_PARENTHESES) {
            isGlob = token.isGlob = true;
            if (scanToEnd === true) {
                while(eos() !== true && (code = advance())){
                    if (code === $1e27e306c7c17bcb$require$CHAR_LEFT_PARENTHESES) {
                        backslashes = token.backslashes = true;
                        code = advance();
                        continue;
                    }
                    if (code === $1e27e306c7c17bcb$require$CHAR_RIGHT_PARENTHESES) {
                        finished = true;
                        break;
                    }
                }
                continue;
            }
            break;
        }
        if (isGlob === true) {
            finished = true;
            if (scanToEnd === true) continue;
            break;
        }
    }
    if (opts.noext === true) {
        isExtglob = false;
        isGlob = false;
    }
    let base = str;
    let prefix = '';
    let glob = '';
    if (start > 0) {
        prefix = str.slice(0, start);
        str = str.slice(start);
        lastIndex -= start;
    }
    if (base && isGlob === true && lastIndex > 0) {
        base = str.slice(0, lastIndex);
        glob = str.slice(lastIndex);
    } else if (isGlob === true) {
        base = '';
        glob = str;
    } else base = str;
    if (base && base !== '' && base !== '/' && base !== str) {
        if ($1e27e306c7c17bcb$var$isPathSeparator(base.charCodeAt(base.length - 1))) base = base.slice(0, -1);
    }
    if (opts.unescape === true) {
        if (glob) glob = $98nIR.removeBackslashes(glob);
        if (base && backslashes === true) base = $98nIR.removeBackslashes(base);
    }
    const state = {
        prefix: prefix,
        input: input,
        start: start,
        base: base,
        glob: glob,
        isBrace: isBrace,
        isBracket: isBracket,
        isGlob: isGlob,
        isExtglob: isExtglob,
        isGlobstar: isGlobstar,
        negated: negated,
        negatedExtglob: negatedExtglob
    };
    if (opts.tokens === true) {
        state.maxDepth = 0;
        if (!$1e27e306c7c17bcb$var$isPathSeparator(code)) tokens.push(token);
        state.tokens = tokens;
    }
    if (opts.parts === true || opts.tokens === true) {
        let prevIndex;
        for(let idx = 0; idx < slashes.length; idx++){
            const n = prevIndex ? prevIndex + 1 : start;
            const i = slashes[idx];
            const value = input.slice(n, i);
            if (opts.tokens) {
                if (idx === 0 && start !== 0) {
                    tokens[idx].isPrefix = true;
                    tokens[idx].value = prefix;
                } else tokens[idx].value = value;
                $1e27e306c7c17bcb$var$depth(tokens[idx]);
                state.maxDepth += tokens[idx].depth;
            }
            if (idx !== 0 || value !== '') parts.push(value);
            prevIndex = i;
        }
        if (prevIndex && prevIndex + 1 < input.length) {
            const value = input.slice(prevIndex + 1);
            parts.push(value);
            if (opts.tokens) {
                tokens[tokens.length - 1].value = value;
                $1e27e306c7c17bcb$var$depth(tokens[tokens.length - 1]);
                state.maxDepth += tokens[tokens.length - 1].depth;
            }
        }
        state.slashes = slashes;
        state.parts = parts;
    }
    return state;
};
module.exports = $1e27e306c7c17bcb$var$scan;

});
parcelRequire.register("98nIR", function(module, exports) {

$parcel$export(module.exports, "isObject", () => $6a6743377c9ef6c0$export$a6cdc56e425d0d0a, (v) => $6a6743377c9ef6c0$export$a6cdc56e425d0d0a = v);
$parcel$export(module.exports, "hasRegexChars", () => $6a6743377c9ef6c0$export$6540a013a39bb50d, (v) => $6a6743377c9ef6c0$export$6540a013a39bb50d = v);
$parcel$export(module.exports, "escapeRegex", () => $6a6743377c9ef6c0$export$104ed90cc1a13451, (v) => $6a6743377c9ef6c0$export$104ed90cc1a13451 = v);
$parcel$export(module.exports, "toPosixSlashes", () => $6a6743377c9ef6c0$export$e610e037975797ee, (v) => $6a6743377c9ef6c0$export$e610e037975797ee = v);
$parcel$export(module.exports, "removeBackslashes", () => $6a6743377c9ef6c0$export$f403de0a7ba7a743, (v) => $6a6743377c9ef6c0$export$f403de0a7ba7a743 = v);
$parcel$export(module.exports, "supportsLookbehinds", () => $6a6743377c9ef6c0$export$bcf709e5e3483cdb, (v) => $6a6743377c9ef6c0$export$bcf709e5e3483cdb = v);
$parcel$export(module.exports, "isWindows", () => $6a6743377c9ef6c0$export$f993c945890e93ba, (v) => $6a6743377c9ef6c0$export$f993c945890e93ba = v);
$parcel$export(module.exports, "escapeLast", () => $6a6743377c9ef6c0$export$13d0f4185f159c8, (v) => $6a6743377c9ef6c0$export$13d0f4185f159c8 = v);
$parcel$export(module.exports, "removePrefix", () => $6a6743377c9ef6c0$export$f2888183a34644d4, (v) => $6a6743377c9ef6c0$export$f2888183a34644d4 = v);
$parcel$export(module.exports, "wrapOutput", () => $6a6743377c9ef6c0$export$25bddda26836484b, (v) => $6a6743377c9ef6c0$export$25bddda26836484b = v);
var $6a6743377c9ef6c0$export$a6cdc56e425d0d0a;
var $6a6743377c9ef6c0$export$6540a013a39bb50d;
var $6a6743377c9ef6c0$export$a92319f7ab133839;
var $6a6743377c9ef6c0$export$104ed90cc1a13451;
var $6a6743377c9ef6c0$export$e610e037975797ee;
var $6a6743377c9ef6c0$export$f403de0a7ba7a743;
var $6a6743377c9ef6c0$export$bcf709e5e3483cdb;
var $6a6743377c9ef6c0$export$f993c945890e93ba;
var $6a6743377c9ef6c0$export$13d0f4185f159c8;
var $6a6743377c9ef6c0$export$f2888183a34644d4;
var $6a6743377c9ef6c0$export$25bddda26836484b;
'use strict';

const $6a6743377c9ef6c0$var$win32 = process.platform === 'win32';

var $1hKS4 = parcelRequire("1hKS4");
var $6a6743377c9ef6c0$require$REGEX_BACKSLASH = $1hKS4.REGEX_BACKSLASH;
var $6a6743377c9ef6c0$require$REGEX_REMOVE_BACKSLASH = $1hKS4.REGEX_REMOVE_BACKSLASH;
var $6a6743377c9ef6c0$require$REGEX_SPECIAL_CHARS = $1hKS4.REGEX_SPECIAL_CHARS;
var $6a6743377c9ef6c0$require$REGEX_SPECIAL_CHARS_GLOBAL = $1hKS4.REGEX_SPECIAL_CHARS_GLOBAL;
$6a6743377c9ef6c0$export$a6cdc56e425d0d0a = (val)=>val !== null && typeof val === 'object' && !Array.isArray(val)
;
$6a6743377c9ef6c0$export$6540a013a39bb50d = (str)=>$6a6743377c9ef6c0$require$REGEX_SPECIAL_CHARS.test(str)
;
$6a6743377c9ef6c0$export$a92319f7ab133839 = (str)=>str.length === 1 && $6a6743377c9ef6c0$export$6540a013a39bb50d(str)
;
$6a6743377c9ef6c0$export$104ed90cc1a13451 = (str)=>str.replace($6a6743377c9ef6c0$require$REGEX_SPECIAL_CHARS_GLOBAL, '\\$1')
;
$6a6743377c9ef6c0$export$e610e037975797ee = (str)=>str.replace($6a6743377c9ef6c0$require$REGEX_BACKSLASH, '/')
;
$6a6743377c9ef6c0$export$f403de0a7ba7a743 = (str)=>{
    return str.replace($6a6743377c9ef6c0$require$REGEX_REMOVE_BACKSLASH, (match)=>{
        return match === '\\' ? '' : match;
    });
};
$6a6743377c9ef6c0$export$bcf709e5e3483cdb = ()=>{
    const segs = process.version.slice(1).split('.').map(Number);
    if (segs.length === 3 && segs[0] >= 9 || segs[0] === 8 && segs[1] >= 10) return true;
    return false;
};
$6a6743377c9ef6c0$export$f993c945890e93ba = (options)=>{
    if (options && typeof options.windows === 'boolean') return options.windows;
    return $6a6743377c9ef6c0$var$win32 === true || $igPDg$path.sep === '\\';
};
$6a6743377c9ef6c0$export$13d0f4185f159c8 = (input, char, lastIdx)=>{
    const idx = input.lastIndexOf(char, lastIdx);
    if (idx === -1) return input;
    if (input[idx - 1] === '\\') return $6a6743377c9ef6c0$export$13d0f4185f159c8(input, char, idx - 1);
    return `${input.slice(0, idx)}\\${input.slice(idx)}`;
};
$6a6743377c9ef6c0$export$f2888183a34644d4 = (input, state = {
})=>{
    let output = input;
    if (output.startsWith('./')) {
        output = output.slice(2);
        state.prefix = './';
    }
    return output;
};
$6a6743377c9ef6c0$export$25bddda26836484b = (input, state = {
}, options = {
})=>{
    const prepend = options.contains ? '' : '^';
    const append = options.contains ? '' : '$';
    let output = `${prepend}(?:${input})${append}`;
    if (state.negated === true) output = `(?:^(?!${output}).*$)`;
    return output;
};

});
parcelRequire.register("1hKS4", function(module, exports) {
'use strict';

const $0efbbc9e4d4e61c8$var$WIN_SLASH = '\\\\/';
const $0efbbc9e4d4e61c8$var$WIN_NO_SLASH = `[^${$0efbbc9e4d4e61c8$var$WIN_SLASH}]`;
/**
 * Posix glob regex
 */ const $0efbbc9e4d4e61c8$var$DOT_LITERAL = '\\.';
const $0efbbc9e4d4e61c8$var$PLUS_LITERAL = '\\+';
const $0efbbc9e4d4e61c8$var$QMARK_LITERAL = '\\?';
const $0efbbc9e4d4e61c8$var$SLASH_LITERAL = '\\/';
const $0efbbc9e4d4e61c8$var$ONE_CHAR = '(?=.)';
const $0efbbc9e4d4e61c8$var$QMARK = '[^/]';
const $0efbbc9e4d4e61c8$var$END_ANCHOR = `(?:${$0efbbc9e4d4e61c8$var$SLASH_LITERAL}|$)`;
const $0efbbc9e4d4e61c8$var$START_ANCHOR = `(?:^|${$0efbbc9e4d4e61c8$var$SLASH_LITERAL})`;
const $0efbbc9e4d4e61c8$var$DOTS_SLASH = `${$0efbbc9e4d4e61c8$var$DOT_LITERAL}{1,2}${$0efbbc9e4d4e61c8$var$END_ANCHOR}`;
const $0efbbc9e4d4e61c8$var$NO_DOT = `(?!${$0efbbc9e4d4e61c8$var$DOT_LITERAL})`;
const $0efbbc9e4d4e61c8$var$NO_DOTS = `(?!${$0efbbc9e4d4e61c8$var$START_ANCHOR}${$0efbbc9e4d4e61c8$var$DOTS_SLASH})`;
const $0efbbc9e4d4e61c8$var$NO_DOT_SLASH = `(?!${$0efbbc9e4d4e61c8$var$DOT_LITERAL}{0,1}${$0efbbc9e4d4e61c8$var$END_ANCHOR})`;
const $0efbbc9e4d4e61c8$var$NO_DOTS_SLASH = `(?!${$0efbbc9e4d4e61c8$var$DOTS_SLASH})`;
const $0efbbc9e4d4e61c8$var$QMARK_NO_DOT = `[^.${$0efbbc9e4d4e61c8$var$SLASH_LITERAL}]`;
const $0efbbc9e4d4e61c8$var$STAR = `${$0efbbc9e4d4e61c8$var$QMARK}*?`;
const $0efbbc9e4d4e61c8$var$POSIX_CHARS = {
    DOT_LITERAL: $0efbbc9e4d4e61c8$var$DOT_LITERAL,
    PLUS_LITERAL: $0efbbc9e4d4e61c8$var$PLUS_LITERAL,
    QMARK_LITERAL: $0efbbc9e4d4e61c8$var$QMARK_LITERAL,
    SLASH_LITERAL: $0efbbc9e4d4e61c8$var$SLASH_LITERAL,
    ONE_CHAR: $0efbbc9e4d4e61c8$var$ONE_CHAR,
    QMARK: $0efbbc9e4d4e61c8$var$QMARK,
    END_ANCHOR: $0efbbc9e4d4e61c8$var$END_ANCHOR,
    DOTS_SLASH: $0efbbc9e4d4e61c8$var$DOTS_SLASH,
    NO_DOT: $0efbbc9e4d4e61c8$var$NO_DOT,
    NO_DOTS: $0efbbc9e4d4e61c8$var$NO_DOTS,
    NO_DOT_SLASH: $0efbbc9e4d4e61c8$var$NO_DOT_SLASH,
    NO_DOTS_SLASH: $0efbbc9e4d4e61c8$var$NO_DOTS_SLASH,
    QMARK_NO_DOT: $0efbbc9e4d4e61c8$var$QMARK_NO_DOT,
    STAR: $0efbbc9e4d4e61c8$var$STAR,
    START_ANCHOR: $0efbbc9e4d4e61c8$var$START_ANCHOR
};
/**
 * Windows glob regex
 */ const $0efbbc9e4d4e61c8$var$WINDOWS_CHARS = {
    ...$0efbbc9e4d4e61c8$var$POSIX_CHARS,
    SLASH_LITERAL: `[${$0efbbc9e4d4e61c8$var$WIN_SLASH}]`,
    QMARK: $0efbbc9e4d4e61c8$var$WIN_NO_SLASH,
    STAR: `${$0efbbc9e4d4e61c8$var$WIN_NO_SLASH}*?`,
    DOTS_SLASH: `${$0efbbc9e4d4e61c8$var$DOT_LITERAL}{1,2}(?:[${$0efbbc9e4d4e61c8$var$WIN_SLASH}]|$)`,
    NO_DOT: `(?!${$0efbbc9e4d4e61c8$var$DOT_LITERAL})`,
    NO_DOTS: `(?!(?:^|[${$0efbbc9e4d4e61c8$var$WIN_SLASH}])${$0efbbc9e4d4e61c8$var$DOT_LITERAL}{1,2}(?:[${$0efbbc9e4d4e61c8$var$WIN_SLASH}]|$))`,
    NO_DOT_SLASH: `(?!${$0efbbc9e4d4e61c8$var$DOT_LITERAL}{0,1}(?:[${$0efbbc9e4d4e61c8$var$WIN_SLASH}]|$))`,
    NO_DOTS_SLASH: `(?!${$0efbbc9e4d4e61c8$var$DOT_LITERAL}{1,2}(?:[${$0efbbc9e4d4e61c8$var$WIN_SLASH}]|$))`,
    QMARK_NO_DOT: `[^.${$0efbbc9e4d4e61c8$var$WIN_SLASH}]`,
    START_ANCHOR: `(?:^|[${$0efbbc9e4d4e61c8$var$WIN_SLASH}])`,
    END_ANCHOR: `(?:[${$0efbbc9e4d4e61c8$var$WIN_SLASH}]|$)`
};
/**
 * POSIX Bracket Regex
 */ const $0efbbc9e4d4e61c8$var$POSIX_REGEX_SOURCE = {
    alnum: 'a-zA-Z0-9',
    alpha: 'a-zA-Z',
    ascii: '\\x00-\\x7F',
    blank: ' \\t',
    cntrl: '\\x00-\\x1F\\x7F',
    digit: '0-9',
    graph: '\\x21-\\x7E',
    lower: 'a-z',
    print: '\\x20-\\x7E ',
    punct: '\\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~',
    space: ' \\t\\r\\n\\v\\f',
    upper: 'A-Z',
    word: 'A-Za-z0-9_',
    xdigit: 'A-Fa-f0-9'
};
module.exports = {
    MAX_LENGTH: 65536,
    POSIX_REGEX_SOURCE: $0efbbc9e4d4e61c8$var$POSIX_REGEX_SOURCE,
    // regular expressions
    REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
    REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
    REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
    REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
    REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
    REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
    // Replace globs with equivalent patterns to reduce parsing time.
    REPLACEMENTS: {
        '***': '*',
        '**/**': '**',
        '**/**/**': '**'
    },
    // Digits
    CHAR_0: 48,
    /* 0 */ CHAR_9: 57,
    /* 9 */ // Alphabet chars.
    CHAR_UPPERCASE_A: 65,
    /* A */ CHAR_LOWERCASE_A: 97,
    /* a */ CHAR_UPPERCASE_Z: 90,
    /* Z */ CHAR_LOWERCASE_Z: 122,
    /* z */ CHAR_LEFT_PARENTHESES: 40,
    /* ( */ CHAR_RIGHT_PARENTHESES: 41,
    /* ) */ CHAR_ASTERISK: 42,
    /* * */ // Non-alphabetic chars.
    CHAR_AMPERSAND: 38,
    /* & */ CHAR_AT: 64,
    /* @ */ CHAR_BACKWARD_SLASH: 92,
    /* \ */ CHAR_CARRIAGE_RETURN: 13,
    /* \r */ CHAR_CIRCUMFLEX_ACCENT: 94,
    /* ^ */ CHAR_COLON: 58,
    /* : */ CHAR_COMMA: 44,
    /* , */ CHAR_DOT: 46,
    /* . */ CHAR_DOUBLE_QUOTE: 34,
    /* " */ CHAR_EQUAL: 61,
    /* = */ CHAR_EXCLAMATION_MARK: 33,
    /* ! */ CHAR_FORM_FEED: 12,
    /* \f */ CHAR_FORWARD_SLASH: 47,
    /* / */ CHAR_GRAVE_ACCENT: 96,
    /* ` */ CHAR_HASH: 35,
    /* # */ CHAR_HYPHEN_MINUS: 45,
    /* - */ CHAR_LEFT_ANGLE_BRACKET: 60,
    /* < */ CHAR_LEFT_CURLY_BRACE: 123,
    /* { */ CHAR_LEFT_SQUARE_BRACKET: 91,
    /* [ */ CHAR_LINE_FEED: 10,
    /* \n */ CHAR_NO_BREAK_SPACE: 160,
    /* \u00A0 */ CHAR_PERCENT: 37,
    /* % */ CHAR_PLUS: 43,
    /* + */ CHAR_QUESTION_MARK: 63,
    /* ? */ CHAR_RIGHT_ANGLE_BRACKET: 62,
    /* > */ CHAR_RIGHT_CURLY_BRACE: 125,
    /* } */ CHAR_RIGHT_SQUARE_BRACKET: 93,
    /* ] */ CHAR_SEMICOLON: 59,
    /* ; */ CHAR_SINGLE_QUOTE: 39,
    /* ' */ CHAR_SPACE: 32,
    /*   */ CHAR_TAB: 9,
    /* \t */ CHAR_UNDERSCORE: 95,
    /* _ */ CHAR_VERTICAL_LINE: 124,
    /* | */ CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
    /* \uFEFF */ SEP: $igPDg$path.sep,
    /**
   * Create EXTGLOB_CHARS
   */ extglobChars (chars) {
        return {
            '!': {
                type: 'negate',
                open: '(?:(?!(?:',
                close: `))${chars.STAR})`
            },
            '?': {
                type: 'qmark',
                open: '(?:',
                close: ')?'
            },
            '+': {
                type: 'plus',
                open: '(?:',
                close: ')+'
            },
            '*': {
                type: 'star',
                open: '(?:',
                close: ')*'
            },
            '@': {
                type: 'at',
                open: '(?:',
                close: ')'
            }
        };
    },
    /**
   * Create GLOB_CHARS
   */ globChars (win32) {
        return win32 === true ? $0efbbc9e4d4e61c8$var$WINDOWS_CHARS : $0efbbc9e4d4e61c8$var$POSIX_CHARS;
    }
};

});



parcelRequire.register("hK3j1", function(module, exports) {
'use strict';

var $1hKS4 = parcelRequire("1hKS4");

var $98nIR = parcelRequire("98nIR");
/**
 * Constants
 */ const { MAX_LENGTH: $cea94c00a4bf5f49$var$MAX_LENGTH , POSIX_REGEX_SOURCE: $cea94c00a4bf5f49$var$POSIX_REGEX_SOURCE , REGEX_NON_SPECIAL_CHARS: $cea94c00a4bf5f49$var$REGEX_NON_SPECIAL_CHARS , REGEX_SPECIAL_CHARS_BACKREF: $cea94c00a4bf5f49$var$REGEX_SPECIAL_CHARS_BACKREF , REPLACEMENTS: $cea94c00a4bf5f49$var$REPLACEMENTS  } = $1hKS4;
/**
 * Helpers
 */ const $cea94c00a4bf5f49$var$expandRange = (args, options)=>{
    if (typeof options.expandRange === 'function') return options.expandRange(...args, options);
    args.sort();
    const value = `[${args.join('-')}]`;
    try {
        /* eslint-disable-next-line no-new */ new RegExp(value);
    } catch (ex) {
        return args.map((v)=>$98nIR.escapeRegex(v)
        ).join('..');
    }
    return value;
};
/**
 * Create the message for a syntax error
 */ const $cea94c00a4bf5f49$var$syntaxError = (type, char)=>{
    return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
};
/**
 * Parse the given input string.
 * @param {String} input
 * @param {Object} options
 * @return {Object}
 */ const $cea94c00a4bf5f49$var$parse = (input, options)=>{
    if (typeof input !== 'string') throw new TypeError('Expected a string');
    input = $cea94c00a4bf5f49$var$REPLACEMENTS[input] || input;
    const opts1 = {
        ...options
    };
    const max = typeof opts1.maxLength === 'number' ? Math.min($cea94c00a4bf5f49$var$MAX_LENGTH, opts1.maxLength) : $cea94c00a4bf5f49$var$MAX_LENGTH;
    let len = input.length;
    if (len > max) throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
    const bos = {
        type: 'bos',
        value: '',
        output: opts1.prepend || ''
    };
    const tokens = [
        bos
    ];
    const capture = opts1.capture ? '' : '?:';
    const win32 = $98nIR.isWindows(options);
    // create constants based on platform, for windows or posix
    const PLATFORM_CHARS = $1hKS4.globChars(win32);
    const EXTGLOB_CHARS = $1hKS4.extglobChars(PLATFORM_CHARS);
    const { DOT_LITERAL: DOT_LITERAL , PLUS_LITERAL: PLUS_LITERAL , SLASH_LITERAL: SLASH_LITERAL , ONE_CHAR: ONE_CHAR , DOTS_SLASH: DOTS_SLASH , NO_DOT: NO_DOT , NO_DOT_SLASH: NO_DOT_SLASH , NO_DOTS_SLASH: NO_DOTS_SLASH , QMARK: QMARK , QMARK_NO_DOT: QMARK_NO_DOT , STAR: STAR , START_ANCHOR: START_ANCHOR  } = PLATFORM_CHARS;
    const globstar = (opts)=>{
        return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
    };
    const nodot = opts1.dot ? '' : NO_DOT;
    const qmarkNoDot = opts1.dot ? QMARK : QMARK_NO_DOT;
    let star = opts1.bash === true ? globstar(opts1) : STAR;
    if (opts1.capture) star = `(${star})`;
    // minimatch options support
    if (typeof opts1.noext === 'boolean') opts1.noextglob = opts1.noext;
    const state = {
        input: input,
        index: -1,
        start: 0,
        dot: opts1.dot === true,
        consumed: '',
        output: '',
        prefix: '',
        backtrack: false,
        negated: false,
        brackets: 0,
        braces: 0,
        parens: 0,
        quotes: 0,
        globstar: false,
        tokens: tokens
    };
    input = $98nIR.removePrefix(input, state);
    len = input.length;
    const extglobs = [];
    const braces = [];
    const stack = [];
    let prev = bos;
    let value1;
    /**
   * Tokenizing helpers
   */ const eos = ()=>state.index === len - 1
    ;
    const peek = state.peek = (n = 1)=>input[state.index + n]
    ;
    const advance = state.advance = ()=>input[++state.index] || ''
    ;
    const remaining = ()=>input.slice(state.index + 1)
    ;
    const consume = (value = '', num = 0)=>{
        state.consumed += value;
        state.index += num;
    };
    const append = (token)=>{
        state.output += token.output != null ? token.output : token.value;
        consume(token.value);
    };
    const negate = ()=>{
        let count = 1;
        while(peek() === '!' && (peek(2) !== '(' || peek(3) === '?')){
            advance();
            state.start++;
            count++;
        }
        if (count % 2 === 0) return false;
        state.negated = true;
        state.start++;
        return true;
    };
    const increment = (type)=>{
        state[type]++;
        stack.push(type);
    };
    const decrement = (type)=>{
        state[type]--;
        stack.pop();
    };
    /**
   * Push tokens onto the tokens array. This helper speeds up
   * tokenizing by 1) helping us avoid backtracking as much as possible,
   * and 2) helping us avoid creating extra tokens when consecutive
   * characters are plain text. This improves performance and simplifies
   * lookbehinds.
   */ const push = (tok)=>{
        if (prev.type === 'globstar') {
            const isBrace = state.braces > 0 && (tok.type === 'comma' || tok.type === 'brace');
            const isExtglob = tok.extglob === true || extglobs.length && (tok.type === 'pipe' || tok.type === 'paren');
            if (tok.type !== 'slash' && tok.type !== 'paren' && !isBrace && !isExtglob) {
                state.output = state.output.slice(0, -prev.output.length);
                prev.type = 'star';
                prev.value = '*';
                prev.output = star;
                state.output += prev.output;
            }
        }
        if (extglobs.length && tok.type !== 'paren') extglobs[extglobs.length - 1].inner += tok.value;
        if (tok.value || tok.output) append(tok);
        if (prev && prev.type === 'text' && tok.type === 'text') {
            prev.value += tok.value;
            prev.output = (prev.output || '') + tok.value;
            return;
        }
        tok.prev = prev;
        tokens.push(tok);
        prev = tok;
    };
    const extglobOpen = (type, value)=>{
        const token = {
            ...EXTGLOB_CHARS[value],
            conditions: 1,
            inner: ''
        };
        token.prev = prev;
        token.parens = state.parens;
        token.output = state.output;
        const output = (opts1.capture ? '(' : '') + token.open;
        increment('parens');
        push({
            type: type,
            value: value,
            output: state.output ? '' : ONE_CHAR
        });
        push({
            type: 'paren',
            extglob: true,
            value: advance(),
            output: output
        });
        extglobs.push(token);
    };
    const extglobClose = (token)=>{
        let output = token.close + (opts1.capture ? ')' : '');
        let rest;
        if (token.type === 'negate') {
            let extglobStar = star;
            if (token.inner && token.inner.length > 1 && token.inner.includes('/')) extglobStar = globstar(opts1);
            if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) output = token.close = `)$))${extglobStar}`;
            if (token.inner.includes('*') && (rest = remaining()) && /^\.[^\\/.]+$/.test(rest)) output = token.close = `)${rest})${extglobStar})`;
            if (token.prev.type === 'bos') state.negatedExtglob = true;
        }
        push({
            type: 'paren',
            extglob: true,
            value: value1,
            output: output
        });
        decrement('parens');
    };
    /**
   * Fast paths
   */ if (opts1.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
        let backslashes = false;
        let output = input.replace($cea94c00a4bf5f49$var$REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index)=>{
            if (first === '\\') {
                backslashes = true;
                return m;
            }
            if (first === '?') {
                if (esc) return esc + first + (rest ? QMARK.repeat(rest.length) : '');
                if (index === 0) return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : '');
                return QMARK.repeat(chars.length);
            }
            if (first === '.') return DOT_LITERAL.repeat(chars.length);
            if (first === '*') {
                if (esc) return esc + first + (rest ? star : '');
                return star;
            }
            return esc ? m : `\\${m}`;
        });
        if (backslashes === true) {
            if (opts1.unescape === true) output = output.replace(/\\/g, '');
            else output = output.replace(/\\+/g, (m)=>{
                return m.length % 2 === 0 ? '\\\\' : m ? '\\' : '';
            });
        }
        if (output === input && opts1.contains === true) {
            state.output = input;
            return state;
        }
        state.output = $98nIR.wrapOutput(output, state, options);
        return state;
    }
    /**
   * Tokenize input until we reach end-of-string
   */ while(!eos()){
        value1 = advance();
        if (value1 === '\u0000') continue;
        /**
     * Escaped characters
     */ if (value1 === '\\') {
            const next = peek();
            if (next === '/' && opts1.bash !== true) continue;
            if (next === '.' || next === ';') continue;
            if (!next) {
                value1 += '\\';
                push({
                    type: 'text',
                    value: value1
                });
                continue;
            }
            // collapse slashes to reduce potential for exploits
            const match = /^\\+/.exec(remaining());
            let slashes = 0;
            if (match && match[0].length > 2) {
                slashes = match[0].length;
                state.index += slashes;
                if (slashes % 2 !== 0) value1 += '\\';
            }
            if (opts1.unescape === true) value1 = advance();
            else value1 += advance();
            if (state.brackets === 0) {
                push({
                    type: 'text',
                    value: value1
                });
                continue;
            }
        }
        /**
     * If we're inside a regex character class, continue
     * until we reach the closing bracket.
     */ if (state.brackets > 0 && (value1 !== ']' || prev.value === '[' || prev.value === '[^')) {
            if (opts1.posix !== false && value1 === ':') {
                const inner = prev.value.slice(1);
                if (inner.includes('[')) {
                    prev.posix = true;
                    if (inner.includes(':')) {
                        const idx = prev.value.lastIndexOf('[');
                        const pre = prev.value.slice(0, idx);
                        const rest = prev.value.slice(idx + 2);
                        const posix = $cea94c00a4bf5f49$var$POSIX_REGEX_SOURCE[rest];
                        if (posix) {
                            prev.value = pre + posix;
                            state.backtrack = true;
                            advance();
                            if (!bos.output && tokens.indexOf(prev) === 1) bos.output = ONE_CHAR;
                            continue;
                        }
                    }
                }
            }
            if (value1 === '[' && peek() !== ':' || value1 === '-' && peek() === ']') value1 = `\\${value1}`;
            if (value1 === ']' && (prev.value === '[' || prev.value === '[^')) value1 = `\\${value1}`;
            if (opts1.posix === true && value1 === '!' && prev.value === '[') value1 = '^';
            prev.value += value1;
            append({
                value: value1
            });
            continue;
        }
        /**
     * If we're inside a quoted string, continue
     * until we reach the closing double quote.
     */ if (state.quotes === 1 && value1 !== '"') {
            value1 = $98nIR.escapeRegex(value1);
            prev.value += value1;
            append({
                value: value1
            });
            continue;
        }
        /**
     * Double quotes
     */ if (value1 === '"') {
            state.quotes = state.quotes === 1 ? 0 : 1;
            if (opts1.keepQuotes === true) push({
                type: 'text',
                value: value1
            });
            continue;
        }
        /**
     * Parentheses
     */ if (value1 === '(') {
            increment('parens');
            push({
                type: 'paren',
                value: value1
            });
            continue;
        }
        if (value1 === ')') {
            if (state.parens === 0 && opts1.strictBrackets === true) throw new SyntaxError($cea94c00a4bf5f49$var$syntaxError('opening', '('));
            const extglob = extglobs[extglobs.length - 1];
            if (extglob && state.parens === extglob.parens + 1) {
                extglobClose(extglobs.pop());
                continue;
            }
            push({
                type: 'paren',
                value: value1,
                output: state.parens ? ')' : '\\)'
            });
            decrement('parens');
            continue;
        }
        /**
     * Square brackets
     */ if (value1 === '[') {
            if (opts1.nobracket === true || !remaining().includes(']')) {
                if (opts1.nobracket !== true && opts1.strictBrackets === true) throw new SyntaxError($cea94c00a4bf5f49$var$syntaxError('closing', ']'));
                value1 = `\\${value1}`;
            } else increment('brackets');
            push({
                type: 'bracket',
                value: value1
            });
            continue;
        }
        if (value1 === ']') {
            if (opts1.nobracket === true || prev && prev.type === 'bracket' && prev.value.length === 1) {
                push({
                    type: 'text',
                    value: value1,
                    output: `\\${value1}`
                });
                continue;
            }
            if (state.brackets === 0) {
                if (opts1.strictBrackets === true) throw new SyntaxError($cea94c00a4bf5f49$var$syntaxError('opening', '['));
                push({
                    type: 'text',
                    value: value1,
                    output: `\\${value1}`
                });
                continue;
            }
            decrement('brackets');
            const prevValue = prev.value.slice(1);
            if (prev.posix !== true && prevValue[0] === '^' && !prevValue.includes('/')) value1 = `/${value1}`;
            prev.value += value1;
            append({
                value: value1
            });
            // when literal brackets are explicitly disabled
            // assume we should match with a regex character class
            if (opts1.literalBrackets === false || $98nIR.hasRegexChars(prevValue)) continue;
            const escaped = $98nIR.escapeRegex(prev.value);
            state.output = state.output.slice(0, -prev.value.length);
            // when literal brackets are explicitly enabled
            // assume we should escape the brackets to match literal characters
            if (opts1.literalBrackets === true) {
                state.output += escaped;
                prev.value = escaped;
                continue;
            }
            // when the user specifies nothing, try to match both
            prev.value = `(${capture}${escaped}|${prev.value})`;
            state.output += prev.value;
            continue;
        }
        /**
     * Braces
     */ if (value1 === '{' && opts1.nobrace !== true) {
            increment('braces');
            const open = {
                type: 'brace',
                value: value1,
                output: '(',
                outputIndex: state.output.length,
                tokensIndex: state.tokens.length
            };
            braces.push(open);
            push(open);
            continue;
        }
        if (value1 === '}') {
            const brace = braces[braces.length - 1];
            if (opts1.nobrace === true || !brace) {
                push({
                    type: 'text',
                    value: value1,
                    output: value1
                });
                continue;
            }
            let output = ')';
            if (brace.dots === true) {
                const arr = tokens.slice();
                const range = [];
                for(let i = arr.length - 1; i >= 0; i--){
                    tokens.pop();
                    if (arr[i].type === 'brace') break;
                    if (arr[i].type !== 'dots') range.unshift(arr[i].value);
                }
                output = $cea94c00a4bf5f49$var$expandRange(range, opts1);
                state.backtrack = true;
            }
            if (brace.comma !== true && brace.dots !== true) {
                const out = state.output.slice(0, brace.outputIndex);
                const toks = state.tokens.slice(brace.tokensIndex);
                brace.value = brace.output = '\\{';
                value1 = output = '\\}';
                state.output = out;
                for (const t of toks)state.output += t.output || t.value;
            }
            push({
                type: 'brace',
                value: value1,
                output: output
            });
            decrement('braces');
            braces.pop();
            continue;
        }
        /**
     * Pipes
     */ if (value1 === '|') {
            if (extglobs.length > 0) extglobs[extglobs.length - 1].conditions++;
            push({
                type: 'text',
                value: value1
            });
            continue;
        }
        /**
     * Commas
     */ if (value1 === ',') {
            let output = value1;
            const brace = braces[braces.length - 1];
            if (brace && stack[stack.length - 1] === 'braces') {
                brace.comma = true;
                output = '|';
            }
            push({
                type: 'comma',
                value: value1,
                output: output
            });
            continue;
        }
        /**
     * Slashes
     */ if (value1 === '/') {
            // if the beginning of the glob is "./", advance the start
            // to the current index, and don't add the "./" characters
            // to the state. This greatly simplifies lookbehinds when
            // checking for BOS characters like "!" and "." (not "./")
            if (prev.type === 'dot' && state.index === state.start + 1) {
                state.start = state.index + 1;
                state.consumed = '';
                state.output = '';
                tokens.pop();
                prev = bos; // reset "prev" to the first token
                continue;
            }
            push({
                type: 'slash',
                value: value1,
                output: SLASH_LITERAL
            });
            continue;
        }
        /**
     * Dots
     */ if (value1 === '.') {
            if (state.braces > 0 && prev.type === 'dot') {
                if (prev.value === '.') prev.output = DOT_LITERAL;
                const brace = braces[braces.length - 1];
                prev.type = 'dots';
                prev.output += value1;
                prev.value += value1;
                brace.dots = true;
                continue;
            }
            if (state.braces + state.parens === 0 && prev.type !== 'bos' && prev.type !== 'slash') {
                push({
                    type: 'text',
                    value: value1,
                    output: DOT_LITERAL
                });
                continue;
            }
            push({
                type: 'dot',
                value: value1,
                output: DOT_LITERAL
            });
            continue;
        }
        /**
     * Question marks
     */ if (value1 === '?') {
            const isGroup = prev && prev.value === '(';
            if (!isGroup && opts1.noextglob !== true && peek() === '(' && peek(2) !== '?') {
                extglobOpen('qmark', value1);
                continue;
            }
            if (prev && prev.type === 'paren') {
                const next = peek();
                let output = value1;
                if (next === '<' && !$98nIR.supportsLookbehinds()) throw new Error('Node.js v10 or higher is required for regex lookbehinds');
                if (prev.value === '(' && !/[!=<:]/.test(next) || next === '<' && !/<([!=]|\w+>)/.test(remaining())) output = `\\${value1}`;
                push({
                    type: 'text',
                    value: value1,
                    output: output
                });
                continue;
            }
            if (opts1.dot !== true && (prev.type === 'slash' || prev.type === 'bos')) {
                push({
                    type: 'qmark',
                    value: value1,
                    output: QMARK_NO_DOT
                });
                continue;
            }
            push({
                type: 'qmark',
                value: value1,
                output: QMARK
            });
            continue;
        }
        /**
     * Exclamation
     */ if (value1 === '!') {
            if (opts1.noextglob !== true && peek() === '(') {
                if (peek(2) !== '?' || !/[!=<:]/.test(peek(3))) {
                    extglobOpen('negate', value1);
                    continue;
                }
            }
            if (opts1.nonegate !== true && state.index === 0) {
                negate();
                continue;
            }
        }
        /**
     * Plus
     */ if (value1 === '+') {
            if (opts1.noextglob !== true && peek() === '(' && peek(2) !== '?') {
                extglobOpen('plus', value1);
                continue;
            }
            if (prev && prev.value === '(' || opts1.regex === false) {
                push({
                    type: 'plus',
                    value: value1,
                    output: PLUS_LITERAL
                });
                continue;
            }
            if (prev && (prev.type === 'bracket' || prev.type === 'paren' || prev.type === 'brace') || state.parens > 0) {
                push({
                    type: 'plus',
                    value: value1
                });
                continue;
            }
            push({
                type: 'plus',
                value: PLUS_LITERAL
            });
            continue;
        }
        /**
     * Plain text
     */ if (value1 === '@') {
            if (opts1.noextglob !== true && peek() === '(' && peek(2) !== '?') {
                push({
                    type: 'at',
                    extglob: true,
                    value: value1,
                    output: ''
                });
                continue;
            }
            push({
                type: 'text',
                value: value1
            });
            continue;
        }
        /**
     * Plain text
     */ if (value1 !== '*') {
            if (value1 === '$' || value1 === '^') value1 = `\\${value1}`;
            const match = $cea94c00a4bf5f49$var$REGEX_NON_SPECIAL_CHARS.exec(remaining());
            if (match) {
                value1 += match[0];
                state.index += match[0].length;
            }
            push({
                type: 'text',
                value: value1
            });
            continue;
        }
        /**
     * Stars
     */ if (prev && (prev.type === 'globstar' || prev.star === true)) {
            prev.type = 'star';
            prev.star = true;
            prev.value += value1;
            prev.output = star;
            state.backtrack = true;
            state.globstar = true;
            consume(value1);
            continue;
        }
        let rest = remaining();
        if (opts1.noextglob !== true && /^\([^?]/.test(rest)) {
            extglobOpen('star', value1);
            continue;
        }
        if (prev.type === 'star') {
            if (opts1.noglobstar === true) {
                consume(value1);
                continue;
            }
            const prior = prev.prev;
            const before = prior.prev;
            const isStart = prior.type === 'slash' || prior.type === 'bos';
            const afterStar = before && (before.type === 'star' || before.type === 'globstar');
            if (opts1.bash === true && (!isStart || rest[0] && rest[0] !== '/')) {
                push({
                    type: 'star',
                    value: value1,
                    output: ''
                });
                continue;
            }
            const isBrace = state.braces > 0 && (prior.type === 'comma' || prior.type === 'brace');
            const isExtglob = extglobs.length && (prior.type === 'pipe' || prior.type === 'paren');
            if (!isStart && prior.type !== 'paren' && !isBrace && !isExtglob) {
                push({
                    type: 'star',
                    value: value1,
                    output: ''
                });
                continue;
            }
            // strip consecutive `/**/`
            while(rest.slice(0, 3) === '/**'){
                const after = input[state.index + 4];
                if (after && after !== '/') break;
                rest = rest.slice(3);
                consume('/**', 3);
            }
            if (prior.type === 'bos' && eos()) {
                prev.type = 'globstar';
                prev.value += value1;
                prev.output = globstar(opts1);
                state.output = prev.output;
                state.globstar = true;
                consume(value1);
                continue;
            }
            if (prior.type === 'slash' && prior.prev.type !== 'bos' && !afterStar && eos()) {
                state.output = state.output.slice(0, -(prior.output + prev.output).length);
                prior.output = `(?:${prior.output}`;
                prev.type = 'globstar';
                prev.output = globstar(opts1) + (opts1.strictSlashes ? ')' : '|$)');
                prev.value += value1;
                state.globstar = true;
                state.output += prior.output + prev.output;
                consume(value1);
                continue;
            }
            if (prior.type === 'slash' && prior.prev.type !== 'bos' && rest[0] === '/') {
                const end = rest[1] !== void 0 ? '|$' : '';
                state.output = state.output.slice(0, -(prior.output + prev.output).length);
                prior.output = `(?:${prior.output}`;
                prev.type = 'globstar';
                prev.output = `${globstar(opts1)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
                prev.value += value1;
                state.output += prior.output + prev.output;
                state.globstar = true;
                consume(value1 + advance());
                push({
                    type: 'slash',
                    value: '/',
                    output: ''
                });
                continue;
            }
            if (prior.type === 'bos' && rest[0] === '/') {
                prev.type = 'globstar';
                prev.value += value1;
                prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts1)}${SLASH_LITERAL})`;
                state.output = prev.output;
                state.globstar = true;
                consume(value1 + advance());
                push({
                    type: 'slash',
                    value: '/',
                    output: ''
                });
                continue;
            }
            // remove single star from output
            state.output = state.output.slice(0, -prev.output.length);
            // reset previous token to globstar
            prev.type = 'globstar';
            prev.output = globstar(opts1);
            prev.value += value1;
            // reset output with globstar
            state.output += prev.output;
            state.globstar = true;
            consume(value1);
            continue;
        }
        const token = {
            type: 'star',
            value: value1,
            output: star
        };
        if (opts1.bash === true) {
            token.output = '.*?';
            if (prev.type === 'bos' || prev.type === 'slash') token.output = nodot + token.output;
            push(token);
            continue;
        }
        if (prev && (prev.type === 'bracket' || prev.type === 'paren') && opts1.regex === true) {
            token.output = value1;
            push(token);
            continue;
        }
        if (state.index === state.start || prev.type === 'slash' || prev.type === 'dot') {
            if (prev.type === 'dot') {
                state.output += NO_DOT_SLASH;
                prev.output += NO_DOT_SLASH;
            } else if (opts1.dot === true) {
                state.output += NO_DOTS_SLASH;
                prev.output += NO_DOTS_SLASH;
            } else {
                state.output += nodot;
                prev.output += nodot;
            }
            if (peek() !== '*') {
                state.output += ONE_CHAR;
                prev.output += ONE_CHAR;
            }
        }
        push(token);
    }
    while(state.brackets > 0){
        if (opts1.strictBrackets === true) throw new SyntaxError($cea94c00a4bf5f49$var$syntaxError('closing', ']'));
        state.output = $98nIR.escapeLast(state.output, '[');
        decrement('brackets');
    }
    while(state.parens > 0){
        if (opts1.strictBrackets === true) throw new SyntaxError($cea94c00a4bf5f49$var$syntaxError('closing', ')'));
        state.output = $98nIR.escapeLast(state.output, '(');
        decrement('parens');
    }
    while(state.braces > 0){
        if (opts1.strictBrackets === true) throw new SyntaxError($cea94c00a4bf5f49$var$syntaxError('closing', '}'));
        state.output = $98nIR.escapeLast(state.output, '{');
        decrement('braces');
    }
    if (opts1.strictSlashes !== true && (prev.type === 'star' || prev.type === 'bracket')) push({
        type: 'maybe_slash',
        value: '',
        output: `${SLASH_LITERAL}?`
    });
    // rebuild the output if we had to backtrack at any point
    if (state.backtrack === true) {
        state.output = '';
        for (const token of state.tokens){
            state.output += token.output != null ? token.output : token.value;
            if (token.suffix) state.output += token.suffix;
        }
    }
    return state;
};
/**
 * Fast paths for creating regular expressions for common glob patterns.
 * This can significantly speed up processing and has very little downside
 * impact when none of the fast paths match.
 */ $cea94c00a4bf5f49$var$parse.fastpaths = (input, options)=>{
    const opts2 = {
        ...options
    };
    const max = typeof opts2.maxLength === 'number' ? Math.min($cea94c00a4bf5f49$var$MAX_LENGTH, opts2.maxLength) : $cea94c00a4bf5f49$var$MAX_LENGTH;
    const len = input.length;
    if (len > max) throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
    input = $cea94c00a4bf5f49$var$REPLACEMENTS[input] || input;
    const win32 = $98nIR.isWindows(options);
    // create constants based on platform, for windows or posix
    const { DOT_LITERAL: DOT_LITERAL , SLASH_LITERAL: SLASH_LITERAL , ONE_CHAR: ONE_CHAR , DOTS_SLASH: DOTS_SLASH , NO_DOT: NO_DOT , NO_DOTS: NO_DOTS , NO_DOTS_SLASH: NO_DOTS_SLASH , STAR: STAR , START_ANCHOR: START_ANCHOR  } = $1hKS4.globChars(win32);
    const nodot = opts2.dot ? NO_DOTS : NO_DOT;
    const slashDot = opts2.dot ? NO_DOTS_SLASH : NO_DOT;
    const capture = opts2.capture ? '' : '?:';
    const state = {
        negated: false,
        prefix: ''
    };
    let star = opts2.bash === true ? '.*?' : STAR;
    if (opts2.capture) star = `(${star})`;
    const globstar = (opts)=>{
        if (opts.noglobstar === true) return star;
        return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
    };
    const create = (str)=>{
        switch(str){
            case '*':
                return `${nodot}${ONE_CHAR}${star}`;
            case '.*':
                return `${DOT_LITERAL}${ONE_CHAR}${star}`;
            case '*.*':
                return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
            case '*/*':
                return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;
            case '**':
                return nodot + globstar(opts2);
            case '**/*':
                return `(?:${nodot}${globstar(opts2)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;
            case '**/*.*':
                return `(?:${nodot}${globstar(opts2)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
            case '**/.*':
                return `(?:${nodot}${globstar(opts2)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;
            default:
                {
                    const match = /^(.*?)\.(\w+)$/.exec(str);
                    if (!match) return;
                    const source = create(match[1]);
                    if (!source) return;
                    return source + DOT_LITERAL + match[2];
                }
        }
    };
    const output = $98nIR.removePrefix(input, state);
    let source1 = create(output);
    if (source1 && opts2.strictSlashes !== true) source1 += `${SLASH_LITERAL}?`;
    return source1;
};
module.exports = $cea94c00a4bf5f49$var$parse;

});





parcelRequire.register("5EV8S", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.merge = void 0;

var $9Qp0u = parcelRequire("9Qp0u");
function $41ed03670b148a70$var$merge(streams) {
    const mergedStream = $9Qp0u(streams);
    streams.forEach((stream)=>{
        stream.once('error', (error)=>mergedStream.emit('error', error)
        );
    });
    mergedStream.once('close', ()=>$41ed03670b148a70$var$propagateCloseEventToSources(streams)
    );
    mergedStream.once('end', ()=>$41ed03670b148a70$var$propagateCloseEventToSources(streams)
    );
    return mergedStream;
}
module.exports.merge = $41ed03670b148a70$var$merge;
function $41ed03670b148a70$var$propagateCloseEventToSources(streams) {
    streams.forEach((stream)=>stream.emit('close')
    );
}

});
parcelRequire.register("9Qp0u", function(module, exports) {
'use strict';

const $72ac5e39cbb01c93$var$PassThrough = $igPDg$stream.PassThrough;
const $72ac5e39cbb01c93$var$slice = Array.prototype.slice;
module.exports = $72ac5e39cbb01c93$var$merge2;
function $72ac5e39cbb01c93$var$merge2() {
    const streamsQueue = [];
    const args = $72ac5e39cbb01c93$var$slice.call(arguments);
    let merging = false;
    let options = args[args.length - 1];
    if (options && !Array.isArray(options) && options.pipe == null) args.pop();
    else options = {
    };
    const doEnd = options.end !== false;
    const doPipeError = options.pipeError === true;
    if (options.objectMode == null) options.objectMode = true;
    if (options.highWaterMark == null) options.highWaterMark = 65536;
    const mergedStream = $72ac5e39cbb01c93$var$PassThrough(options);
    function addStream() {
        for(let i = 0, len = arguments.length; i < len; i++)streamsQueue.push($72ac5e39cbb01c93$var$pauseStreams(arguments[i], options));
        mergeStream();
        return this;
    }
    function mergeStream() {
        if (merging) return;
        merging = true;
        let streams = streamsQueue.shift();
        if (!streams) {
            process.nextTick(endStream);
            return;
        }
        if (!Array.isArray(streams)) streams = [
            streams
        ];
        let pipesCount = streams.length + 1;
        function next() {
            if (--pipesCount > 0) return;
            merging = false;
            mergeStream();
        }
        function pipe(stream) {
            function onend() {
                stream.removeListener('merge2UnpipeEnd', onend);
                stream.removeListener('end', onend);
                if (doPipeError) stream.removeListener('error', onerror);
                next();
            }
            function onerror(err) {
                mergedStream.emit('error', err);
            }
            // skip ended stream
            if (stream._readableState.endEmitted) return next();
            stream.on('merge2UnpipeEnd', onend);
            stream.on('end', onend);
            if (doPipeError) stream.on('error', onerror);
            stream.pipe(mergedStream, {
                end: false
            });
            // compatible for old stream
            stream.resume();
        }
        for(let i = 0; i < streams.length; i++)pipe(streams[i]);
        next();
    }
    function endStream() {
        merging = false;
        // emit 'queueDrain' when all streams merged.
        mergedStream.emit('queueDrain');
        if (doEnd) mergedStream.end();
    }
    mergedStream.setMaxListeners(0);
    mergedStream.add = addStream;
    mergedStream.on('unpipe', function(stream) {
        stream.emit('merge2UnpipeEnd');
    });
    if (args.length) addStream.apply(null, args);
    return mergedStream;
}
// check and pause streams for pipe.
function $72ac5e39cbb01c93$var$pauseStreams(streams, options) {
    if (!Array.isArray(streams)) {
        // Backwards-compat with old-style streams
        if (!streams._readableState && streams.pipe) streams = streams.pipe($72ac5e39cbb01c93$var$PassThrough(options));
        if (!streams._readableState || !streams.pause || !streams.pipe) throw new Error('Only readable stream can be merged.');
        streams.pause();
    } else for(let i = 0, len = streams.length; i < len; i++)streams[i] = $72ac5e39cbb01c93$var$pauseStreams(streams[i], options);
    return streams;
}

});


parcelRequire.register("7l6KD", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.isEmpty = module.exports.isString = void 0;
function $557fbb3c50b7e6ea$var$isString(input) {
    return typeof input === 'string';
}
module.exports.isString = $557fbb3c50b7e6ea$var$isString;
function $557fbb3c50b7e6ea$var$isEmpty(input) {
    return input === '';
}
module.exports.isEmpty = $557fbb3c50b7e6ea$var$isEmpty;

});



parcelRequire.register("aQhOg", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});

var $cQf51 = parcelRequire("cQf51");

var $3naU1 = parcelRequire("3naU1");
class $7e4c93545d0d08f8$var$ProviderAsync extends $3naU1.default {
    constructor(){
        super(...arguments);
        this._reader = new $cQf51.default(this._settings);
    }
    read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const entries = [];
        return new Promise((resolve, reject)=>{
            const stream = this.api(root, task, options);
            stream.once('error', reject);
            stream.on('data', (entry)=>entries.push(options.transform(entry))
            );
            stream.once('end', ()=>resolve(entries)
            );
        });
    }
    api(root, task1, options) {
        if (task1.dynamic) return this._reader.dynamic(root, options);
        return this._reader.static(task1.patterns, options);
    }
}
module.exports.default = $7e4c93545d0d08f8$var$ProviderAsync;

});
parcelRequire.register("cQf51", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});


var $aq6Xb = parcelRequire("aq6Xb");

var $6p45y = parcelRequire("6p45y");

var $iy4kQ = parcelRequire("iy4kQ");
class $959609f286e08eae$var$ReaderStream extends $iy4kQ.default {
    constructor(){
        super(...arguments);
        this._walkStream = $6p45y.walkStream;
        this._stat = $aq6Xb.stat;
    }
    dynamic(root, options) {
        return this._walkStream(root, options);
    }
    static(patterns, options1) {
        const filepaths = patterns.map(this._getFullEntryPath, this);
        const stream = new $igPDg$stream.PassThrough({
            objectMode: true
        });
        stream._write = (index, _enc, done)=>{
            return this._getEntry(filepaths[index], patterns[index], options1).then((entry)=>{
                if (entry !== null && options1.entryFilter(entry)) stream.push(entry);
                if (index === filepaths.length - 1) stream.end();
                done();
            }).catch(done);
        };
        for(let i = 0; i < filepaths.length; i++)stream.write(i);
        return stream;
    }
    _getEntry(filepath, pattern, options2) {
        return this._getStat(filepath).then((stats)=>this._makeEntry(stats, pattern)
        ).catch((error)=>{
            if (options2.errorFilter(error)) return null;
            throw error;
        });
    }
    _getStat(filepath1) {
        return new Promise((resolve, reject)=>{
            this._stat(filepath1, this._fsStatSettings, (error, stats)=>{
                return error === null ? resolve(stats) : reject(error);
            });
        });
    }
}
module.exports.default = $959609f286e08eae$var$ReaderStream;

});
parcelRequire.register("aq6Xb", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.statSync = module.exports.stat = module.exports.Settings = void 0;

var $1QDOq = parcelRequire("1QDOq");

var $7L4Tu = parcelRequire("7L4Tu");

var $4F9cd = parcelRequire("4F9cd");
module.exports.Settings = $4F9cd.default;
function $7961b9ecb97bddbf$var$stat(path, optionsOrSettingsOrCallback, callback) {
    if (typeof optionsOrSettingsOrCallback === 'function') return $1QDOq.read(path, $7961b9ecb97bddbf$var$getSettings(), optionsOrSettingsOrCallback);
    $1QDOq.read(path, $7961b9ecb97bddbf$var$getSettings(optionsOrSettingsOrCallback), callback);
}
module.exports.stat = $7961b9ecb97bddbf$var$stat;
function $7961b9ecb97bddbf$var$statSync(path, optionsOrSettings) {
    const settings = $7961b9ecb97bddbf$var$getSettings(optionsOrSettings);
    return $7L4Tu.read(path, settings);
}
module.exports.statSync = $7961b9ecb97bddbf$var$statSync;
function $7961b9ecb97bddbf$var$getSettings(settingsOrOptions = {
}) {
    if (settingsOrOptions instanceof $4F9cd.default) return settingsOrOptions;
    return new $4F9cd.default(settingsOrOptions);
}

});
parcelRequire.register("1QDOq", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.read = void 0;
function $158987a5b21e0cfa$var$read(path, settings, callback) {
    settings.fs.lstat(path, (lstatError, lstat)=>{
        if (lstatError !== null) return $158987a5b21e0cfa$var$callFailureCallback(callback, lstatError);
        if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) return $158987a5b21e0cfa$var$callSuccessCallback(callback, lstat);
        settings.fs.stat(path, (statError, stat)=>{
            if (statError !== null) {
                if (settings.throwErrorOnBrokenSymbolicLink) return $158987a5b21e0cfa$var$callFailureCallback(callback, statError);
                return $158987a5b21e0cfa$var$callSuccessCallback(callback, lstat);
            }
            if (settings.markSymbolicLink) stat.isSymbolicLink = ()=>true
            ;
            $158987a5b21e0cfa$var$callSuccessCallback(callback, stat);
        });
    });
}
module.exports.read = $158987a5b21e0cfa$var$read;
function $158987a5b21e0cfa$var$callFailureCallback(callback, error) {
    callback(error);
}
function $158987a5b21e0cfa$var$callSuccessCallback(callback, result) {
    callback(null, result);
}

});

parcelRequire.register("7L4Tu", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.read = void 0;
function $5a60b80ea886fad9$var$read(path, settings) {
    const lstat = settings.fs.lstatSync(path);
    if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) return lstat;
    try {
        const stat = settings.fs.statSync(path);
        if (settings.markSymbolicLink) stat.isSymbolicLink = ()=>true
        ;
        return stat;
    } catch (error) {
        if (!settings.throwErrorOnBrokenSymbolicLink) return lstat;
        throw error;
    }
}
module.exports.read = $5a60b80ea886fad9$var$read;

});

parcelRequire.register("4F9cd", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});

var $N7JKb = parcelRequire("N7JKb");
class $36521fec0995658e$var$Settings {
    constructor(_options = {
    }){
        this._options = _options;
        this.followSymbolicLink = this._getValue(this._options.followSymbolicLink, true);
        this.fs = $N7JKb.createFileSystemAdapter(this._options.fs);
        this.markSymbolicLink = this._getValue(this._options.markSymbolicLink, false);
        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
    }
    _getValue(option, value) {
        return option !== null && option !== void 0 ? option : value;
    }
}
module.exports.default = $36521fec0995658e$var$Settings;

});
parcelRequire.register("N7JKb", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.createFileSystemAdapter = module.exports.FILE_SYSTEM_ADAPTER = void 0;

module.exports.FILE_SYSTEM_ADAPTER = {
    lstat: $igPDg$fs.lstat,
    stat: $igPDg$fs.stat,
    lstatSync: $igPDg$fs.lstatSync,
    statSync: $igPDg$fs.statSync
};
function $093a94160f68685f$var$createFileSystemAdapter(fsMethods) {
    if (fsMethods === undefined) return module.exports.FILE_SYSTEM_ADAPTER;
    return Object.assign(Object.assign({
    }, module.exports.FILE_SYSTEM_ADAPTER), fsMethods);
}
module.exports.createFileSystemAdapter = $093a94160f68685f$var$createFileSystemAdapter;

});



parcelRequire.register("6p45y", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.Settings = module.exports.walkStream = module.exports.walkSync = module.exports.walk = void 0;

var $d0sok = parcelRequire("d0sok");

var $gfmLs = parcelRequire("gfmLs");

var $daYpM = parcelRequire("daYpM");

var $aerJk = parcelRequire("aerJk");
module.exports.Settings = $aerJk.default;
function $4a983fceb7d0f09c$var$walk(directory, optionsOrSettingsOrCallback, callback) {
    if (typeof optionsOrSettingsOrCallback === 'function') return new $d0sok.default(directory, $4a983fceb7d0f09c$var$getSettings()).read(optionsOrSettingsOrCallback);
    new $d0sok.default(directory, $4a983fceb7d0f09c$var$getSettings(optionsOrSettingsOrCallback)).read(callback);
}
module.exports.walk = $4a983fceb7d0f09c$var$walk;
function $4a983fceb7d0f09c$var$walkSync(directory, optionsOrSettings) {
    const settings = $4a983fceb7d0f09c$var$getSettings(optionsOrSettings);
    const provider = new $daYpM.default(directory, settings);
    return provider.read();
}
module.exports.walkSync = $4a983fceb7d0f09c$var$walkSync;
function $4a983fceb7d0f09c$var$walkStream(directory, optionsOrSettings) {
    const settings = $4a983fceb7d0f09c$var$getSettings(optionsOrSettings);
    const provider = new $gfmLs.default(directory, settings);
    return provider.read();
}
module.exports.walkStream = $4a983fceb7d0f09c$var$walkStream;
function $4a983fceb7d0f09c$var$getSettings(settingsOrOptions = {
}) {
    if (settingsOrOptions instanceof $aerJk.default) return settingsOrOptions;
    return new $aerJk.default(settingsOrOptions);
}

});
parcelRequire.register("d0sok", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});

var $1uLWe = parcelRequire("1uLWe");
class $97814c6935a1d28a$var$AsyncProvider {
    constructor(_root, _settings){
        this._root = _root;
        this._settings = _settings;
        this._reader = new $1uLWe.default(this._root, this._settings);
        this._storage = new Set();
    }
    read(callback1) {
        this._reader.onError((error)=>{
            $97814c6935a1d28a$var$callFailureCallback(callback1, error);
        });
        this._reader.onEntry((entry)=>{
            this._storage.add(entry);
        });
        this._reader.onEnd(()=>{
            $97814c6935a1d28a$var$callSuccessCallback(callback1, [
                ...this._storage
            ]);
        });
        this._reader.read();
    }
}
module.exports.default = $97814c6935a1d28a$var$AsyncProvider;
function $97814c6935a1d28a$var$callFailureCallback(callback, error) {
    callback(error);
}
function $97814c6935a1d28a$var$callSuccessCallback(callback, entries) {
    callback(null, entries);
}

});
parcelRequire.register("1uLWe", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});


var $kEW8K = parcelRequire("kEW8K");

var $8NZ64 = parcelRequire("8NZ64");

var $jKf10 = parcelRequire("jKf10");

var $gcGYP = parcelRequire("gcGYP");
class $116dc75527f795fd$var$AsyncReader extends $gcGYP.default {
    constructor(_root, _settings){
        super(_root, _settings);
        this._settings = _settings;
        this._scandir = $kEW8K.scandir;
        this._emitter = new $igPDg$events.EventEmitter();
        this._queue = $8NZ64(this._worker.bind(this), this._settings.concurrency);
        this._isFatalError = false;
        this._isDestroyed = false;
        this._queue.drain = ()=>{
            if (!this._isFatalError) this._emitter.emit('end');
        };
    }
    read() {
        this._isFatalError = false;
        this._isDestroyed = false;
        setImmediate(()=>{
            this._pushToQueue(this._root, this._settings.basePath);
        });
        return this._emitter;
    }
    get isDestroyed() {
        return this._isDestroyed;
    }
    destroy() {
        if (this._isDestroyed) throw new Error('The reader is already destroyed');
        this._isDestroyed = true;
        this._queue.killAndDrain();
    }
    onEntry(callback) {
        this._emitter.on('entry', callback);
    }
    onError(callback1) {
        this._emitter.once('error', callback1);
    }
    onEnd(callback2) {
        this._emitter.once('end', callback2);
    }
    _pushToQueue(directory, base) {
        const queueItem = {
            directory: directory,
            base: base
        };
        this._queue.push(queueItem, (error)=>{
            if (error !== null) this._handleError(error);
        });
    }
    _worker(item, done) {
        this._scandir(item.directory, this._settings.fsScandirSettings, (error, entries)=>{
            if (error !== null) return done(error, undefined);
            for (const entry of entries)this._handleEntry(entry, item.base);
            done(null, undefined);
        });
    }
    _handleError(error) {
        if (this._isDestroyed || !$jKf10.isFatalError(this._settings, error)) return;
        this._isFatalError = true;
        this._isDestroyed = true;
        this._emitter.emit('error', error);
    }
    _handleEntry(entry, base1) {
        if (this._isDestroyed || this._isFatalError) return;
        const fullpath = entry.path;
        if (base1 !== undefined) entry.path = $jKf10.joinPathSegments(base1, entry.name, this._settings.pathSegmentSeparator);
        if ($jKf10.isAppliedFilter(this._settings.entryFilter, entry)) this._emitEntry(entry);
        if (entry.dirent.isDirectory() && $jKf10.isAppliedFilter(this._settings.deepFilter, entry)) this._pushToQueue(fullpath, entry.path);
    }
    _emitEntry(entry1) {
        this._emitter.emit('entry', entry1);
    }
}
module.exports.default = $116dc75527f795fd$var$AsyncReader;

});
parcelRequire.register("kEW8K", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.Settings = module.exports.scandirSync = module.exports.scandir = void 0;

var $80xoS = parcelRequire("80xoS");

var $3KXbw = parcelRequire("3KXbw");

var $4J1qN = parcelRequire("4J1qN");
module.exports.Settings = $4J1qN.default;
function $f0a4a482d77aafeb$var$scandir(path, optionsOrSettingsOrCallback, callback) {
    if (typeof optionsOrSettingsOrCallback === 'function') return $80xoS.read(path, $f0a4a482d77aafeb$var$getSettings(), optionsOrSettingsOrCallback);
    $80xoS.read(path, $f0a4a482d77aafeb$var$getSettings(optionsOrSettingsOrCallback), callback);
}
module.exports.scandir = $f0a4a482d77aafeb$var$scandir;
function $f0a4a482d77aafeb$var$scandirSync(path, optionsOrSettings) {
    const settings = $f0a4a482d77aafeb$var$getSettings(optionsOrSettings);
    return $3KXbw.read(path, settings);
}
module.exports.scandirSync = $f0a4a482d77aafeb$var$scandirSync;
function $f0a4a482d77aafeb$var$getSettings(settingsOrOptions = {
}) {
    if (settingsOrOptions instanceof $4J1qN.default) return settingsOrOptions;
    return new $4J1qN.default(settingsOrOptions);
}

});
parcelRequire.register("80xoS", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.readdir = module.exports.readdirWithFileTypes = module.exports.read = void 0;

var $aq6Xb = parcelRequire("aq6Xb");

var $eQh2l = parcelRequire("eQh2l");

var $kpjjz = parcelRequire("kpjjz");

var $gXKnK = parcelRequire("gXKnK");

var $cETHR = parcelRequire("cETHR");
function $5d483b66359dcbb6$var$read(directory, settings, callback) {
    if (!settings.stats && $kpjjz.IS_SUPPORT_READDIR_WITH_FILE_TYPES) return $5d483b66359dcbb6$var$readdirWithFileTypes(directory, settings, callback);
    return $5d483b66359dcbb6$var$readdir(directory, settings, callback);
}
module.exports.read = $5d483b66359dcbb6$var$read;
function $5d483b66359dcbb6$var$readdirWithFileTypes(directory, settings, callback) {
    settings.fs.readdir(directory, {
        withFileTypes: true
    }, (readdirError, dirents)=>{
        if (readdirError !== null) return $5d483b66359dcbb6$var$callFailureCallback(callback, readdirError);
        const entries = dirents.map((dirent)=>({
                dirent: dirent,
                name: dirent.name,
                path: $cETHR.joinPathSegments(directory, dirent.name, settings.pathSegmentSeparator)
            })
        );
        if (!settings.followSymbolicLinks) return $5d483b66359dcbb6$var$callSuccessCallback(callback, entries);
        const tasks = entries.map((entry)=>$5d483b66359dcbb6$var$makeRplTaskEntry(entry, settings)
        );
        $eQh2l(tasks, (rplError, rplEntries)=>{
            if (rplError !== null) return $5d483b66359dcbb6$var$callFailureCallback(callback, rplError);
            $5d483b66359dcbb6$var$callSuccessCallback(callback, rplEntries);
        });
    });
}
module.exports.readdirWithFileTypes = $5d483b66359dcbb6$var$readdirWithFileTypes;
function $5d483b66359dcbb6$var$makeRplTaskEntry(entry, settings) {
    return (done)=>{
        if (!entry.dirent.isSymbolicLink()) return done(null, entry);
        settings.fs.stat(entry.path, (statError, stats)=>{
            if (statError !== null) {
                if (settings.throwErrorOnBrokenSymbolicLink) return done(statError);
                return done(null, entry);
            }
            entry.dirent = $gXKnK.fs.createDirentFromStats(entry.name, stats);
            return done(null, entry);
        });
    };
}
function $5d483b66359dcbb6$var$readdir(directory, settings, callback) {
    settings.fs.readdir(directory, (readdirError, names)=>{
        if (readdirError !== null) return $5d483b66359dcbb6$var$callFailureCallback(callback, readdirError);
        const filepaths = names.map((name)=>$cETHR.joinPathSegments(directory, name, settings.pathSegmentSeparator)
        );
        const tasks = filepaths.map((filepath)=>{
            return (done)=>$aq6Xb.stat(filepath, settings.fsStatSettings, done)
            ;
        });
        $eQh2l(tasks, (rplError, results)=>{
            if (rplError !== null) return $5d483b66359dcbb6$var$callFailureCallback(callback, rplError);
            const entries = [];
            names.forEach((name, index)=>{
                const stats = results[index];
                const entry = {
                    name: name,
                    path: filepaths[index],
                    dirent: $gXKnK.fs.createDirentFromStats(name, stats)
                };
                if (settings.stats) entry.stats = stats;
                entries.push(entry);
            });
            $5d483b66359dcbb6$var$callSuccessCallback(callback, entries);
        });
    });
}
module.exports.readdir = $5d483b66359dcbb6$var$readdir;
function $5d483b66359dcbb6$var$callFailureCallback(callback, error) {
    callback(error);
}
function $5d483b66359dcbb6$var$callSuccessCallback(callback, result) {
    callback(null, result);
}

});
parcelRequire.register("eQh2l", function(module, exports) {
/*! run-parallel. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */ module.exports = $ace32332b494bca4$var$runParallel;

var $1aaxQ = parcelRequire("1aaxQ");
function $ace32332b494bca4$var$runParallel(tasks, cb) {
    let results, pending, keys;
    let isSync = true;
    if (Array.isArray(tasks)) {
        results = [];
        pending = tasks.length;
    } else {
        keys = Object.keys(tasks);
        results = {
        };
        pending = keys.length;
    }
    function done(err) {
        function end() {
            if (cb) cb(err, results);
            cb = null;
        }
        if (isSync) $1aaxQ(end);
        else end();
    }
    function each(i, err, result) {
        results[i] = result;
        if (--pending === 0 || err) done(err);
    }
    if (!pending) // empty
    done(null);
    else if (keys) // object
    keys.forEach(function(key) {
        tasks[key](function(err, result) {
            each(key, err, result);
        });
    });
    else // array
    tasks.forEach(function(task, i) {
        task(function(err, result) {
            each(i, err, result);
        });
    });
    isSync = false;
}

});
parcelRequire.register("1aaxQ", function(module, exports) {
/*! queue-microtask. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */ let $0d8ee7a235f82b08$var$promise;
module.exports = typeof queueMicrotask === 'function' ? queueMicrotask.bind(globalThis) : (cb)=>($0d8ee7a235f82b08$var$promise || ($0d8ee7a235f82b08$var$promise = Promise.resolve())).then(cb).catch((err)=>setTimeout(()=>{
            throw err;
        }, 0)
    )
;

});


parcelRequire.register("kpjjz", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.IS_SUPPORT_READDIR_WITH_FILE_TYPES = void 0;
const $edb51ff30cc0f3f5$var$NODE_PROCESS_VERSION_PARTS = process.versions.node.split('.');
const $edb51ff30cc0f3f5$var$MAJOR_VERSION = parseInt($edb51ff30cc0f3f5$var$NODE_PROCESS_VERSION_PARTS[0], 10);
const $edb51ff30cc0f3f5$var$MINOR_VERSION = parseInt($edb51ff30cc0f3f5$var$NODE_PROCESS_VERSION_PARTS[1], 10);
const $edb51ff30cc0f3f5$var$SUPPORTED_MAJOR_VERSION = 10;
const $edb51ff30cc0f3f5$var$SUPPORTED_MINOR_VERSION = 10;
const $edb51ff30cc0f3f5$var$IS_MATCHED_BY_MAJOR = $edb51ff30cc0f3f5$var$MAJOR_VERSION > $edb51ff30cc0f3f5$var$SUPPORTED_MAJOR_VERSION;
const $edb51ff30cc0f3f5$var$IS_MATCHED_BY_MAJOR_AND_MINOR = $edb51ff30cc0f3f5$var$MAJOR_VERSION === $edb51ff30cc0f3f5$var$SUPPORTED_MAJOR_VERSION && $edb51ff30cc0f3f5$var$MINOR_VERSION >= $edb51ff30cc0f3f5$var$SUPPORTED_MINOR_VERSION;
/**
 * IS `true` for Node.js 10.10 and greater.
 */ module.exports.IS_SUPPORT_READDIR_WITH_FILE_TYPES = $edb51ff30cc0f3f5$var$IS_MATCHED_BY_MAJOR || $edb51ff30cc0f3f5$var$IS_MATCHED_BY_MAJOR_AND_MINOR;

});

parcelRequire.register("gXKnK", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.fs = void 0;

var $7JgJM = parcelRequire("7JgJM");
module.exports.fs = $7JgJM;

});
parcelRequire.register("7JgJM", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.createDirentFromStats = void 0;
class $5a09b815c5a2b1eb$var$DirentFromStats {
    constructor(name1, stats1){
        this.name = name1;
        this.isBlockDevice = stats1.isBlockDevice.bind(stats1);
        this.isCharacterDevice = stats1.isCharacterDevice.bind(stats1);
        this.isDirectory = stats1.isDirectory.bind(stats1);
        this.isFIFO = stats1.isFIFO.bind(stats1);
        this.isFile = stats1.isFile.bind(stats1);
        this.isSocket = stats1.isSocket.bind(stats1);
        this.isSymbolicLink = stats1.isSymbolicLink.bind(stats1);
    }
}
function $5a09b815c5a2b1eb$var$createDirentFromStats(name, stats) {
    return new $5a09b815c5a2b1eb$var$DirentFromStats(name, stats);
}
module.exports.createDirentFromStats = $5a09b815c5a2b1eb$var$createDirentFromStats;

});


parcelRequire.register("cETHR", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.joinPathSegments = void 0;
function $93746e9302949e12$var$joinPathSegments(a, b, separator) {
    /**
     * The correct handling of cases when the first segment is a root (`/`, `C:/`) or UNC path (`//?/C:/`).
     */ if (a.endsWith(separator)) return a + b;
    return a + separator + b;
}
module.exports.joinPathSegments = $93746e9302949e12$var$joinPathSegments;

});


parcelRequire.register("3KXbw", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.readdir = module.exports.readdirWithFileTypes = module.exports.read = void 0;

var $aq6Xb = parcelRequire("aq6Xb");

var $kpjjz = parcelRequire("kpjjz");

var $gXKnK = parcelRequire("gXKnK");

var $cETHR = parcelRequire("cETHR");
function $2bc393d9be34db5a$var$read(directory, settings) {
    if (!settings.stats && $kpjjz.IS_SUPPORT_READDIR_WITH_FILE_TYPES) return $2bc393d9be34db5a$var$readdirWithFileTypes(directory, settings);
    return $2bc393d9be34db5a$var$readdir(directory, settings);
}
module.exports.read = $2bc393d9be34db5a$var$read;
function $2bc393d9be34db5a$var$readdirWithFileTypes(directory, settings) {
    const dirents = settings.fs.readdirSync(directory, {
        withFileTypes: true
    });
    return dirents.map((dirent)=>{
        const entry = {
            dirent: dirent,
            name: dirent.name,
            path: $cETHR.joinPathSegments(directory, dirent.name, settings.pathSegmentSeparator)
        };
        if (entry.dirent.isSymbolicLink() && settings.followSymbolicLinks) try {
            const stats = settings.fs.statSync(entry.path);
            entry.dirent = $gXKnK.fs.createDirentFromStats(entry.name, stats);
        } catch (error) {
            if (settings.throwErrorOnBrokenSymbolicLink) throw error;
        }
        return entry;
    });
}
module.exports.readdirWithFileTypes = $2bc393d9be34db5a$var$readdirWithFileTypes;
function $2bc393d9be34db5a$var$readdir(directory, settings) {
    const names = settings.fs.readdirSync(directory);
    return names.map((name)=>{
        const entryPath = $cETHR.joinPathSegments(directory, name, settings.pathSegmentSeparator);
        const stats = $aq6Xb.statSync(entryPath, settings.fsStatSettings);
        const entry = {
            name: name,
            path: entryPath,
            dirent: $gXKnK.fs.createDirentFromStats(name, stats)
        };
        if (settings.stats) entry.stats = stats;
        return entry;
    });
}
module.exports.readdir = $2bc393d9be34db5a$var$readdir;

});

parcelRequire.register("4J1qN", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});


var $aq6Xb = parcelRequire("aq6Xb");

var $lSwvW = parcelRequire("lSwvW");
class $370c799eb9df5722$var$Settings {
    constructor(_options = {
    }){
        this._options = _options;
        this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, false);
        this.fs = $lSwvW.createFileSystemAdapter(this._options.fs);
        this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, $igPDg$path.sep);
        this.stats = this._getValue(this._options.stats, false);
        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
        this.fsStatSettings = new $aq6Xb.Settings({
            followSymbolicLink: this.followSymbolicLinks,
            fs: this.fs,
            throwErrorOnBrokenSymbolicLink: this.throwErrorOnBrokenSymbolicLink
        });
    }
    _getValue(option, value) {
        return option !== null && option !== void 0 ? option : value;
    }
}
module.exports.default = $370c799eb9df5722$var$Settings;

});
parcelRequire.register("lSwvW", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.createFileSystemAdapter = module.exports.FILE_SYSTEM_ADAPTER = void 0;

module.exports.FILE_SYSTEM_ADAPTER = {
    lstat: $igPDg$fs.lstat,
    stat: $igPDg$fs.stat,
    lstatSync: $igPDg$fs.lstatSync,
    statSync: $igPDg$fs.statSync,
    readdir: $igPDg$fs.readdir,
    readdirSync: $igPDg$fs.readdirSync
};
function $fed7dcc260198c58$var$createFileSystemAdapter(fsMethods) {
    if (fsMethods === undefined) return module.exports.FILE_SYSTEM_ADAPTER;
    return Object.assign(Object.assign({
    }, module.exports.FILE_SYSTEM_ADAPTER), fsMethods);
}
module.exports.createFileSystemAdapter = $fed7dcc260198c58$var$createFileSystemAdapter;

});



parcelRequire.register("8NZ64", function(module, exports) {
'use strict';

var $gqC6o = parcelRequire("gqC6o");
function $66924aeb7660db44$var$fastqueue(context, worker, concurrency) {
    if (typeof context === 'function') {
        concurrency = worker;
        worker = context;
        context = null;
    }
    if (concurrency < 1) throw new Error('fastqueue concurrency must be greater than 1');
    var cache = $gqC6o($66924aeb7660db44$var$Task);
    var queueHead = null;
    var queueTail = null;
    var _running = 0;
    var errorHandler = null;
    var self = {
        push: push,
        drain: $66924aeb7660db44$var$noop,
        saturated: $66924aeb7660db44$var$noop,
        pause: pause,
        paused: false,
        concurrency: concurrency,
        running: running,
        resume: resume,
        idle: idle,
        length: length,
        getQueue: getQueue,
        unshift: unshift,
        empty: $66924aeb7660db44$var$noop,
        kill: kill,
        killAndDrain: killAndDrain,
        error: error
    };
    function running() {
        return _running;
    }
    function pause() {
        self.paused = true;
    }
    function length() {
        var current = queueHead;
        var counter = 0;
        while(current){
            current = current.next;
            counter++;
        }
        return counter;
    }
    function getQueue() {
        var current = queueHead;
        var tasks = [];
        while(current){
            tasks.push(current.value);
            current = current.next;
        }
        return tasks;
    }
    function resume() {
        if (!self.paused) return;
        self.paused = false;
        for(var i = 0; i < self.concurrency; i++){
            _running++;
            release();
        }
    }
    function idle() {
        return _running === 0 && self.length() === 0;
    }
    function push(value, done) {
        var current = cache.get();
        current.context = context;
        current.release = release;
        current.value = value;
        current.callback = done || $66924aeb7660db44$var$noop;
        current.errorHandler = errorHandler;
        if (_running === self.concurrency || self.paused) {
            if (queueTail) {
                queueTail.next = current;
                queueTail = current;
            } else {
                queueHead = current;
                queueTail = current;
                self.saturated();
            }
        } else {
            _running++;
            worker.call(context, current.value, current.worked);
        }
    }
    function unshift(value, done) {
        var current = cache.get();
        current.context = context;
        current.release = release;
        current.value = value;
        current.callback = done || $66924aeb7660db44$var$noop;
        if (_running === self.concurrency || self.paused) {
            if (queueHead) {
                current.next = queueHead;
                queueHead = current;
            } else {
                queueHead = current;
                queueTail = current;
                self.saturated();
            }
        } else {
            _running++;
            worker.call(context, current.value, current.worked);
        }
    }
    function release(holder) {
        if (holder) {
            cache.release(holder);
        }
        var next = queueHead;
        if (next) {
            if (!self.paused) {
                if (queueTail === queueHead) {
                    queueTail = null;
                }
                queueHead = next.next;
                next.next = null;
                worker.call(context, next.value, next.worked);
                if (queueTail === null) {
                    self.empty();
                }
            } else {
                _running--;
            }
        } else if (--_running === 0) {
            self.drain();
        }
    }
    function kill() {
        queueHead = null;
        queueTail = null;
        self.drain = $66924aeb7660db44$var$noop;
    }
    function killAndDrain() {
        queueHead = null;
        queueTail = null;
        self.drain();
        self.drain = $66924aeb7660db44$var$noop;
    }
    function error(handler) {
        errorHandler = handler;
    }
    return self;
}
function $66924aeb7660db44$var$noop() {
}
function $66924aeb7660db44$var$Task() {
    this.value = null;
    this.callback = $66924aeb7660db44$var$noop;
    this.next = null;
    this.release = $66924aeb7660db44$var$noop;
    this.context = null;
    this.errorHandler = null;
    var self = this;
    this.worked = function worked(err, result) {
        var callback = self.callback;
        var errorHandler = self.errorHandler;
        var val = self.value;
        self.value = null;
        self.callback = $66924aeb7660db44$var$noop;
        if (self.errorHandler) errorHandler(err, val);
        callback.call(self.context, err, result);
        self.release(self);
    };
}
function $66924aeb7660db44$var$queueAsPromised(context, worker, concurrency) {
    if (typeof context === 'function') {
        concurrency = worker;
        worker = context;
        context = null;
    }
    function asyncWrapper(arg, cb) {
        worker.call(this, arg).then(function(res) {
            cb(null, res);
        }, cb);
    }
    var queue = $66924aeb7660db44$var$fastqueue(context, asyncWrapper, concurrency);
    var pushCb = queue.push;
    var unshiftCb = queue.unshift;
    queue.push = push;
    queue.unshift = unshift;
    function push(value) {
        return new Promise(function(resolve, reject) {
            pushCb(value, function(err, result) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    }
    function unshift(value) {
        return new Promise(function(resolve, reject) {
            unshiftCb(value, function(err, result) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    }
    return queue;
}
module.exports = $66924aeb7660db44$var$fastqueue;
module.exports.promise = $66924aeb7660db44$var$queueAsPromised;

});
parcelRequire.register("gqC6o", function(module, exports) {
'use strict';
function $bf5ca1512cd1a5ae$var$reusify(Constructor) {
    var head = new Constructor();
    var tail = head;
    function get() {
        var current = head;
        if (current.next) head = current.next;
        else {
            head = new Constructor();
            tail = head;
        }
        current.next = null;
        return current;
    }
    function release(obj) {
        tail.next = obj;
        tail = obj;
    }
    return {
        get: get,
        release: release
    };
}
module.exports = $bf5ca1512cd1a5ae$var$reusify;

});


parcelRequire.register("jKf10", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.joinPathSegments = module.exports.replacePathSegmentSeparator = module.exports.isAppliedFilter = module.exports.isFatalError = void 0;
function $e5fdf5e76352153d$var$isFatalError(settings, error) {
    if (settings.errorFilter === null) return true;
    return !settings.errorFilter(error);
}
module.exports.isFatalError = $e5fdf5e76352153d$var$isFatalError;
function $e5fdf5e76352153d$var$isAppliedFilter(filter, value) {
    return filter === null || filter(value);
}
module.exports.isAppliedFilter = $e5fdf5e76352153d$var$isAppliedFilter;
function $e5fdf5e76352153d$var$replacePathSegmentSeparator(filepath, separator) {
    return filepath.split(/[/\\]/).join(separator);
}
module.exports.replacePathSegmentSeparator = $e5fdf5e76352153d$var$replacePathSegmentSeparator;
function $e5fdf5e76352153d$var$joinPathSegments(a, b, separator) {
    if (a === '') return b;
    /**
     * The correct handling of cases when the first segment is a root (`/`, `C:/`) or UNC path (`//?/C:/`).
     */ if (a.endsWith(separator)) return a + b;
    return a + separator + b;
}
module.exports.joinPathSegments = $e5fdf5e76352153d$var$joinPathSegments;

});

parcelRequire.register("gcGYP", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});

var $jKf10 = parcelRequire("jKf10");
class $bcbf1b4939ce42e8$var$Reader {
    constructor(_root, _settings){
        this._root = _root;
        this._settings = _settings;
        this._root = $jKf10.replacePathSegmentSeparator(_root, _settings.pathSegmentSeparator);
    }
}
module.exports.default = $bcbf1b4939ce42e8$var$Reader;

});



parcelRequire.register("gfmLs", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});


var $1uLWe = parcelRequire("1uLWe");
class $bd3fb49ca6453863$var$StreamProvider {
    constructor(_root, _settings){
        this._root = _root;
        this._settings = _settings;
        this._reader = new $1uLWe.default(this._root, this._settings);
        this._stream = new $igPDg$stream.Readable({
            objectMode: true,
            read: ()=>{
            },
            destroy: ()=>{
                if (!this._reader.isDestroyed) this._reader.destroy();
            }
        });
    }
    read() {
        this._reader.onError((error)=>{
            this._stream.emit('error', error);
        });
        this._reader.onEntry((entry)=>{
            this._stream.push(entry);
        });
        this._reader.onEnd(()=>{
            this._stream.push(null);
        });
        this._reader.read();
        return this._stream;
    }
}
module.exports.default = $bd3fb49ca6453863$var$StreamProvider;

});

parcelRequire.register("daYpM", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});

var $1t3yz = parcelRequire("1t3yz");
class $997b12a687d47340$var$SyncProvider {
    constructor(_root, _settings){
        this._root = _root;
        this._settings = _settings;
        this._reader = new $1t3yz.default(this._root, this._settings);
    }
    read() {
        return this._reader.read();
    }
}
module.exports.default = $997b12a687d47340$var$SyncProvider;

});
parcelRequire.register("1t3yz", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});

var $kEW8K = parcelRequire("kEW8K");

var $jKf10 = parcelRequire("jKf10");

var $gcGYP = parcelRequire("gcGYP");
class $111b4229e29f421a$var$SyncReader extends $gcGYP.default {
    constructor(){
        super(...arguments);
        this._scandir = $kEW8K.scandirSync;
        this._storage = new Set();
        this._queue = new Set();
    }
    read() {
        this._pushToQueue(this._root, this._settings.basePath);
        this._handleQueue();
        return [
            ...this._storage
        ];
    }
    _pushToQueue(directory, base) {
        this._queue.add({
            directory: directory,
            base: base
        });
    }
    _handleQueue() {
        for (const item of this._queue.values())this._handleDirectory(item.directory, item.base);
    }
    _handleDirectory(directory1, base1) {
        try {
            const entries = this._scandir(directory1, this._settings.fsScandirSettings);
            for (const entry of entries)this._handleEntry(entry, base1);
        } catch (error) {
            this._handleError(error);
        }
    }
    _handleError(error) {
        if (!$jKf10.isFatalError(this._settings, error)) return;
        throw error;
    }
    _handleEntry(entry, base2) {
        const fullpath = entry.path;
        if (base2 !== undefined) entry.path = $jKf10.joinPathSegments(base2, entry.name, this._settings.pathSegmentSeparator);
        if ($jKf10.isAppliedFilter(this._settings.entryFilter, entry)) this._pushToStorage(entry);
        if (entry.dirent.isDirectory() && $jKf10.isAppliedFilter(this._settings.deepFilter, entry)) this._pushToQueue(fullpath, entry.path);
    }
    _pushToStorage(entry1) {
        this._storage.add(entry1);
    }
}
module.exports.default = $111b4229e29f421a$var$SyncReader;

});


parcelRequire.register("aerJk", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});


var $kEW8K = parcelRequire("kEW8K");
class $7730b8d0bde70af7$var$Settings {
    constructor(_options = {
    }){
        this._options = _options;
        this.basePath = this._getValue(this._options.basePath, undefined);
        this.concurrency = this._getValue(this._options.concurrency, Infinity);
        this.deepFilter = this._getValue(this._options.deepFilter, null);
        this.entryFilter = this._getValue(this._options.entryFilter, null);
        this.errorFilter = this._getValue(this._options.errorFilter, null);
        this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, $igPDg$path.sep);
        this.fsScandirSettings = new $kEW8K.Settings({
            followSymbolicLinks: this._options.followSymbolicLinks,
            fs: this._options.fs,
            pathSegmentSeparator: this._options.pathSegmentSeparator,
            stats: this._options.stats,
            throwErrorOnBrokenSymbolicLink: this._options.throwErrorOnBrokenSymbolicLink
        });
    }
    _getValue(option, value) {
        return option !== null && option !== void 0 ? option : value;
    }
}
module.exports.default = $7730b8d0bde70af7$var$Settings;

});


parcelRequire.register("iy4kQ", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});


var $aq6Xb = parcelRequire("aq6Xb");

var $6e4CR = parcelRequire("6e4CR");
class $d80ec3d8c75f2969$var$Reader {
    constructor(_settings){
        this._settings = _settings;
        this._fsStatSettings = new $aq6Xb.Settings({
            followSymbolicLink: this._settings.followSymbolicLinks,
            fs: this._settings.fs,
            throwErrorOnBrokenSymbolicLink: this._settings.followSymbolicLinks
        });
    }
    _getFullEntryPath(filepath) {
        return $igPDg$path.resolve(this._settings.cwd, filepath);
    }
    _makeEntry(stats, pattern) {
        const entry = {
            name: pattern,
            path: pattern,
            dirent: $6e4CR.fs.createDirentFromStats(pattern, stats)
        };
        if (this._settings.stats) entry.stats = stats;
        return entry;
    }
    _isFatalError(error) {
        return !$6e4CR.errno.isEnoentCodeError(error) && !this._settings.suppressErrors;
    }
}
module.exports.default = $d80ec3d8c75f2969$var$Reader;

});


parcelRequire.register("3naU1", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});


var $gmvC1 = parcelRequire("gmvC1");

var $bfzzf = parcelRequire("bfzzf");

var $7ihZm = parcelRequire("7ihZm");

var $8Oms9 = parcelRequire("8Oms9");
class $274bfa1d10f6e342$var$Provider {
    constructor(_settings){
        this._settings = _settings;
        this.errorFilter = new $7ihZm.default(this._settings);
        this.entryFilter = new $bfzzf.default(this._settings, this._getMicromatchOptions());
        this.deepFilter = new $gmvC1.default(this._settings, this._getMicromatchOptions());
        this.entryTransformer = new $8Oms9.default(this._settings);
    }
    _getRootDirectory(task) {
        return $igPDg$path.resolve(this._settings.cwd, task.base);
    }
    _getReaderOptions(task1) {
        const basePath = task1.base === '.' ? '' : task1.base;
        return {
            basePath: basePath,
            pathSegmentSeparator: '/',
            concurrency: this._settings.concurrency,
            deepFilter: this.deepFilter.getFilter(basePath, task1.positive, task1.negative),
            entryFilter: this.entryFilter.getFilter(task1.positive, task1.negative),
            errorFilter: this.errorFilter.getFilter(),
            followSymbolicLinks: this._settings.followSymbolicLinks,
            fs: this._settings.fs,
            stats: this._settings.stats,
            throwErrorOnBrokenSymbolicLink: this._settings.throwErrorOnBrokenSymbolicLink,
            transform: this.entryTransformer.getTransformer()
        };
    }
    _getMicromatchOptions() {
        return {
            dot: this._settings.dot,
            matchBase: this._settings.baseNameMatch,
            nobrace: !this._settings.braceExpansion,
            nocase: !this._settings.caseSensitiveMatch,
            noext: !this._settings.extglob,
            noglobstar: !this._settings.globstar,
            posix: true,
            strictSlashes: false
        };
    }
}
module.exports.default = $274bfa1d10f6e342$var$Provider;

});
parcelRequire.register("gmvC1", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});

var $6e4CR = parcelRequire("6e4CR");

var $1LfeJ = parcelRequire("1LfeJ");
class $be9738f0558fdf07$var$DeepFilter {
    constructor(_settings, _micromatchOptions){
        this._settings = _settings;
        this._micromatchOptions = _micromatchOptions;
    }
    getFilter(basePath, positive, negative) {
        const matcher = this._getMatcher(positive);
        const negativeRe = this._getNegativePatternsRe(negative);
        return (entry)=>this._filter(basePath, entry, matcher, negativeRe)
        ;
    }
    _getMatcher(patterns) {
        return new $1LfeJ.default(patterns, this._settings, this._micromatchOptions);
    }
    _getNegativePatternsRe(patterns1) {
        const affectDepthOfReadingPatterns = patterns1.filter($6e4CR.pattern.isAffectDepthOfReadingPattern);
        return $6e4CR.pattern.convertPatternsToRe(affectDepthOfReadingPatterns, this._micromatchOptions);
    }
    _filter(basePath1, entry, matcher, negativeRe) {
        if (this._isSkippedByDeep(basePath1, entry.path)) return false;
        if (this._isSkippedSymbolicLink(entry)) return false;
        const filepath = $6e4CR.path.removeLeadingDotSegment(entry.path);
        if (this._isSkippedByPositivePatterns(filepath, matcher)) return false;
        return this._isSkippedByNegativePatterns(filepath, negativeRe);
    }
    _isSkippedByDeep(basePath2, entryPath) {
        /**
         * Avoid unnecessary depth calculations when it doesn't matter.
         */ if (this._settings.deep === Infinity) return false;
        return this._getEntryLevel(basePath2, entryPath) >= this._settings.deep;
    }
    _getEntryLevel(basePath3, entryPath1) {
        const entryPathDepth = entryPath1.split('/').length;
        if (basePath3 === '') return entryPathDepth;
        const basePathDepth = basePath3.split('/').length;
        return entryPathDepth - basePathDepth;
    }
    _isSkippedSymbolicLink(entry1) {
        return !this._settings.followSymbolicLinks && entry1.dirent.isSymbolicLink();
    }
    _isSkippedByPositivePatterns(entryPath2, matcher1) {
        return !this._settings.baseNameMatch && !matcher1.match(entryPath2);
    }
    _isSkippedByNegativePatterns(entryPath3, patternsRe) {
        return !$6e4CR.pattern.matchAny(entryPath3, patternsRe);
    }
}
module.exports.default = $be9738f0558fdf07$var$DeepFilter;

});
parcelRequire.register("1LfeJ", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});

var $a3fcN = parcelRequire("a3fcN");
class $1485ffe168ae151d$var$PartialMatcher extends $a3fcN.default {
    match(filepath) {
        const parts = filepath.split('/');
        const levels = parts.length;
        const patterns = this._storage.filter((info)=>!info.complete || info.segments.length > levels
        );
        for (const pattern of patterns){
            const section = pattern.sections[0];
            /**
             * In this case, the pattern has a globstar and we must read all directories unconditionally,
             * but only if the level has reached the end of the first group.
             *
             * fixtures/{a,b}/**
             *  ^ true/false  ^ always true
            */ if (!pattern.complete && levels > section.length) return true;
            const match = parts.every((part, index)=>{
                const segment = pattern.segments[index];
                if (segment.dynamic && segment.patternRe.test(part)) return true;
                if (!segment.dynamic && segment.pattern === part) return true;
                return false;
            });
            if (match) return true;
        }
        return false;
    }
}
module.exports.default = $1485ffe168ae151d$var$PartialMatcher;

});
parcelRequire.register("a3fcN", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});

var $6e4CR = parcelRequire("6e4CR");
class $7515faacc7ff1b0c$var$Matcher {
    constructor(_patterns, _settings, _micromatchOptions){
        this._patterns = _patterns;
        this._settings = _settings;
        this._micromatchOptions = _micromatchOptions;
        this._storage = [];
        this._fillStorage();
    }
    _fillStorage() {
        /**
         * The original pattern may include `{,*,**,a/*}`, which will lead to problems with matching (unresolved level).
         * So, before expand patterns with brace expansion into separated patterns.
         */ const patterns = $6e4CR.pattern.expandPatternsWithBraceExpansion(this._patterns);
        for (const pattern of patterns){
            const segments = this._getPatternSegments(pattern);
            const sections = this._splitSegmentsIntoSections(segments);
            this._storage.push({
                complete: sections.length <= 1,
                pattern: pattern,
                segments: segments,
                sections: sections
            });
        }
    }
    _getPatternSegments(pattern) {
        const parts = $6e4CR.pattern.getPatternParts(pattern, this._micromatchOptions);
        return parts.map((part)=>{
            const dynamic = $6e4CR.pattern.isDynamicPattern(part, this._settings);
            if (!dynamic) return {
                dynamic: false,
                pattern: part
            };
            return {
                dynamic: true,
                pattern: part,
                patternRe: $6e4CR.pattern.makeRe(part, this._micromatchOptions)
            };
        });
    }
    _splitSegmentsIntoSections(segments) {
        return $6e4CR.array.splitWhen(segments, (segment)=>segment.dynamic && $6e4CR.pattern.hasGlobStar(segment.pattern)
        );
    }
}
module.exports.default = $7515faacc7ff1b0c$var$Matcher;

});



parcelRequire.register("bfzzf", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});

var $6e4CR = parcelRequire("6e4CR");
class $830caf6168b7a3c6$var$EntryFilter {
    constructor(_settings, _micromatchOptions){
        this._settings = _settings;
        this._micromatchOptions = _micromatchOptions;
        this.index = new Map();
    }
    getFilter(positive, negative) {
        const positiveRe = $6e4CR.pattern.convertPatternsToRe(positive, this._micromatchOptions);
        const negativeRe = $6e4CR.pattern.convertPatternsToRe(negative, this._micromatchOptions);
        return (entry)=>this._filter(entry, positiveRe, negativeRe)
        ;
    }
    _filter(entry, positiveRe, negativeRe) {
        if (this._settings.unique && this._isDuplicateEntry(entry)) return false;
        if (this._onlyFileFilter(entry) || this._onlyDirectoryFilter(entry)) return false;
        if (this._isSkippedByAbsoluteNegativePatterns(entry.path, negativeRe)) return false;
        const filepath = this._settings.baseNameMatch ? entry.name : entry.path;
        const isMatched = this._isMatchToPatterns(filepath, positiveRe) && !this._isMatchToPatterns(entry.path, negativeRe);
        if (this._settings.unique && isMatched) this._createIndexRecord(entry);
        return isMatched;
    }
    _isDuplicateEntry(entry1) {
        return this.index.has(entry1.path);
    }
    _createIndexRecord(entry2) {
        this.index.set(entry2.path, undefined);
    }
    _onlyFileFilter(entry3) {
        return this._settings.onlyFiles && !entry3.dirent.isFile();
    }
    _onlyDirectoryFilter(entry4) {
        return this._settings.onlyDirectories && !entry4.dirent.isDirectory();
    }
    _isSkippedByAbsoluteNegativePatterns(entryPath, patternsRe) {
        if (!this._settings.absolute) return false;
        const fullpath = $6e4CR.path.makeAbsolute(this._settings.cwd, entryPath);
        return $6e4CR.pattern.matchAny(fullpath, patternsRe);
    }
    _isMatchToPatterns(entryPath1, patternsRe1) {
        const filepath = $6e4CR.path.removeLeadingDotSegment(entryPath1);
        return $6e4CR.pattern.matchAny(filepath, patternsRe1);
    }
}
module.exports.default = $830caf6168b7a3c6$var$EntryFilter;

});

parcelRequire.register("7ihZm", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});

var $6e4CR = parcelRequire("6e4CR");
class $54f82b03d9e7b36d$var$ErrorFilter {
    constructor(_settings){
        this._settings = _settings;
    }
    getFilter() {
        return (error)=>this._isNonFatalError(error)
        ;
    }
    _isNonFatalError(error) {
        return $6e4CR.errno.isEnoentCodeError(error) || this._settings.suppressErrors;
    }
}
module.exports.default = $54f82b03d9e7b36d$var$ErrorFilter;

});

parcelRequire.register("8Oms9", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});

var $6e4CR = parcelRequire("6e4CR");
class $66a468f7b075685f$var$EntryTransformer {
    constructor(_settings){
        this._settings = _settings;
    }
    getTransformer() {
        return (entry)=>this._transform(entry)
        ;
    }
    _transform(entry) {
        let filepath = entry.path;
        if (this._settings.absolute) {
            filepath = $6e4CR.path.makeAbsolute(this._settings.cwd, filepath);
            filepath = $6e4CR.path.unixify(filepath);
        }
        if (this._settings.markDirectories && entry.dirent.isDirectory()) filepath += '/';
        if (!this._settings.objectMode) return filepath;
        return Object.assign(Object.assign({
        }, entry), {
            path: filepath
        });
    }
}
module.exports.default = $66a468f7b075685f$var$EntryTransformer;

});



parcelRequire.register("3TSY1", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});


var $cQf51 = parcelRequire("cQf51");

var $3naU1 = parcelRequire("3naU1");
class $2d712577441a7ee2$var$ProviderStream extends $3naU1.default {
    constructor(){
        super(...arguments);
        this._reader = new $cQf51.default(this._settings);
    }
    read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const source = this.api(root, task, options);
        const destination = new $igPDg$stream.Readable({
            objectMode: true,
            read: ()=>{
            }
        });
        source.once('error', (error)=>destination.emit('error', error)
        ).on('data', (entry)=>destination.emit('data', options.transform(entry))
        ).once('end', ()=>destination.emit('end')
        );
        destination.once('close', ()=>source.destroy()
        );
        return destination;
    }
    api(root, task1, options) {
        if (task1.dynamic) return this._reader.dynamic(root, options);
        return this._reader.static(task1.patterns, options);
    }
}
module.exports.default = $2d712577441a7ee2$var$ProviderStream;

});

parcelRequire.register("3t5nY", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});

var $9F1fn = parcelRequire("9F1fn");

var $3naU1 = parcelRequire("3naU1");
class $28684204b308a35d$var$ProviderSync extends $3naU1.default {
    constructor(){
        super(...arguments);
        this._reader = new $9F1fn.default(this._settings);
    }
    read(task) {
        const root = this._getRootDirectory(task);
        const options = this._getReaderOptions(task);
        const entries = this.api(root, task, options);
        return entries.map(options.transform);
    }
    api(root, task1, options) {
        if (task1.dynamic) return this._reader.dynamic(root, options);
        return this._reader.static(task1.patterns, options);
    }
}
module.exports.default = $28684204b308a35d$var$ProviderSync;

});
parcelRequire.register("9F1fn", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});

var $aq6Xb = parcelRequire("aq6Xb");

var $6p45y = parcelRequire("6p45y");

var $iy4kQ = parcelRequire("iy4kQ");
class $7088e9082a8d3919$var$ReaderSync extends $iy4kQ.default {
    constructor(){
        super(...arguments);
        this._walkSync = $6p45y.walkSync;
        this._statSync = $aq6Xb.statSync;
    }
    dynamic(root, options) {
        return this._walkSync(root, options);
    }
    static(patterns, options1) {
        const entries = [];
        for (const pattern of patterns){
            const filepath = this._getFullEntryPath(pattern);
            const entry = this._getEntry(filepath, pattern, options1);
            if (entry === null || !options1.entryFilter(entry)) continue;
            entries.push(entry);
        }
        return entries;
    }
    _getEntry(filepath, pattern, options2) {
        try {
            const stats = this._getStat(filepath);
            return this._makeEntry(stats, pattern);
        } catch (error) {
            if (options2.errorFilter(error)) return null;
            throw error;
        }
    }
    _getStat(filepath1) {
        return this._statSync(filepath1, this._fsStatSettings);
    }
}
module.exports.default = $7088e9082a8d3919$var$ReaderSync;

});


parcelRequire.register("htzNp", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.DEFAULT_FILE_SYSTEM_ADAPTER = void 0;


/**
 * The `os.cpus` method can return zero. We expect the number of cores to be greater than zero.
 * https://github.com/nodejs/node/blob/7faeddf23a98c53896f8b574a6e66589e8fb1eb8/lib/os.js#L106-L107
 */ const $cb90e96b6cd7d8d5$var$CPU_COUNT = Math.max($igPDg$os.cpus().length, 1);
module.exports.DEFAULT_FILE_SYSTEM_ADAPTER = {
    lstat: $igPDg$fs.lstat,
    lstatSync: $igPDg$fs.lstatSync,
    stat: $igPDg$fs.stat,
    statSync: $igPDg$fs.statSync,
    readdir: $igPDg$fs.readdir,
    readdirSync: $igPDg$fs.readdirSync
};
class $cb90e96b6cd7d8d5$var$Settings {
    constructor(_options = {
    }){
        this._options = _options;
        this.absolute = this._getValue(this._options.absolute, false);
        this.baseNameMatch = this._getValue(this._options.baseNameMatch, false);
        this.braceExpansion = this._getValue(this._options.braceExpansion, true);
        this.caseSensitiveMatch = this._getValue(this._options.caseSensitiveMatch, true);
        this.concurrency = this._getValue(this._options.concurrency, $cb90e96b6cd7d8d5$var$CPU_COUNT);
        this.cwd = this._getValue(this._options.cwd, process.cwd());
        this.deep = this._getValue(this._options.deep, Infinity);
        this.dot = this._getValue(this._options.dot, false);
        this.extglob = this._getValue(this._options.extglob, true);
        this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, true);
        this.fs = this._getFileSystemMethods(this._options.fs);
        this.globstar = this._getValue(this._options.globstar, true);
        this.ignore = this._getValue(this._options.ignore, []);
        this.markDirectories = this._getValue(this._options.markDirectories, false);
        this.objectMode = this._getValue(this._options.objectMode, false);
        this.onlyDirectories = this._getValue(this._options.onlyDirectories, false);
        this.onlyFiles = this._getValue(this._options.onlyFiles, true);
        this.stats = this._getValue(this._options.stats, false);
        this.suppressErrors = this._getValue(this._options.suppressErrors, false);
        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, false);
        this.unique = this._getValue(this._options.unique, true);
        if (this.onlyDirectories) this.onlyFiles = false;
        if (this.stats) this.objectMode = true;
    }
    _getValue(option, value) {
        return option === undefined ? value : option;
    }
    _getFileSystemMethods(methods = {
    }) {
        return Object.assign(Object.assign({
        }, module.exports.DEFAULT_FILE_SYSTEM_ADAPTER), methods);
    }
}
module.exports.default = $cb90e96b6cd7d8d5$var$Settings;

});


parcelRequire.register("57kbZ", function(module, exports) {

$parcel$export(module.exports, "FSWatcher", () => $3b9d44f56f33b0f2$export$552f5da8b13f69c4, (v) => $3b9d44f56f33b0f2$export$552f5da8b13f69c4 = v);
$parcel$export(module.exports, "watch", () => $3b9d44f56f33b0f2$export$3db5d71bdb2d5499, (v) => $3b9d44f56f33b0f2$export$3db5d71bdb2d5499 = v);
// Export FSWatcher class
var $3b9d44f56f33b0f2$export$552f5da8b13f69c4;
var $3b9d44f56f33b0f2$export$3db5d71bdb2d5499;
'use strict';

var $3b9d44f56f33b0f2$require$EventEmitter = $igPDg$events.EventEmitter;



var $3b9d44f56f33b0f2$require$promisify = $igPDg$util.promisify;

var $hexCw = parcelRequire("hexCw");

var $2fBCn = parcelRequire("2fBCn");
var $3b9d44f56f33b0f2$require$anymatch = $2fBCn.default;

var $64Oh3 = parcelRequire("64Oh3");

var $jR9BM = parcelRequire("jR9BM");

var $eJXPY = parcelRequire("eJXPY");

var $kOgXJ = parcelRequire("kOgXJ");

var $lRRqt = parcelRequire("lRRqt");

var $flPL2 = parcelRequire("flPL2");

var $58JuD = parcelRequire("58JuD");
var $3b9d44f56f33b0f2$require$EV_ALL = $58JuD.EV_ALL;
var $3b9d44f56f33b0f2$require$EV_READY = $58JuD.EV_READY;
var $3b9d44f56f33b0f2$require$EV_ADD = $58JuD.EV_ADD;
var $3b9d44f56f33b0f2$require$EV_CHANGE = $58JuD.EV_CHANGE;
var $3b9d44f56f33b0f2$require$EV_UNLINK = $58JuD.EV_UNLINK;
var $3b9d44f56f33b0f2$require$EV_ADD_DIR = $58JuD.EV_ADD_DIR;
var $3b9d44f56f33b0f2$require$EV_UNLINK_DIR = $58JuD.EV_UNLINK_DIR;
var $3b9d44f56f33b0f2$require$EV_RAW = $58JuD.EV_RAW;
var $3b9d44f56f33b0f2$require$EV_ERROR = $58JuD.EV_ERROR;
var $3b9d44f56f33b0f2$require$STR_CLOSE = $58JuD.STR_CLOSE;
var $3b9d44f56f33b0f2$require$STR_END = $58JuD.STR_END;
var $3b9d44f56f33b0f2$require$BACK_SLASH_RE = $58JuD.BACK_SLASH_RE;
var $3b9d44f56f33b0f2$require$DOUBLE_SLASH_RE = $58JuD.DOUBLE_SLASH_RE;
var $3b9d44f56f33b0f2$require$SLASH_OR_BACK_SLASH_RE = $58JuD.SLASH_OR_BACK_SLASH_RE;
var $3b9d44f56f33b0f2$require$DOT_RE = $58JuD.DOT_RE;
var $3b9d44f56f33b0f2$require$REPLACER_RE = $58JuD.REPLACER_RE;
var $3b9d44f56f33b0f2$require$SLASH = $58JuD.SLASH;
var $3b9d44f56f33b0f2$require$SLASH_SLASH = $58JuD.SLASH_SLASH;
var $3b9d44f56f33b0f2$require$BRACE_START = $58JuD.BRACE_START;
var $3b9d44f56f33b0f2$require$BANG = $58JuD.BANG;
var $3b9d44f56f33b0f2$require$ONE_DOT = $58JuD.ONE_DOT;
var $3b9d44f56f33b0f2$require$TWO_DOTS = $58JuD.TWO_DOTS;
var $3b9d44f56f33b0f2$require$GLOBSTAR = $58JuD.GLOBSTAR;
var $3b9d44f56f33b0f2$require$SLASH_GLOBSTAR = $58JuD.SLASH_GLOBSTAR;
var $3b9d44f56f33b0f2$require$ANYMATCH_OPTS = $58JuD.ANYMATCH_OPTS;
var $3b9d44f56f33b0f2$require$STRING_TYPE = $58JuD.STRING_TYPE;
var $3b9d44f56f33b0f2$require$FUNCTION_TYPE = $58JuD.FUNCTION_TYPE;
var $3b9d44f56f33b0f2$require$EMPTY_STR = $58JuD.EMPTY_STR;
var $3b9d44f56f33b0f2$require$EMPTY_FN = $58JuD.EMPTY_FN;
var $3b9d44f56f33b0f2$require$isWindows = $58JuD.isWindows;
var $3b9d44f56f33b0f2$require$isMacos = $58JuD.isMacos;
var $3b9d44f56f33b0f2$require$isIBMi = $58JuD.isIBMi;
const $3b9d44f56f33b0f2$var$stat = $3b9d44f56f33b0f2$require$promisify($igPDg$fs.stat);
const $3b9d44f56f33b0f2$var$readdir = $3b9d44f56f33b0f2$require$promisify($igPDg$fs.readdir);
/**
 * @typedef {String} Path
 * @typedef {'all'|'add'|'addDir'|'change'|'unlink'|'unlinkDir'|'raw'|'error'|'ready'} EventName
 * @typedef {'readdir'|'watch'|'add'|'remove'|'change'} ThrottleType
 */ /**
 *
 * @typedef {Object} WatchHelpers
 * @property {Boolean} followSymlinks
 * @property {'stat'|'lstat'} statMethod
 * @property {Path} path
 * @property {Path} watchPath
 * @property {Function} entryPath
 * @property {Boolean} hasGlob
 * @property {Object} globFilter
 * @property {Function} filterPath
 * @property {Function} filterDir
 */ const $3b9d44f56f33b0f2$var$arrify = (value = [])=>Array.isArray(value) ? value : [
        value
    ]
;
const $3b9d44f56f33b0f2$var$flatten = (list, result = [])=>{
    list.forEach((item)=>{
        if (Array.isArray(item)) $3b9d44f56f33b0f2$var$flatten(item, result);
        else result.push(item);
    });
    return result;
};
const $3b9d44f56f33b0f2$var$unifyPaths = (paths_)=>{
    /**
   * @type {Array<String>}
   */ const paths = $3b9d44f56f33b0f2$var$flatten($3b9d44f56f33b0f2$var$arrify(paths_));
    if (!paths.every((p)=>typeof p === $3b9d44f56f33b0f2$require$STRING_TYPE
    )) throw new TypeError(`Non-string provided as watch path: ${paths}`);
    return paths.map($3b9d44f56f33b0f2$var$normalizePathToUnix);
};
// If SLASH_SLASH occurs at the beginning of path, it is not replaced
//     because "//StoragePC/DrivePool/Movies" is a valid network path
const $3b9d44f56f33b0f2$var$toUnix = (string)=>{
    let str = string.replace($3b9d44f56f33b0f2$require$BACK_SLASH_RE, $3b9d44f56f33b0f2$require$SLASH);
    let prepend = false;
    if (str.startsWith($3b9d44f56f33b0f2$require$SLASH_SLASH)) prepend = true;
    while(str.match($3b9d44f56f33b0f2$require$DOUBLE_SLASH_RE))str = str.replace($3b9d44f56f33b0f2$require$DOUBLE_SLASH_RE, $3b9d44f56f33b0f2$require$SLASH);
    if (prepend) str = $3b9d44f56f33b0f2$require$SLASH + str;
    return str;
};
// Our version of upath.normalize
// TODO: this is not equal to path-normalize module - investigate why
const $3b9d44f56f33b0f2$var$normalizePathToUnix = (path)=>$3b9d44f56f33b0f2$var$toUnix($igPDg$path.normalize($3b9d44f56f33b0f2$var$toUnix(path)))
;
const $3b9d44f56f33b0f2$var$normalizeIgnored = (cwd = $3b9d44f56f33b0f2$require$EMPTY_STR)=>(path)=>{
        if (typeof path !== $3b9d44f56f33b0f2$require$STRING_TYPE) return path;
        return $3b9d44f56f33b0f2$var$normalizePathToUnix($igPDg$path.isAbsolute(path) ? path : $igPDg$path.join(cwd, path));
    }
;
const $3b9d44f56f33b0f2$var$getAbsolutePath = (path, cwd)=>{
    if ($igPDg$path.isAbsolute(path)) return path;
    if (path.startsWith($3b9d44f56f33b0f2$require$BANG)) return $3b9d44f56f33b0f2$require$BANG + $igPDg$path.join(cwd, path.slice(1));
    return $igPDg$path.join(cwd, path);
};
const $3b9d44f56f33b0f2$var$undef = (opts, key)=>opts[key] === undefined
;
/**
 * Directory entry.
 * @property {Path} path
 * @property {Set<Path>} items
 */ class $3b9d44f56f33b0f2$var$DirEntry {
    /**
   * @param {Path} dir
   * @param {Function} removeWatcher
   */ constructor(dir1, removeWatcher){
        this.path = dir1;
        this._removeWatcher = removeWatcher;
        /** @type {Set<Path>} */ this.items = new Set();
    }
    add(item3) {
        const { items: items  } = this;
        if (!items) return;
        if (item3 !== $3b9d44f56f33b0f2$require$ONE_DOT && item3 !== $3b9d44f56f33b0f2$require$TWO_DOTS) items.add(item3);
    }
    async remove(item1) {
        const { items: items  } = this;
        if (!items) return;
        items.delete(item1);
        if (items.size > 0) return;
        const dir = this.path;
        try {
            await $3b9d44f56f33b0f2$var$readdir(dir);
        } catch (err) {
            if (this._removeWatcher) this._removeWatcher($igPDg$path.dirname(dir), $igPDg$path.basename(dir));
        }
    }
    has(item2) {
        const { items: items  } = this;
        if (!items) return;
        return items.has(item2);
    }
    /**
   * @returns {Array<String>}
   */ getChildren() {
        const { items: items  } = this;
        if (!items) return;
        return [
            ...items.values()
        ];
    }
    dispose() {
        this.items.clear();
        delete this.path;
        delete this._removeWatcher;
        delete this.items;
        Object.freeze(this);
    }
}
const $3b9d44f56f33b0f2$var$STAT_METHOD_F = 'stat';
const $3b9d44f56f33b0f2$var$STAT_METHOD_L = 'lstat';
class $3b9d44f56f33b0f2$var$WatchHelper {
    constructor(path2, watchPath, follow, fsw){
        this.fsw = fsw;
        this.path = path2 = path2.replace($3b9d44f56f33b0f2$require$REPLACER_RE, $3b9d44f56f33b0f2$require$EMPTY_STR);
        this.watchPath = watchPath;
        this.fullWatchPath = $igPDg$path.resolve(watchPath);
        this.hasGlob = watchPath !== path2;
        /** @type {object|boolean} */ if (path2 === $3b9d44f56f33b0f2$require$EMPTY_STR) this.hasGlob = false;
        this.globSymlink = this.hasGlob && follow ? undefined : false;
        this.globFilter = this.hasGlob ? $3b9d44f56f33b0f2$require$anymatch(path2, undefined, $3b9d44f56f33b0f2$require$ANYMATCH_OPTS) : false;
        this.dirParts = this.getDirParts(path2);
        this.dirParts.forEach((parts)=>{
            if (parts.length > 1) parts.pop();
        });
        this.followSymlinks = follow;
        this.statMethod = follow ? $3b9d44f56f33b0f2$var$STAT_METHOD_F : $3b9d44f56f33b0f2$var$STAT_METHOD_L;
    }
    checkGlobSymlink(entry4) {
        // only need to resolve once
        // first entry should always have entry.parentDir === EMPTY_STR
        if (this.globSymlink === undefined) this.globSymlink = entry4.fullParentDir === this.fullWatchPath ? false : {
            realPath: entry4.fullParentDir,
            linkPath: this.fullWatchPath
        };
        if (this.globSymlink) return entry4.fullPath.replace(this.globSymlink.realPath, this.globSymlink.linkPath);
        return entry4.fullPath;
    }
    entryPath(entry1) {
        return $igPDg$path.join(this.watchPath, $igPDg$path.relative(this.watchPath, this.checkGlobSymlink(entry1)));
    }
    filterPath(entry2) {
        const { stats: stats  } = entry2;
        if (stats && stats.isSymbolicLink()) return this.filterDir(entry2);
        const resolvedPath = this.entryPath(entry2);
        const matchesGlob = this.hasGlob && typeof this.globFilter === $3b9d44f56f33b0f2$require$FUNCTION_TYPE ? this.globFilter(resolvedPath) : true;
        return matchesGlob && this.fsw._isntIgnored(resolvedPath, stats) && this.fsw._hasReadPermissions(stats);
    }
    getDirParts(path1) {
        if (!this.hasGlob) return [];
        const parts = [];
        const expandedPath = path1.includes($3b9d44f56f33b0f2$require$BRACE_START) ? $eJXPY.expand(path1) : [
            path1
        ];
        expandedPath.forEach((path)=>{
            parts.push($igPDg$path.relative(this.watchPath, path).split($3b9d44f56f33b0f2$require$SLASH_OR_BACK_SLASH_RE));
        });
        return parts;
    }
    filterDir(entry3) {
        if (this.hasGlob) {
            const entryParts = this.getDirParts(this.checkGlobSymlink(entry3));
            let globstar = false;
            this.unmatchedGlob = !this.dirParts.some((parts)=>{
                return parts.every((part, i)=>{
                    if (part === $3b9d44f56f33b0f2$require$GLOBSTAR) globstar = true;
                    return globstar || !entryParts[0][i] || $3b9d44f56f33b0f2$require$anymatch(part, entryParts[0][i], $3b9d44f56f33b0f2$require$ANYMATCH_OPTS);
                });
            });
        }
        return !this.unmatchedGlob && this.fsw._isntIgnored(this.entryPath(entry3), entry3.stats);
    }
}
/**
 * Watches files & directories for changes. Emitted events:
 * `add`, `addDir`, `change`, `unlink`, `unlinkDir`, `all`, `error`
 *
 *     new FSWatcher()
 *       .add(directories)
 *       .on('add', path => log('File', path, 'was added'))
 */ class $3b9d44f56f33b0f2$var$FSWatcher extends $3b9d44f56f33b0f2$require$EventEmitter {
    // Not indenting methods for history sake; for now.
    constructor(_opts){
        super();
        const opts = {
        };
        if (_opts) Object.assign(opts, _opts); // for frozen objects
        /** @type {Map<String, DirEntry>} */ this._watched = new Map();
        /** @type {Map<String, Array>} */ this._closers = new Map();
        /** @type {Set<String>} */ this._ignoredPaths = new Set();
        /** @type {Map<ThrottleType, Map>} */ this._throttled = new Map();
        /** @type {Map<Path, String|Boolean>} */ this._symlinkPaths = new Map();
        this._streams = new Set();
        this.closed = false;
        // Set up default options.
        if ($3b9d44f56f33b0f2$var$undef(opts, 'persistent')) opts.persistent = true;
        if ($3b9d44f56f33b0f2$var$undef(opts, 'ignoreInitial')) opts.ignoreInitial = false;
        if ($3b9d44f56f33b0f2$var$undef(opts, 'ignorePermissionErrors')) opts.ignorePermissionErrors = false;
        if ($3b9d44f56f33b0f2$var$undef(opts, 'interval')) opts.interval = 100;
        if ($3b9d44f56f33b0f2$var$undef(opts, 'binaryInterval')) opts.binaryInterval = 300;
        if ($3b9d44f56f33b0f2$var$undef(opts, 'disableGlobbing')) opts.disableGlobbing = false;
        opts.enableBinaryInterval = opts.binaryInterval !== opts.interval;
        // Enable fsevents on OS X when polling isn't explicitly enabled.
        if ($3b9d44f56f33b0f2$var$undef(opts, 'useFsEvents')) opts.useFsEvents = !opts.usePolling;
        // If we can't use fsevents, ensure the options reflect it's disabled.
        const canUseFsEvents = $flPL2.canUse();
        if (!canUseFsEvents) opts.useFsEvents = false;
        // Use polling on Mac if not using fsevents.
        // Other platforms use non-polling fs_watch.
        if ($3b9d44f56f33b0f2$var$undef(opts, 'usePolling') && !opts.useFsEvents) opts.usePolling = $3b9d44f56f33b0f2$require$isMacos;
        // Always default to polling on IBM i because fs.watch() is not available on IBM i.
        if ($3b9d44f56f33b0f2$require$isIBMi) opts.usePolling = true;
        // Global override (useful for end-developers that need to force polling for all
        // instances of chokidar, regardless of usage/dependency depth)
        const envPoll = process.env.CHOKIDAR_USEPOLLING;
        if (envPoll !== undefined) {
            const envLower = envPoll.toLowerCase();
            if (envLower === 'false' || envLower === '0') opts.usePolling = false;
            else if (envLower === 'true' || envLower === '1') opts.usePolling = true;
            else opts.usePolling = !!envLower;
        }
        const envInterval = process.env.CHOKIDAR_INTERVAL;
        if (envInterval) opts.interval = Number.parseInt(envInterval, 10);
        // Editor atomic write normalization enabled by default with fs.watch
        if ($3b9d44f56f33b0f2$var$undef(opts, 'atomic')) opts.atomic = !opts.usePolling && !opts.useFsEvents;
        if (opts.atomic) this._pendingUnlinks = new Map();
        if ($3b9d44f56f33b0f2$var$undef(opts, 'followSymlinks')) opts.followSymlinks = true;
        if ($3b9d44f56f33b0f2$var$undef(opts, 'awaitWriteFinish')) opts.awaitWriteFinish = false;
        if (opts.awaitWriteFinish === true) opts.awaitWriteFinish = {
        };
        const awf = opts.awaitWriteFinish;
        if (awf) {
            if (!awf.stabilityThreshold) awf.stabilityThreshold = 2000;
            if (!awf.pollInterval) awf.pollInterval = 100;
            this._pendingWrites = new Map();
        }
        if (opts.ignored) opts.ignored = $3b9d44f56f33b0f2$var$arrify(opts.ignored);
        let readyCalls = 0;
        this._emitReady = ()=>{
            readyCalls++;
            if (readyCalls >= this._readyCount) {
                this._emitReady = $3b9d44f56f33b0f2$require$EMPTY_FN;
                this._readyEmitted = true;
                // use process.nextTick to allow time for listener to be bound
                process.nextTick(()=>this.emit($3b9d44f56f33b0f2$require$EV_READY)
                );
            }
        };
        this._emitRaw = (...args)=>this.emit($3b9d44f56f33b0f2$require$EV_RAW, ...args)
        ;
        this._readyEmitted = false;
        this.options = opts;
        // Initialize with proper watcher.
        if (opts.useFsEvents) this._fsEventsHandler = new $flPL2(this);
        else this._nodeFsHandler = new $lRRqt(this);
        // You’re frozen when your heart’s not open.
        Object.freeze(opts);
    }
    // Public methods
    /**
 * Adds paths to be watched on an existing FSWatcher instance
 * @param {Path|Array<Path>} paths_
 * @param {String=} _origAdd private; for handling non-existent paths to be watched
 * @param {Boolean=} _internal private; indicates a non-user add
 * @returns {FSWatcher} for chaining
 */ add(paths_, _origAdd, _internal) {
        const { cwd: cwd , disableGlobbing: disableGlobbing  } = this.options;
        this.closed = false;
        let paths = $3b9d44f56f33b0f2$var$unifyPaths(paths_);
        if (cwd) paths = paths.map((path)=>{
            const absPath = $3b9d44f56f33b0f2$var$getAbsolutePath(path, cwd);
            // Check `path` instead of `absPath` because the cwd portion can't be a glob
            if (disableGlobbing || !$jR9BM(path)) return absPath;
            return $kOgXJ(absPath);
        });
        // set aside negated glob strings
        paths = paths.filter((path)=>{
            if (path.startsWith($3b9d44f56f33b0f2$require$BANG)) {
                this._ignoredPaths.add(path.slice(1));
                return false;
            }
            // if a path is being added that was previously ignored, stop ignoring it
            this._ignoredPaths.delete(path);
            this._ignoredPaths.delete(path + $3b9d44f56f33b0f2$require$SLASH_GLOBSTAR);
            // reset the cached userIgnored anymatch fn
            // to make ignoredPaths changes effective
            this._userIgnored = undefined;
            return true;
        });
        if (this.options.useFsEvents && this._fsEventsHandler) {
            if (!this._readyCount) this._readyCount = paths.length;
            if (this.options.persistent) this._readyCount *= 2;
            paths.forEach((path)=>this._fsEventsHandler._addToFsEvents(path)
            );
        } else {
            if (!this._readyCount) this._readyCount = 0;
            this._readyCount += paths.length;
            Promise.all(paths.map(async (path)=>{
                const res = await this._nodeFsHandler._addToNodeFs(path, !_internal, 0, 0, _origAdd);
                if (res) this._emitReady();
                return res;
            })).then((results)=>{
                if (this.closed) return;
                results.filter((item)=>item
                ).forEach((item)=>{
                    this.add($igPDg$path.dirname(item), $igPDg$path.basename(_origAdd || item));
                });
            });
        }
        return this;
    }
    /**
 * Close watchers or start ignoring events from specified paths.
 * @param {Path|Array<Path>} paths_ - string or array of strings, file/directory paths and/or globs
 * @returns {FSWatcher} for chaining
*/ unwatch(paths_1) {
        if (this.closed) return this;
        const paths = $3b9d44f56f33b0f2$var$unifyPaths(paths_1);
        const { cwd: cwd  } = this.options;
        paths.forEach((path)=>{
            // convert to absolute path unless relative path already matches
            if (!$igPDg$path.isAbsolute(path) && !this._closers.has(path)) {
                if (cwd) path = $igPDg$path.join(cwd, path);
                path = $igPDg$path.resolve(path);
            }
            this._closePath(path);
            this._ignoredPaths.add(path);
            if (this._watched.has(path)) this._ignoredPaths.add(path + $3b9d44f56f33b0f2$require$SLASH_GLOBSTAR);
            // reset the cached userIgnored anymatch fn
            // to make ignoredPaths changes effective
            this._userIgnored = undefined;
        });
        return this;
    }
    /**
 * Close watchers and remove all listeners from watched paths.
 * @returns {Promise<void>}.
*/ close() {
        if (this.closed) return this._closePromise;
        this.closed = true;
        // Memory management.
        this.removeAllListeners();
        const closers = [];
        this._closers.forEach((closerList)=>closerList.forEach((closer)=>{
                const promise = closer();
                if (promise instanceof Promise) closers.push(promise);
            })
        );
        this._streams.forEach((stream)=>stream.destroy()
        );
        this._userIgnored = undefined;
        this._readyCount = 0;
        this._readyEmitted = false;
        this._watched.forEach((dirent)=>dirent.dispose()
        );
        [
            'closers',
            'watched',
            'streams',
            'symlinkPaths',
            'throttled'
        ].forEach((key)=>{
            this[`_${key}`].clear();
        });
        this._closePromise = closers.length ? Promise.all(closers).then(()=>undefined
        ) : Promise.resolve();
        return this._closePromise;
    }
    /**
 * Expose list of watched paths
 * @returns {Object} for chaining
*/ getWatched() {
        const watchList = {
        };
        this._watched.forEach((entry, dir)=>{
            const key = this.options.cwd ? $igPDg$path.relative(this.options.cwd, dir) : dir;
            watchList[key || $3b9d44f56f33b0f2$require$ONE_DOT] = entry.getChildren().sort();
        });
        return watchList;
    }
    emitWithAll(event, args) {
        this.emit(...args);
        if (event !== $3b9d44f56f33b0f2$require$EV_ERROR) this.emit($3b9d44f56f33b0f2$require$EV_ALL, ...args);
    }
    // Common helpers
    // --------------
    /**
 * Normalize and emit events.
 * Calling _emit DOES NOT MEAN emit() would be called!
 * @param {EventName} event Type of event
 * @param {Path} path File or directory path
 * @param {*=} val1 arguments to be passed with event
 * @param {*=} val2
 * @param {*=} val3
 * @returns the error if defined, otherwise the value of the FSWatcher instance's `closed` flag
 */ async _emit(event1, path3, val1, val2, val3) {
        if (this.closed) return;
        const opts = this.options;
        if ($3b9d44f56f33b0f2$require$isWindows) path3 = $igPDg$path.normalize(path3);
        if (opts.cwd) path3 = $igPDg$path.relative(opts.cwd, path3);
        /** @type Array<any> */ const args = [
            event1,
            path3
        ];
        if (val3 !== undefined) args.push(val1, val2, val3);
        else if (val2 !== undefined) args.push(val1, val2);
        else if (val1 !== undefined) args.push(val1);
        const awf = opts.awaitWriteFinish;
        let pw;
        if (awf && (pw = this._pendingWrites.get(path3))) {
            pw.lastChange = new Date();
            return this;
        }
        if (opts.atomic) {
            if (event1 === $3b9d44f56f33b0f2$require$EV_UNLINK) {
                this._pendingUnlinks.set(path3, args);
                setTimeout(()=>{
                    this._pendingUnlinks.forEach((entry, path)=>{
                        this.emit(...entry);
                        this.emit($3b9d44f56f33b0f2$require$EV_ALL, ...entry);
                        this._pendingUnlinks.delete(path);
                    });
                }, typeof opts.atomic === 'number' ? opts.atomic : 100);
                return this;
            }
            if (event1 === $3b9d44f56f33b0f2$require$EV_ADD && this._pendingUnlinks.has(path3)) {
                event1 = args[0] = $3b9d44f56f33b0f2$require$EV_CHANGE;
                this._pendingUnlinks.delete(path3);
            }
        }
        if (awf && (event1 === $3b9d44f56f33b0f2$require$EV_ADD || event1 === $3b9d44f56f33b0f2$require$EV_CHANGE) && this._readyEmitted) {
            const awfEmit = (err, stats)=>{
                if (err) {
                    event1 = args[0] = $3b9d44f56f33b0f2$require$EV_ERROR;
                    args[1] = err;
                    this.emitWithAll(event1, args);
                } else if (stats) {
                    // if stats doesn't exist the file must have been deleted
                    if (args.length > 2) args[2] = stats;
                    else args.push(stats);
                    this.emitWithAll(event1, args);
                }
            };
            this._awaitWriteFinish(path3, awf.stabilityThreshold, event1, awfEmit);
            return this;
        }
        if (event1 === $3b9d44f56f33b0f2$require$EV_CHANGE) {
            const isThrottled = !this._throttle($3b9d44f56f33b0f2$require$EV_CHANGE, path3, 50);
            if (isThrottled) return this;
        }
        if (opts.alwaysStat && val1 === undefined && (event1 === $3b9d44f56f33b0f2$require$EV_ADD || event1 === $3b9d44f56f33b0f2$require$EV_ADD_DIR || event1 === $3b9d44f56f33b0f2$require$EV_CHANGE)) {
            const fullPath = opts.cwd ? $igPDg$path.join(opts.cwd, path3) : path3;
            let stats;
            try {
                stats = await $3b9d44f56f33b0f2$var$stat(fullPath);
            } catch (err) {
            }
            // Suppress event when fs_stat fails, to avoid sending undefined 'stat'
            if (!stats || this.closed) return;
            args.push(stats);
        }
        this.emitWithAll(event1, args);
        return this;
    }
    /**
 * Common handler for errors
 * @param {Error} error
 * @returns {Error|Boolean} The error if defined, otherwise the value of the FSWatcher instance's `closed` flag
 */ _handleError(error) {
        const code = error && error.code;
        if (error && code !== 'ENOENT' && code !== 'ENOTDIR' && (!this.options.ignorePermissionErrors || code !== 'EPERM' && code !== 'EACCES')) this.emit($3b9d44f56f33b0f2$require$EV_ERROR, error);
        return error || this.closed;
    }
    /**
 * Helper utility for throttling
 * @param {ThrottleType} actionType type being throttled
 * @param {Path} path being acted upon
 * @param {Number} timeout duration of time to suppress duplicate actions
 * @returns {Object|false} tracking object or false if action should be suppressed
 */ _throttle(actionType, path6, timeout) {
        if (!this._throttled.has(actionType)) this._throttled.set(actionType, new Map());
        /** @type {Map<Path, Object>} */ const action = this._throttled.get(actionType);
        /** @type {Object} */ const actionPath = action.get(path6);
        if (actionPath) {
            actionPath.count++;
            return false;
        }
        let timeoutObject;
        const clear = ()=>{
            const item = action.get(path6);
            const count = item ? item.count : 0;
            action.delete(path6);
            clearTimeout(timeoutObject);
            if (item) clearTimeout(item.timeoutObject);
            return count;
        };
        timeoutObject = setTimeout(clear, timeout);
        const thr = {
            timeoutObject: timeoutObject,
            clear: clear,
            count: 0
        };
        action.set(path6, thr);
        return thr;
    }
    _incrReadyCount() {
        return this._readyCount++;
    }
    /**
 * Awaits write operation to finish.
 * Polls a newly created file for size variations. When files size does not change for 'threshold' milliseconds calls callback.
 * @param {Path} path being acted upon
 * @param {Number} threshold Time in milliseconds a file size must be fixed before acknowledging write OP is finished
 * @param {EventName} event
 * @param {Function} awfEmit Callback to be called when ready for event to be emitted.
 */ _awaitWriteFinish(path4, threshold, event2, awfEmit) {
        let timeoutHandler;
        let fullPath = path4;
        if (this.options.cwd && !$igPDg$path.isAbsolute(path4)) fullPath = $igPDg$path.join(this.options.cwd, path4);
        const now1 = new Date();
        const awaitWriteFinish = (prevStat)=>{
            $igPDg$fs.stat(fullPath, (err, curStat)=>{
                if (err || !this._pendingWrites.has(path4)) {
                    if (err && err.code !== 'ENOENT') awfEmit(err);
                    return;
                }
                const now = Number(new Date());
                if (prevStat && curStat.size !== prevStat.size) this._pendingWrites.get(path4).lastChange = now;
                const pw = this._pendingWrites.get(path4);
                const df = now - pw.lastChange;
                if (df >= threshold) {
                    this._pendingWrites.delete(path4);
                    awfEmit(undefined, curStat);
                } else timeoutHandler = setTimeout(awaitWriteFinish, this.options.awaitWriteFinish.pollInterval, curStat);
            });
        };
        if (!this._pendingWrites.has(path4)) {
            this._pendingWrites.set(path4, {
                lastChange: now1,
                cancelWait: ()=>{
                    this._pendingWrites.delete(path4);
                    clearTimeout(timeoutHandler);
                    return event2;
                }
            });
            timeoutHandler = setTimeout(awaitWriteFinish, this.options.awaitWriteFinish.pollInterval);
        }
    }
    _getGlobIgnored() {
        return [
            ...this._ignoredPaths.values()
        ];
    }
    /**
 * Determines whether user has asked to ignore this path.
 * @param {Path} path filepath or dir
 * @param {fs.Stats=} stats result of fs.stat
 * @returns {Boolean}
 */ _isIgnored(path5, stats) {
        if (this.options.atomic && $3b9d44f56f33b0f2$require$DOT_RE.test(path5)) return true;
        if (!this._userIgnored) {
            const { cwd: cwd  } = this.options;
            const ign = this.options.ignored;
            const ignored = ign && ign.map($3b9d44f56f33b0f2$var$normalizeIgnored(cwd));
            const paths = $3b9d44f56f33b0f2$var$arrify(ignored).filter((path)=>typeof path === $3b9d44f56f33b0f2$require$STRING_TYPE && !$jR9BM(path)
            ).map((path)=>path + $3b9d44f56f33b0f2$require$SLASH_GLOBSTAR
            );
            const list = this._getGlobIgnored().map($3b9d44f56f33b0f2$var$normalizeIgnored(cwd)).concat(ignored, paths);
            this._userIgnored = $3b9d44f56f33b0f2$require$anymatch(list, undefined, $3b9d44f56f33b0f2$require$ANYMATCH_OPTS);
        }
        return this._userIgnored([
            path5,
            stats
        ]);
    }
    _isntIgnored(path, stat) {
        return !this._isIgnored(path, stat);
    }
    /**
 * Provides a set of common helpers and properties relating to symlink and glob handling.
 * @param {Path} path file, directory, or glob pattern being watched
 * @param {Number=} depth at any depth > 0, this isn't a glob
 * @returns {WatchHelper} object containing helpers for this path
 */ _getWatchHelpers(path7, depth) {
        const watchPath = depth || this.options.disableGlobbing || !$jR9BM(path7) ? path7 : $64Oh3(path7);
        const follow = this.options.followSymlinks;
        return new $3b9d44f56f33b0f2$var$WatchHelper(path7, watchPath, follow, this);
    }
    // Directory helpers
    // -----------------
    /**
 * Provides directory tracking objects
 * @param {String} directory path of the directory
 * @returns {DirEntry} the directory's tracking object
 */ _getWatchedDir(directory) {
        if (!this._boundRemove) this._boundRemove = this._remove.bind(this);
        const dir = $igPDg$path.resolve(directory);
        if (!this._watched.has(dir)) this._watched.set(dir, new $3b9d44f56f33b0f2$var$DirEntry(dir, this._boundRemove));
        return this._watched.get(dir);
    }
    // File helpers
    // ------------
    /**
 * Check for read permissions.
 * Based on this answer on SO: https://stackoverflow.com/a/11781404/1358405
 * @param {fs.Stats} stats - object, result of fs_stat
 * @returns {Boolean} indicates whether the file can be read
*/ _hasReadPermissions(stats1) {
        if (this.options.ignorePermissionErrors) return true;
        // stats.mode may be bigint
        const md = stats1 && Number.parseInt(stats1.mode, 10);
        const st = md & 511;
        const it = Number.parseInt(st.toString(8)[0], 10);
        return Boolean(4 & it);
    }
    /**
 * Handles emitting unlink events for
 * files and directories, and via recursion, for
 * files and directories within directories that are unlinked
 * @param {String} directory within which the following item is located
 * @param {String} item      base path of item/directory
 * @returns {void}
*/ _remove(directory1, item, isDirectory) {
        // if what is being deleted is a directory, get that directory's paths
        // for recursive deleting and cleaning of watched object
        // if it is not a directory, nestedDirectoryChildren will be empty array
        const path = $igPDg$path.join(directory1, item);
        const fullPath = $igPDg$path.resolve(path);
        isDirectory = isDirectory != null ? isDirectory : this._watched.has(path) || this._watched.has(fullPath);
        // prevent duplicate handling in case of arriving here nearly simultaneously
        // via multiple paths (such as _handleFile and _handleDir)
        if (!this._throttle('remove', path, 100)) return;
        // if the only watched file is removed, watch for its return
        if (!isDirectory && !this.options.useFsEvents && this._watched.size === 1) this.add(directory1, item, true);
        // This will create a new entry in the watched object in either case
        // so we got to do the directory check beforehand
        const wp = this._getWatchedDir(path);
        const nestedDirectoryChildren = wp.getChildren();
        // Recursively remove children directories / files.
        nestedDirectoryChildren.forEach((nested)=>this._remove(path, nested)
        );
        // Check if item was on the watched list and remove it
        const parent = this._getWatchedDir(directory1);
        const wasTracked = parent.has(item);
        parent.remove(item);
        // Fixes issue #1042 -> Relative paths were detected and added as symlinks
        // (https://github.com/paulmillr/chokidar/blob/e1753ddbc9571bdc33b4a4af172d52cb6e611c10/lib/nodefs-handler.js#L612),
        // but never removed from the map in case the path was deleted.
        // This leads to an incorrect state if the path was recreated:
        // https://github.com/paulmillr/chokidar/blob/e1753ddbc9571bdc33b4a4af172d52cb6e611c10/lib/nodefs-handler.js#L553
        if (this._symlinkPaths.has(fullPath)) this._symlinkPaths.delete(fullPath);
        // If we wait for this file to be fully written, cancel the wait.
        let relPath = path;
        if (this.options.cwd) relPath = $igPDg$path.relative(this.options.cwd, path);
        if (this.options.awaitWriteFinish && this._pendingWrites.has(relPath)) {
            const event = this._pendingWrites.get(relPath).cancelWait();
            if (event === $3b9d44f56f33b0f2$require$EV_ADD) return;
        }
        // The Entry will either be a directory that just got removed
        // or a bogus entry to a file, in either case we have to remove it
        this._watched.delete(path);
        this._watched.delete(fullPath);
        const eventName = isDirectory ? $3b9d44f56f33b0f2$require$EV_UNLINK_DIR : $3b9d44f56f33b0f2$require$EV_UNLINK;
        if (wasTracked && !this._isIgnored(path)) this._emit(eventName, path);
        // Avoid conflicts if we later create another file with the same name
        if (!this.options.useFsEvents) this._closePath(path);
    }
    /**
 * Closes all watchers for a path
 * @param {Path} path
 */ _closePath(path8) {
        this._closeFile(path8);
        const dir = $igPDg$path.dirname(path8);
        this._getWatchedDir(dir).remove($igPDg$path.basename(path8));
    }
    /**
 * Closes only file-specific watchers
 * @param {Path} path
 */ _closeFile(path9) {
        const closers = this._closers.get(path9);
        if (!closers) return;
        closers.forEach((closer)=>closer()
        );
        this._closers.delete(path9);
    }
    /**
 *
 * @param {Path} path
 * @param {Function} closer
 */ _addPathCloser(path10, closer) {
        if (!closer) return;
        let list = this._closers.get(path10);
        if (!list) {
            list = [];
            this._closers.set(path10, list);
        }
        list.push(closer);
    }
    _readdirp(root, opts) {
        if (this.closed) return;
        const options = {
            type: $3b9d44f56f33b0f2$require$EV_ALL,
            alwaysStat: true,
            lstat: true,
            ...opts
        };
        let stream = $hexCw(root, options);
        this._streams.add(stream);
        stream.once($3b9d44f56f33b0f2$require$STR_CLOSE, ()=>{
            stream = undefined;
        });
        stream.once($3b9d44f56f33b0f2$require$STR_END, ()=>{
            if (stream) {
                this._streams.delete(stream);
                stream = undefined;
            }
        });
        return stream;
    }
}
$3b9d44f56f33b0f2$export$552f5da8b13f69c4 = $3b9d44f56f33b0f2$var$FSWatcher;
/**
 * Instantiates watcher with paths to be tracked.
 * @param {String|Array<String>} paths file/directory paths and/or globs
 * @param {Object=} options chokidar opts
 * @returns an instance of FSWatcher for chaining.
 */ const $3b9d44f56f33b0f2$var$watch = (paths, options)=>{
    const watcher = new $3b9d44f56f33b0f2$var$FSWatcher(options);
    watcher.add(paths);
    return watcher;
};
$3b9d44f56f33b0f2$export$3db5d71bdb2d5499 = $3b9d44f56f33b0f2$var$watch;

});
parcelRequire.register("hexCw", function(module, exports) {
'use strict';


var $c8bdd2c53751591e$require$Readable = $igPDg$stream.Readable;


var $c8bdd2c53751591e$require$promisify = $igPDg$util.promisify;

var $faTXT = parcelRequire("faTXT");
const $c8bdd2c53751591e$var$readdir = $c8bdd2c53751591e$require$promisify($igPDg$fs.readdir);
const $c8bdd2c53751591e$var$stat = $c8bdd2c53751591e$require$promisify($igPDg$fs.stat);
const $c8bdd2c53751591e$var$lstat = $c8bdd2c53751591e$require$promisify($igPDg$fs.lstat);
const $c8bdd2c53751591e$var$realpath = $c8bdd2c53751591e$require$promisify($igPDg$fs.realpath);
/**
 * @typedef {Object} EntryInfo
 * @property {String} path
 * @property {String} fullPath
 * @property {fs.Stats=} stats
 * @property {fs.Dirent=} dirent
 * @property {String} basename
 */ const $c8bdd2c53751591e$var$BANG = '!';
const $c8bdd2c53751591e$var$RECURSIVE_ERROR_CODE = 'READDIRP_RECURSIVE_ERROR';
const $c8bdd2c53751591e$var$NORMAL_FLOW_ERRORS = new Set([
    'ENOENT',
    'EPERM',
    'EACCES',
    'ELOOP',
    $c8bdd2c53751591e$var$RECURSIVE_ERROR_CODE
]);
const $c8bdd2c53751591e$var$FILE_TYPE = 'files';
const $c8bdd2c53751591e$var$DIR_TYPE = 'directories';
const $c8bdd2c53751591e$var$FILE_DIR_TYPE = 'files_directories';
const $c8bdd2c53751591e$var$EVERYTHING_TYPE = 'all';
const $c8bdd2c53751591e$var$ALL_TYPES = [
    $c8bdd2c53751591e$var$FILE_TYPE,
    $c8bdd2c53751591e$var$DIR_TYPE,
    $c8bdd2c53751591e$var$FILE_DIR_TYPE,
    $c8bdd2c53751591e$var$EVERYTHING_TYPE
];
const $c8bdd2c53751591e$var$isNormalFlowError = (error)=>$c8bdd2c53751591e$var$NORMAL_FLOW_ERRORS.has(error.code)
;
const [$c8bdd2c53751591e$var$maj, $c8bdd2c53751591e$var$min] = process.versions.node.split('.').slice(0, 2).map((n)=>Number.parseInt(n, 10)
);
const $c8bdd2c53751591e$var$wantBigintFsStats = process.platform === 'win32' && ($c8bdd2c53751591e$var$maj > 10 || $c8bdd2c53751591e$var$maj === 10 && $c8bdd2c53751591e$var$min >= 5);
const $c8bdd2c53751591e$var$normalizeFilter = (filter)=>{
    if (filter === undefined) return;
    if (typeof filter === 'function') return filter;
    if (typeof filter === 'string') {
        const glob = $faTXT(filter.trim());
        return (entry)=>glob(entry.basename)
        ;
    }
    if (Array.isArray(filter)) {
        const positive = [];
        const negative = [];
        for (const item of filter){
            const trimmed = item.trim();
            if (trimmed.charAt(0) === $c8bdd2c53751591e$var$BANG) negative.push($faTXT(trimmed.slice(1)));
            else positive.push($faTXT(trimmed));
        }
        if (negative.length > 0) {
            if (positive.length > 0) return (entry)=>positive.some((f)=>f(entry.basename)
                ) && !negative.some((f)=>f(entry.basename)
                )
            ;
            return (entry)=>!negative.some((f)=>f(entry.basename)
                )
            ;
        }
        return (entry)=>positive.some((f)=>f(entry.basename)
            )
        ;
    }
};
class $c8bdd2c53751591e$var$ReaddirpStream extends $c8bdd2c53751591e$require$Readable {
    static get defaultOptions() {
        return {
            root: '.',
            /* eslint-disable no-unused-vars */ fileFilter: (path)=>true
            ,
            directoryFilter: (path)=>true
            ,
            /* eslint-enable no-unused-vars */ type: $c8bdd2c53751591e$var$FILE_TYPE,
            lstat: false,
            depth: 2147483648,
            alwaysStat: false
        };
    }
    constructor(options1 = {
    }){
        super({
            objectMode: true,
            autoDestroy: true,
            highWaterMark: options1.highWaterMark || 4096
        });
        const opts = {
            ...$c8bdd2c53751591e$var$ReaddirpStream.defaultOptions,
            ...options1
        };
        const { root: root , type: type  } = opts;
        this._fileFilter = $c8bdd2c53751591e$var$normalizeFilter(opts.fileFilter);
        this._directoryFilter = $c8bdd2c53751591e$var$normalizeFilter(opts.directoryFilter);
        const statMethod = opts.lstat ? $c8bdd2c53751591e$var$lstat : $c8bdd2c53751591e$var$stat;
        // Use bigint stats if it's windows and stat() supports options (node 10+).
        if ($c8bdd2c53751591e$var$wantBigintFsStats) this._stat = (path)=>statMethod(path, {
                bigint: true
            })
        ;
        else this._stat = statMethod;
        this._maxDepth = opts.depth;
        this._wantsDir = [
            $c8bdd2c53751591e$var$DIR_TYPE,
            $c8bdd2c53751591e$var$FILE_DIR_TYPE,
            $c8bdd2c53751591e$var$EVERYTHING_TYPE
        ].includes(type);
        this._wantsFile = [
            $c8bdd2c53751591e$var$FILE_TYPE,
            $c8bdd2c53751591e$var$FILE_DIR_TYPE,
            $c8bdd2c53751591e$var$EVERYTHING_TYPE
        ].includes(type);
        this._wantsEverything = type === $c8bdd2c53751591e$var$EVERYTHING_TYPE;
        this._root = $igPDg$path.resolve(root);
        this._isDirent = 'Dirent' in $igPDg$fs && !opts.alwaysStat;
        this._statsProp = this._isDirent ? 'dirent' : 'stats';
        this._rdOptions = {
            encoding: 'utf8',
            withFileTypes: this._isDirent
        };
        // Launch stream with one parent, the root dir.
        this.parents = [
            this._exploreDir(root, 1)
        ];
        this.reading = false;
        this.parent = undefined;
    }
    async _read(batch) {
        if (this.reading) return;
        this.reading = true;
        try {
            while(!this.destroyed && batch > 0){
                const { path: path , depth: depth , files: files = []  } = this.parent || {
                };
                if (files.length > 0) {
                    const slice = files.splice(0, batch).map((dirent)=>this._formatEntry(dirent, path)
                    );
                    for (const entry of (await Promise.all(slice))){
                        if (this.destroyed) return;
                        const entryType = await this._getEntryType(entry);
                        if (entryType === 'directory' && this._directoryFilter(entry)) {
                            if (depth <= this._maxDepth) this.parents.push(this._exploreDir(entry.fullPath, depth + 1));
                            if (this._wantsDir) {
                                this.push(entry);
                                batch--;
                            }
                        } else if ((entryType === 'file' || this._includeAsFile(entry)) && this._fileFilter(entry)) {
                            if (this._wantsFile) {
                                this.push(entry);
                                batch--;
                            }
                        }
                    }
                } else {
                    const parent = this.parents.pop();
                    if (!parent) {
                        this.push(null);
                        break;
                    }
                    this.parent = await parent;
                    if (this.destroyed) return;
                }
            }
        } catch (error) {
            this.destroy(error);
        } finally{
            this.reading = false;
        }
    }
    async _exploreDir(path, depth) {
        let files;
        try {
            files = await $c8bdd2c53751591e$var$readdir(path, this._rdOptions);
        } catch (error) {
            this._onError(error);
        }
        return {
            files: files,
            depth: depth,
            path: path
        };
    }
    async _formatEntry(dirent, path1) {
        let entry;
        try {
            const basename = this._isDirent ? dirent.name : dirent;
            const fullPath = $igPDg$path.resolve($igPDg$path.join(path1, basename));
            entry = {
                path: $igPDg$path.relative(this._root, fullPath),
                fullPath: fullPath,
                basename: basename
            };
            entry[this._statsProp] = this._isDirent ? dirent : await this._stat(fullPath);
        } catch (err) {
            this._onError(err);
        }
        return entry;
    }
    _onError(err) {
        if ($c8bdd2c53751591e$var$isNormalFlowError(err) && !this.destroyed) this.emit('warn', err);
        else this.destroy(err);
    }
    async _getEntryType(entry2) {
        // entry may be undefined, because a warning or an error were emitted
        // and the statsProp is undefined
        const stats = entry2 && entry2[this._statsProp];
        if (!stats) return;
        if (stats.isFile()) return 'file';
        if (stats.isDirectory()) return 'directory';
        if (stats && stats.isSymbolicLink()) {
            const full = entry2.fullPath;
            try {
                const entryRealPath = await $c8bdd2c53751591e$var$realpath(full);
                const entryRealPathStats = await $c8bdd2c53751591e$var$lstat(entryRealPath);
                if (entryRealPathStats.isFile()) return 'file';
                if (entryRealPathStats.isDirectory()) {
                    const len = entryRealPath.length;
                    if (full.startsWith(entryRealPath) && full.substr(len, 1) === $igPDg$path.sep) {
                        const recursiveError = new Error(`Circular symlink detected: "${full}" points to "${entryRealPath}"`);
                        recursiveError.code = $c8bdd2c53751591e$var$RECURSIVE_ERROR_CODE;
                        return this._onError(recursiveError);
                    }
                    return 'directory';
                }
            } catch (error) {
                this._onError(error);
            }
        }
    }
    _includeAsFile(entry1) {
        const stats = entry1 && entry1[this._statsProp];
        return stats && this._wantsEverything && !stats.isDirectory();
    }
}
/**
 * @typedef {Object} ReaddirpArguments
 * @property {Function=} fileFilter
 * @property {Function=} directoryFilter
 * @property {String=} type
 * @property {Number=} depth
 * @property {String=} root
 * @property {Boolean=} lstat
 * @property {Boolean=} bigint
 */ /**
 * Main function which ends up calling readdirRec and reads all files and directories in given root recursively.
 * @param {String} root Root directory
 * @param {ReaddirpArguments=} options Options to specify root (start directory), filters and recursion depth
 */ const $c8bdd2c53751591e$var$readdirp = (root, options = {
})=>{
    let type = options.entryType || options.type;
    if (type === 'both') type = $c8bdd2c53751591e$var$FILE_DIR_TYPE; // backwards-compatibility
    if (type) options.type = type;
    if (!root) throw new Error('readdirp: root argument is required. Usage: readdirp(root, options)');
    else if (typeof root !== 'string') throw new TypeError('readdirp: root argument must be a string. Usage: readdirp(root, options)');
    else if (type && !$c8bdd2c53751591e$var$ALL_TYPES.includes(type)) throw new Error(`readdirp: Invalid type passed. Use one of ${$c8bdd2c53751591e$var$ALL_TYPES.join(', ')}`);
    options.root = root;
    return new $c8bdd2c53751591e$var$ReaddirpStream(options);
};
const $c8bdd2c53751591e$var$readdirpPromise = (root, options = {
})=>{
    return new Promise((resolve, reject)=>{
        const files = [];
        $c8bdd2c53751591e$var$readdirp(root, options).on('data', (entry)=>files.push(entry)
        ).on('end', ()=>resolve(files)
        ).on('error', (error)=>reject(error)
        );
    });
};
$c8bdd2c53751591e$var$readdirp.promise = $c8bdd2c53751591e$var$readdirpPromise;
$c8bdd2c53751591e$var$readdirp.ReaddirpStream = $c8bdd2c53751591e$var$ReaddirpStream;
$c8bdd2c53751591e$var$readdirp.default = $c8bdd2c53751591e$var$readdirp;
module.exports = $c8bdd2c53751591e$var$readdirp;

});

parcelRequire.register("2fBCn", function(module, exports) {
'use strict';
Object.defineProperty(module.exports, "__esModule", {
    value: true
});

var $faTXT = parcelRequire("faTXT");

var $kOgXJ = parcelRequire("kOgXJ");
/**
 * @typedef {(testString: string) => boolean} AnymatchFn
 * @typedef {string|RegExp|AnymatchFn} AnymatchPattern
 * @typedef {AnymatchPattern|AnymatchPattern[]} AnymatchMatcher
 */ const $1a3a29a8761b38f1$var$BANG = '!';
const $1a3a29a8761b38f1$var$DEFAULT_OPTIONS = {
    returnIndex: false
};
const $1a3a29a8761b38f1$var$arrify = (item)=>Array.isArray(item) ? item : [
        item
    ]
;
/**
 * @param {AnymatchPattern} matcher
 * @param {object} options
 * @returns {AnymatchFn}
 */ const $1a3a29a8761b38f1$var$createPattern = (matcher, options)=>{
    if (typeof matcher === 'function') return matcher;
    if (typeof matcher === 'string') {
        const glob = $faTXT(matcher, options);
        return (string)=>matcher === string || glob(string)
        ;
    }
    if (matcher instanceof RegExp) return (string)=>matcher.test(string)
    ;
    return (string)=>false
    ;
};
/**
 * @param {Array<Function>} patterns
 * @param {Array<Function>} negPatterns
 * @param {String|Array} args
 * @param {Boolean} returnIndex
 * @returns {boolean|number}
 */ const $1a3a29a8761b38f1$var$matchPatterns = (patterns, negPatterns, args, returnIndex)=>{
    const isList = Array.isArray(args);
    const _path = isList ? args[0] : args;
    if (!isList && typeof _path !== 'string') throw new TypeError('anymatch: second argument must be a string: got ' + Object.prototype.toString.call(_path));
    const path = $kOgXJ(_path);
    for(let index = 0; index < negPatterns.length; index++){
        const nglob = negPatterns[index];
        if (nglob(path)) return returnIndex ? -1 : false;
    }
    const applied = isList && [
        path
    ].concat(args.slice(1));
    for(let index1 = 0; index1 < patterns.length; index1++){
        const pattern = patterns[index1];
        if (isList ? pattern(...applied) : pattern(path)) return returnIndex ? index1 : true;
    }
    return returnIndex ? -1 : false;
};
/**
 * @param {AnymatchMatcher} matchers
 * @param {Array|string} testString
 * @param {object} options
 * @returns {boolean|number|Function}
 */ const $1a3a29a8761b38f1$var$anymatch = (matchers, testString1, options = $1a3a29a8761b38f1$var$DEFAULT_OPTIONS)=>{
    if (matchers == null) throw new TypeError('anymatch: specify first argument');
    const opts = typeof options === 'boolean' ? {
        returnIndex: options
    } : options;
    const returnIndex1 = opts.returnIndex || false;
    // Early cache for matchers.
    const mtchers = $1a3a29a8761b38f1$var$arrify(matchers);
    const negatedGlobs = mtchers.filter((item)=>typeof item === 'string' && item.charAt(0) === $1a3a29a8761b38f1$var$BANG
    ).map((item)=>item.slice(1)
    ).map((item)=>$faTXT(item, opts)
    );
    const patterns = mtchers.filter((item)=>typeof item !== 'string' || typeof item === 'string' && item.charAt(0) !== $1a3a29a8761b38f1$var$BANG
    ).map((matcher)=>$1a3a29a8761b38f1$var$createPattern(matcher, opts)
    );
    if (testString1 == null) return (testString, ri = false)=>{
        const returnIndex = typeof ri === 'boolean' ? ri : false;
        return $1a3a29a8761b38f1$var$matchPatterns(patterns, negatedGlobs, testString, returnIndex);
    };
    return $1a3a29a8761b38f1$var$matchPatterns(patterns, negatedGlobs, testString1, returnIndex1);
};
$1a3a29a8761b38f1$var$anymatch.default = $1a3a29a8761b38f1$var$anymatch;
module.exports = $1a3a29a8761b38f1$var$anymatch;

});
parcelRequire.register("kOgXJ", function(module, exports) {
/*!
 * normalize-path <https://github.com/jonschlinkert/normalize-path>
 *
 * Copyright (c) 2014-2018, Jon Schlinkert.
 * Released under the MIT License.
 */ module.exports = function(path, stripTrailing) {
    if (typeof path !== 'string') throw new TypeError('expected path to be a string');
    if (path === '\\' || path === '/') return '/';
    var len = path.length;
    if (len <= 1) return path;
    // ensure that win32 namespaces has two leading slashes, so that the path is
    // handled properly by the win32 version of path.parse() after being normalized
    // https://msdn.microsoft.com/library/windows/desktop/aa365247(v=vs.85).aspx#namespaces
    var prefix = '';
    if (len > 4 && path[3] === '\\') {
        var ch = path[2];
        if ((ch === '?' || ch === '.') && path.slice(0, 2) === '\\\\') {
            path = path.slice(2);
            prefix = '//';
        }
    }
    var segs = path.split(/[/\\]+/);
    if (stripTrailing !== false && segs[segs.length - 1] === '') segs.pop();
    return prefix + segs.join('/');
};

});


parcelRequire.register("lRRqt", function(module, exports) {
'use strict';



var $feb7fd83eca05edb$require$promisify = $igPDg$util.promisify;

var $hbrCf = parcelRequire("hbrCf");

var $58JuD = parcelRequire("58JuD");
var $feb7fd83eca05edb$require$isWindows = $58JuD.isWindows;
var $feb7fd83eca05edb$require$isLinux = $58JuD.isLinux;
var $feb7fd83eca05edb$require$EMPTY_FN = $58JuD.EMPTY_FN;
var $feb7fd83eca05edb$require$EMPTY_STR = $58JuD.EMPTY_STR;
var $feb7fd83eca05edb$require$KEY_LISTENERS = $58JuD.KEY_LISTENERS;
var $feb7fd83eca05edb$require$KEY_ERR = $58JuD.KEY_ERR;
var $feb7fd83eca05edb$require$KEY_RAW = $58JuD.KEY_RAW;
var $feb7fd83eca05edb$require$HANDLER_KEYS = $58JuD.HANDLER_KEYS;
var $feb7fd83eca05edb$require$EV_CHANGE = $58JuD.EV_CHANGE;
var $feb7fd83eca05edb$require$EV_ADD = $58JuD.EV_ADD;
var $feb7fd83eca05edb$require$EV_ADD_DIR = $58JuD.EV_ADD_DIR;
var $feb7fd83eca05edb$require$EV_ERROR = $58JuD.EV_ERROR;
var $feb7fd83eca05edb$require$STR_DATA = $58JuD.STR_DATA;
var $feb7fd83eca05edb$require$STR_END = $58JuD.STR_END;
var $feb7fd83eca05edb$require$BRACE_START = $58JuD.BRACE_START;
var $feb7fd83eca05edb$require$STAR = $58JuD.STAR;
const $feb7fd83eca05edb$var$THROTTLE_MODE_WATCH = 'watch';
const $feb7fd83eca05edb$var$open = $feb7fd83eca05edb$require$promisify($igPDg$fs.open);
const $feb7fd83eca05edb$var$stat = $feb7fd83eca05edb$require$promisify($igPDg$fs.stat);
const $feb7fd83eca05edb$var$lstat = $feb7fd83eca05edb$require$promisify($igPDg$fs.lstat);
const $feb7fd83eca05edb$var$close = $feb7fd83eca05edb$require$promisify($igPDg$fs.close);
const $feb7fd83eca05edb$var$fsrealpath = $feb7fd83eca05edb$require$promisify($igPDg$fs.realpath);
const $feb7fd83eca05edb$var$statMethods = {
    lstat: $feb7fd83eca05edb$var$lstat,
    stat: $feb7fd83eca05edb$var$stat
};
// TODO: emit errors properly. Example: EMFILE on Macos.
const $feb7fd83eca05edb$var$foreach = (val, fn)=>{
    if (val instanceof Set) val.forEach(fn);
    else fn(val);
};
const $feb7fd83eca05edb$var$addAndConvert = (main, prop, item)=>{
    let container = main[prop];
    if (!(container instanceof Set)) main[prop] = container = new Set([
        container
    ]);
    container.add(item);
};
const $feb7fd83eca05edb$var$clearItem = (cont)=>(key)=>{
        const set = cont[key];
        if (set instanceof Set) set.clear();
        else delete cont[key];
    }
;
const $feb7fd83eca05edb$var$delFromSet = (main, prop, item)=>{
    const container = main[prop];
    if (container instanceof Set) container.delete(item);
    else if (container === item) delete main[prop];
};
const $feb7fd83eca05edb$var$isEmptySet = (val)=>val instanceof Set ? val.size === 0 : !val
;
/**
 * @typedef {String} Path
 */ // fs_watch helpers
// object to hold per-process fs_watch instances
// (may be shared across chokidar FSWatcher instances)
/**
 * @typedef {Object} FsWatchContainer
 * @property {Set} listeners
 * @property {Set} errHandlers
 * @property {Set} rawEmitters
 * @property {fs.FSWatcher=} watcher
 * @property {Boolean=} watcherUnusable
 */ /**
 * @type {Map<String,FsWatchContainer>}
 */ const $feb7fd83eca05edb$var$FsWatchInstances = new Map();
/**
 * Instantiates the fs_watch interface
 * @param {String} path to be watched
 * @param {Object} options to be passed to fs_watch
 * @param {Function} listener main event handler
 * @param {Function} errHandler emits info about errors
 * @param {Function} emitRaw emits raw event data
 * @returns {fs.FSWatcher} new fsevents instance
 */ function $feb7fd83eca05edb$var$createFsWatchInstance(path, options, listener, errHandler, emitRaw) {
    const handleEvent = (rawEvent, evPath)=>{
        listener(path);
        emitRaw(rawEvent, evPath, {
            watchedPath: path
        });
        // emit based on events occurring for files from a directory's watcher in
        // case the file's watcher misses it (and rely on throttling to de-dupe)
        if (evPath && path !== evPath) $feb7fd83eca05edb$var$fsWatchBroadcast($igPDg$path.resolve(path, evPath), $feb7fd83eca05edb$require$KEY_LISTENERS, $igPDg$path.join(path, evPath));
    };
    try {
        return $igPDg$fs.watch(path, options, handleEvent);
    } catch (error) {
        errHandler(error);
    }
}
/**
 * Helper for passing fs_watch event data to a collection of listeners
 * @param {Path} fullPath absolute path bound to fs_watch instance
 * @param {String} type listener type
 * @param {*=} val1 arguments to be passed to listeners
 * @param {*=} val2
 * @param {*=} val3
 */ const $feb7fd83eca05edb$var$fsWatchBroadcast = (fullPath, type, val1, val2, val3)=>{
    const cont = $feb7fd83eca05edb$var$FsWatchInstances.get(fullPath);
    if (!cont) return;
    $feb7fd83eca05edb$var$foreach(cont[type], (listener)=>{
        listener(val1, val2, val3);
    });
};
/**
 * Instantiates the fs_watch interface or binds listeners
 * to an existing one covering the same file system entry
 * @param {String} path
 * @param {String} fullPath absolute path
 * @param {Object} options to be passed to fs_watch
 * @param {Object} handlers container for event listener functions
 */ const $feb7fd83eca05edb$var$setFsWatchListener = (path, fullPath, options, handlers)=>{
    const { listener: listener , errHandler: errHandler , rawEmitter: rawEmitter  } = handlers;
    let cont = $feb7fd83eca05edb$var$FsWatchInstances.get(fullPath);
    /** @type {fs.FSWatcher=} */ let watcher;
    if (!options.persistent) {
        watcher = $feb7fd83eca05edb$var$createFsWatchInstance(path, options, listener, errHandler, rawEmitter);
        return watcher.close.bind(watcher);
    }
    if (cont) {
        $feb7fd83eca05edb$var$addAndConvert(cont, $feb7fd83eca05edb$require$KEY_LISTENERS, listener);
        $feb7fd83eca05edb$var$addAndConvert(cont, $feb7fd83eca05edb$require$KEY_ERR, errHandler);
        $feb7fd83eca05edb$var$addAndConvert(cont, $feb7fd83eca05edb$require$KEY_RAW, rawEmitter);
    } else {
        watcher = $feb7fd83eca05edb$var$createFsWatchInstance(path, options, $feb7fd83eca05edb$var$fsWatchBroadcast.bind(null, fullPath, $feb7fd83eca05edb$require$KEY_LISTENERS), errHandler, $feb7fd83eca05edb$var$fsWatchBroadcast.bind(null, fullPath, $feb7fd83eca05edb$require$KEY_RAW));
        if (!watcher) return;
        watcher.on($feb7fd83eca05edb$require$EV_ERROR, async (error)=>{
            const broadcastErr = $feb7fd83eca05edb$var$fsWatchBroadcast.bind(null, fullPath, $feb7fd83eca05edb$require$KEY_ERR);
            cont.watcherUnusable = true; // documented since Node 10.4.1
            // Workaround for https://github.com/joyent/node/issues/4337
            if ($feb7fd83eca05edb$require$isWindows && error.code === 'EPERM') try {
                const fd = await $feb7fd83eca05edb$var$open(path, 'r');
                await $feb7fd83eca05edb$var$close(fd);
                broadcastErr(error);
            } catch (err) {
            }
            else broadcastErr(error);
        });
        cont = {
            listeners: listener,
            errHandlers: errHandler,
            rawEmitters: rawEmitter,
            watcher: watcher
        };
        $feb7fd83eca05edb$var$FsWatchInstances.set(fullPath, cont);
    }
    // const index = cont.listeners.indexOf(listener);
    // removes this instance's listeners and closes the underlying fs_watch
    // instance if there are no more listeners left
    return ()=>{
        $feb7fd83eca05edb$var$delFromSet(cont, $feb7fd83eca05edb$require$KEY_LISTENERS, listener);
        $feb7fd83eca05edb$var$delFromSet(cont, $feb7fd83eca05edb$require$KEY_ERR, errHandler);
        $feb7fd83eca05edb$var$delFromSet(cont, $feb7fd83eca05edb$require$KEY_RAW, rawEmitter);
        if ($feb7fd83eca05edb$var$isEmptySet(cont.listeners)) {
            // Check to protect against issue gh-730.
            // if (cont.watcherUnusable) {
            cont.watcher.close();
            // }
            $feb7fd83eca05edb$var$FsWatchInstances.delete(fullPath);
            $feb7fd83eca05edb$require$HANDLER_KEYS.forEach($feb7fd83eca05edb$var$clearItem(cont));
            cont.watcher = undefined;
            Object.freeze(cont);
        }
    };
};
// fs_watchFile helpers
// object to hold per-process fs_watchFile instances
// (may be shared across chokidar FSWatcher instances)
const $feb7fd83eca05edb$var$FsWatchFileInstances = new Map();
/**
 * Instantiates the fs_watchFile interface or binds listeners
 * to an existing one covering the same file system entry
 * @param {String} path to be watched
 * @param {String} fullPath absolute path
 * @param {Object} options options to be passed to fs_watchFile
 * @param {Object} handlers container for event listener functions
 * @returns {Function} closer
 */ const $feb7fd83eca05edb$var$setFsWatchFileListener = (path, fullPath, options, handlers)=>{
    const { listener: listener1 , rawEmitter: rawEmitter1  } = handlers;
    let cont = $feb7fd83eca05edb$var$FsWatchFileInstances.get(fullPath);
    /* eslint-disable no-unused-vars, prefer-destructuring */ let listeners = new Set();
    let rawEmitters = new Set();
    const copts = cont && cont.options;
    if (copts && (copts.persistent < options.persistent || copts.interval > options.interval)) {
        // "Upgrade" the watcher to persistence or a quicker interval.
        // This creates some unlikely edge case issues if the user mixes
        // settings in a very weird way, but solving for those cases
        // doesn't seem worthwhile for the added complexity.
        listeners = cont.listeners;
        rawEmitters = cont.rawEmitters;
        $igPDg$fs.unwatchFile(fullPath);
        cont = undefined;
    }
    /* eslint-enable no-unused-vars, prefer-destructuring */ if (cont) {
        $feb7fd83eca05edb$var$addAndConvert(cont, $feb7fd83eca05edb$require$KEY_LISTENERS, listener1);
        $feb7fd83eca05edb$var$addAndConvert(cont, $feb7fd83eca05edb$require$KEY_RAW, rawEmitter1);
    } else {
        // TODO
        // listeners.add(listener);
        // rawEmitters.add(rawEmitter);
        cont = {
            listeners: listener1,
            rawEmitters: rawEmitter1,
            options: options,
            watcher: $igPDg$fs.watchFile(fullPath, options, (curr, prev)=>{
                $feb7fd83eca05edb$var$foreach(cont.rawEmitters, (rawEmitter)=>{
                    rawEmitter($feb7fd83eca05edb$require$EV_CHANGE, fullPath, {
                        curr: curr,
                        prev: prev
                    });
                });
                const currmtime = curr.mtimeMs;
                if (curr.size !== prev.size || currmtime > prev.mtimeMs || currmtime === 0) $feb7fd83eca05edb$var$foreach(cont.listeners, (listener)=>listener(path, curr)
                );
            })
        };
        $feb7fd83eca05edb$var$FsWatchFileInstances.set(fullPath, cont);
    }
    // const index = cont.listeners.indexOf(listener);
    // Removes this instance's listeners and closes the underlying fs_watchFile
    // instance if there are no more listeners left.
    return ()=>{
        $feb7fd83eca05edb$var$delFromSet(cont, $feb7fd83eca05edb$require$KEY_LISTENERS, listener1);
        $feb7fd83eca05edb$var$delFromSet(cont, $feb7fd83eca05edb$require$KEY_RAW, rawEmitter1);
        if ($feb7fd83eca05edb$var$isEmptySet(cont.listeners)) {
            $feb7fd83eca05edb$var$FsWatchFileInstances.delete(fullPath);
            $igPDg$fs.unwatchFile(fullPath);
            cont.options = cont.watcher = undefined;
            Object.freeze(cont);
        }
    };
};
/**
 * @mixin
 */ class $feb7fd83eca05edb$var$NodeFsHandler {
    /**
 * @param {import("../index").FSWatcher} fsW
 */ constructor(fsW){
        this.fsw = fsW;
        this._boundHandleError = (error)=>fsW._handleError(error)
        ;
    }
    /**
 * Watch file for changes with fs_watchFile or fs_watch.
 * @param {String} path to file or dir
 * @param {Function} listener on fs change
 * @returns {Function} closer for the watcher instance
 */ _watchWithNodeFs(path1, listener) {
        const opts = this.fsw.options;
        const directory = $igPDg$path.dirname(path1);
        const basename = $igPDg$path.basename(path1);
        const parent = this.fsw._getWatchedDir(directory);
        parent.add(basename);
        const absolutePath = $igPDg$path.resolve(path1);
        const options = {
            persistent: opts.persistent
        };
        if (!listener) listener = $feb7fd83eca05edb$require$EMPTY_FN;
        let closer;
        if (opts.usePolling) {
            options.interval = opts.enableBinaryInterval && $hbrCf(basename) ? opts.binaryInterval : opts.interval;
            closer = $feb7fd83eca05edb$var$setFsWatchFileListener(path1, absolutePath, options, {
                listener: listener,
                rawEmitter: this.fsw._emitRaw
            });
        } else closer = $feb7fd83eca05edb$var$setFsWatchListener(path1, absolutePath, options, {
            listener: listener,
            errHandler: this._boundHandleError,
            rawEmitter: this.fsw._emitRaw
        });
        return closer;
    }
    /**
 * Watch a file and emit add event if warranted.
 * @param {Path} file Path
 * @param {fs.Stats} stats result of fs_stat
 * @param {Boolean} initialAdd was the file added at watch instantiation?
 * @returns {Function} closer for the watcher instance
 */ _handleFile(file, stats2, initialAdd) {
        if (this.fsw.closed) return;
        const dirname = $igPDg$path.dirname(file);
        const basename = $igPDg$path.basename(file);
        const parent = this.fsw._getWatchedDir(dirname);
        // stats is always present
        let prevStats = stats2;
        // if the file is already being watched, do nothing
        if (parent.has(basename)) return;
        const listener = async (path, newStats)=>{
            if (!this.fsw._throttle($feb7fd83eca05edb$var$THROTTLE_MODE_WATCH, file, 5)) return;
            if (!newStats || newStats.mtimeMs === 0) try {
                const newStats = await $feb7fd83eca05edb$var$stat(file);
                if (this.fsw.closed) return;
                // Check that change event was not fired because of changed only accessTime.
                const at = newStats.atimeMs;
                const mt = newStats.mtimeMs;
                if (!at || at <= mt || mt !== prevStats.mtimeMs) this.fsw._emit($feb7fd83eca05edb$require$EV_CHANGE, file, newStats);
                if ($feb7fd83eca05edb$require$isLinux && prevStats.ino !== newStats.ino) {
                    this.fsw._closeFile(path);
                    prevStats = newStats;
                    this.fsw._addPathCloser(path, this._watchWithNodeFs(file, listener));
                } else prevStats = newStats;
            } catch (error) {
                // Fix issues where mtime is null but file is still present
                this.fsw._remove(dirname, basename);
            }
            else if (parent.has(basename)) {
                // Check that change event was not fired because of changed only accessTime.
                const at = newStats.atimeMs;
                const mt = newStats.mtimeMs;
                if (!at || at <= mt || mt !== prevStats.mtimeMs) this.fsw._emit($feb7fd83eca05edb$require$EV_CHANGE, file, newStats);
                prevStats = newStats;
            }
        };
        // kick off the watcher
        const closer = this._watchWithNodeFs(file, listener);
        // emit an add event if we're supposed to
        if (!(initialAdd && this.fsw.options.ignoreInitial) && this.fsw._isntIgnored(file)) {
            if (!this.fsw._throttle($feb7fd83eca05edb$require$EV_ADD, file, 0)) return;
            this.fsw._emit($feb7fd83eca05edb$require$EV_ADD, file, stats2);
        }
        return closer;
    }
    /**
 * Handle symlinks encountered while reading a dir.
 * @param {Object} entry returned by readdirp
 * @param {String} directory path of dir being read
 * @param {String} path of this item
 * @param {String} item basename of this item
 * @returns {Promise<Boolean>} true if no more processing is needed for this entry.
 */ async _handleSymlink(entry1, directory, path2, item1) {
        if (this.fsw.closed) return;
        const full = entry1.fullPath;
        const dir = this.fsw._getWatchedDir(directory);
        if (!this.fsw.options.followSymlinks) {
            // watch symlink directly (don't follow) and detect changes
            this.fsw._incrReadyCount();
            const linkPath = await $feb7fd83eca05edb$var$fsrealpath(path2);
            if (this.fsw.closed) return;
            if (dir.has(item1)) {
                if (this.fsw._symlinkPaths.get(full) !== linkPath) {
                    this.fsw._symlinkPaths.set(full, linkPath);
                    this.fsw._emit($feb7fd83eca05edb$require$EV_CHANGE, path2, entry1.stats);
                }
            } else {
                dir.add(item1);
                this.fsw._symlinkPaths.set(full, linkPath);
                this.fsw._emit($feb7fd83eca05edb$require$EV_ADD, path2, entry1.stats);
            }
            this.fsw._emitReady();
            return true;
        }
        // don't follow the same symlink more than once
        if (this.fsw._symlinkPaths.has(full)) return true;
        this.fsw._symlinkPaths.set(full, true);
    }
    _handleRead(directory1, initialAdd1, wh, target, dir, depth, throttler) {
        // Normalize the directory name on Windows
        directory1 = $igPDg$path.join(directory1, $feb7fd83eca05edb$require$EMPTY_STR);
        if (!wh.hasGlob) {
            throttler = this.fsw._throttle('readdir', directory1, 1000);
            if (!throttler) return;
        }
        const previous = this.fsw._getWatchedDir(wh.path);
        const current = new Set();
        let stream = this.fsw._readdirp(directory1, {
            fileFilter: (entry)=>wh.filterPath(entry)
            ,
            directoryFilter: (entry)=>wh.filterDir(entry)
            ,
            depth: 0
        }).on($feb7fd83eca05edb$require$STR_DATA, async (entry)=>{
            if (this.fsw.closed) {
                stream = undefined;
                return;
            }
            const item = entry.path;
            let path = $igPDg$path.join(directory1, item);
            current.add(item);
            if (entry.stats.isSymbolicLink() && await this._handleSymlink(entry, directory1, path, item)) return;
            if (this.fsw.closed) {
                stream = undefined;
                return;
            }
            // Files that present in current directory snapshot
            // but absent in previous are added to watch list and
            // emit `add` event.
            if (item === target || !target && !previous.has(item)) {
                this.fsw._incrReadyCount();
                // ensure relativeness of path is preserved in case of watcher reuse
                path = $igPDg$path.join(dir, $igPDg$path.relative(dir, path));
                this._addToNodeFs(path, initialAdd1, wh, depth + 1);
            }
        }).on($feb7fd83eca05edb$require$EV_ERROR, this._boundHandleError);
        return new Promise((resolve)=>stream.once($feb7fd83eca05edb$require$STR_END, ()=>{
                if (this.fsw.closed) {
                    stream = undefined;
                    return;
                }
                const wasThrottled = throttler ? throttler.clear() : false;
                resolve();
                // Files that absent in current directory snapshot
                // but present in previous emit `remove` event
                // and are removed from @watched[directory].
                previous.getChildren().filter((item)=>{
                    return item !== directory1 && !current.has(item) && (!wh.hasGlob || wh.filterPath({
                        fullPath: $igPDg$path.resolve(directory1, item)
                    }));
                }).forEach((item)=>{
                    this.fsw._remove(directory1, item);
                });
                stream = undefined;
                // one more time for any missed in case changes came in extremely quickly
                if (wasThrottled) this._handleRead(directory1, false, wh, target, dir, depth, throttler);
            })
        );
    }
    /**
 * Read directory to add / remove files from `@watched` list and re-read it on change.
 * @param {String} dir fs path
 * @param {fs.Stats} stats
 * @param {Boolean} initialAdd
 * @param {Number} depth relative to user-supplied path
 * @param {String} target child path targeted for watch
 * @param {Object} wh Common watch helpers for this path
 * @param {String} realpath
 * @returns {Promise<Function>} closer for the watcher instance.
 */ async _handleDir(dir1, stats1, initialAdd2, depth1, target1, wh1, realpath) {
        const parentDir = this.fsw._getWatchedDir($igPDg$path.dirname(dir1));
        const tracked = parentDir.has($igPDg$path.basename(dir1));
        if (!(initialAdd2 && this.fsw.options.ignoreInitial) && !target1 && !tracked) {
            if (!wh1.hasGlob || wh1.globFilter(dir1)) this.fsw._emit($feb7fd83eca05edb$require$EV_ADD_DIR, dir1, stats1);
        }
        // ensure dir is tracked (harmless if redundant)
        parentDir.add($igPDg$path.basename(dir1));
        this.fsw._getWatchedDir(dir1);
        let throttler;
        let closer;
        const oDepth = this.fsw.options.depth;
        if ((oDepth == null || depth1 <= oDepth) && !this.fsw._symlinkPaths.has(realpath)) {
            if (!target1) {
                await this._handleRead(dir1, initialAdd2, wh1, target1, dir1, depth1, throttler);
                if (this.fsw.closed) return;
            }
            closer = this._watchWithNodeFs(dir1, (dirPath, stats)=>{
                // if current directory is removed, do nothing
                if (stats && stats.mtimeMs === 0) return;
                this._handleRead(dirPath, false, wh1, target1, dir1, depth1, throttler);
            });
        }
        return closer;
    }
    /**
 * Handle added file, directory, or glob pattern.
 * Delegates call to _handleFile / _handleDir after checks.
 * @param {String} path to file or ir
 * @param {Boolean} initialAdd was the file added at watch instantiation?
 * @param {Object} priorWh depth relative to user-supplied path
 * @param {Number} depth Child path actually targeted for watch
 * @param {String=} target Child path actually targeted for watch
 * @returns {Promise}
 */ async _addToNodeFs(path, initialAdd3, priorWh, depth2, target2) {
        const ready = this.fsw._emitReady;
        if (this.fsw._isIgnored(path) || this.fsw.closed) {
            ready();
            return false;
        }
        const wh = this.fsw._getWatchHelpers(path, depth2);
        if (!wh.hasGlob && priorWh) {
            wh.hasGlob = priorWh.hasGlob;
            wh.globFilter = priorWh.globFilter;
            wh.filterPath = (entry)=>priorWh.filterPath(entry)
            ;
            wh.filterDir = (entry)=>priorWh.filterDir(entry)
            ;
        }
        // evaluate what is at the path we're being asked to watch
        try {
            const stats = await $feb7fd83eca05edb$var$statMethods[wh.statMethod](wh.watchPath);
            if (this.fsw.closed) return;
            if (this.fsw._isIgnored(wh.watchPath, stats)) {
                ready();
                return false;
            }
            const follow = this.fsw.options.followSymlinks && !path.includes($feb7fd83eca05edb$require$STAR) && !path.includes($feb7fd83eca05edb$require$BRACE_START);
            let closer;
            if (stats.isDirectory()) {
                const absPath = $igPDg$path.resolve(path);
                const targetPath = follow ? await $feb7fd83eca05edb$var$fsrealpath(path) : path;
                if (this.fsw.closed) return;
                closer = await this._handleDir(wh.watchPath, stats, initialAdd3, depth2, target2, wh, targetPath);
                if (this.fsw.closed) return;
                // preserve this symlink's target path
                if (absPath !== targetPath && targetPath !== undefined) this.fsw._symlinkPaths.set(absPath, targetPath);
            } else if (stats.isSymbolicLink()) {
                const targetPath = follow ? await $feb7fd83eca05edb$var$fsrealpath(path) : path;
                if (this.fsw.closed) return;
                const parent = $igPDg$path.dirname(wh.watchPath);
                this.fsw._getWatchedDir(parent).add(wh.watchPath);
                this.fsw._emit($feb7fd83eca05edb$require$EV_ADD, wh.watchPath, stats);
                closer = await this._handleDir(parent, stats, initialAdd3, depth2, path, wh, targetPath);
                if (this.fsw.closed) return;
                // preserve this symlink's target path
                if (targetPath !== undefined) this.fsw._symlinkPaths.set($igPDg$path.resolve(path), targetPath);
            } else closer = this._handleFile(wh.watchPath, stats, initialAdd3);
            ready();
            this.fsw._addPathCloser(path, closer);
            return false;
        } catch (error) {
            if (this.fsw._handleError(error)) {
                ready();
                return path;
            }
        }
    }
}
module.exports = $feb7fd83eca05edb$var$NodeFsHandler;

});
parcelRequire.register("hbrCf", function(module, exports) {
'use strict';


var $5neHs = parcelRequire("5neHs");
const $c828e2aae6004372$var$extensions = new Set($5neHs);
module.exports = (filePath)=>$c828e2aae6004372$var$extensions.has($igPDg$path.extname(filePath).slice(1).toLowerCase())
;

});
parcelRequire.register("5neHs", function(module, exports) {

module.exports = (parcelRequire("b8vJh"));

});
parcelRequire.register("b8vJh", function(module, exports) {
module.exports = JSON.parse("[\"3dm\",\"3ds\",\"3g2\",\"3gp\",\"7z\",\"a\",\"aac\",\"adp\",\"ai\",\"aif\",\"aiff\",\"alz\",\"ape\",\"apk\",\"appimage\",\"ar\",\"arj\",\"asf\",\"au\",\"avi\",\"bak\",\"baml\",\"bh\",\"bin\",\"bk\",\"bmp\",\"btif\",\"bz2\",\"bzip2\",\"cab\",\"caf\",\"cgm\",\"class\",\"cmx\",\"cpio\",\"cr2\",\"cur\",\"dat\",\"dcm\",\"deb\",\"dex\",\"djvu\",\"dll\",\"dmg\",\"dng\",\"doc\",\"docm\",\"docx\",\"dot\",\"dotm\",\"dra\",\"DS_Store\",\"dsk\",\"dts\",\"dtshd\",\"dvb\",\"dwg\",\"dxf\",\"ecelp4800\",\"ecelp7470\",\"ecelp9600\",\"egg\",\"eol\",\"eot\",\"epub\",\"exe\",\"f4v\",\"fbs\",\"fh\",\"fla\",\"flac\",\"flatpak\",\"fli\",\"flv\",\"fpx\",\"fst\",\"fvt\",\"g3\",\"gh\",\"gif\",\"graffle\",\"gz\",\"gzip\",\"h261\",\"h263\",\"h264\",\"icns\",\"ico\",\"ief\",\"img\",\"ipa\",\"iso\",\"jar\",\"jpeg\",\"jpg\",\"jpgv\",\"jpm\",\"jxr\",\"key\",\"ktx\",\"lha\",\"lib\",\"lvp\",\"lz\",\"lzh\",\"lzma\",\"lzo\",\"m3u\",\"m4a\",\"m4v\",\"mar\",\"mdi\",\"mht\",\"mid\",\"midi\",\"mj2\",\"mka\",\"mkv\",\"mmr\",\"mng\",\"mobi\",\"mov\",\"movie\",\"mp3\",\"mp4\",\"mp4a\",\"mpeg\",\"mpg\",\"mpga\",\"mxu\",\"nef\",\"npx\",\"numbers\",\"nupkg\",\"o\",\"odp\",\"ods\",\"odt\",\"oga\",\"ogg\",\"ogv\",\"otf\",\"ott\",\"pages\",\"pbm\",\"pcx\",\"pdb\",\"pdf\",\"pea\",\"pgm\",\"pic\",\"png\",\"pnm\",\"pot\",\"potm\",\"potx\",\"ppa\",\"ppam\",\"ppm\",\"pps\",\"ppsm\",\"ppsx\",\"ppt\",\"pptm\",\"pptx\",\"psd\",\"pya\",\"pyc\",\"pyo\",\"pyv\",\"qt\",\"rar\",\"ras\",\"raw\",\"resources\",\"rgb\",\"rip\",\"rlc\",\"rmf\",\"rmvb\",\"rpm\",\"rtf\",\"rz\",\"s3m\",\"s7z\",\"scpt\",\"sgi\",\"shar\",\"snap\",\"sil\",\"sketch\",\"slk\",\"smv\",\"snk\",\"so\",\"stl\",\"suo\",\"sub\",\"swf\",\"tar\",\"tbz\",\"tbz2\",\"tga\",\"tgz\",\"thmx\",\"tif\",\"tiff\",\"tlz\",\"ttc\",\"ttf\",\"txz\",\"udf\",\"uvh\",\"uvi\",\"uvm\",\"uvp\",\"uvs\",\"uvu\",\"viv\",\"vob\",\"war\",\"wav\",\"wax\",\"wbmp\",\"wdp\",\"weba\",\"webm\",\"webp\",\"whl\",\"wim\",\"wm\",\"wma\",\"wmv\",\"wmx\",\"woff\",\"woff2\",\"wrm\",\"wvx\",\"xbm\",\"xif\",\"xla\",\"xlam\",\"xls\",\"xlsb\",\"xlsm\",\"xlsx\",\"xlt\",\"xltm\",\"xltx\",\"xm\",\"xmind\",\"xpi\",\"xpm\",\"xwd\",\"xz\",\"z\",\"zip\",\"zipx\"]");

});



parcelRequire.register("58JuD", function(module, exports) {

$parcel$export(module.exports, "EV_ALL", () => $3be0fd1c6e48e5d1$export$6491a90e82d3f6e2, (v) => $3be0fd1c6e48e5d1$export$6491a90e82d3f6e2 = v);
$parcel$export(module.exports, "EV_READY", () => $3be0fd1c6e48e5d1$export$c20c948702454b1, (v) => $3be0fd1c6e48e5d1$export$c20c948702454b1 = v);
$parcel$export(module.exports, "EV_ADD", () => $3be0fd1c6e48e5d1$export$d4cf4f0ec78d3f17, (v) => $3be0fd1c6e48e5d1$export$d4cf4f0ec78d3f17 = v);
$parcel$export(module.exports, "EV_CHANGE", () => $3be0fd1c6e48e5d1$export$6e3f652cbb5d98e2, (v) => $3be0fd1c6e48e5d1$export$6e3f652cbb5d98e2 = v);
$parcel$export(module.exports, "EV_ADD_DIR", () => $3be0fd1c6e48e5d1$export$31800c7594dcd37a, (v) => $3be0fd1c6e48e5d1$export$31800c7594dcd37a = v);
$parcel$export(module.exports, "EV_UNLINK", () => $3be0fd1c6e48e5d1$export$22dd8604f73cbb12, (v) => $3be0fd1c6e48e5d1$export$22dd8604f73cbb12 = v);
$parcel$export(module.exports, "EV_UNLINK_DIR", () => $3be0fd1c6e48e5d1$export$9f82b41f28be31bb, (v) => $3be0fd1c6e48e5d1$export$9f82b41f28be31bb = v);
$parcel$export(module.exports, "EV_RAW", () => $3be0fd1c6e48e5d1$export$12331996dce12ba4, (v) => $3be0fd1c6e48e5d1$export$12331996dce12ba4 = v);
$parcel$export(module.exports, "EV_ERROR", () => $3be0fd1c6e48e5d1$export$6ecfa1375af86312, (v) => $3be0fd1c6e48e5d1$export$6ecfa1375af86312 = v);
$parcel$export(module.exports, "STR_DATA", () => $3be0fd1c6e48e5d1$export$a394330384aa256c, (v) => $3be0fd1c6e48e5d1$export$a394330384aa256c = v);
$parcel$export(module.exports, "STR_END", () => $3be0fd1c6e48e5d1$export$89b8a9d6a3fcbda4, (v) => $3be0fd1c6e48e5d1$export$89b8a9d6a3fcbda4 = v);
$parcel$export(module.exports, "STR_CLOSE", () => $3be0fd1c6e48e5d1$export$fa894ca5e7ebfb7f, (v) => $3be0fd1c6e48e5d1$export$fa894ca5e7ebfb7f = v);
$parcel$export(module.exports, "FSEVENT_CREATED", () => $3be0fd1c6e48e5d1$export$d3616578c85a0ce6, (v) => $3be0fd1c6e48e5d1$export$d3616578c85a0ce6 = v);
$parcel$export(module.exports, "FSEVENT_MODIFIED", () => $3be0fd1c6e48e5d1$export$e2c555f8bd399bc0, (v) => $3be0fd1c6e48e5d1$export$e2c555f8bd399bc0 = v);
$parcel$export(module.exports, "FSEVENT_DELETED", () => $3be0fd1c6e48e5d1$export$a0b169ab89fb4dd5, (v) => $3be0fd1c6e48e5d1$export$a0b169ab89fb4dd5 = v);
$parcel$export(module.exports, "FSEVENT_MOVED", () => $3be0fd1c6e48e5d1$export$57e12204d17739a6, (v) => $3be0fd1c6e48e5d1$export$57e12204d17739a6 = v);
$parcel$export(module.exports, "FSEVENT_UNKNOWN", () => $3be0fd1c6e48e5d1$export$5e66a1c305e8c898, (v) => $3be0fd1c6e48e5d1$export$5e66a1c305e8c898 = v);
$parcel$export(module.exports, "FSEVENT_TYPE_FILE", () => $3be0fd1c6e48e5d1$export$ef83f7bc565d8f47, (v) => $3be0fd1c6e48e5d1$export$ef83f7bc565d8f47 = v);
$parcel$export(module.exports, "FSEVENT_TYPE_DIRECTORY", () => $3be0fd1c6e48e5d1$export$a98e8a5440bcaa5f, (v) => $3be0fd1c6e48e5d1$export$a98e8a5440bcaa5f = v);
$parcel$export(module.exports, "FSEVENT_TYPE_SYMLINK", () => $3be0fd1c6e48e5d1$export$561ec8349f2cc2df, (v) => $3be0fd1c6e48e5d1$export$561ec8349f2cc2df = v);
$parcel$export(module.exports, "KEY_LISTENERS", () => $3be0fd1c6e48e5d1$export$4db44f0d1d1cfa26, (v) => $3be0fd1c6e48e5d1$export$4db44f0d1d1cfa26 = v);
$parcel$export(module.exports, "KEY_ERR", () => $3be0fd1c6e48e5d1$export$fefac369170ac325, (v) => $3be0fd1c6e48e5d1$export$fefac369170ac325 = v);
$parcel$export(module.exports, "KEY_RAW", () => $3be0fd1c6e48e5d1$export$873fba16aad13afe, (v) => $3be0fd1c6e48e5d1$export$873fba16aad13afe = v);
$parcel$export(module.exports, "HANDLER_KEYS", () => $3be0fd1c6e48e5d1$export$4889786fd095a6bd, (v) => $3be0fd1c6e48e5d1$export$4889786fd095a6bd = v);
$parcel$export(module.exports, "DOT_SLASH", () => $3be0fd1c6e48e5d1$export$2b445e5c2be2faf0, (v) => $3be0fd1c6e48e5d1$export$2b445e5c2be2faf0 = v);
$parcel$export(module.exports, "BACK_SLASH_RE", () => $3be0fd1c6e48e5d1$export$f7eeff508862a005, (v) => $3be0fd1c6e48e5d1$export$f7eeff508862a005 = v);
$parcel$export(module.exports, "DOUBLE_SLASH_RE", () => $3be0fd1c6e48e5d1$export$608d5545eedd1728, (v) => $3be0fd1c6e48e5d1$export$608d5545eedd1728 = v);
$parcel$export(module.exports, "SLASH_OR_BACK_SLASH_RE", () => $3be0fd1c6e48e5d1$export$c33b7f744dba3152, (v) => $3be0fd1c6e48e5d1$export$c33b7f744dba3152 = v);
$parcel$export(module.exports, "DOT_RE", () => $3be0fd1c6e48e5d1$export$be0c82dadca9dc5e, (v) => $3be0fd1c6e48e5d1$export$be0c82dadca9dc5e = v);
$parcel$export(module.exports, "REPLACER_RE", () => $3be0fd1c6e48e5d1$export$958236a95b4186ff, (v) => $3be0fd1c6e48e5d1$export$958236a95b4186ff = v);
$parcel$export(module.exports, "SLASH", () => $3be0fd1c6e48e5d1$export$98238152dfccf046, (v) => $3be0fd1c6e48e5d1$export$98238152dfccf046 = v);
$parcel$export(module.exports, "SLASH_SLASH", () => $3be0fd1c6e48e5d1$export$11d7cc41d12b28b6, (v) => $3be0fd1c6e48e5d1$export$11d7cc41d12b28b6 = v);
$parcel$export(module.exports, "BRACE_START", () => $3be0fd1c6e48e5d1$export$4f673f14d1ecee2f, (v) => $3be0fd1c6e48e5d1$export$4f673f14d1ecee2f = v);
$parcel$export(module.exports, "BANG", () => $3be0fd1c6e48e5d1$export$24168a3ade45a8d6, (v) => $3be0fd1c6e48e5d1$export$24168a3ade45a8d6 = v);
$parcel$export(module.exports, "ONE_DOT", () => $3be0fd1c6e48e5d1$export$99063ccd25c1359b, (v) => $3be0fd1c6e48e5d1$export$99063ccd25c1359b = v);
$parcel$export(module.exports, "TWO_DOTS", () => $3be0fd1c6e48e5d1$export$c7fdb0d725f43a48, (v) => $3be0fd1c6e48e5d1$export$c7fdb0d725f43a48 = v);
$parcel$export(module.exports, "STAR", () => $3be0fd1c6e48e5d1$export$54408be40394d82a, (v) => $3be0fd1c6e48e5d1$export$54408be40394d82a = v);
$parcel$export(module.exports, "GLOBSTAR", () => $3be0fd1c6e48e5d1$export$6c01ffe652e570ac, (v) => $3be0fd1c6e48e5d1$export$6c01ffe652e570ac = v);
$parcel$export(module.exports, "ROOT_GLOBSTAR", () => $3be0fd1c6e48e5d1$export$7aea8b2438ebc8a7, (v) => $3be0fd1c6e48e5d1$export$7aea8b2438ebc8a7 = v);
$parcel$export(module.exports, "SLASH_GLOBSTAR", () => $3be0fd1c6e48e5d1$export$89716fde9dc0b6f1, (v) => $3be0fd1c6e48e5d1$export$89716fde9dc0b6f1 = v);
$parcel$export(module.exports, "DIR_SUFFIX", () => $3be0fd1c6e48e5d1$export$b11c62ecc8345d0e, (v) => $3be0fd1c6e48e5d1$export$b11c62ecc8345d0e = v);
$parcel$export(module.exports, "ANYMATCH_OPTS", () => $3be0fd1c6e48e5d1$export$9a6845f2b109ea23, (v) => $3be0fd1c6e48e5d1$export$9a6845f2b109ea23 = v);
$parcel$export(module.exports, "STRING_TYPE", () => $3be0fd1c6e48e5d1$export$c65418d6b95dbf88, (v) => $3be0fd1c6e48e5d1$export$c65418d6b95dbf88 = v);
$parcel$export(module.exports, "FUNCTION_TYPE", () => $3be0fd1c6e48e5d1$export$31a3bc04c4494acf, (v) => $3be0fd1c6e48e5d1$export$31a3bc04c4494acf = v);
$parcel$export(module.exports, "EMPTY_STR", () => $3be0fd1c6e48e5d1$export$8814a5b46a5894e7, (v) => $3be0fd1c6e48e5d1$export$8814a5b46a5894e7 = v);
$parcel$export(module.exports, "EMPTY_FN", () => $3be0fd1c6e48e5d1$export$ca975a673560c9f5, (v) => $3be0fd1c6e48e5d1$export$ca975a673560c9f5 = v);
$parcel$export(module.exports, "IDENTITY_FN", () => $3be0fd1c6e48e5d1$export$90ac18bb05d4efdc, (v) => $3be0fd1c6e48e5d1$export$90ac18bb05d4efdc = v);
$parcel$export(module.exports, "isWindows", () => $3be0fd1c6e48e5d1$export$f993c945890e93ba, (v) => $3be0fd1c6e48e5d1$export$f993c945890e93ba = v);
$parcel$export(module.exports, "isMacos", () => $3be0fd1c6e48e5d1$export$527179d397a2edf8, (v) => $3be0fd1c6e48e5d1$export$527179d397a2edf8 = v);
$parcel$export(module.exports, "isLinux", () => $3be0fd1c6e48e5d1$export$a10d59b01729022b, (v) => $3be0fd1c6e48e5d1$export$a10d59b01729022b = v);
$parcel$export(module.exports, "isIBMi", () => $3be0fd1c6e48e5d1$export$18a17cfedf1cbd16, (v) => $3be0fd1c6e48e5d1$export$18a17cfedf1cbd16 = v);
var $3be0fd1c6e48e5d1$export$6491a90e82d3f6e2;
var $3be0fd1c6e48e5d1$export$c20c948702454b1;
var $3be0fd1c6e48e5d1$export$d4cf4f0ec78d3f17;
var $3be0fd1c6e48e5d1$export$6e3f652cbb5d98e2;
var $3be0fd1c6e48e5d1$export$31800c7594dcd37a;
var $3be0fd1c6e48e5d1$export$22dd8604f73cbb12;
var $3be0fd1c6e48e5d1$export$9f82b41f28be31bb;
var $3be0fd1c6e48e5d1$export$12331996dce12ba4;
var $3be0fd1c6e48e5d1$export$6ecfa1375af86312;
var $3be0fd1c6e48e5d1$export$a394330384aa256c;
var $3be0fd1c6e48e5d1$export$89b8a9d6a3fcbda4;
var $3be0fd1c6e48e5d1$export$fa894ca5e7ebfb7f;
var $3be0fd1c6e48e5d1$export$d3616578c85a0ce6;
var $3be0fd1c6e48e5d1$export$e2c555f8bd399bc0;
var $3be0fd1c6e48e5d1$export$a0b169ab89fb4dd5;
var $3be0fd1c6e48e5d1$export$57e12204d17739a6;
var $3be0fd1c6e48e5d1$export$5b2fb8531de5302e;
var $3be0fd1c6e48e5d1$export$5e66a1c305e8c898;
var $3be0fd1c6e48e5d1$export$ef83f7bc565d8f47;
var $3be0fd1c6e48e5d1$export$a98e8a5440bcaa5f;
var $3be0fd1c6e48e5d1$export$561ec8349f2cc2df;
var $3be0fd1c6e48e5d1$export$4db44f0d1d1cfa26;
var $3be0fd1c6e48e5d1$export$fefac369170ac325;
var $3be0fd1c6e48e5d1$export$873fba16aad13afe;
var $3be0fd1c6e48e5d1$export$4889786fd095a6bd;
var $3be0fd1c6e48e5d1$export$2b445e5c2be2faf0;
var $3be0fd1c6e48e5d1$export$f7eeff508862a005;
var $3be0fd1c6e48e5d1$export$608d5545eedd1728;
var $3be0fd1c6e48e5d1$export$c33b7f744dba3152;
var $3be0fd1c6e48e5d1$export$be0c82dadca9dc5e;
var $3be0fd1c6e48e5d1$export$958236a95b4186ff;
var $3be0fd1c6e48e5d1$export$98238152dfccf046;
var $3be0fd1c6e48e5d1$export$11d7cc41d12b28b6;
var $3be0fd1c6e48e5d1$export$4f673f14d1ecee2f;
var $3be0fd1c6e48e5d1$export$24168a3ade45a8d6;
var $3be0fd1c6e48e5d1$export$99063ccd25c1359b;
var $3be0fd1c6e48e5d1$export$c7fdb0d725f43a48;
var $3be0fd1c6e48e5d1$export$54408be40394d82a;
var $3be0fd1c6e48e5d1$export$6c01ffe652e570ac;
var $3be0fd1c6e48e5d1$export$7aea8b2438ebc8a7;
var $3be0fd1c6e48e5d1$export$89716fde9dc0b6f1;
var $3be0fd1c6e48e5d1$export$b11c62ecc8345d0e;
var $3be0fd1c6e48e5d1$export$9a6845f2b109ea23;
var $3be0fd1c6e48e5d1$export$c65418d6b95dbf88;
var $3be0fd1c6e48e5d1$export$31a3bc04c4494acf;
var $3be0fd1c6e48e5d1$export$8814a5b46a5894e7;
var $3be0fd1c6e48e5d1$export$ca975a673560c9f5;
var $3be0fd1c6e48e5d1$export$90ac18bb05d4efdc;
var $3be0fd1c6e48e5d1$export$f993c945890e93ba;
var $3be0fd1c6e48e5d1$export$527179d397a2edf8;
var $3be0fd1c6e48e5d1$export$a10d59b01729022b;
var $3be0fd1c6e48e5d1$export$18a17cfedf1cbd16;
'use strict';

var $3be0fd1c6e48e5d1$require$sep = $igPDg$path.sep;
const { platform: $3be0fd1c6e48e5d1$var$platform  } = process;

$3be0fd1c6e48e5d1$export$6491a90e82d3f6e2 = 'all';
$3be0fd1c6e48e5d1$export$c20c948702454b1 = 'ready';
$3be0fd1c6e48e5d1$export$d4cf4f0ec78d3f17 = 'add';
$3be0fd1c6e48e5d1$export$6e3f652cbb5d98e2 = 'change';
$3be0fd1c6e48e5d1$export$31800c7594dcd37a = 'addDir';
$3be0fd1c6e48e5d1$export$22dd8604f73cbb12 = 'unlink';
$3be0fd1c6e48e5d1$export$9f82b41f28be31bb = 'unlinkDir';
$3be0fd1c6e48e5d1$export$12331996dce12ba4 = 'raw';
$3be0fd1c6e48e5d1$export$6ecfa1375af86312 = 'error';
$3be0fd1c6e48e5d1$export$a394330384aa256c = 'data';
$3be0fd1c6e48e5d1$export$89b8a9d6a3fcbda4 = 'end';
$3be0fd1c6e48e5d1$export$fa894ca5e7ebfb7f = 'close';
$3be0fd1c6e48e5d1$export$d3616578c85a0ce6 = 'created';
$3be0fd1c6e48e5d1$export$e2c555f8bd399bc0 = 'modified';
$3be0fd1c6e48e5d1$export$a0b169ab89fb4dd5 = 'deleted';
$3be0fd1c6e48e5d1$export$57e12204d17739a6 = 'moved';
$3be0fd1c6e48e5d1$export$5b2fb8531de5302e = 'cloned';
$3be0fd1c6e48e5d1$export$5e66a1c305e8c898 = 'unknown';
$3be0fd1c6e48e5d1$export$ef83f7bc565d8f47 = 'file';
$3be0fd1c6e48e5d1$export$a98e8a5440bcaa5f = 'directory';
$3be0fd1c6e48e5d1$export$561ec8349f2cc2df = 'symlink';
$3be0fd1c6e48e5d1$export$4db44f0d1d1cfa26 = 'listeners';
$3be0fd1c6e48e5d1$export$fefac369170ac325 = 'errHandlers';
$3be0fd1c6e48e5d1$export$873fba16aad13afe = 'rawEmitters';
$3be0fd1c6e48e5d1$export$4889786fd095a6bd = [
    $3be0fd1c6e48e5d1$export$4db44f0d1d1cfa26,
    $3be0fd1c6e48e5d1$export$fefac369170ac325,
    $3be0fd1c6e48e5d1$export$873fba16aad13afe
];
$3be0fd1c6e48e5d1$export$2b445e5c2be2faf0 = `.${$3be0fd1c6e48e5d1$require$sep}`;
$3be0fd1c6e48e5d1$export$f7eeff508862a005 = /\\/g;
$3be0fd1c6e48e5d1$export$608d5545eedd1728 = /\/\//;
$3be0fd1c6e48e5d1$export$c33b7f744dba3152 = /[/\\]/;
$3be0fd1c6e48e5d1$export$be0c82dadca9dc5e = /\..*\.(sw[px])$|~$|\.subl.*\.tmp/;
$3be0fd1c6e48e5d1$export$958236a95b4186ff = /^\.[/\\]/;
$3be0fd1c6e48e5d1$export$98238152dfccf046 = '/';
$3be0fd1c6e48e5d1$export$11d7cc41d12b28b6 = '//';
$3be0fd1c6e48e5d1$export$4f673f14d1ecee2f = '{';
$3be0fd1c6e48e5d1$export$24168a3ade45a8d6 = '!';
$3be0fd1c6e48e5d1$export$99063ccd25c1359b = '.';
$3be0fd1c6e48e5d1$export$c7fdb0d725f43a48 = '..';
$3be0fd1c6e48e5d1$export$54408be40394d82a = '*';
$3be0fd1c6e48e5d1$export$6c01ffe652e570ac = '**';
$3be0fd1c6e48e5d1$export$7aea8b2438ebc8a7 = '/**/*';
$3be0fd1c6e48e5d1$export$89716fde9dc0b6f1 = '/**';
$3be0fd1c6e48e5d1$export$b11c62ecc8345d0e = 'Dir';
$3be0fd1c6e48e5d1$export$9a6845f2b109ea23 = {
    dot: true
};
$3be0fd1c6e48e5d1$export$c65418d6b95dbf88 = 'string';
$3be0fd1c6e48e5d1$export$31a3bc04c4494acf = 'function';
$3be0fd1c6e48e5d1$export$8814a5b46a5894e7 = '';
$3be0fd1c6e48e5d1$export$ca975a673560c9f5 = ()=>{
};
$3be0fd1c6e48e5d1$export$90ac18bb05d4efdc = (val)=>val
;
$3be0fd1c6e48e5d1$export$f993c945890e93ba = $3be0fd1c6e48e5d1$var$platform === 'win32';
$3be0fd1c6e48e5d1$export$527179d397a2edf8 = $3be0fd1c6e48e5d1$var$platform === 'darwin';
$3be0fd1c6e48e5d1$export$a10d59b01729022b = $3be0fd1c6e48e5d1$var$platform === 'linux';
$3be0fd1c6e48e5d1$export$18a17cfedf1cbd16 = $igPDg$os.type() === 'OS400';

});


parcelRequire.register("flPL2", function(module, exports) {
'use strict';



var $b2d0f731fef49674$require$promisify = $igPDg$util.promisify;
let $b2d0f731fef49674$var$fsevents;

try {
    $b2d0f731fef49674$var$fsevents = $b2d0f731fef49674$import$1b677c79ff663f59;
} catch (error) {
    if (process.env.CHOKIDAR_PRINT_FSEVENTS_REQUIRE_ERROR) console.error(error);
}
if ($b2d0f731fef49674$var$fsevents) {
    // TODO: real check
    const mtch = process.version.match(/v(\d+)\.(\d+)/);
    if (mtch && mtch[1] && mtch[2]) {
        const maj = Number.parseInt(mtch[1], 10);
        const min = Number.parseInt(mtch[2], 10);
        if (maj === 8 && min < 16) $b2d0f731fef49674$var$fsevents = undefined;
    }
}

var $58JuD = parcelRequire("58JuD");
var $b2d0f731fef49674$require$EV_ADD = $58JuD.EV_ADD;
var $b2d0f731fef49674$require$EV_CHANGE = $58JuD.EV_CHANGE;
var $b2d0f731fef49674$require$EV_ADD_DIR = $58JuD.EV_ADD_DIR;
var $b2d0f731fef49674$require$EV_UNLINK = $58JuD.EV_UNLINK;
var $b2d0f731fef49674$require$EV_ERROR = $58JuD.EV_ERROR;
var $b2d0f731fef49674$require$STR_DATA = $58JuD.STR_DATA;
var $b2d0f731fef49674$require$STR_END = $58JuD.STR_END;
var $b2d0f731fef49674$require$FSEVENT_CREATED = $58JuD.FSEVENT_CREATED;
var $b2d0f731fef49674$require$FSEVENT_MODIFIED = $58JuD.FSEVENT_MODIFIED;
var $b2d0f731fef49674$require$FSEVENT_DELETED = $58JuD.FSEVENT_DELETED;
var $b2d0f731fef49674$require$FSEVENT_MOVED = $58JuD.FSEVENT_MOVED;
var $b2d0f731fef49674$require$FSEVENT_UNKNOWN = $58JuD.FSEVENT_UNKNOWN;
var $b2d0f731fef49674$require$FSEVENT_TYPE_FILE = $58JuD.FSEVENT_TYPE_FILE;
var $b2d0f731fef49674$require$FSEVENT_TYPE_DIRECTORY = $58JuD.FSEVENT_TYPE_DIRECTORY;
var $b2d0f731fef49674$require$FSEVENT_TYPE_SYMLINK = $58JuD.FSEVENT_TYPE_SYMLINK;
var $b2d0f731fef49674$require$ROOT_GLOBSTAR = $58JuD.ROOT_GLOBSTAR;
var $b2d0f731fef49674$require$DIR_SUFFIX = $58JuD.DIR_SUFFIX;
var $b2d0f731fef49674$require$DOT_SLASH = $58JuD.DOT_SLASH;
var $b2d0f731fef49674$require$FUNCTION_TYPE = $58JuD.FUNCTION_TYPE;
var $b2d0f731fef49674$require$EMPTY_FN = $58JuD.EMPTY_FN;
var $b2d0f731fef49674$require$IDENTITY_FN = $58JuD.IDENTITY_FN;
const $b2d0f731fef49674$var$Depth = (value)=>isNaN(value) ? {
    } : {
        depth: value
    }
;
const $b2d0f731fef49674$var$stat = $b2d0f731fef49674$require$promisify($igPDg$fs.stat);
const $b2d0f731fef49674$var$lstat = $b2d0f731fef49674$require$promisify($igPDg$fs.lstat);
const $b2d0f731fef49674$var$realpath = $b2d0f731fef49674$require$promisify($igPDg$fs.realpath);
const $b2d0f731fef49674$var$statMethods = {
    stat: $b2d0f731fef49674$var$stat,
    lstat: $b2d0f731fef49674$var$lstat
};
/**
 * @typedef {String} Path
 */ /**
 * @typedef {Object} FsEventsWatchContainer
 * @property {Set<Function>} listeners
 * @property {Function} rawEmitter
 * @property {{stop: Function}} watcher
 */ // fsevents instance helper functions
/**
 * Object to hold per-process fsevents instances (may be shared across chokidar FSWatcher instances)
 * @type {Map<Path,FsEventsWatchContainer>}
 */ const $b2d0f731fef49674$var$FSEventsWatchers = new Map();
// Threshold of duplicate path prefixes at which to start
// consolidating going forward
const $b2d0f731fef49674$var$consolidateThreshhold = 10;
const $b2d0f731fef49674$var$wrongEventFlags = new Set([
    69888,
    70400,
    71424,
    72704,
    73472,
    131328,
    131840,
    262912
]);
/**
 * Instantiates the fsevents interface
 * @param {Path} path path to be watched
 * @param {Function} callback called when fsevents is bound and ready
 * @returns {{stop: Function}} new fsevents instance
 */ const $b2d0f731fef49674$var$createFSEventsInstance = (path, callback)=>{
    const stop = $b2d0f731fef49674$var$fsevents.watch(path, callback);
    return {
        stop: stop
    };
};
/**
 * Instantiates the fsevents interface or binds listeners to an existing one covering
 * the same file tree.
 * @param {Path} path           - to be watched
 * @param {Path} realPath       - real path for symlinks
 * @param {Function} listener   - called when fsevents emits events
 * @param {Function} rawEmitter - passes data to listeners of the 'raw' event
 * @returns {Function} closer
 */ function $b2d0f731fef49674$var$setFSEventsListener(path, realPath, listener, rawEmitter) {
    let watchPath = $igPDg$path.extname(realPath) ? $igPDg$path.dirname(realPath) : realPath;
    const parentPath = $igPDg$path.dirname(watchPath);
    let cont = $b2d0f731fef49674$var$FSEventsWatchers.get(watchPath);
    // If we've accumulated a substantial number of paths that
    // could have been consolidated by watching one directory
    // above the current one, create a watcher on the parent
    // path instead, so that we do consolidate going forward.
    if ($b2d0f731fef49674$var$couldConsolidate(parentPath)) watchPath = parentPath;
    const resolvedPath = $igPDg$path.resolve(path);
    const hasSymlink = resolvedPath !== realPath;
    const filteredListener = (fullPath, flags, info)=>{
        if (hasSymlink) fullPath = fullPath.replace(realPath, resolvedPath);
        if (fullPath === resolvedPath || !fullPath.indexOf(resolvedPath + $igPDg$path.sep)) listener(fullPath, flags, info);
    };
    // check if there is already a watcher on a parent path
    // modifies `watchPath` to the parent path when it finds a match
    let watchedParent = false;
    for (const watchedPath of $b2d0f731fef49674$var$FSEventsWatchers.keys())if (realPath.indexOf($igPDg$path.resolve(watchedPath) + $igPDg$path.sep) === 0) {
        watchPath = watchedPath;
        cont = $b2d0f731fef49674$var$FSEventsWatchers.get(watchPath);
        watchedParent = true;
        break;
    }
    if (cont || watchedParent) cont.listeners.add(filteredListener);
    else {
        cont = {
            listeners: new Set([
                filteredListener
            ]),
            rawEmitter: rawEmitter,
            watcher: $b2d0f731fef49674$var$createFSEventsInstance(watchPath, (fullPath, flags)=>{
                if (!cont.listeners.size) return;
                const info = $b2d0f731fef49674$var$fsevents.getInfo(fullPath, flags);
                cont.listeners.forEach((list)=>{
                    list(fullPath, flags, info);
                });
                cont.rawEmitter(info.event, fullPath, info);
            })
        };
        $b2d0f731fef49674$var$FSEventsWatchers.set(watchPath, cont);
    }
    // removes this instance's listeners and closes the underlying fsevents
    // instance if there are no more listeners left
    return ()=>{
        const lst = cont.listeners;
        lst.delete(filteredListener);
        if (!lst.size) {
            $b2d0f731fef49674$var$FSEventsWatchers.delete(watchPath);
            if (cont.watcher) return cont.watcher.stop().then(()=>{
                cont.rawEmitter = cont.watcher = undefined;
                Object.freeze(cont);
            });
        }
    };
}
// Decide whether or not we should start a new higher-level
// parent watcher
const $b2d0f731fef49674$var$couldConsolidate = (path)=>{
    let count = 0;
    for (const watchPath of $b2d0f731fef49674$var$FSEventsWatchers.keys())if (watchPath.indexOf(path) === 0) {
        count++;
        if (count >= $b2d0f731fef49674$var$consolidateThreshhold) return true;
    }
    return false;
};
// returns boolean indicating whether fsevents can be used
const $b2d0f731fef49674$var$canUse = ()=>$b2d0f731fef49674$var$fsevents && $b2d0f731fef49674$var$FSEventsWatchers.size < 128
;
// determines subdirectory traversal levels from root to path
const $b2d0f731fef49674$var$calcDepth = (path, root)=>{
    let i = 0;
    while(!path.indexOf(root) && (path = $igPDg$path.dirname(path)) !== root)i++;
    return i;
};
// returns boolean indicating whether the fsevents' event info has the same type
// as the one returned by fs.stat
const $b2d0f731fef49674$var$sameTypes = (info, stats)=>info.type === $b2d0f731fef49674$require$FSEVENT_TYPE_DIRECTORY && stats.isDirectory() || info.type === $b2d0f731fef49674$require$FSEVENT_TYPE_SYMLINK && stats.isSymbolicLink() || info.type === $b2d0f731fef49674$require$FSEVENT_TYPE_FILE && stats.isFile()
;
/**
 * @mixin
 */ class $b2d0f731fef49674$var$FsEventsHandler {
    /**
 * @param {import('../index').FSWatcher} fsw
 */ constructor(fsw){
        this.fsw = fsw;
    }
    checkIgnored(path4, stats1) {
        const ipaths = this.fsw._ignoredPaths;
        if (this.fsw._isIgnored(path4, stats1)) {
            ipaths.add(path4);
            if (stats1 && stats1.isDirectory()) ipaths.add(path4 + $b2d0f731fef49674$require$ROOT_GLOBSTAR);
            return true;
        }
        ipaths.delete(path4);
        ipaths.delete(path4 + $b2d0f731fef49674$require$ROOT_GLOBSTAR);
    }
    addOrChange(path1, fullPath3, realPath, parent3, watchedDir3, item3, info3, opts) {
        const event = watchedDir3.has(item3) ? $b2d0f731fef49674$require$EV_CHANGE : $b2d0f731fef49674$require$EV_ADD;
        this.handleEvent(event, path1, fullPath3, realPath, parent3, watchedDir3, item3, info3, opts);
    }
    async checkExists(path2, fullPath1, realPath1, parent1, watchedDir1, item1, info1, opts1) {
        try {
            const stats = await $b2d0f731fef49674$var$stat(path2);
            if (this.fsw.closed) return;
            if ($b2d0f731fef49674$var$sameTypes(info1, stats)) this.addOrChange(path2, fullPath1, realPath1, parent1, watchedDir1, item1, info1, opts1);
            else this.handleEvent($b2d0f731fef49674$require$EV_UNLINK, path2, fullPath1, realPath1, parent1, watchedDir1, item1, info1, opts1);
        } catch (error) {
            if (error.code === 'EACCES') this.addOrChange(path2, fullPath1, realPath1, parent1, watchedDir1, item1, info1, opts1);
            else this.handleEvent($b2d0f731fef49674$require$EV_UNLINK, path2, fullPath1, realPath1, parent1, watchedDir1, item1, info1, opts1);
        }
    }
    handleEvent(event, path3, fullPath2, realPath2, parent2, watchedDir2, item2, info2, opts2) {
        if (this.fsw.closed || this.checkIgnored(path3)) return;
        if (event === $b2d0f731fef49674$require$EV_UNLINK) {
            const isDirectory = info2.type === $b2d0f731fef49674$require$FSEVENT_TYPE_DIRECTORY;
            // suppress unlink events on never before seen files
            if (isDirectory || watchedDir2.has(item2)) this.fsw._remove(parent2, item2, isDirectory);
        } else {
            if (event === $b2d0f731fef49674$require$EV_ADD) {
                // track new directories
                if (info2.type === $b2d0f731fef49674$require$FSEVENT_TYPE_DIRECTORY) this.fsw._getWatchedDir(path3);
                if (info2.type === $b2d0f731fef49674$require$FSEVENT_TYPE_SYMLINK && opts2.followSymlinks) {
                    // push symlinks back to the top of the stack to get handled
                    const curDepth = opts2.depth === undefined ? undefined : $b2d0f731fef49674$var$calcDepth(fullPath2, realPath2) + 1;
                    return this._addToFsEvents(path3, false, true, curDepth);
                }
                // track new paths
                // (other than symlinks being followed, which will be tracked soon)
                this.fsw._getWatchedDir(parent2).add(item2);
            }
            /**
     * @type {'add'|'addDir'|'unlink'|'unlinkDir'}
     */ const eventName = info2.type === $b2d0f731fef49674$require$FSEVENT_TYPE_DIRECTORY ? event + $b2d0f731fef49674$require$DIR_SUFFIX : event;
            this.fsw._emit(eventName, path3);
            if (eventName === $b2d0f731fef49674$require$EV_ADD_DIR) this._addToFsEvents(path3, false, true);
        }
    }
    /**
 * Handle symlinks encountered during directory scan
 * @param {String} watchPath  - file/dir path to be watched with fsevents
 * @param {String} realPath   - real path (in case of symlinks)
 * @param {Function} transform  - path transformer
 * @param {Function} globFilter - path filter in case a glob pattern was provided
 * @returns {Function} closer for the watcher instance
*/ _watchWithFsEvents(watchPath, realPath3, transform, globFilter) {
        if (this.fsw.closed || this.fsw._isIgnored(watchPath)) return;
        const opts = this.fsw.options;
        const watchCallback = async (fullPath, flags, info)=>{
            if (this.fsw.closed) return;
            if (opts.depth !== undefined && $b2d0f731fef49674$var$calcDepth(fullPath, realPath3) > opts.depth) return;
            const path = transform($igPDg$path.join(watchPath, $igPDg$path.relative(watchPath, fullPath)));
            if (globFilter && !globFilter(path)) return;
            // ensure directories are tracked
            const parent = $igPDg$path.dirname(path);
            const item = $igPDg$path.basename(path);
            const watchedDir = this.fsw._getWatchedDir(info.type === $b2d0f731fef49674$require$FSEVENT_TYPE_DIRECTORY ? path : parent);
            // correct for wrong events emitted
            if ($b2d0f731fef49674$var$wrongEventFlags.has(flags) || info.event === $b2d0f731fef49674$require$FSEVENT_UNKNOWN) {
                if (typeof opts.ignored === $b2d0f731fef49674$require$FUNCTION_TYPE) {
                    let stats;
                    try {
                        stats = await $b2d0f731fef49674$var$stat(path);
                    } catch (error) {
                    }
                    if (this.fsw.closed) return;
                    if (this.checkIgnored(path, stats)) return;
                    if ($b2d0f731fef49674$var$sameTypes(info, stats)) this.addOrChange(path, fullPath, realPath3, parent, watchedDir, item, info, opts);
                    else this.handleEvent($b2d0f731fef49674$require$EV_UNLINK, path, fullPath, realPath3, parent, watchedDir, item, info, opts);
                } else this.checkExists(path, fullPath, realPath3, parent, watchedDir, item, info, opts);
            } else switch(info.event){
                case $b2d0f731fef49674$require$FSEVENT_CREATED:
                case $b2d0f731fef49674$require$FSEVENT_MODIFIED:
                    return this.addOrChange(path, fullPath, realPath3, parent, watchedDir, item, info, opts);
                case $b2d0f731fef49674$require$FSEVENT_DELETED:
                case $b2d0f731fef49674$require$FSEVENT_MOVED:
                    return this.checkExists(path, fullPath, realPath3, parent, watchedDir, item, info, opts);
            }
        };
        const closer = $b2d0f731fef49674$var$setFSEventsListener(watchPath, realPath3, watchCallback, this.fsw._emitRaw);
        this.fsw._emitReady();
        return closer;
    }
    /**
 * Handle symlinks encountered during directory scan
 * @param {String} linkPath path to symlink
 * @param {String} fullPath absolute path to the symlink
 * @param {Function} transform pre-existing path transformer
 * @param {Number} curDepth level of subdirectories traversed to where symlink is
 * @returns {Promise<void>}
 */ async _handleFsEventsSymlink(linkPath, fullPath4, transform1, curDepth1) {
        // don't follow the same symlink more than once
        if (this.fsw.closed || this.fsw._symlinkPaths.has(fullPath4)) return;
        this.fsw._symlinkPaths.set(fullPath4, true);
        this.fsw._incrReadyCount();
        try {
            const linkTarget = await $b2d0f731fef49674$var$realpath(linkPath);
            if (this.fsw.closed) return;
            if (this.fsw._isIgnored(linkTarget)) return this.fsw._emitReady();
            this.fsw._incrReadyCount();
            // add the linkTarget for watching with a wrapper for transform
            // that causes emitted paths to incorporate the link's path
            this._addToFsEvents(linkTarget || linkPath, (path)=>{
                let aliasedPath = linkPath;
                if (linkTarget && linkTarget !== $b2d0f731fef49674$require$DOT_SLASH) aliasedPath = path.replace(linkTarget, linkPath);
                else if (path !== $b2d0f731fef49674$require$DOT_SLASH) aliasedPath = $igPDg$path.join(linkPath, path);
                return transform1(aliasedPath);
            }, false, curDepth1);
        } catch (error) {
            if (this.fsw._handleError(error)) return this.fsw._emitReady();
        }
    }
    /**
 *
 * @param {Path} newPath
 * @param {fs.Stats} stats
 */ emitAdd(newPath, stats, processPath, opts3, forceAdd) {
        const pp = processPath(newPath);
        const isDir = stats.isDirectory();
        const dirObj = this.fsw._getWatchedDir($igPDg$path.dirname(pp));
        const base = $igPDg$path.basename(pp);
        // ensure empty dirs get tracked
        if (isDir) this.fsw._getWatchedDir(pp);
        if (dirObj.has(base)) return;
        dirObj.add(base);
        if (!opts3.ignoreInitial || forceAdd === true) this.fsw._emit(isDir ? $b2d0f731fef49674$require$EV_ADD_DIR : $b2d0f731fef49674$require$EV_ADD, pp, stats);
    }
    initWatch(realPath4, path, wh, processPath1) {
        if (this.fsw.closed) return;
        const closer = this._watchWithFsEvents(wh.watchPath, $igPDg$path.resolve(realPath4 || wh.watchPath), processPath1, wh.globFilter);
        this.fsw._addPathCloser(path, closer);
    }
    /**
 * Handle added path with fsevents
 * @param {String} path file/dir path or glob pattern
 * @param {Function|Boolean=} transform converts working path to what the user expects
 * @param {Boolean=} forceAdd ensure add is emitted
 * @param {Number=} priorDepth Level of subdirectories already traversed.
 * @returns {Promise<void>}
 */ async _addToFsEvents(path5, transform2, forceAdd1, priorDepth) {
        if (this.fsw.closed) return;
        const opts = this.fsw.options;
        const processPath = typeof transform2 === $b2d0f731fef49674$require$FUNCTION_TYPE ? transform2 : $b2d0f731fef49674$require$IDENTITY_FN;
        const wh = this.fsw._getWatchHelpers(path5);
        // evaluate what is at the path we're being asked to watch
        try {
            const stats = await $b2d0f731fef49674$var$statMethods[wh.statMethod](wh.watchPath);
            if (this.fsw.closed) return;
            if (this.fsw._isIgnored(wh.watchPath, stats)) throw null;
            if (stats.isDirectory()) {
                // emit addDir unless this is a glob parent
                if (!wh.globFilter) this.emitAdd(processPath(path5), stats, processPath, opts, forceAdd1);
                // don't recurse further if it would exceed depth setting
                if (priorDepth && priorDepth > opts.depth) return;
                // scan the contents of the dir
                this.fsw._readdirp(wh.watchPath, {
                    fileFilter: (entry)=>wh.filterPath(entry)
                    ,
                    directoryFilter: (entry)=>wh.filterDir(entry)
                    ,
                    ...$b2d0f731fef49674$var$Depth(opts.depth - (priorDepth || 0))
                }).on($b2d0f731fef49674$require$STR_DATA, (entry)=>{
                    // need to check filterPath on dirs b/c filterDir is less restrictive
                    if (this.fsw.closed) return;
                    if (entry.stats.isDirectory() && !wh.filterPath(entry)) return;
                    const joinedPath = $igPDg$path.join(wh.watchPath, entry.path);
                    const { fullPath: fullPath  } = entry;
                    if (wh.followSymlinks && entry.stats.isSymbolicLink()) {
                        // preserve the current depth here since it can't be derived from
                        // real paths past the symlink
                        const curDepth = opts.depth === undefined ? undefined : $b2d0f731fef49674$var$calcDepth(joinedPath, $igPDg$path.resolve(wh.watchPath)) + 1;
                        this._handleFsEventsSymlink(joinedPath, fullPath, processPath, curDepth);
                    } else this.emitAdd(joinedPath, entry.stats, processPath, opts, forceAdd1);
                }).on($b2d0f731fef49674$require$EV_ERROR, $b2d0f731fef49674$require$EMPTY_FN).on($b2d0f731fef49674$require$STR_END, ()=>{
                    this.fsw._emitReady();
                });
            } else {
                this.emitAdd(wh.watchPath, stats, processPath, opts, forceAdd1);
                this.fsw._emitReady();
            }
        } catch (error) {
            if (!error || this.fsw._handleError(error)) {
                // TODO: Strange thing: "should not choke on an ignored watch path" will be failed without 2 ready calls -__-
                this.fsw._emitReady();
                this.fsw._emitReady();
            }
        }
        if (opts.persistent && forceAdd1 !== true) {
            if (typeof transform2 === $b2d0f731fef49674$require$FUNCTION_TYPE) // realpath has already been resolved
            this.initWatch(undefined, path5, wh, processPath);
            else {
                let realPath;
                try {
                    realPath = await $b2d0f731fef49674$var$realpath(wh.watchPath);
                } catch (e) {
                }
                this.initWatch(realPath, path5, wh, processPath);
            }
        }
    }
}
module.exports = $b2d0f731fef49674$var$FsEventsHandler;
module.exports.canUse = $b2d0f731fef49674$var$canUse;

});



parcelRequire.register("dcGSX", function(module, exports) {
"use strict";
Object.defineProperty(module.exports, "__esModule", {
    value: true
});
module.exports.DefaultScopes = void 0;
const $99cda97bdca77b2f$var$javascriptPrefixes = [
    "import\\s+.*?from\\s+['\"]",
    "import\\s+['\"]",
    "require\\(['\"]",
    "define\\(\\[?['\"]" // define(['./foo']) or define('./foo')
];
const $99cda97bdca77b2f$var$javascriptExtensions = [
    "js",
    "jsx",
    "ts",
    "tsx",
    "coffee",
    "json"
]; // no index replacement
const $99cda97bdca77b2f$var$javascriptReplaceOnInsert = [
    [
        "\\.jsx?$",
        ""
    ],
    [
        "\\.ts$",
        ""
    ],
    [
        "\\.coffee$",
        ""
    ]
]; // with index replacement
const $99cda97bdca77b2f$var$javascriptWithIndexReplaceOnInsert = [
    [
        "([\\/]?index)?\\.jsx?$",
        ""
    ],
    [
        "([\\/]?index)?\\.ts$",
        ""
    ],
    [
        "([\\/]?index)?\\.coffee$",
        ""
    ]
];
const $99cda97bdca77b2f$var$DefaultScopes = [
    {
        scopes: [
            "source.js",
            "source.js.jsx",
            "source.coffee",
            "source.coffee.jsx",
            "source.ts",
            "source.tsx",
            "javascript",
            "source.flow"
        ],
        prefixes: $99cda97bdca77b2f$var$javascriptPrefixes,
        extensions: $99cda97bdca77b2f$var$javascriptExtensions,
        relative: true,
        replaceOnInsert: $99cda97bdca77b2f$var$javascriptWithIndexReplaceOnInsert
    },
    {
        scopes: [
            "text.html.vue"
        ],
        prefixes: $99cda97bdca77b2f$var$javascriptPrefixes,
        extensions: $99cda97bdca77b2f$var$javascriptExtensions.concat("vue"),
        relative: true,
        replaceOnInsert: $99cda97bdca77b2f$var$javascriptReplaceOnInsert
    },
    {
        scopes: [
            "text.html.vue"
        ],
        prefixes: [
            "@import[\\(|\\s+]?['\"]" // @import 'foo' or @import('foo')
        ],
        extensions: [
            "css",
            "sass",
            "scss",
            "less",
            "styl"
        ],
        relative: true,
        replaceOnInsert: [
            [
                "(/)?_([^/]*?)$",
                "$1$2"
            ] // dir1/_dir2/_file.sass => dir1/_dir2/file.sass
        ]
    },
    {
        scopes: [
            "source.coffee",
            "source.coffee.jsx"
        ],
        prefixes: [
            "require\\s+['\"]",
            "define\\s+\\[?['\"]" // define(['./foo']) or define('./foo')
        ],
        extensions: $99cda97bdca77b2f$var$javascriptExtensions,
        relative: true,
        replaceOnInsert: $99cda97bdca77b2f$var$javascriptReplaceOnInsert
    },
    {
        scopes: [
            "source.php"
        ],
        prefixes: [
            "require_once\\(['\"]",
            "include\\(['\"]" // include('./foo.php')
        ],
        extensions: [
            "php"
        ],
        relative: true
    },
    {
        scopes: [
            "source.sass",
            "source.css.scss",
            "source.css.less",
            "source.stylus"
        ],
        prefixes: [
            "@import[\\(|\\s+]?['\"]" // @import 'foo' or @import('foo')
        ],
        extensions: [
            "sass",
            "scss",
            "css"
        ],
        relative: true,
        replaceOnInsert: [
            [
                "(/)?_([^/]*?)$",
                "$1$2"
            ] // dir1/_dir2/_file.sass => dir1/_dir2/file.sass
        ]
    },
    {
        scopes: [
            "source.css"
        ],
        prefixes: [
            "@import\\s+['\"]?",
            "@import\\s+url\\(['\"]?" // @import url('foo.css')
        ],
        extensions: [
            "css"
        ],
        relative: true
    },
    {
        scopes: [
            "source.css",
            "source.sass",
            "source.css.less",
            "source.css.scss",
            "source.stylus"
        ],
        prefixes: [
            "url\\(['\"]?"
        ],
        extensions: [
            "png",
            "gif",
            "jpeg",
            "jpg",
            "woff",
            "woff2",
            "ttf",
            "svg",
            "otf"
        ],
        relative: true
    },
    {
        scopes: [
            "source.c",
            "source.cpp"
        ],
        prefixes: [
            "^\\s*#include\\s+['\"]"
        ],
        extensions: [
            "h",
            "hpp"
        ],
        relative: true,
        includeCurrentDirectory: false
    },
    {
        scopes: [
            "source.lua"
        ],
        prefixes: [
            "require[\\s+|\\(]['\"]"
        ],
        extensions: [
            "lua"
        ],
        relative: true,
        includeCurrentDirectory: false,
        replaceOnInsert: [
            [
                "\\/",
                "."
            ],
            [
                "\\\\",
                "."
            ],
            [
                "\\.lua$",
                ""
            ]
        ]
    },
    {
        scopes: [
            "source.ruby"
        ],
        prefixes: [
            "^\\s*require[\\s+|\\(]['\"]"
        ],
        extensions: [
            "rb"
        ],
        relative: true,
        includeCurrentDirectory: false,
        replaceOnInsert: [
            [
                "\\.rb$",
                ""
            ]
        ]
    },
    {
        scopes: [
            "source.python"
        ],
        prefixes: [
            "^\\s*from\\s+",
            "^\\s*import\\s+"
        ],
        extensions: [
            "py"
        ],
        relative: true,
        includeCurrentDirectory: false,
        replaceOnInsert: [
            [
                "\\/",
                "."
            ],
            [
                "\\\\",
                "."
            ],
            [
                "\\.py$",
                ""
            ]
        ]
    }
];
module.exports.DefaultScopes = $99cda97bdca77b2f$var$DefaultScopes;

});

var $5bdf4495e20ef6ab$exports = {};
"use strict";
Object.defineProperty($5bdf4495e20ef6ab$exports, "__esModule", {
    value: true
});
$5bdf4495e20ef6ab$exports.OptionScopes = void 0;
const $5bdf4495e20ef6ab$var$OptionScopes = {
    enableHtmlSupport: [
        {
            scopes: [
                "text.html.basic"
            ],
            prefixes: [
                "src=['\"]",
                "href=['\"]",
                "name=['\"]"
            ],
            extensions: [
                "js",
                "png",
                "gif",
                "jpeg",
                "jpg",
                "tiff",
                "html",
                "json",
                "svg"
            ],
            relative: true
        }
    ]
};
$5bdf4495e20ef6ab$exports.OptionScopes = $5bdf4495e20ef6ab$var$OptionScopes;



var $94e1e7fd37d7fa19$var$_pathsProvider = $94e1e7fd37d7fa19$var$_interopRequireDefault((parcelRequire("fdUTB")));


parcelRequire("faG0G");
var $1MRWn = parcelRequire("1MRWn");
var $661f0ec0189dd3b0$exports = {};
"use strict";
Object.defineProperty($661f0ec0189dd3b0$exports, "__esModule", {
    value: true
});
$661f0ec0189dd3b0$exports.config = void 0;

const $661f0ec0189dd3b0$var$config = {
    normalizeSlashes: {
        type: "boolean",
        description: "Replaces backward slashes with forward slashes on windows (if possible)",
        default: true
    },
    maxFileCount: {
        type: "number",
        description: "The maximum amount of files to be handled",
        default: 2000
    },
    suggestionPriority: {
        type: "number",
        description: "Suggestion priority of this provider. If set to a number larger than or equal to 1, suggestions will be displayed on top of default suggestions.",
        default: 2
    },
    ignoredNames: {
        type: "boolean",
        default: true,
        description: "Ignore items matched by the `Ignore Names` core option."
    },
    ignoreSubmodules: {
        type: "boolean",
        default: false,
        description: "Ignore submodule directories."
    },
    ignoredPatterns: {
        type: "array",
        default: [],
        items: {
            type: "string"
        },
        description: "Ignore additional **glob** or file path patterns."
    },
    ignoreBuiltinScopes: {
        type: "boolean",
        default: false,
        description: "Ignore built-in scopes and use only scopes from user configuration."
    },
    scopes: {
        type: "array",
        default: [],
        items: {
            type: "object",
            properties: {
                scopes: {
                    type: [
                        "array"
                    ],
                    items: {
                        type: "string"
                    }
                },
                prefixes: {
                    type: [
                        "array"
                    ],
                    items: {
                        type: "string"
                    }
                },
                extensions: {
                    type: [
                        "array"
                    ],
                    items: {
                        type: "string"
                    }
                },
                relative: {
                    type: "boolean",
                    default: true
                },
                replaceOnInsert: {
                    type: "array",
                    items: {
                        type: "array",
                        items: {
                            type: [
                                "string",
                                "string"
                            ]
                        }
                    }
                }
            }
        }
    }
};
$661f0ec0189dd3b0$exports.config = $661f0ec0189dd3b0$var$config;
const $661f0ec0189dd3b0$var$keys = Object.keys($5bdf4495e20ef6ab$exports.OptionScopes);
for(let i = 0, len = $661f0ec0189dd3b0$var$keys.length; i < len; i++)$661f0ec0189dd3b0$var$config[$661f0ec0189dd3b0$var$keys[i]] = {
    type: "boolean",
    default: false
};


function $94e1e7fd37d7fa19$var$_interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const $94e1e7fd37d7fa19$var$subscriptions = new $igPDg$atom.CompositeDisposable();
let $94e1e7fd37d7fa19$var$_provider;
/** Provider.rebuildCache method debounced */ let $94e1e7fd37d7fa19$var$_rebuildCache;
let $94e1e7fd37d7fa19$var$_statusBar;
let $94e1e7fd37d7fa19$var$_statusBarInterval;
let $94e1e7fd37d7fa19$var$_statusBarTile;
let $94e1e7fd37d7fa19$var$_statusBarElement;
let $94e1e7fd37d7fa19$var$_displayStatusBarItemOnConsumption;
function $94e1e7fd37d7fa19$var$activate() {
    $94e1e7fd37d7fa19$var$subscriptions.add(atom.commands.add("atom-workspace", {
        "autocomplete-paths:rebuild-cache": ()=>{
            $94e1e7fd37d7fa19$var$_rebuildCache();
        }
    }));
    const cacheOptions = [
        "core.ignoredNames",
        "core.excludeVcsIgnoredPaths",
        "autocomplete-paths.ignoreSubmodules",
        "autocomplete-paths.ignoredNames",
        "autocomplete-paths.ignoredPatterns",
        "autocomplete-paths.maxFileCount"
    ];
    cacheOptions.forEach((cacheOption)=>{
        $94e1e7fd37d7fa19$var$subscriptions.add(atom.config.observe(cacheOption, ()=>{
            if (!$94e1e7fd37d7fa19$var$_provider) return;
            $94e1e7fd37d7fa19$var$_provider._pathsCache.updateConfig();
            $94e1e7fd37d7fa19$var$_rebuildCache();
        }));
    });
    const scopeOptions = [
        "autocomplete-paths.scopes"
    ];
    for(const key in $5bdf4495e20ef6ab$exports.OptionScopes)scopeOptions.push(`autocomplete-paths.${key}`);
    scopeOptions.forEach((scopeOption)=>{
        $94e1e7fd37d7fa19$var$subscriptions.add(atom.config.observe(scopeOption, ()=>{
            if (!$94e1e7fd37d7fa19$var$_provider) return;
            $94e1e7fd37d7fa19$var$_provider.reloadScopes();
        }));
    });
}
function $94e1e7fd37d7fa19$var$deactivate() {
    if ($94e1e7fd37d7fa19$var$_statusBarInterval) clearInterval($94e1e7fd37d7fa19$var$_statusBarInterval);
    $94e1e7fd37d7fa19$var$subscriptions.dispose();
    if ($94e1e7fd37d7fa19$var$_provider) {
        $94e1e7fd37d7fa19$var$_provider.dispose(true);
        $94e1e7fd37d7fa19$var$_provider = null;
    }
    if ($94e1e7fd37d7fa19$var$_statusBarTile) {
        $94e1e7fd37d7fa19$var$_statusBarTile.destroy();
        $94e1e7fd37d7fa19$var$_statusBarTile = null;
    }
}
/**
 * Invoked when the status bar becomes available
 *
 * @param {StatusBar} statusBar
 */ function $94e1e7fd37d7fa19$var$consumeStatusBar(statusBar) {
    $94e1e7fd37d7fa19$var$_statusBar = statusBar;
    if ($94e1e7fd37d7fa19$var$_displayStatusBarItemOnConsumption) $94e1e7fd37d7fa19$var$_displayStatusBarTile();
}
/** Displays the status bar tile */ function $94e1e7fd37d7fa19$var$_displayStatusBarTile() {
    if (!$94e1e7fd37d7fa19$var$_statusBar) {
        $94e1e7fd37d7fa19$var$_displayStatusBarItemOnConsumption = true;
        return;
    }
    if ($94e1e7fd37d7fa19$var$_statusBarTile) return;
    $94e1e7fd37d7fa19$var$_statusBarElement = document.createElement("autocomplete-paths-status-bar");
    $94e1e7fd37d7fa19$var$_statusBarElement.innerHTML = "Rebuilding paths cache...";
    $94e1e7fd37d7fa19$var$_statusBarTile = $94e1e7fd37d7fa19$var$_statusBar.addRightTile({
        item: $94e1e7fd37d7fa19$var$_statusBarElement,
        priority: 100
    });
    if (!$94e1e7fd37d7fa19$var$_provider) {
        // TODO check why we need this check
        $94e1e7fd37d7fa19$var$getProvider();
        if (!$94e1e7fd37d7fa19$var$_provider) return;
    }
    $94e1e7fd37d7fa19$var$_statusBarInterval = setInterval(()=>{
        const fileCount = $94e1e7fd37d7fa19$var$_provider.fileCount;
        if (fileCount > 0) $94e1e7fd37d7fa19$var$_statusBarElement.innerHTML = `Rebuilding paths cache... ${fileCount} files`;
    }, 500);
}
/** Hides the status bar tile */ function $94e1e7fd37d7fa19$var$_hideStatusBarTile() {
    if ($94e1e7fd37d7fa19$var$_statusBarInterval) clearInterval($94e1e7fd37d7fa19$var$_statusBarInterval);
    if ($94e1e7fd37d7fa19$var$_statusBarTile) $94e1e7fd37d7fa19$var$_statusBarTile.destroy();
    $94e1e7fd37d7fa19$var$_statusBarTile = null;
    $94e1e7fd37d7fa19$var$_statusBarElement = null;
}
function $94e1e7fd37d7fa19$var$getProvider() {
    if (!$94e1e7fd37d7fa19$var$_provider) {
        $94e1e7fd37d7fa19$var$_provider = new $94e1e7fd37d7fa19$var$_pathsProvider.default();
        $94e1e7fd37d7fa19$var$_provider.on("rebuild-cache", ()=>{
            $94e1e7fd37d7fa19$var$_displayStatusBarTile();
        });
        $94e1e7fd37d7fa19$var$_provider.on("rebuild-cache-done", ()=>{
            $94e1e7fd37d7fa19$var$_hideStatusBarTile();
        });
        $94e1e7fd37d7fa19$var$_rebuildCache = (0, $1MRWn.default)(()=>{
            return $94e1e7fd37d7fa19$var$_provider.rebuildCache();
        }, 1000, true);
        $94e1e7fd37d7fa19$var$_rebuildCache();
    }
    return $94e1e7fd37d7fa19$var$_provider;
}


//# sourceMappingURL=autocomplete-paths.js.map
