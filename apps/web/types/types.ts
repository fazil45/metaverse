export type Maps = {
  id: string;
  name: string;
  width: number;
  height: number;
  thumbnail: string;
};

export type Spaces = {
  id: string;
  name: string;
  thumbnail: string;
  dimensions: string;
};

export type ConfirmationModalProps = {
  isOpen: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};
