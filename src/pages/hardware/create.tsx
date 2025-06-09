/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useTranslate, useCreate, useNotification } from "@pankod/refine-core";
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

import ReactMarkdown from "react-markdown";
import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";

import {
  FormValues,
  IHardwareCreateRequest,
  IHardwareUpdateRequest,
} from "interfaces/hardware";
import { IModel } from "interfaces/model";
import { UploadImage } from "components/elements/uploadImage";
import { ICompany } from "interfaces/company";
import "../../styles/hardware.less";
import {
  HARDWARE_API,
  LOCATION_API,
  MODELS_SELECT_LIST_API,
  STATUS_LABELS_API,
  SUPPLIERS_SELECT_LIST_API,
  USERS_API,
} from "api/baseApi";
import { EStatus, STATUS_LABELS } from "constants/assets";
import moment from "moment";

import { useGetProjectData } from "hooks/useGetProjectData";
type HardWareCreateProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
};

export const HardwareCreate = (props: HardWareCreateProps) => {
  const { setIsModalVisible } = props;
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
  const [isReadyToDeploy, setIsReadyToDeploy] = useState<boolean>(false);
  const [file, setFile] = useState<File>();
  const [payload, setPayload] = useState<FormData>();
  const [messageErr, setMessageErr] = useState<IHardwareUpdateRequest | null>();
  const { open } = useNotification();
  const t = useTranslate();

  const { customer, project } = useGetProjectData();

  const { formProps, form } = useForm<IHardwareCreateRequest>({
    action: "create",
  });

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

  const filteredProps = statusLabelSelectProps.options?.filter(
    (props) => props.value === STATUS_LABELS.READY_TO_DEPLOY
  );
  statusLabelSelectProps.options = filteredProps;

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

  const { mutate, data: createData, isLoading } = useCreate();

  const onFinish = (event: IHardwareUpdateRequest) => {
    const selectedCustomer = customer.find(
      (c) => Number(c.id) === Number(event.customer)
    );
    const selectedProject = project.find(
      (p) => Number(p.id) === Number(event.project)
    );

    setMessageErr(messageErr);
    const formData = new FormData();
    if (selectedCustomer !== undefined) {
      formData.append("customer", selectedCustomer.name);
    }
    if (selectedCustomer !== undefined) {
      formData.append("customer_code", selectedCustomer.code);
    }
    if (selectedProject !== undefined) {
      formData.append("project", selectedProject.name);
    }
    if (selectedProject !== undefined) {
      formData.append("project_code", selectedProject.code);
    }
    if (event.isCustomerRenting !== undefined) {
      formData.append("isCustomerRenting", event.isCustomerRenting);
    }
    if (event.name !== undefined) {
      formData.append("name", event.name);
    }
    formData.append("asset_tag", event.asset_tag);
    if (event.serial !== undefined) {
      formData.append("serial", event.serial);
    }
    formData.append("model_id", event.model.toString());
    if (event.rtd_location !== undefined) {
      formData.append("rtd_location_id", event.rtd_location.toString());
    }

    if (event.rtd_location !== undefined) {
      formData.append("location_id", event.rtd_location.toString());
    }

    if (event.order_number !== undefined)
      formData.append("order_number", event.order_number);

    formData.append("status_id", event.status_label.toString());

    if (event.assigned_user !== undefined)
      formData.append("assigned_user", event.assigned_user.toString());

    if (event.purchase_cost !== undefined)
      formData.append("purchase_cost", event.purchase_cost);
    if (event.purchase_date !== undefined)
      formData.append("purchase_date", event.purchase_date);

    formData.append("supplier_id", event.supplier.toString());
    formData.append("warranty_months", event.warranty_months);
    formData.append("notes", event.notes ?? "");
    if (event.purchase_date !== undefined)
      formData.append("maintenance", event.maintenance);
    formData.append(
      "maintenance_cycle",
      event.maintenance_cycle === "0" ? "" : (event.maintenance_cycle ?? "")
    );
    if (event.image !== null && event.image !== undefined) {
      formData.append("image", event.image);
    }

    setPayload(formData);
  };

  useEffect(() => {
    if (payload) {
      mutate(
        {
          resource: HARDWARE_API,
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
          onSuccess(data, variables, context) {
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

  const findLabel = (value: number): boolean => {
    let check = false;
    statusLabelSelectProps.options?.forEach((item) => {
      if (value === item.value) {
        if (item.label === EStatus.ASSIGN) {
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
      onValuesChange={(changedValues, allValues: FormValues) => {
        if (
          "purchase_date" in changedValues ||
          "maintenance_cycle" in changedValues
        ) {
          const { purchase_date, maintenance_cycle, maintenance } = allValues;

          const isValidCycle =
            maintenance_cycle &&
            !isNaN(Number(maintenance_cycle)) &&
            Number(maintenance_cycle) > 0;

          const isValidPurchaseDate = moment(
            purchase_date,
            "YYYY-MM-DD",
            true
          ).isValid();

          const isCycleCleared =
            "maintenance_cycle" in changedValues &&
            (!maintenance_cycle || Number(maintenance_cycle) === 0);

          if (isCycleCleared && maintenance) {
            return;
          }

          if (isValidCycle && isValidPurchaseDate) {
            const nextMaintenance = moment(purchase_date)
              .add(Number(maintenance_cycle), "months")
              .format("YYYY-MM-DD");

            form.setFieldsValue({ maintenance: nextMaintenance });
          } else {
            form.setFieldsValue({ maintenance: "" });
          }
        }
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
              ({ getFieldValue, setFieldsValue }) => ({
                validator(_, value) {
                  if (value < 0) {
                    setFieldsValue({ warranty_months: 0 });
                  }
                  return Promise.resolve();
                },
              }),
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
          {messageErr?.status_label && (
            <Typography.Text type="danger">
              {messageErr.status_label}
            </Typography.Text>
          )}
          <Form.Item
            label={t("hardware.label.field.maintenance_date")}
            name="maintenance"
            rules={[
              {
                required: false,
                message:
                  t("hardware.label.field.maintenance_date") +
                  " " +
                  t("hardware.label.message.required"),
              },
              ({ getFieldValue, setFieldsValue }) => ({
                validator(_, value) {
                  if (value < 0) {
                    setFieldsValue({ maintenance: 0 });
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input
              type="date"
              placeholder={t("hardware.label.placeholder.maintenance")}
            />
          </Form.Item>
          <Form.Item
            label={t("hardware.label.field.customer")}
            name="customer"
            rules={[
              {
                required: true,
                message:
                  t("hardware.label.field.customer") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
          >
            <Select
              placeholder={t("hardware.label.field.customer")}
              options={customer?.map((customer) => ({
                label: customer.name,
                value: customer.id,
              }))}
            />
          </Form.Item>
          {messageErr?.customer && (
            <Typography.Text type="danger">
              {messageErr.customer}
            </Typography.Text>
          )}
          {isReadyToDeploy && (
            <Form.Item
              className="tabUser"
              label={t("hardware.label.field.checkoutTo")}
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
            label={t("hardware.label.field.dateAdd")}
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
              {messageErr.supplier}
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
          {messageErr?.project && (
            <Typography.Text type="danger">
              {messageErr.project}
            </Typography.Text>
          )}
          <Form.Item
            label={t("hardware.label.field.project")}
            name="project"
            rules={[
              {
                required: true,
                message:
                  t("hardware.label.field.project") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
          >
            <Select
              placeholder={t("hardware.label.field.project")}
              options={project?.map((project) => ({
                label: project.name,
                value: project.id,
              }))}
            />
          </Form.Item>
          {messageErr?.project && (
            <Typography.Text type="danger">
              {messageErr.project}
            </Typography.Text>
          )}
          <Form.Item
            label={t("hardware.label.field.isCustomerRenting")}
            name="isCustomerRenting"
            rules={[
              {
                required: true,
                message:
                  t("hardware.label.field.isCustomerRenting") +
                  " " +
                  t("hardware.label.message.required"),
              },
            ]}
          >
            <Select placeholder={t("hardware.label.field.isCustomerRenting")}>
              <Select.Option value="true">
                {t("hardware.label.field.yes")}
              </Select.Option>
              <Select.Option value="false">
                {t("hardware.label.field.no")}
              </Select.Option>
            </Select>
          </Form.Item>
          {messageErr?.isCustomerRenting && (
            <Typography.Text type="danger">
              {messageErr.isCustomerRenting}
            </Typography.Text>
          )}
          <Form.Item
            label={t("hardware.label.field.maintenance_cycle")}
            name="maintenance_cycle"
            rules={[
              {
                required: false,
                message:
                  t("hardware.label.field.maintenance_cycle") +
                  " " +
                  t("hardware.label.message.required"),
              },
              ({ getFieldValue, setFieldsValue }) => ({
                validator(_, value) {
                  if (value < 0) {
                    setFieldsValue({ maintenance_cycle: 0 });
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input
              type="number"
              addonAfter={t("hardware.label.field.months_per_time")}
              placeholder={t("hardware.label.placeholder.maintenance_cycle")}
            />
          </Form.Item>
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

      <Form.Item label={t("hardware.label.field.loading_image")} name="image">
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
