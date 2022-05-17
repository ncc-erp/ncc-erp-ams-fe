import { Icons } from "@pankod/refine-antd";
import { Button, Checkbox, Col, Dropdown, Form, Input, Menu, Row } from "antd";
import { useCallback, useMemo, useState } from "react";
import { ICheck } from "../../../interfaces/index";
const { Search } = Input;

export interface ISelectTableCol {
  onChange: (list: any[]) => void;
  options: any[];
  defaultValue: any[];
}

export const SelectTableCol = (props: ISelectTableCol) => {
  const plainOptions = props.options;
  const defaultCheckedList = props.defaultValue;
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [checkAll, setCheckAll] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (show: boolean) => {
    setVisible(show);
  };

  const onChange = (list: any) => {
    // console.log("onChange", list);
    setCheckedList(list);
    setCheckAll(list.length === plainOptions.length);
    setVisible(true);
    props.onChange(list);
  };

  const onCheckAllChange = (e: any) => {
    const newList = e.target.checked ? plainOptions : [];
    setCheckedList(newList);
    setCheckAll(e.target.checked);
    setVisible(true);
    props.onChange(newList);
  };

  const list = useMemo(
    () => (
      <div
        style={{
          background: "white",
        }}
      >
        <Row>
          <Col span={24}>
            <Checkbox onChange={onCheckAllChange} checked={checkAll}>
              Check all
            </Checkbox>
          </Col>
          <Checkbox.Group value={checkedList} onChange={onChange}>
            {plainOptions.map((opt) => (
              <Col span={24} key={opt}>
                <Checkbox value={opt} checked={checkedList.includes(opt)}>
                  {opt}
                </Checkbox>
              </Col>
            ))}
          </Checkbox.Group>
        </Row>
      </div>
    ),
    [plainOptions]
  );

  return (
    <>
      <Dropdown
        overlay={list}
        trigger={["click"]}
        onVisibleChange={handleVisibleChange}
        visible={visible}
      >
        <Button>
          <Icons.SelectOutlined />
        </Button>
      </Dropdown>
    </>
  );
};

export interface ITableAction {
  actions?: [
    {
      title: string;
      handle: (menu: any) => void; // todo interface
    }
  ];
  onSearch?: (keyword: string) => void;
  collumns?: any[];
  defaultCollumns?: any[];
  searchFormProps: any;
}

export const TableAction = (props: ITableAction) => {
  const { actions, searchFormProps, collumns, defaultCollumns } = props;
  const menu = useMemo(
    () => (
      <Menu>
        {actions?.map((opt) => (
          <Menu.Item key={opt.title} onClick={opt.handle}>
            {opt.title}
          </Menu.Item>
        ))}
      </Menu>
    ),
    [actions]
  );
  const onSelectCollumn = useCallback(() => {}, []);

  return (
    <Row style={{ marginBottom: "10px" }}>
      <Col xs={12}>
        {actions && (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button>
              Action <Icons.DownOutlined />
            </Button>
          </Dropdown>
        )}
      </Col>
      <Col xs={12}>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
          }}
        >
          {searchFormProps && (
            <Form {...searchFormProps}>
              <Form.Item name={"search"}>
                <Search
                  placeholder="tìm kiếm"
                  onSearch={(key) => {
                    searchFormProps.form.submit();
                  }}
                  style={{ width: 200 }}
                />
              </Form.Item>
            </Form>
          )}
          {collumns && defaultCollumns && (
            <SelectTableCol
              options={collumns}
              defaultValue={defaultCollumns}
              onChange={onSelectCollumn}
            ></SelectTableCol>
          )}
        </div>
      </Col>
    </Row>
  );
};
