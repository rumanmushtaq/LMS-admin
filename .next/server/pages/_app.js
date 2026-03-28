"use strict";
(() => {
var exports = {};
exports.id = 888;
exports.ids = [888];
exports.modules = {

/***/ 5136:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "A": () => (/* binding */ Layout)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
var external_react_default = /*#__PURE__*/__webpack_require__.n(external_react_);
;// CONCATENATED MODULE: ./components/hooks/useIsomorphicLayoutEffect.ts

const useIsomorphicLayoutEffect =  false ? 0 : external_react_.useEffect;

;// CONCATENATED MODULE: ./components/hooks/useBodyLock.ts


const useLockedBody = (initialLocked = false)=>{
    const { 0: locked , 1: setLocked  } = (0,external_react_.useState)(initialLocked);
    // Do the side effect before render
    useIsomorphicLayoutEffect(()=>{
        if (!locked) {
            return;
        }
        // Save initial body style
        const originalOverflow = document.body.style.overflow;
        const originalPaddingRight = document.body.style.paddingRight;
        // Lock body scroll
        document.body.style.overflow = "hidden";
        // Get the scrollBar width
        const root = document.getElementById("___gatsby"); // or root
        const scrollBarWidth = root ? root.offsetWidth - root.scrollWidth : 0;
        // Avoid width reflow
        if (scrollBarWidth) {
            document.body.style.paddingRight = `${scrollBarWidth}px`;
        }
        return ()=>{
            document.body.style.overflow = originalOverflow;
            if (scrollBarWidth) {
                document.body.style.paddingRight = originalPaddingRight;
            }
        };
    }, [
        locked
    ]);
    // Update state if initialValue changes
    (0,external_react_.useEffect)(()=>{
        if (locked !== initialLocked) {
            setLocked(initialLocked);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        initialLocked
    ]);
    return [
        locked,
        setLocked
    ];
};

// EXTERNAL MODULE: external "@nextui-org/react"
var react_ = __webpack_require__(6735);
// EXTERNAL MODULE: ./components/styles/svg.ts
var svg = __webpack_require__(5086);
;// CONCATENATED MODULE: ./components/icons/navbar/feedback-icon.tsx



const FeedbackIcon = ()=>{
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(svg/* Svg */.n, {
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        css: {
            "& path": {
                fill: "$accents6"
            }
        },
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("path", {
                d: "M19.805 4.40893C19.8075 4.41143 19.81 4.41393 19.81 4.41893C20.13 4.85893 20.05 5.47893 19.62 5.79893C19.4633 5.91722 19.3039 6.03813 19.1435 6.15985C18.7614 6.44975 18.3733 6.74426 18 7.01893C17.56 7.34893 16.95 7.25893 16.62 6.81893C16.62 6.81393 16.6175 6.81143 16.615 6.80893C16.6125 6.80643 16.61 6.80393 16.61 6.79893C16.28 6.36893 16.36 5.74893 16.8 5.41893C17.1312 5.16416 17.4827 4.90128 17.8312 4.64062C18.0299 4.49203 18.2276 4.34416 18.42 4.19893C18.85 3.86893 19.47 3.95893 19.8 4.39893C19.8 4.40393 19.8025 4.40643 19.805 4.40893Z",
                fill: "#969696"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("path", {
                d: "M18 11.6089C18 12.1589 18.45 12.6089 19 12.6089H21C21.55 12.6089 22 12.1589 22 11.6089C22 11.0589 21.55 10.6089 21 10.6089H19C18.45 10.6089 18 11.0589 18 11.6089Z",
                fill: "#969696"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("path", {
                d: "M16.59 16.4288C16.26 16.8688 16.35 17.4788 16.79 17.7988C17.32 18.1888 17.88 18.6088 18.41 19.0088C18.85 19.3388 19.47 19.2488 19.79 18.8088C19.79 18.8038 19.7925 18.8013 19.795 18.7988C19.7975 18.7963 19.8 18.7938 19.8 18.7888C20.13 18.3488 20.04 17.7288 19.6 17.4088C19.0718 17.0101 18.5137 16.5915 17.9952 16.2026L17.99 16.1988C17.55 15.8688 16.93 15.9688 16.6 16.4088C16.6 16.4188 16.59 16.4288 16.59 16.4288Z",
                fill: "#969696"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("path", {
                d: "M8 8.60889H4C2.9 8.60889 2 9.50889 2 10.6089V12.6089C2 13.7089 2.9 14.6089 4 14.6089H5V17.6089C5 18.1589 5.45 18.6089 6 18.6089C6.55 18.6089 7 18.1589 7 17.6089V14.6089H8L13 17.6089V5.60889L8 8.60889Z",
                fill: "#969696"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("path", {
                d: "M14 8.25879C14.92 9.07879 15.5 10.2788 15.5 11.6088C15.5 12.9388 14.92 14.1388 14 14.9488V8.25879Z",
                fill: "#969696"
            })
        ]
    });
};

;// CONCATENATED MODULE: ./components/icons/navbar/github-icon.tsx



const GithubIcon = ()=>{
    return /*#__PURE__*/ jsx_runtime_.jsx(svg/* Svg */.n, {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        children: /*#__PURE__*/ jsx_runtime_.jsx(svg/* Svg.Path */.n.Path, {
            css: {
                fill: "$accents6"
            },
            fillRule: "evenodd",
            clipRule: "evenodd",
            d: "M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
        })
    });
};

;// CONCATENATED MODULE: ./components/icons/navbar/support-icon.tsx



const SupportIcon = ()=>{
    return /*#__PURE__*/ jsx_runtime_.jsx(svg/* Svg */.n, {
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        css: {
            "& path": {
                fill: "$accents6"
            }
        },
        children: /*#__PURE__*/ jsx_runtime_.jsx("path", {
            fillRule: "evenodd",
            clipRule: "evenodd",
            d: "M11.5 2C6.81 2 3 5.81 3 10.5C3 15.19 6.81 19 11.5 19H12V22C16.86 19.66 20 15 20 10.5C20 5.81 16.19 2 11.5 2ZM12.5 16.5H10.5V14.5H12.5V16.5ZM12.9 11.72C12.89 11.73 12.88 11.75 12.87 11.77C12.82 11.85 12.77 11.93 12.73 12.01C12.71 12.04 12.7 12.08 12.69 12.12C12.66 12.19 12.63 12.26 12.61 12.33C12.54 12.54 12.51 12.76 12.51 13.01H10.5C10.5 12.5 10.58 12.07 10.7 11.71C10.7 11.7 10.7 11.69 10.71 11.68C10.72 11.64 10.75 11.62 10.76 11.58C10.82 11.42 10.89 11.28 10.98 11.14C11.01 11.09 11.05 11.04 11.08 10.99C11.11 10.95 11.13 10.9 11.16 10.87L11.17 10.88C12.01 9.78 13.38 9.44 13.49 8.2C13.58 7.22 12.88 6.27 11.92 6.07C10.88 5.85 9.94 6.46 9.62 7.35C9.48 7.71 9.15 8 8.74 8H8.54C7.94 8 7.5 7.41 7.67 6.83C8.22 5.01 10.04 3.74 12.1 4.04C13.79 4.29 15.14 5.68 15.43 7.37C15.87 9.81 13.8 10.4 12.9 11.72Z",
            fill: "#969696"
        })
    });
};

;// CONCATENATED MODULE: ./components/icons/searchicon.tsx


const SearchIcon = ({ size , fill , width =24 , height =24 , ...props })=>{
    return /*#__PURE__*/ jsx_runtime_.jsx("svg", {
        fill: "none",
        height: size || height,
        viewBox: "0 0 24 24",
        width: size || width,
        ...props,
        children: /*#__PURE__*/ jsx_runtime_.jsx("path", {
            d: "M11.5 21a9.5 9.5 0 1 0 0-19 9.5 9.5 0 0 0 0 19ZM22 22l-2-2",
            stroke: fill,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2
        })
    });
};

// EXTERNAL MODULE: ./components/styles/box.ts
var box = __webpack_require__(4660);
// EXTERNAL MODULE: ./components/styles/flex.ts
var flex = __webpack_require__(7600);
;// CONCATENATED MODULE: ./components/layout/layout-context.ts

const SidebarContext = (0,external_react_.createContext)({
    collapsed: false,
    setCollapsed: ()=>{}
});
const useSidebarContext = ()=>{
    return (0,external_react_.useContext)(SidebarContext);
};

;// CONCATENATED MODULE: ./components/navbar/navbar.styles.ts

const SidebarWrapper = (0,react_.styled)("div", {
    overflow: "hidden",
    height: "100vh",
    display: "flex"
});
const StyledBurgerButton = (0,react_.styled)("button", {
    "position": "absolute",
    "display": "flex",
    "flexDirection": "column",
    "justifyContent": "space-around",
    "width": "22px",
    "height": "22px",
    "background": "transparent",
    "border": "none",
    "cursor": "pointer",
    "padding": "0",
    "zIndex": "202",
    "&:focus": {
        outline: "none"
    },
    "& div": {
        "width": "22px",
        "height": "1px",
        "background": "$accents9",
        "borderRadius": "10px",
        "transition": "all 0.3s ease",
        "position": "relative",
        "transformOrigin": "1px",
        "&:first-child": {
            transform: "translateY(-4px) rotate(0deg)",
            height: "1px",
            marginTop: "10px"
        },
        "&:nth-child(2)": {
            transform: "translateY(4px) rotate(0deg)",
            height: "1px",
            marginBottom: "10px"
        }
    },
    "variants": {
        open: {
            true: {
                "& div": {
                    "&:first-child": {
                        marginTop: "0px",
                        transform: "translateY(1px) rotate(45deg)"
                    },
                    "&:nth-child(2)": {
                        marginBottom: "0px",
                        transform: "translateY(4px) rotate(-45deg)"
                    }
                }
            }
        }
    }
});

;// CONCATENATED MODULE: ./components/navbar/burguer-button.tsx




const BurguerButton = ()=>{
    const { collapsed , setCollapsed  } = useSidebarContext();
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(StyledBurgerButton, {
        open: collapsed,
        onClick: setCollapsed,
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("div", {}),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {})
        ]
    });
};

;// CONCATENATED MODULE: ./components/icons/navbar/notificationicon.tsx



const NotificationIcon = ()=>{
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(svg/* Svg */.n, {
        width: "28",
        height: "24",
        viewBox: "0 0 28 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        css: {
            cursor: "pointer"
        },
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx(svg/* Svg.Path */.n.Path, {
                fillRule: "evenodd",
                clipRule: "evenodd",
                d: "M12.0005 22C13.1005 22 14.0005 21.1 14.0005 20H10.0005C10.0005 21.1 10.8905 22 12.0005 22ZM18.0005 16V11C18.0005 7.93 16.3605 5.36 13.5005 4.68V4C13.5005 3.17 12.8305 2.5 12.0005 2.5C11.1705 2.5 10.5005 3.17 10.5005 4V4.68C7.63054 5.36 6.00054 7.92 6.00054 11V16L4.71054 17.29C4.08054 17.92 4.52054 19 5.41054 19H18.5805C19.4705 19 19.9205 17.92 19.2905 17.29L18.0005 16Z",
                css: {
                    fill: "$accents6"
                }
            }),
            /*#__PURE__*/ jsx_runtime_.jsx(svg/* Svg.Rect */.n.Rect, {
                css: {
                    fill: "$red600"
                },
                x: "13",
                width: "15",
                height: "16",
                rx: "7.5"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx(svg/* Svg.Path */.n.Path, {
                d: "M18.0408 12V11.0483L20.5657 8.57315C20.8072 8.32931 21.0084 8.11269 21.1694 7.9233C21.3304 7.7339 21.4511 7.55043 21.5316 7.37287C21.6121 7.19531 21.6523 7.00592 21.6523 6.80469C21.6523 6.57505 21.6003 6.37855 21.4961 6.2152C21.3919 6.04948 21.2487 5.92164 21.0664 5.83168C20.8841 5.74171 20.677 5.69673 20.445 5.69673C20.2058 5.69673 19.9963 5.74645 19.8164 5.84588C19.6365 5.94294 19.4968 6.08144 19.3974 6.26136C19.3003 6.44129 19.2518 6.65554 19.2518 6.90412H17.9982C17.9982 6.44247 18.1036 6.04119 18.3143 5.70028C18.525 5.35937 18.815 5.09541 19.1843 4.90838C19.556 4.72135 19.9821 4.62784 20.4627 4.62784C20.9504 4.62784 21.3789 4.71899 21.7482 4.90128C22.1175 5.08357 22.404 5.33333 22.6076 5.65057C22.8136 5.9678 22.9165 6.33002 22.9165 6.73722C22.9165 7.00947 22.8645 7.27699 22.7603 7.53977C22.6561 7.80256 22.4727 8.09375 22.2099 8.41335C21.9495 8.73295 21.5837 9.12003 21.1126 9.57457L19.859 10.8494V10.8991H23.0266V12H18.0408Z",
                fill: "white"
            })
        ]
    });
};

;// CONCATENATED MODULE: ./components/navbar/notifications-dropdown.tsx




const NotificationsDropdown = ()=>{
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(react_.Dropdown, {
        placement: "bottom-right",
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx(react_.Navbar.Item, {
                children: /*#__PURE__*/ jsx_runtime_.jsx(react_.Dropdown.Trigger, {
                    children: /*#__PURE__*/ jsx_runtime_.jsx("button", {
                        "aria-label": "Notifications",
                        className: "bg-transparent border-none p-0 cursor-pointer outline-none flex items-center justify-center",
                        children: /*#__PURE__*/ jsx_runtime_.jsx(NotificationIcon, {})
                    })
                })
            }),
            /*#__PURE__*/ jsx_runtime_.jsx(react_.Dropdown.Menu, {
                "aria-label": "Avatar Actions",
                css: {
                    "$$dropdownMenuWidth": "340px",
                    "$$dropdownItemHeight": "70px",
                    "& .nextui-dropdown-item": {
                        "py": "$4",
                        // dropdown item left icon
                        "svg": {
                            color: "$secondary",
                            mr: "$4"
                        },
                        // dropdown item title
                        "& .nextui-dropdown-item-content": {
                            w: "100%",
                            fontWeight: "$semibold"
                        }
                    }
                },
                children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)(react_.Dropdown.Section, {
                    title: "Notificacions",
                    children: [
                        /*#__PURE__*/ jsx_runtime_.jsx(react_.Dropdown.Item, {
                            showFullDescription: true,
                            description: "Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
                            children: "\uD83D\uDCE3 Edit your information"
                        }, "1"),
                        /*#__PURE__*/ jsx_runtime_.jsx(react_.Dropdown.Item, {
                            showFullDescription: true,
                            description: "Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
                            children: "\uD83D\uDE80 Say goodbye to paper receipts!"
                        }, "2"),
                        /*#__PURE__*/ jsx_runtime_.jsx(react_.Dropdown.Item, {
                            showFullDescription: true,
                            description: "Sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
                            children: "\uD83D\uDCE3 Edit your information"
                        }, "3")
                    ]
                })
            })
        ]
    });
};

// EXTERNAL MODULE: external "next-themes"
var external_next_themes_ = __webpack_require__(1162);
;// CONCATENATED MODULE: ./components/navbar/darkmodeswitch.tsx




const DarkModeSwitch = ()=>{
    const { setTheme  } = (0,external_next_themes_.useTheme)();
    const { isDark , type  } = (0,react_.useTheme)();
    return /*#__PURE__*/ jsx_runtime_.jsx(react_.Switch, {
        checked: isDark,
        onChange: (e)=>setTheme(e.target.checked ? "dark" : "light")
    });
};

;// CONCATENATED MODULE: ./components/navbar/user-dropdown.tsx




const UserDropdown = ()=>{
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(react_.Dropdown, {
        placement: "bottom-right",
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx(react_.Navbar.Item, {
                children: /*#__PURE__*/ jsx_runtime_.jsx(react_.Dropdown.Trigger, {
                    children: /*#__PURE__*/ jsx_runtime_.jsx(react_.Avatar, {
                        bordered: true,
                        as: "button",
                        color: "secondary",
                        size: "md",
                        src: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
                    })
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)(react_.Dropdown.Menu, {
                "aria-label": "User menu actions",
                onAction: (actionKey)=>console.log({
                        actionKey
                    }),
                children: [
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)(react_.Dropdown.Item, {
                        css: {
                            height: "$18"
                        },
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx(react_.Text, {
                                b: true,
                                color: "inherit",
                                css: {
                                    d: "flex"
                                },
                                children: "Signed in as"
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx(react_.Text, {
                                b: true,
                                color: "inherit",
                                css: {
                                    d: "flex"
                                },
                                children: "zoey@example.com"
                            })
                        ]
                    }, "profile"),
                    /*#__PURE__*/ jsx_runtime_.jsx(react_.Dropdown.Item, {
                        withDivider: true,
                        children: "My Settings"
                    }, "settings"),
                    /*#__PURE__*/ jsx_runtime_.jsx(react_.Dropdown.Item, {
                        children: "Team Settings"
                    }, "team_settings"),
                    /*#__PURE__*/ jsx_runtime_.jsx(react_.Dropdown.Item, {
                        withDivider: true,
                        children: "Analytics"
                    }, "analytics"),
                    /*#__PURE__*/ jsx_runtime_.jsx(react_.Dropdown.Item, {
                        children: "System"
                    }, "system"),
                    /*#__PURE__*/ jsx_runtime_.jsx(react_.Dropdown.Item, {
                        children: "Configurations"
                    }, "configurations"),
                    /*#__PURE__*/ jsx_runtime_.jsx(react_.Dropdown.Item, {
                        withDivider: true,
                        children: "Help & Feedback"
                    }, "help_and_feedback"),
                    /*#__PURE__*/ jsx_runtime_.jsx(react_.Dropdown.Item, {
                        withDivider: true,
                        color: "error",
                        children: "Log Out"
                    }, "logout"),
                    /*#__PURE__*/ jsx_runtime_.jsx(react_.Dropdown.Item, {
                        withDivider: true,
                        children: /*#__PURE__*/ jsx_runtime_.jsx(DarkModeSwitch, {})
                    }, "switch")
                ]
            })
        ]
    });
};

;// CONCATENATED MODULE: ./components/navbar/navbar.tsx












const NavbarWrapper = ({ children  })=>{
    const collapseItems = [
        "Profile",
        "Dashboard",
        "Activity",
        "Analytics",
        "System",
        "Deployments",
        "My Settings",
        "Team Settings",
        "Help & Feedback",
        "Log Out", 
    ];
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(box/* Box */.x, {
        css: {
            position: "relative",
            display: "flex",
            flexDirection: "column",
            flex: "1 1 auto",
            overflowY: "auto",
            overflowX: "hidden"
        },
        children: [
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)(react_.Navbar, {
                isBordered: true,
                css: {
                    "borderBottom": "1px solid $border",
                    "justifyContent": "space-between",
                    "width": "100%",
                    "@md": {
                        justifyContent: "space-between"
                    },
                    "& .nextui-navbar-container": {
                        "border": "none",
                        "maxWidth": "100%",
                        "gap": "$6",
                        "@md": {
                            justifyContent: "space-between"
                        }
                    }
                },
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(react_.Navbar.Content, {
                        showIn: "md",
                        children: /*#__PURE__*/ jsx_runtime_.jsx(BurguerButton, {})
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(react_.Navbar.Content, {
                        hideIn: "md",
                        css: {
                            width: "100%"
                        },
                        children: /*#__PURE__*/ jsx_runtime_.jsx(react_.Input, {
                            "aria-label": "Search",
                            clearable: true,
                            contentLeft: /*#__PURE__*/ jsx_runtime_.jsx(SearchIcon, {
                                fill: "var(--nextui-colors-accents6)",
                                size: 16
                            }),
                            contentLeftStyling: false,
                            css: {
                                "w": "100%",
                                "transition": "all 0.2s ease",
                                "@xsMax": {
                                    w: "100%"
                                },
                                "& .nextui-input-content--left": {
                                    h: "100%",
                                    ml: "$4",
                                    dflex: "center"
                                }
                            },
                            placeholder: "Search..."
                        })
                    }),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)(react_.Navbar.Content, {
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx(react_.Navbar.Content, {
                                hideIn: "md",
                                children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)(flex/* Flex */.k, {
                                    align: "center",
                                    css: {
                                        gap: "$4"
                                    },
                                    children: [
                                        /*#__PURE__*/ jsx_runtime_.jsx(FeedbackIcon, {}),
                                        /*#__PURE__*/ jsx_runtime_.jsx(react_.Text, {
                                            span: true,
                                            children: "Feedback?"
                                        })
                                    ]
                                })
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx(react_.Navbar.Content, {
                                children: /*#__PURE__*/ jsx_runtime_.jsx(NotificationsDropdown, {})
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx(react_.Navbar.Content, {
                                hideIn: "md",
                                children: /*#__PURE__*/ jsx_runtime_.jsx(SupportIcon, {})
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx(react_.Navbar.Content, {
                                children: /*#__PURE__*/ jsx_runtime_.jsx(react_.Link, {
                                    "aria-label": "Github link",
                                    href: "https://github.com/",
                                    target: "_blank",
                                    children: /*#__PURE__*/ jsx_runtime_.jsx(GithubIcon, {})
                                })
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx(react_.Navbar.Content, {
                                children: /*#__PURE__*/ jsx_runtime_.jsx(UserDropdown, {})
                            })
                        ]
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(react_.Navbar.Collapse, {
                        children: collapseItems.map((item, index)=>/*#__PURE__*/ jsx_runtime_.jsx(react_.Navbar.CollapseItem, {
                                activeColor: "secondary",
                                css: {
                                    color: index === collapseItems.length - 1 ? "$error" : ""
                                },
                                isActive: index === 2,
                                children: /*#__PURE__*/ jsx_runtime_.jsx(react_.Link, {
                                    color: "inherit",
                                    css: {
                                        minWidth: "100%"
                                    },
                                    href: "#",
                                    children: item
                                })
                            }, item))
                    })
                ]
            }),
            children
        ]
    });
};

;// CONCATENATED MODULE: ./components/sidebar/sidebar.styles.ts

const sidebar_styles_SidebarWrapper = (0,react_.styled)("div", {
    "backgroundColor": "#1e1b4b",
    "transition": "transform 0.2s ease",
    "height": "100%",
    "position": "fixed",
    "transform": "translateX(-100%)",
    "width": "16rem",
    "flexShrink": 0,
    "zIndex": "202",
    "overflowY": "auto",
    "&::-webkit-scrollbar": {
        display: "none"
    },
    "borderRight": "1px solid $border",
    "flexDirection": "column",
    "py": "$10",
    "px": "$6",
    "@md": {
        marginLeft: "0",
        display: "flex",
        position: "static",
        height: "100vh",
        transform: "translateX(0)"
    },
    "variants": {
        collapsed: {
            true: {
                display: "inherit",
                marginLeft: "0 ",
                transform: "translateX(0)"
            }
        }
    }
});
const Overlay = (0,react_.styled)("div", {
    "backgroundColor": "rgb(15 23 42 / 0.3)",
    "position": "fixed",
    "inset": 0,
    "zIndex": "201",
    "transition": "opacity 0.3s ease",
    "opacity": 0.8,
    "@md": {
        display: "none",
        zIndex: "auto",
        opacity: 1
    }
});
const Header = (0,react_.styled)("div", {
    display: "flex",
    gap: "$8",
    alignItems: "center",
    // 'justifyContent': 'center',
    px: "$10"
});
const Body = (0,react_.styled)("div", {
    display: "flex",
    flexDirection: "column",
    gap: "$10",
    mt: "$13",
    px: "$4"
});
const Footer = (0,react_.styled)("div", {
    "display": "flex",
    "alignItems": "center",
    "justifyContent": "center",
    "gap": "$12",
    "pt": "$18",
    "pb": "$8",
    "@md": {
        pt: 0,
        pb: 0
    },
    "px": "$8"
});
const Sidebar = Object.assign(sidebar_styles_SidebarWrapper, {
    Header,
    Body,
    Overlay,
    Footer
});

;// CONCATENATED MODULE: ./components/sidebar/companies-dropdown.tsx





const CompaniesDropdown = ()=>{
    return /*#__PURE__*/ jsx_runtime_.jsx(box/* Box */.x, {
        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)(flex/* Flex */.k, {
            align: "center",
            css: {
                gap: "$7"
            },
            children: [
                /*#__PURE__*/ jsx_runtime_.jsx(box/* Box */.x, {
                    css: {
                        bg: "#7047EB",
                        minWidth: "36px",
                        width: "36px",
                        height: "36px",
                        borderRadius: "$md",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "$white",
                        fontWeight: "$bold",
                        fontSize: "$lg"
                    },
                    children: "A"
                }),
                /*#__PURE__*/ jsx_runtime_.jsx(box/* Box */.x, {
                    children: /*#__PURE__*/ jsx_runtime_.jsx(react_.Text, {
                        h3: true,
                        size: "$lg",
                        weight: "medium",
                        css: {
                            margin: 0,
                            color: "#111827",
                            lineHeight: "$lg"
                        },
                        children: "Admin Panel"
                    })
                })
            ]
        })
    });
};

;// CONCATENATED MODULE: ./components/icons/sidebar/home-icon.tsx



const HomeIcon = ()=>{
    return /*#__PURE__*/ jsx_runtime_.jsx(svg/* Svg */.n, {
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        css: {
            "& path": {
                fill: "$accents6"
            }
        },
        children: /*#__PURE__*/ jsx_runtime_.jsx(svg/* Svg.Path */.n.Path, {
            fillRule: "evenodd",
            clipRule: "evenodd",
            d: "M4 13H10C10.55 13 11 12.55 11 12V4C11 3.45 10.55 3 10 3H4C3.45 3 3 3.45 3 4V12C3 12.55 3.45 13 4 13ZM4 21H10C10.55 21 11 20.55 11 20V16C11 15.45 10.55 15 10 15H4C3.45 15 3 15.45 3 16V20C3 20.55 3.45 21 4 21ZM14 21H20C20.55 21 21 20.55 21 20V12C21 11.45 20.55 11 20 11H14C13.45 11 13 11.45 13 12V20C13 20.55 13.45 21 14 21ZM13 4V8C13 8.55 13.45 9 14 9H20C20.55 9 21 8.55 21 8V4C21 3.45 20.55 3 20 3H14C13.45 3 13 3.45 13 4Z",
            fill: "#0085FF"
        })
    });
};

;// CONCATENATED MODULE: ./components/icons/sidebar/accounts-icon.tsx



const AccountsIcon = ()=>{
    return /*#__PURE__*/ jsx_runtime_.jsx(svg/* Svg */.n, {
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        css: {
            "& path": {
                fill: "$accents6"
            }
        },
        children: /*#__PURE__*/ jsx_runtime_.jsx("path", {
            fillRule: "evenodd",
            clipRule: "evenodd",
            d: "M3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3H5C3.89 3 3 3.9 3 5ZM15 9C15 10.66 13.66 12 12 12C10.34 12 9 10.66 9 9C9 7.34 10.34 6 12 6C13.66 6 15 7.34 15 9ZM6 17C6 15 10 13.9 12 13.9C14 13.9 18 15 18 17V18H6V17Z",
            fill: "#969696"
        })
    });
};

// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(1664);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
;// CONCATENATED MODULE: ./components/sidebar/sidebar-item.tsx




const SidebarItem = ({ icon , title , isActive , href =""  })=>{
    const { setCollapsed  } = useSidebarContext();
    const handleClick = ()=>{
        if (window.innerWidth < 768) {
            setCollapsed();
        }
    };
    return /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
        href: href,
        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("a", {
            onClick: handleClick,
            className: `flex items-center gap-4 w-full min-h-[44px] h-full px-7 rounded-lg cursor-pointer transition-all duration-150 active:scale-95 ${isActive ? "bg-blue-50 text-blue-600 [&_svg_path]:fill-blue-600 font-semibold shadow-sm" : "text-gray-600 hover:bg-gray-50"}`,
            children: [
                icon,
                /*#__PURE__*/ jsx_runtime_.jsx("span", {
                    className: "text-base font-normal",
                    children: title
                })
            ]
        })
    });
};

;// CONCATENATED MODULE: ./components/sidebar/sidebar-menu.tsx




const SidebarMenu = ({ title , children  })=>{
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(flex/* Flex */.k, {
        css: {
            gap: "$4"
        },
        direction: "column",
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx(react_.Text, {
                span: true,
                size: "$xs",
                weight: "normal",
                css: {
                    letterSpacing: "0.04em",
                    lineHeight: "$xs",
                    color: "#6b7280"
                },
                children: title
            }),
            children
        ]
    });
};

;// CONCATENATED MODULE: ./components/icons/sidebar/filter-icon.tsx



const FilterIcon = ()=>{
    return /*#__PURE__*/ jsx_runtime_.jsx(svg/* Svg */.n, {
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        css: {
            "& path": {
                fill: "$accents6"
            }
        },
        children: /*#__PURE__*/ jsx_runtime_.jsx("path", {
            d: "M4.25018 5.61C6.57018 8.59 10.0002 13 10.0002 13V18C10.0002 19.1 10.9002 20 12.0002 20C13.1002 20 14.0002 19.1 14.0002 18V13C14.0002 13 17.4302 8.59 19.7502 5.61C20.2602 4.95 19.7902 4 18.9502 4H5.04018C4.21018 4 3.74018 4.95 4.25018 5.61Z",
            fill: "#969696"
        })
    });
};

;// CONCATENATED MODULE: ./components/icons/sidebar/products-icon.tsx



const ProductsIcon = ()=>{
    return /*#__PURE__*/ jsx_runtime_.jsx(svg/* Svg */.n, {
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        css: {
            "& path": {
                fill: "$accents6"
            }
        },
        children: /*#__PURE__*/ jsx_runtime_.jsx("path", {
            fillRule: "evenodd",
            clipRule: "evenodd",
            d: "M20 6H16V4C16 2.89 15.11 2 14 2H10C8.89 2 8 2.89 8 4V6H4C2.89 6 2.01 6.89 2.01 8L2 19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM14 6H10V4H14V6Z",
            fill: "#969696"
        })
    });
};

// EXTERNAL MODULE: external "next/router"
var router_ = __webpack_require__(1853);
;// CONCATENATED MODULE: ./components/sidebar/sidebar.tsx















const sidebar_SidebarWrapper = ()=>{
    const router = (0,router_.useRouter)();
    const { collapsed , setCollapsed  } = useSidebarContext();
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(box/* Box */.x, {
        as: "aside",
        css: {
            height: "100vh",
            zIndex: 202,
            position: "sticky",
            top: "0"
        },
        children: [
            collapsed ? /*#__PURE__*/ jsx_runtime_.jsx(Sidebar.Overlay, {
                onClick: setCollapsed
            }) : null,
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)(Sidebar, {
                collapsed: collapsed,
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(Sidebar.Header, {
                        children: /*#__PURE__*/ jsx_runtime_.jsx(CompaniesDropdown, {})
                    }),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)(flex/* Flex */.k, {
                        direction: "column",
                        justify: "between",
                        css: {
                            height: "100%"
                        },
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)(Sidebar.Body, {
                                className: "body sidebar",
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx(SidebarItem, {
                                        title: "Home",
                                        icon: /*#__PURE__*/ jsx_runtime_.jsx(HomeIcon, {}),
                                        isActive: router.pathname === "/",
                                        href: "/"
                                    }),
                                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)(SidebarMenu, {
                                        title: "Main Menu",
                                        children: [
                                            /*#__PURE__*/ jsx_runtime_.jsx(SidebarItem, {
                                                isActive: router.pathname === "/accounts",
                                                title: "Accounts",
                                                icon: /*#__PURE__*/ jsx_runtime_.jsx(AccountsIcon, {}),
                                                href: "accounts"
                                            }),
                                            /*#__PURE__*/ jsx_runtime_.jsx(SidebarItem, {
                                                isActive: router.pathname === "/teachers",
                                                title: "Teachers",
                                                icon: /*#__PURE__*/ jsx_runtime_.jsx(AccountsIcon, {}),
                                                href: "teachers"
                                            }),
                                            /*#__PURE__*/ jsx_runtime_.jsx(SidebarItem, {
                                                isActive: router.pathname === "/students",
                                                title: "Students",
                                                icon: /*#__PURE__*/ jsx_runtime_.jsx(AccountsIcon, {}),
                                                href: "students"
                                            }),
                                            /*#__PURE__*/ jsx_runtime_.jsx(SidebarItem, {
                                                isActive: router.pathname === "/shop",
                                                title: "Shop",
                                                icon: /*#__PURE__*/ jsx_runtime_.jsx(ProductsIcon, {}),
                                                href: "shop"
                                            })
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)(Sidebar.Footer, {
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx(react_.Tooltip, {
                                        content: "Adjustments",
                                        rounded: true,
                                        color: "primary",
                                        children: /*#__PURE__*/ jsx_runtime_.jsx(FilterIcon, {})
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx(react_.Tooltip, {
                                        content: "Profile",
                                        rounded: true,
                                        color: "primary",
                                        children: /*#__PURE__*/ jsx_runtime_.jsx(react_.Avatar, {
                                            src: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
                                            size: "sm"
                                        })
                                    })
                                ]
                            })
                        ]
                    })
                ]
            })
        ]
    });
};

;// CONCATENATED MODULE: ./components/layout/layout.styles.ts

const WrapperLayout = (0,react_.styled)("div", {
    display: "flex"
});

;// CONCATENATED MODULE: ./components/layout/layout.tsx







const Layout = ({ children  })=>{
    const [sidebarOpen, setSidebarOpen] = external_react_default().useState(false);
    const [_, setLocked] = useLockedBody(false);
    const handleToggleSidebar = ()=>{
        setSidebarOpen(!sidebarOpen);
        setLocked(!sidebarOpen);
    };
    return /*#__PURE__*/ jsx_runtime_.jsx(SidebarContext.Provider, {
        value: {
            collapsed: sidebarOpen,
            setCollapsed: handleToggleSidebar
        },
        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)(WrapperLayout, {
            children: [
                /*#__PURE__*/ jsx_runtime_.jsx(sidebar_SidebarWrapper, {}),
                /*#__PURE__*/ jsx_runtime_.jsx(NavbarWrapper, {
                    children: children
                })
            ]
        })
    });
};


/***/ }),

/***/ 5656:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _nextui_org_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6735);
/* harmony import */ var _nextui_org_react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_nextui_org_react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_themes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1162);
/* harmony import */ var next_themes__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_themes__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_layout_layout__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5136);
/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9752);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(1853);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_6__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_tanstack_react_query__WEBPACK_IMPORTED_MODULE_4__]);
_tanstack_react_query__WEBPACK_IMPORTED_MODULE_4__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];








const lightTheme = (0,_nextui_org_react__WEBPACK_IMPORTED_MODULE_1__.createTheme)({
    type: "light",
    theme: {
        colors: {
            primary: "#7047EB",
            primaryLight: "#f3e8ff",
            sidebarBg: "#1e1b4b",
            sidebarActive: "#2d2645",
            sidebarText: "#a19db5"
        }
    }
});
const darkTheme = (0,_nextui_org_react__WEBPACK_IMPORTED_MODULE_1__.createTheme)({
    type: "dark",
    theme: {
        colors: {
            primary: "#7047EB",
            primaryLight: "#f3e8ff",
            sidebarBg: "#1e1b4b",
            sidebarActive: "#2d2645",
            sidebarText: "#a19db5",
            dangerLight: "#ffe4e6",
            dangerLightHover: "#fecdd3"
        }
    }
});
function MyApp({ Component , pageProps  }) {
    const { 0: queryClient  } = (0,react__WEBPACK_IMPORTED_MODULE_5__.useState)(()=>new _tanstack_react_query__WEBPACK_IMPORTED_MODULE_4__.QueryClient());
    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_6__.useRouter)();
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_tanstack_react_query__WEBPACK_IMPORTED_MODULE_4__.QueryClientProvider, {
        client: queryClient,
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_themes__WEBPACK_IMPORTED_MODULE_2__.ThemeProvider, {
            defaultTheme: "light",
            attribute: "class",
            value: {
                light: lightTheme.className,
                dark: darkTheme.className
            },
            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_nextui_org_react__WEBPACK_IMPORTED_MODULE_1__.NextUIProvider, {
                children: router.pathname === "/login" ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Component, {
                    ...pageProps
                }) : /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_layout_layout__WEBPACK_IMPORTED_MODULE_3__/* .Layout */ .A, {
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Component, {
                        ...pageProps
                    })
                })
            })
        })
    });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 6735:
/***/ ((module) => {

module.exports = require("@nextui-org/react");

/***/ }),

/***/ 1162:
/***/ ((module) => {

module.exports = require("next-themes");

/***/ }),

/***/ 3280:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/app-router-context.js");

/***/ }),

/***/ 2796:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/head-manager-context.js");

/***/ }),

/***/ 4014:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/i18n/normalize-locale-path.js");

/***/ }),

/***/ 8524:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/is-plain-object.js");

/***/ }),

/***/ 8020:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/mitt.js");

/***/ }),

/***/ 4406:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/page-path/denormalize-page-path.js");

/***/ }),

/***/ 4964:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router-context.js");

/***/ }),

/***/ 1751:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/add-path-prefix.js");

/***/ }),

/***/ 6220:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/compare-states.js");

/***/ }),

/***/ 299:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/format-next-pathname-info.js");

/***/ }),

/***/ 3938:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/format-url.js");

/***/ }),

/***/ 9565:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/get-asset-path-from-route.js");

/***/ }),

/***/ 5789:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/get-next-pathname-info.js");

/***/ }),

/***/ 1428:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/is-dynamic.js");

/***/ }),

/***/ 8854:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/parse-path.js");

/***/ }),

/***/ 1292:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/parse-relative-url.js");

/***/ }),

/***/ 4567:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/path-has-prefix.js");

/***/ }),

/***/ 979:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/querystring.js");

/***/ }),

/***/ 3297:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/remove-trailing-slash.js");

/***/ }),

/***/ 6052:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/resolve-rewrites.js");

/***/ }),

/***/ 4226:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/route-matcher.js");

/***/ }),

/***/ 5052:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/route-regex.js");

/***/ }),

/***/ 9232:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/utils.js");

/***/ }),

/***/ 1853:
/***/ ((module) => {

module.exports = require("next/router");

/***/ }),

/***/ 6689:
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ 997:
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ }),

/***/ 9752:
/***/ ((module) => {

module.exports = import("@tanstack/react-query");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [676,664,483,86], () => (__webpack_exec__(5656)));
module.exports = __webpack_exports__;

})();