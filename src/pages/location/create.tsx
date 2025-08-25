import { useEffect, useState } from "react";
import { useTranslate, useCreate, useNotification } from "@pankod/refine-core";
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
import { LOCATION_API, USERS_API } from "api/baseApi";

type LocationCreateProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
};

export const LocationCreate = (props: LocationCreateProps) => {
  const { setIsModalVisible } = props;
  const [payload, setPayload] = useState<FormData>();
  const [file, setFile] = useState<File>();
  const [messageErr, setMessageErr] = useState<ILocationRequest | null>();
  const { open } = useNotification();
  const t = useTranslate();

  const { formProps, form } = useForm<ILocationRequest>({
    action: "create",
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
    formData.append("branch_code", event.branch_code);
    if (event.parent !== undefined) {
      formData.append("parent_id", event.parent.toString());
    }
    if (event.manager !== undefined) {
      formData.append("manager_id", event.manager.toString());
    }
    if (event.address_detail !== undefined) {
      formData.append("address2", event.address_detail);
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

    if (event.image !== null && event.image !== undefined) {
      formData.append("image", event.image);
    }

    setPayload(formData);
  };

  useEffect(() => {
    if (payload) {
      mutate(
        {
          resource: LOCATION_API,
          values: payload,
          successNotification: false,
          errorNotification: false,
        },
        {
          onError: (error) => {
            const err: { [key: string]: string[] | string } =
              error?.response.data.messages;
            const message = Object.values(err)[0][0];
            open?.({
              type: "error",
              message: message,
            });
            setMessageErr(error?.response.data.messages);
          },
          onSuccess(data) {
            open?.({
              type: "success",
              message: data?.data.messages,
            });
          },
        }
      );
      if (createData?.data.message) form.resetFields();
    }
  }, [payload]);

  useEffect(() => {
    if (createData?.data.status === "success") {
      form.resetFields();
      setFile(undefined);
      setIsModalVisible(false);
      setMessageErr(null);
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
            label={t("location.label.field.branch_code")}
            name="branch_code"
            rules={[
              {
                required: true,
                message:
                  t("location.label.field.branch_code") +
                  " " +
                  t("location.label.message.required"),
              },
            ]}
          >
            <Input placeholder={t("location.label.field.branch_code")} />
          </Form.Item>
          {messageErr?.branch_code && (
            <Typography.Text type="danger">
              {messageErr.branch_code[0]}
            </Typography.Text>
          )}
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
            label={t("location.label.field.city")}
            name="city"
            rules={[
              {
                required: true,
                message:
                  t("location.label.field.city") +
                  " " +
                  t("location.label.message.required"),
              },
            ]}
          >
            <Input placeholder={t("location.label.field.city")} />
          </Form.Item>
        </Col>

        <Col className="gutter-row" span={12}>
          <Form.Item
            label={t("location.label.field.address_detail")}
            name="address_detail"
            rules={[
              {
                required: true,
                message:
                  t("location.label.field.address_detail") +
                  " " +
                  t("location.label.message.required"),
              },
            ]}
          >
            <Input placeholder={t("location.label.field.address_detail")} />
          </Form.Item>
          <Form.Item
            label={t("location.label.field.address")}
            name="address"
            rules={[
              {
                required: true,
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
                required: true,
                message:
                  t("location.label.field.state") +
                  " " +
                  t("location.label.message.required"),
              },
            ]}
          >
            <Input placeholder={t("location.label.field.state")} />
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
