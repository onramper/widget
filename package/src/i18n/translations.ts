const resources = {
  en: {
    translation: {
      mainScreen: {
        userIntention: 'T:I want to buy',
        amount: 'T:Amount',
        currency: 'T:Currency',
        paymentMethod: 'T:Payment method',
        noteForCryptoAmount: 'T:Best offer found (approximate)',
        noteForFiatAmount: 'T:Amount you pay',
        progressMessage: 'T:Fetching best price...',
        infoBox: {
          seeAllGateways: 'T:See all gateways',
          contact: 'T:Contact us',
        },
        button: {
          viewGateways: 'T:See gateways',
          purchasePrefix: 'T:Buy',
        },
        loadingText: 'T:Loading...'
      },
      gatewayScreen: {
        noteAboutApproximation: 'T:The displayed amounts are an approximate calculation of the crypto that you will receive after fees.',
        noPricesAvailable: 'T:No prices available at this time.',
        errorConnectingToServerMessage: 'T:An error occurred while trying to connect to server. Please try again later.',
        errorTryAgainMessage: 'T:Try again later',
        continueButtonText: 'T:Continue',
        gatewayBadges: {
          bestOption: 'T:Best option',
          bestOffer: 'T:Best offer',
          easiest: 'T:Easiest',
          fastest: 'T:Fastest',
          fast: 'T:Fast',
          alternative: 'T:Alternative',
        },
        gatewayIdProperties: {
          noIdRequired: 'T:No ID required',
          idRequired: 'T:Identification required',
        },
        gatewayOfferActionInFiat: 'T:You receive',
        gatewayOfferActionInCrypto: 'T:You pay',
      },
      header: {
        buyCrypto: 'T:Buy crypto',
        sellCrypto: 'T:Sell crypto',
        selectCrypto: 'T:Select cryptocurrency',
        selectFiat: 'T:Select fiat currency',
        selectPaymentMethod: 'T:Select payment method',
        chooseSeller: 'T:Choose seller',
        wireTransferDetails: 'T:Wire transfer details',
      },
      footer: {
        onramperPrefix: 'T:Powered by',
      },
      menu: {
        title: 'T:Menu',
        faq: 'T:FAQ/support',
        legal: 'T:Privacy Policy',
        terms: 'T:Terms of use',
        liveChat: 'T:Live chat',
        about: 'T:About Onramper',
      },
      kycScreens: {
        sendingProgressMessage: 'T:Sending...',
        continueButtonText: 'T:Continue',
        itemPrefix: 'T:Item',
        noReference: 'T:No reference',
      },
      loadingScreen: {
        title: 'T:Checking your information',
        didYouKnow: 'T:Did you know...',
        whileDidYouKnow: 'T:While, did you know...',
        creatingOrder: 'T:We are creating your order... please wait.',
        cryptoFacts: [
          "T:The majority of bitcoin mining takes place in China, Georgia, Sweden and Canada",
          "T:No one knows the real identity of the creator of Bitcoin",
          "T:Over 16 million of Bitcoins are in circulation",
          "T:In 2010, someone bought a pizza with 10000 BTC",
          "T:The FBI owns one of the largest Bitcoin wallets",
          "T:A unit of Bitcoin is called a 'Satoshi byte'",
          "T:You can't ban Bitcoin",
          "T:Bitcoin is created through mining",
        ],
        verifyingIdentity: 'T:Verifying your identity',
        verificationOfDocuments: 'T:Your documents are being verified, this process takes about 5 minutes, please, wait.'
      },
      apiProvider: {
        gatewaysDisabledByFilters: 'T:Gateways disabled by filters.',
        noGatewaysFound: 'T:No gateways found.',
        noCryptosFound: 'T:No cryptos found.',
        noFiatsFound: 'T:No fiat currencies found.',
        noPaymentMethodsFound: 'T:No available payment methods found.',
        noGatewayForCombination: `T:We tried but... we haven't found any gateway for this combination of cryptocurrency, fiat currency, payment method and/or prefilled {{outCurrency}} wallet address. Please, try with another one or contact us.`,
        noGatewaysConnected: 'T:No gateways connected at this moment, please, try again in some minutes.',
        sellerAvailablePayingWith: 'T:Available paying with',
        sellerAvailableOr: 'T:or',
        partnerContextErrorMessage: 'T:Partner context not set properly',
        apiKeyNotProvidedErrorMessage: 'T:API KEY NOT PROVIDED',
      },
      iframeScreen: {
        autoRedirectFailed: `T:We couldn't auto-redirect you to finish the process, please click the button below to finish the process.`,
        tryOtherGateway: 'T:Try another gateway',
        bankRejection: `T:It's possible that your bank rejected the transaction. Please use another credit card or try with another gateway.`,
        redirect: {
          message: 'T:You have been redirected to finish the purchase with',
          clickButton: 'T:If nothing happened, please, click the button below.',
          beRedirected: 'T:You will be redirected to finish the purchase with',
          redirectCountdown: 'T:Redirecting you in',
          completePurchase: 'T:Complete purchase',
          transactionFinished: 'T:Or, if you already finished the transaction:',
          buyMoreCrypto: 'T:Buy more crypto',
        },
        autoRedirect: {
          redirecting: 'T:Redirecting you to finish the process...',
          newWindow: 'T:A new window should be opened, if not, click the button below to finish the process.',
          newWindowComplete: 'T:A new window should have been opened to complete the transaction',
          alreadyCompleted: 'T:If you already completed the transaction',
          finishProcess: 'T:Finish process',
          pleaseClick: 'T:Please, click the button below to finish the process.',
        },
      },
      timeMagnitudes: {
        second: 'T:seconds',
        minute: 'T:minutes',
        hour: 'T:hours',
        day: 'T:days',
      },
    }
  }
}

export default resources;