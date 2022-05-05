import { Modal } from "@pankod/refine-antd";
import { ReactNode } from "react";

type MModalProps = {
  setIsModalVisible: (data: boolean) => void;
  isModalVisible: boolean;
  children: ReactNode;
  title?: string;
};

export const MModal = (props: MModalProps) => {
  const { setIsModalVisible, isModalVisible, children, title } = props;

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Modal
      title={title}
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
      width={1000}
    >
      {children}
    </Modal>
  );
};
