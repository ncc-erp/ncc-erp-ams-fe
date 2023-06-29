import { useTranslate } from "@pankod/refine-core";
import { Button, Form, FormProps, Input } from "@pankod/refine-antd";

type LicensesSearchProps = {
    isModalVisible: boolean;
    setIsModalVisible: (data: boolean) => void;
    searchFormProps: FormProps;
};

export const LicensesSearch = (props: LicensesSearchProps) => {
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
            <Form.Item label={t("licenses.label.field.licenses")}
                name="licenses">
                <Input placeholder={t("licenses.label.placeholder.licenses")} />
            </Form.Item>
            <Form.Item
                label={t("licenses.label.field.purchase_cost")}
                name="purchase_cost"
            >
                <Input type="number" placeholder={t("licenses.label.placeholder.purchase_cost")} />
            </Form.Item>
            <Form.Item>
                <Button htmlType="submit" type="primary" className="search-advanced">
                    {t("licenses.label.button.search")}
                </Button>
            </Form.Item>
        </Form>
    )
}
