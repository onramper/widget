# Onramper widget

###### Installation

```shell
# Using yarn
$ yarn add @onramper/widget

# Using npm
$ npm install @onramper/widget
```

###### Code snippet
```javascript
import OnramperWidget from "@onramper/widget";

const userAddresses = {
    "BTC": ["addr1"],
    "ETH": ["add1r","addr2"]
}

export default function OnramperWidgetContainer() {
  return (
    <div style={{maxWidth: '440px',  maxHeight: '595px',  height: '100%',  width: '100%'}}>
      <OnramperWidget defaultAddrs={userAddresses} />
    </div>
  )
}
```
###### Live example & customization
While importing the widget as a React component, you can customize it using the component props below. 
<a href="https://widget.onramper.dev" target='_blank' >CodeSandbox (soon)</a>

#### Component props
| Name           | Type      | Example                              | Default value |
| -------------- | --------- | ------------------------------------ | ------------- |
| defaultCrypto  | String?   | `"ETH"`                              | undefined     |
| defaultAmount  | Number?   | `500`                                | 100           |
| defaultAddrs   | Object?   | `{"BTC":["ADDR1"], "ETH":["ADDR2"]}` | {}            |
| onlyCryptos    | String[]? | `["BTC", "ETH", "NEO"]`              | undefined     |
| excludeCryptos | String[]? | `["ETH", "NEO"]`                     | undefined     |
| color          | String?   | `"#000000"`                          | "#31a5ff"     |

## Customize
You can pass the following arguments to customize the widget

| Parameter      | Description    |
| -------------- | -------------- |
| defaultCrypto  | Select a specific cryptocurrency by default. Should be specified the cryptocurrency code. |
| defaultAmount  | Positive integer representing the base amount of fiat to be filled in the widget. Should be indicated in USD, for other currencies, a rounded aproximated conversion will be automatically applied.|
| addresses      | A stringified JSON with the wallet addresses of the user. The keys should be the cryptocurrency code and the value a list containing the user addresses. Can be more than one address per wallet and more than one cryptocurrency. |
| onlyCryptos    | A comma-separated list of crypto codes to include. Only this cryptos will be shown to the user.|
| excludeCryptos | A comma-separated list of crypto codes to exclude. This cryptos will be excluded from the list of available cryptos..|
| color          | Color to change the highlight of the widget. Should be an hex color.|
