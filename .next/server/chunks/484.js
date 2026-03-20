"use strict";
exports.id = 484;
exports.ids = [484];
exports.modules = {

/***/ 484:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "t": () => (/* binding */ useAuthStore)
/* harmony export */ });
/* harmony import */ var zustand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6912);
/* harmony import */ var zustand_middleware__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3602);
/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9915);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([zustand__WEBPACK_IMPORTED_MODULE_0__, zustand_middleware__WEBPACK_IMPORTED_MODULE_1__, js_cookie__WEBPACK_IMPORTED_MODULE_2__]);
([zustand__WEBPACK_IMPORTED_MODULE_0__, zustand_middleware__WEBPACK_IMPORTED_MODULE_1__, js_cookie__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);



const useAuthStore = (0,zustand__WEBPACK_IMPORTED_MODULE_0__.create)()((0,zustand_middleware__WEBPACK_IMPORTED_MODULE_1__.devtools)((0,zustand_middleware__WEBPACK_IMPORTED_MODULE_1__.persist)((set)=>({
        isAuthenticated: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        login: (user, accessToken, refreshToken)=>{
            // Save JWT tokens in cookies for the axios interceptor
            js_cookie__WEBPACK_IMPORTED_MODULE_2__["default"].set("access_token", accessToken, {
                expires: 1
            }); // 1 day
            js_cookie__WEBPACK_IMPORTED_MODULE_2__["default"].set("refresh_token", refreshToken, {
                expires: 7
            }); // 7 days
            set({
                isAuthenticated: true,
                user,
                accessToken,
                refreshToken
            });
        },
        logout: ()=>{
            js_cookie__WEBPACK_IMPORTED_MODULE_2__["default"].remove("access_token");
            js_cookie__WEBPACK_IMPORTED_MODULE_2__["default"].remove("refresh_token");
            set({
                isAuthenticated: false,
                user: null,
                accessToken: null,
                refreshToken: null
            });
        }
    }), {
    name: "admin-auth-storage",
    partialize: (state)=>({
            isAuthenticated: state.isAuthenticated,
            user: state.user,
            accessToken: state.accessToken,
            refreshToken: state.refreshToken
        })
})));

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;