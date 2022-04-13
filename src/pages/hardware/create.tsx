import { useState } from "react";
import {
  useTranslate,
  IResourceComponentsProps,
  useCustom,
} from "@pankod/refine-core";
import {
  Create,
  Form,
  Input,
  Select,
  useSelect,
  useForm,
  AutoComplete,
  Tabs,
  Checkbox,
  Edit,
  Button,
} from "@pankod/refine-antd";

import ReactMarkdown from "react-markdown";
import ReactMde from "react-mde";

import "react-mde/lib/styles/css/react-mde-all.css";

import { IHardwareRequest } from "interfaces/hardware";
import { IModel } from "interfaces/model";
import { AppleOutlined, AndroidOutlined } from "@ant-design/icons";
import { UploadImage } from "components/elements/uploadImage";
import { ICompany } from "interfaces/Company";

export const HardwareCreate: React.FC<IResourceComponentsProps> = () => {
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
  const [isReadyToDeploy, setIsReadyToDeploy] = useState<Boolean>(false);
  const [activeModel, setActiveModel] = useState<String>("1");
  const [payload, setPayload] = useState<object>({});

  const t = useTranslate();

  enum EStatus {
    READY_TO_DEPLOY = "Ready to deploy",
    ASSIGN = "Assign",
  }

  const { formProps } = useForm<IHardwareRequest>({
    action: "edit",
  });

  const { selectProps: modelSelectProps } = useSelect<IModel>({
    resource: "api/v1/models",
    optionLabel: "name",
  });

  const { selectProps: companySelectProps } = useSelect<ICompany>({
    resource: "api/v1/companies",
    optionLabel: "name",
  });

  const { selectProps: statusLabelSelectProps } = useSelect<ICompany>({
    resource: "api/v1/statuslabels",
    optionLabel: "name",
  });

  const { selectProps: userSelectProps } = useSelect<ICompany>({
    resource: "api/v1/users",
    optionLabel: "name",
  });

  const { selectProps: hardwareSelectProps } = useSelect<ICompany>({
    resource: "api/v1/hardware/selectlist",
    optionLabel: "name",
  });

  const { selectProps: locationSelectProps } = useSelect<ICompany>({
    resource: "api/v1/locations",
    optionLabel: "name",
  });

  const { selectProps: supplierSelectProps } = useSelect<ICompany>({
    resource: "api/v1/suppliers",
    optionLabel: "name",
  });

  const { data: createData, refetch } = useCustom({
    url: "api/v1/finfast-request",
    method: "post",
    config: {
      payload: payload,
    },
    queryOptions: { enabled: false },
  });

  const onFinish = (event: any) => {
    setPayload({
      name: event.name,
    });

    refetch();
  };

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
    console.log(findLabel(value));
  };

  return (
      <Form
        {...formProps}
        layout="vertical"
        onFinish={(event) => {
          onFinish(event);
        }}
      >
        <Form.Item
          label={t("hardware.label.field.nameCompany")}
          name="company_id"
          rules={[
            {
              required: true,
            },
          ]}
        >
          {" "}
          <Select
            placeholder={t("hardware.label.placeholder.nameCompany")}
            {...companySelectProps}
          />
        </Form.Item>
        <Form.Item
          label={t("hardware.label.field.propertyCard")}
          name="name"
          rules={[
            {
              required: true,
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
            },
          ]}
        >
          <Select
            placeholder={t("hardware.label.placeholder.propertyType")}
            {...modelSelectProps}
          />
        </Form.Item>
        <Form.Item
          label={t("hardware.label.field.status")}
          name="status"
          rules={[
            {
              required: true,
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
        {isReadyToDeploy && (
          <Form.Item
            label={t("hardware.label.field.checkoutTo")}
            name="serial"
            rules={[
              {
                required: true,
              },
            ]}
          >
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
            name="user_id"
            rules={[
              {
                required: true,
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
            name="asset"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder={t("hardware.label.placeholder.asset")} {...hardwareSelectProps} />
          </Form.Item>
        )}

        {activeModel === "3" && (
          <Form.Item
            label={t("hardware.label.field.location")}
            name="location_id"
            rules={[
              {
                required: true,
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
          label={t("hardware.label.field.assetName")}
          name="name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t("hardware.label.field.dateBuy")}
          name="date"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item
          label={t("hardware.label.field.supplier")}
          name="date"
          rules={[
            {
              required: true,
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
            },
          ]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          label={t("hardware.label.field.cost")}
          name="number"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input type="number" addonAfter={t("hardware.label.field.usd")} />
        </Form.Item>

        <Form.Item
          label={t("hardware.label.field.insurance")}
          name="number"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input type="number" addonAfter={t("hardware.label.field.month")} />
        </Form.Item>

        <Form.Item
          label={t("hardware.label.field.notes")}
          name="notes"
          rules={[
            {
              required: true,
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

        <Form.Item
          label={t("hardware.label.field.locationFix")}
          name="date"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            placeholder={t("hardware.label.placeholder.location")}
            {...locationSelectProps}
          />
        </Form.Item>

        <Form.Item
          label=""
          name="date"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Checkbox>{t("hardware.label.field.checkbox")}</Checkbox>
        </Form.Item>

        <Form.Item
          label="Tải hình"
          name="file"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <UploadImage></UploadImage>
        </Form.Item>
        <Button type="primary" htmlType="submit">
            Submit
          </Button>
      </Form>
  );
};
