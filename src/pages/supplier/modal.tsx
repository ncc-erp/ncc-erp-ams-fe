import { MModal } from "components/Modal/MModal";
import { SupplierSearch } from "./search";
import { SupplierCreate } from "./create";
import { SupplierEdit } from "./edit";

interface ISupplierModalProps {
  t: any;
  isSearchModalVisible: boolean;
  setIsSearchModalVisible: (isSearchModalVisible: boolean) => void;
  isModalVisible: boolean;
  setIsModalVisible: (isModalVisible: boolean) => void;
  searchFormProps: any;
  isEditModalVisible: boolean;
  setIsEditModalVisible: (isEditModalVisible: boolean) => void;
  detail: any;
}
export const SupplierModal: React.FC<ISupplierModalProps> = (
  props: ISupplierModalProps
) => {
  return (
    <>
      <MModal
        title={props.t("supplier.label.title.search_advanced")}
        setIsModalVisible={props.setIsSearchModalVisible}
        isModalVisible={props.isSearchModalVisible}
      >
        <SupplierSearch
          isModalVisible={props.isSearchModalVisible}
          setIsModalVisible={props.setIsSearchModalVisible}
          searchFormProps={props.searchFormProps}
        />
      </MModal>
      <MModal
        title={props.t("supplier.label.title.create")}
        setIsModalVisible={props.setIsModalVisible}
        isModalVisible={props.isModalVisible}
      >
        <SupplierCreate
          setIsModalVisible={props.setIsModalVisible}
          isModalVisible={props.isModalVisible}
        />
      </MModal>
      <MModal
        title={props.t("supplier.label.title.edit")}
        setIsModalVisible={props.setIsEditModalVisible}
        isModalVisible={props.isEditModalVisible}
      >
        <SupplierEdit
          isModalVisible={props.isEditModalVisible}
          setIsModalVisible={props.setIsEditModalVisible}
          data={props.detail}
        />
      </MModal>
    </>
  );
};
