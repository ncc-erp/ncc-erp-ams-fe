import {
  Button,
  Checkbox,
  Col,
  CreateButton,
  DeleteButton,
  EditButton,
  getDefaultSortOrder,
  List,
  Space,
  Spin,
  Table,
  TextField,
  Tooltip,
  useTable,
  useSelect,
} from "@pankod/refine-antd";
import {
  CrudFilters,
  IResourceComponentsProps,
  useTranslate,
} from "@pankod/refine-core";
import { IUser, IUserResponse } from "interfaces/user";
import { useEffect, useMemo, useRef, useState } from "react";
import { CloseOutlined, CheckOutlined, SyncOutlined } from "@ant-design/icons";
import { MModal } from "components/Modal/MModal";
import { UserCreate } from "./create";
import { Image } from "antd";
import { TableAction } from "components/elements/tables/TableAction";
import { MenuOutlined } from "@ant-design/icons";
import dataProvider from "providers/dataProvider";
import { UserEdit } from "./edit";
import { LOCATION_API, SYNC_USER_API, USER_API } from "api/baseApi";
import { useSearchParams } from "react-router-dom";
import { getPermissionsUser } from "utils/users";
import { ILocations } from "interfaces/location";
import { IUserType, IJobPosition } from "interfaces/index";
import { LocalStorageKey } from "enums/LocalStorageKey";

const defaultCheckedList = [
  "id",
  "name",
  "username",
  "category",
  "email",
  "phone",
  "mezon_id",
];

export const Manager_UserList: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [detail, setDetail] = useState<IUserResponse>();

  const [collumnSelected, setColumnSelected] = useState<string[]>(
    localStorage.getItem(LocalStorageKey.ITEM_USERS_SELECTED) !== null
      ? JSON.parse(
          localStorage.getItem(LocalStorageKey.ITEM_USERS_SELECTED) as any
        )
      : defaultCheckedList
  );
  const [isActive, setIsActive] = useState(false);
  const [hrmLoading, setHrmLoading] = useState(false);
  const [refLoading, setRefLoading] = useState(false);
  const onClickDropDown = () => setIsActive(!isActive);
  const menuRef = useRef(null);
  const [listening, setListening] = useState(false);

  const [searchParams] = useSearchParams();
  const location_id = searchParams.get("location_id");

  const { tableProps, sorter, tableQueryResult, searchFormProps } = useTable({
    initialSorter: [
      {
        field: "id",
        order: "desc",
      },
    ],
    resource: USER_API,
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
          field: "location_id",
          operator: "eq",
          value: location_id,
        }
      );
      return filters;
    },
  });
  const totalUser = tableQueryResult?.data?.total ?? 0;
  const syncHrm = () => {
    const { custom } = dataProvider;
    setHrmLoading(true);
    if (custom) {
      custom({
        url: SYNC_USER_API,
        method: "get",
      }).then(() => {
        setHrmLoading(false);
        tableQueryResult.refetch();
      });
    }
  };

  //prepare filter
  const { selectProps: locationSelectProps } = useSelect<ILocations>({
    resource: LOCATION_API,
    optionLabel: "name",
  });

  const filterLocation = locationSelectProps?.options?.map((item) => ({
    text: item.label,
    value: item.value,
  }));

  const { selectProps: userTypeSelectProps } = useSelect<IUserType>({
    resource: USER_API + "/list-user-type",
    optionLabel: "name",
    optionValue: "name",
  });

  const filterUserType = userTypeSelectProps?.options?.map((item) => ({
    text: item.label,
    value: item.value,
  }));

  const { selectProps: jobPositionSelectProps } = useSelect<IJobPosition>({
    resource: USER_API + "/list-user-position",
    optionLabel: "name",
    optionValue: "name",
  });

  const filterJobPosition = jobPositionSelectProps?.options?.map((item) => ({
    text: item.label,
    value: item.value,
  }));

  const collumns = useMemo(
    () => [
      {
        key: "id",
        title: "ID",
        render: (value: number) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("id", sorter),
      },
      {
        key: "avatar",
        title: translate("user.label.field.image"),
        render: (value: string) => {
          return value ? (
            <Image width={80} alt="" height={"auto"} src={value} />
          ) : (
            ""
          );
        },
      },
      {
        key: "name",
        title: translate("user.label.field.full_name"),
        render: (value: string) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("name", sorter),
      },
      {
        key: "last_name",
        title: translate("user.label.field.last_name"),
        render: (value: string) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("last_name", sorter),
      },
      {
        key: "first_name",
        title: translate("user.label.field.first_name"),
        render: (value: string) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("name", sorter),
      },
      {
        key: "permissions",
        title: translate("user.label.field.role"),
        render: (value: any) => <TextField value={getPermissionsUser(value)} />,
      },
      {
        key: "email",
        title: translate("user.label.field.email"),
        render: (value: string) => <TextField value={value ? value : ""} />,
      },
      {
        key: "phone",
        title: translate("user.label.field.phone"),
        render: (value: number) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("phone", sorter),
      },
      {
        key: "address",
        title: translate("user.label.field.address"),
        render: (value: string) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("address", sorter),
      },
      {
        key: "city",
        title: translate("user.label.field.city"),
        render: (value: string) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("city", sorter),
      },
      {
        key: "state",
        title: translate("user.label.field.state"),
        render: (value: string) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("state", sorter),
      },
      {
        key: "username",
        title: translate("user.label.field.username"),
        render: (value: string) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("username", sorter),
      },
      {
        key: "jobtitle",
        title: translate("user.label.field.title"),
        render: (value: string) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("jobtitle", sorter),
      },
      {
        key: "department",
        title: translate("user.label.field.department"),
        render: (value: IUser) => <TextField value={value ? value.name : ""} />,
        defaultSortOrder: getDefaultSortOrder("department.name", sorter),
      },
      {
        key: "location",
        title: translate("user.label.field.locations"),
        render: (value: IUser) => <TextField value={value ? value.name : ""} />,
        defaultSortOrder: getDefaultSortOrder("location.name", sorter),
        filters: filterLocation,
      },
      {
        key: "job_position_code",
        title: translate("user.label.field.job_position"),
        render: (value: string) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("job_position_code", sorter),
        filters: filterJobPosition,
      },
      {
        key: "user_type",
        title: translate("user.label.field.user_type"),
        render: (value: string) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("user_type", sorter),
        filters: filterUserType,
      },
      {
        key: "manager",
        title: translate("user.label.field.user_manager"),
        render: (value: IUser) => <TextField value={value ? value.name : ""} />,
        defaultSortOrder: getDefaultSortOrder("manager.name", sorter),
      },
      {
        key: "activated",
        title: translate("user.label.field.activated"),
        render: (value: boolean) => (
          <TextField
            value={
              value === false ? (
                <CloseOutlined color="#a94442" />
              ) : (
                <CheckOutlined />
              )
            }
            style={{
              color: value === false ? "#a94444" : "#44793f",
            }}
          />
        ),
        defaultSortOrder: getDefaultSortOrder("activated", sorter),
      },
      {
        key: "assets_count",
        title: translate("user.label.field.assets_count"),
        render: (value: number) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("assets_count", sorter),
      },
      {
        key: "accessories_count",
        title: translate("user.label.field.accessories_count"),
        render: (value: number) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("accessories_count", sorter),
      },
      {
        key: "licenses_count",
        title: translate("user.label.field.licenses_count"),
        render: (value: number) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("licenses_count", sorter),
      },
      {
        key: "notes",
        title: translate("user.label.field.note"),
        render: (value: string) => (
          <div dangerouslySetInnerHTML={{ __html: `${value ? value : ""}` }} />
        ),
        defaultSortOrder: getDefaultSortOrder("notes", sorter),
      },
      {
        key: "mezon_id",
        title: translate("user.label.field.mezon_id"),
        render: (value: string) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("mezon_id", sorter),
      },
    ],
    [filterLocation, filterJobPosition, filterUserType]
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

  const edit = (data: any) => {
    const dataConvert: any = {
      id: data.id,
      first_name: data.first_name,
      last_name: data.last_name,
      mezon_id: data.mezon_id,
      username: data.username,
      manager: {
        id: data?.manager?.id,
        name: data?.manager?.name,
      },
      email: data?.email,
      employee_num: data.employee_num,
      department: {
        id: data?.department?.id,
        name: data?.department?.name,
      },
      notes: data.notes,
      phone: data.phone,
      location: {
        id: data?.location?.id,
        name: data?.location?.name,
      },
      avatar: data?.avatar,
      address: data.address !== "null" ? data.address : "",
      state: data.state !== "nul" ? data.state : "",
      city: data.city !== "null" ? data.city : "",
      activated: data.activated,

      remote: data.remote,
      ldap_import: data.ldap_import,
      two_factor_activated: data.two_factor_activated,
      two_factor_enrolled: data.two_factor_enrolled,
      assets_count: data?.assets_count,
      name: data?.name,
      password: data?.password,
      password_confirmation: data?.password_confirmation,
      permissions: data?.permissions !== null ? data?.permissions : "",
      manager_location:
        data?.manager_location !== null ? data?.manager_location : "",
    };

    setDetail(dataConvert);
    setIsEditModalVisible(true);
  };

  useEffect(() => {
    refreshData();
  }, [isEditModalVisible]);

  const handleRefresh = () => {
    setRefLoading(true);
    setTimeout(() => {
      refreshData();
      setRefLoading(false);
    }, 300);
  };

  const isLoading = tableProps.loading || hrmLoading;

  const onCheckItem = (value: any) => {
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
      LocalStorageKey.ITEM_USERS_SELECTED,
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

  return (
    <List
      title={translate("user.label.title.name_user")}
      pageHeaderProps={{
        extra: (
          <CreateButton onClick={handleCreate}>
            {translate("user.label.button.create")}
          </CreateButton>
        ),
      }}
    >
      <div className="search" style={{ float: "right" }}>
        <div className="all">
          <div
            style={{ display: "flex", marginTop: "3rem", marginRight: "10px" }}
          >
            <Button onClick={syncHrm}>
              {translate("user.label.button.synchronized")}
            </Button>
          </div>
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
                    title={translate("user.label.tooltip.refresh")}
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
                    title={translate("user.label.tooltip.columns")}
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
      </div>
      <div className="user-list-sum">
        <span className="user-list-sum_title">
          {translate("user.label.title.total_user")}:{" "}
        </span>{" "}
        {totalUser}
      </div>
      {refLoading ? (
        <>
          <Col sm={24} md={24} className="dashboard-loading">
            <Spin tip={`${translate("loading")}...`} className="spin-center" />
          </Col>
        </>
      ) : (
        <Table {...tableProps} loading={isLoading} rowKey="id">
          {collumns
            .filter((collumn) => collumnSelected.includes(collumn.key))
            .map((col) => (
              <Table.Column
                key={col.key}
                dataIndex={col.key}
                {...(col as any)}
                sorter
              />
            ))}
          <Table.Column<IUserResponse>
            title={translate("table.actions")}
            dataIndex="actions"
            render={(_, record) => (
              <Space>
                <Tooltip
                  title={translate("user.label.tooltip.edit")}
                  color={"#108ee9"}
                >
                  <EditButton
                    hideText
                    size="small"
                    recordItemId={record.id}
                    onClick={() => edit(record)}
                  />
                </Tooltip>
                {record.assets_count > 0 ? (
                  <DeleteButton hideText size="small" disabled />
                ) : (
                  <Tooltip
                    title={translate("hardware.label.tooltip.delete")}
                    color={"red"}
                  >
                    <DeleteButton
                      resourceName={USER_API}
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
      )}
      <MModal
        title={translate("user.label.title.create")}
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
      >
        <UserCreate
          setIsModalVisible={setIsModalVisible}
          isModalVisible={isModalVisible}
        />
      </MModal>
      <MModal
        title={translate("user.label.title.edit")}
        setIsModalVisible={setIsEditModalVisible}
        isModalVisible={isEditModalVisible}
      >
        <UserEdit
          isModalVisible={isEditModalVisible}
          setIsModalVisible={setIsEditModalVisible}
          data={detail}
        />
      </MModal>
    </List>
  );
};
