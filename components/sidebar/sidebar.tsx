import React, { useState } from "react";
import { Box } from "../styles/box";
import { Sidebar } from "./sidebar.styles";
import { Avatar, Tooltip } from "@nextui-org/react";
import { Flex } from "../styles/flex";
import { CompaniesDropdown } from "./companies-dropdown";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  ShieldCheck,
  MonitorPlay,
  MessageSquareText,
  Images,
  Tags,
  Receipt,
  ShoppingBag,
  Settings,
} from "lucide-react";
import { useSidebarContext } from "../layout/layout-context";
import { useRouter } from "next/router";
import { SidebarCollapseItem } from "./sidebar-collapse-item";
import { useAdminNotifications } from "../../store/adminNotifications";

export const SidebarWrapper = () => {
  const router = useRouter();
  const { collapsed, setCollapsed } = useSidebarContext();
  // Number of conversations with unread messages, for the Chat & Support badge.
  const chatUnread = useAdminNotifications(
    (s) => Object.keys(s.unreadByConversation).length,
  );

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
              icon={<LayoutDashboard size={21} strokeWidth={2} />}
              isActive={router.pathname === "/"}
              href="/"
            />
            <SidebarMenu title="Main Menu">
              <SidebarItem
                isActive={router.pathname === "/teachers"}
                title="Teachers"
                icon={<GraduationCap size={21} strokeWidth={2} />}
                href="/teachers"
              />
              <SidebarItem
                isActive={router.pathname === "/students"}
                title="Students"
                icon={<Users size={21} strokeWidth={2} />}
                href="/students"
              />
              <SidebarItem
                isActive={router.pathname === "/security"}
                title="Security"
                icon={<ShieldCheck size={21} strokeWidth={2} />}
                href="/security"
              />
              <SidebarItem
                isActive={router.pathname === "/classes"}
                title="Classes"
                icon={<MonitorPlay size={21} strokeWidth={2} />}
                href="/classes"
              />
              <SidebarItem
                isActive={router.pathname === "/chat"}
                title="Chat & Support"
                icon={<MessageSquareText size={21} strokeWidth={2} />}
                href="/chat"
              />
              <SidebarItem
                isActive={router.pathname === "/hero-banner"}
                title="Banners"
                icon={<Images size={21} strokeWidth={2} />}
                href="/hero-banner"
              />
              <SidebarItem
                isActive={router.pathname === "/categories"}
                title="Categories"
                icon={<Tags size={21} strokeWidth={2} />}
                href="/categories"
              />
              <SidebarItem
                isActive={router.pathname === "/transactions"}
                title="Transactions"
                icon={<Receipt size={21} strokeWidth={2} />}
                href="/transactions"
              />
              <SidebarCollapseItem
                isActive={
                  router.pathname === "/shop" ||
                  router.pathname === "/create-product"
                }
                title="Shop"
                icon={<ShoppingBag size={21} strokeWidth={2} />}
                items={[
                  { title: "Product List", href: "/shop" },
                  { title: "Add Product", href: "/create-product" },
                ]}
              />
            </SidebarMenu>
          </Sidebar.Body>
          <Sidebar.Footer>
            <Tooltip content={"Settings"} rounded color="primary">
              <div className="p-2 rounded-lg hover:bg-[#7047EB]/10 transition-colors cursor-pointer group text-[#94a3b8] hover:text-[#7047EB]">
                <Settings
                  size={20}
                  strokeWidth={2}
                  className="group-hover:scale-110 transition-transform"
                />
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
