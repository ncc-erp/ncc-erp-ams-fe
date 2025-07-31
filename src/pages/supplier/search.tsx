import { Button, Form, FormProps, Input } from "@pankod/refine-antd";
import { useTranslate } from "@pankod/refine-core";

type SupplierSearchProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  searchFormProps: FormProps;
};
export const SupplierSearch = (props: SupplierSearchProps) => {
  const { setIsModalVisible, searchFormProps } = props;
  const t = useTranslate();

  return (
    <Form
      {...searchFormProps}
      layout="vertical"
      onSubmitCapture={() => {
        setIsModalVisible(false);
      }}
    >
      <Form.Item label={t("supplier.label.field.name")} name="name">
        <Input placeholder={t("supplier.label.placeholder.name")} />
      </Form.Item>
      <Form.Item label={t("supplier.label.field.address")} name="address">
        <Input placeholder={t("supplier.label.placeholder.address")} />
      </Form.Item>
      <Form.Item label={t("supplier.label.field.phone")} name="phone">
        <Input placeholder={t("supplier.label.placeholder.phone")} />
      </Form.Item>
      <Form.Item label={t("supplier.label.field.email")} name="email">
        <Input placeholder={t("supplier.label.placeholder.email")} />
      </Form.Item>
      <Form.Item label={t("supplier.label.field.contact")} name="contact">
        <Input placeholder={t("supplier.label.placeholder.contact")} />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" type="primary" className="search-advanced">
          {t("supplier.label.button.search")}
        </Button>
      </Form.Item>
    </Form>
  );
};
