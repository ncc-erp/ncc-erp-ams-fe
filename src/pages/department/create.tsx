import { useEffect, useState } from "react";
import { useTranslate, useCreate } from "@pankod/refine-core";
import {
  Form,
  Input,
  Select,
  useForm,
  Button,
  Typography,
  useSelect,
} from "@pankod/refine-antd";

import "react-mde/lib/styles/css/react-mde-all.css";
import { UploadImage } from "components/elements/uploadImage";
import "../../styles/hardware.less";
import {
  COMPANIES_SELECT_LIST_API,
  DEPARTMENT_API,
  LOCATION_SELECT_LIST_API,
  USERS_API,
} from "api/baseApi";
import { IDepartment, IDepartmentRequest } from "interfaces/department";

type DepartmentCreateProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
};

export const DepartmentCreate = (props: DepartmentCreateProps) => {
  const { setIsModalVisible } = props;
  const [payload, setPayload] = useState<FormData>();
  const [file, setFile] = useState<File>();
  const [messageErr, setMessageErr] = useState<IDepartmentRequest>();

  const t = useTranslate();

  const { formProps, form } = useForm<IDepartmentRequest>({
    action: "create",
  });

  const { selectProps: companySelectProps } = useSelect<IDepartment>({
    resource: COMPANIES_SELECT_LIST_API,
    optionLabel: "text",
    onSearch: (value) => [
      {
        field: "search",
        operator: "containss",
        value,
      },
    ],
  });

  const { selectProps: managerSelectProps } = useSelect<IDepartment>({
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

  const { selectProps: locationSelectProps } = useSelect<IDepartment>({
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

  const { mutate, data: createData, isLoading } = useCreate();

  const onFinish = (event: IDepartmentRequest) => {
    setMessageErr(messageErr);
    const formData = new FormData();

    formData.append("name", event?.name);
    if (event.company !== undefined) {
      formData.append("company_id", event.company);
    }
    if (event.manager !== undefined)
      formData.append("manager_id", event.manager);
    if (event.location !== undefined)
      formData.append("location_id", event.location);

    if (
      typeof event.image !== "string" &&
      event.image !== undefined &&
      event.image !== null
    )
      formData.append("image", event.image);

    setPayload(formData);
  };

  useEffect(() => {
    if (payload) {
      mutate({
        resource: DEPARTMENT_API,
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
      <Form.Item
        label={t("department.label.field.name")}
        name="name"
        rules={[
          {
            required: true,
            message:
              t("department.label.field.name") +
              " " +
              t("department.label.message.required"),
          },
        ]}
      >
        <Input placeholder={t("department.label.placeholder.name")} />
      </Form.Item>
      {messageErr?.name && (
        <Typography.Text type="danger">{messageErr.name[0]}</Typography.Text>
      )}

      <Form.Item label={t("department.label.field.company")} name="company">
        <Select
          placeholder={t("department.label.placeholder.company")}
          {...companySelectProps}
        />
      </Form.Item>
      {messageErr?.company && (
        <Typography.Text type="danger">{messageErr.company[0]}</Typography.Text>
      )}

      <Form.Item label={t("department.label.field.manager")} name="manager">
        <Select
          placeholder={t("department.label.placeholder.manager")}
          {...managerSelectProps}
        />
      </Form.Item>
      {messageErr?.manager && (
        <Typography.Text type="danger">{messageErr.manager[0]}</Typography.Text>
      )}

      <Form.Item label={t("department.label.field.location")} name="location">
        <Select
          placeholder={t("department.label.placeholder.location")}
          {...locationSelectProps}
        />
      </Form.Item>
      {messageErr?.location && (
        <Typography.Text type="danger">
          {messageErr.location[0]}
        </Typography.Text>
      )}

      <Form.Item label={t("department.label.field.image")} name="image">
        <UploadImage id={"create"} file={file} setFile={setFile}></UploadImage>
      </Form.Item>
      {messageErr?.image && (
        <Typography.Text type="danger">{messageErr.image[0]}</Typography.Text>
      )}

      <div className="submit">
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {t("department.label.button.create")}
        </Button>
      </div>
    </Form>
  );
};
