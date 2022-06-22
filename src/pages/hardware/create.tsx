/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useTranslate, useCreate } from "@pankod/refine-core";
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

import ReactMarkdown from "react-markdown";
import ReactMde from "react-mde";

import "react-mde/lib/styles/css/react-mde-all.css";

import {
  IHardwareCreateRequest,
  IHardwareUpdateRequest,
} from "interfaces/hardware";
import { IModel } from "interfaces/model";
import {
  UserOutlined,
  AndroidOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { UploadImage } from "components/elements/uploadImage";
import { ICompany } from "interfaces/company";

import "../../styles/hardware.less";
import { ICheckboxChange } from "interfaces";
import { COMPANIES_API, HARDWARE_API, HARDWARE_SELECTLIST_API, LOCATIONS_API, MODELS_SELECTLIST_API, STATUSLABELS_API, SUPPLIERS_HARDWARE_API, USERS_API } from "api/baseApi";

type HardWareCreateProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
};

export const HardwareCreate = (props: HardWareCreateProps) => {
  const { setIsModalVisible } = props;
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
  const [isReadyToDeploy, setIsReadyToDeploy] = useState<Boolean>(false);
  const [activeModel, setActiveModel] = useState<String>("1");
  const [payload, setPayload] = useState<FormData>();
  const [file, setFile] = useState<any>(null);
  const [messageErr, setMessageErr] = useState<any>(null);

  const t = useTranslate();

  enum EStatus {
    READY_TO_DEPLOY = "Ready to deploy",
    ASSIGN = "Assign",
  }

  const { formProps, form } = useForm<IHardwareCreateRequest>({
    action: "create",
  });

  const { selectProps: modelSelectProps } = useSelect<IModel>({
    resource: MODELS_SELECTLIST_API,
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
    resource: COMPANIES_API,
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
    resource: STATUSLABELS_API,
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
    resource: USERS_API,
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
    resource: HARDWARE_SELECTLIST_API,
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
    resource: LOCATIONS_API,
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
    resource: SUPPLIERS_HARDWARE_API,
    optionLabel: "name",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });

  const { mutate, data: createData, isLoading } = useCreate();

  const onFinish = (event: IHardwareUpdateRequest) => {
    setMessageErr(null);
    const formData = new FormData();

    formData.append("name", event.name);
    formData.append("asset_tag", event.asset_tag);
    if (event.serial !== undefined) formData.append("serial", event.serial);
    formData.append("model_id", event.model.toString());
    formData.append("rtd_location_id", event.rtd_location.toString());

    if (event.order_number !== undefined)
      formData.append("order_number", event.order_number);

    formData.append("status_id", event.status_label.toString());

    if (event.user_id !== undefined)
      formData.append("assigned_to", event.user_id.toString());
    // if (event.physical !== undefined) formData.append("physical", event.physical.toString());
    // if (event.location !== undefined) formData.append("location_id", event.location.toString());

    if (event.purchase_cost !== undefined)
      formData.append("purchase_cost", event.purchase_cost);
    if (event.purchase_date !== undefined)
      formData.append("purchase_date", event.purchase_date);

    formData.append("supplier_id", event.supplier.toString());
    formData.append("warranty_months", event.warranty_months);
    formData.append("notes", event.notes);

    if (event.requestable !== undefined)
      formData.append("requestable", event.requestable.toString());

    if (event.image !== null && event.image !== undefined) {
      formData.append("image", event.image);
    }

    setPayload(formData);
    form.resetFields();
  };

  useEffect(() => {
    if (payload) {
      mutate({
        resource: HARDWARE_API,
        values: payload,
      });
      if (createData?.data.message) form.resetFields();
    }
  }, [payload]);

  useEffect(() => {
    if (createData?.data.status === "success") {
      form.resetFields();
      setFile(null);
      setIsModalVisible(false);
      setMessageErr(null);
    } else {
      setMessageErr(createData?.data.messages);
    }
  }, [createData]);

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

  const onChangeStatusLabel = (value: { value: string; label: string }) => {
    setIsReadyToDeploy(findLabel(Number(value)));
  };

  const onCheck = (event: ICheckboxChange) => {
    if (event.target.checked)
      form.setFieldsValue({
        requestable: 1,
      });
    else form.setFieldsValue({ requestable: 0 });
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
          >
            <Input placeholder={t("hardware.label.placeholder.propertyCard")} />
          </Form.Item>
          {messageErr?.asset_tag && (
            <Typography.Text type="danger">
              {messageErr.asset_tag[0]}
            </Typography.Text>
          )}
          <Form.Item label={t("hardware.label.field.serial")} name="serial">
            <Input placeholder={t("hardware.label.placeholder.serial")} />
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
          >
            <Select
              placeholder={t("hardware.label.placeholder.propertyType")}
              {...modelSelectProps}
            />
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
          >
            <Select
              placeholder={t("hardware.label.placeholder.location")}
              {...locationSelectProps}
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
                      <UserOutlined />
                      {t("hardware.label.field.user")}
                    </span>
                  }
                  key="1"
                ></Tabs.TabPane>
                {/* <Tabs.TabPane
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
                      <EnvironmentOutlined />
                      {t("hardware.label.field.location")}
                    </span>
                  }
                  key="3"
                ></Tabs.TabPane> */}
              </Tabs>
            </Form.Item>
          )}

          {activeModel === "1" && (
            <Form.Item
              className="tabUser"
              label={t("hardware.label.field.user")}
              name="assigned_to"
              rules={[
                {
                  required: false,
                  message:
                    t("hardware.label.field.user") +
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
          {/* {activeModel === "2" && (
            <Form.Item
              className="tabAsset"
              label={t("hardware.label.field.asset")}
              name="physical"
              rules={[
                {
                  required: false,
                  message:
                    t("hardware.label.field.asset") +
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
              className="tabLocation"
              label={t("hardware.label.field.location")}
              name="location"
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
          )} */}
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
            <Input placeholder={t("hardware.label.placeholder.assetName")} />
          </Form.Item>
          {messageErr?.name && (
            <Typography.Text type="danger">
              {messageErr.name[0]}
            </Typography.Text>
          )}
          <Form.Item
            label={t("hardware.label.field.dateBuy")}
            name="purchase_date"
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
          {messageErr?.supplier && (
            <Typography.Text type="danger">
              {messageErr.supplier[0]}
            </Typography.Text>
          )}
          <Form.Item
            label={t("hardware.label.field.orderNumber")}
            name="order_number"
          >
            <Input placeholder={t("hardware.label.placeholder.orderNumber")} />
          </Form.Item>
          {messageErr?.order_number && (
            <Typography.Text type="danger">
              {messageErr.order_number[0]}
            </Typography.Text>
          )}
          <Form.Item
            label={t("hardware.label.field.cost")}
            name="purchase_cost"
          >
            <Input
              type="number"
              addonAfter={t("hardware.label.field.usd")}
              placeholder={t("hardware.label.placeholder.cost")}
            />
          </Form.Item>
          {messageErr?.purchase_cost && (
            <Typography.Text type="danger">
              {messageErr.purchase_cost[0]}
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
          >
            <Input
              type="number"
              addonAfter={t("hardware.label.field.month")}
              placeholder={t("hardware.label.placeholder.insurance")}
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
      >
        <ReactMde
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          generateMarkdownPreview={(markdown) =>
            Promise.resolve(<ReactMarkdown>{markdown}</ReactMarkdown>)
          }
        />
      </Form.Item>
      {messageErr?.notes && (
        <Typography.Text type="danger">{messageErr.notes[0]}</Typography.Text>
      )}

      <Form.Item label="" name="requestable" valuePropName="checked">
        <Checkbox
          onChange={(event) => {
            onCheck(event);
          }}
        >
          {t("hardware.label.field.checkbox")}
        </Checkbox>
      </Form.Item>
      {messageErr?.requestable && (
        <Typography.Text type="danger">
          {messageErr.requestable[0]}
        </Typography.Text>
      )}

      <Form.Item label="Tải hình" name="image">
        <UploadImage id={"create"} file={file} setFile={setFile}></UploadImage>
      </Form.Item>
      {messageErr?.image && (
        <Typography.Text type="danger">{messageErr.image[0]}</Typography.Text>
      )}
      <div className="submit">
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {t("hardware.label.button.create")}
        </Button>
      </div>
    </Form>
  );
};
