/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslate } from "@pankod/refine-core";
import {
    Form,
    Input,
    Button,
    FormProps
} from "@pankod/refine-antd";

import "react-mde/lib/styles/css/react-mde-all.css";
import "../../styles/hardware.less";

type HardWareSearchProps = {
    isModalVisible: boolean;
    setIsModalVisible: (data: boolean) => void;
    searchFormProps: FormProps;
};

export const HardwareSearch = (props: HardWareSearchProps) => {
    const { setIsModalVisible, searchFormProps } = props;
    const t = useTranslate();

    return (
        <Form
            layout="vertical"
            {...searchFormProps}
            onSubmitCapture={() => { setIsModalVisible(false); }}
        >
            <Form.Item
                label={t("hardware.label.field.assetName")}
                name="name"
            >
                <Input placeholder={t("hardware.label.placeholder.assetName")} />
            </Form.Item>

            <Form.Item
                label={t("hardware.label.field.propertyCard")}
                name="asset_tag"
            >
                <Input placeholder={t("hardware.label.placeholder.propertyCard")} />
            </Form.Item>

            <Form.Item
                label={t("hardware.label.field.serial")}
                name="serial"
            >
                <Input placeholder={t("hardware.label.placeholder.serial")} />
            </Form.Item>
            <Form.Item
                label={t("hardware.label.field.propertyType")}
                name="model"
            >
                <Input placeholder={t("hardware.label.placeholder.propertyType")} />
            </Form.Item>

            <Form.Item>
                <Button htmlType="submit" type="primary">
                    {t("hardware.label.button.search")}
                </Button>
            </Form.Item>
        </Form>
    );
};

