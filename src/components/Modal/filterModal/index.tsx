import { Modal, TreeSelect } from "@pankod/refine-antd";
import { useCustom } from "@pankod/refine-core";
import { ITreeEntryType } from "interfaces/dashboard";
import { SetStateAction, useState } from "react";

type FilterModalProps = {
  setIsModalVisible: (data: boolean) => void;
  isModalVisible: boolean;
  treeData: ITreeEntryType[];
  valueData: number[] | (() => number[]);
};

export const FilterModal = (props: FilterModalProps) => {
  const { setIsModalVisible, isModalVisible, treeData, valueData } = props;
  const [value, setValue] = useState<number[]>(valueData);

  const {} = useCustom({
    url: `api/v1/dashboard/finfast-setting`,
    method: "post",
    config: {
      payload: {
        value: JSON.stringify(value),
      },
    },
  });

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setValue(valueData);
  };

  const onChange = (valueNew: SetStateAction<number[]>) => {
    setValue(valueNew);
  };

  const tProps = {
    treeData,
    value: value,
    onChange: onChange,
    treeCheckable: true,
    showCheckedStrategy: TreeSelect.SHOW_CHILD,
    placeholder: "Please select",
    style: {
      width: "100%",
    },
  };
  return (
    <Modal
      title="Basic Modal"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <TreeSelect
        allowClear
        fieldNames={{ label: "name", value: "id", children: "children" }}
        {...tProps}
      />
    </Modal>
  );
};
