# Onramper

[Instructions of how to integrate the widget in your website here.]('https://docs.onramper.dev/widget/')

This project is created using create-react-app with typescript, here you will find some notes about how to customize or build the widget from the source files. In this repo you will find the source files of Onramper's buy page (`https://widget.onramper.com`) and the source files of the widget component (`https://npm.org/package/@onramper/widget`)

Directory structure (only main files listed):  

```
.
├── dist # generated after build
├── ...
├── src
│   ├── OnramperWidget
│   ├── ...
│   ├── App.tsx
│   ├── index.css
│   └── index.tsx 
├── ...
├── component.tsconfig.json
├── package.json
├── tsconfig.json
├── webpack.config.js
└── index.html
```

| File / folder                                             | Description                                                                   |
| --------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `./src/OnramperWidget`                                    | Source files of the widget component. [See more](#onramperwidget).            |
| `./component.tsconfig.json`<br>`./webpack.config.js`      | Config files used to transpile and bundle the widget component.               |
| `./src/App.tsx`<br>`./src/index.css`<br>`./src/index.tsx` | Buy page files.                                                               |
| `./dist`                                                  | Bundled component.                                                            |
| `./tsconfig.json`                                         | Typescript configuration file used by `react-scripts` app.                    |
| `./package.json`                                          | Describes scripts for develop, test and build the component and the buy page. |

## Setup
Install dependencies:
```shell
npm install
```

## Developement
Start a developement server:
```
npm start
```

## Build
Build the buy page as an static site into the `./build` folder:

```shell
npm run build
```

Build the widget component source files into the `./dist` folder:

```shell
npm run build:component
```

## OnramperWidget
Directory structure (only main files listed):  

```
OnramperWidget
├── NavContext
├── ApiContext
│   ├── ...
│   └── api 
├── ...
├── steps
│   ├── ...
│   └── Step 
└── index.tsx
```

| File / folder      | Description                                                                                                                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `./NavContext`     | Navigation context. Manages the screens stack and the transitions. Exposes functions to navigate between screens. [See more](#navcontext).                        |
| `./ApiContext`     | Api context. Manages the state of the app and the API calls. Exposes functions to make requests to the api and manage the general state. [See more](#apicontext). |
| `./ApiContext/api` | Module that handles the [API](API-Reference.md) calls.                                                                                                            |
| `./steps/Step`     | General step component. Used to redirect and display the correct screen according to the next step received from the API.                                         |
| `./steps`          | This folder contains the diferent step screens.                                                                                                                   |
| `./index.tsx`      | Exports the widget component.                                                                                                                                     |

#### NavContext
The navigation context manages the screens stack and transitions and exposes functions to navigate between screens. Learn about contexts in React [here](https://reactjs.org/docs/context.html).

Exports `NavContext`, `NavProvider` and `NavContainer`.

`NavProvider`: Navigation provider. Wraps the components that will consume the context.
`NavContainer`: Container of the screens. The component that will be used as main screen should be passed as prop to this component. [See implementation here](https://docs.onramper.dev/widget/#react-component).  
`NavContext`: Navigation context. Used to consume the context.

Functions availables to consume:  

| Function                                 | Description                                               |
| ---------------------------------------- | --------------------------------------------------------- |
| `nextScreen(screen: React.ReactNode)`    | Adds `screen` to the top of the screens stack.            |
| `backScreen()`                           | Removes the top screen of the stack.                      |
| `onlyScreen(screen: React.ReactNode)`    | Removes all screens and after adds `screen` to the stack. |
| `replaceScreen(screen: React.ReactNode)` | Replaces the top screen of the stack by `screen`.         |

#### ApiContext
The api context manages the state of the widget and the API responses. Exposes functions and variables to manage the general state of the widget and to interact with the [api](API-Reference.md). To learn about the api execution flow, [click here](API.md#purchase-fow). 
Learn more about contexts [here](https://reactjs.org/docs/context.html).

Consuming `ApiContext` you can access to 4 objects: `collected`, `apiInterface`, `data`, `inputInterface`.

###### inputInterface
Provides functions to update and collect variables.

| Function                                                   | Description                                                                        |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| inputInterface.handleInputChange(name: string, value: any) | Function used to update and add variables to the [`collected` object](#collected). |

###### collected
Object that stores all input variables. New variables can be added and/or updated using the [`inputInterface`](#inputinterface). Below are shown only some of the parameters availables in the object, [see declaration for all initial attributes](./ApiContext/initialState.ts) .

| Variable                                                                                                                            | Description                                                                                                                                                                                                                      |
| ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| amount `number`                                                                                                                     | Amount user wants to buy.                                                                                                                                                                                                        |
| amountInCrypto `boolean`                                                                                                            | `true` if the amount is in crypto, `false` if the amount is in fiat.                                                                                                                                                             |
| selectedCrypto `ItemType`<br>selectedCurrency `ItemType`<br>selectedPaymentMethod `ItemType`<br>selectedGateway `GatewayRateOption` | Stores the respective selected items. The `selectedCrypto`, `selectedCurrency` and the `selectedPaymentMethod` attributes can be updated if [`apiInterface.init`](#apiinterface) is called or one of this attributes is changed. |
| errors `error object`                                                                                                               | Errrors found trying to get the gateways or the rates.                                                                                                                                                                           |

`error object`

```javascript
{
    [name]: {
        type: string,
        message: string
    },
    ...
}
```

| name     | type        | Error description                                                                                                                                                                                                                    |
| -------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| GATEWAYS | API         | Failed request to the api.                                                                                                                                                                                                           |
| GATEWAYS | NO_GATEWAYS | No gateways found for the current parameters (`amount`, `selectedCrypto`, `selectedCurrency`, `selectedCountry`, `amountInCrypto`)                                                                                                   |
| GATEWAYS | NO_CRYPTOS  | No cryptocurrencies found, this error appears when all the available cryptos are added into the excludeCryptos filter.                                                                                                               |
| RATE     | API         | Failed request to the api.                                                                                                                                                                                                           |
| RATE     | NO_RATES    | Found gateways availables but there are no rates availables.                                                                                                                                                                         |
| amount   | PARAM       | There are rates availables for the selected items, but the amount is not enough or it's too much, the `message` attribute specifies the max or min amount needed to be able to buy crypto in at least one of the available gateways. |


###### apiInterface
Provides functions to interact with the [API](https://docs.onramper.dev/API-Reference/).

| Function                                    | Description                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| init(country?: string)                      | Makes a call to get all the options the user have for buy crypto given a country. This function triggers a call to `handleCryptoChange`, `handleCurrencyChange`, `handlePaymentMethodChange` and `getRates` consecutively. If `country` is not set then the country parameter is automatically detected by Onramper's API using the user's IP address).                                  |
| getRates()                                  | Makes a call to get all rates and stores it into `data.allRates` (see [`data` object](#data)). The parameters used to get the rates are `selectedCrypto`, `selectedCurrency`, `selectedPaymentMethod` and `amount` from the [`collected` object](#collected). Each one of this rates, have an attribute `nextStep` that represents the first step to execute to start the purchase flow. |
| executeStep(step: NextStep, params: object) | Makes a call to `step.url` with the `params` object as a request body. Sends to the api the step with the corresponding step fields filled (`params`). The response of this call is a new step, also can throw an error if any error is made completing the `params` object. [Read how steps work here](API-Reference.md).                                                               |

###### data
Object that stores the lists of the available items (cryptos, currencies, payment methods and gateways) the user can select and includes functions to update that lists depending on the items selected. Through this object you can also access to the raw responses of the calls made to the api among others. [See declaration for all attributes](./ApiContext/initialState.ts). 

| Function/variable                                                                                                                                        | Description                                                                                                                                                                                                                                                               |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| availableCryptos `ItemType[]`                                                                                                                            | List of cryptos availables to buy in user's country. This is updated if [`apiInterface.init`](#apiinterface) is called.                                                                                                                                                   |
| availableCurrencies `ItemType[]`                                                                                                                         | List of currencies with which you can buy the selected cryptocurrency ([`collected.selectedCrypto`](#collected)). This list is updated if the selected cryptocurrency is changed.                                                                                         |
| availablePaymentMethods `ItemType[]`                                                                                                                     | List of payment methods availables that can be used for buy the selected cryptocurrency with the selected currency ([`collected.selectedCurrency`](#collected)). This list is updated if the selected currency is changed.                                                |
| allRates `GatewayRateOption[]`                                                                                                                           | List of available and unavailable gateways. This list is updated if `amount`, `selectedCrypto`, `selectedCurrency` or `selectedPaymentMethod` attributes from the [`collected` object](#collected) is changed.                                                            |
| data.handleCryptoChange(crypto?: ItemType)<br>data.handleCurrencyChange(currency?: ItemType)<br>data.handlePaymentMethodChange(paymentMethod?: ItemType) | Functions that updates the items lists (`availableCryptos`, `availableCurrencies`, `availablePaymentMethods` and `allRates`) and the selected items variables from the `collected` object if it's necessary. [Read how are updated here](#apicontext-internal-execution). |
