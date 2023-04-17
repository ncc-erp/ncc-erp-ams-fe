/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslate } from "@pankod/refine-core";
import { Form, Input, Button, FormProps, useSelect, Select } from "@pankod/refine-antd";

import "react-mde/lib/styles/css/react-mde-all.css";
import { IModel } from "interfaces/model";
import { CATEGORIES_SELECT_SOFTWARE_LIST_API, MANUFACTURES_API } from "api/baseApi";

type SoftwareSearchProps = {
    isModalVisible: boolean;
    setIsModalVisible: (data: boolean) => void;
    searchFormProps: FormProps;
};

export const SoftwareSearch = (props: SoftwareSearchProps) => {
    const { setIsModalVisible, searchFormProps } = props;
    const t = useTranslate();

    const { selectProps: modelManufactureSelectProps } = useSelect<IModel>({
        resource: MANUFACTURES_API,
        optionLabel: "name",
        optionValue: "name",
        onSearch: (value) => [
            {
                field: "search",
                operator: "containss",
                value,
            },
        ],
    });
    
    const { selectProps: modelCategorySelectProps } = useSelect<IModel>({
        resource: CATEGORIES_SELECT_SOFTWARE_LIST_API,
        optionLabel: "text",
        onSearch: (value) => [
            {
                field: "search",
                operator: "containss",
                value,
            },
        ],        
    });


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
                <Select placeholder={t("software.label.placeholder.manufacturer")}
                    {...modelManufactureSelectProps}
                />
            </Form.Item>

            <Form.Item
                label={t("software.label.field.category")}
                name="category"
            >
                <Select placeholder={t("software.label.placeholder.category")}
                    {...modelCategorySelectProps}
                />
            </Form.Item>

            <Form.Item>
                <Button htmlType="submit" type="primary" className="search-advanced">
                    {t("software.label.button.search")}
                </Button>
            </Form.Item>
        </Form>
    );
};
