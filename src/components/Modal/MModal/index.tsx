import { Modal } from "@pankod/refine-antd";
import { ReactNode } from "react";
import { useResponsiveModalWidth } from "hooks/useResponsiveModalWidth";

type MModalProps = {
  setIsModalVisible: (data: boolean) => void;
  isModalVisible: boolean;
  children: ReactNode;
  title?: string;
};

export const MModal = (props: MModalProps) => {
  const { setIsModalVisible, isModalVisible, children, title } = props;
  const modalWidth = useResponsiveModalWidth();

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
      width={modalWidth}
      bodyStyle={{ maxHeight: "80vh", overflow: "auto" }}
      style={{ top: '60px' }}
    >
      {children}
    </Modal>
  );
};
