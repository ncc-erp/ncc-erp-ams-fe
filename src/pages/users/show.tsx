import {
    useTranslate,
} from "@pankod/refine-core";
import { Typography } from "@pankod/refine-antd";

const { Title, Text } = Typography;

type RequestShowProps = {
    setIsModalVisible: (data: boolean) => void;
    detail: any;
};

export const UserShow = (props: RequestShowProps) => {
    const { detail } = props;
    const t = useTranslate();

    return (
        <div>
            <Title level={5}>{t("hardware.label.field.nameCompany")}</Title>
            <Text>{detail?.name}</Text>
            <Title level={5}>{t("hardware.label.field.device")}</Title>
            <Text>{detail?.category?.name}</Text>
            <Title level={5}>{t("hardware.label.field.status")}</Title>
            <Text>{detail?.status_label?.name}</Text>
        </div>
    );
}