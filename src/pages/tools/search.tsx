import { useTranslate } from "@pankod/refine-core";
import { Button, Form, FormProps, Input } from "@pankod/refine-antd";

type ToolSearchProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  searchFormProps: FormProps;
};

export const ToolSearch = (props: ToolSearchProps) => {
  const { setIsModalVisible, searchFormProps } = props;
  const t = useTranslate();
  return (
    <Form
      layout="vertical"
      {...searchFormProps}
      onSubmitCapture={() => {
        setIsModalVisible(false);
      }}
    >
      <Form.Item label={t("tools.label.field.name")} name="name">
        <Input placeholder={t("tools.label.placeholder.name")} />
      </Form.Item>
      <Form.Item label={t("tools.label.field.version")} name="version">
        <Input placeholder={t("tools.label.placeholder.version")} />
      </Form.Item>
      <Form.Item
        label={t("tools.label.field.manufacturer")}
        name="manufacturer"
      >
        <Input placeholder={t("tools.label.placeholder.manufacturer")} />
      </Form.Item>
      <Form.Item label={t("tools.label.field.category")} name="category">
        <Input placeholder={t("tools.label.placeholder.category")} />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" type="primary" className="search-advanced">
          {t("tools.label.button.search")}
        </Button>
      </Form.Item>
    </Form>
  );
};
