import { useTranslate } from "@pankod/refine-core";
import { Form, Input, Button, FormProps } from "@pankod/refine-antd";
import "react-mde/lib/styles/css/react-mde-all.css";

type TaxTokenSearchProps = {
  isModalVisible: boolean;
  setIsModalVisible: (data: boolean) => void;
  searchFormProps: FormProps;
};

export const TaxTokenSearch = (props: TaxTokenSearchProps) => {
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
      <Form.Item label={t("tax_token.label.field.name")} name="name">
        <Input placeholder={t("tax_token.label.placeholder.name")} />
      </Form.Item>
      <Form.Item label={t("tax_token.label.field.seri")} name="seri">
        <Input placeholder={t("tax_token.label.placeholder.seri")} />
      </Form.Item>
      <Form.Item label={t("tax_token.label.field.supplier")} name="supplier">
        <Input placeholder={t("tax_token.label.placeholder.supplier")} />
      </Form.Item>
      <Form.Item label={t("tax_token.label.field.note")} name="note">
        <Input placeholder={t("tax_token.label.placeholder.note")} />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" type="primary" className="search-advanced">
          {t("tax_token.label.button.search")}
        </Button>
      </Form.Item>
    </Form>
  );
};
