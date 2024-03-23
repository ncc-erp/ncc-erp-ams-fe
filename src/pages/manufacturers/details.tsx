/* eslint-disable react-hooks/exhaustive-deps */
import {
    Tabs,
    Typography,
} from "@pankod/refine-antd";
import {
    IResourceComponentsProps,
    useTranslate,
} from "@pankod/refine-core";
import { useSearchParams } from "react-router-dom";
import "styles/antd.less";
import { defaultValue } from "constants/permissions";
import { DetailsAccessory } from "components/elements/detailPages/detailAccessory";
import { DetailsAsset } from "components/elements/detailPages/detailAsset";
import { DetailsConsumable } from "components/elements/detailPages/detailConsumable";

export const ManufacturesDetails: React.FC<IResourceComponentsProps> = () => {
    const translate = useTranslate();
    const { Title } = Typography;
    const [searchParams] = useSearchParams();
    const manufactures_name = searchParams.get('name');
    const { TabPane } = Tabs;

    return (
        <>
            <Title level={3}>{translate("manufactures.label.title.nameTitle")}: {manufactures_name}</Title>
            <Tabs defaultActiveKey={defaultValue.active}>
                <TabPane tab={translate("manufactures.label.title.asset")} key={defaultValue.active}>
                    <DetailsAsset id_name="manufacturer_id" />
                </TabPane>
                <TabPane tab={translate("manufactures.label.title.accessories")} key={defaultValue.inactive}>
                    <DetailsAccessory id_name="manufacturer_id" />
                </TabPane>
                <TabPane tab={translate("manufactures.label.title.consumables")} key="3">
                    <DetailsConsumable id_name="manufacturer_id" />
                </TabPane>
            </Tabs>

        </>
    );
};
