import React from 'react'
import renderer from 'react-test-renderer'
import List from '../PickView/List'
import IconBTC from '../icons/btc.svg'
import IconUSD from '../icons/usd.svg'
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
    ["BodyBuyCrypto", <BodyBuyCrypto onBuyCrypto={() => null} handleInputChange={() => null} openPickCrypto={() => null} openPickCurrency={() => null} openPickPayment={() => null} selectedCrypto={itemsListExample[0]} selectedCurrency={itemsListExample[0]} selectedPaymentMethod={itemsListExample[0]} expectedAmount={100} amountValue={100} />],
    ["ExpectedCrypto", <ExpectedCrypto amount={1.2} denom="BTC" />],
    ["InputButton", <InputButton selectedOption="Credit card" />],
    ["InputText", <InputText name='example' />],
  ]);

  for (const [name, elem] of components) {
    test(`${name} snapshot`,
      () => testSnapshot(elem)
    )
  }
});
