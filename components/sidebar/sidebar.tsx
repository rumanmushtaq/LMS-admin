import React, { useState } from "react";
import { Box } from "../styles/box";
import { Sidebar } from "./sidebar.styles";
import { Avatar, Tooltip } from "@nextui-org/react";
import { Flex } from "../styles/flex";
import { CompaniesDropdown } from "./companies-dropdown";
import { HomeIcon } from "../icons/sidebar/home-icon";
import { AccountsIcon } from "../icons/sidebar/accounts-icon";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { FilterIcon } from "../icons/sidebar/filter-icon";
import { ProductsIcon } from "../icons/sidebar/products-icon";
import { CategoryIcon } from "../icons/sidebar/category-icon";
import { SecurityIcon } from "../icons/sidebar/security-icon";
import { useSidebarContext } from "../layout/layout-context";
import { useRouter } from "next/router";
import { SidebarCollapseItem } from "./sidebar-collapse-item";

export const SidebarWrapper = () => {
  const router = useRouter();
  const { collapsed, setCollapsed } = useSidebarContext();

  return (
    <Box
      as="aside"
      css={{
        height: "100vh",
        zIndex: 202,
        position: "sticky",
        top: "0",
      }}
    >
      {collapsed ? <Sidebar.Overlay onClick={setCollapsed} /> : null}

      <Sidebar collapsed={collapsed}>
        <Sidebar.Header>
          <CompaniesDropdown />
        </Sidebar.Header>
        <Flex direction={"column"} justify={"between"} css={{ height: "100%" }}>
          <Sidebar.Body className="body sidebar">
            <SidebarItem
              title="Home"
              icon={<HomeIcon />}
              isActive={router.pathname === "/"}
              href="/"
            />
            <SidebarMenu title="Main Menu">
              <SidebarItem
                isActive={router.pathname === "/accounts"}
                title="Accounts"
                icon={<AccountsIcon />}
                href="/accounts"
              />
              <SidebarItem
                isActive={router.pathname === "/teachers"}
                title="Teachers"
                icon={<AccountsIcon />}
                href="/teachers"
              />
              <SidebarItem
                isActive={router.pathname === "/students"}
                title="Students"
                icon={<AccountsIcon />}
                href="/students"
              />
              <SidebarItem
                isActive={router.pathname === "/security"}
                title="Security"
                icon={<SecurityIcon />}
                href="/security"
              />
              <SidebarItem
                isActive={router.pathname === "/classes"}
                title="Classes"
                icon={<ProductsIcon />}
                href="/classes"
              />
              <SidebarItem
                isActive={router.pathname === "/chat"}
                title="Chat & Support"
                icon={<AccountsIcon />}
                href="/chat"
              />
              <SidebarItem
                isActive={router.pathname === "/hero-banner"}
                title="Banners"
                icon={<FilterIcon />}
                href="/hero-banner"
              />
              <SidebarItem
                isActive={router.pathname === "/categories"}
                title="Categories"
                icon={<CategoryIcon />}
                href="/categories"
              />
              <SidebarCollapseItem
                isActive={
                  router.pathname === "/shop" ||
                  router.pathname === "/create-product"
                }
                title="Shop"
                icon={<ProductsIcon />}
                items={[
                  { title: "Product List", href: "/shop" },
                  { title: "Add Product", href: "/create-product" },
                ]}
              />
            </SidebarMenu>
          </Sidebar.Body>
          <Sidebar.Footer>
            <Tooltip content={"Settings"} rounded color="primary">
              <div className="p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                <FilterIcon className="group-hover:scale-110 transition-transform [&_path]:fill-[#94a3b8]" />
              </div>
            </Tooltip>
            <Tooltip content={"Profile"} rounded color="primary">
              <Avatar
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                size={"md"}
                zoomed
                pointer
                css={{
                  border: "2px solid rgba(112, 71, 235, 0.2)",
                  "&:hover": {
                    borderColor: "#7047EB",
                  },
                }}
              />
            </Tooltip>
          </Sidebar.Footer>
        </Flex>
      </Sidebar>
    </Box>
  );
};
