"use strict";
(() => {
var exports = {};
exports.id = 130;
exports.ids = [130];
exports.modules = {

/***/ 4727:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "config": () => (/* binding */ config),
  "default": () => (/* binding */ handler)
});

;// CONCATENATED MODULE: external "http"
const external_http_namespaceObject = require("http");
var external_http_default = /*#__PURE__*/__webpack_require__.n(external_http_namespaceObject);
;// CONCATENATED MODULE: external "http-proxy"
const external_http_proxy_namespaceObject = require("http-proxy");
var external_http_proxy_default = /*#__PURE__*/__webpack_require__.n(external_http_proxy_namespaceObject);
;// CONCATENATED MODULE: ./pages/api/[...path].js


const API_URL = process.env.API_URL;
const proxy = external_http_proxy_default().createProxyServer({
    agent: new (external_http_default()).Agent({
        keepAlive: true
    })
});
const config = {
    api: {
        externalResolver: true,
        bodyParser: false
    }
};
function handler(req, res) {
    return new Promise((resolve, reject)=>{
        req.url = req.url.replace("/api", "");
        proxy.web(req, res, {
            target: API_URL,
            changeOrigin: true
        }, (err)=>{
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(4727));
module.exports = __webpack_exports__;

})();