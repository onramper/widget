import React from 'react'
import renderer from 'react-test-renderer'
import List from '../common/List'
import IconBTC from '../icons/btc.svg'
import Footer from '../common/Footer'
import Header from '../common/Header'
import InputButton from '../common/Input/InputButton'
import InputText from '../common/Input/InputText'
import ExpectedCrypto from '../BuyCryptoView/ExpectedCrypto'
import BodyBuyCrypto from '../BuyCryptoView/BodyBuyCrypto'

function testSnapshot(element: JSX.Element) {
  const component = renderer
    .create(element)
    .toJSON();
  expect(component).toMatchSnapshot();
}

const itemsListExample = [
  {
    icon: IconBTC,
    name: "BTC",
    info: "Bitcoin"
  }
];

describe("Component snapshots", () => {
  const components = new Map([
    ["Footer", <Footer />],
    ["List", <List items={itemsListExample} />],
    ["Header", <Header title="Buy crypto" />],
    ["Header with backbutton", <Header title="Buy crypto" backButton={true} />],
    ["BodyBuyCrypto", <BodyBuyCrypto onBuyCrypto={() => null} handleInputChange={() => null} openPickCrypto={() => null} openPickCurrency={() => null} openPickPayment={() => null} selectedCrypto={itemsListExample[0]} selectedCurrency={itemsListExample[0]} selectedPaymentMethod={itemsListExample[0]} />],
    ["ExpectedCrypto", <ExpectedCrypto denom="BTC" isLoading={false} />],
    ["InputButton", <InputButton label="Label" selectedOption={itemsListExample[0].name} icon={itemsListExample[0].icon} />],
    ["InputText", <InputText name='example' label="Label" />],
  ]);

  for (const [name, elem] of components) {
    test(`${name} snapshot`,
      () => testSnapshot(elem)
    )
  }
});
