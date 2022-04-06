import renderer from "react-test-renderer";
import { AssetsSummaryPieChart } from "..";
import { assetsSummaryPieChart } from "../../../../../__mock__";

test("Test AssetsSummaryPieChart component", () => {
  const component = renderer.create(
    <AssetsSummaryPieChart {...assetsSummaryPieChart}></AssetsSummaryPieChart>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
