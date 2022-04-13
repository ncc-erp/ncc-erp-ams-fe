import { useState } from "react";
import {
  useTranslate,
  IResourceComponentsProps,
  useCustom,
} from "@pankod/refine-core";
import {
  Form,
  Input,
  Select,
  useSelect,
  useForm,
  Row,
  Col,
  Button,
} from "@pankod/refine-antd";

import ReactMarkdown from "react-markdown";
import ReactMde from "react-mde";

import "react-mde/lib/styles/css/react-mde-all.css";

import { IHardwareRequest } from "interfaces/hardware";
import { ICompany } from "interfaces/Company";
import { IBranch } from "interfaces/Branch";
import { TreeSelectComponent } from "components/request/treeSelect";
import { ListAssetNotRequest } from "components/request/listAssetNotRequested";
import { HardwareCreate } from "pages/hardware";

export const RequestCreate: React.FC<IResourceComponentsProps> = () => {
  const [entryId, setEntryId] = useState<number>();
  const [assetIds, setAssetIds] = useState<number[]>([]);
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
  const [payload, setPayload] = useState<object>({});

  const t = useTranslate();

  const { formProps } = useForm<IHardwareRequest>(
    {
      action: "create",
    }
  );

  const { selectProps: branchSelectProps } = useSelect<IBranch>({
    resource: "api/v1/finfast/branch",
    optionLabel: "name",
  });

  const { selectProps: supplierSelectProps } = useSelect<ICompany>({
    resource: "api/v1/finfast/supplier",
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

  const onFinish =  (event: any) => {
   
     setPayload({
      name: event.name,
      branch_id: event.branch_id,
      supplier_id: event.supplier_id,
      entry_id: entryId,
      note: event.note,
      asset_ids: JSON.stringify(assetIds),
    });
   
    refetch();
  };

  return (
    <Row gutter={16}>
      <Col span={12}>
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
                message: t("request.label.field.name") + " " + t("request.label.message.required") 
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
                message: t("request.label.field.branch") + " " + t("request.label.message.required")
              },
            ]}
          >
            <Select placeholder={t("request.label.placeholder.name")} {...branchSelectProps} />
          </Form.Item>

          <Form.Item
            label={t("request.label.field.supplier")}
            name="supplier_id"
            rules={[
              {
                required: true,
                message: t("request.label.field.supplier") + " " + t("request.label.message.required")
              },
            ]}
          >
            <Select
              placeholder={t("request.label.placeholder.supplier")}
              {...supplierSelectProps}
            />
          </Form.Item>

          <Form.Item
            label={t("request.label.field.entry")}
            name="entry_id"
            rules={[
              {
                required: true,
                message: t("request.label.field.entry") + " " + t("request.label.message.required")
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
                message: t("request.label.field.note") + " " + t("request.label.message.required")
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
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </Col>
      <Col span={12}>
        <ListAssetNotRequest setAssetIds={setAssetIds} />
      </Col>
    </Row>
  );
};
