/* eslint-disable react-hooks/exhaustive-deps */
import { Icons } from "@pankod/refine-antd";
import { useTranslate } from "@pankod/refine-core";
import { Button, Checkbox, Col, Divider, Dropdown, Form, Input, List, Menu, Row, Space } from "antd";
import { useCallback, useMemo, useState } from "react";
import { ICheckboxChange } from "interfaces";
const { Search } = Input;
export declare type CheckboxValueType = string | number | boolean;
export interface ISelectTableCol {
    onChange: (list: Array<CheckboxValueType>) => void;
    options: string[];
    defaultValue: Array<CheckboxValueType>;
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
        }
    ];
    onSearch?: (keyword: string) => void;
    collumns?: string[];
    defaultCollumns?: string[];
    searchFormProps: any;
}

export const TableAction = (props: ITableAction) => {
    const { actions, searchFormProps, collumns, defaultCollumns } = props;
    const t = useTranslate();

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
    const onSelectCollumn = useCallback(() => { }, []);

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
                                    placeholder={t("table.search")}
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
