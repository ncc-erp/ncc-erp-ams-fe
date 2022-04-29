import { useEffect, useState } from "react";
import {
  useTranslate,
  IResourceComponentsProps,
  useCustom,
  useList,
  useCreate,
} from "@pankod/refine-core";
import {
  Form,
  Input,
  Select,
  useForm,
  Row,
  Col,
  Button,
} from "@pankod/refine-antd";

import ReactMarkdown from "react-markdown";
import ReactMde from "react-mde";

import "react-mde/lib/styles/css/react-mde-all.css";

import { IHardwareRequest } from "interfaces/hardware";
import { TreeSelectComponent } from "components/request/treeSelect";
import { ListAssetNotRequest } from "components/request/listAssetNotRequested";

type RequestCreateProps = {
  setIsModalVisible: (data: boolean) => void;
};

export const RequestCreate = (props: RequestCreateProps) => {
  const { setIsModalVisible } = props;
  const [entryId, setEntryId] = useState<number>();
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
  const [selectedItems, setSelectedItem] = useState();
  const [selectedAssets, setSelectedAssets] = useState([]);

  const t = useTranslate();

  const { formProps, form } = useForm<IHardwareRequest>({
    action: "create",
  });

  const { data: branchSelectProps } = useList<any>({
    resource: "api/v1/finfast/branch",
  });

  const { data: supplierSelectProps } = useList<any>({
    resource: "api/v1/finfast/supplier",
  });

  const { data: assetSelecProps, refetch } = useCustom<any>({
    url: "api/v1/hardware",
    method: "get",
    config: {
      filters: [
        {
          field: "notRequest",
          operator: "nnull",
          value: 1,
        },
      ],
    },
  });

  const { mutate, data, isLoading } = useCreate();

  const onFinish = (event: any) => {
    mutate({
      resource: "api/v1/finfast-request",
      values: {
        name: event.name,
        branch_id: event.branch_id,
        supplier_id: event.supplier_id,
        entry_id: entryId,
        note: event.note,
        asset_ids: JSON.stringify(event.asset_ids),
      },
    });
  };

  useEffect(() => {
    if (data?.data.status === "success") {
      form.resetFields();
      setIsModalVisible(false);
      setSelectedAssets([]);
      refetch();
    }
  }, [data]);


  const handleChange = (selectedItems: any) => {
    const array = assetSelecProps?.data?.rows;

    const assets_choose = selectedItems.map((item: number) => {
      let arrayItem: any = {};
      arrayItem.asset = array.filter((x: { id: number; }) => x.id === item)[0];
      return  arrayItem;
    })
    setSelectedAssets(assets_choose);
    setSelectedItem(selectedItems);
  };

  useEffect(() => {
    form.setFieldsValue({ entry_id: entryId });
  }, [entryId, form]);

  return (
    <Row gutter={16}>
      <Col span={24}>
        <Form
          {...formProps}
          layout="vertical"
          onFinish={(event) => {
            onFinish(event);
          }}
        >
          <Form.Item
            label={t("request.label.field.name")}
            name="name"
            rules={[
              {
                required: true,
                message:
                  t("request.label.field.name") +
                  " " +
                  t("request.label.message.required"),
              },
            ]}
          >
            <Input placeholder={t("request.label.placeholder.name")} />
          </Form.Item>

          <Form.Item
            label={t("request.label.field.branch")}
            name="branch_id"
            rules={[
              {
                required: true,
                message:
                  t("request.label.field.branch") +
                  " " +
                  t("request.label.message.required"),
              },
            ]}
          >
            <Select
              showSearch
              placeholder={t("request.label.placeholder.name")}
              optionFilterProp="children"
              filterOption={(input, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA, optionB) =>
                optionA.children
                  .toLowerCase()
                  .localeCompare(optionB.children.toLowerCase())
              }
            >
              {branchSelectProps?.data.map((item) => (
                <Select.Option value={item.id}>{item.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={t("request.label.field.supplier")}
            name="supplier_id"
            rules={[
              {
                required: true,
                message:
                  t("request.label.field.supplier") +
                  " " +
                  t("request.label.message.required"),
              },
            ]}
          >
            <Select
              showSearch
              placeholder={t("request.label.placeholder.supplier")}
              optionFilterProp="children"
              filterOption={(input, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA, optionB) =>
                optionA.children
                  .toLowerCase()
                  .localeCompare(optionB.children.toLowerCase())
              }
            >
              {supplierSelectProps?.data.map((item) => (
                <Select.Option value={item.id}>{item.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label={t("request.label.field.asset_ids")}
            name="asset_ids"
            rules={[
              {
                required: true,
                message:
                  t("request.label.field.asset_ids") +
                  " " +
                  t("request.label.message.required"),
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder={t("request.label.placeholder.asset_ids")}
              value={selectedItems}
              onChange={handleChange}
              style={{ width: "100%" }}
              optionFilterProp="children"
              filterOption={(input, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA, optionB) =>
                optionA.children
                  .toLowerCase()
                  .localeCompare(optionB.children.toLowerCase())
              }
            >
              {assetSelecProps?.data?.rows?.map((item: any) => (
                <Select.Option value={item.id}>{item.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

         {selectedAssets.length > 0 && <ListAssetNotRequest assetData={selectedAssets} />} 

          <Form.Item
            label={t("request.label.field.entry")}
            name="entry_id"
            rules={[
              {
                required: true,
                message:
                  t("request.label.field.entry") +
                  " " +
                  t("request.label.message.required"),
              },
            ]}
          >
            <TreeSelectComponent setEntryId={setEntryId} />
          </Form.Item>

          <Form.Item
            label={t("request.label.field.note")}
            name="note"
            rules={[
              {
                required: true,
                message:
                  t("request.label.field.note") +
                  " " +
                  t("request.label.message.required"),
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

          <Button type="primary" htmlType="submit" loading={isLoading}>
            Submit
          </Button>
        </Form>
      </Col>
    </Row>
  );
};
