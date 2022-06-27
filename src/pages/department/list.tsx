import { Tooltip } from 'antd';
import {
    useTranslate,
    IResourceComponentsProps,
    CrudFilters,
} from "@pankod/refine-core";
import {
    List,
    Table,
    TextField,
    useTable,
    getDefaultSortOrder,
    Space,
    EditButton,
    DeleteButton,
    CreateButton,
} from "@pankod/refine-antd";
import { TableAction } from "components/elements/tables/TableAction";
import { useEffect, useMemo, useState } from "react";
import { MModal } from "components/Modal/MModal";
import { DepartmentCreate } from "./create";
import { DEPARTMENT_API } from 'api/baseApi';
import { IDepartment, IDepartmentResponse } from 'interfaces/department';
import { DepartmentEdit } from './edit';

export const DepartmentList: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [detail, setDetail] = useState<IDepartmentResponse>();

    const { tableProps, sorter, searchFormProps, tableQueryResult } = useTable<IDepartment>({
        initialSorter: [
            {
                field: "id",
                order: "desc",
            },
        ],
        resource: DEPARTMENT_API,
        onSearch: (params: any) => {
            const filters: CrudFilters = [];
            const { search } = params
            filters.push({
                field: "search",
                operator: "eq",
                value: search,
            });
            return filters;
        },
    });

    const collumns = useMemo(
        () => [
            {
                key: "name",
                title: t("department.label.field.name"),
                render: (value: IDepartment) => <TextField value={value} />,
                defaultSortOrder: getDefaultSortOrder("name", sorter),
            },
            {
                key: "manager",
                title: t("department.label.field.manager"),
                render: (value: IDepartment) => <TextField value={value ? value.name : ""} />,
            },
            {
                key: "users_count",
                title: t("department.label.field.user"),
                render: (value: IDepartment) => <TextField value={value} />,
            },
            {
                key: "location",
                title: t("department.label.field.location"),
                render: (value: IDepartment) => <TextField value={value ? value.name : ""} />,
            },
        ],
        []
    );

    const handleCreate = () => {
        handleOpenModel();
    };

    const handleOpenModel = () => {
        setIsModalVisible(!isModalVisible);
    };

    const edit = (data: IDepartmentResponse) => {
        const dataConvert: IDepartmentResponse = {
            id: data.id,
            name: data.name,
            image: data.image,
            company: {
                id: data?.company?.id,
                name: data?.company?.name,
            },
            manager: {
                id: data?.manager?.id,
                name: data?.manager?.name,
            },
            location: {
                id: data?.location?.id,
                name: data?.location?.name,
            },
            users_count: data?.users_count
        };

        setDetail(dataConvert);
        setIsEditModalVisible(true);
    };

    const refreshData = () => {
        tableQueryResult.refetch();
    };

    useEffect(() => {
        refreshData();
    }, [isEditModalVisible]);

    return (
        <List
            title={t("department.label.title.department")}
            pageHeaderProps={{
                extra:
                    (<Tooltip title={t("department.label.tooltip.create")} color={"#108ee9"}>
                        <CreateButton onClick={handleCreate} />
                    </Tooltip>),
            }}>
            <TableAction searchFormProps={searchFormProps} />
            <MModal
                title={t("department.label.title.create")}
                setIsModalVisible={setIsModalVisible}
                isModalVisible={isModalVisible}
            >
                <DepartmentCreate
                    setIsModalVisible={setIsModalVisible}
                    isModalVisible={isModalVisible}
                />
            </MModal>
            <MModal
                title={t("department.label.title.edit")}
                setIsModalVisible={setIsEditModalVisible}
                isModalVisible={isEditModalVisible}
            >
                <DepartmentEdit
                    isModalVisible={isEditModalVisible}
                    setIsModalVisible={setIsEditModalVisible}
                    data={detail}
                />
            </MModal>

            <Table {...tableProps} rowKey="id">
                {collumns.map((col) => (
                    <Table.Column dataIndex={col.key} {...col} sorter />
                ))}
                <Table.Column<IDepartmentResponse>
                    title={t("table.actions")}
                    dataIndex="actions"
                    render={(_, record) => (
                        <Space>
                            <Tooltip title={t("department.label.tooltip.edit")} color={"#108ee9"}>
                                <EditButton
                                    hideText
                                    size="small"
                                    recordItemId={record.id}
                                    onClick={() => edit(record)}
                                />
                            </Tooltip>
                            {record.users_count > 0 ? (
                                <DeleteButton
                                    hideText
                                    size="small"
                                    disabled
                                />
                            ) : (
                                <Tooltip title={t("department.label.tooltip.delete")} color={"#d73925"}>
                                    <DeleteButton
                                        resourceName={DEPARTMENT_API}
                                        hideText
                                        size="small"
                                        recordItemId={record.id}
                                    />
                                </Tooltip>
                            )}
                        </Space>
                    )}
                />
            </Table>
        </List >
    )
}