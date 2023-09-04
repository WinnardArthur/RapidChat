"use client";

import React from "react";
import Image from "next/image";
import Modal from "@/app/components/Modal";

type ImageModalProps = {
  isOpen?: boolean;
  onClose: () => void;
  src?: string | null;
};

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, src }) => {
  if (!src) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-80 h-80">
        <Image alt="Image" className="object-cover" fill src={src} />
      </div>
    </Modal>
  );
};

export default ImageModal;
