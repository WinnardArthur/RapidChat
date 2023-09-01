"use client";

import React from "react";
import { UseFormRegister, FieldValues, FieldErrors } from "react-hook-form";

type MessageInputProps = {
  id: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
};

const MessageInput: React.FC<MessageInputProps> = ({
  id,
  placeholder,
  required,
  register,
  errors,
  type,
}) => {
  return (
    <div className="relative w-full">
      <input
        id={id}
        type={type}
        autoComplete={id}
        {...register(id, { required })}
        placeholder={placeholder}
        className="text-black font-light py-2 px-4 bg-neutral-100 w-full rounded-full focus:outline-none"
      />
    </div>
  );
};

export default MessageInput;
