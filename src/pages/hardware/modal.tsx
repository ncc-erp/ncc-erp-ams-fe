import React from "react";
import { MModal } from "components/Modal/MModal";
import { HardwareCreate } from "./create";
import { HardwareEdit } from "./edit";
import { HardwareShow } from "./show";
import { HardwareCheckout } from "./checkout";
import { HardwareCheckin } from "./checkin";
import { HardwareSearch } from "./search";
import {
  IHardwareResponse,
  IHardwareResponseCheckin,
  IHardwareResponseCheckout,
  IModalPropsProps,
} from "interfaces/hardware";

export const ModalsWrapper: React.FC<IModalPropsProps> = ({
  t,
  isModalVisible,
  setIsModalVisible,
  isEditModalVisible,
  setIsEditModalVisible,
  isShowModalVisible,
  setIsShowModalVisible,
  isSearchModalVisible,
  setIsSearchModalVisible,
  isCheckoutModalVisible,
  setIsCheckoutModalVisible,
  isCheckinModalVisible,
  setIsCheckinModalVisible,
  detail,
  detailCheckin,
  detailCheckout,
  searchFormProps,
}) => {
  return (
    <>
      <MModal
        title={t("hardware.label.title.create")}
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
      >
        <HardwareCreate
          setIsModalVisible={setIsModalVisible}
          isModalVisible={isModalVisible}
        />
      </MModal>

      <MModal
        title={t("hardware.label.title.edit")}
        setIsModalVisible={setIsEditModalVisible}
        isModalVisible={isEditModalVisible}
      >
        <HardwareEdit
          isModalVisible={isEditModalVisible}
          setIsModalVisible={setIsEditModalVisible}
          data={detail}
        />
      </MModal>

      <MModal
        title={t("hardware.label.title.detail")}
        setIsModalVisible={setIsShowModalVisible}
        isModalVisible={isShowModalVisible}
      >
        <HardwareShow
          setIsModalVisible={setIsShowModalVisible}
          detail={detail}
        />
      </MModal>

      <MModal
        title={t("hardware.label.title.checkout")}
        setIsModalVisible={setIsCheckoutModalVisible}
        isModalVisible={isCheckoutModalVisible}
      >
        <HardwareCheckout
          isModalVisible={isCheckoutModalVisible}
          setIsModalVisible={setIsCheckoutModalVisible}
          data={detailCheckout}
        />
      </MModal>

      <MModal
        title={t("hardware.label.title.checkin")}
        setIsModalVisible={setIsCheckinModalVisible}
        isModalVisible={isCheckinModalVisible}
      >
        <HardwareCheckin
          isModalVisible={isCheckinModalVisible}
          setIsModalVisible={setIsCheckinModalVisible}
          data={detailCheckin}
        />
      </MModal>

      <MModal
        title={t("hardware.label.title.search_advanced")}
        setIsModalVisible={setIsSearchModalVisible}
        isModalVisible={isSearchModalVisible}
      >
        <HardwareSearch
          isModalVisible={isSearchModalVisible}
          setIsModalVisible={setIsSearchModalVisible}
          searchFormProps={searchFormProps}
        />
      </MModal>
    </>
  );
};
