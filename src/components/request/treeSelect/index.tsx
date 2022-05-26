/* eslint-disable react-hooks/exhaustive-deps */
import { TreeSelect } from "@pankod/refine-antd";
import { useCustom } from "@pankod/refine-core";
import { IEntryType, ITreeEntryType } from "interfaces/dashboard";
import { useEffect, useState } from "react";

type TreeSelectComponentProps = {
  setEntryId: (data: number) => void;
};

export const TreeSelectComponent = (props: TreeSelectComponentProps) => {
  const { setEntryId } = props;
  const [value, setValue] = useState<number[]>();
  const [treeData, setTreeData] = useState<ITreeEntryType[]>([]);

  const { data } = useCustom({
    url: "api/v1/finfast/entry-type",
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
    placeholder: "Lựa chọn tài sản",
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
