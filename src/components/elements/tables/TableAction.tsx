import { Icons } from "@pankod/refine-antd";
import { Button, Checkbox, Col, Dropdown, Form, Input, Menu, Row } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ICheckboxChange } from "interfaces";
import { useTranslate } from "@pankod/refine-core";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
const { Search } = Input;
export declare type CheckboxValueType = string | number | boolean;
export interface ISelectTableCol {
  onChange: (list: Array<CheckboxValueType>) => void;
  options: string[];
  defaultValue: Array<CheckboxValueType>;
}

export const SelectTableCol = (props: ISelectTableCol) => {
  const { t } = useTranslation();

  const plainOptions = props.options;
  const defaultCheckedList = props.defaultValue;
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [checkAll, setCheckAll] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (show: boolean) => {
    setVisible(show);
  };

  const onChange = (list: Array<CheckboxValueType>) => {
    setCheckedList(list);
    setCheckAll(list.length === plainOptions.length);
    setVisible(true);
    props.onChange(list);
  };

  const onCheckAllChange = (e: ICheckboxChange) => {
    const newList = e.target.checked ? plainOptions : [];
    setCheckedList(newList);
    setCheckAll(e.target.checked);
    setVisible(true);
    props.onChange(newList);
  };

  const list = useMemo(
    () => (
      <div className="select-table-col-dropdown">
        <Row>
          <Col span={24}>
            <Checkbox onChange={onCheckAllChange} checked={checkAll}>
              {t("table.checkAll")}
            </Checkbox>
          </Col>
          <Checkbox.Group value={checkedList} onChange={onChange}>
            {plainOptions.map((item) => (
              <Col span={24} key={item}>
                <Checkbox value={item} checked={checkedList.includes(item)}>
                  {item}
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

export interface MenuInfo {
  key: string;
}
export interface ITableAction {
  actions?: [
    {
      title: string;
      handle: (menu: MenuInfo) => void;
    },
  ];
  onSearch?: (keyword: string) => void;
  collumns?: string[];
  defaultCollumns?: string[];
  searchFormProps: any;
}

export const TableAction = (props: ITableAction) => {
  const { actions, searchFormProps, collumns, defaultCollumns } = props;
  const t = useTranslate();
  let timeout: any = null;
  const debounceWaitTime = 1000;

  const menu = useMemo(
    () => (
      <Menu>
        {actions?.map((item) => (
          <Menu.Item key={item.title} onClick={item.handle}>
            {item.title}
          </Menu.Item>
        ))}
      </Menu>
    ),
    [actions]
  );
  const onSelectCollumn = useCallback(() => {}, []);

  const searchValues = useMemo(() => {
    return localStorage.getItem("search");
  }, [localStorage.getItem("search")]);

  const debouncedSearch = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      localStorage.setItem(
        "search",
        searchFormProps.form?.getFieldsValue()?.search !== undefined
          ? searchFormProps.form?.getFieldsValue()?.search
          : ""
      );
      searchFormProps.form.submit();
      searchParams.set(
        "search",
        searchFormProps.form?.getFieldsValue()?.search
      );
      setSearchParams(searchParams);
    }, debounceWaitTime);
  };

  useEffect(() => {
    searchFormProps.form.submit();
  }, [window.location.reload]);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get("search");
  return (
    <div className="table-action-container">
      <div>
        {actions && (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button>
              {t("table.actions")} <Icons.DownOutlined />
            </Button>
          </Dropdown>
        )}
      </div>
      <div className="table-action-right-section">
        {searchFormProps && (
          <Form
            className="table-action-search-form"
            {...searchFormProps}
            initialValues={{
              search:
                localStorage.getItem("search") !== null || searchValues !== ""
                  ? searchValues
                  : searchParam,
            }}
            onChange={() => {
              debouncedSearch();
            }}
          >
            <Form.Item name={"search"}>
              <Search
                placeholder={t("table.search")}
                onSearch={() => {
                  localStorage.setItem(
                    "search",
                    searchFormProps.form.getFieldsValue().search
                  );
                  searchFormProps.form.submit();
                }}
                className="table-action-search-input"
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
    </div>
  );
};
