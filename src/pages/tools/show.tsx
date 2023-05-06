import { useTranslate } from "@pankod/refine-core";
import { Typography, Tag, Row, Col } from "@pankod/refine-antd";
import "styles/hardware.less";
import { IToolResponse } from "interfaces/tool";
const { Title, Text } = Typography;

type ToolShowProps = {
    setIsModalVisible: (data: boolean) => void;
    detail: IToolResponse | undefined;
};

export const ToolShow = (props: ToolShowProps) => {
    const { detail } = props;
    const t = useTranslate();
    return (
        <>
            <Row gutter={16}>
                <Col className="gutter-row" span={4}>
                    <Title level={5}>{t("tools.label.field.name")}</Title>
                </Col>
                <Col>
                    <Text>{detail && detail?.name}</Text>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col className="gutter-row" span={4}>
                    <Title level={5}>{t("tools.label.field.purchase_cost")}</Title>
                </Col>
                <Col span={18}>
                    <Text>{detail && detail?.purchase_cost}</Text>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col className="gutter-row" span={4}>
                    <Title level={5}>{t("tools.label.field.version")}</Title>
                </Col>
                <Col span={18}>
                    <Text className="show-asset">{detail && detail?.version}</Text>
                </Col>
            </Row>
            {detail && detail.checkout_count && (
                <Row gutter={16}>
                    <Col className="gutter-row" span={4}>
                        <Title level={5}>{t("tools.label.field.checkout_count")}</Title>
                    </Col>
                    <Col span={18}>
                        <Text> {detail && detail?.checkout_count} </Text>
                    </Col>
                </Row>
            )}
            {detail && detail.assigned_to && (
                <Row gutter={16}>
                    <Col className="gutter-row" span={4}>
                        <Title level={5}>{t("tools.label.field.assigned_to")}</Title>
                    </Col>
                    <Col span={18}>
                        <Text> {detail && detail?.assigned_to.name} </Text>
                    </Col>
                </Row>
            )}
            <Row gutter={16}>
                <Col className="gutter-row" span={4}>
                    <Title level={5}>{t("tools.label.field.manufacturer")}</Title>
                </Col>
                <Col span={18}>
                    <Text className="show-asset">
                        {detail && detail?.manufacturer.name}
                    </Text>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col className="gutter-row" span={4}>
                    <Title level={5}>{t("tools.label.field.category")}</Title>
                </Col>
                <Col span={18}>
                    <Text className="show-asset">
                        {detail && detail?.category.name}
                    </Text>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col className="gutter-row" span={4}>
                    <Title level={5}>{t("tools.label.field.notes")}</Title>
                </Col>
                <Col span={18}>
                    <Text>{detail && detail?.notes}</Text>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col className="gutter-row" span={4}>
                    <Title level={5}>{t("tools.label.field.purchase_date")}</Title>
                </Col>
                <Col span={18}>
                    <Text>
                        {detail && detail?.purchase_date.formatted}
                    </Text>
                </Col>
            </Row>
            {detail && detail.checkout_at && (
                <Row gutter={16}>
                    <Col className="gutter-row" span={4}>
                        <Title level={5}>{t("tools.label.field.checkout_at")}</Title>
                    </Col>
                    <Col span={18}>
                        <Text> {detail && detail?.checkout_at.formatted} </Text>
                    </Col>
                </Row>
            )}
            <Row gutter={16}>
                <Col className="gutter-row" span={4}>
                    <Title level={5}>{t("tools.label.title.dateCreate")}</Title>
                </Col>
                <Col span={18}>
                    {detail?.created_at ? (
                        <Text> {detail?.created_at && detail?.created_at.formatted}</Text>
                    ) : (
                        ""
                    )}
                </Col>
            </Row>
            <Row gutter={16}>
                <Col className="gutter-row" span={4}>
                    <Title level={5}>{t("tools.label.title.updateAt")}</Title>
                </Col>
                <Col span={18}>
                    {detail?.updated_at ? (
                        <Text> {detail?.updated_at && detail?.updated_at.formatted}</Text>
                    ) : (
                        ""
                    )}
                </Col>
            </Row>
        </>
    );
};
