"use strict";
exports.id = 172;
exports.ids = [172];
exports.modules = {

/***/ 6331:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "d": () => (/* binding */ EditIcon)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

const EditIcon = ({ fill , size , height , width , ...props })=>{
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", {
        width: size || width || 24,
        height: size || height || 24,
        viewBox: "0 0 20 20",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        ...props,
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("path", {
                d: "M11.05 3.00002L4.20835 10.2417C3.95002 10.5167 3.70002 11.0584 3.65002 11.4334L3.34169 14.1334C3.23335 15.1084 3.93335 15.775 4.90002 15.6084L7.58335 15.15C7.95835 15.0834 8.48335 14.8084 8.74168 14.525L15.5834 7.28335C16.7667 6.03335 17.3 4.60835 15.4583 2.86668C13.625 1.14168 12.2334 1.75002 11.05 3.00002Z",
                stroke: fill,
                strokeWidth: 1.5,
                strokeMiterlimit: 10,
                strokeLinecap: "round",
                strokeLinejoin: "round"
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("path", {
                d: "M9.90833 4.20831C10.2667 6.50831 12.1333 8.26665 14.45 8.49998",
                stroke: fill,
                strokeWidth: 1.5,
                strokeMiterlimit: 10,
                strokeLinecap: "round",
                strokeLinejoin: "round"
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("path", {
                d: "M2.5 18.3333H17.5",
                stroke: fill,
                strokeWidth: 1.5,
                strokeMiterlimit: 10,
                strokeLinecap: "round",
                strokeLinejoin: "round"
            })
        ]
    });
};


/***/ }),

/***/ 4677:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "t": () => (/* binding */ EyeIcon)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

const EyeIcon = ({ fill , size , height , width , ...props })=>{
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", {
        width: size || width || 24,
        height: size || height || 24,
        viewBox: "0 0 20 20",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        ...props,
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("path", {
                d: "M12.9833 10C12.9833 11.65 11.65 12.9833 10 12.9833C8.35 12.9833 7.01666 11.65 7.01666 10C7.01666 8.35 8.35 7.01666 10 7.01666C11.65 7.01666 12.9833 8.35 12.9833 10Z",
                stroke: fill,
                strokeWidth: 1.5,
                strokeLinecap: "round",
                strokeLinejoin: "round"
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("path", {
                d: "M9.99999 16.8916C12.9417 16.8916 15.6833 15.1583 17.5917 12.1583C18.3417 10.9833 18.3417 9.00831 17.5917 7.83331C15.6833 4.83331 12.9417 3.09998 9.99999 3.09998C7.05833 3.09998 4.31666 4.83331 2.40833 7.83331C1.65833 9.00831 1.65833 10.9833 2.40833 12.1583C4.31666 15.1583 7.05833 16.8916 9.99999 16.8916Z",
                stroke: fill,
                strokeWidth: 1.5,
                strokeLinecap: "round",
                strokeLinejoin: "round"
            })
        ]
    });
};


/***/ }),

/***/ 7879:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "h": () => (/* binding */ IconButton),
/* harmony export */   "j": () => (/* binding */ StyledBadge)
/* harmony export */ });
/* harmony import */ var _nextui_org_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6735);
/* harmony import */ var _nextui_org_react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_nextui_org_react__WEBPACK_IMPORTED_MODULE_0__);

const IconButton = (0,_nextui_org_react__WEBPACK_IMPORTED_MODULE_0__.styled)("button", {
    "dflex": "center",
    "border": "none",
    "outline": "none",
    "cursor": "pointer",
    "padding": "0",
    "margin": "0",
    "bg": "transparent",
    "transition": "$default",
    "&:hover": {
        opacity: "0.8"
    },
    "&:active": {
        opacity: "0.6"
    }
});
const StyledBadge = (0,_nextui_org_react__WEBPACK_IMPORTED_MODULE_0__.styled)("span", {
    display: "inline-block",
    textTransform: "uppercase",
    padding: "$2 $3",
    margin: "0 2px",
    fontSize: "10px",
    fontWeight: "$bold",
    borderRadius: "14px",
    letterSpacing: "0.6px",
    lineHeight: 1,
    boxShadow: "1px 2px 5px 0px rgb(0 0 0 / 5%)",
    alignItems: "center",
    alignSelf: "center",
    color: "$white",
    variants: {
        type: {
            active: {
                bg: "$successLight",
                color: "$successLightContrast"
            },
            paused: {
                bg: "$errorLight",
                color: "$errorLightContrast"
            },
            vacation: {
                bg: "$warningLight",
                color: "$warningLightContrast"
            }
        }
    },
    defaultVariants: {
        type: "active"
    }
});


/***/ })

};
;