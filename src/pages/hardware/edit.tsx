/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useCustom, useTranslate } from "@pankod/refine-core";
import {
  Form,
  Input,
  Select,
  useSelect,
  useForm,
  Button,
  Row,
  Col,
  Typography,
} from "@pankod/refine-antd";
import "react-mde/lib/styles/css/react-mde-all.css";
import {
  IHardwareCreateRequest,
  IHardwareResponse,
  IHardwareUpdateRequest,
} from "interfaces/hardware";
import { IModel } from "interfaces/model";
import { UploadImage } from "components/elements/uploadImage";
import { ICompany } from "interfaces/company";

import {
  HARDWARE_API,
  LOCATION_API,
  MODELS_SELECT_LIST_API,
  STATUS_LABELS_API,
  SUPPLIERS_SELECT_LIST_API,
} from "api/baseApi";
import { EStatus, STATUS_LABELS } from "constants/assets";

type HardwareEditProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: IHardwareResponse | undefined;
};

export const HardwareEdit = (props: HardwareEditProps) => {
  const { setIsModalVisible, data, isModalVisible } = props;
  const [isReadyToDeploy, setIsReadyToDeploy] = useState<Boolean>(false);
  const [payload, setPayload] = useState<FormData>();
  const [file, setFile] = useState<File>();
  const [messageErr, setMessageErr] = useState<IHardwareUpdateRequest>();

  const t = useTranslate();

  const { form, formProps } = useForm<IHardwareCreateRequest>({
    action: "edit",
  });

  const { setFields } = form;

  const { selectProps: modelSelectProps } = useSelect<IModel>({
    resource: MODELS_SELECT_LIST_API,
    optionLabel: "text",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });

  const { selectProps: statusLabelSelectProps } = useSelect<ICompany>({
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

  const { selectProps: locationSelectProps } = useSelect<ICompany>({
    resource: LOCATION_API,
    optionLabel: "name",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });

  const { selectProps: supplierSelectProps } = useSelect<ICompany>({
    resource: SUPPLIERS_SELECT_LIST_API,
    optionLabel: "text",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });

  const {
    refetch,
    data: updateData,
    isLoading,
  } = useCustom({
    url: HARDWARE_API + "/" + data?.id,
    method: "post",
    config: {
      payload: payload,
    },
    queryOptions: {
      enabled: false,
    },
  });

  const onFinish = (event: IHardwareUpdateRequest) => {
    setMessageErr(messageErr);
    const formData = new FormData();

    formData.append("name", event.name);
    if (event.model !== undefined) {
      formData.append("model_id", event.model.toString());

    }
    formData.append("serial", event.serial ?? "");
    formData.append("order_number", event.order_number ?? "");

    formData.append("notes", event.notes ?? "");
    formData.append("asset_tag", event.asset_tag);
    if (event.status_label !== undefined) {
      formData.append("status_id", event.status_label.toString());
    }
    formData.append("warranty_months", event.warranty_months);

    formData.append("purchase_cost", event.purchase_cost ?? "");
    formData.append("purchase_date", event.purchase_date ?? "");
    formData.append("rtd_location_id", event.rtd_location.toString());
    formData.append("location_id", event.rtd_location.toString());

    if (event.supplier !== undefined) {
      formData.append("supplier_id", event.supplier.toString());
    }

    if (
      typeof event.image !== "string" &&
      event.image !== undefined &&
      event.image !== null
    )
      formData.append("image", event.image);

    formData.append("_method", "PUT");
    setPayload(formData);
  };

  useEffect(() => {
    form.resetFields();
    setFile(undefined);
    setFields([
      { name: "name", value: data?.name },
      { name: "serial", value: data?.serial },
      { name: "model_id", value: data?.model.id },
      { name: "order_number", value: data?.order_number },
      {
        name: "notes",
        value: data?.notes ?? "",
      },
      { name: "asset_tag", value: data?.asset_tag },
      { name: "status_id", value: data?.status_label.id },
      {
        name: "warranty_months",
        value: data?.warranty_months && data.warranty_months.split(" ")[0],
      },
      {
        name: "purchase_cost",
        value:
          data?.purchase_cost && data.purchase_cost.toString().split(",")[0],
      },
      {
        name: "purchase_date",
        value: data?.purchase_date.date ?? "",
      },
      { name: "supplier_id", value: data?.supplier.id },
      { name: "rtd_location_id", value: data?.rtd_location.id },
      { name: "assigned_to", value: data?.assigned_to },
      { name: "image", value: data?.image },
    ]);
  }, [data, form, isModalVisible]);

  useEffect(() => {
    form.resetFields();
  }, [isModalVisible]);

  useEffect(() => {
    if (payload) {
      refetch();
      if (updateData?.data.message) {
        form.resetFields();
      }
    }
  }, [payload]);

  useEffect(() => {
    if (updateData?.data.status === "success") {
      form.resetFields();
      setFile(undefined);
      setIsModalVisible(false);
      setMessageErr(messageErr);
    } else {
      setMessageErr(updateData?.data.messages);
    }
  }, [updateData]);

  const findLabel = (value: number): Boolean => {
    let check = false;
    statusLabelSelectProps.options?.forEach((item) => {
      if (value === item.value) {
        if (
          item.label === EStatus.PENDING ||
          item.label === EStatus.BROKEN ||
          item.label === EStatus.READY_TO_DEPLOY
        ) {
          check = true;
          return true;
        }
      }
    });
    return check;
  };

  const onChangeStatusLabel = (value: { value: string; label: string }) => {
    setIsReadyToDeploy(findLabel(Number(value.value)));
  };

  const filterStatusLabelSelectProps = () => {
    const optionsFiltered = statusLabelSelectProps.options?.filter(
      (item) =>
        item.label === EStatus.PENDING ||
        item.label === EStatus.BROKEN ||
        item.label === EStatus.READY_TO_DEPLOY
    );
    statusLabelSelectProps.options = optionsFiltered;
    return statusLabelSelectProps;
  };

  useEffect(() => {
    form.setFieldsValue({
      image: file,
    });
  }, [file]);

  return (
    <Form
      {...formProps}
      layout="vertical"
      onFinish={(event: any) => {
        onFinish(event);
      }}
    >
      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          <Form.Item
            label={t("hardware.label.field.propertyCard")}
            name="asset_tag"
            rules={[
              {
                required: true,
                message:
                  t("hardware.label.field.propertyCard") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
            initialValue={data?.asset_tag}
          >
            <Input />
          </Form.Item>
          {messageErr?.asset_tag && (
            <Typography.Text type="danger">
              {messageErr.asset_tag[0]}
            </Typography.Text>
          )}

          <Form.Item
            label={t("hardware.label.field.serial")}
            name="serial"
            initialValue={data?.serial}
          >
            <Input />
          </Form.Item>
          {messageErr?.serial && (
            <Typography.Text type="danger">
              {messageErr.serial[0]}
            </Typography.Text>
          )}

          <Form.Item
            label={t("hardware.label.field.propertyType")}
            name="model"
            rules={[
              {
                required: true,
                message:
                  t("hardware.label.field.propertyType") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
            initialValue={data?.model.id}
          >
            <Select
              placeholder={t("hardware.label.placeholder.propertyType")}
              {...modelSelectProps}
            />
          </Form.Item>
          {messageErr?.model && (
            <Typography.Text type="danger">{messageErr.model}</Typography.Text>
          )}

          <Form.Item
            label={t("hardware.label.field.locationFix")}
            name="rtd_location"
            rules={[
              {
                required: true,
                message:
                  t("hardware.label.field.locationFix") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
            initialValue={data?.rtd_location.id}
          >
            <Select
              placeholder={t("hardware.label.placeholder.location")}
              {...locationSelectProps}
            />
          </Form.Item>
          {messageErr?.rtd_location && (
            <Typography.Text type="danger">
              {messageErr.rtd_location}
            </Typography.Text>
          )}

          {data?.status_label.id !== STATUS_LABELS.ASSIGN && (
            <>
              <Form.Item
                label={t("hardware.label.field.status")}
                name="status_label"
                rules={[
                  {
                    required: false,
                    message:
                      t("hardware.label.field.status") +
                      " " +
                      t("hardware.label.message.required"),
                  },
                ]}
                initialValue={Number(data?.status_label.id)}
              >
                <Select
                  onChange={(value) => {
                    onChangeStatusLabel(value);
                  }}
                  placeholder={t("hardware.label.placeholder.status")}
                  {...filterStatusLabelSelectProps()}
                />
              </Form.Item>
              {messageErr?.status_label && (
                <Typography.Text type="danger">
                  {messageErr.status_label}
                </Typography.Text>
              )}
            </>
          )}

          <Form.Item
            label={t("hardware.label.field.insurance")}
            name="warranty_months"
            rules={[
              {
                required: true,
                message:
                  t("hardware.label.field.insurance") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
            initialValue={
              data?.warranty_months && data?.warranty_months.split(" ")[0]
            }
          >
            <Input
              type="number"
              addonAfter={t("hardware.label.field.month")}
              value={
                data?.warranty_months && data?.warranty_months.split(" ")[0]
              }
            />
          </Form.Item>
          {messageErr?.warranty_months && (
            <Typography.Text type="danger">
              {messageErr.warranty_months[0]}
            </Typography.Text>
          )}
        </Col>
        <Col className="gutter-row" span={12}>
          <Form.Item
            label={t("hardware.label.field.assetName")}
            name="name"
            rules={[
              {
                required: true,
                message:
                  t("hardware.label.field.assetName") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
            initialValue={data?.name}
          >
            <Input />
          </Form.Item>
          {messageErr?.name && (
            <Typography.Text type="danger">
              {messageErr.name[0]}
            </Typography.Text>
          )}

          <Form.Item
            label={t("hardware.label.field.dateBuy")}
            name="purchase_date"
            initialValue={
              data?.purchase_date.date !== null ? data?.purchase_date.date : ""
            }
          >
            <Input type="date" />
          </Form.Item>
          {messageErr?.purchase_date && (
            <Typography.Text type="danger">
              {messageErr.purchase_date[0]}
            </Typography.Text>
          )}

          <Form.Item
            label={t("hardware.label.field.supplier")}
            name="supplier"
            initialValue={data?.supplier.id}
          >
            <Select
              placeholder={t("hardware.label.placeholder.supplier")}
              {...supplierSelectProps}
            />
          </Form.Item>
          {messageErr?.supplier && (
            <Typography.Text type="danger">
              {messageErr.supplier}
            </Typography.Text>
          )}

          <Form.Item
            label={t("hardware.label.field.orderNumber")}
            name="order_number"
            initialValue={data?.order_number}
          >
            <Input value={data?.order_number} />
          </Form.Item>
          {messageErr?.order_number && (
            <Typography.Text type="danger">
              {messageErr.order_number[0]}
            </Typography.Text>
          )}

          <Form.Item
            label={t("hardware.label.field.cost")}
            name="purchase_cost"
            initialValue={
              data?.purchase_cost &&
              data?.purchase_cost.toString().split(",")[0]
            }
          >
            <Input
              type="number"
              addonAfter={t("hardware.label.field.usd")}
              value={
                data?.purchase_cost &&
                data?.purchase_cost.toString().split(",")[0]
              }
            />
          </Form.Item>
          {messageErr?.purchase_cost && (
            <Typography.Text type="danger">
              {messageErr.purchase_cost[0]}
            </Typography.Text>
          )}
        </Col>
      </Row>
      <Form.Item
        label={t("hardware.label.field.notes")}
        name="notes"
        rules={[
          {
            required: false,
            message:
              t("hardware.label.field.notes") +
              " " +
              t("hardware.label.message.required"),
          },
        ]}
        initialValue={data?.notes}
      >
        <Input.TextArea value={data?.notes} />
      </Form.Item>
      {messageErr?.notes && (
        <Typography.Text type="danger">{messageErr.notes[0]}</Typography.Text>
      )}

      <Form.Item
        label={t("hardware.label.field.loading_image")}
        name="image"
        initialValue={data?.image}
      >
        {data?.image ? (
          <UploadImage
            id={"update" + data?.id}
            url={data?.image}
            file={file}
            setFile={setFile}
          ></UploadImage>
        ) : (
          <UploadImage file={file} setFile={setFile}></UploadImage>
        )}
      </Form.Item>
      {messageErr?.image && (
        <Typography.Text type="danger">{messageErr.image[0]}</Typography.Text>
      )}
      <div className="submit">
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {t("hardware.label.button.update")}
        </Button>
      </div>
    </Form>
  );
};
