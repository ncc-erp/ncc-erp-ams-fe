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
import { KOMU_LOGS_API, KOMU_LOGS_TOTAL_DETAIL_API } from "api/baseApi";
import { DatePicker, Form, Spin } from "antd";
import { useSearchParams } from "react-router-dom";
import { IHardware } from "interfaces";
import { IKomuLogs, IKomuLogsResponse } from "interfaces/komu_logs";
import { KomuLogsShow } from "./show";
import { MModal } from "components/Modal/MModal";
import moment from "moment";
import { dateFormat } from "constants/assets";
import { STATUS_KOMU_LOGS } from "constants/komu_logs";
import { TotalDetail } from "components/elements/TotalDetail";

export const KomuLogs: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();

  const [isEditModalVisible] = useState(false);
  const [detail, setDetail] = useState<IKomuLogsResponse>();
  const [isShowModalVisible, setIsShowModalVisible] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const dateFromParam = searchParams.get("date_from");
  const dateToParam = searchParams.get("date_to");
  const { RangePicker } = DatePicker;

  const { tableProps, sorter, searchFormProps, tableQueryResult, filters } =
    useTable<IKomuLogsResponse>({
      initialSorter: [
        {
          field: "id",
          order: "asc",
        },
      ],
      resource: KOMU_LOGS_API,
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
          },
          {
            field: "status",
            operator: "eq",
            value: searchParams.get("status"),
          }
        );
        return filters;
      },
    });

  const show = (data: IKomuLogsResponse) => {
    setIsShowModalVisible(true);
    setDetail(data);
  };

  const formatMessage = (message: string) => {
    if (!message) return "";

    let formatted = message;
    formatted = formatted.replace(/\*\*/g, "");
    formatted = formatted.replace(/\\n/g, "\n");
    formatted = formatted.replace(/\\u[\dA-F]{4}/gi, "");
    formatted = formatted.replace(/\\\//g, "/");
    formatted = formatted.replace(/\\([\\\/'"])/g, "$1");

    return <span style={{ whiteSpace: "pre-line" }}>{formatted.trim()}</span>;
  };

  const collumns = useMemo(
    () => [
      {
        key: "id",
        title: "ID",
        render: (value: IKomuLogs) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("id", sorter),
        width: 50,
      },
      {
        key: "send_to",
        title: t("komu_logs.label.field.send_to"),
        render: (value: IKomuLogs, record: any) => (
          <TextField value={value ? value : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("send_to", sorter),
        width: 200,
      },
      {
        key: "message",
        title: t("komu_logs.label.field.message"),
        render: (_: any, record: IKomuLogsResponse) =>
          formatMessage(record.message),
        defaultSortOrder: getDefaultSortOrder("message", sorter),
        width: 400,
      },
      {
        key: "creator",
        title: t("komu_logs.label.field.creator"),
        render: (_: any, record: IKomuLogsResponse) => (
          <TextField value={record.creator ? record.creator.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("creator.name", sorter),
        width: 150,
      },
      {
        key: "company",
        title: t("komu_logs.label.field.company"),
        render: (_: any, record: IKomuLogsResponse) => (
          <TextField value={record.company ? record.company.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("company.name", sorter),
        width: 150,
      },
      {
        key: "system_response",
        title: t("komu_logs.label.field.system_response"),
        render: (value: IKomuLogs) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("system_response", sorter),
        width: 250,
      },
      {
        key: "status",
        title: t("komu_logs.label.field.status"),
        render: (_: any, record: IKomuLogsResponse) => {
          let statusText = "";
          let color = "blue";
          if (record.status === STATUS_KOMU_LOGS.SUCCESS) {
            statusText = "Success";
            color = "green";
          } else if (record.status === STATUS_KOMU_LOGS.FAIL) {
            statusText = "Fail";
            color = "red";
          }
          return <TagField value={statusText} color={color} />;
        },
        defaultSortOrder: getDefaultSortOrder("status", sorter),
        filters: [
          { text: "Success", value: STATUS_KOMU_LOGS.SUCCESS },
          { text: "Fail", value: STATUS_KOMU_LOGS.FAIL },
        ],
        onFilter: (value: number, record: IKomuLogsResponse) => {
          return record.status === value;
        },
        width: 150,
      },
      {
        key: "created_at",
        title: t("komu_logs.label.field.created_at"),
        render: (value: IHardware) => (
          <DateField format="LLL" value={value ? value.datetime : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("created_at.formatted", sorter),
        width: 200,
      },
      {
        key: "updated_at",
        title: t("komu_logs.label.field.updated_at"),
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
    <List title={t("komu_logs.label.title.komu")}>
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
        links={KOMU_LOGS_TOTAL_DETAIL_API}
        isReload={false}
      ></TotalDetail>
      <MModal
        title={t("komu_logs.label.title.detail")}
        setIsModalVisible={setIsShowModalVisible}
        isModalVisible={isShowModalVisible}
      >
        <KomuLogsShow
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
          scroll={{ x: 1900 }}
        >
          {collumns.map((col) => (
            <Table.Column
              dataIndex={col.key}
              {...(col as any)}
              key={col.key}
              sorter
            />
          ))}
          <Table.Column<IKomuLogsResponse>
            title={t("table.actions")}
            dataIndex="actions"
            render={(_, record) => (
              <Space>
                <Tooltip
                  title={t("komu_logs.label.tooltip.viewDetail")}
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
                  title={t("komu_logs.label.field.delete")}
                  color={"red"}
                >
                  <DeleteButton
                    resourceName={KOMU_LOGS_API}
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
