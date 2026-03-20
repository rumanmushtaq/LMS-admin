"use strict";
exports.id = 336;
exports.ids = [336];
exports.modules = {

/***/ 8609:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "y": () => (/* binding */ TableWrapper)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: external "@nextui-org/react"
var react_ = __webpack_require__(6735);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
// EXTERNAL MODULE: ./components/styles/box.ts
var box = __webpack_require__(4660);
;// CONCATENATED MODULE: ./components/table/data.ts
const columns = [
    {
        name: "NAME",
        uid: "name"
    },
    {
        name: "ROLE",
        uid: "role"
    },
    {
        name: "STATUS",
        uid: "status"
    },
    {
        name: "ACTIONS",
        uid: "actions"
    }, 
];
const users = [
    {
        id: 1,
        name: "Tony Reichert",
        role: "CEO",
        team: "Management",
        status: "active",
        age: "29",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        email: "tony.reichert@example.com"
    },
    {
        id: 2,
        name: "Zoey Lang",
        role: "Technical Lead",
        team: "Development",
        status: "paused",
        age: "25",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        email: "zoey.lang@example.com"
    },
    {
        id: 3,
        name: "Jane Fisher",
        role: "Senior Developer",
        team: "Development",
        status: "active",
        age: "22",
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
        email: "jane.fisher@example.com"
    },
    {
        id: 4,
        name: "William Howard",
        role: "Community Manager",
        team: "Marketing",
        status: "vacation",
        age: "28",
        avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
        email: "william.howard@example.com"
    },
    {
        id: 5,
        name: "Kristen Copper",
        role: "Sales Manager",
        team: "Sales",
        status: "active",
        age: "24",
        avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
        email: "kristen.cooper@example.com"
    },
    {
        id: 6,
        name: "Tony Reichert",
        role: "CEO",
        team: "Management",
        status: "active",
        age: "29",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        email: "tony.reichert@example.com"
    },
    {
        id: 10,
        name: "Kristen Copper",
        role: "Sales Manager",
        team: "Sales",
        status: "active",
        age: "24",
        avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
        email: "kristen.cooper@example.com"
    },
    {
        id: 8,
        name: "Jane Fisher",
        role: "Senior Developer",
        team: "Development",
        status: "active",
        age: "22",
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
        email: "jane.fisher@example.com"
    },
    {
        id: 7,
        name: "Zoey Lang",
        role: "Technical Lead",
        team: "Development",
        status: "paused",
        age: "25",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        email: "zoey.lang@example.com"
    },
    {
        id: 9,
        name: "William Howard",
        role: "Community Manager",
        team: "Marketing",
        status: "vacation",
        age: "28",
        avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
        email: "william.howard@example.com"
    },
    {
        id: 11,
        name: "Tony Reichert",
        role: "CEO",
        team: "Management",
        status: "active",
        age: "29",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        email: "tony.reichert@example.com"
    },
    {
        id: 12,
        name: "Kristen Copper",
        role: "Sales Manager",
        team: "Sales",
        status: "active",
        age: "24",
        avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
        email: "kristen.cooper@example.com"
    },
    {
        id: 13,
        name: "Jane Fisher",
        role: "Senior Developer",
        team: "Development",
        status: "active",
        age: "22",
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
        email: "jane.fisher@example.com"
    },
    {
        id: 14,
        name: "Zoey Lang",
        role: "Technical Lead",
        team: "Development",
        status: "paused",
        age: "25",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        email: "zoey.lang@example.com"
    },
    {
        id: 15,
        name: "Tony Reichert",
        role: "CEO",
        team: "Management",
        status: "active",
        age: "29",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        email: "tony.reichert@example.com"
    },
    {
        id: 16,
        name: "Kristen Copper",
        role: "Sales Manager",
        team: "Sales",
        status: "active",
        age: "24",
        avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
        email: "kristen.cooper@example.com"
    }, 
];

;// CONCATENATED MODULE: ./components/icons/table/delete-icon.tsx

const DeleteIcon = ({ fill , size , height , width , ...props })=>{
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("svg", {
        width: size || width || 24,
        height: size || height || 24,
        viewBox: "0 0 20 20",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        ...props,
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("path", {
                d: "M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332",
                stroke: fill,
                strokeWidth: 1.5,
                strokeLinecap: "round",
                strokeLinejoin: "round"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("path", {
                d: "M7.08331 4.14169L7.26665 3.05002C7.39998 2.25835 7.49998 1.66669 8.90831 1.66669H11.0916C12.5 1.66669 12.6083 2.29169 12.7333 3.05835L12.9166 4.14169",
                stroke: fill,
                strokeWidth: 1.5,
                strokeLinecap: "round",
                strokeLinejoin: "round"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("path", {
                d: "M15.7084 7.61664L15.1667 16.0083C15.075 17.3166 15 18.3333 12.675 18.3333H7.32502C5.00002 18.3333 4.92502 17.3166 4.83335 16.0083L4.29169 7.61664",
                stroke: fill,
                strokeWidth: 1.5,
                strokeLinecap: "round",
                strokeLinejoin: "round"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("path", {
                d: "M8.60834 13.75H11.3833",
                stroke: fill,
                strokeWidth: 1.5,
                strokeLinecap: "round",
                strokeLinejoin: "round"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("path", {
                d: "M7.91669 10.4167H12.0834",
                stroke: fill,
                strokeWidth: 1.5,
                strokeLinecap: "round",
                strokeLinejoin: "round"
            })
        ]
    });
};

// EXTERNAL MODULE: ./components/icons/table/edit-icon.tsx
var edit_icon = __webpack_require__(6331);
// EXTERNAL MODULE: ./components/icons/table/eye-icon.tsx
var eye_icon = __webpack_require__(4677);
// EXTERNAL MODULE: ./components/table/table.styled.ts
var table_styled = __webpack_require__(7879);
;// CONCATENATED MODULE: ./components/table/render-cell.tsx







const RenderCell = ({ user , columnKey  })=>{
    // @ts-ignore
    const cellValue = user[columnKey];
    switch(columnKey){
        case "name":
            return /*#__PURE__*/ jsx_runtime_.jsx(react_.User, {
                squared: true,
                src: user.avatar,
                name: cellValue,
                css: {
                    p: 0
                },
                children: user.email
            });
        case "role":
            return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(react_.Col, {
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(react_.Row, {
                        children: /*#__PURE__*/ jsx_runtime_.jsx(react_.Text, {
                            b: true,
                            size: 14,
                            css: {
                                tt: "capitalize"
                            },
                            children: cellValue
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(react_.Row, {
                        children: /*#__PURE__*/ jsx_runtime_.jsx(react_.Text, {
                            b: true,
                            size: 13,
                            css: {
                                tt: "capitalize",
                                color: "$accents7"
                            },
                            children: user.team
                        })
                    })
                ]
            });
        case "status":
            return(// @ts-ignore
            /*#__PURE__*/ jsx_runtime_.jsx(table_styled/* StyledBadge */.j, {
                type: String(user.status),
                children: cellValue
            }));
        case "actions":
            return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(react_.Row, {
                justify: "center",
                align: "center",
                css: {
                    "gap": "$8",
                    "@md": {
                        gap: 0
                    }
                },
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(react_.Col, {
                        css: {
                            d: "flex"
                        },
                        children: /*#__PURE__*/ jsx_runtime_.jsx(react_.Tooltip, {
                            content: "Details",
                            children: /*#__PURE__*/ jsx_runtime_.jsx(table_styled/* IconButton */.h, {
                                onClick: ()=>console.log("View user", user.id),
                                children: /*#__PURE__*/ jsx_runtime_.jsx(eye_icon/* EyeIcon */.t, {
                                    size: 20,
                                    fill: "#979797"
                                })
                            })
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(react_.Col, {
                        css: {
                            d: "flex"
                        },
                        children: /*#__PURE__*/ jsx_runtime_.jsx(react_.Tooltip, {
                            content: "Edit user",
                            children: /*#__PURE__*/ jsx_runtime_.jsx(table_styled/* IconButton */.h, {
                                onClick: ()=>console.log("Edit user", user.id),
                                children: /*#__PURE__*/ jsx_runtime_.jsx(edit_icon/* EditIcon */.d, {
                                    size: 20,
                                    fill: "#979797"
                                })
                            })
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(react_.Col, {
                        css: {
                            d: "flex"
                        },
                        children: /*#__PURE__*/ jsx_runtime_.jsx(react_.Tooltip, {
                            content: "Delete user",
                            color: "error",
                            onClick: ()=>console.log("Delete user", user.id),
                            children: /*#__PURE__*/ jsx_runtime_.jsx(table_styled/* IconButton */.h, {
                                children: /*#__PURE__*/ jsx_runtime_.jsx(DeleteIcon, {
                                    size: 20,
                                    fill: "#FF0080"
                                })
                            })
                        })
                    })
                ]
            });
        default:
            return cellValue;
    }
};

;// CONCATENATED MODULE: ./components/table/table.tsx






const TableWrapper = ()=>{
    return /*#__PURE__*/ jsx_runtime_.jsx(box/* Box */.x, {
        css: {
            "& .nextui-table-container": {
                boxShadow: "none"
            }
        },
        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)(react_.Table, {
            "aria-label": "Example table with custom cells",
            css: {
                height: "auto",
                minWidth: "100%",
                boxShadow: "none",
                width: "100%",
                px: 0
            },
            selectionMode: "multiple",
            children: [
                /*#__PURE__*/ jsx_runtime_.jsx(react_.Table.Header, {
                    columns: columns,
                    children: (column)=>/*#__PURE__*/ jsx_runtime_.jsx(react_.Table.Column, {
                            hideHeader: column.uid === "actions",
                            align: column.uid === "actions" ? "center" : "start",
                            children: column.name
                        }, column.uid)
                }),
                /*#__PURE__*/ jsx_runtime_.jsx(react_.Table.Body, {
                    items: users,
                    children: (item)=>/*#__PURE__*/ jsx_runtime_.jsx(react_.Table.Row, {
                            children: (columnKey)=>/*#__PURE__*/ jsx_runtime_.jsx(react_.Table.Cell, {
                                    children: RenderCell({
                                        user: item,
                                        columnKey: columnKey
                                    })
                                })
                        }, item.id)
                }),
                /*#__PURE__*/ jsx_runtime_.jsx(react_.Table.Pagination, {
                    shadow: true,
                    noMargin: true,
                    align: "center",
                    rowsPerPage: 8,
                    onPageChange: (page)=>console.log({
                            page
                        })
                })
            ]
        })
    });
};


/***/ })

};
;