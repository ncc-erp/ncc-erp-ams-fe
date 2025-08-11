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

import { TableAction } from "components/elements/tables/TableAction";

import { TotalDetail } from "components/elements/TotalDetail";

import {
  IHardwareFilterVariables,
  IHardwareResponse,
} from "interfaces/hardware";
import {
  CATEGORIES_API,
  HARDWARE_API,
  STATUS_LABELS_API,
  HARDWARE_TOTAL_DETAIL_API,
} from "api/baseApi";
import { ICategory } from "interfaces/categories";
import { IStatusLabel } from "interfaces/statusLabel";
import { EPermissions } from "constants/permissions";
import { useHardwareColumns } from "./table-column";
import { SearchFilterForm } from "./search-filter-form";
import { ToolbarActions } from "./tool-bar";
import { HardwareTable } from "./table";
import { ModalsWrapper } from "components/Modal/MModal";
import { convertHardwareToEditData } from "ultils/ConvertHardwareData";
import { HardWareModalType } from "constants/assets";
import { useAppSearchParams } from "hooks/useAppSearchParams";

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

  const [isTotalDetailReload, setIsTotalDetailReload] = useState(false);
  const [detail, setDetail] = useState<IHardwareResponse>();
  const [collumnSelected, setColumnSelected] = useState<string[]>(
    localStorage.getItem("item_selected_maintenance") !== null
      ? JSON.parse(localStorage.getItem("item_selected_maintenance") as any)
      : defaultCheckedList
  );
  const [modalState, setModalState] = useState<{
    type: HardWareModalType | null;
    isVisible: boolean;
  }>({ type: null, isVisible: false });
  const { data: permissionsData } = usePermissions();

  const isAdmin = useMemo(
    () => permissionsData?.admin === EPermissions.ADMIN,
    [permissionsData]
  );
  const {
    params: { rtd_location_id, search: searchParam, assigned_status },
  } = useAppSearchParams("hardwareList");

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
            value: assigned_status,
          }
        );
        return filters;
      },
    });

  const edit = (data: IHardwareResponse) => {
    const dataConvert = convertHardwareToEditData(data);
    setDetail(dataConvert);
    setModalState({ type: HardWareModalType.EDIT, isVisible: true });
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
    setModalState({ type: HardWareModalType.SHOW, isVisible: true });
    setDetail(data);
  };

  useEffect(() => {
    setIsTotalDetailReload(!isTotalDetailReload);
  }, [modalState.isVisible]);

  useEffect(() => {
    refreshData();
  }, [modalState.isVisible]);

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

  // useEffect(() => {
  //   searchFormProps.form?.submit();
  // }, []);

  return (
    <List
      title={t("hardware.label.title.list-maintenance")}
      pageHeaderProps={{
        extra: isAdmin && (
          <CreateButton
            onClick={() =>
              setModalState({ type: HardWareModalType.CREATE, isVisible: true })
            }
          >
            {t("hardware.label.tooltip.create")}
          </CreateButton>
        ),
      }}
    >
      <div className="search">
        <SearchFilterForm searchFormProps={searchFormProps} />

        <div className="all">
          <TableAction searchFormProps={searchFormProps} />
          <ToolbarActions
            columns={collumns}
            selectedColumns={collumnSelected}
            onToggleColumn={onCheckItem}
            onRefresh={handleRefresh}
            onOpenSearch={() =>
              setModalState({ type: HardWareModalType.SEARCH, isVisible: true })
            }
          />
        </div>
      </div>
      <ModalsWrapper
        t={t}
        modalState={modalState}
        setModalState={setModalState}
        detail={detail}
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
          resourceName={HARDWARE_API}
        />
      )}
    </List>
  );
};
