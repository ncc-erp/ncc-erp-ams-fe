import React from "react";
import { MModal } from "components/Modal/MModal";
import { HardwareCreate } from "./create";
import { HardwareEdit } from "./edit";
import { HardwareShow } from "./show";
import { HardwareSearch } from "./search";
import { IModalPropsProps } from "interfaces/hardware";
import { HardWareModalType } from "constants/assets";

export const ModalsWrapper: React.FC<IModalPropsProps> = ({
  t,
  modalState,
  setModalState,
  detail,
  searchFormProps,
}) => {
  const handleClose = () => setModalState({ type: null, isVisible: false });

  return (
    <>
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
    </>
  );
};
