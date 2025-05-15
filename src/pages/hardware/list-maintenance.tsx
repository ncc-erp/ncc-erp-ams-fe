import {
  useTranslate,
  IResourceComponentsProps,
  CrudFilters,
  HttpError,
  useNavigation,
  usePermissions,
} from "@pankod/refine-core";
import { List, useTable, CreateButton, useSelect } from "@pankod/refine-antd";
import { Spin } from "antd";
import "styles/antd.less";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import moment from "moment";

import { TableAction } from "components/elements/tables/TableAction";

import { TotalDetail } from "components/elements/TotalDetail";

import {
  IHardwareFilterVariables,
  IHardwareResponse,
  IHardwareResponseCheckin,
  IHardwareResponseCheckout,
} from "interfaces/hardware";
import {
  CATEGORIES_API,
  HARDWARE_API,
  LOCATION_API,
  STATUS_LABELS_API,
  HARDWARE_TOTAL_DETAIL_API,
} from "api/baseApi";
import { ICompany } from "interfaces/company";
import { ICategory } from "interfaces/categories";
import { IStatusLabel } from "interfaces/statusLabel";
import { EPermissions } from "constants/permissions";
import { useHardwareColumns } from "./table-column";
import { SearchFilterForm } from "./search-filter-form";
import { ToolbarActions } from "./tool-bar";
import { HardwareTable } from "./table";
import { ModalsWrapper } from "./modal";
import { convertHardwareToEditData } from "ultils/ConvertHardwareData";

const defaultCheckedList = [
  "id",
  "name",
  "model",
  "category",
  "manufacturer",
  "created_at",
  "maintenance_date",
  "maintenance_cycle",
];

export const HardwareListMaintenance: React.FC<
  IResourceComponentsProps
> = () => {
  const t = useTranslate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isTotalDetailReload, setIsTotalDetailReload] = useState(false);
  const [detail, setDetail] = useState<IHardwareResponse>();
  const [detailCheckout, setDetailCheckout] =
    useState<IHardwareResponseCheckout>();
  const [isCheckoutModalVisible, setIsCheckoutModalVisible] = useState(false);
  const [isShowModalVisible, setIsShowModalVisible] = useState(false);
  const [isCheckinModalVisible, setIsCheckinModalVisible] = useState(false);
  const [detailCheckin, setDetailCheckin] =
    useState<IHardwareResponseCheckin>();
  const [collumnSelected, setColumnSelected] = useState<string[]>(
    localStorage.getItem("item_selected_maintenance") !== null
      ? JSON.parse(localStorage.getItem("item_selected_maintenance") as any)
      : defaultCheckedList
  );
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const rtd_location_id = searchParams.get("rtd_location_id");
  const dateFromParam = searchParams.get("dateFrom");
  const dateToParam = searchParams.get("dateTo");
  const searchParam = searchParams.get("search");
  const { data: permissionsData } = usePermissions();

  const isAdmin = useMemo(
    () => permissionsData?.admin === EPermissions.ADMIN,
    [permissionsData]
  );

  const { tableProps, sorter, searchFormProps, tableQueryResult, filters } =
    useTable<IHardwareResponse, HttpError, IHardwareFilterVariables>({
      initialSorter: [
        {
          field: "id",
          order: "desc",
        },
      ],
      initialFilter: [
        {
          field: "maintenance_date",
          operator: "eq",
          value: 1,
        },
      ],
      resource: HARDWARE_API,
      onSearch: (params: any) => {
        const filters: CrudFilters = [];
        const {
          search,
          name,
          asset_tag,
          serial,
          model,
          location,
          status_label,
          purchase_date,
          assigned_to,
        } = params;
        filters.push(
          {
            field: "search",
            operator: "eq",
            value: search ? search : searchParam,
          },
          {
            field: "filter",
            operator: "eq",
            value: JSON.stringify({
              name,
              asset_tag,
              serial,
              model,
              status_label,
              assigned_to,
            }),
          },
          {
            field: "rtd_location_id",
            operator: "eq",
            value: location ? location : rtd_location_id,
          },
          {
            field: "dateFrom",
            operator: "eq",
            value: purchase_date
              ? purchase_date[0].format().substring(0, 10)
              : undefined,
          },
          {
            field: "dateTo",
            operator: "eq",
            value: purchase_date
              ? purchase_date[1].format().substring(0, 10)
              : undefined,
          },
          {
            field: "assigned_status",
            operator: "eq",
            value: searchParams.get("assigned_status"),
          }
        );
        return filters;
      },
    });

  const edit = (data: IHardwareResponse) => {
    const dataConvert = convertHardwareToEditData(data);
    setDetail(dataConvert);
    setIsEditModalVisible(true);
  };

  const { selectProps: categorySelectProps } = useSelect<ICategory>({
    resource: CATEGORIES_API,
    optionLabel: "name",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });

  const filterCategory = categorySelectProps?.options?.map((item) => ({
    text: item.label,
    value: item.value,
  }));

  const { selectProps: statusLabelSelectProps } = useSelect<IStatusLabel>({
    resource: STATUS_LABELS_API,
    optionLabel: "name",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });
  const filterStatus_Label = statusLabelSelectProps?.options?.map((item) => ({
    text: item.label,
    value: item.value,
  }));

  const { list } = useNavigation();

  const collumns = useHardwareColumns({
    sorter,
    t,
    list,
    filterCategory,
    filterStatus_Label,
  });

  const refreshData = () => {
    tableQueryResult.refetch();
    setIsTotalDetailReload(!isTotalDetailReload);
  };

  const show = (data: IHardwareResponse) => {
    setIsShowModalVisible(true);
    setDetail(data);
  };

  useEffect(() => {
    setIsTotalDetailReload(!isTotalDetailReload);
  }, [isModalVisible]);

  useEffect(() => {
    refreshData();
  }, [isEditModalVisible]);

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
      "item_selected_maintenance",
      JSON.stringify(collumnSelected)
    );
  }, [collumnSelected]);

  // --- Loading and refresh logic ---
  const [loading, setLoading] = useState(false);
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      tableQueryResult.refetch();
      setIsTotalDetailReload((prev) => !prev);
      setLoading(false);
    }, 300);
  };

  const pageTotal = tableProps.pagination && tableProps.pagination.total;

  const searchValuesByDateFrom = useMemo(() => {
    return localStorage.getItem("purchase_date_maintenance")?.substring(0, 10);
  }, [localStorage.getItem("purchase_date_maintenance")]);

  const searchValuesByDateTo = useMemo(() => {
    return localStorage.getItem("purchase_date_maintenance")?.substring(11, 21);
  }, [localStorage.getItem("purchase_date_maintenance")]);

  const searchValuesLocation = useMemo(() => {
    return Number(localStorage.getItem("rtd_location_id_maintenance"));
  }, [localStorage.getItem("rtd_location_id_maintenance")]);

  const handleChangePickerByMonth = (val: any, formatString: any) => {
    if (val !== null) {
      const [from, to] = Array.from(val || []) as moment.Moment[];
      localStorage.setItem("purchase_date_maintenance", formatString ?? "");
      searchParams.set(
        "dateFrom",
        from?.format("YY-MM-DD") ? from?.format("YY-MM-DD").toString() : ""
      );
      searchParams.set(
        "dateTo",
        to?.format("YY-MM-DD") ? to?.format("YY-MM-DD").toString() : ""
      );
    } else {
      searchParams.delete("dateFrom");
      searchParams.delete("dateTo");
      localStorage.setItem("purchase_date_maintenance", formatString ?? "");
    }
    setSearchParams(searchParams);
    searchFormProps.form?.submit();
  };

  useEffect(() => {
    searchFormProps.form?.submit();
  }, [window.location.reload]);

  const { selectProps: locationSelectProps } = useSelect<ICompany>({
    resource: LOCATION_API,
    optionLabel: "name",
    optionValue: "id",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });

  const handleChangeLocation = (value: number) => {
    if (value === 0) {
      searchParams.delete("rtd_location_id");
      localStorage.setItem(
        "rtd_location_id_maintenance",
        JSON.stringify(searchFormProps.form?.getFieldsValue()?.location) ?? ""
      );
    } else {
      localStorage.setItem(
        "rtd_location_id_maintenance",
        JSON.stringify(searchFormProps.form?.getFieldsValue()?.location) ?? ""
      );
      searchParams.set(
        "rtd_location_id",
        JSON.stringify(searchFormProps.form?.getFieldsValue()?.location)
      );
    }
    setSearchParams(searchParams);
    searchFormProps.form?.submit();
  };

  return (
    <List
      title={t("hardware.label.title.list-maintenance")}
      pageHeaderProps={{
        extra: isAdmin && (
          <CreateButton onClick={() => setIsModalVisible(true)}>
            {t("hardware.label.tooltip.create")}
          </CreateButton>
        ),
      }}
    >
      <div className="search">
        <SearchFilterForm
          searchFormProps={searchFormProps}
          locationSelectProps={locationSelectProps}
          handleChangePickerByMonth={handleChangePickerByMonth}
          handleChangeLocation={handleChangeLocation}
          searchValuesLocation={searchValuesLocation}
          searchValuesByDateFrom={searchValuesByDateFrom}
          searchValuesByDateTo={searchValuesByDateTo}
          rtd_location_id={rtd_location_id}
          dateFromParam={dateFromParam}
          dateToParam={dateToParam}
        />

        <div className="all">
          <TableAction searchFormProps={searchFormProps} />
          <ToolbarActions
            columns={collumns}
            selectedColumns={collumnSelected}
            onToggleColumn={onCheckItem}
            onRefresh={handleRefresh}
            onOpenSearch={() => setIsSearchModalVisible(true)}
            t={t}
          />
        </div>
      </div>
      <ModalsWrapper
        t={t}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        isEditModalVisible={isEditModalVisible}
        setIsEditModalVisible={setIsEditModalVisible}
        isShowModalVisible={isShowModalVisible}
        setIsShowModalVisible={setIsShowModalVisible}
        isSearchModalVisible={isSearchModalVisible}
        setIsSearchModalVisible={setIsSearchModalVisible}
        isCheckoutModalVisible={isCheckoutModalVisible}
        setIsCheckoutModalVisible={setIsCheckoutModalVisible}
        isCheckinModalVisible={isCheckinModalVisible}
        setIsCheckinModalVisible={setIsCheckinModalVisible}
        detail={detail}
        detailCheckin={detailCheckin}
        detailCheckout={detailCheckout}
        searchFormProps={searchFormProps}
      />

      <TotalDetail
        filters={filters}
        links={HARDWARE_TOTAL_DETAIL_API}
        isReload={isTotalDetailReload}
      />
      {loading ? (
        <div style={{ paddingTop: "15rem", textAlign: "center" }}>
          <Spin
            tip={`${t("loading")}...`}
            style={{ fontSize: "18px", color: "black" }}
          />
        </div>
      ) : (
        <HardwareTable
          columns={collumns}
          selectedColumns={collumnSelected}
          tableProps={tableProps}
          onShow={show}
          onEdit={edit}
          onDeleteSuccess={() => setIsTotalDetailReload(!isTotalDetailReload)}
          pageTotal={pageTotal}
          t={t}
          resourceName={HARDWARE_API}
        />
      )}
    </List>
  );
};
