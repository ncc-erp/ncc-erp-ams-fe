/* eslint-disable react-hooks/exhaustive-deps */
import { TreeSelect } from "@pankod/refine-antd";
import { useCustom } from "@pankod/refine-core";
import { FINFAST_ENTRY_TYPE_API } from "api/baseApi";
import { IEntryType, ITreeEntryType } from "interfaces/dashboard";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type TreeSelectComponentProps = {
  setEntryId: (data: number) => void;
};

export const TreeSelectComponent = (props: TreeSelectComponentProps) => {
  const { setEntryId } = props;
  const { t } = useTranslation();

  const [value, setValue] = useState<number[]>();
  const [treeData, setTreeData] = useState<ITreeEntryType[]>([]);

  const { data } = useCustom({
    url: FINFAST_ENTRY_TYPE_API,
    method: "get",
  });

  const buildTree = (
    list: IEntryType[],
    parentId: number | null = null
  ): any => {
    let map: ITreeEntryType[] = [];
    list.forEach((element: IEntryType) => {
      let elementTree: ITreeEntryType = element;
      if (element.parentId === parentId) {
        let children = buildTree(list, element.id);
        if (children !== []) {
          elementTree.children = children;
        }
        map.push(elementTree);
      }
    });
    return map;
  };

  const onChange = (valueNew: any) => {
    setValue(valueNew);
    setEntryId(valueNew);
  };

  const tProps = {
    treeData,
    value: value,
    onChange: onChange,
    treeCheckable: false,
    showCheckedStrategy: TreeSelect.SHOW_CHILD,
    placeholder: t("hardware.label.placeholder.choiceAsset"),
    style: {
      width: "100%",
    },
    treeDefaultExpandAll: true,
  };

  useEffect(() => {
    if (data) {
      setTreeData(buildTree(data?.data?.result, null));
    }
  }, [data]);

  return (
    <TreeSelect
      allowClear
      showSearch
      fieldNames={{ label: "name", value: "id", children: "children" }}
      treeNodeLabelProp="name"
      treeNodeFilterProp="name"
      {...tProps}
    />
  );
};
