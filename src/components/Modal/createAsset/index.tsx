import { Modal} from "@pankod/refine-antd";
import { HardwareCreate } from "pages/hardware";


type CreateAssetModalProps = {
  setIsModalVisible: (data: boolean) => void;
  isModalVisible: boolean;
};

export const CreateAssetModal = (props: CreateAssetModalProps) => {
  const { setIsModalVisible, isModalVisible } = props;


  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  
  return (
    <Modal
      title=""
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      className="model"
    >
      <HardwareCreate/>
    </Modal>
  );
};
