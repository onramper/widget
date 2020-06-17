import React from 'react'
import renderer from 'react-test-renderer'
import List from './List'
import IconBTC from '../icons/btc.svg'
import IconUSD from '../icons/usd.svg'
import Footer from '../common/Footer'
import Header from '../common/Header'
import InputButton from './InputButton'
import InputText from './InputText'
import ExpectedCrypto from './ExpectedCrypto'
import SelectCrypto from './SelectCrypto'

function testSnapshot(element: JSX.Element) {
  const component = renderer
    .create(element)
    .toJSON();
  expect(component).toMatchSnapshot();
}

const availableCryptos = [
  {
    icon: IconBTC,
    name: "BTC",
    info: "Bitcoin"
  },
  {
    icon: IconUSD,
    name: "USD",
    info: "US Dollar"
  },
];

describe("Component snapshots", () => {
  const components = new Map([
    ["Footer", <Footer />],
    ["List", <List items={availableCryptos} />],
    ["Header", <Header title="Buy crypto" />],
    ["Header with backbutton", <Header title="Buy crypto" backButton={true} />],
    ["SelectCrypto", <SelectCrypto />],
    ["ExpectedCrypto", <ExpectedCrypto amount={1.2} denom="BTC" />],
    ["InputButton", <InputButton selectedOption="Credit card" />],
    ["InputText", <InputText />],
  ]);

  for (const [name, elem] of components) {
    test(`${name} snapshot`,
      () => testSnapshot(elem)
    )
  }
});
