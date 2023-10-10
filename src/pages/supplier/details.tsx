/* eslint-disable react-hooks/exhaustive-deps */
import {
    Tabs,
    Typography
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
import { DetailsTool } from "components/elements/detailPages/detailTool";
import { DetailsTaxToken } from "components/elements/detailPages/detailTaxToken";
import { DetailsConsumable } from "components/elements/detailPages/detailConsumable";

export const SupplierDetails: React.FC<IResourceComponentsProps> = () => {
    const translate = useTranslate();
    const { Title } = Typography;
    const [searchParams] = useSearchParams();
    const supplier_name = searchParams.get('name');
    const { TabPane } = Tabs;

    return (
        <>
            <Title level={3}>{translate("supplier.label.title.note")} - {supplier_name}</Title>
            <Tabs defaultActiveKey={defaultValue.active}>
                <TabPane tab={translate("supplier.label.title.assets")} key={defaultValue.active}>
                    <DetailsAsset id_name="supplier_id" />
                </TabPane>
                <TabPane tab={translate("supplier.label.title.tools")} key={defaultValue.inactive}>
                    <DetailsTool id_name="supplier_id" />
                </TabPane>
                <TabPane tab={translate("supplier.label.title.tax_tokens")} key="3">
                    <DetailsTaxToken id_name="supplier_id" />
                </TabPane>
                <TabPane tab={translate("supplier.label.title.accessories")} key="4">
                    <DetailsAccessory id_name="supplier_id" />
                </TabPane>
                <TabPane tab={translate("supplier.label.title.consumables")} key="5">
                    <DetailsConsumable id_name="supplier_id" />
                </TabPane>
            </Tabs>

        </>
    );
};
