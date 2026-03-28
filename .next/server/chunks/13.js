"use strict";
exports.id = 13;
exports.ids = [13];
exports.modules = {

/***/ 3350:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "o": () => (/* binding */ TableFilters)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _nextui_org_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6735);
/* harmony import */ var _nextui_org_react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_nextui_org_react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _styles_flex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7600);
/* harmony import */ var _icons_accounts_export_icon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3757);





const TableFilters = ({ searchTerm , onSearchChange , startDate , onStartDateChange , endDate , onEndDateChange , status , onStatusChange , statusOptions , onExport , addButton  })=>{
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_styles_flex__WEBPACK_IMPORTED_MODULE_3__/* .Flex */ .k, {
        css: {
            gap: "$8",
            py: "$6",
            px: "$6",
            bg: "$accents0",
            borderRadius: "$xl",
            mb: "$6"
        },
        justify: "between",
        align: "center",
        wrap: "wrap",
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_styles_flex__WEBPACK_IMPORTED_MODULE_3__/* .Flex */ .k, {
                css: {
                    gap: "$6",
                    flex: 1,
                    minWidth: "300px"
                },
                align: "center",
                wrap: "wrap",
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_nextui_org_react__WEBPACK_IMPORTED_MODULE_1__.Input, {
                        clearable: true,
                        bordered: true,
                        placeholder: "Search...",
                        value: searchTerm,
                        onChange: (e)=>onSearchChange(e.target.value),
                        css: {
                            width: "100%",
                            maxW: "400px"
                        }
                    }),
                    statusOptions && onStatusChange && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_nextui_org_react__WEBPACK_IMPORTED_MODULE_1__.Dropdown, {
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_nextui_org_react__WEBPACK_IMPORTED_MODULE_1__.Dropdown.Button, {
                                flat: true,
                                color: "secondary",
                                css: {
                                    tt: "capitalize"
                                },
                                children: status || "All Status"
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_nextui_org_react__WEBPACK_IMPORTED_MODULE_1__.Dropdown.Menu, {
                                "aria-label": "Status Filter",
                                onAction: onStatusChange,
                                selectedKeys: status ? [
                                    status
                                ] : [],
                                children: [
                                    {
                                        key: "all",
                                        label: "All Status"
                                    },
                                    ...statusOptions
                                ].map((opt)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_nextui_org_react__WEBPACK_IMPORTED_MODULE_1__.Dropdown.Item, {
                                        children: opt.label
                                    }, opt.key))
                            })
                        ]
                    }),
                    onStartDateChange && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_nextui_org_react__WEBPACK_IMPORTED_MODULE_1__.Input, {
                        type: "date",
                        bordered: true,
                        labelLeft: "From",
                        value: startDate,
                        onChange: (e)=>onStartDateChange(e.target.value),
                        css: {
                            maxW: "180px"
                        }
                    }),
                    onEndDateChange && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_nextui_org_react__WEBPACK_IMPORTED_MODULE_1__.Input, {
                        type: "date",
                        bordered: true,
                        labelLeft: "To",
                        value: endDate,
                        onChange: (e)=>onEndDateChange(e.target.value),
                        css: {
                            maxW: "180px"
                        }
                    })
                ]
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_styles_flex__WEBPACK_IMPORTED_MODULE_3__/* .Flex */ .k, {
                direction: "row",
                css: {
                    gap: "$6"
                },
                wrap: "wrap",
                children: [
                    addButton,
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_nextui_org_react__WEBPACK_IMPORTED_MODULE_1__.Button, {
                        auto: true,
                        flat: true,
                        iconRight: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_icons_accounts_export_icon__WEBPACK_IMPORTED_MODULE_4__/* .ExportIcon */ .H, {}),
                        onClick: onExport,
                        css: {
                            bg: "#7047EB",
                            color: "$white"
                        },
                        children: "Export"
                    })
                ]
            })
        ]
    });
};


/***/ }),

/***/ 8665:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_apiConfig__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4116);
/* harmony import */ var _utils_axiosClient__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6063);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_utils_axiosClient__WEBPACK_IMPORTED_MODULE_1__]);
_utils_axiosClient__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];


class AdminService {
    /**
   * GET /api/v1/admin/dashboard/stats
   */ async getDashboardStats() {
        const { data  } = await _utils_axiosClient__WEBPACK_IMPORTED_MODULE_1__/* .HTTP_CLIENT.get */ .bV.get(_utils_apiConfig__WEBPACK_IMPORTED_MODULE_0__/* ["default"].Admin.DASHBOARD_STATS */ .Z.Admin.DASHBOARD_STATS);
        return data;
    }
    /**
   * GET /api/v1/admin/users
   * Supports pagination and filters via query params
   */ async getUsers(query = {}) {
        const params = new URLSearchParams();
        if (query.role) params.append("role", query.role);
        if (query.status) params.append("status", query.status);
        if (query.search) params.append("search", query.search);
        if (query.page) params.append("page", String(query.page));
        if (query.limit) params.append("limit", String(query.limit));
        if (query.sortBy) params.append("sortBy", query.sortBy);
        if (query.sortOrder) params.append("sortOrder", query.sortOrder);
        const { data  } = await _utils_axiosClient__WEBPACK_IMPORTED_MODULE_1__/* .HTTP_CLIENT.get */ .bV.get(`${_utils_apiConfig__WEBPACK_IMPORTED_MODULE_0__/* ["default"].Admin.USERS */ .Z.Admin.USERS}?${params.toString()}`);
        return data;
    }
    /**
   * GET /api/v1/admin/users/:id
   */ async getUserById(id) {
        const { data  } = await _utils_axiosClient__WEBPACK_IMPORTED_MODULE_1__/* .HTTP_CLIENT.get */ .bV.get(_utils_apiConfig__WEBPACK_IMPORTED_MODULE_0__/* ["default"].Admin.USER_BY_ID */ .Z.Admin.USER_BY_ID(id));
        return data;
    }
    /**
   * PATCH /api/v1/admin/users/:id/status
   */ async updateUserStatus(id, status) {
        const { data  } = await _utils_axiosClient__WEBPACK_IMPORTED_MODULE_1__/* .HTTP_CLIENT.patch */ .bV.patch(_utils_apiConfig__WEBPACK_IMPORTED_MODULE_0__/* ["default"].Admin.UPDATE_USER_STATUS */ .Z.Admin.UPDATE_USER_STATUS(id), {
            status
        });
        return data;
    }
    /**
   * PATCH /api/v1/admin/users/:id/role
   */ async updateUserRole(id, role) {
        const { data  } = await _utils_axiosClient__WEBPACK_IMPORTED_MODULE_1__/* .HTTP_CLIENT.patch */ .bV.patch(_utils_apiConfig__WEBPACK_IMPORTED_MODULE_0__/* ["default"].Admin.UPDATE_USER_ROLE */ .Z.Admin.UPDATE_USER_ROLE(id), {
            role
        });
        return data;
    }
    /**
   * POST /api/v1/admin/users/:id/suspend
   */ async suspendUser(id) {
        const { data  } = await _utils_axiosClient__WEBPACK_IMPORTED_MODULE_1__/* .HTTP_CLIENT.post */ .bV.post(_utils_apiConfig__WEBPACK_IMPORTED_MODULE_0__/* ["default"].Admin.SUSPEND_USER */ .Z.Admin.SUSPEND_USER(id));
        return data;
    }
    /**
   * POST /api/v1/admin/users/:id/activate
   */ async activateUser(id) {
        const { data  } = await _utils_axiosClient__WEBPACK_IMPORTED_MODULE_1__/* .HTTP_CLIENT.post */ .bV.post(_utils_apiConfig__WEBPACK_IMPORTED_MODULE_0__/* ["default"].Admin.ACTIVATE_USER */ .Z.Admin.ACTIVATE_USER(id));
        return data;
    }
    /**
   * DELETE /api/v1/admin/users/:id
   */ async deleteUser(id) {
        const { data  } = await _utils_axiosClient__WEBPACK_IMPORTED_MODULE_1__/* .HTTP_CLIENT["delete"] */ .bV["delete"](_utils_apiConfig__WEBPACK_IMPORTED_MODULE_0__/* ["default"].Admin.DELETE_USER */ .Z.Admin.DELETE_USER(id));
        return data;
    }
    /**
   * PATCH /api/v1/admin/users/:id
   */ async updateUser(id, updateData) {
        const { data  } = await _utils_axiosClient__WEBPACK_IMPORTED_MODULE_1__/* .HTTP_CLIENT.patch */ .bV.patch(_utils_apiConfig__WEBPACK_IMPORTED_MODULE_0__/* ["default"].Admin.UPDATE_USER */ .Z.Admin.UPDATE_USER(id), updateData);
        return data;
    }
    /**
   * POST /api/v1/admin/users/admin
   */ async createAdmin(adminData) {
        const { data  } = await _utils_axiosClient__WEBPACK_IMPORTED_MODULE_1__/* .HTTP_CLIENT.post */ .bV.post(_utils_apiConfig__WEBPACK_IMPORTED_MODULE_0__/* ["default"].Admin.CREATE_ADMIN */ .Z.Admin.CREATE_ADMIN, adminData);
        return data;
    }
    // =====================
    // STUDENT MANAGEMENT
    // =====================
    /**
   * GET /api/v1/admin/students
   */ async getStudents(query = {}) {
        const params = new URLSearchParams();
        if (query.search) params.append("search", query.search);
        if (query.status) params.append("status", query.status);
        if (query.startDate) params.append("startDate", query.startDate);
        if (query.endDate) params.append("endDate", query.endDate);
        if (query.page) params.append("page", String(query.page));
        if (query.limit) params.append("limit", String(query.limit));
        if (query.sortBy) params.append("sortBy", query.sortBy);
        if (query.sortOrder) params.append("sortOrder", query.sortOrder);
        if (query.emailVerified !== undefined) params.append("emailVerified", String(query.emailVerified));
        const { data  } = await _utils_axiosClient__WEBPACK_IMPORTED_MODULE_1__/* .HTTP_CLIENT.get */ .bV.get(`${_utils_apiConfig__WEBPACK_IMPORTED_MODULE_0__/* ["default"].Students.STUDENTS */ .Z.Students.STUDENTS}?${params.toString()}`);
        return data;
    }
    /**
   * GET /api/v1/admin/students/:id
   */ async getStudentById(id) {
        const { data  } = await _utils_axiosClient__WEBPACK_IMPORTED_MODULE_1__/* .HTTP_CLIENT.get */ .bV.get(_utils_apiConfig__WEBPACK_IMPORTED_MODULE_0__/* ["default"].Students.STUDENT_BY_ID */ .Z.Students.STUDENT_BY_ID(id));
        return data;
    }
    /**
   * PATCH /api/v1/admin/students/:id
   */ async updateStudent(id, updateData) {
        const { data  } = await _utils_axiosClient__WEBPACK_IMPORTED_MODULE_1__/* .HTTP_CLIENT.patch */ .bV.patch(_utils_apiConfig__WEBPACK_IMPORTED_MODULE_0__/* ["default"].Students.UPDATE_STUDENT */ .Z.Students.UPDATE_STUDENT(id), updateData);
        return data;
    }
    /**
   * PATCH /api/v1/admin/students/:id/status
   */ async updateStudentStatus(id, status) {
        const { data  } = await _utils_axiosClient__WEBPACK_IMPORTED_MODULE_1__/* .HTTP_CLIENT.patch */ .bV.patch(_utils_apiConfig__WEBPACK_IMPORTED_MODULE_0__/* ["default"].Students.UPDATE_STUDENT_STATUS */ .Z.Students.UPDATE_STUDENT_STATUS(id), {
            status
        });
        return data;
    }
    /**
   * POST /api/v1/admin/students/:id/suspend
   */ async suspendStudent(id) {
        const { data  } = await _utils_axiosClient__WEBPACK_IMPORTED_MODULE_1__/* .HTTP_CLIENT.post */ .bV.post(_utils_apiConfig__WEBPACK_IMPORTED_MODULE_0__/* ["default"].Students.SUSPEND_STUDENT */ .Z.Students.SUSPEND_STUDENT(id));
        return data;
    }
    /**
   * POST /api/v1/admin/students/:id/activate
   */ async activateStudent(id) {
        const { data  } = await _utils_axiosClient__WEBPACK_IMPORTED_MODULE_1__/* .HTTP_CLIENT.post */ .bV.post(_utils_apiConfig__WEBPACK_IMPORTED_MODULE_0__/* ["default"].Students.ACTIVATE_STUDENT */ .Z.Students.ACTIVATE_STUDENT(id));
        return data;
    }
    /**
   * DELETE /api/v1/admin/students/:id
   */ async deleteStudent(id) {
        const { data  } = await _utils_axiosClient__WEBPACK_IMPORTED_MODULE_1__/* .HTTP_CLIENT["delete"] */ .bV["delete"](_utils_apiConfig__WEBPACK_IMPORTED_MODULE_0__/* ["default"].Students.DELETE_STUDENT */ .Z.Students.DELETE_STUDENT(id));
        return data;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new AdminService());

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;