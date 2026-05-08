import { styled } from "@nextui-org/react";

export const IconButton = styled("button", {
  dflex: "center",
  border: "none",
  outline: "none",
  cursor: "pointer",
  padding: "0",
  margin: "0",
  bg: "transparent",
  transition: "opacity 0.25s ease 0s, transform 0.25s ease 0s",
  "&:hover": {
    opacity: 0.8,
  },
  "&:active": {
    transform: "scale(0.95)",
  },
});
