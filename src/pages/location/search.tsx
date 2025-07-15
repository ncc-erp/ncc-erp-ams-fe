import { Button, Form, FormProps, Input } from "@pankod/refine-antd";
import { useTranslate } from "@pankod/refine-core";

type LocationSearchProps = {
   isModalVisible: boolean;
   setIsModalVisible: (data: boolean) => void;
   searchFormProps: FormProps;
};
export const LoacationSearch = (props: LocationSearchProps) => {
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
         <Form.Item label={t("location.label.field.name")} name="name">
            <Input placeholder={t("location.label.placeholder.name")} />
         </Form.Item>
         <Form.Item label={t("location.label.field.address")} name="address">
            <Input placeholder={t("location.label.placeholder.address")} />
         </Form.Item>
         <Form.Item label={t("location.label.field.address_detail")} name="address2">
            <Input placeholder={t("location.label.placeholder.address_detail")} />
         </Form.Item>
         <Form.Item label={t("location.label.field.city")} name="city">
            <Input placeholder={t("location.label.placeholder.city")} />
         </Form.Item>
         <Form.Item label={t("location.label.field.state")} name="state">
            <Input placeholder={t("location.label.placeholder.state")} />
         </Form.Item>
         <Form.Item label={t("location.label.field.country")} name="country">
            <Input placeholder={t("location.label.placeholder.country")} />
         </Form.Item>
         <Form.Item>
            <Button htmlType="submit" type="primary" className="search-advanced">
               {t("table.search")}
            </Button>
         </Form.Item>
      </Form>
   );
}; 
