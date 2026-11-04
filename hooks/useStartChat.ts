import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import chatService from "../services/chat";

/**
 * Opens (or creates) the admin's conversation with a user, then jumps to it
 * in /chat. Shared by the teacher and student list rows.
 */
export const useStartChat = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (userId: string) => chatService.initConversation(userId),
    onSuccess: (res: any) => {
      const convId = res?.data?._id || res?._id;
      router.push(convId ? `/chat?openConversation=${convId}` : "/chat");
    },
    onError: (err) => {
      console.error(err);
      alert("Failed to initiate chat.");
    },
  });
};
