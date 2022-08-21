import {
  Button,
  DateField,
  getDefaultSortOrder,
  List,
  Space,
  Table,
  TextField,
  useTable,
} from "@pankod/refine-antd";
import {
  HttpError,
  IResourceComponentsProps,
  useTranslate,
} from "@pankod/refine-core";
import { MModal } from "components/Modal/MModal";
import {
  IAccesory,
  IAccessoryFilterVariables,
  IAccessoryResponseCheckin,
  IAccesstoryResponse,
} from "interfaces/accessory";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AccessoryCheckin } from "./checkin";
import "styles/antd.less";

export const AccessoryDetails: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();

  const [isCheckinModalVisible, setIsCheckinModalVisible] = useState(false);
  const [detailCheckin, setDetailCheckin] =
    useState<IAccessoryResponseCheckin>();
  const [isLoadingArr] = useState<boolean[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const nameAccessary = searchParams.get("name");

  const { tableProps, sorter, tableQueryResult } = useTable<
    IAccesstoryResponse,
    HttpError,
    IAccessoryFilterVariables
  >({
    initialSorter: [
      {
        field: "id",
        order: "desc",
      },
    ],
    resource: `api/v1/accessories/${searchParams.get("id")}/checkedout`,
  });

  const collumns = useMemo(
    () => [
      {
        key: "name",
        title: translate("accessory.label.field.users"),
        render: (value: string) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("name", sorter),
      },
      {
        key: "checkout_notes",
        title: translate("accessory.label.field.notes"),
        render: (value: string) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("checkout_notes", sorter),
      },
      {
        key: "last_checkout",
        title: translate("accessory.label.field.checkout_date"),
        render: (value: IAccesory) =>
          value ? (
            <DateField format="LLL" value={value ? value.datetime : ""} />
          ) : (
            ""
          ),
        defaultSortOrder: getDefaultSortOrder("last_checkout.datetime", sorter),
      },
    ],
    []
  );

  const checkin = (data: IAccesstoryResponse) => {
    const dataConvert: IAccessoryResponseCheckin = {
      id: data.id,
      name: data.name,
      note: "",
      checkin_date: data?.checkin_date,
      assigned_pivot_id: data?.assigned_pivot_id,
    };

    setDetailCheckin(dataConvert);
    setIsCheckinModalVisible(true);
  };

  const refreshData = () => {
    tableQueryResult.refetch();
  };

  useEffect(() => {
    refreshData();
  }, [isCheckinModalVisible]);

  const pageTotal = tableProps.pagination && tableProps.pagination.total;

  return (
    <List
      title={nameAccessary + " " + translate("accessory.label.title.accessory")}
    >
      <Table
        {...tableProps}
        rowKey="id"
        pagination={{
          position: ["topRight", "bottomRight"],
          total: pageTotal ? pageTotal : 0,
        }}
      >
        {collumns
          .map((col) => (
            <Table.Column dataIndex={col.key} {...col} sorter />
          ))}
        <Table.Column<IAccesstoryResponse>
          title={translate("table.actions")}
          dataIndex="actions"
          render={(_, record) => (
            <Space>
              <Button
                type="primary"
                shape="round"
                size="small"
                loading={
                  isLoadingArr[record.id] === undefined
                    ? false
                    : isLoadingArr[record.id] === false
                      ? false
                      : true
                }
                onClick={() => checkin(record)}
              >
                {translate("accessory.label.button.checkin")}
              </Button>
            </Space>
          )}
        />
      </Table>

      <MModal
        title={translate("accessory.label.title.checkin")}
        setIsModalVisible={setIsCheckinModalVisible}
        isModalVisible={isCheckinModalVisible}
      >
        <AccessoryCheckin
          isModalVisible={isCheckinModalVisible}
          setIsModalVisible={setIsCheckinModalVisible}
          data={detailCheckin}
          name={nameAccessary}
        />
      </MModal>
    </List>
  );
};
