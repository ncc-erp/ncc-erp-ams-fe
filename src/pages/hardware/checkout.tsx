/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useCustom, useTranslate } from "@pankod/refine-core";
import {
  Form,
  Input,
  Select,
  useSelect,
  useForm,
  Tabs,
  Button,
  Row,
  Col,
  Typography,
} from "@pankod/refine-antd";

import "react-mde/lib/styles/css/react-mde-all.css";
import {
  IHardwareRequestCheckout,
  IHardwareResponseCheckout,
} from "interfaces/hardware";
import { IModel } from "interfaces/model";
import {
  UserOutlined,
  AndroidOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { ICompany } from "interfaces/company";
import { HARDWARE_API, HARDWARE_SELECTLIST_API, LOCATIONS_API, MODELS_SELECTLIST_API, STATUSLABELS_API, USERS_API } from "api/baseApi";

type HardwareCheckoutProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: IHardwareResponseCheckout | undefined;
};

export const HardwareCheckout = (props: HardwareCheckoutProps) => {
  const { setIsModalVisible, data, isModalVisible } = props;
  const [, setIsReadyToDeploy] = useState<Boolean>(false);
  const [activeModel, setActiveModel] = useState<String | any>("1");
  const [payload, setPayload] = useState<FormData>();
  const [messageErr, setMessageErr] = useState<any>(null);

  const t = useTranslate();

  enum EStatus {
    READY_TO_DEPLOY = "Ready to deploy",
    ASSIGN = "Assign",
  }

  const { form, formProps } = useForm<IHardwareRequestCheckout>({
    action: "edit",
  });

  const { setFields } = form;

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

  const {
    refetch,
    data: updateData,
    isLoading,
  } = useCustom({
    url: HARDWARE_API + "/" + data?.id + "/checkout",
    method: "post",
    config: {
      payload: payload,
    },
    queryOptions: {
      enabled: false,
    },
  });

  const onFinish = (event: IHardwareRequestCheckout) => {
    setMessageErr(null);

    const formData = new FormData();
    formData.append("name", event.name);
    if (event.note !== undefined) {
      formData.append("note", event.note);
    }
    formData.append("status_id", event.status_label);
    formData.append("checkout_at", event.checkout_at);
    formData.append("model_id", event.model.toString());

    // if (event.assigned_location !== undefined) {
    //   formData.append("assigned_location", event.assigned_location);
    //   formData.append("checkout_to_type", "location");
    // }
    // if (event.assigned_asset !== undefined) {
    //   formData.append("assigned_asset", event.assigned_asset);
    //   formData.append("checkout_to_type", "asset");
    // }
    if (event.assigned_user !== undefined) {
      formData.append("assigned_user", event.assigned_user);
      formData.append("checkout_to_type", "user");
    }

    setPayload(formData);
  };

  useEffect(() => {
    form.resetFields();
    setFields([
      { name: "name", value: data?.name },
      { name: "model_id", value: data?.model.name },
      { name: "note", value: data?.note },
      { name: "status_id", value: data?.status_label.id },
      {
        name: "checkout_at",
        value: new Date().toISOString().substring(0, 10),
      },
      { name: "assigned_user", value: data?.assigned_user },
      { name: "assigned_location", value: data?.assigned_location.name },
    ]);
  }, [data, form, isModalVisible, setFields]);

  useEffect(() => {
    form.resetFields();
  }, [form, isModalVisible]);

  useEffect(() => {
    if (payload) {
      refetch();
      if (updateData?.data.message) form.resetFields();
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

  const onChangeStatusLabel = (value: { value: string; label: string }) => {
    setIsReadyToDeploy(findLabel(Number(value)));
  };

  const filterStatusLabelSelectProps = () => {
    const optionsFiltered = statusLabelSelectProps.options?.filter(
      (item) =>
        item.label === EStatus.READY_TO_DEPLOY || item.label === EStatus.ASSIGN
    );
    statusLabelSelectProps.options = optionsFiltered;
    return statusLabelSelectProps;
  };

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
            initialValue={data?.model.name}
          >
            <Select
              placeholder={t("hardware.label.placeholder.propertyType")}
              {...modelSelectProps}
              disabled={true}
            />
          </Form.Item>
          {messageErr?.model && (
            <Typography.Text type="danger">
              {messageErr.model[0]}
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
            initialValue={data?.status_label.id}
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
              {messageErr.status_label[0]}
            </Typography.Text>
          )}

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

          {activeModel === "1" && (
            <Form.Item
              className="tabUserCheckout"
              label={t("hardware.label.field.user")}
              name="assigned_user"
              rules={[
                {
                  required: true,
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
          {messageErr?.assigned_user && (
            <Typography.Text type="danger">
              {messageErr.assigned_user[0]}
            </Typography.Text>
          )}

          {/* {activeModel === "2" && (
            <Form.Item
              className="tabUser"
              label={t("hardware.label.field.asset")}
              name="assigned_asset"
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
          )} */}

          {/* {activeModel === "3" && (
            <Form.Item
              className="tabUser"
              label={t("hardware.label.field.location")}
              name="assigned_location"
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
            label={t("hardware.label.field.dateCheckout")}
            name="checkout_at"
            rules={[
              {
                required: true,
                message:
                  t("hardware.label.field.dateCheckout") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
            initialValue={new Date().toISOString().substring(0, 10)}
          >
            <Input type="date" />
          </Form.Item>
          {messageErr?.checkout_at && (
            <Typography.Text type="danger">
              {messageErr.checkout_at[0]}
            </Typography.Text>
          )}
        </Col>
      </Row>

      <Form.Item
        label={t("hardware.label.field.note")}
        name="note"
        rules={[
          {
            required: false,
            message:
              t("hardware.label.field.notes") +
              " " +
              t("hardware.label.message.required"),
          },
        ]}
        initialValue={data?.note}
      >
        <Input.TextArea value={data?.note} />
      </Form.Item>

      <div className="submit">
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {t("hardware.label.button.checkout")}
        </Button>
      </div>
    </Form>
  );
};
