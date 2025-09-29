import { Form, Select, useSelect } from "@pankod/refine-antd";
import { useTranslate } from "@pankod/refine-core";
import { DatePicker } from "antd";
import { dateFormat } from "constants/assets";
import moment from "moment";
import { FC, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { LOCATION_API } from "api/baseApi";
import { ICompany } from "interfaces/company";
import { ISearchFormProps } from "interfaces/hardware";
import { LocalStorageKey } from "enums/LocalStorageKey";

export const SearchFilterForm: FC<ISearchFormProps> = ({ searchFormProps }) => {
  const t = useTranslate();
  const { Option } = Select;
  const { RangePicker } = DatePicker;
  const [searchParams, setSearchParams] = useSearchParams();
  const rtd_location_id = searchParams.get("rtd_location_id");
  const dateFromParam = searchParams.get("dateFrom");
  const dateToParam = searchParams.get("dateTo");

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

  const handleChangePickerByMonth = (val: any, formatString: any) => {
    if (val !== null) {
      const [from, to] = Array.from(val || []) as moment.Moment[];
      localStorage.setItem(
        LocalStorageKey.PURCHASE_DATE_MAINTENANCE,
        formatString ?? ""
      );
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
      localStorage.setItem(
        LocalStorageKey.PURCHASE_DATE_MAINTENANCE,
        formatString ?? ""
      );
    }
    setSearchParams(searchParams);
    searchFormProps.form?.submit();
  };

  const handleChangeLocation = (value: number) => {
    if (value === 0) {
      searchParams.delete("rtd_location_id");
      localStorage.setItem(
        LocalStorageKey.RTD_LOCATION_ID_MAINTENANCE,
        JSON.stringify(searchFormProps.form?.getFieldsValue()?.location) ?? ""
      );
    } else {
      localStorage.setItem(
        LocalStorageKey.RTD_LOCATION_ID_MAINTENANCE,
        JSON.stringify(searchFormProps.form?.getFieldsValue()?.location) ?? ""
      );
      searchParams.set(
        LocalStorageKey.RTD_LOCATION_ID,
        JSON.stringify(searchFormProps.form?.getFieldsValue()?.location)
      );
    }
    setSearchParams(searchParams);
    searchFormProps.form?.submit();
  };

  const searchValuesByDateFrom = useMemo(() => {
    return localStorage
      .getItem(LocalStorageKey.PURCHASE_DATE_MAINTENANCE)
      ?.substring(0, 10);
  }, [localStorage.getItem(LocalStorageKey.PURCHASE_DATE_MAINTENANCE)]);

  const searchValuesByDateTo = useMemo(() => {
    return localStorage
      .getItem(LocalStorageKey.PURCHASE_DATE_MAINTENANCE)
      ?.substring(11, 21);
  }, [localStorage.getItem(LocalStorageKey.PURCHASE_DATE_MAINTENANCE)]);

  const searchValuesLocation = useMemo(() => {
    return Number(
      localStorage.getItem(LocalStorageKey.RTD_LOCATION_ID_MAINTENANCE)
    );
  }, [localStorage.getItem(LocalStorageKey.RTD_LOCATION_ID_MAINTENANCE)]);

  return (
    <Form
      {...searchFormProps}
      initialValues={{
        location: localStorage.getItem(
          LocalStorageKey.RTD_LOCATION_ID_MAINTENANCE
        )
          ? searchValuesLocation
          : Number(rtd_location_id),
        purchase_date:
          localStorage.getItem(LocalStorageKey.PURCHASE_DATE_MAINTENANCE) !==
          null
            ? searchValuesByDateFrom !== "" && searchValuesByDateTo !== ""
              ? [moment(searchValuesByDateFrom), moment(searchValuesByDateTo)]
              : dateFromParam && dateToParam
                ? [moment(dateFromParam), moment(dateToParam)]
                : ""
            : "",
      }}
      layout="vertical"
      onValuesChange={() => searchFormProps.form?.submit()}
      className="search-month-location"
    >
      <Form.Item label={t("hardware.label.title.time")} name="purchase_date">
        <RangePicker
          onChange={handleChangePickerByMonth}
          format={dateFormat}
          placeholder={[
            `${t("hardware.label.field.start-date")}`,
            `${t("hardware.label.field.end-date")}`,
          ]}
        />
      </Form.Item>
      <Form.Item
        label={t("hardware.label.title.location")}
        name="location"
        className={
          searchValuesLocation !== 0
            ? "search-month-location-null"
            : "search-month-location-null"
        }
      >
        <Select onChange={handleChangeLocation} placeholder={t("all")}>
          <Option value={0}>{t("all")}</Option>
          {locationSelectProps.options?.map((item: any) => (
            <Option value={item.value} key={item.value}>
              {item.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};
