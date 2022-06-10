/* eslint-disable react-hooks/exhaustive-deps */
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
  DateField,
  Space,
  CloneButton,
  EditButton,
  DeleteButton,
  TagField,
  CreateButton,
  Button,
  ShowButton,
  Tooltip,
} from "@pankod/refine-antd";
import { Image } from "antd";
import "styles/antd.less";

import { ICheckboxProps, IHardware } from "interfaces";
import { TableAction } from "components/elements/tables/TableAction";
import { useEffect, useMemo, useState } from "react";
import { MModal } from "components/Modal/MModal";
import { HardwareCreate } from "./create";
import { HardwareEdit } from "./edit";
import { HardwareClone } from "./clone";
import { HardwareShow } from "./show";

import { IHardwareResponse } from "interfaces/hardware";
import { HardwareCheckout } from "./checkout";
import { HardwareCheckin } from "./checkin";

export const HardwareList: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [detail, setDetail] = useState<IHardwareResponse>();
  const [detailCheckout, setDetailCheckout] = useState<any>({});
  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);

  const [isLoadingArr] = useState<boolean[]>([]);
  const [isCloneModalVisible, setIsCloneModalVisible] = useState(false);
  const [isShowModalVisible, setIsShowModalVisible] = useState(false);

  const [isCheckinModalVisible, setIsCheckinModalVisible] = useState(false);
  const [detailCheckin, setDetailCheckin] = useState<any>({});

  const [detailClone, setDetailClone] = useState<IHardwareResponse>();

  const { tableProps, sorter, searchFormProps, tableQueryResult } =
    useTable<IHardwareResponse>({
      initialSorter: [
        {
          field: "id",
          order: "desc",
        },
      ],
      resource: "api/v1/hardware",
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

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: IHardware[]) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record: ICheckboxProps) => ({
      disabled: record.name === "Disabled User",
      name: record.name,
    }),
  };

  const edit = (data: IHardwareResponse) => {
    const dataConvert: IHardwareResponse = {
      id: data.id,
      name: data.name,
      asset_tag: data.asset_tag,
      serial: data.serial !== "undefined" ? data.serial : "",
      model: {
        id: data?.model?.id,
        name: data?.model?.name,
      },
      model_number: data?.order_number,
      status_label: {
        id: data?.status_label.id,
        name: data?.status_label.name,
        status_type: data?.status_label.status_type,
        status_meta: data?.status_label.status_meta,
      },
      category: {
        id: data?.category?.id,
        name: data?.category?.name,
      },
      supplier: {
        id: data?.supplier?.id,
        name: data?.supplier?.name,
      },
      notes: data.notes,
      order_number: data.order_number !== "null" ? data.order_number : "",
      location: {
        id: data?.location?.id,
        name: data?.location?.name,
      },
      rtd_location: {
        id: data?.rtd_location?.id,
        name: data?.rtd_location?.name,
      },
      image: data?.image,
      warranty_months: data?.warranty_months,
      purchase_cost: data?.purchase_cost,
      purchase_date: {
        date: data?.purchase_date !== null ? data?.purchase_date.date : "",
        formatted:
          data?.purchase_date !== null ? data?.purchase_date.formatted : "",
      },
      assigned_to: data?.assigned_to,
      last_audit_date: data?.last_audit_date,

      requestable: data?.requestable,
      physical: data?.physical,

      note: "",
      expected_checkin: {
        date: "",
        formatted: "",
      },
      checkout_at: {
        date: "",
        formatted: "",
      },
      assigned_location: {
        id: 0,
        name: "",
      },
      assigned_user: 0,
      assigned_asset: "",
      checkout_to_type: {
        assigned_user: 0,
        assigned_asset: "",
        assigned_location: {
          id: 0,
          name: "",
        },
      },
      user_can_checkout: false,
      assigned_status: 0,
    };

    setDetail(dataConvert);
    setIsEditModalVisible(true);
  };

  const clone = (data: IHardwareResponse) => {
    const dataConvert: IHardwareResponse = {
      id: data.id,
      name: data.name,
      asset_tag: data.asset_tag,
      serial: data.serial !== "undefined" ? data.serial : "",
      model: {
        id: data?.model?.id,
        name: data?.model?.name,
      },
      model_number: data?.order_number,
      status_label: {
        id: data?.status_label.id,
        name: data?.status_label.name,
        status_type: data?.status_label.status_type,
        status_meta: data?.status_label.status_meta,
      },
      category: {
        id: data?.category?.id,
        name: data?.category?.name,
      },
      supplier: {
        id: data?.supplier?.id,
        name: data?.supplier?.name,
      },
      notes: data.notes,
      order_number: data.order_number !== "null" ? data.order_number : "",
      location: {
        id: data?.location?.id,
        name: data?.location?.name,
      },
      rtd_location: {
        id: data?.rtd_location?.id,
        name: data?.rtd_location?.name,
      },
      image: data?.image,
      warranty_months: data?.warranty_months,
      purchase_cost: data?.purchase_cost,
      purchase_date: {
        date: data?.purchase_date !== null ? data?.purchase_date.date : "",
        formatted:
          data?.purchase_date !== null ? data?.purchase_date.formatted : "",
      },
      assigned_to: data?.assigned_to,
      last_audit_date: data?.last_audit_date,

      requestable: data?.requestable,
      physical: data?.physical,
      user_can_checkout: data?.user_can_checkout,

      note: "",
      expected_checkin: {
        date: "",
        formatted: "",
      },
      checkout_at: {
        date: "",
        formatted: "",
      },
      assigned_location: {
        id: 0,
        name: "",
      },
      assigned_user: 0,
      assigned_asset: "",
      checkout_to_type: {
        assigned_user: 0,
        assigned_asset: "",
        assigned_location: {
          id: 0,
          name: "",
        },
      },
      assigned_status: 0,
    };

    setDetailClone(dataConvert);
    setIsCloneModalVisible(true);
  };

  const checkout = (data: IHardwareResponse) => {
    const dataConvert: IHardwareResponse = {
      id: data.id,
      name: data.name,
      model: {
        id: data?.model?.id,
        name: data?.model?.name,
      },
      status_label: {
        id: data?.status_label.id,
        name: data?.status_label.name,
        status_type: data?.status_label.status_type,
        status_meta: data?.status_label.status_meta,
      },
      category: {
        id: data?.category?.id,
        name: data?.category?.name,
      },
      note: data.note,
      assigned_location: {
        id: data?.assigned_location?.id,
        name: data?.assigned_location?.name,
      },
      expected_checkin: {
        date: "",
        formatted: "",
      },
      checkout_at: {
        date: new Date().toISOString().substring(0, 10),
        formatted: new Date().toDateString(),
      },
      assigned_user: data?.assigned_user,
      model_number: data?.model_number,
      assigned_asset: data?.assigned_asset,
      checkout_to_type: data?.checkout_to_type,
      user_can_checkout: data?.user_can_checkout,

      asset_tag: "",
      serial: "",
      supplier: {
        id: 0,
        name: "",
      },
      notes: "",
      order_number: "",
      location: {
        id: 0,
        name: "",
      },
      rtd_location: {
        id: 0,
        name: "",
      },
      image: "",
      warranty_months: "",
      purchase_cost: 0,
      purchase_date: {
        date: "",
        formatted: "",
      },
      assigned_to: 0,
      last_audit_date: "",
      requestable: 0,
      physical: 0,
      assigned_status: data.assigned_status,
    };
    setDetailCheckout(dataConvert);
    setIsCheckoutModalVisible(true);
  };

  const checkin = (data: IHardwareResponse) => {
    const dataConvert: IHardwareResponse = {
      id: data.id,
      name: data.name,
      model: {
        id: data?.model?.id,
        name: data?.model?.name,
      },
      status_label: {
        id: data?.status_label.id,
        name: data?.status_label.name,
        status_type: data?.status_label.status_type,
        status_meta: data?.status_label.status_meta,
      },
      expected_checkin: {
        date: "",
        formatted: "",
      },
      rtd_location: {
        id: data?.id,
        name: data?.name,
      },
      category: {
        id: data?.category?.id,
        name: data?.category?.name,
      },
      note: data.note,

      asset_tag: "",
      serial: "",
      supplier: {
        id: 0,
        name: "",
      },
      notes: "",
      order_number: "",
      location: {
        id: data?.id,
        name: data?.name,
      },

      image: "",
      warranty_months: "",
      purchase_cost: 0,
      purchase_date: {
        date: "",
        formatted: "",
      },
      assigned_to: 0,
      last_audit_date: "",
      requestable: 0,
      physical: 0,
      assigned_status: data.assigned_status,
      model_number: "",
      checkout_at: {
        date: "",
        formatted: "",
      },
      assigned_location: {
        id: 0,
        name: "",
      },
      assigned_user: 0,
      assigned_asset: "",
      checkout_to_type: {
        assigned_user: 0,
        assigned_asset: "",
        assigned_location: {
          id: 0,
          name: "",
        },
      },
      user_can_checkout: false,
    };

    // console.log("check dataConvert: ", dataConvert);

    setDetailCheckin(dataConvert);
    setIsCheckinModalVisible(true);
  };

  const collumns = useMemo(
    () => [
      {
        key: "id",
        title: "ID",
        render: (value: IHardware) => <TextField value={value} />,
        defaultSortOrder: getDefaultSortOrder("id", sorter),
      },
      {
        key: "name",
        title: "Asset Name",
        render: (value: IHardware) => <TextField value={value} />,
        defaultSortOrder: getDefaultSortOrder("name", sorter),
      },
      {
        key: "image",
        title: "Image",
        render: (value: string) => {
          return value ? (
            <Image width={50} alt="" height={"auto"} src={value} />
          ) : (
            ""
          );
        },
      },
      {
        key: "model",
        title: "Model",
        render: (value: IHardwareResponse) => <TagField value={value.name} />,
        defaultSortOrder: getDefaultSortOrder("model.name", sorter),
      },
      {
        key: "category",
        title: "Category",
        render: (value: IHardwareResponse) => <TagField value={value.name} />,
        defaultSortOrder: getDefaultSortOrder("category.name", sorter),
      },

      // {
      //   key: "status_label",
      //   title: "Trạng thái",
      //   render: (value: IHardwareResponse) => (
      //     <TagField
      //       value={value.name}
      //       style={{
      //         background:
      //           value.name === "Assign"
      //             ? "#0073b7"
      //             : value.name === "Ready to deploy"
      //             ? "#00a65a"
      //             : value.name === "Broken"
      //             ? "red"
      //             : value.name === "Pending"
      //             ? "#f39c12"
      //             : "",
      //         color: "white",
      //       }}
      //     />
      //   ),
      //   defaultSortOrder: getDefaultSortOrder("assigned_status.name", sorter),
      // },
      {
        key: "assigned_to",
        title: "Checkout đến",
        render: (value: IHardwareResponse) => (
          <TextField value={value ? value.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("assigned_to.name", sorter),
      },
      {
        key: "assigned_status",
        title: "Tình trạng",
        render: (value: any) => (
          <TagField
            value={
              value === 1
                ? "Đã xác nhận"
                : value === 2
                ? "Đã từ chối"
                : value === 0
                ? "Đang chờ xác nhận"
                : "Chưa assign"
            }
            style={{
              background:
                value === 1
                  ? "#0073b7"
                  : value === 2
                  ? "red"
                  : value === 0
                  ? "#f39c12"
                  : "black",
              color: "white",
            }}
          />
        ),
        defaultSortOrder: getDefaultSortOrder("assigned_status", sorter),
      },
      {
        key: "created_at",
        title: "Created At",
        render: (value: IHardware) => (
          <DateField format="LLL" value={value.datetime} />
        ),
        defaultSortOrder: getDefaultSortOrder("created_at.datetime", sorter),
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

  const show = (data: IHardwareResponse) => {
    setIsShowModalVisible(true);
    setDetail(data);
  };

  useEffect(() => {
    refreshData();
  }, [isEditModalVisible]);

  useEffect(() => {
    refreshData();
  }, [isCloneModalVisible]);

  useEffect(() => {
    refreshData();
  }, [isCheckoutModalVisible]);

  useEffect(() => {
    refreshData();
  }, [isCheckinModalVisible]);

  return (
    <List
      pageHeaderProps={{
        extra: (
          <Tooltip title="Tạo hardware" color={"#108ee9"}>
            <CreateButton onClick={handleCreate} />
          </Tooltip>
        ),
      }}
    >
      <TableAction searchFormProps={searchFormProps} />
      <MModal
        title={t("hardware.label.title.create")}
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
      >
        <HardwareCreate
          setIsModalVisible={setIsModalVisible}
          isModalVisible={isModalVisible}
        />
      </MModal>
      <MModal
        title={t("hardware.label.title.edit")}
        setIsModalVisible={setIsEditModalVisible}
        isModalVisible={isEditModalVisible}
      >
        <HardwareEdit
          isModalVisible={isEditModalVisible}
          setIsModalVisible={setIsEditModalVisible}
          data={detail}
        />
      </MModal>
      <MModal
        title={t("hardware.label.title.clone")}
        setIsModalVisible={setIsCloneModalVisible}
        isModalVisible={isCloneModalVisible}
      >
        <HardwareClone
          isModalVisible={isCloneModalVisible}
          setIsModalVisible={setIsCloneModalVisible}
          data={detailClone}
        />
      </MModal>
      <MModal
        title={t("hardware.label.title.checkout")}
        setIsModalVisible={setIsCheckoutModalVisible}
        isModalVisible={isCheckoutModalVisible}
      >
        <HardwareCheckout
          isModalVisible={isCheckoutModalVisible}
          setIsModalVisible={setIsCheckoutModalVisible}
          data={detailCheckout}
        />
      </MModal>
      <MModal
        title={t("hardware.label.title.detail")}
        setIsModalVisible={setIsShowModalVisible}
        isModalVisible={isShowModalVisible}
      >
        <HardwareShow setIsModalVisible={setIsModalVisible} detail={detail} />
      </MModal>{" "}
      <MModal
        title={t("hardware.label.title.checkin")}
        setIsModalVisible={setIsCheckinModalVisible}
        isModalVisible={isCheckinModalVisible}
      >
        <HardwareCheckin
          isModalVisible={isCheckinModalVisible}
          setIsModalVisible={setIsCheckinModalVisible}
          data={detailCheckin}
        />
      </MModal>
      <Table {...tableProps} rowKey="id">
        {collumns.map((col) => (
          <Table.Column dataIndex={col.key} {...col} sorter />
        ))}
        <Table.Column<IHardwareResponse>
          title={t("table.actions")}
          dataIndex="actions"
          render={(_, record) => (
            <Space>
              <Tooltip title="Xem chi tiết" color={"#108ee9"}>
                <ShowButton
                  hideText
                  size="small"
                  recordItemId={record.id}
                  onClick={() => show(record)}
                />
              </Tooltip>

              <Tooltip title="Clone tài sản" color={"#108ee9"}>
                <CloneButton
                  hideText
                  size="small"
                  recordItemId={record.id}
                  onClick={() => clone(record)}
                />
              </Tooltip>
              <Tooltip title="Chỉnh sửa tài sản" color={"#108ee9"}>
                <EditButton
                  hideText
                  size="small"
                  recordItemId={record.id}
                  onClick={() => edit(record)}
                />
              </Tooltip>
              <Tooltip title="Xóa tài sản" color={"red"}>
                <DeleteButton
                  resourceName="api/v1/hardware"
                  hideText
                  size="small"
                  recordItemId={record.id}
                />
              </Tooltip>
              {(record.user_can_checkout === true && (
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
                  {t("hardware.label.button.checkout")}
                </Button>
              )) ||
                (record.user_can_checkout === true && (
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
                    {t("hardware.label.button.checkout")}
                  </Button>
                )) ||
                (record.user_can_checkout === true &&
                  record.status_label.name === "Pending" && (
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
                      disabled
                    >
                      {t("hardware.label.button.checkout")}
                    </Button>
                  )) ||
                (record.user_can_checkout === true &&
                  record.status_label.name === "Broken" && (
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
                      disabled
                    >
                      {t("hardware.label.button.checkout")}
                    </Button>
                  ))}

              {record.user_can_checkout === false && (
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
                  {t("hardware.label.button.checkin")}
                </Button>
              )}
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
