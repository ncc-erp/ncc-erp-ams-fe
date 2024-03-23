/* eslint-disable react-hooks/exhaustive-deps */
import {
    Typography,
    Tabs,
} from "@pankod/refine-antd";
import {
    IResourceComponentsProps,
    useTranslate,
} from "@pankod/refine-core";
import "styles/antd.less";

import { defaultValue } from "constants/permissions";
import { DetailsAccessory } from "components/elements/detailPages/detailAccessory";
import { DetailsAsset } from "components/elements/detailPages/detailAsset";
import { DetailsTool } from "components/elements/detailPages/detailTool";
import { DetailsTaxToken } from "components/elements/detailPages/detailTaxToken";
import { DetailsConsumable } from "components/elements/detailPages/detailConsumable";
import { useSearchParams } from "react-router-dom";

export const LocationDetails: React.FC<IResourceComponentsProps> = () => {
    const translate = useTranslate();
    const { Title } = Typography;
    const { TabPane } = Tabs;
    const [searchParams] = useSearchParams();
    const location_name = searchParams.get('name');


    return (
        <>
            <Title level={3}> {translate("location.label.title.nameTitle")}: {location_name}</Title>
            <Tabs defaultActiveKey={defaultValue.active}>
                <TabPane tab={translate("location.label.title.assets")} key={defaultValue.active}>
                    <DetailsAsset id_name="rtd_location_id" />
                </TabPane>
                <TabPane tab={translate("location.label.title.tools")} key={defaultValue.inactive}>
                    <DetailsTool id_name="location_id" />
                </TabPane>
                <TabPane tab={translate("location.label.title.tax_tokens")} key="3">
                    <DetailsTaxToken id_name="location_id" />
                </TabPane>
                <TabPane tab={translate("location.label.title.accessories")} key="4">
                    <DetailsAccessory id_name="location_id" />
                </TabPane>
                <TabPane tab={translate("location.label.title.consumables")} key="5">
                    <DetailsConsumable id_name="location_id" />
                </TabPane>
            </Tabs>
        </>
    );
};
