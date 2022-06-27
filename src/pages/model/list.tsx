import { IModel } from "@antv/l7-core";
import { Image, Tooltip } from 'antd';
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
    CloneButton,
    EditButton,
    DeleteButton,
    CreateButton,
} from "@pankod/refine-antd";
import { TableAction } from "components/elements/tables/TableAction";
import { useEffect, useMemo, useState } from "react";
import { MModal } from "components/Modal/MModal";
import { ModelCreate } from "./create";
import { IModelResponse } from "interfaces/model";
import { ModelEdit } from "./edit";
import { ModelClone } from "./clone";
import { MODELS_API } from "api/baseApi";

export const ModelList: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [detail, setDetail] = useState<IModelResponse>();
    const [isCloneModalVisible, setIsCloneModalVisible] = useState(false);
    const [detailClone, setDetailClone] = useState<IModelResponse>();

    const { tableProps, sorter, searchFormProps, tableQueryResult } = useTable<IModel>({
        initialSorter: [
            {
                field: "id",
                order: "desc",
            },
        ],
        resource: MODELS_API,
        onSearch: (params: any) => {
            const filters: CrudFilters = [];
            const { search } = params;
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
                title: t("model.label.field.name"),
                render: (value: IModel) => <TextField value={value} />,
                defaultSortOrder: getDefaultSortOrder("name", sorter),
            },
            {
                key: "image",
                title: t("model.label.field.images"),
                render: (value: string) => {
                    return value
                        ? (
                            <Image
                                width={50}
                                height={'auto'}
                                src={value}
                            />
                        )
                        : ""
                }
            },
            {
                key: "assets_count",
                title: t("model.label.field.assets"),
                render: (value: number) => <TextField value={value} />,
                defaultSortOrder: getDefaultSortOrder("assets_count", sorter),
            },
            {
                key: "eol",
                title: t("model.label.field.eol"),
                render: (value: string) => <TextField value={value} />,
                defaultSortOrder: getDefaultSortOrder("eol", sorter),
            }
        ],
        []
    );

    const handleCreate = () => {
        handleOpenModel();
    };

    const handleOpenModel = () => {
        setIsModalVisible(!isModalVisible);
    };

    const edit = (data: IModelResponse) => {
        const dataConvert: IModelResponse = {
            id: data.id,
            name: data.name,
            manufacturer: {
                id: data?.manufacturer?.id,
                name: data?.manufacturer?.name,
            },
            category: {
                id: data?.category.id,
                name: data?.category.name,
            },
            eol: data.eol,
            image: data?.image,
            model_number: data?.model_number,
            notes: data?.notes,
            requestable: data?.requestable,
            assets_count: data?.assets_count,
            depreciation: data?.depreciation,
            fieldset: data?.fieldset
        };

        setDetail(dataConvert);
        setIsEditModalVisible(true);
    };

    const clone = (data: IModelResponse) => {
        const dataConvert: IModelResponse = {
            id: data.id,
            name: data.name,
            manufacturer: {
                id: data?.manufacturer?.id,
                name: data?.manufacturer?.name,
            },
            category: {
                id: data?.category.id,
                name: data?.category.name,
            },
            eol: data.eol,
            image: data?.image,
            model_number: data?.model_number,
            notes: data?.notes,
            requestable: data?.requestable,
            assets_count: data?.assets_count,
            depreciation: data?.depreciation,
            fieldset: data?.fieldset
        };

        setDetailClone(dataConvert);
        setIsCloneModalVisible(true);
    };

    const refreshData = () => {
        tableQueryResult.refetch();
    };

    useEffect(() => {
        refreshData();
    }, [isEditModalVisible]);

    useEffect(() => {
        refreshData();
    }, [isCloneModalVisible]);

    return (
        <List
            title={t("model.label.title.model")}
            pageHeaderProps={{
                extra:
                    (<Tooltip title={t("model.label.tooltip.create")} color={"#108ee9"}>
                        <CreateButton onClick={handleCreate} />
                    </Tooltip>),
            }}>
            <TableAction searchFormProps={searchFormProps} />
            <MModal
                title={t("model.label.title.create")}
                setIsModalVisible={setIsModalVisible}
                isModalVisible={isModalVisible}
            >
                <ModelCreate
                    setIsModalVisible={setIsModalVisible}
                    isModalVisible={isModalVisible}
                />
            </MModal>
            <MModal
                title={t("model.label.title.edit")}
                setIsModalVisible={setIsEditModalVisible}
                isModalVisible={isEditModalVisible}
            >
                <ModelEdit
                    isModalVisible={isEditModalVisible}
                    setIsModalVisible={setIsEditModalVisible}
                    data={detail}
                />
            </MModal>
            <MModal
                title={t("model.label.title.clone")}
                setIsModalVisible={setIsCloneModalVisible}
                isModalVisible={isCloneModalVisible}
            >
                <ModelClone
                    isModalVisible={isCloneModalVisible}
                    setIsModalVisible={setIsCloneModalVisible}
                    data={detailClone}
                />
            </MModal>
            <Table {...tableProps} rowKey="id">
                {collumns.map((col) => (
                    <Table.Column dataIndex={col.key} {...col} sorter />
                ))}
                <Table.Column<IModelResponse>
                    title={t("table.actions")}
                    dataIndex="actions"
                    render={(_, record) => (
                        <Space>
                            <Tooltip title={t("model.label.tooltip.clone")} color={"#108ee9"}>
                                <CloneButton
                                    hideText
                                    size="small"
                                    recordItemId={record.id}
                                    onClick={() => clone(record)}
                                />
                            </Tooltip>
                            <Tooltip title={t("model.label.tooltip.edit")} color={"#108ee9"}>
                                <EditButton
                                    hideText
                                    size="small"
                                    recordItemId={record.id}
                                    onClick={() => edit(record)}
                                />
                            </Tooltip>
                            {record.assets_count > 0 ? (
                                <DeleteButton
                                    hideText
                                    size="small"
                                    disabled
                                />
                            ) : (
                                <Tooltip title={t("model.label.tooltip.delete")} color={"#d73925"}>
                                    <DeleteButton
                                        resourceName={MODELS_API}
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
        </List>
    )
}