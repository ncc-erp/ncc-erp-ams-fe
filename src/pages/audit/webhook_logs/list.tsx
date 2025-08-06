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
  TagField,
  Tooltip,
  DateField,
  DeleteButton,
  ShowButton,
} from "@pankod/refine-antd";
import "styles/antd.less";

import { TableAction } from "components/elements/tables/TableAction";
import { useEffect, useMemo, useState } from "react";
import { WEBHOOK_LOGS_API, WEBHOOK_LOGS_TOTAL_DETAIL_API } from "api/baseApi";
import { DatePicker, Form, Spin } from "antd";
import { useSearchParams } from "react-router-dom";
import { IHardware } from "interfaces";
import { IWebhookLogsResponse, IWebhookLogs } from "interfaces/webhook_logs";
import moment from "moment";
import { dateFormat } from "constants/assets";
import { TotalDetail } from "components/elements/TotalDetail";
import { MModal } from "components/Modal/MModal";
import { WebhookLogsShow } from "./show";
import { WebhookEventType } from "constants/webhook";

export const WebhookLogs: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();

  const [isEditModalVisible] = useState(false);
  const [detail, setDetail] = useState<IWebhookLogsResponse>();
  const [isShowModalVisible, setIsShowModalVisible] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const dateFromParam = searchParams.get("date_from");
  const dateToParam = searchParams.get("date_to");
  const { RangePicker } = DatePicker;

  const typeFilterOptions = useMemo(
    () =>
      Object.entries(WebhookEventType).map(([key, label]) => ({
        text: label,
        value: key,
      })),
    []
  );
  const { tableProps, sorter, searchFormProps, tableQueryResult, filters } =
    useTable<IWebhookLogsResponse>({
      initialSorter: [
        {
          field: "id",
          order: "asc",
        },
      ],
      resource: WEBHOOK_LOGS_API,
      onSearch: (params: any) => {
        const filters: CrudFilters = [];
        const { search, date_from, date_to } = params;
        filters.push(
          {
            field: "search",
            operator: "eq",
            value: search,
          },
          {
            field: "date_from",
            operator: "eq",
            value: date_from ? date_from : dateFromParam,
          },
          {
            field: "date_to",
            operator: "eq",
            value: date_to ? date_to : dateToParam,
          }
        );
        return filters;
      },
    });

  const show = (data: IWebhookLogsResponse) => {
    setIsShowModalVisible(true);
    setDetail(data);
  };

  const collumns = useMemo(
    () => [
      {
        key: "id",
        title: "ID",
        render: (value: IWebhookLogs) => (
          <TextField value={value ? value : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("id", sorter),
        width: 50,
      },
      {
        key: "webhook",
        title: t("webhook_logs.label.field.webhook"),
        render: (_: any, record: IWebhookLogsResponse) => (
          <TextField value={record.webhook ? record.webhook.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("webhook", sorter),
        width: 200,
      },
      {
        key: "asset",
        title: t("webhook_logs.label.field.asset"),
        render: (value: IWebhookLogs) => (
          <TextField value={value ? value : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("asset", sorter),
        width: 250,
      },
      {
        key: "url",
        title: t("webhook_logs.label.field.url"),
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
        width: 550,
      },
      {
        key: "type",
        title: t("webhook_logs.label.field.type"),
        render: (_: any, record: IWebhookLogsResponse) => {
          const typeText =
            WebhookEventType[record.type as keyof typeof WebhookEventType] ||
            record.type ||
            "";
          return <TextField value={typeText} />;
        },
        defaultSortOrder: getDefaultSortOrder("type", sorter),
        filters: typeFilterOptions,
        onFilter: (value: string, record: IWebhookLogsResponse) => {
          return record.type === value;
        },
        width: 250,
      },
      {
        key: "message",
        title: t("webhook_logs.label.field.message"),
        render: (value: IWebhookLogs) => (
          <TextField value={value ? value : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("message", sorter),
        width: 450,
      },
      {
        key: "status_code",
        title: t("webhook_logs.label.field.status_code"),
        render: (_: any, record: IWebhookLogsResponse) => {
          let statusText = "";
          let color = "blue";
          if (record.status_code === 200) {
            statusText = "Success";
            color = "green";
          } else if (record.status_code === 400) {
            statusText = "Fail";
            color = "red";
          } else if (record.status_code === 500) {
            statusText = "Error";
            color = "red";
          }
          return <TagField value={statusText} color={color} />;
        },
        defaultSortOrder: getDefaultSortOrder("status_code", sorter),
        filters: [
          { text: "Success", value: 200 },
          { text: "Fail", value: 400 },
          { text: "Error", value: 500 },
        ],
        onFilter: (value: number, record: IWebhookLogsResponse) => {
          if (value === 200) {
            return record.status_code === 200;
          } else {
            return record.status_code === 400 || record.status_code === 500;
          }
        },
        width: 150,
      },
      {
        key: "response",
        title: t("webhook_logs.label.field.response"),
        render: (value: IWebhookLogs) => (
          <TextField value={value ? value : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("response", sorter),
        width: 250,
      },
      {
        key: "created_at",
        title: t("webhook_logs.label.field.created_at"),
        render: (value: IHardware) => (
          <DateField format="LLL" value={value ? value.datetime : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("created_at.formatted", sorter),
        width: 200,
      },
      {
        key: "updated_at",
        title: t("webhook_logs.label.field.updated_at"),
        render: (value: IHardware) => (
          <DateField format="LLL" value={value ? value.datetime : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("updated_at.formatted", sorter),
        width: 200,
      },
    ],
    []
  );

  const refreshData = () => {
    tableQueryResult.refetch();
  };

  const handleDateChange = (value: any) => {
    if (value !== null) {
      const [from, to] = Array.from(value || []) as moment.Moment[];
      searchParams.set(
        "date_from",
        from?.format("YY-MM-DD") ? from?.format("YY-MM-DD").toString() : ""
      );
      searchParams.set(
        "date_to",
        to?.format("YY-MM-DD") ? to?.format("YY-MM-DD").toString() : ""
      );
    } else {
      searchParams.delete("date_from");
      searchParams.delete("date_to");
    }

    setSearchParams(searchParams);
    searchFormProps.form?.submit();
  };

  useEffect(() => {
    refreshData();
  }, [isEditModalVisible]);

  const pageTotal = tableProps.pagination && tableProps.pagination.total;

  return (
    <List title={t("webhook_logs.label.title.webhook")}>
      <div className="search">
        <Form
          layout="vertical"
          className="search-month-location"
          initialValues={{
            created_at:
              dateFromParam && dateToParam
                ? [
                    moment(dateFromParam, dateFormat),
                    moment(dateToParam, dateFormat),
                  ]
                : "",
          }}
          onValuesChange={() => searchFormProps.form?.submit()}
        >
          <Form.Item
            label={t("dashboard.placeholder.searchToDate")}
            name="created_at"
          >
            <RangePicker
              onCalendarChange={handleDateChange}
              format={dateFormat}
              placeholder={[
                `${t("dashboard.field.start-date")}`,
                `${t("dashboard.field.end-date")}`,
              ]}
            />
          </Form.Item>
        </Form>
        <div className="all">
          <TableAction searchFormProps={searchFormProps} />
        </div>
      </div>
      <TotalDetail
        filters={filters}
        links={WEBHOOK_LOGS_TOTAL_DETAIL_API}
        isReload={false}
      ></TotalDetail>
      <MModal
        title={t("webhook_logs.label.title.detail")}
        setIsModalVisible={setIsShowModalVisible}
        isModalVisible={isShowModalVisible}
      >
        <WebhookLogsShow
          setIsModalVisible={setIsShowModalVisible}
          detail={detail}
        />
      </MModal>
      {tableProps.loading ? (
        <>
          <div style={{ paddingTop: "15rem", textAlign: "center" }}>
            <Spin
              tip={`${t("loading")}...`}
              style={{ fontSize: "18px", color: "black" }}
            />
          </div>
        </>
      ) : (
        <Table
          className={(pageTotal as number) <= 10 ? "list-table" : ""}
          {...tableProps}
          rowKey="id"
          pagination={
            (pageTotal as number) > 10
              ? {
                  ...tableProps.pagination,
                  position: ["topRight", "bottomRight"],
                  total: pageTotal ? pageTotal : 0,
                  showSizeChanger: true,
                }
              : false
          }
          scroll={{ x: 2600 }}
        >
          {collumns.map((col) => (
            <Table.Column
              dataIndex={col.key}
              {...(col as any)}
              key={col.key}
              sorter
            />
          ))}
          <Table.Column<IWebhookLogsResponse>
            title={t("table.actions")}
            dataIndex="actions"
            render={(_, record) => (
              <Space>
                <Tooltip
                  title={t("webhook_logs.label.tooltip.viewDetail")}
                  color={"#108ee9"}
                >
                  <ShowButton
                    hideText
                    size="small"
                    recordItemId={record.id}
                    onClick={() => show(record)}
                  />
                </Tooltip>
                <Tooltip
                  title={t("webhook_logs.label.field.delete")}
                  color={"red"}
                >
                  <DeleteButton
                    resourceName={WEBHOOK_LOGS_API}
                    hideText
                    size="small"
                    recordItemId={record.id}
                  />
                </Tooltip>
              </Space>
            )}
          />
        </Table>
      )}
    </List>
  );
};
