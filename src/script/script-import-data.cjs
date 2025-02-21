"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var admin = require("firebase-admin");
var csv = require('csv-parser');
var fs = require("fs");
// Inizializza Firebase
var serviceAccount = require('../wineencyclopedia-245f5-firebase-adminsdk-5bhjd-b1ac58c49c.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
var db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });
var collectionName = 'wines'; // Nome della tua collection in Firebase
// Funzione per importare i dati dal CSV
var importCsvToFirebase = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                var count = 0;
                fs.createReadStream('C:\\Users\\davide.scilletta\\Downloads\\Vini - Foglio1 - Copia.tsv')
                    .pipe(csv({ separator: '\t', headers: false }))
                    .on('data', function (row) { return __awaiter(void 0, void 0, void 0, function () {
                    var wineData, error_1;
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
                    return __generator(this, function (_1) {
                        switch (_1.label) {
                            case 0:
                                _1.trys.push([0, 3, , 4]);
                                count++;
                                wineData = {};
                                wineData.name = row[0];
                                wineData.winery = row[1];
                                //let color = row[3];
                                wineData.grapeVariety = row[4];
                                wineData.vintage = row[5];
                                wineData.color = getColor(((_a = row[7]) === null || _a === void 0 ? void 0 : _a.split(' ')[0]) || "", ((_b = row[7]) === null || _b === void 0 ? void 0 : _b.split(' ')[1]) || "");
                                wineData.colorDensity = ((_c = row[7]) === null || _c === void 0 ? void 0 : _c.split(' ')[2]) || "";
                                wineData.limpidity = ((_d = row[7]) === null || _d === void 0 ? void 0 : _d.split(' ')[3]) || "";
                                wineData.consistency = ((_e = row[7]) === null || _e === void 0 ? void 0 : _e.split(' ')[4]) || "";
                                wineData.effervescenceBubbleGrain = ((_f = row[7]) === null || _f === void 0 ? void 0 : _f.split(' ')[5]) || "";
                                wineData.effervescenceBubbleNumber = ((_g = row[7]) === null || _g === void 0 ? void 0 : _g.split(' ')[6]) || "";
                                wineData.effervescenceBubblePersistence = ((_h = row[7]) === null || _h === void 0 ? void 0 : _h.split(' ')[7]) || "";
                                wineData.olfactoryIntensity = ((_j = row[8]) === null || _j === void 0 ? void 0 : _j.split(' ')[0]) || "";
                                wineData.olfactoryComplexity = ((_k = row[8]) === null || _k === void 0 ? void 0 : _k.split(' ')[1]) || "";
                                wineData.olfactoryQuality = row[8] || "";
                                wineData.olfactoryDescription = row[8] || "";
                                wineData.sugars = ((_l = row[9]) === null || _l === void 0 ? void 0 : _l.split(' ')[0]) || "";
                                wineData.alcohols = ((_m = row[9]) === null || _m === void 0 ? void 0 : _m.split(' ')[1]) || "";
                                wineData.polyalcohols = ((_o = row[9]) === null || _o === void 0 ? void 0 : _o.split(' ')[2]) || "";
                                wineData.acids = ((_p = row[10]) === null || _p === void 0 ? void 0 : _p.split(' ')[0]) || "";
                                wineData.tanninsQuality = ((_q = row[10]) === null || _q === void 0 ? void 0 : _q.split(' ')[1]) || "";
                                wineData.tanninsQuantity = ((_r = row[10]) === null || _r === void 0 ? void 0 : _r.split(' ')[2]) || "";
                                wineData.mineralSubstances = ((_s = row[10]) === null || _s === void 0 ? void 0 : _s.split(' ')[3]) || "";
                                wineData.bodyWine = ((_t = row[11]) === null || _t === void 0 ? void 0 : _t.split(' ')[0]) || "";
                                wineData.equilibrium = ((_u = row[11]) === null || _u === void 0 ? void 0 : _u.split(' ')[1]) || "";
                                wineData.tasteIntensity = ((_v = row[12]) === null || _v === void 0 ? void 0 : _v.split(' ')[0]) || "";
                                wineData.tastePersistence = ((_w = row[12]) === null || _w === void 0 ? void 0 : _w.split(' ')[1]) || "";
                                wineData.tasteQuality = ((_x = row[12]) === null || _x === void 0 ? void 0 : _x.split(' ')[2]) || "";
                                wineData.evolutionaryState = ((_y = row[13]) === null || _y === void 0 ? void 0 : _y.split(' ')[0]) || "";
                                wineData.harmony = ((_z = row[13]) === null || _z === void 0 ? void 0 : _z.split(' ')[1]) || "";
                                wineData.typicality = ((_0 = row[13]) === null || _0 === void 0 ? void 0 : _0.split(' ')[2]) || "";
                                wineData.user = "jEM1eyphCrb8xhCvcVQBZ32I1523";
                                if (!(wineData.name != "")) return [3 /*break*/, 2];
                                console.log("Vino ".concat(wineData.name, " aggiunto"));
                                return [4 /*yield*/, db.collection(collectionName).add(wineData)];
                            case 1:
                                _1.sent();
                                _1.label = 2;
                            case 2: return [3 /*break*/, 4];
                            case 3:
                                error_1 = _1.sent();
                                console.error('Errore nell\'aggiunta del dato:', error_1);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); })
                    .on('end', function () {
                    console.log("\nImportazione completata. Totale righe importate: ".concat(count));
                    resolve();
                })
                    .on('error', function (error) {
                    console.error('Errore durante la lettura del CSV:', error);
                    reject(error);
                });
            })];
    });
}); };
// Esecuzione dello script
importCsvToFirebase().catch(function (error) {
    console.error('Errore nello script di importazione:', error);
});
function getColor(color, shade) {
    switch (color + " " + shade) {
        case 'Giallo verdolino':
            return 'yellow_greenish';
        case 'Giallo paglierino':
            return 'yellow_straw';
        case 'Giallo dorato':
            return 'yellow_golden';
        case 'Giallo ambrato/aranciato':
            return 'yellow_golden';
        case 'Rosa tenue':
            return 'rose_soft';
        case 'Rosa ramato':
            return 'rose_coppery';
        case 'Rosa cerasuolo':
            return 'rose_cherry';
        case 'Rosa chiaretto':
            return 'rose_claret';
        case 'Rosso porpora/violaceo':
            return 'red_purplish';
        case 'Rosso rubino':
            return 'red_ruby';
        case 'Rosso granato':
            return 'red_garnet';
        case 'Rosso aranciato':
            return 'red_orange';
    }
}
