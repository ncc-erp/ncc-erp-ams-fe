import { useTranslate } from "@pankod/refine-core";
import { Form, Input, Button, FormProps } from "@pankod/refine-antd";
import "react-mde/lib/styles/css/react-mde-all.css";

type SoftwareSearchProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  searchFormProps: FormProps;
};

export const SoftwareSearch = (props: SoftwareSearchProps) => {
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
      <Form.Item label={t("software.label.field.softwareName")} name="name">
        <Input placeholder={t("software.label.placeholder.softwareName")} />
      </Form.Item>
      <Form.Item
        label={t("software.label.field.software_tag")}
        name="software_tag"
      >
        <Input placeholder={t("software.label.placeholder.software_tag")} />
      </Form.Item>
      <Form.Item
        label={t("software.label.field.manufacturer")}
        name="manufacturer"
      >
        <Input placeholder={t("software.label.placeholder.manufacturer")} />
      </Form.Item>
      <Form.Item label={t("software.label.field.category")} name="category">
        <Input placeholder={t("software.label.placeholder.category")} />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" type="primary" className="search-advanced">
          {t("software.label.button.search")}
        </Button>
      </Form.Item>
    </Form>
  );
};
