'use client';

import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType } from "../types";
import { User } from "@prisma/client";

const useOtherUser = (
  conversation: FullConversationType | { users: User[] }
) => {
  const session = useSession();

  const otherUsers = useMemo(() => {
    const currentUserEmail = session?.data?.user?.email;

    //   Filter current user
    const otherUser = conversation.users.filter(
      (user) => user.email !== currentUserEmail
    );

    return otherUser;
  }, [session?.data?.user?.email, conversation.users]);

  return otherUsers;
};

export default useOtherUser;