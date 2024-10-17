import {
  Button,
  DateField,
  List,
  Space,
  Table,
  TextField,
  useTable,
} from "@pankod/refine-antd";
import {
  HttpError,
  IResourceComponentsProps,
  useNavigation,
  usePermissions,
  useTranslate,
} from "@pankod/refine-core";
import { MModal } from "components/Modal/MModal";
import {
  IAccesory,
  IAccessoryFilterVariables,
  IAccessoryResponseCheckin,
  IAccessoryResponseCheckout,
  IAccesstoryRequest,
  IAccesstoryResponse,
} from "interfaces/accessory";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AccessoryCheckin } from "./checkin";
import "styles/antd.less";
import { AccessoryShow } from "./show";
import { AccessoryCheckout } from "./checkout";
import { EPermissions } from "constants/permissions";

export const AccessoryDetails: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();

  const [isCheckinModalVisible, setIsCheckinModalVisible] = useState(false);
  const [detailCheckin, setDetailCheckin] =
    useState<IAccessoryResponseCheckin>();

  const [isLoadingArr] = useState<boolean[]>([]);

  const [isShowModalVisible, setIsShowModalVisible] = useState(false);
  const [detailShow, setDetailShow] = useState<IAccesstoryResponse>();

  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);
  const [detailCheckout, setDetailCheckout] =
    useState<IAccessoryResponseCheckout>();

  const [searchParams] = useSearchParams();
  const nameAccessary = searchParams.get("name");
  const category_id = searchParams.get("category_id");
  const accessory_id = searchParams.get("id");

  const { list } = useNavigation();

  const { data: permissionsData } = usePermissions();

  const { tableProps, tableQueryResult } = useTable<
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
    resource: `api/v1/accessories/${accessory_id}/checkedout`,
  });

  const {
    tableProps: tableDetails,
    tableQueryResult: tableDetailsQueryResult,
  } = useTable<IAccesstoryResponse>({
    resource: `api/v1/accessories/accessories?category_id=${category_id}&accessory_id=${accessory_id}`,
  });

  const collumns = useMemo(
    () => [
      {
        key: "name",
        title: translate("accessory.label.field.users"),
        render: (value: string) => <TextField value={value ? value : ""} />,
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
      },
      {
        key: "checkout_notes",
        title: translate("accessory.label.field.notes"),
        render: (value: string) => (
          <div
            dangerouslySetInnerHTML={{
              __html: `<span>${value ? value : ""}</span>`,
            }}
          />
        ),
      },
    ],
    []
  );

  const collumnsDetails = useMemo(
    () => [
      {
        key: "category",
        title: translate("accessory.label.field.category"),
        render: (value: IAccesstoryRequest) => (
          <TextField
            value={value ? value.name : ""}
            onClick={() => list(`accessory?category_id=${value.id}`)}
            style={{ cursor: "pointer", color: "#3c8dbc" }}
          />
        ),
      },
      {
        key: "remaining_qty",
        title: translate("accessory.label.field.remaining_qty"),
        render: (value: number) => <TextField value={value ? value : 0} />,
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

  const checkout = (data: IAccesstoryResponse) => {
    const dataConvert: IAccessoryResponseCheckout = {
      id: data.id,
      name: data.name,
      category: {
        id: data?.category?.id,
        name: data?.category?.name,
      },
      note: "",
      assigned_to: data?.assigned_to,
      user_can_checkout: data?.user_can_checkout,
    };

    setDetailCheckout(dataConvert);
    setIsCheckoutModalVisible(true);
  };

  const show = (data: IAccesstoryResponse) => {
    setIsShowModalVisible(true);
    setDetailShow(data);
  };

  const refreshData = () => {
    tableQueryResult.refetch();
    tableDetailsQueryResult.refetch();
  };

  useEffect(() => {
    refreshData();
  }, [isCheckinModalVisible]);

  useEffect(() => {
    refreshData();
  }, [isCheckoutModalVisible]);

  const pageTotal = tableProps.pagination && tableProps.pagination.total;

  return (
    <List
      title={nameAccessary + " " + translate("accessory.label.title.accessory")}
    >
      <div className="list-access-cons">
        <div className="table-checkouted-access-cons">
          <Table
            className="list-table"
            {...tableProps}
            rowKey="id"
            pagination={
              (pageTotal as number) > 10
                ? {
                    position: ["topRight", "bottomRight"],
                    total: pageTotal ? pageTotal : 0,
                    showSizeChanger: true,
                  }
                : false
            }
          >
            {collumns.map((col) => (
              <Table.Column dataIndex={col.key} {...col} key={col.key} />
            ))}
            <Table.Column<IAccesstoryResponse>
              title={translate("table.actions")}
              dataIndex="actions"
              render={(_, record) => (
                <Space>
                  {permissionsData.admin === EPermissions.ADMIN && (
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
                  )}
                </Space>
              )}
            />
          </Table>
        </div>

        <div className="table-details-access-cons">
          <div className="list-user-checkout">
            <Table className="list-table" {...tableDetails} pagination={false}>
              {collumnsDetails.map((col) => (
                <Table.Column dataIndex={col.key} {...col} key={col.key} />
              ))}
            </Table>
          </div>
          <div className="details-checkout">
            <Table className="list-table" {...tableDetails} pagination={false}>
              <Table.Column<IAccesstoryResponse>
                dataIndex="actions"
                render={(_, record) => (
                  <>
                    <Space>
                      <Button
                        className="ant-btn-detail"
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
                        onClick={() => show(record)}
                      >
                        {translate("accessory.label.button.detail")}
                      </Button>

                      {record.user_can_checkout === true && (
                        <Button
                          className="ant-btn-checkout"
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
                          onClick={() => checkout(record)}
                        >
                          {translate("accessory.label.button.checkout")}
                        </Button>
                      )}

                      {record.user_can_checkout === false && (
                        <Button
                          className="ant-btn-checkout"
                          type="primary"
                          shape="round"
                          size="small"
                          disabled
                        >
                          {translate("accessory.label.button.checkout")}
                        </Button>
                      )}
                    </Space>
                  </>
                )}
              />
            </Table>
          </div>
        </div>
      </div>
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
      <MModal
        title={translate("accessory.label.title.detail")}
        setIsModalVisible={setIsShowModalVisible}
        isModalVisible={isShowModalVisible}
      >
        <AccessoryShow
          setIsModalVisible={setIsShowModalVisible}
          detail={detailShow}
        />
      </MModal>
      <MModal
        title={translate("accessory.label.title.checkout")}
        setIsModalVisible={setIsCheckoutModalVisible}
        isModalVisible={isCheckoutModalVisible}
      >
        <AccessoryCheckout
          isModalVisible={isCheckoutModalVisible}
          setIsModalVisible={setIsCheckoutModalVisible}
          data={detailCheckout}
        />
      </MModal>
    </List>
  );
};
