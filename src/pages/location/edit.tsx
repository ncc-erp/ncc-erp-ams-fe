/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useCustom, useTranslate } from "@pankod/refine-core";
import {
  Form,
  Input,
  useForm,
  Button,
  Typography,
  Select,
  Col,
  Row,
  useSelect,
} from "@pankod/refine-antd";
import "react-mde/lib/styles/css/react-mde-all.css";

import { UploadImage } from "components/elements/uploadImage";
import {
  ILocations,
  ILocationRequest,
  ILocationResponse,
} from "interfaces/location";
import {
  LOCATION_API,
  LOCATION_SELECT_LIST_API,
  USERS_SELECT_LIST_API,
} from "api/baseApi";

type LocationEditProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: ILocationResponse | undefined;
};

export const LocationEdit = (props: LocationEditProps) => {
  const { setIsModalVisible, data, isModalVisible } = props;
  const [payload, setPayload] = useState<FormData>();
  const [file, setFile] = useState<File>();
  const [messageErr, setMessageErr] = useState<ILocationRequest>();

  const t = useTranslate();

  const { form, formProps } = useForm<ILocationRequest>({
    action: "edit",
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
    resource: USERS_SELECT_LIST_API,
    optionLabel: "text",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });
  const { setFields } = form;

  const {
    refetch,
    data: updateData,
    isLoading,
  } = useCustom({
    url: LOCATION_API + "/" + data?.id,
    method: "post",
    config: {
      payload: payload,
    },
    queryOptions: {
      enabled: false,
    },
  });

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
    if (event.address !== null) {
      formData.append("address", event.address);
    }
    if (event.city !== null) {
      formData.append("city", event.city);
    }
    if (event.state !== null) {
      formData.append("state", event.state);
    }
    if (event.zip !== null) {
      formData.append("zip", event.zip);
    }
    if (event.country !== null) {
      formData.append("country", event.country);
    }

    if (event.currency !== null) {
      formData.append("currency", event.currency.toString());
    }
    if (
      typeof event.image !== "string" &&
      event.image !== null &&
      event.image !== undefined
    )
      formData.append("image", event.image);

    formData.append("_method", "PATCH");
    setPayload(formData);
  };

  useEffect(() => {
    form.resetFields();
    setFile(undefined);
    setFields([
      { name: "name", value: data?.name },
      { name: "parent_id", value: data?.parent.id },
      { name: "manager_id", value: data?.manager.id },

      { name: "address", value: data?.address },
      { name: "city", value: data?.city },
      { name: "state", value: data?.state },
      { name: "zip", value: data?.zip },
      { name: "country", value: data?.country },
      { name: "currency", value: data?.currency },

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
            initialValue={data?.name}
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
            initialValue={data?.manager.id ? data?.manager.id : ""}
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
            initialValue={data?.address}
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
            initialValue={data?.state}
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
            initialValue={data?.zip}
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
            initialValue={data?.parent.id ? data?.parent.id : ""}
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
            initialValue={data?.currency}
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
            initialValue={data?.city}
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
            initialValue={data?.country}
          >
            <Select
              placeholder={t("location.label.placeholder.country")}
              options={[
                {
                  label: "Việt Nam",
                  value: "Vietnammese",
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

      <Form.Item label="Tải hình" name="image" initialValue={data?.image}>
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
          {t("location.label.button.update")}
        </Button>
      </div>
    </Form>
  );
};
