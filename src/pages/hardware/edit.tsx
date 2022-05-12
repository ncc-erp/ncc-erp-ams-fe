import { useEffect, useState } from "react";
import { useCustom, useTranslate, useUpdate } from "@pankod/refine-core";
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
  IHardwareResponses,
} from "interfaces/hardware";
import { IModel } from "interfaces/model";
import { UploadImage } from "components/elements/uploadImage";
import { ICompany } from "interfaces/company";
import { parse } from "path";

type HardwareEditProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  data: IHardwareResponseConvert;
};

export const HardwareEdit = (props: HardwareEditProps) => {
  const { setIsModalVisible, data, isModalVisible } = props;

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

  const { selectProps: supplierSelectProps, queryResult } = useSelect<ICompany>({
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

  // queryResult.refetch();
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

  useEffect(() => {
    if (updateData !== undefined) {
      queryResult.refetch();
    }
  }, [updateData])
  console.log("check:", updateData)

  const onFinish = (event: IHardwareResponses) => {
    setMessageErr(null);
    const formData = new FormData();
    formData.append("name", event.name);
    formData.append("serial", event.serial);
    formData.append("company_id", event.company.value);
    formData.append("model_id", event.model.toString());

    formData.append("notes", event.notes);
    formData.append("asset_tag", event.asset_tag);

    // formData.append("user_id", event.user_id);
    // formData.append("archived", event.archived);
    // if (event.physical !== null) formData.append("physical", event.physical);

    if (event.status_label.value !== undefined) { formData.append("status_id", event.status_label.value) };
    formData.append("warranty_months", event.warranty_months.toString());

    formData.append("purchase_cost", event.purchase_cost.toString());
    formData.append("purchase_date", event.purchase_date);

    // formData.append("supplier_id", event.supplier.toString());
    // formData.append("rtd_location_id", event.rtd_location.toString());
    if (event.rtd_location !== null) { formData.append("rtd_location_id", event.rtd_location.toString()) };
    if (event.supplier !== null) { formData.append("supplier_id", event.supplier.toString()) };

    // if (event.requestable !== null) { formData.append("requestable", event.requestable.toString()) };
    if (event.image !== null) { formData.append("image", event.image) };

    formData.append("_method", "PATCH");

    setPayload(formData);
  };

  useEffect(() => {
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

      // { name: "assigned_to", value: data.assigned_to },
      // { name: "location_id", value: data?.location.value },
      // { name: "requestable", value: data?.requestable },
      { name: "image", value: data.image },
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

  // const demo = (data: string | undefined) => {
  //   console.log(data);
  //   return data;
  // };

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
              //defaultValue={data?.company}
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
            <Input
              // defaultValue={data?.asset_tag} 
              value={data?.asset_tag} />
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
            <Input
              // defaultValue={data?.serial} 
              value={data?.serial} />
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
            initialValue={data?.model}
          >
            <Select
              placeholder={t("hardware.label.placeholder.propertyType")}
              {...modelSelectProps}
              defaultValue={data?.model}
              value={data?.model}
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
            initialValue={data?.rtd_location}
          >
            <Select
              placeholder={t("hardware.label.placeholder.location")}
              {...locationSelectProps}
              // defaultValue={data?.rtd_location}
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
              // defaultValue={data?.status_label}
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
            <Input
              type="date"
              // defaultValue={data?.purchase_date}
              value={data?.purchase_date}
            />
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
              // defaultValue={data?.supplier}
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
            <Input
              // defaultValue={data?.order_number}
              value={data?.order_number}
            />
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
            <Input addonAfter={t("hardware.label.field.usd")}
              // defaultValue={data?.purchase_cost}
              value={data?.purchase_cost} />
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
            initialValue={data?.warranty_months.split(" ")[0]}
          >
            <Input
              addonAfter={t("hardware.label.field.month")}
              // defaultValue={data?.warranty_months}
              value={data?.warranty_months}
            />
          </Form.Item>
          {messageErr?.warranty_months && (
            <Typography.Text type="danger">
              {messageErr.warranty_months[0]}
            </Typography.Text>
          )}
        </Col>
      </Row>

      {/* {isReadyToDeploy && (
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
          initialValue={data?.assigned_to}
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
          initialValue={data?.physical}
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
          initialValue={data?.location}
        >
          <Select
            placeholder={t("hardware.label.placeholder.location")}
            {...locationSelectProps}
            // defaultValue={data.location}
            value={data.location}
          />
        </Form.Item>
      )} */}

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
        <Input.TextArea
          // defaultValue={data?.notes} 
          value={data?.notes} />
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
