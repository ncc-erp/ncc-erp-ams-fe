import {
  Button,
  Checkbox,
  DateField,
  DeleteButton,
  EditButton,
  getDefaultSortOrder,
  List,
  ShowButton,
  Space,
  Spin,
  Table,
  TagField,
  TextField,
  Tooltip,
  useTable,
} from "@pankod/refine-antd";
import {
  CrudFilters,
  HttpError,
  useNavigation,
  useTranslate,
} from "@pankod/refine-core";
import { CONSUMABLE_API, CONSUMABLE_TOTAL_DETAIL_API } from "api/baseApi";
import { MModal } from "components/Modal/MModal";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "styles/antd.less";
import { TableAction } from "components/elements/tables/TableAction";
import { MenuOutlined, SyncOutlined } from "@ant-design/icons";

import {
  IConsumablesFilterVariables,
  IConsumablesRequest,
  IConsumablesResponse,
  IConsumablesResponseCheckout,
} from "interfaces/consumables";
import moment from "moment";
import { ConsumablesCheckout, ConsumablesEdit } from "pages/consumables";
import { ConsumablesShow } from "pages/consumables/show";
import { TotalDetail } from "components/elements/TotalDetail";
import { LocalStorageKey } from "enums/LocalStorageKey";

const defaultCheckedList = [
  "id",
  "name",
  "category",
  "purchase_date",
  "supplier",
  "location",
  "qty",
  "notes",
];

type detailConsumableProps = {
  id_name: string;
};

export const DetailsConsumable = (props: detailConsumableProps) => {
  const translate = useTranslate();
  const { list } = useNavigation();
  const { id_name } = props;
  const [isLoadingArr] = useState<boolean[]>([]);

  const [isTotalDetailReload, setIsTotalDetailReload] = useState(false);

  const [listening, setListening] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const onClickDropDown = () => setIsActive(!isActive);
  const menuRef = useRef(null);

  const [isShowModalVisible, setIsShowModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [detail, setDetail] = useState<IConsumablesResponse>();

  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);
  const [detailCheckout, setDetailCheckout] =
    useState<IConsumablesResponseCheckout>();

  const [collumnSelected, setColumnSelected] = useState<string[]>(
    localStorage.getItem(LocalStorageKey.ITEM_COMSUMABLE_SELECTED) !== null
      ? JSON.parse(
          localStorage.getItem(
            LocalStorageKey.ITEM_COMSUMABLE_SELECTED
          ) as string
        )
      : defaultCheckedList
  );

  const [searchParams] = useSearchParams();
  const category_id = searchParams.get("category_id");
  const searchParam = searchParams.get("search");
  const type_id = searchParams.get("id");

  const { tableProps, tableQueryResult, searchFormProps, sorter, filters } =
    useTable<IConsumablesResponse, HttpError, IConsumablesFilterVariables>({
      initialSorter: [
        {
          field: "id",
          order: "desc",
        },
      ],
      permanentFilter: [
        {
          field: id_name,
          operator: "eq",
          value: type_id,
        },
      ],
      resource: CONSUMABLE_API,
      onSearch: (params) => {
        const filters: CrudFilters = [];
        const { search, category } = params;
        filters.push(
          {
            field: "search",
            operator: "eq",
            value: search ? search : searchParam,
          },
          {
            field: "category_id",
            operator: "eq",
            value: category ? category : category_id,
          },
          {
            field: id_name,
            operator: "eq",
            value: type_id,
          }
        );

        return filters;
      },
    });

  const collumns = useMemo(
    () => [
      {
        key: "id",
        title: "ID",
        render: (value: number) => <TextField value={value ? value : 0} />,
        defaultSortOrder: getDefaultSortOrder("id", sorter),
      },
      {
        key: "name",
        title: translate("consumables.label.field.name"),
        render: (value: string, record: any) => (
          <TextField
            value={value ? value : ""}
            onClick={() => {
              if (record.id) {
                list(`consumable_details?id=${record.id}&name=${record.name}
                    &category_id=${record.category.id}`);
              }
            }}
            style={{ cursor: "pointer", color: "rgb(36 118 165)" }}
          />
        ),
        defaultSortOrder: getDefaultSortOrder("name", sorter),
      },
      {
        key: "category",
        title: translate("consumables.label.field.category"),
        render: (value: IConsumablesRequest) => (
          <TagField value={value ? value.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("category.name", sorter),
      },
      {
        key: "manufacturer",
        title: translate("consumables.label.field.manufacturer"),
        render: (value: IConsumablesRequest) => (
          <TagField value={value ? value.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("manufacturer.name", sorter),
      },
      {
        key: "warranty_months",
        title: translate("consumables.label.field.insurance"),
        render: (value: IConsumablesRequest) => (
          <TagField value={value ? value : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("warranty_months", sorter),
      },
      {
        key: "supplier",
        title: translate("consumables.label.field.supplier"),
        render: (value: IConsumablesRequest) => (
          <div
            dangerouslySetInnerHTML={{ __html: `${value ? value?.name : ""}` }}
          />
        ),
        defaultSortOrder: getDefaultSortOrder("supplier.name", sorter),
      },
      {
        key: "location",
        title: translate("consumables.label.field.location"),
        render: (value: IConsumablesRequest) => (
          <TagField value={value ? value.name : ""} />
        ),
        defaultSortOrder: getDefaultSortOrder("location.name", sorter),
      },
      {
        key: "purchase_date",
        title: translate("consumables.label.field.purchase_date"),
        render: (value: IConsumablesRequest) =>
          value ? (
            <DateField format="LL" value={value ? value.date : ""} />
          ) : (
            ""
          ),
        defaultSortOrder: getDefaultSortOrder("purchase_date.date", sorter),
      },
      {
        key: "qty",
        title: translate("consumables.label.field.total_consumables"),
        render: (value: string) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("qty", sorter),
      },
      {
        key: "purchase_cost",
        title: translate("consumables.label.field.purchase_cost"),
        render: (value: number) => <TextField value={value ? value : 0} />,
        defaultSortOrder: getDefaultSortOrder("purchase_cost", sorter),
      },
      {
        key: "notes",
        title: translate("consumables.label.field.notes"),
        render: (value: string) => (
          <div dangerouslySetInnerHTML={{ __html: `${value ? value : ""}` }} />
        ),
        defaultSortOrder: getDefaultSortOrder("notes", sorter),
      },
    ],
    []
  );

  const edit = (data: IConsumablesResponse) => {
    const dataConvert: IConsumablesResponse = {
      id: data.id,
      name: data.name,
      category: {
        id: data?.category?.id,
        name: data?.category?.name,
      },
      manufacturer: {
        id: data?.manufacturer?.id,
        name: data?.manufacturer?.name,
      },
      supplier: {
        id: data?.supplier?.id,
        name: data?.supplier?.name,
      },
      notes: data.notes,
      location: {
        id: data?.location?.id,
        name: data?.location?.name,
      },
      purchase_date: {
        date: data?.purchase_date !== null ? data?.purchase_date.date : "",
        formatted:
          data?.purchase_date !== null ? data?.purchase_date.formatted : "",
      },
      total_consumables: data?.total_consumables,
      purchase_cost: data ? data?.purchase_cost : 0,
      image: data ? data?.image : "",
      order_number: data ? data?.order_number : 0,
      qty: data ? data.qty : 0,
      user_can_checkout: data?.user_can_checkout,
      assigned_to: data?.assigned_to,
      warranty_months: data?.warranty_months,
      created_at: {
        datetime: "",
        formatted: "",
      },
      updated_at: {
        datetime: "",
        formatted: "",
      },
      remaining: 0,
    };
    setDetail(dataConvert);
    setIsEditModalVisible(true);
  };

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
    setDetail(data);
  };

  useEffect(() => {
    refreshData();
  }, [isEditModalVisible]);

  useEffect(() => {
    refreshData();
  }, [isCheckoutModalVisible]);

  useEffect(() => {
    searchFormProps.form?.submit();
  }, [window.location.reload]);

  const onCheckItem = (value: { key: string }) => {
    if (collumnSelected.includes(value.key)) {
      setColumnSelected(
        collumnSelected.filter((item: any) => item !== value.key)
      );
    } else {
      setColumnSelected(collumnSelected.concat(value.key));
    }
  };

  useEffect(() => {
    localStorage.setItem(
      LocalStorageKey.ITEM_CONSUMABLES_SELECTED,
      JSON.stringify(collumnSelected)
    );
  }, [collumnSelected]);

  const listenForOutsideClicks = (
    listening: boolean,
    setListening: (arg0: boolean) => void,
    menuRef: { current: any },
    setIsActive: (arg0: boolean) => void
  ) => {
    if (listening) return;
    if (!menuRef.current) return;
    setListening(true);
    [`click`, `touchstart`].forEach(() => {
      document.addEventListener(`click`, (event) => {
        const current = menuRef.current;
        const node = event.target;
        if (current && current.contains(node)) return;
        setIsActive(false);
      });
    });
  };

  useEffect(() => {
    const aboutController = new AbortController();
    listenForOutsideClicks(listening, setListening, menuRef, setIsActive);
    return function cleanup() {
      aboutController.abort();
    };
  }, []);

  const [loading, setLoading] = useState(false);
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      refreshData();
      setLoading(false);
    }, 300);
  };

  const refreshData = () => {
    tableQueryResult.refetch();
    setIsTotalDetailReload(!isTotalDetailReload);
  };

  useEffect(() => {
    refreshData();
  }, [isCheckoutModalVisible]);

  const pageTotal = tableProps.pagination && tableProps.pagination.total;

  return (
    <List title={translate("consumables.label.title.consumables")}>
      <div className="all">
        <TableAction searchFormProps={searchFormProps} />
        <div className="other_function">
          <div className="menu-container" ref={menuRef}>
            <div>
              <button
                className="menu-trigger"
                style={{
                  borderTopLeftRadius: "3px",
                  borderBottomLeftRadius: "3px",
                }}
              >
                <Tooltip
                  title={translate("consumables.label.tooltip.refresh")}
                  color={"#108ee9"}
                >
                  <SyncOutlined
                    onClick={handleRefresh}
                    style={{ color: "black" }}
                  />
                </Tooltip>
              </button>
            </div>
            <div>
              <button onClick={onClickDropDown} className="menu-trigger">
                <Tooltip
                  title={translate("consumables.label.tooltip.columns")}
                  color={"#108ee9"}
                >
                  <MenuOutlined style={{ color: "black" }} />
                </Tooltip>
              </button>
            </div>
            <nav className={`menu ${isActive ? "active" : "inactive"}`}>
              <div className="menu-dropdown">
                {collumns.map((item) => (
                  <Checkbox
                    className="checkbox"
                    key={item.key}
                    onChange={() => onCheckItem(item)}
                    checked={collumnSelected.includes(item.key)}
                  >
                    {item.title}
                  </Checkbox>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>
      <TotalDetail
        links={`${CONSUMABLE_TOTAL_DETAIL_API}?${id_name}=${type_id}`}
        filters={filters}
        isReload={isTotalDetailReload}
      ></TotalDetail>

      {loading ? (
        <>
          <div style={{ paddingTop: "15rem", textAlign: "center" }}>
            <Spin
              tip={`${translate("loading")}...`}
              style={{ fontSize: "18px", color: "black" }}
            />
          </div>
        </>
      ) : (
        <Table
          className={(pageTotal as number) <= 10 ? "list-table" : ""}
          {...tableProps}
          rowKey="id"
          scroll={{ x: 1200 }}
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
          {collumns
            .filter((collumn) => collumnSelected.includes(collumn.key))
            .map((col) => (
              <Table.Column dataIndex={col.key} {...col} key={col.key} sorter />
            ))}
          <Table.Column<IConsumablesResponse>
            title={translate("table.actions")}
            dataIndex="actions"
            render={(_, record) => (
              <Space>
                <Tooltip
                  title={translate("hardware.label.tooltip.viewDetail")}
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
                  title={translate("consumables.label.tooltip.edit")}
                  color={"#108ee9"}
                >
                  <EditButton
                    hideText
                    size="small"
                    recordItemId={record.id}
                    onClick={() => edit(record)}
                  />
                </Tooltip>
                <DeleteButton
                  resourceName={CONSUMABLE_API}
                  hideText
                  size="small"
                  recordItemId={record.id}
                  onSuccess={() => {
                    setIsTotalDetailReload(!isTotalDetailReload);
                  }}
                />

                {record.user_can_checkout === true ? (
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
                ) : (
                  <Button type="primary" shape="round" size="small" disabled>
                    {translate("consumables.label.button.checkout")}
                  </Button>
                )}
              </Space>
            )}
          />
        </Table>
      )}

      <MModal
        title={translate("consumables.label.title.detail")}
        setIsModalVisible={setIsShowModalVisible}
        isModalVisible={isShowModalVisible}
      >
        <ConsumablesShow
          setIsModalVisible={setIsShowModalVisible}
          detail={detail}
        />
      </MModal>

      <MModal
        title={translate("consumables.label.title.edit")}
        setIsModalVisible={setIsEditModalVisible}
        isModalVisible={isEditModalVisible}
      >
        <ConsumablesEdit
          isModalVisible={isEditModalVisible}
          setIsModalVisible={setIsEditModalVisible}
          data={detail}
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
    </List>
  );
};
