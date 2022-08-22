/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  Checkbox,
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
import { USER_API } from "api/baseApi";

const defaultCheckedList = [
  "id",
  "name",
  "username",
  "category",
  "email",
  "phone",
  "remote",
];

export const Manager_UserList: React.FC<IResourceComponentsProps> = () => {
  const translate = useTranslate();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [detail, setDetail] = useState<IUserResponse>();

  const [collumnSelected, setColumnSelected] = useState<string[]>(
    localStorage.getItem("item_users_selected") !== null
      ? JSON.parse(localStorage.getItem("item_users_selected") as any)
      : defaultCheckedList
  );
  const [isActive, setIsActive] = useState(false);
  const [hrmLoading, setHrmLoading] = useState(false);
  const onClickDropDown = () => setIsActive(!isActive);
  const menuRef = useRef(null);
  const [listening, setListening] = useState(false);

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
      filters.push({
        field: "search",
        operator: "eq",
        value: search,
      });
      return filters;
    },
  });

  const syncHrm = () => {
    const { custom } = dataProvider;
    setHrmLoading(true);
    custom &&
      custom({
        url: `api/v1/users/sync-list-user`,
        method: "get",
      }).then((x) => {
        setHrmLoading(false);
        tableQueryResult.refetch();
      });
  };

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
        key: "remote",
        title: translate("user.label.field.remote"),
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
        defaultSortOrder: getDefaultSortOrder("assigned_status", sorter),
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
        render: (value: string) => <TextField value={value ? value : ""} />,
        defaultSortOrder: getDefaultSortOrder("notes", sorter),
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

  const edit = (data: any) => {
    const dataConvert: any = {
      id: data.id,
      first_name: data.first_name,
      last_name: data.last_name,
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
      permissions: {
        admin: data?.permissions !== null ? data?.permissions.admin : "",
        superuser: data?.permissions !== null ? data?.permissions.superuser : "",
        import: data?.permissions !== null ? data?.permissions.import : "",

        "reports.view": data?.permissions !== null ? data?.permissions["reports.view"] : "",

        "assets.view": data?.permissions !== null ? data?.permissions["assets.view"] : "",
        "assets.create": data?.permissions !== null ? data?.permissions["assets.create"] : "",
        "assets.edit": data?.permissions !== null ? data?.permissions["assets.edit"] : "",
        "assets.delete": data?.permissions !== null ? data?.permissions["assets.delete"] : "",
        "assets.checkout": data?.permissions !== null ? data?.permissions["assets.checkout"] : "",
        "assets.checkin": data?.permissions !== null ? data?.permissions["assets.checkin"] : "",
        "assets.audit": data?.permissions !== null ? data?.permissions["assets.audit"] : "",
        "assets.view.requestable": data?.permissions !== null ? data?.permissions["assets.view.requestable"] : "",

        "accessories.view": data?.permissions !== null ? data?.permissions["accessories.view"] : "",
        "accessories.create": data?.permissions !== null ? data?.permissions["accessories.create"] : "",
        "accessories.edit": data?.permissions !== null ? data?.permissions["accessories.edit"] : "",
        "accessories.delete": data?.permissions !== null ? data?.permissions["accessories.delete"] : "",
        "accessories.checkout": data?.permissions !== null ? data?.permissions["accessories.checkout"] : "",
        "accessories.checkin": data?.permissions !== null ? data?.permissions["accessories.checkin"] : "",

        "consumables.view": data?.permissions !== null ? data?.permissions["consumables.view"] : "",
        "consumables.create": data?.permissions !== null ? data?.permissions["consumables.create"] : "",
        "consumables.edit": data?.permissions !== null ? data?.permissions["consumables.edit"] : "",
        "consumables.delete": data?.permissions !== null ? data?.permissions["consumables.delete"] : "",
        "consumables.checkout": data?.permissions !== null ? data?.permissions["consumables.checkout"] : "",

        "licenses.view": data?.permissions !== null ? data?.permissions["licenses.view"] : "",
        "licenses.create": data?.permissions !== null ? data?.permissions["licenses.create"] : "",
        "licenses.edit": data?.permissions !== null ? data?.permissions["licenses.edit"] : "",
        "licenses.delete": data?.permissions !== null ? data?.permissions["licenses.delete"] : "",
        "licenses.checkout": data?.permissions !== null ? data?.permissions["licenses.checkout"] : "",
        "licenses.keys": data?.permissions !== null ? data?.permissions["licenses.keys"] : "",
        "licenses.files": data?.permissions !== null ? data?.permissions["licenses.files"] : "",

        "users.view": data?.permissions !== null ? data?.permissions["users.view"] : "",
        "users.create": data?.permissions !== null ? data?.permissions["users.create"] : "",
        "users.edit": data?.permissions !== null ? data?.permissions["users.edit"] : "",
        "users.delete": data?.permissions !== null ? data?.permissions["users.delete"] : "",

        "models.view": data?.permissions !== null ? data?.permissions["models.view"] : "",
        "models.create": data?.permissions !== null ? data?.permissions["models.create"] : "",
        "models.edit": data?.permissions !== null ? data?.permissions["models.edit"] : "",
        "models.delete": data?.permissions !== null ? data?.permissions["models.delete"] : "",

        "categories.view": data?.permissions !== null ? data?.permissions["categories.view"] : "",
        "categories.create": data?.permissions !== null ? data?.permissions["categories.create"] : "",
        "categories.edit": data?.permissions !== null ? data?.permissions["categories.edit"] : "",
        "categories.delete": data?.permissions !== null ? data?.permissions["categories.delete"] : "",

        "departments.view": data?.permissions !== null ? data?.permissions["departments.view"] : "",
        "departments.create": data?.permissions !== null ? data?.permissions["departments.create"] : "",
        "departments.edit": data?.permissions !== null ? data?.permissions["departments.edit"] : "",
        "departments.delete": data?.permissions !== null ? data?.permissions["departments.delete"] : "",

        "statuslabels.view": data?.permissions !== null ? data?.permissions["statuslabels.view"] : "",
        "statuslabels.create": data?.permissions !== null ? data?.permissions["statuslabels.create"] : "",
        "statuslabels.edit": data?.permissions !== null ? data?.permissions["statuslabels.edit"] : "",
        "statuslabels.delete": data?.permissions !== null ? data?.permissions["statuslabels.delete"] : "",

        "customfields.view": data?.permissions !== null ? data?.permissions["customfields.view"] : "",
        "customfields.create": data?.permissions !== null ? data?.permissions["customfields.create"] : "",
        "customfields.edit": data?.permissions !== null ? data?.permissions["customfields.edit"] : "",
        "customfields.delete": data?.permissions !== null ? data?.permissions["customfields.delete"] : "",

        "suppliers.view": data?.permissions !== null ? data?.permissions["suppliers.view"] : "",
        "suppliers.create": data?.permissions !== null ? data?.permissions["suppliers.create"] : "",
        "suppliers.edit": data?.permissions !== null ? data?.permissions["suppliers.edit"] : "",
        "suppliers.delete": data?.permissions !== null ? data?.permissions["suppliers.delete"] : "",

        "manufacturers.view": data?.permissions !== null ? data?.permissions["manufacturers.view"] : "",
        "manufacturers.create": data?.permissions !== null ? data?.permissions["manufacturers.create"] : "",
        "manufacturers.edit": data?.permissions !== null ? data?.permissions["manufacturers.edit"] : "",
        "manufacturers.delete": data?.permissions !== null ? data?.permissions["manufacturers.delete"] : "",

        "locations.view": data?.permissions !== null ? data?.permissions["locations.view"] : "",
        "locations.create": data?.permissions !== null ? data?.permissions["locations.create"] : "",
        "locations.edit": data?.permissions !== null ? data?.permissions["locations.edit"] : "",
        "locations.delete": data?.permissions !== null ? data?.permissions["locations.delete"] : "",

      },
      password_confirmation: data?.password_confirmation
    };

    setDetail(dataConvert);
    setIsEditModalVisible(true);
  };

  useEffect(() => {
    refreshData();
  }, [isEditModalVisible]);

  const [loading, setLoading] = useState(false);
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      refreshData();
      setLoading(false);
    }, 300);
  };

  const pageTotal = tableProps.pagination && tableProps.pagination.total;
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
      "item_users_selected",
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
    [`click`, `touchstart`].forEach((type) => {
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
      {loading ? (
        <>
          <div style={{ paddingTop: "15rem", textAlign: "center" }}>
            <Spin
              tip="Loading..."
              style={{ fontSize: "18px", color: "black" }}
            />
          </div>
        </>
      ) : (
        <Table
          {...tableProps}
          loading={isLoading}
          rowKey="id"
          pagination={{
            position: ["topRight", "bottomRight"],
            total: pageTotal ? pageTotal : 0,
          }}
        >
          {collumns
            .filter((collumn) => collumnSelected.includes(collumn.key))
            .map((col) => (
              <Table.Column dataIndex={col.key} {...col} sorter />
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
