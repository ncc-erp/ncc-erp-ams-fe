import { useEffect, useState } from "react";
import {
  useTranslate,
  IResourceComponentsProps,
  useCustom,
  useCreate,
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
} from "@pankod/refine-antd";

import ReactMarkdown from "react-markdown";
import ReactMde from "react-mde";

import "react-mde/lib/styles/css/react-mde-all.css";

import { IHardwareRequest } from "interfaces/hardware";
import { IModel } from "interfaces/model";
import { AppleOutlined, AndroidOutlined } from "@ant-design/icons";
import { UploadImage } from "components/elements/uploadImage";
import { ICompany } from "interfaces/company";

export const HardwareCreate: React.FC<IResourceComponentsProps> = () => {
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
  const [isReadyToDeploy, setIsReadyToDeploy] = useState<Boolean>(false);
  const [activeModel, setActiveModel] = useState<String>("1");
  const [payload, setPayload] = useState<object>({});
  const [file, setFile] = useState<any>(null);

  const t = useTranslate();

  enum EStatus {
    READY_TO_DEPLOY = "Ready to deploy",
    ASSIGN = "Assign",
  }

  const { form, formProps } = useForm<IHardwareRequest>({
    action: "edit",
  });

  const { selectProps: modelSelectProps } = useSelect<IModel>({
    resource: "api/v1/models",
    optionLabel: "name",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });

  const { selectProps: companySelectProps } = useSelect<ICompany>({
    resource: "api/v1/companies",
    optionLabel: "name",
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
    resource: "api/v1/users",
    optionLabel: "name",
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

  const { mutate, data: createData } = useCreate();

  const onFinish = (event: any) => {
    const formData = new FormData();
    formData.append("name", event.name);
    formData.append("serial", event.serial);
    formData.append("company_id", event.company_id);
    formData.append("model_id", event.model_id);
    formData.append("order_number", event.order_number);
    formData.append("notes", event.notes);
    formData.append("asset_tag", event.asset_tag);
    formData.append("user_id", event.user_id);
    formData.append("archived", event.archived);
    formData.append("physical", event.physical);
    formData.append("status_id", event.status_id);
    formData.append("warranty_months", event.warranty_months);
    formData.append("purchase_cost", event.purchase_cost);
    formData.append("purchase_date", event.purchase_date);
    formData.append("assigned_to", event.assigned_to);
    formData.append("supplier_id", event.supplier_id);
    formData.append("requestable", event.requestable);
    formData.append("location_id", event.location_id);
    formData.append("image", event.image);

    setPayload(formData);
  };

  useEffect(() => {
    mutate({
      resource: "api/v1/hardware",
      values: payload
    });
    if (createData?.data.message ) form.resetFields();
  }, [payload]);

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

  const onChangeStatusLabel = (value: any) => {
    setIsReadyToDeploy(findLabel(value));
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
  }, [file]);

  return (
    <Form
      {...formProps}
      layout="vertical"
      onFinish={(event) => {
        onFinish(event);
      }}
    >
      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          <Form.Item
            label={t("hardware.label.field.nameCompany")}
            name="company_id"
            rules={[
              {
                required: true,
                message:
                  t("hardware.label.field.nameCompany") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
          >
            <Select
              placeholder={t("hardware.label.placeholder.nameCompany")}
              {...companySelectProps}
              showSearch
            />
          </Form.Item>
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
          >
            <Input />
          </Form.Item>
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
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t("hardware.label.field.propertyType")}
            name="model_id"
            rules={[
              {
                required: true,
                message:
                  t("hardware.label.field.propertyType") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
          >
            <Select
              placeholder={t("hardware.label.placeholder.propertyType")}
              {...modelSelectProps}
            />
          </Form.Item>

          <Form.Item
            label={t("hardware.label.field.locationFix")}
            name="rtd_location_id"
            rules={[
              {
                required: true,
                message:
                  t("hardware.label.field.locationFix") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
          >
            <Select
              placeholder={t("hardware.label.placeholder.location")}
              {...locationSelectProps}
            />
          </Form.Item>

          <Form.Item
            label={t("hardware.label.field.status")}
            name="status_id"
            rules={[
              {
                required: true,
                message:
                  t("hardware.label.field.status") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
          >
            <Select
              onChange={(value) => {
                onChangeStatusLabel(value);
              }}
              placeholder={t("hardware.label.placeholder.status")}
              {...statusLabelSelectProps}
            />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={12}>
          {" "}
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
          >
            <Input />
          </Form.Item>
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
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            label={t("hardware.label.field.supplier")}
            name="supplier_id"
            rules={[
              {
                required: true,
                message:
                  t("hardware.label.field.supplier") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
          >
            <Select
              placeholder={t("hardware.label.placeholder.supplier")}
              {...supplierSelectProps}
            />
          </Form.Item>
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
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label={t("hardware.label.field.cost")}
            name="puchase_cost"
            rules={[
              {
                required: true,
                message:
                  t("hardware.label.field.cost") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
          >
            <Input type="number" addonAfter={t("hardware.label.field.usd")} />
          </Form.Item>
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
          >
            <Input type="number" addonAfter={t("hardware.label.field.month")} />
          </Form.Item>
        </Col>
      </Row>

      {isReadyToDeploy && (
        <Form.Item label={t("hardware.label.field.checkoutTo")} name="tab">
          <Tabs
            defaultActiveKey="1"
            onTabClick={(value) => {
              setActiveModel(value);
            }}
          >
            <Tabs.TabPane
              tab={
                <span>
                  <AppleOutlined />
                  {t("hardware.label.field.user")}
                </span>
              }
              key="1"
            ></Tabs.TabPane>
            <Tabs.TabPane
              tab={
                <span>
                  <AndroidOutlined />
                  {t("hardware.label.field.asset")}
                </span>
              }
              key="2"
            ></Tabs.TabPane>
            <Tabs.TabPane
              tab={
                <span>
                  <AndroidOutlined />
                  {t("hardware.label.field.location")}
                </span>
              }
              key="3"
            ></Tabs.TabPane>
          </Tabs>
        </Form.Item>
      )}

      {activeModel === "1" && (
        <Form.Item
          label={t("hardware.label.field.checkoutTo")}
          name="assigned_to"
          rules={[
            {
              required: false,
              message:
                t("hardware.label.field.checkoutTo") +
                " " +
                t("hardware.label.message.required"),
            },
          ]}
        >
          <Select
            placeholder={t("hardware.label.placeholder.user")}
            {...userSelectProps}
          />
        </Form.Item>
      )}
      {activeModel === "2" && (
        <Form.Item
          label={t("hardware.label.field.checkoutTo")}
          name="physical"
          rules={[
            {
              required: false,
              message:
                t("hardware.label.field.checkoutTo") +
                " " +
                t("hardware.label.message.required"),
            },
          ]}
        >
          <Select
            placeholder={t("hardware.label.placeholder.asset")}
            {...hardwareSelectProps}
          />
        </Form.Item>
      )}

      {activeModel === "3" && (
        <Form.Item
          label={t("hardware.label.field.location")}
          name="location_id"
          rules={[
            {
              required: false,
              message:
                t("hardware.label.field.location") +
                " " +
                t("hardware.label.message.required"),
            },
          ]}
        >
          <Select
            placeholder={t("hardware.label.placeholder.location")}
            {...locationSelectProps}
          />
        </Form.Item>
      )}

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
      >
        <ReactMde
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          generateMarkdownPreview={(markdown) =>
            Promise.resolve(<ReactMarkdown>{markdown}</ReactMarkdown>)
          }
        />
      </Form.Item>

      <Form.Item label="" name="requestable">
        <Checkbox
          onChange={(event) => {
            onCheck(event);
          }}
        >
          {t("hardware.label.field.checkbox")}
        </Checkbox>
      </Form.Item>

      <Form.Item label="Tải hình" name="image">
        <UploadImage file={file} setFile={setFile}></UploadImage>
      </Form.Item>
      <Button type="primary" htmlType="submit">
        {t("hardware.label.button.create")}
      </Button>
    </Form>
  );
};
