import { Form, Select } from "@pankod/refine-antd";
import { useTranslate } from "@pankod/refine-core";
import moment from "moment";
import { dateFormat } from "constants/assets";
import { DatePicker } from "antd";

import { ISearchFormProps } from "interfaces/hardware";
/* eslint-disable react/prop-types */

export const SearchFilterForm: React.FC<ISearchFormProps> = ({
  searchFormProps,
  locationSelectProps,
  handleChangePickerByMonth,
  handleChangeLocation,
  searchValuesLocation,
  searchValuesByDateFrom,
  searchValuesByDateTo,
  rtd_location_id,
  dateFromParam,
  dateToParam,
}) => {
  const t = useTranslate();
  const { Option } = Select;
  const { RangePicker } = DatePicker;
  return (
    <Form
      {...searchFormProps}
      initialValues={{
        location: localStorage.getItem("rtd_location_id_maintenance")
          ? searchValuesLocation
          : Number(rtd_location_id),
        purchase_date:
          localStorage.getItem("purchase_date_maintenance") !== null
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
