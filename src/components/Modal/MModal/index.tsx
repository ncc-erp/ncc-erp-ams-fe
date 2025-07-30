import { Modal } from "@pankod/refine-antd";
import { ReactNode } from "react";
import { useResponsiveModalWidth } from "hooks/useResponsiveModalWidth";
import React from "react";
import { HardwareCreate } from "pages/hardware/create";
import { HardwareEdit } from "pages/hardware/edit";
import { HardwareShow } from "pages/hardware/show";
import { HardwareSearch } from "pages/hardware/search";
import { IModalPropsProps } from "interfaces/hardware";
import { HardWareModalType } from "constants/assets";

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
      style={{ top: "60px" }}
    >
      {children}
    </Modal>
  );
};

export const ModalsWrapper: React.FC<IModalPropsProps> = ({
  t,
  modalState,
  setModalState,
  detail,
  searchFormProps,
}) => {
  const handleClose = () => setModalState({ type: null, isVisible: false });

  return (
    <MModal
      title={t(`hardware.label.title.${modalState.type}`)}
      setIsModalVisible={handleClose}
      isModalVisible={modalState.isVisible}
    >
      {modalState.type === HardWareModalType.CREATE && (
        <HardwareCreate setIsModalVisible={handleClose} isModalVisible />
      )}
      {modalState.type === HardWareModalType.EDIT && (
        <HardwareEdit
          setIsModalVisible={handleClose}
          isModalVisible
          data={detail}
        />
      )}
      {modalState.type === HardWareModalType.SHOW && (
        <HardwareShow setIsModalVisible={handleClose} detail={detail} />
      )}
      {modalState.type === HardWareModalType.SEARCH && (
        <HardwareSearch
          setIsModalVisible={handleClose}
          isModalVisible
          searchFormProps={searchFormProps}
        />
      )}
    </MModal>
  );
};
