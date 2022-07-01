/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useTranslate, useCreate } from "@pankod/refine-core";
import {
  Form,
  Input,
  Select,
  useSelect,
  useForm,
  Button,
  Typography,
  Col,
  Row,
} from "@pankod/refine-antd";

import "react-mde/lib/styles/css/react-mde-all.css";

import { UploadImage } from "components/elements/uploadImage";

import "../../styles/hardware.less";
import { ILocations, ILocationRequest } from "interfaces/location";
import { LOCATION_API, LOCATION_SELECT_LIST_API, USERS_API } from "api/baseApi";

type LocationCreateProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
};

export const LocationCreate = (props: LocationCreateProps) => {
  const { setIsModalVisible } = props;
  const [payload, setPayload] = useState<FormData>();
  const [file, setFile] = useState<File>();
  const [messageErr, setMessageErr] = useState<ILocationRequest>();

  const t = useTranslate();

  const { formProps, form } = useForm<ILocationRequest>({
    action: "create",
  });

  const { selectProps: locationSelectProps } = useSelect<ILocations>({
    resource: LOCATION_SELECT_LIST_API,
    optionLabel: "text",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });

  const { selectProps: userSelectProps } = useSelect<ILocations>({
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

  const { mutate, data: createData, isLoading } = useCreate();

  const onFinish = (event: ILocationRequest) => {
    setMessageErr(messageErr);
    const formData = new FormData();

    formData.append("name", event.name);
    if (event.parent !== undefined) {
      formData.append("parent_id", event.parent.toString());
    }
    if (event.manager !== undefined) {
      formData.append("manager_id", event.manager.toString());
    }
    if (event.address !== undefined) {
      formData.append("address", event.address);
    }
    if (event.city !== undefined) {
      formData.append("city", event.city);
    }
    if (event.state !== undefined) {
      formData.append("state", event.state);
    }
    if (event.zip !== undefined) {
      formData.append("zip", event.zip);
    }
    if (event.country !== undefined) {
      formData.append("country", event.country);
    }

    if (event.currency !== undefined) {
      formData.append("currency", event.currency.toString());
    }

    if (event.image !== null && event.image !== undefined) {
      formData.append("image", event.image);
    }

    setPayload(formData);
    form.resetFields();
  };

  useEffect(() => {
    if (payload) {
      mutate({
        resource: LOCATION_API,
        values: payload,
      });
      if (createData?.data.message) form.resetFields();
    }
  }, [payload]);

  useEffect(() => {
    if (createData?.data.status === "success") {
      form.resetFields();
      setFile(undefined);
      setIsModalVisible(false);
      setMessageErr(messageErr);
    } else {
      setMessageErr(createData?.data.messages);
    }
  }, [createData]);

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
            label={t("location.label.field.name")}
            name="name"
            rules={[
              {
                required: true,
                message:
                  t("location.label.field.name") +
                  " " +
                  t("location.label.message.required"),
              },
            ]}
          >
            <Input placeholder={t("location.label.field.name")} />
          </Form.Item>
          {messageErr?.name && (
            <Typography.Text type="danger">
              {messageErr.name[0]}
            </Typography.Text>
          )}

          <Form.Item
            label={t("location.label.field.manager")}
            name="manager"
            rules={[
              {
                required: false,
                message:
                  t("location.label.field.manager") +
                  " " +
                  t("location.label.message.required"),
              },
            ]}
          >
            <Select
              placeholder={t("location.label.placeholder.manager")}
              {...userSelectProps}
            />
          </Form.Item>
          <Form.Item
            label={t("location.label.field.address")}
            name="address"
            rules={[
              {
                required: false,
                message:
                  t("location.label.field.address") +
                  " " +
                  t("location.label.message.required"),
              },
            ]}
          >
            <Input placeholder={t("location.label.field.address")} />
          </Form.Item>
          <Form.Item
            label={t("location.label.field.state")}
            name="state"
            rules={[
              {
                required: false,
                message:
                  t("location.label.field.state") +
                  " " +
                  t("location.label.message.required"),
              },
            ]}
          >
            <Input placeholder={t("location.label.field.state")} />
          </Form.Item>
          <Form.Item
            label={t("location.label.field.zip")}
            name="zip"
            rules={[
              {
                required: false,
                message:
                  t("location.label.field.zip") +
                  " " +
                  t("location.label.message.required"),
              },
            ]}
          >
            <Input placeholder={t("location.label.field.zip")} />
          </Form.Item>
        </Col>

        <Col className="gutter-row" span={12}>
          <Form.Item
            label={t("location.label.field.parent")}
            name="parent"
            rules={[
              {
                required: false,
                message:
                  t("location.label.field.parent") +
                  " " +
                  t("location.label.message.required"),
              },
            ]}
          >
            <Select
              placeholder={t("location.label.placeholder.parent")}
              {...locationSelectProps}
            />
          </Form.Item>
          <Form.Item
            label={t("location.label.field.currency")}
            name="currency"
            rules={[
              {
                required: false,
                message:
                  t("location.label.field.currency") +
                  " " +
                  t("location.label.message.required"),
              },
            ]}
          >
            <Input placeholder={t("location.label.placeholder.currency")} />
          </Form.Item>
          <Form.Item
            label={t("location.label.field.city")}
            name="city"
            rules={[
              {
                required: false,
                message:
                  t("location.label.field.city") +
                  " " +
                  t("location.label.message.required"),
              },
            ]}
          >
            <Input placeholder={t("location.label.field.city")} />
          </Form.Item>
          <Form.Item
            label={t("location.label.field.country")}
            name="country"
            rules={[
              {
                required: false,
                message:
                  t("location.label.field.country") +
                  " " +
                  t("location.label.message.required"),
              },
            ]}
          >
            <Select
              placeholder={t("location.label.placeholder.country")}
              options={[
                {
                  label: "Việt Nam",
                  value: "VN",
                },
                {
                  label: "England",
                  value: "English",
                },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label={t("category.label.field.image")} name="image">
        <UploadImage id={"create"} file={file} setFile={setFile}></UploadImage>
      </Form.Item>
      {messageErr?.image && (
        <Typography.Text type="danger">{messageErr.image[0]}</Typography.Text>
      )}
      <div className="submit">
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {t("location.label.button.create")}
        </Button>
      </div>
    </Form>
  );
};
