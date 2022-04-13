import renderer from 'react-test-renderer';
import { AssetsSummaryTable } from '..';
import { assetsSummaryTable } from "../../../../../__mock__";

test('Test AssetsSummaryTable component', () => {
  const component = renderer.create(
    <AssetsSummaryTable {...assetsSummaryTable}></AssetsSummaryTable>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});