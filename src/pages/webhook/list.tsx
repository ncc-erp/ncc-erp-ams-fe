import {
  CreateButton,
  DateField,
  DeleteButton,
  EditButton,
  getDefaultSortOrder,
  List,
  ShowButton,
  Space,
  Table,
  TagField,
  TextField,
  Tooltip,
  useTable,
} from "@pankod/refine-antd";
import {
  CrudFilters,
  IResourceComponentsProps,
  useTranslate,
} from "@pankod/refine-core";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { WEBHOOK_API } from "api/baseApi";
import { TableAction } from "components/elements/tables/TableAction";
import { MModal } from "components/Modal/MModal";
import { IHardware } from "interfaces";
import { IWebhook, IWebhookResponse } from "interfaces/webhook";
import "styles/antd.less";
import { WebhookCreate } from "./create";
import { WebhookEdit } from "./edit";
import { WebhookShow } from "./show";
import { TABLE_PAGINATION, TABLE_SCROLL } from "constants/table";

export const WebhookList: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [detail, setDetail] = useState<IWebhookResponse>();
  const [isShowModalVisible, setIsShowModalVisible] = useState(false);

  const [searchParams] = useSearchParams();
  const webhook_id = searchParams.get("webhook_id");

  const { tableProps, sorter, searchFormProps, tableQueryResult } =
    useTable<IWebhookResponse>({
      initialSorter: [
        {
          field: "id",
          order: "asc",
        },
      ],
      resource: WEBHOOK_API,
      onSearch: (params: any) => {
        const filters: CrudFilters = [];
        const { search } = params;
        filters.push(
          {
            field: "search",
            operator: "eq",
            value: search,
          },
          {
            field: "webhook_id",
            operator: "eq",
            value: webhook_id,
          }
        );
        return filters;
      },
    });

  const edit = (data: IWebhookResponse) => {
    const dataConvert: IWebhookResponse = {
      id: data.id,
      name: data.name,
      url: data.url,
      type: data.type,
    };

    setDetail(dataConvert);
    setIsEditModalVisible(true);
  };
  const show = (data: IWebhookResponse) => {
    setIsShowModalVisible(true);
    setDetail(data);
  };

  const collumns = useMemo(
    () => [
      {
        key: "id",
        title: "ID",
        render: (value: IWebhook) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("id", sorter),
      },
      {
        key: "name",
        title: t("webhook.label.field.name"),
        render: (value: IWebhook) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("name", sorter),
      },
      {
        key: "url",
        title: t("webhook.label.field.url"),
        render: (value: string) => {
          const shortUrl =
            value?.length > 70 ? value.slice(0, 70) + "..." : value;
          return (
            <Tooltip title={value}>
              <TagField value={shortUrl || "N/A"} />
            </Tooltip>
          );
        },
        defaultSortOrder: getDefaultSortOrder("url", sorter),
      },
      {
        key: "created_at",
        title: t("webhook.label.field.created_at"),
        render: (value: IHardware) => (
          <DateField format="LLL" value={value ? value.datetime : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("created_at.formatted", sorter),
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

  const refreshData = () => {
    tableQueryResult.refetch();
  };

  useEffect(() => {
    refreshData();
  }, [isEditModalVisible]);

  const pageTotal: number = useMemo(() => {
    return (tableProps.pagination && tableProps.pagination.total) || 0;
  }, [tableProps.pagination]);

  return (
    <List
      title={t("webhook.label.title.nameTitle")}
      pageHeaderProps={{
        extra: (
          <CreateButton onClick={handleCreate}>
            {t("webhook.label.field.create")}
          </CreateButton>
        ),
      }}
    >
      <div className="all">
        <TableAction searchFormProps={searchFormProps} />
      </div>
      <MModal
        title={t("webhook.label.title.create")}
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
      >
        <WebhookCreate
          setIsModalVisible={setIsModalVisible}
          isModalVisible={isModalVisible}
        />
      </MModal>
      <MModal
        title={t("webhook.label.title.edit")}
        setIsModalVisible={setIsEditModalVisible}
        isModalVisible={isEditModalVisible}
      >
        <WebhookEdit
          isModalVisible={isEditModalVisible}
          setIsModalVisible={setIsEditModalVisible}
          data={detail}
        />
      </MModal>
      <MModal
        title={t("webhook.label.title.detail")}
        setIsModalVisible={setIsShowModalVisible}
        isModalVisible={isShowModalVisible}
      >
        <WebhookShow
          setIsModalVisible={setIsShowModalVisible}
          detail={detail}
        />
      </MModal>
      <Table
        className={
          pageTotal <= TABLE_PAGINATION.DEFAULT_PAGE_SIZE ? "list-table" : ""
        }
        {...tableProps}
        rowKey="id"
        pagination={
          pageTotal > TABLE_PAGINATION.DEFAULT_PAGE_SIZE
            ? {
                position: ["topRight", "bottomRight"],
                total: pageTotal ? pageTotal : 0,
                showSizeChanger: true,
              }
            : false
        }
        scroll={TABLE_SCROLL.DEFAULT}
      >
        {collumns.map((col) => (
          <Table.Column dataIndex={col.key} {...col} key={col.key} sorter />
        ))}
        <Table.Column<IWebhookResponse>
          title={t("table.actions")}
          dataIndex="actions"
          render={(_, record) => (
            <Space>
              <Tooltip
                title={t("webhook.label.tooltip.viewDetail")}
                color={"#108ee9"}
              >
                <ShowButton
                  hideText
                  size="small"
                  recordItemId={record.id}
                  onClick={() => show(record)}
                />
              </Tooltip>
              <Tooltip title={t("webhook.label.field.edit")} color={"#108ee9"}>
                <EditButton
                  hideText
                  size="small"
                  recordItemId={record.id}
                  onClick={() => edit(record)}
                />
              </Tooltip>
              <Tooltip title={t("webhook.label.field.delete")} color={"red"}>
                <DeleteButton
                  resourceName={WEBHOOK_API}
                  hideText
                  size="small"
                  recordItemId={record.id}
                />
              </Tooltip>
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
