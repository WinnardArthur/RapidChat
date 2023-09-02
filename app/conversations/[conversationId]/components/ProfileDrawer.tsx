"use client";

import { Conversation, User } from "@prisma/client";
import React from "react";

type ProfileDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  data: Conversation & {
    users: User[];
  };
};

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  return <div>
    
  </div>;
};

export default ProfileDrawer;
