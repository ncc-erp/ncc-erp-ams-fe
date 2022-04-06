import renderer from "react-test-renderer";
import { Locations } from "..";
import { assetsSummaryTable } from "../../../../__mock__";

test("Test Locations component", () => {
  const component = renderer.create(
    <Locations
      location={{
        id: 1,
        name: "HN1",
        assets_count: 6,
        categories: assetsSummaryTable.categories,
      }}
    ></Locations>
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
