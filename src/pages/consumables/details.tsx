/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  DateField,
  List,
  Space,
  Table,
  TextField,
  Typography,
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
  IConsumables,
  IConsumablesFilterVariables,
  IConsumablesRequest,
  IConsumablesResponse,
  IConsumablesResponseCheckout,
} from "interfaces/consumables";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "styles/antd.less";
import { ConsumablesCheckout } from "./checkout";
import { ConsumablesShow } from "./show";
import { EPermissions } from "constants/permissions";

export const ConsumableDetails: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();
  const { Title } = Typography;
  const { list } = useNavigation();

  const [isLoadingArr] = useState<boolean[]>([]);

  const [isShowModalVisible, setIsShowModalVisible] = useState(false);
  const [detailShow, setDetailShow] = useState<IConsumablesResponse>();

  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);
  const [detailCheckout, setDetailCheckout] = useState<IConsumablesResponseCheckout>();

  const [searchParams] = useSearchParams();
  const nameConsumable = searchParams.get("name");
  const category_id = searchParams.get("category_id");
  const consumable_id = searchParams.get("id");

  const { data: permissionsData } = usePermissions();

  const { tableProps, tableQueryResult } = useTable<
    IConsumablesResponse,
    HttpError,
    IConsumablesFilterVariables
  >({
    initialSorter: [
      {
        field: "id",
        order: "desc",
      },
    ],
    resource: `api/v1/consumables/view/${searchParams.get("id")}/users`,
  });

  const { tableProps: tableDetails, tableQueryResult: tableDetailsQueryResult } = useTable<
    IConsumablesFilterVariables
  >({
    resource: `api/v1/consumables?category_id=${category_id}&consumable_id=${consumable_id}`,
  });

  const collumns = useMemo(
    () => [
      {
        key: "name",
        title: translate("consumables.label.field.users"),
        render: (value: string) => (
          <div dangerouslySetInnerHTML={{ __html: `<span>${value ? value : ""}</span>` }} />
        )
      },

      {
        key: "created_at",
        title: translate("consumables.label.field.checkout_date"),
        render: (value: IConsumables) =>
          value ? (
            <DateField format="LLL" value={value ? value.datetime : ""} />
          ) : (
            ""
          )
      },
      {
        key: "admin",
        title: translate("consumables.label.field.admin"),
        render: (value: string) => (
          <div dangerouslySetInnerHTML={{ __html: `<span>${value ? value : ""}</span>` }} />
        )
      },
    ],
    []
  );

  const collumnsDetails = useMemo(
    () => [
      {
        key: "category",
        title: translate("consumables.label.field.category"),
        render: (value: IConsumablesRequest) => (
          <TextField value={value ? value.name : ""}
            onClick={() => list(`consumables?category_id=${value.id}`)}
            style={{ cursor: "pointer", color: "#3c8dbc" }} />
        ),
      },
      {
        key: "remaining",
        title: translate("consumables.label.field.remaining"),
        render: (value: number) => <TextField value={value ? value : 0} />,
      },
    ],
    []
  );

  const checkout = (data: IConsumablesResponse) => {
    const dataConvert: IConsumablesResponseCheckout = {
      id: data.id,
      name: data.name,
      category: {
        id: data?.category?.id,
        name: data?.category?.name,
      },
      note: data.notes,
      checkout_at: {
        date: moment(new Date()).format("YYYY-MM-DDTHH:mm"),
        formatted: new Date().toDateString(),
      },
      assigned_to: data?.assigned_to,
      user_can_checkout: data?.user_can_checkout,
    };

    setDetailCheckout(dataConvert);
    setIsCheckoutModalVisible(true);
  };

  const show = (data: IConsumablesResponse) => {
    setIsShowModalVisible(true);
    setDetailShow(data);
  };

  const refreshData = () => {
    tableQueryResult.refetch();
    tableDetailsQueryResult.refetch();
  };

  useEffect(() => {
    refreshData();
  }, [isCheckoutModalVisible]);

  const pageTotal = tableProps.pagination && tableProps.pagination.total;

  return (
    <List
      title={
        nameConsumable + " " + translate("consumables.label.title.consumables")
      }
    >
      <div className="list-access-cons">
        <div className="table-checkouted-access-cons">
          <Title level={5} className="box-header">{nameConsumable}</Title>
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
              <Table.Column dataIndex={col.key} {...col} />
            ))}
          </Table>
        </div>
        <div className="table-details-access-cons">
          <div className="list-user-checkout">
            <Table
              {...tableDetails}
              pagination={false}
            >
              {collumnsDetails.map((col) => (
                <Table.Column dataIndex={col.key} {...col} />
              ))}
            </Table>
          </div>
          <div className="details-checkout">
            <Table
              {...tableDetails}
              pagination={false}
            >
              <Table.Column<IConsumablesResponse>
                dataIndex="actions"
                render={(_, record) => (
                  <>
                    <Space>
                      { permissionsData.admin === EPermissions.ADMIN && (
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
                          {translate("consumables.label.button.detail")}
                        </Button>
                      )}

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
                          {translate("consumables.label.button.checkout")}
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
                          {translate("consumables.label.button.checkout")}
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
        title={translate("consumables.label.title.detail")}
        setIsModalVisible={setIsShowModalVisible}
        isModalVisible={isShowModalVisible}
      >
        <ConsumablesShow
          setIsModalVisible={setIsShowModalVisible}
          detail={detailShow}
        />
      </MModal>
      <MModal
        title={translate("consumables.label.title.checkout")}
        setIsModalVisible={setIsCheckoutModalVisible}
        isModalVisible={isCheckoutModalVisible}
      >
        <ConsumablesCheckout
          isModalVisible={isCheckoutModalVisible}
          setIsModalVisible={setIsCheckoutModalVisible}
          data={detailCheckout}
        />
      </MModal>
    </List >
  );
};
