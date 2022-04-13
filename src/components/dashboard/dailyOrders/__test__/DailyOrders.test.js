import renderer from 'react-test-renderer';
import { DailyOrders } from '../';

test('Test DailyOrders component', () => {
  const component = renderer.create(
    <DailyOrders></DailyOrders>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});