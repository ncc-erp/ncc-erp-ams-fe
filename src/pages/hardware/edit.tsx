import { useEffect, useState } from "react";
import {
  useCustom,
  useList,
  useTranslate,
  useUpdate,
} from "@pankod/refine-core";
import {
  Form,
  Input,
  Select,
  useSelect,
  useForm,
  Tabs,
  Checkbox,
  Button,
  Row,
  Col,
  Typography,
} from "@pankod/refine-antd";
import "react-mde/lib/styles/css/react-mde-all.css";

import {
  IHardwareRequest,
  IHardwareResponseConvert,
} from "interfaces/hardware";
import { IModel } from "interfaces/model";
import { UploadImage } from "components/elements/uploadImage";
import { ICompany } from "interfaces/company";

type HardwareEditProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: IHardwareResponseConvert;
  // dataProps: any;
};

export const HardwareEdit = (props: HardwareEditProps) => {
  const { setIsModalVisible, data, isModalVisible } = props;
  const [isReadyToDeploy, setIsReadyToDeploy] = useState<Boolean>(false);
  // const [activeModel, setActiveModel] = useState<String>("1");
  const [payload, setPayload] = useState<FormData>();
  const [file, setFile] = useState<any>(null);
  const [messageErr, setMessageErr] = useState<any>(null);

  const t = useTranslate();

  enum EStatus {
    READY_TO_DEPLOY = "Ready to deploy",
    ASSIGN = "Assign",
  }

  const { form, formProps } = useForm<IHardwareRequest>({
    action: "edit",
  });

  const { setFields } = form;

  const { selectProps: modelSelectProps } = useSelect<IModel>({
    resource: "api/v1/models/selectlist",
    optionLabel: "text",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });

  const { selectProps: companySelectProps } = useSelect<ICompany>({
    resource: "api/v1/companies/selectlist",
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
    resource: "api/v1/statuslabels",
    optionLabel: "name",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });

  const { selectProps: userSelectProps } = useSelect<ICompany>({
    resource: "api/v1/users/selectlist",
    optionLabel: "text",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });

  const { selectProps: hardwareSelectProps } = useSelect<ICompany>({
    resource: "api/v1/hardware/selectlist",
    optionLabel: "text",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });

  const { selectProps: locationSelectProps } = useSelect<ICompany>({
    resource: "api/v1/locations",
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
    resource: "api/v1/suppliers",
    optionLabel: "name",
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
    url: "api/v1/hardware/" + data?.id,
    method: "post",
    config: {
      payload: payload,
    },
    queryOptions: {
      enabled: false,
    },
  });

  const onFinish = (event: IHardwareResponseConvert) => {
    console.log(event);

    setMessageErr(null);
    const formData = new FormData();

    formData.append("name", event.name);
    formData.append("serial", event.serial);
    formData.append("company_id", event.company.value);
    formData.append("model_id", event.model.toString());

    formData.append("notes", event.notes);
    formData.append("asset_tag", event.asset_tag);

    if (event.status_label.value) {
      formData.append("status_id", event.status_label.value);
    }

    formData.append("warranty_months", event.warranty_months.toString());

    formData.append("purchase_cost", event.purchase_cost.toString());
    formData.append("purchase_date", event.purchase_date);

    if (event.rtd_location !== null) {
      formData.append("rtd_location_id", event.rtd_location.toString());
    }
    if (event.supplier !== null) {
      formData.append("supplier_id", event.supplier.toString());
    }

    if (event.image !== null) {
      formData.append("image", event.image);
    }

    formData.append("_method", "PATCH");

    setPayload(formData);
  };
  // console.log("check updateData: ", data);
  useEffect(() => {
    form.resetFields();
    setFields([
      { name: "name", value: data.name },
      { name: "serial", value: data.serial },
      { name: "company_id", value: data.company },
      { name: "model_id", value: data.model.value },
      { name: "order_number", value: data.order_number },

      { name: "notes", value: data.notes },
      { name: "asset_tag", value: data.asset_tag },

      { name: "status_id", value: data.status_label.value },
      { name: "warranty_months", value: data.warranty_months },
      { name: "purchase_cost", value: data.purchase_cost },
      { name: "purchase_date", value: data.purchase_date },
      { name: "supplier_id", value: data.supplier.value },
      { name: "rtd_location_id", value: data.rtd_location.value },

      { name: "assigned_to", value: data.assigned_to },
      { name: "image", value: data.image },
    ]);
  }, [data, form, isModalVisible, setFields]);

  const [warranty] = data?.warranty_months.split(" ");

  useEffect(() => {
    form.resetFields();
  }, [form, isModalVisible]);

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
      setIsModalVisible(false);
      setMessageErr(null);
    } else {
      setMessageErr(updateData?.data.messages);
    }
  }, [updateData]);

  const findLabel = (value: number): Boolean => {
    let check = false;
    statusLabelSelectProps.options?.forEach((item) => {
      if (value === item.value) {
        if (
          item.label === EStatus.READY_TO_DEPLOY ||
          item.label === EStatus.ASSIGN
        ) {
          check = true;
          return true;
        }
      }
    });
    return check;
  };

  const changeNumber = () => {
    if (typeof data?.purchase_cost == "number") {
      let purchase_cost = data?.purchase_cost;
      return purchase_cost;
    }
  };

  const onChangeStatusLabel = (value: { value: string; label: string }) => {
    setIsReadyToDeploy(findLabel(Number(value.value)));
  };

  const onCheck = (event: any) => {
    if (event.target.checked)
      form.setFieldsValue({
        requestable: 1,
      });
    else
      form.setFieldsValue({
        requestable: 0,
      });
  };

  useEffect(() => {
    form.setFieldsValue({
      image: file,
    });
  }, [file, form]);

  return (
    <Form
      {...formProps}
      layout="vertical"
      onFinish={(event: any) => {
        onFinish(event);
      }}
    >
      <div>id ne : {data.id}</div>
      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          <Form.Item
            label={t("hardware.label.field.nameCompany")}
            name="company"
            rules={[
              {
                required: true,
                message:
                  t("hardware.label.field.nameCompany") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
            initialValue={data?.company}
          >
            <Select
              placeholder={t("hardware.label.placeholder.nameCompany")}
              {...companySelectProps}
              value={data?.company}
              showSearch
            />
          </Form.Item>
          {messageErr?.company && (
            <Typography.Text type="danger">
              {messageErr.company[0]}
            </Typography.Text>
          )}

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
            <Input value={data?.asset_tag} />
          </Form.Item>
          {messageErr?.asset_tag && (
            <Typography.Text type="danger">
              {messageErr.asset_tag[0]}
            </Typography.Text>
          )}
          <Form.Item
            label={t("hardware.label.field.serial")}
            name="serial"
            rules={[
              {
                required: true,
                message:
                  t("hardware.label.field.serial") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
            initialValue={data?.serial}
          >
            <Input value={data?.serial} />
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
              },
            ]}
            initialValue={data?.model.label}
          >
            <Select {...modelSelectProps} />
          </Form.Item>
          {messageErr?.model && (
            <Typography.Text type="danger">
              {messageErr.model[0]}
            </Typography.Text>
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
            initialValue={data?.rtd_location}
          >
            <Select
              placeholder={t("hardware.label.placeholder.location")}
              {...locationSelectProps}
              value={data?.rtd_location}
            />
          </Form.Item>
          {messageErr?.rtd_location && (
            <Typography.Text type="danger">
              {messageErr.rtd_location[0]}
            </Typography.Text>
          )}

          <Form.Item
            label={t("hardware.label.field.status")}
            name="status_label"
            rules={[
              {
                required: true,
                message:
                  t("hardware.label.field.status") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
            initialValue={data?.status_label}
          >
            <Select
              onChange={(value) => {
                onChangeStatusLabel(value);
              }}
              placeholder={t("hardware.label.placeholder.status")}
              {...statusLabelSelectProps}
            />
          </Form.Item>
          {messageErr?.status && (
            <Typography.Text type="danger">
              {messageErr.status[0]}
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
            rules={[
              {
                required: true,
                message:
                  t("hardware.label.field.dataBuy") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
            initialValue={data?.purchase_date}
          >
            <Input type="date" value={data?.purchase_date} />
          </Form.Item>
          {messageErr?.purchase_date && (
            <Typography.Text type="danger">
              {messageErr.purchase_date[0]}
            </Typography.Text>
          )}
          <Form.Item
            label={t("hardware.label.field.supplier")}
            name="supplier"
            rules={[
              {
                required: true,
                message:
                  t("hardware.label.field.supplier") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
            initialValue={data?.supplier}
          >
            <Select
              placeholder={t("hardware.label.placeholder.supplier")}
              {...supplierSelectProps}
              value={data?.supplier}
            />
          </Form.Item>
          {messageErr?.supplier && (
            <Typography.Text type="danger">
              {messageErr.supplier[0]}
            </Typography.Text>
          )}
          <Form.Item
            label={t("hardware.label.field.orderNumber")}
            name="order_number"
            rules={[
              {
                required: true,
                message:
                  t("hardware.label.field.orderNumber") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
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
            rules={[
              {
                required: true,
                message:
                  t("hardware.label.field.cost") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
            initialValue={data?.purchase_cost}
          >
            <Input
              addonAfter={t("hardware.label.field.usd")}
              value={data?.purchase_cost}
            />
          </Form.Item>
          {messageErr?.puchase_cost && (
            <Typography.Text type="danger">
              {messageErr.puchase_cost[0]}
            </Typography.Text>
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
            initialValue={warranty}
          >
            <Input
              addonAfter={t("hardware.label.field.month")}
              value={warranty}
            />
          </Form.Item>
          {messageErr?.warranty_months && (
            <Typography.Text type="danger">
              {messageErr.warranty_months[0]}
            </Typography.Text>
          )}
        </Col>
      </Row>

      <Form.Item
        label={t("hardware.label.field.notes")}
        name="notes"
        rules={[
          {
            required: true,
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

      <Form.Item label="" name="requestable">
        <Checkbox
          onChange={(event) => {
            onCheck(event);
          }}
        >
          {t("hardware.label.field.checkbox")}
        </Checkbox>
      </Form.Item>

      <Form.Item label="Tải hình" name="image" initialValue={data?.image}>
        {data?.image ? (
          <UploadImage
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
