import { useState } from "react";
import { useTranslate, IResourceComponentsProps } from "@pankod/refine-core";
import {
  Create,
  Form,
  Input,
  Select,
  useSelect,
  useForm,
} from "@pankod/refine-antd";

import ReactMarkdown from "react-markdown";
import ReactMde from "react-mde";

import "react-mde/lib/styles/css/react-mde-all.css";

import { IHardwareRequest } from "interfaces/hardware";
import { IModel } from "interfaces/model";

export const HardwareCreate: React.FC<IResourceComponentsProps> = () => {
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");

  const t = useTranslate();

  const { formProps, saveButtonProps } = useForm<IHardwareRequest>();

  const { selectProps: modelSelectProps } = useSelect<IModel>({
    resource: "api/v1/models",
    optionLabel: "name"
  });
  
  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Asset Tag"
          name="asset_tag"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Serial"
          name="serial"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Model"
          name={["model", "id"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select {...modelSelectProps} />
        </Form.Item>
        
        <Form.Item
          label="Status"
          name="status_id"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            options={[
              {
                label: t("posts.fields.status.published"),
                value: "published",
              },
              {
                label: t("posts.fields.status.draft"),
                value: "draft",
              },
              {
                label: t("posts.fields.status.rejected"),
                value: "rejected",
              },
            ]}
          />
        </Form.Item>
        <Form.Item
          label={t("posts.fields.content")}
          name="content"
          rules={[
            {
              required: true,
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
      </Form>
    </Create>
  );
};
