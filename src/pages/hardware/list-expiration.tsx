/* eslint-disable no-lone-blocks */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  useTranslate,
  IResourceComponentsProps,
  CrudFilters,
  HttpError,
  useNavigation,
  useCustom,
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
  Checkbox,
  Form,
  Select,
  useSelect,
  Typography,
} from "@pankod/refine-antd";
import { Image } from "antd";
import "styles/antd.less";

import { IHardware } from "interfaces";
import { TableAction } from "components/elements/tables/TableAction";
import { useEffect, useMemo, useRef, useState } from "react";
import { MModal } from "components/Modal/MModal";
import { HardwareCreate } from "./create";
import { HardwareEdit } from "./edit";
import { HardwareClone } from "./clone";
import { HardwareShow } from "./show";
import {
  MenuOutlined,
  FileSearchOutlined,
  SyncOutlined,
  CloseOutlined,
} from "@ant-design/icons";

import {
  IHardwareFilterVariables,
  IHardwareResponse,
  IHardwareResponseCheckin,
  IHardwareResponseCheckout,
} from "interfaces/hardware";
import { HardwareCheckout } from "./checkout";
import { HardwareCheckin } from "./checkin";
import {
  CATEGORIES_API,
  HARDWARE_API,
  LOCATION_API,
  STATUS_LABELS_API,
} from "api/baseApi";
import { HardwareSearch } from "./search";
import { Spin } from "antd";
import { ICompany } from "interfaces/company";
import moment from "moment";
import { DatePicker } from "antd";
import { useSearchParams } from "react-router-dom";
import { HardwareCheckoutMultipleAsset } from "./checkout-multiple-asset";
import { HardwareCheckinMultipleAsset } from "./checkin-multiple-asset";
import { ASSIGNED_STATUS, dateFormat } from "constants/assets";
import {
  filterAssignedStatus,
  getAssetAssignedStatusDecription,
  getAssetStatusDecription,
  getBGAssetAssignedStatusDecription,
  getBGAssetStatusDecription,
} from "untils/assets";
import { ICategory } from "interfaces/categories";
import { IStatusLabel } from "interfaces/statusLabel";
import React from "react";

import { IHardwareUpdateRequest } from "interfaces/hardware";

const defaultCheckedList = [
  "id",
  "name",
  "image",
  "model",
  "category",
  "status_label",
  "assigned_to",
  "assigned_status",
  "created_at",
];
interface ICheckboxChange {
  key: string;
}

export const HardwareListExpiration: React.FC<
  IResourceComponentsProps
> = () => {
  const t = useTranslate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [detail, setDetail] = useState<IHardwareResponse>();
  const [detailCheckout, setDetailCheckout] =
    useState<IHardwareResponseCheckout>();
  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);

  const [isLoadingArr] = useState<boolean[]>([]);
  const [isCloneModalVisible, setIsCloneModalVisible] = useState(false);
  const [isShowModalVisible, setIsShowModalVisible] = useState(false);

  const [isCheckinModalVisible, setIsCheckinModalVisible] = useState(false);
  const [detailCheckin, setDetailCheckin] =
    useState<IHardwareResponseCheckin>();
  const [detailClone, setDetailClone] = useState<IHardwareResponse>();

  const [collumnSelected, setColumnSelected] = useState<string[]>(
    localStorage.getItem("item_selected") !== null
      ? JSON.parse(localStorage.getItem("item_selected") as string)
      : defaultCheckedList
  );
  const [isActive, setIsActive] = useState(false);
  const onClickDropDown = () => setIsActive(!isActive);
  const menuRef = useRef(null);
  const [listening, setListening] = useState(false);

  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const [isCheckoutManyAssetModalVisible, setIsCheckoutManyAssetModalVisible] =
    useState(false);
  const [isCheckinManyAssetModalVisible, setIsCheckinManyAssetModalVisible] =
    useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const category_id = searchParams.get("category_id");
  const rtd_location_id = searchParams.get("rtd_location_id");
  const status_id = searchParams.get("status_id");
  const dateFromParam = searchParams.get("dateFrom");
  const dateToParam = searchParams.get("dateTo");
  const searchParam = searchParams.get("search");
  const model_id = searchParams.get("model_id");
  const manufacturer_id = searchParams.get("manufacturer_id");
  const supplier_id = searchParams.get("supplier_id");

  const { data, isLoading: isLoadingData } = useCustom({
    url: "api/v1/hardware/assetExpiration",
    method: "get",
    config: {
      query: {
        // purchase_date_from: purchase_date_from
        //   ? purchase_date_from
        //   : dataDashboard[0],
        // purchase_date_to: purchase_date_to
        //   ? purchase_date_to
        //   : dataDashboard[1],
        // location: searchParams.get("rtd_location_id"),
      },
    },
  });

  console.log(data && data?.data.rows, "data");

  const [dataCategory, setDataCategory] = useState<any>([]);
  useEffect(() => {
    setDataCategory(data?.data.rows);
  }, [data]);
  //   const columns = [
  //     {
  //       key: "id",
  //       title: "ID",
  //       dataIndex: "ID",
  //       render: (text: number) => <TextField value={text} />,
  //       //   defaultSortOrder: getDefaultSortOrder("id", sorter),
  //     },
  //     {
  //       key: "name",
  //       dataIndex: "name",
  //       title: t("hardware.label.field.assetName"),
  //       render: (text: string, record: any) => (
  //         <TextField
  //           value={text}
  //           //   onClick={() => show(record)}
  //           style={{ cursor: "pointer", color: "rgb(36 118 165)" }}
  //         />
  //       ),
  //       //   defaultSortOrder: getDefaultSortOrder("name", sorter),
  //     },
  //     {
  //       key: "image",
  //       dataIndex: "image",
  //       title: t("hardware.label.field.image"),
  //       render: (text: string) => {
  //         return text ? (
  //           <Image width={80} alt="" height={"auto"} src={text} />
  //         ) : (
  //           ""
  //         );
  //       },
  //     },
  //     {
  //       key: "asset_tag",
  //       dataIndex: "asset_tag",
  //       title: t("hardware.label.field.propertyCard"),
  //       render: (text: string) => <TextField value={text} />,
  //       //   defaultSortOrder: getDefaultSortOrder("asset_tag", sorter),
  //     },
  //     {
  //       key: "serial",
  //       dataIndex: "serial",
  //       title: t("hardware.label.field.serial"),
  //       render: (text: string) => <TextField value={text} />,
  //       //   defaultSortOrder: getDefaultSortOrder("serial", sorter),
  //     },
  //     {
  //       key: "model",
  //       dataIndex: "model",
  //       title: t("hardware.label.field.propertyType"),
  //       render: (text: IHardwareResponse) => <TagField value={text.name} />,
  //       //   defaultSortOrder: getDefaultSortOrder("model.name", sorter),
  //     },
  //     {
  //       key: "category",
  //       dataIndex: "category",
  //       title: t("hardware.label.field.category"),
  //       render: (text: IHardwareResponse) => <TextField value={text.name} />,
  //       //   defaultSortOrder: getDefaultSortOrder("category.name", sorter),
  //       //   filters: filterCategory,
  //       //   onFilter: (text: number, record: IHardwareResponse) => {
  //       //     return record.category.id === text;
  //       //   },
  //     },
  //     {
  //       key: "status_label",
  //       dataIndex: "status_label",
  //       title: t("hardware.label.field.status"),
  //       render: (text: IHardwareResponse) => (
  //         <TagField
  //           value={getAssetStatusDecription(text)}
  //           style={{
  //             background: getBGAssetStatusDecription(text),
  //             color: "white",
  //           }}
  //         />
  //       ),
  //       //   defaultSortOrder: getDefaultSortOrder("status_label.name", sorter),
  //       //   filters: filterStatus_Label,
  //       //   onFilter: (text: number, record: IHardwareResponse) => {
  //       //     return record.status_label.id === text;
  //       //   },
  //     },
  //     {
  //       key: "assigned_to",
  //       dataIndex: "assigned_to",
  //       title: t("hardware.label.field.checkoutTo"),
  //       render: (text: IHardwareResponse) => (
  //         <TextField strong value={text ? text.name : ""} />
  //       ),
  //       //   defaultSortOrder: getDefaultSortOrder("assigned_to.name", sorter),
  //     },
  //     {
  //       key: "location",
  //       dataIndex: "location",
  //       title: t("hardware.label.field.rtd_location"),
  //       render: (text: IHardwareResponse) => (
  //         <TextField value={text && text.name} />
  //       ),
  //       //   defaultSortOrder: getDefaultSortOrder("location.name", sorter),
  //     },
  //     {
  //       key: "rtd_location",
  //       dataIndex: "rtd_location",
  //       title: t("hardware.label.field.locationFix"),
  //       render: (text: IHardwareResponse) => (
  //         <TextField
  //           value={text && text.name}
  //           //   onClick={() => {
  //           //     list(`location_details?id=${text.id}&name=${text.name}`);
  //           //   }}
  //           style={{ cursor: "pointer", color: "rgb(36 118 165)" }}
  //         />
  //       ),
  //       //   defaultSortOrder: getDefaultSortOrder("rtd_location.name", sorter),
  //     },
  //     {
  //       key: "manufacturer",
  //       dataIndex: "manufacturer",
  //       title: t("hardware.label.field.manufacturer"),
  //       render: (text: IHardwareResponse) => (
  //         <TextField
  //           value={text && text.name}
  //           //   onClick={() => {
  //           //     list(`manufactures_details?id=${text.id}&name=${text.name}`);
  //           //   }}
  //           style={{ cursor: "pointer", color: "rgb(36 118 165)" }}
  //         />
  //       ),
  //       //   defaultSortOrder: getDefaultSortOrder("manufacturer.name", sorter),
  //     },
  //     {
  //       key: "supplier",
  //       dataIndex: "supplier",
  //       title: t("hardware.label.field.supplier"),
  //       render: (text: IHardwareResponse) => (
  //         <div
  //           dangerouslySetInnerHTML={{ __html: `${text ? text.name : ""}` }}
  //           //   onClick={() => {
  //           //     list(`supplier_details?id=${text.id}&name=${text.name}`);
  //           //   }}
  //           style={{ cursor: "pointer", color: "rgb(36 118 165)" }}
  //         />
  //       ),
  //       //   defaultSortOrder: getDefaultSortOrder("supplier.name", sorter),
  //     },
  //     {
  //       key: "purchase_date",
  //       dataIndex: "purchase_date",
  //       title: t("hardware.label.field.dateAdd"),
  //       render: (text: IHardware) =>
  //         text ? <DateField format="LL" value={text ? text.date : ""} /> : "",
  //       //   defaultSortOrder: getDefaultSortOrder("purchase_date.date", sorter),
  //     },
  //     {
  //       key: "purchase_cost",
  //       dataIndex: "purchase_cost",
  //       title: t("hardware.label.field.cost"),
  //       render: (text: number) => <TextField value={text ? text : 0} />,
  //       //   defaultSortOrder: getDefaultSortOrder("purchase_cost", sorter),
  //     },
  //     {
  //       key: "order_number",
  //       dataIndex: "order_number",
  //       title: t("hardware.label.field.orderNumber"),
  //       render: (text: string) => <TextField value={text ? text : ""} />,
  //       //   defaultSortOrder: getDefaultSortOrder("order_number", sorter),
  //     },
  //     {
  //       key: "warranty_months",
  //       dataIndex: "warranty_months",
  //       title: t("hardware.label.field.insurance"),
  //       render: (text: string) => <TextField value={text ? text : ""} />,
  //       //   defaultSortOrder: getDefaultSortOrder("warranty_months", sorter),
  //     },
  //     {
  //       key: "warranty_expires",
  //       dataIndex: "warranty_expires",
  //       title: t("hardware.label.field.warranty_expires"),
  //       render: (text: IHardware) =>
  //         text ? <DateField format="LL" value={text && text.date} /> : "",
  //     },
  //     {
  //       key: "notes",
  //       dataIndex: "notes",
  //       title: t("hardware.label.field.note"),
  //       render: (text: string) => (
  //         <div dangerouslySetInnerHTML={{ __html: `${text ? text : ""}` }} />
  //       ),
  //       //   defaultSortOrder: getDefaultSortOrder("notes", sorter),
  //     },
  //     {
  //       key: "checkout_counter",
  //       dataIndex: "checkout_counter",
  //       title: t("hardware.label.field.checkout_counter"),
  //       render: (text: number) => <TextField value={text ? text : 0} />,
  //       //   defaultSortOrder: getDefaultSortOrder("checkout_counter", sorter),
  //     },
  //     {
  //       key: "checkin_counter",
  //       dataIndex: "checkin_counter",
  //       title: t("hardware.label.field.checkin_counter"),
  //       render: (text: number) => <TextField value={text ? text : 0} />,
  //       //   defaultSortOrder: getDefaultSortOrder("checkin_counter", sorter),
  //     },
  //     {
  //       key: "requestable",
  //       dataIndex: "requestable",
  //       title: t("hardware.label.field.requestable"),
  //       render: (text: string) => <TextField value={text ? text : 0} />,
  //       //   defaultSortOrder: getDefaultSortOrder("requestable", sorter),
  //     },
  //     {
  //       key: "assigned_status",
  //       dataIndex: "assigned_status",
  //       title: t("hardware.label.field.condition"),
  //       render: (text: number) => (
  //         <TagField
  //           value={getAssetAssignedStatusDecription(text)}
  //           style={{
  //             background: getBGAssetAssignedStatusDecription(text),
  //             color: "white",
  //           }}
  //         />
  //       ),
  //       //   defaultSortOrder: getDefaultSortOrder("assigned_status", sorter),
  //       filters: filterAssignedStatus,
  //       onFilter: (text: number, record: any) => record.assigned_status === text,
  //     },
  //     {
  //       key: "last_checkout",
  //       dataIndex: "last_checkout",
  //       title: t("hardware.label.field.dateCheckout"),
  //       render: (text: any) =>
  //         text && <DateField format="LL" value={text ? text.datetime : ""} />,
  //       //   defaultSortOrder: getDefaultSortOrder("created_at.datetime", sorter),
  //     },
  //     // {
  //     //   key: "last_checkout",
  //     //   title: "Het bao hanh",
  //     //   render: (text: IHardware) => (text &&
  //     //     <>Thiết bị còn <DateField format="LLL" text={text ? text.datetime : ""} /> ngày bảo hành </>
  //     //   ),
  //     //   defaultSortOrder: getDefaultSortOrder("created_at.datetime", sorter),
  //     // },
  //   ];

  const columns = [
    {
      title: "ID",
      key: "id",
      dataIndex: "id",
      render: (value: number) => <TextField value={value} />,
      // defaultSortOrder: getDefaultSortOrder("id", sorter),
    },
    {
      dataIndex: "name",
      key: "name",
      title: t("hardware.label.field.assetName"),
      render: (value: string, record: any) => (
        <TextField
          value={value}
          //   onClick={() => show(record)}
          style={{ cursor: "pointer", color: "rgb(36 118 165)" }}
        />
      ),
      //   defaultSortOrder: getDefaultSortOrder("name", sorter),
    },
    {
      dataIndex: "image",
      key: "image",
      title: t("hardware.label.field.image"),
      render: (value: string) => {
        return value ? (
          <Image width={80} alt="" height={"auto"} src={value} />
        ) : (
          ""
        );
      },
    },
    {
      dataIndex: "asset_tag",
      key: "asset_tag",
      title: t("hardware.label.field.propertyCard"),
      render: (value: string) => <TextField value={value} />,
      //   defaultSortOrder: getDefaultSortOrder("asset_tag", sorter),
    },
    {
      title: `${t("dashboard.field.broken")}`,
      dataIndex: "asset_tag",
      key: "asset_tag",
      render: (text: number, record: any) => (
        <Typography.Text strong type="secondary" className="field-category">
          {text}
        </Typography.Text>
      ),
    },
    {
      dataIndex: "serial",
      key: "serial",
      title: t("hardware.label.field.serial"),
      render: (value: string) => <TextField value={value} />,
      // defaultSortOrder: getDefaultSortOrder("serial", sorter),
    },
    {
      dataIndex: "model",
      key: "model",
      title: t("hardware.label.field.propertyType"),
      render: (value: IHardwareResponse) => <TagField value={value.name} />,
      // defaultSortOrder: getDefaultSortOrder("model.name", sorter),
    },
    {
      dataIndex: "category",
      key: "category",
      title: t("hardware.label.field.category"),
      render: (value: IHardwareResponse) => <TextField value={value.name} />,
      // defaultSortOrder: getDefaultSortOrder("category.name", sorter),
      // filters: filterCategory,
      // onFilter: (value: number, record: IHardwareResponse) => {
      //   return record.category.id === value;
      // },
    },
    {
      dataIndex: "status_label",
      key: "status_label",
      title: t("hardware.label.field.status"),
      render: (value: IHardwareResponse) => (
        <TagField
          value={getAssetStatusDecription(value)}
          style={{
            background: getBGAssetStatusDecription(value),
            color: "white",
          }}
        />
      ),
      // defaultSortOrder: getDefaultSortOrder("status_label.name", sorter),
      // filters: filterStatus_Label,
      // onFilter: (value: number, record: IHardwareResponse) => {
      //   return record.status_label.id === value;
      // },
    },
    {
      dataIndex: "assigned_to",
      key: "assigned_to",
      title: t("hardware.label.field.checkoutTo"),
      render: (value: IHardwareResponse) => (
        <TextField strong value={value ? value.name : ""} />
      ),
      // defaultSortOrder: getDefaultSortOrder("assigned_to.name", sorter),
    },
    {
      dataIndex: "location",
      key: "location",
      title: t("hardware.label.field.rtd_location"),
      render: (value: IHardwareResponse) => (
        <TextField value={value && value.name} />
      ),
      // defaultSortOrder: getDefaultSortOrder("location.name", sorter),
    },
    {
      dataIndex: "rtd_location",
      key: "rtd_location",
      title: t("hardware.label.field.locationFix"),
      render: (value: IHardwareResponse) => (
        <TextField
          value={value && value.name}
          // onClick={() => {
          //   list(`location_details?id=${value.id}&name=${value.name}`);
          // }}
          style={{ cursor: "pointer", color: "rgb(36 118 165)" }}
        />
      ),
      // defaultSortOrder: getDefaultSortOrder("rtd_location.name", sorter),
    },
    {
      dataIndex: "manufacturer",
      key: "manufacturer",
      title: t("hardware.label.field.manufacturer"),
      render: (value: IHardwareResponse) => (
        <TextField
          value={value && value.name}
          // onClick={() => {
          //   list(`manufactures_details?id=${value.id}&name=${value.name}`);
          // }}
          style={{ cursor: "pointer", color: "rgb(36 118 165)" }}
        />
      ),
      // defaultSortOrder: getDefaultSortOrder("manufacturer.name", sorter),
    },
    {
      dataIndex: "supplier",
      key: "supplier",
      title: t("hardware.label.field.supplier"),
      render: (value: IHardwareResponse) => (
        <div
          dangerouslySetInnerHTML={{ __html: `${value ? value.name : ""}` }}
          // onClick={() => {
          //   list(`supplier_details?id=${value.id}&name=${value.name}`);
          // }}
          style={{ cursor: "pointer", color: "rgb(36 118 165)" }}
        />
      ),
      // defaultSortOrder: getDefaultSortOrder("supplier.name", sorter),
    },
    {
      dataIndex: "purchase_date",
      key: "purchase_date",
      title: t("hardware.label.field.dateAdd"),
      render: (value: IHardware) =>
        value ? <DateField format="LL" value={value ? value.date : ""} /> : "",
      // defaultSortOrder: getDefaultSortOrder("purchase_date.date", sorter),
    },
    {
      dataIndex: "purchase_cost",
      key: "purchase_cost",
      title: t("hardware.label.field.cost"),
      render: (value: number) => <TextField value={value ? value : 0} />,
      // defaultSortOrder: getDefaultSortOrder("purchase_cost", sorter),
    },
    {
      dataIndex: "order_number",
      key: "order_number",
      title: t("hardware.label.field.orderNumber"),
      render: (value: string) => <TextField value={value ? value : ""} />,
      // defaultSortOrder: getDefaultSortOrder("order_number", sorter),
    },
    {
      dataIndex: "warranty_months",
      key: "warranty_months",
      title: t("hardware.label.field.insurance"),
      render: (value: string) => <TextField value={value ? value : ""} />,
      // defaultSortOrder: getDefaultSortOrder("warranty_months", sorter),
    },
    {
      dataIndex: "warranty_expires",
      key: "warranty_expires",
      title: t("hardware.label.field.warranty_expires"),
      render: (value: IHardware) =>
        value ? <DateField format="LL" value={value && value.date} /> : "",
    },
    {
      dataIndex: "notes",
      key: "notes",
      title: t("hardware.label.field.note"),
      render: (value: string) => (
        <div dangerouslySetInnerHTML={{ __html: `${value ? value : ""}` }} />
      ),
      // defaultSortOrder: getDefaultSortOrder("notes", sorter),
    },
    {
      dataIndex: "assigned_status",
      key: "assigned_status",
      title: t("hardware.label.field.condition"),
      render: (value: number) => (
        <TagField
          value={getAssetAssignedStatusDecription(value)}
          style={{
            background: getBGAssetAssignedStatusDecription(value),
            color: "white",
          }}
        />
      ),
      // defaultSortOrder: getDefaultSortOrder("assigned_status", sorter),
      //   filters: filterAssignedStatus,
      //   onFilter: (value: number, record: IHardwareResponse) =>
      //     record.assigned_status === value,
    },
    {
      dataIndex: "last_checkout",
      key: "last_checkout",
      title: t("hardware.label.field.dateCheckout"),
      render: (value: IHardware) =>
        value && <DateField format="LL" value={value ? value.datetime : ""} />,
      // defaultSortOrder: getDefaultSortOrder("created_at.datetime", sorter),
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={dataCategory}
      scroll={{ x: "calc(400px + 50%)", y: 400 }}
    />
    // <List
    //     title={t("hardware.label.title.asset")}
    //     pageHeaderProps={{
    //         extra: (
    //             <CreateButton onClick={handleCreate}>
    //                 {t("hardware.label.tooltip.create")}
    //             </CreateButton>
    //         ),
    //     }}
    // >
    //     <div className="search">
    //         <Form
    //             {...searchFormProps}
    //             initialtexts={{
    //                 location: localStorage.getItem("rtd_location_id")
    //                     ? searchtextsLocation
    //                     : Number(rtd_location_id),
    //                 purchase_date:
    //                     localStorage.getItem("purchase_date") !== null
    //                         ? searchtextsByDateFrom !== "" && searchtextsByDateTo !== ""
    //                             ? [
    //                                 moment(searchtextsByDateFrom),
    //                                 moment(searchtextsByDateTo),
    //                             ]
    //                             : dateFromParam && dateToParam
    //                                 ? [
    //                                     moment(dateFromParam, dateFormat),
    //                                     moment(dateToParam, dateFormat),
    //                                 ]
    //                                 : ""
    //                         : "",
    //             }}
    //             layout="vertical"
    //             ontextsChange={() => searchFormProps.form?.submit()}
    //             className="search-month-location"
    //         >
    //             <Form.Item
    //                 label={t("hardware.label.title.time")}
    //                 name="purchase_date"
    //             >
    //                 <RangePicker
    //                     onChange={handleChangePickerByMonth}
    //                     format={dateFormat}
    //                     placeholder={[
    //                         `${t("hardware.label.field.start-date")}`,
    //                         `${t("hardware.label.field.end-date")}`,
    //                     ]}
    //                 />
    //             </Form.Item>
    //             <Form.Item
    //                 label={t("hardware.label.title.location")}
    //                 name="location"
    //                 className={"search-month-location-null"}
    //             >
    //                 <Select onChange={handleChangeLocation} placeholder={t("all")}>
    //                     <Option text={0}>{t("all")}</Option>
    //                     {locationSelectProps.options?.map((item: any) => (
    //                         <Option text={item.text} key={item.text}>
    //                             {item.label}
    //                         </Option>
    //                     ))}
    //                 </Select>
    //             </Form.Item>
    //         </Form>
    //         <div className="all">
    //             <TableAction searchFormProps={searchFormProps} />
    //             <div className="other_function">
    //                 <div className="menu-container" ref={menuRef}>
    //                     <div>
    //                         <button
    //                             className="menu-trigger"
    //                             style={{
    //                                 borderTopLeftRadius: "3px",
    //                                 borderBottomLeftRadius: "3px",
    //                             }}
    //                         >
    //                             <Tooltip
    //                                 title={t("hardware.label.tooltip.refresh")}
    //                                 color={"#108ee9"}
    //                             >
    //                                 <SyncOutlined
    //                                     onClick={handleRefresh}
    //                                     style={{ color: "black" }}
    //                                 />
    //                             </Tooltip>
    //                         </button>
    //                     </div>
    //                     <div>
    //                         <button onClick={onClickDropDown} className="menu-trigger">
    //                             <Tooltip
    //                                 title={t("hardware.label.tooltip.columns")}
    //                                 color={"#108ee9"}
    //                             >
    //                                 <MenuOutlined style={{ color: "black" }} />
    //                             </Tooltip>
    //                         </button>
    //                     </div>
    //                     <nav className={`menu ${isActive ? "active" : "inactive"}`}>
    //                         <div className="menu-dropdown">
    //                             {collumns.map((item) => (
    //                                 <Checkbox
    //                                     className="checkbox"
    //                                     key={item.key}
    //                                     onChange={() => onCheckItem(item)}
    //                                     checked={collumnSelected.includes(item.key)}
    //                                 >
    //                                     {item.title}
    //                                 </Checkbox>
    //                             ))}
    //                         </div>
    //                     </nav>
    //                 </div>
    //                 <div>
    //                     <button
    //                         className="menu-trigger"
    //                         style={{
    //                             borderTopRightRadius: "3px",
    //                             borderBottomRightRadius: "3px",
    //                         }}
    //                     >
    //                         <Tooltip
    //                             title={t("hardware.label.tooltip.search")}
    //                             color={"#108ee9"}
    //                         >
    //                             <FileSearchOutlined
    //                                 onClick={handleSearch}
    //                                 style={{ color: "black" }}
    //                             />
    //                         </Tooltip>
    //                     </button>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>

    //     <MModal
    //         title={t("hardware.label.title.search_advanced")}
    //         setIsModalVisible={setIsSearchModalVisible}
    //         isModalVisible={isSearchModalVisible}
    //     >
    //         <HardwareSearch
    //             isModalVisible={isSearchModalVisible}
    //             setIsModalVisible={setIsSearchModalVisible}
    //             searchFormProps={searchFormProps}
    //         />
    //     </MModal>
    //     <MModal
    //         title={t("hardware.label.title.create")}
    //         setIsModalVisible={setIsModalVisible}
    //         isModalVisible={isModalVisible}
    //     >
    //         <HardwareCreate
    //             setIsModalVisible={setIsModalVisible}
    //             isModalVisible={isModalVisible}
    //         />
    //     </MModal>
    //     <MModal
    //         title={t("hardware.label.title.edit")}
    //         setIsModalVisible={setIsEditModalVisible}
    //         isModalVisible={isEditModalVisible}
    //     >
    //         <HardwareEdit
    //             isModalVisible={isEditModalVisible}
    //             setIsModalVisible={setIsEditModalVisible}
    //             data={detail}
    //         />
    //     </MModal>
    //     <MModal
    //         title={t("hardware.label.title.clone")}
    //         setIsModalVisible={setIsCloneModalVisible}
    //         isModalVisible={isCloneModalVisible}
    //     >
    //         <HardwareClone
    //             isModalVisible={isCloneModalVisible}
    //             setIsModalVisible={setIsCloneModalVisible}
    //             data={detailClone}
    //         />
    //     </MModal>
    //     <MModal
    //         title={t("hardware.label.title.checkout")}
    //         setIsModalVisible={setIsCheckoutModalVisible}
    //         isModalVisible={isCheckoutModalVisible}
    //     >
    //         <HardwareCheckout
    //             isModalVisible={isCheckoutModalVisible}
    //             setIsModalVisible={setIsCheckoutModalVisible}
    //             data={detailCheckout}
    //         />
    //     </MModal>
    //     <MModal
    //         title={t("hardware.label.title.detail")}
    //         setIsModalVisible={setIsShowModalVisible}
    //         isModalVisible={isShowModalVisible}
    //     >
    //         <HardwareShow
    //             setIsModalVisible={setIsShowModalVisible}
    //             detail={detail}
    //         />
    //     </MModal>
    //     <MModal
    //         title={t("hardware.label.title.checkin")}
    //         setIsModalVisible={setIsCheckinModalVisible}
    //         isModalVisible={isCheckinModalVisible}
    //     >
    //         <HardwareCheckin
    //             isModalVisible={isCheckinModalVisible}
    //             setIsModalVisible={setIsCheckinModalVisible}
    //             data={detailCheckin}
    //         />
    //     </MModal>
    //     <MModal
    //         title={t("hardware.label.title.checkout")}
    //         setIsModalVisible={setIsCheckoutManyAssetModalVisible}
    //         isModalVisible={isCheckoutManyAssetModalVisible}
    //     >
    //         <HardwareCheckoutMultipleAsset
    //             isModalVisible={isCheckoutManyAssetModalVisible}
    //             setIsModalVisible={setIsCheckoutManyAssetModalVisible}
    //             data={selectdStoreCheckout}
    //             setSelectedRowKeys={setSelectedRowKeys}
    //         />
    //     </MModal>
    //     <MModal
    //         title={t("hardware.label.title.checkin")}
    //         setIsModalVisible={setIsCheckinManyAssetModalVisible}
    //         isModalVisible={isCheckinManyAssetModalVisible}
    //     >
    //         <HardwareCheckinMultipleAsset
    //             isModalVisible={isCheckinManyAssetModalVisible}
    //             setIsModalVisible={setIsCheckinManyAssetModalVisible}
    //             data={selectdStoreCheckin}
    //             setSelectedRowKeys={setSelectedRowKeys}
    //         />
    //     </MModal>

    //     <div className="checkout-checkin-multiple">
    //         <div className="sum-assets">
    //             <span className="name-sum-assets">
    //                 {t("hardware.label.title.sum-assets")}
    //             </span>{" "}
    //             : {tableProps.pagination ? tableProps.pagination?.total : 0}
    //         </div>
    //         <div className="checkout-multiple-asset">
    //             <Button
    //                 type="primary"
    //                 className="btn-select-checkout ant-btn-checkout"
    //                 onClick={handleCheckout}
    //                 disabled={!selectedCheckout}
    //             >
    //                 {t("hardware.label.title.checkout")}
    //             </Button>
    //             <div className={nameCheckout ? "list-checkouts" : ""}>
    //                 <span className="title-remove-name">{nameCheckout}</span>
    //                 {initselectedRowKeys
    //                     .filter((item: IHardwareResponse) => item.user_can_checkin)
    //                     .map((item: IHardwareResponse) => (
    //                         <span className="list-checkin" key={item.id}>
    //                             <span className="name-checkin">{item.asset_tag}</span>
    //                             <span
    //                                 className="delete-checkin-checkout"
    //                                 onClick={() => handleRemoveCheckInCheckOutItem(item.id)}
    //                             >
    //                                 <CloseOutlined />
    //                             </span>
    //                         </span>
    //                     ))}
    //             </div>
    //         </div>

    //         <div className="checkin-multiple-asset">
    //             <Button
    //                 type="primary"
    //                 className="btn-select-checkout"
    //                 disabled={!selectedCheckin}
    //                 onClick={handleCheckin}
    //             >
    //                 {t("hardware.label.title.checkin")}
    //             </Button>

    //             <div className={nameCheckin ? "list-checkins" : ""}>
    //                 <span className="title-remove-name">{nameCheckin}</span>
    //                 {initselectedRowKeys
    //                     .filter((item: IHardwareResponse) => item.user_can_checkout)
    //                     .map((item: IHardwareResponse) => (
    //                         <span className="list-checkin" key={item.id}>
    //                             <span className="name-checkin">{item.asset_tag}</span>
    //                             <span
    //                                 className="delete-checkin-checkout"
    //                                 onClick={() => handleRemoveCheckInCheckOutItem(item.id)}
    //                             >
    //                                 <CloseOutlined />
    //                             </span>
    //                         </span>
    //                     ))}
    //             </div>
    //         </div>
    //     </div>
    //     {loading ? (
    //         <>
    //             <div style={{ paddingTop: "15rem", textAlign: "center" }}>
    //                 <Spin
    //                     tip={`${t("loading")}...`}
    //                     style={{ fontSize: "18px", color: "black" }}
    //                 />
    //             </div>
    //         </>
    //     ) : (
    //         <Table
    //             {...tableProps}
    //             rowKey="id"
    //             scroll={{ x: 1850 }}
    //             pagination={{
    //                 position: ["topRight", "bottomRight"],
    //                 total: pageTotal ? pageTotal : 0,
    //             }}
    //             rowSelection={{
    //                 type: "checkbox",
    //                 ...rowSelection,
    //             }}
    //         >
    //             {collumns
    //                 .filter((collumn) => collumnSelected.includes(collumn.key))
    //                 .map((col) => (
    //                     <Table.Column dataIndex={col.key} {...(col as any)} sorter />
    //                 ))}
    //             <Table.Column<IHardwareResponse>
    //                 title={t("table.actions")}
    //                 dataIndex="actions"
    //                 render={(_, record) => (
    //                     <Space>
    //                         <Tooltip
    //                             title={t("hardware.label.tooltip.viewDetail")}
    //                             color={"#108ee9"}
    //                         >
    //                             <ShowButton
    //                                 hideText
    //                                 size="small"
    //                                 recordItemId={record.id}
    //                                 onClick={() => show(record)}
    //                             />
    //                         </Tooltip>

    //                         <Tooltip
    //                             title={t("hardware.label.tooltip.clone")}
    //                             color={"#108ee9"}
    //                         >
    //                             <CloneButton
    //                                 hideText
    //                                 size="small"
    //                                 recordItemId={record.id}
    //                                 onClick={() => clone(record)}
    //                             />
    //                         </Tooltip>

    //                         <Tooltip
    //                             title={t("hardware.label.tooltip.edit")}
    //                             color={"#108ee9"}
    //                         >
    //                             <EditButton
    //                                 hideText
    //                                 size="small"
    //                                 recordItemId={record.id}
    //                                 onClick={() => edit(record)}
    //                             />
    //                         </Tooltip>

    //                         {record.assigned_to !== null ? (
    //                             <DeleteButton hideText size="small" disabled />
    //                         ) : (
    //                             <Tooltip
    //                                 title={t("hardware.label.tooltip.delete")}
    //                                 color={"red"}
    //                             >
    //                                 <DeleteButton
    //                                     resourceName={HARDWARE_API}
    //                                     hideText
    //                                     size="small"
    //                                     recordItemId={record.id}
    //                                 />
    //                             </Tooltip>
    //                         )}

    //                         {record.user_can_checkout === true && (
    //                             <Button
    //                                 className="ant-btn-checkout"
    //                                 type="primary"
    //                                 shape="round"
    //                                 size="small"
    //                                 loading={
    //                                     isLoadingArr[record.id] === undefined
    //                                         ? false
    //                                         : isLoadingArr[record.id] === false
    //                                             ? false
    //                                             : true
    //                                 }
    //                                 onClick={() => checkout(record)}
    //                             >
    //                                 {t("hardware.label.button.checkout")}
    //                             </Button>
    //                         )}

    //                         {record.user_can_checkin === true && (
    //                             <Button
    //                                 type="primary"
    //                                 shape="round"
    //                                 size="small"
    //                                 loading={
    //                                     isLoadingArr[record.id] === undefined
    //                                         ? false
    //                                         : isLoadingArr[record.id] === false
    //                                             ? false
    //                                             : true
    //                                 }
    //                                 onClick={() => checkin(record)}
    //                             >
    //                                 {t("hardware.label.button.checkin")}
    //                             </Button>
    //                         )}
    //                     </Space>
    //                 )}
    //             />
    //         </Table>
    //     )}
    // </List>
  );
};
