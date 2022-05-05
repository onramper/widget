import countries from "./countries";
const resources = {
  en: {
    translation: {
      mainScreen: {
        userIntention: `I want to buy`,
        amount: `Amount`,
        currency: `Currency`,
        paymentMethod: `Payment method`,
        noteForCryptoAmount: `Best offer found (approximate)`,
        noteForFiatAmount: `Amount you pay`,
        progressMessage: `Fetching best price...`,
        infoBox: {
          seeAllGateways: `See all gateways`,
          contact: `Contact us`,
          seeMore: `See more`,
        },
        button: {
          viewGateways: `See gateways`,
          purchasePrefix: `Buy`,
        },
        loadingText: `Loading...`,
      },
      gatewayScreen: {
        noteAboutApproximation: `The displayed amounts are an approximate calculation of the crypto that you will receive after fees.`,
        noPricesAvailable: `No prices available at this time.`,
        errorConnectingToServerMessage: `An error occurred while trying to connect to server. Please try again later.`,
        errorTryAgainMessage: `Try again later`,
        continueButtonText: `Continue`,
        gatewayBadges: {
          bestOption: `Best option`,
          bestOffer: `Best offer`,
          easiest: `Easiest`,
          fastest: `Fastest`,
          fast: `Fast`,
          alternative: `Alternative`,
        },
        gatewayIdProperties: {
          noIdRequired: `No ID required`,
          idRequired: `Identification required`,
        },
        gatewayOfferActionInFiat: `You receive`,
        gatewayOfferActionInCrypto: `You pay`,
      },
      header: {
        buyCrypto: `Buy crypto`,
        sellCrypto: `Sell crypto`,
        selectCrypto: `Select cryptocurrency`,
        selectFiat: `Select fiat currency`,
        selectPaymentMethod: `Select payment method`,
        chooseSeller: `Choose seller`,
        wireTransferDetails: `Wire transfer details`,
      },
      footer: {
        onramperPrefix: `Powered by`,
      },
      menu: {
        title: `Menu`,
        faq: `FAQ/support`,
        legal: `Privacy Policy`,
        terms: `Terms of use`,
        liveChat: `Live chat`,
        about: `About Onramper`,
      },
      kycScreens: {
        sendingProgressMessage: `Sending...`,
        continueButtonText: `Continue`,
        itemPrefix: `Item`,
        noReference: `No reference`,
      },
      formView: {
        defaultTitle: "Purchase form",
        emailTitle: "Input your email",
        loginRegisterTitle: "Login/Register",
        phoneNumberTitle: "Input phone number",
        verifyEmailCodeTitle: "Verify your email",
        enterVerificationCodesTitle: "Enter verification codes",
        enterVerificationCodeTitle: "Enter verification code",
        bankIbanInfoMsg:
          "Please, fill in the bank account number that you will use to send the wire transfer.",
        inputExpiryDate: 'Expiry date',
        termsAgreement: 'I accept'
      },
      informationView: {
        close: `Close`,
        gotIt: `Got it!`,
      },
      miscViews: {
        completePayment: `Complete payment`,
      },
      loadingScreen: {
        title: `Checking your information`,
        didYouKnow: `Did you know...`,
        whileDidYouKnow: `While, did you know...`,
        creatingOrder: `We are creating your order... please wait.`,
        cryptoFacts: [
          `The majority of bitcoin mining takes place in China, Georgia, Sweden and Canada`,
          `No one knows the real identity of the creator of Bitcoin`,
          `Over 16 million of Bitcoins are in circulation`,
          `In 2010, someone bought a pizza with 10000 BTC`,
          `The FBI owns one of the largest Bitcoin wallets`,
          `A unit of Bitcoin is called a 'Satoshi byte'`,
          `You can't ban Bitcoin`,
          `Bitcoin is created through mining`,
        ],
        verifyingIdentity: `Verifying your identity`,
        verificationOfDocuments: `Your documents are being verified, this process takes about 5 minutes, please, wait`,
      },
      apiProvider: {
        gatewaysDisabledByFilters: `Gateways disabled by filters.`,
        noGatewaysFound: `No gateways found.`,
        noCryptosFound: `No cryptos found.`,
        noFiatsFound: `No fiat currencies found.`,
        noPaymentMethodsFound: `No available payment methods found.`,
        noGatewayForCombination: `We tried but... we haven't found any gateway for this combination of cryptocurrency, fiat currency, payment method and/or prefilled {{outCurrency}} wallet address. Please, try with another one or contact us.`,
        noGatewaysConnected: `No gateways connected at this moment, please, try again in some minutes.`,
        sellerAvailablePayingWith: `Available paying with`,
        sellerAvailableOr: `or`,
        partnerContextErrorMessage: `Partner context not set properly`,
        apiKeyNotProvidedErrorMessage: `API KEY NOT PROVIDED`,
        otherCurrencies: `other currencies`,
      },
      apiContent: {
        processResponseError: "Error parsing the response",
      },
      iframeScreen: {
        autoRedirectFailed: `We couldn't auto-redirect you to finish the process, please click the button below to finish the process.`,
        tryOtherGateway: `Try another gateway`,
        bankRejection: `It's possible that your bank rejected the transaction. Please use another credit card or try with another gateway.`,
        redirect: {
          message: `You have been redirected to finish the purchase with`,
          clickButton: `If nothing happened, please, click the button below.`,
          beRedirected: `You will be redirected to finish the purchase with`,
          redirectCountdown: `Redirecting you in`,
          completePurchase: `Complete purchase`,
          transactionFinished: `Or, if you already finished the transaction:`,
          buyMoreCrypto: `Buy more crypto`,
        },
        autoRedirect: {
          redirecting: `Redirecting you to finish the process...`,
          newWindow: `A new window should be opened, if not, click the button below to finish the process.`,
          newWindowComplete: `A new window should have been opened to complete the transaction`,
          alreadyCompleted: `If you already completed the transaction`,
          finishProcess: `Finish process`,
          pleaseClick: `Please, click the button below to finish the process.`,
        },
      },
      timeMagnitudes: {
        second: `seconds`,
        minute: `minutes`,
        hour: `hours`,
        day: `days`,
      },
      paymentReviewScreen: {
        pay: "Pay",
        convRate: "Conversion rate",
        transFee: "Transaction fee",
        inExchangeOf: "In exchange of",
        expectedTransTime: "Expected transaction time",
        walletAddress: "wallet address",
        addressTag: "Address tag",
        title: "Payment review",
      },
      verifyCreditCardScreen: {
        hint: "Where do I find this code?",
        resendCode: "Resend code",
        gotIt: "Got it👌",
        helpTitle: "2FA Credit Card",
        helpText: `A small transaction was charged on your credit card
        with a 6-digit verification code in the description.
        Check your credit card transactions, copy the code
        and fill it in here.`,
        pendingTransactionScreenshotAlt: "Pending transaction screenshot",
      },
      errorCountriesNotSupported: {
        title: "Country not supported",
        isNotSupportedBy: "is not yet supported by Onramper.",
        description: "We're working hard to make it available for you as soon as possible!"
      },
      errorDisabledGateways: {
        title: "It's not you...",
        description: "Looks like this Onramper integration has disabled some of the available gateways in this area."
      },
      errorApi: {
        title: "Couldn't continue",
        description: "For more information of the error, read our FAQs or contact us."
      },
      errorCrash: {
        title: "It's not about you...",
        description: "Something went really wrong. Please, restart the widget.",
      },
      errorNoItemsFound: {
        title: "We tried but...",
        someItemsDisabled: "looks like this Onramper integration has disabled some items."
      },
      errorScreens: {
        readFaqs: "Read our FAQs",
        forMoreInfo: "For more information read our FAQs or contact us."
      },
      misc: {
        searchbarPlaceholderText: "Search...",
        and: 'and',
        continue: "Continue",
        tryAgain: "Try again",
        restart: "Restart"
      },
      countries: countries.en
    },
  },
  ko: {
    translation: {
      mainScreen: {
        userIntention: "사고 싶은",
        amount: "양",
        currency: "통화",
        paymentMethod: "지불 방법",
        noteForCryptoAmount: "최고의 제안 (대략)",
        noteForFiatAmount: "지불할 금액",
        progressMessage: "최고의 가격 가져 오는중...",
        infoBox: { seeAllGateways: "모든 게이트웨이보기", contact: "문의하기", seeMore: `더보기`, },
        button: { viewGateways: "게이트웨이보기", purchasePrefix: "구입" },
        loadingText: "로딩중...",
      },
      gatewayScreen: {
        noteAboutApproximation:
          "표시된 금액은 수수료 후에받을 수있는 코인의 대략적인 계산입니다.",
        noPricesAvailable: "현재 가격 없음.",
        errorConnectingToServerMessage:
          "서버에 연결중 오류가 발생했습니다. 잠시후 다시 시도하십시오.",
        errorTryAgainMessage: "잠시후 다시 시도하십시오.",
        continueButtonText: "계속",
        gatewayBadges: {
          bestOption: "최고의 옵션",
          bestOffer: "최고의 제안",
          easiest: "가장 쉬운",
          fastest: "가장 빠른",
          fast: "빠른",
          alternative: "대안",
        },
        gatewayIdProperties: {
          noIdRequired: "ID는 선택사항입니다",
          idRequired: "신분증 등록을 해주세요",
        },
        gatewayOfferActionInFiat: "받습니다",
        gatewayOfferActionInCrypto: "구입합니다",
      },
      header: {
        buyCrypto: "Crypto 구입",
        sellCrypto: "Crypto 판매",
        selectCrypto: "Crypto를 선택하십시오",
        selectFiat: "Fiat 통화 선택",
        selectPaymentMethod: "지불 방법 선택",
        chooseSeller: "판매자 선택",
        wireTransferDetails: "WIRE 전송 세부 정보",
      },
      footer: { onramperPrefix: "Powered by" },
      menu: {
        title: "메뉴",
        faq: "FAQ / 지원",
        legal: "개인정보정책",
        terms: "이용약관",
        liveChat: "라이브 채팅",
        about: "온램퍼에 대해서",
      },
      kycScreens: {
        sendingProgressMessage: "전송중...",
        continueButtonText: "계속",
        itemPrefix: "아이템",
        noReference: "참조 없음",
      },
      formView: {
        defaultTitle: "구매 양식",
        emailTitle: "이메일을 입력하십시오",
        phoneNumberTitle: "전화번호 입력",
        verifyEmailCodeTitle: "이메일 인증을 해주세요",
        enterVerificationCodesTitle: "인증코드를 입력하십시오",
        enterVerificationCodeTitle: "인증코드를 입력하십시오",
        bankIbanInfoMsg:
          "WIRE 전송을 보내는 데 사용할 은행 계좌 번호를 입력하십시오.",
        inputExpiryDate: '만료일',
        termsAgreement: '동의함'
      },
      informationView: {
        close: `닫기`,
        gotIt: `알았어요!`,
      },
      miscViews: {
        completePayment: `결제 완료`,
      },
      loadingScreen: {
        title: "고객님의 정보 확인 중 입니다",
        didYouKnow: "아시다시피 ...",
        whileDidYouKnow: "동안,당신은 알고 계셨습니까 ...",
        creatingOrder: "주문을 생성하고 있습니다 ... 기다려주세요.",
        cryptoFacts: [
          "대다수의 Bitcoin 광업은 중국,조지아,스웨덴 및 캐나다에서 채굴됩니다",
          "아무도 비트 코인의 창조주의 진짜 정체성을 알고 있지 않다.",
          "1600 만개가 넘는 비트 코인이 순환되고있습니다",
          "2010 년에는 누군가가 10000 BTC로 피자를 샀습니다.",
          "FBI는 가장 큰 비트 코인 지갑 중 하나를 소유하고 있습니다.",
          "Bitcoin의 단위는 `satoshi 바이트`입니다.",
          "bitcoin을 금지할 수는 없습니다.",
          "Bitcoin은 채굴을 통해 생성됩니다.",
        ],
        verifyingIdentity: "본인인증",
        verificationOfDocuments:
          "약 5분정도 소요됩니다.,이 과정은 약 5 분,제발,기다려주세요",
      },
      apiProvider: {
        gatewaysDisabledByFilters: "필터별로 사용 중지됨",
        noGatewaysFound: "게이트웨이가 발견되지 않았습니다.",
        noCryptosFound: "Crypto가 발견되지 않았습니다.",
        noFiatsFound: "Fiat 통화가 발견되지 않았습니다.",
        noPaymentMethodsFound: "사용할 수있는 지불 방법이 없습니다.",
        noGatewayForCombination:
          "이 암호화폐의 조합을 위한 어떤 관문도 찾지 못했습니다,Fiat 통화,지불 방법 및 / 또는 미리 채워진 {{outCurrency}} 지갑 주소 의이 조합을위한 게이트웨이를 찾지 못했습니다. 제발,다른 사람과 연락하십시오",
        noGatewaysConnected:
          "이 순간에 연결된 게이트웨이가 없으세요, 몇 분 안에 다시 시도하십시오.",
        sellerAvailablePayingWith: "지불방법 선택",
        sellerAvailableOr: "또는",
        partnerContextErrorMessage:
          "파트너 컨텍스트가 제대로 설정되지 않았습니다.",
        apiKeyNotProvidedErrorMessage: "API 키가 제공되지 않음",
        otherCurrencies: `다른 통화`,
      },
      apiContent: {
        processResponseError: "응답 구문 분석 오류",
      },
      iframeScreen: {
        autoRedirectFailed:
          "우리는 프로세스를 완료하도록 자동 리디렉션 할 수 없었습니다. 아래 버튼을 클릭하여 프로세스를 완료하십시오.",
        tryOtherGateway: "다른 게이트웨이 사용",
        bankRejection:
          "귀하의 은행이 거래를 거부 할 수 있습니다. 다른 신용 카드를 사용하거나 다른 게이트웨이로 시도하십시오.",
        redirect: {
          message: "구매를 완료를 위해 리디렉션되었습니다.",
          clickButton: "아무 일도 일어나지 않으면 아래 버튼을 클릭하십시오.",
          beRedirected: "구매를 완료하기 위해 리디렉션 될 것입니다.",
          redirectCountdown: "리디렉션",
          completePurchase: "구매완료",
          transactionFinished: "또는 이미 거래를 완료 한 경우",
          buyMoreCrypto: "더 많은 crypto 구입",
        },
        autoRedirect: {
          redirecting: "프로세스를 끝내기 위해 리디렉션 ...",
          newWindow:
            "새 창을 열어야합니다. 그렇지 않은 경우 아래 버튼을 클릭하여 프로세스를 완료하십시오.",
          newWindowComplete:
            "새 창이 트랜잭션을 완료하기 위해 열려 있어야합니다.",
          alreadyCompleted: "이미 거래를 완료 한 경우",
          finishProcess: "완료 프로세스",
          pleaseClick: "제발, 아래 버튼을 클릭하여 프로세스를 완료하십시오.",
        },
      },
      timeMagnitudes: { second: "초", minute: "분", hour: "시간", day: "날" },
      paymentReviewScreen: {
        pay: "지불하다",
        convRate: "전환율",
        transFee: "거래 수수료",
        inExchangeOf: "~의 대가로",
        expectedTransTime: "예상 트랜잭션 시간",
        walletAddress: "지갑 주소",
        addressTag: "주소 태그",
        title: "지불 검토",
      },
      verifyCreditCardScreen: {
        hint: "이 코드는 어디에서 찾을 수 있습니까?",
        resendCode: "코드 재전송",
        gotIt: "알았어요",
        helpTitle: "2FA 신용카드",
        helpText: `설명에 6자리 인증 코드가 포함된 소액 거래가 신용 카드로 청구되었습니다. 신용 카드 거래를 확인하고 코드를 복사하여 여기에 입력하십시오.`,
        pendingTransactionScreenshotAlt: "보류 중인 거래 스크린샷",
      },
      errorCountriesNotSupported: {
        title: "국가가 지원되지 않음",
        isNotSupportedBy: "아직 Onramper에서 지원하지 않습니다.",
        description: "가능한 한 빨리 사용할 수 있도록 최선을 다하고 있습니다!"
      },
      errorDisabledGateways: {
        title: "네가 아니야...",
        description: "이 Onramper 통합으로 인해 이 영역에서 사용 가능한 게이트웨이 중 일부가 비활성화된 것 같습니다."
      },
      errorApi: {
        title: "계속하지 못했습니다",
        description: "오류에 대한 자세한 내용은 자주 묻는 질문을 읽거나 당사에 문의하십시오.",
      },
      errorCrash: {
        title: "너 때문이 아니야...",
        description: "문제가 발생했습니다. 위젯을 다시 시작하세요.",
      },
      errorNoItemsFound: {
        title: "우리는 시도했지만...",
        someItemsDisabled: "이 Onramper 통합으로 인해 일부 항목이 비활성화된 것 같습니다.",
      },
      errorScreens: {
        readFaqs: "자주 묻는 질문을 읽어보세요.",
        forMoreInfo: "자세한 내용은 자주 묻는 질문을 읽거나 당사에 문의하십시오.",
      },
      misc: {
        searchbarPlaceholderText: "검색...",
        and: '그리고',
        continue: "계속",
        tryAgain: "다시 시도하십시오",
        restart: "다시 시작"
      },
      countries: countries.ko
    },
  },
  ja: {
    translation: {
      mainScreen: {
        userIntention: "購入希望",
        amount: "額",
        currency: "通貨",
        paymentMethod: "支払方法",
        noteForCryptoAmount: "最高のオファーが見つかりました（おおよそ）",
        noteForFiatAmount: "支払い金額",
        progressMessage: "ベストプライスを取得中...",
        infoBox: {
          seeAllGateways: "全てのゲートウェイを表示",
          contact: "お問い合わせ",
          seeMore: `続きを見る`,
        },
        button: {
          viewGateways: "ゲートウェイを表示",
          purchasePrefix: "購入",
        },
        loadingText: "読み込み中...",
      },
      gatewayScreen: {
        noteAboutApproximation:
          "表示金額は、手数料後に受け取る仮想通貨のおおよそ値です。",
        noPricesAvailable: "現時点で利用可能な価格はありません。",
        errorConnectingToServerMessage:
          "サーバーに接続しようとしたときにエラーが発生しました。後でもう一度やり直してください。",
        errorTryAgainMessage: "あとでもう一度お試しください",
        continueButtonText: "継続する",
        gatewayBadges: {
          bestOption: "ベストオプション",
          bestOffer: "ベストオファー",
          easiest: "1番簡単",
          fastest: "最速",
          fast: "速い",
          alternative: "別",
        },
        gatewayIdProperties: {
          noIdRequired: "身分証明書は必要ありません",
          idRequired: "身分証明書が必要です",
        },
        gatewayOfferActionInFiat: "受け取る",
        gatewayOfferActionInCrypto: "支払う",
      },
      header: {
        buyCrypto: "仮想通貨を購入",
        sellCrypto: "仮想通貨を売却",
        selectCrypto: "仮想通貨を選択してください",
        selectFiat: "フィアット通貨を選択してください",
        selectPaymentMethod: "支払い方法を選択してください",
        chooseSeller: "売り手を選択してください",
        wireTransferDetails: "電信送金の詳細",
      },
      footer: { onramperPrefix: "提供元" },
      menu: {
        title: "メニュー",
        faq: "FAQ /サポート",
        legal: "プライバシーポリシー",
        terms: "利用規約",
        liveChat: "ライブチャット",
        about: "Onramper概要",
      },
      kycScreens: {
        sendingProgressMessage: "送信中...",
        continueButtonText: "継続する",
        itemPrefix: "アイテム",
        noReference: "参照なし",
      },
      formView: {
        defaultTitle: "購入フォーム",
        emailTitle: "メールアドレスを入力してください",
        phoneNumberTitle: "電話番号を入力してください",
        verifyEmailCodeTitle: "メールアドレスを確認します",
        enterVerificationCodesTitle: "認証コードを入力してください",
        enterVerificationCodeTitle: "認証コードを入力してください",
        bankIbanInfoMsg:
          "銀行口座番号を入力してください",
        inputExpiryDate: '有効期限',
        termsAgreement: '承諾します'
      },
      informationView: {
        close: `閉じる`,
        gotIt: `了解しました。`,
      },
      miscViews: {
        completePayment: `完全な支払い`,
      },
      loadingScreen: {
        title: "お客様の情報を確認中",
        didYouKnow: "知っていましたか…...",
        whileDidYouKnow: "一方で,しながら、あなたは知っていました...",
        creatingOrder:
          "注文を作成しています…お待ちください。",
        cryptoFacts: [
          "ビットコインマイニングの大部分は中国で行われています", // Most of Bitcoin mining is done in China.
          "ビットコインの作成者の正体は誰にもわかりません",
          "1,600万を超えるビットコインが流通しています",
          "2010年に、誰かが10000 BTCでピザを買った",
          "FBIは最大のビットコインウォレットの1つを所有しています",
          "ビットコインの単位は「サトシバイト」と呼ばれます",
          "ビットコインを規制できません",
          "ビットコインはマイニングによって作られます",
        ],
        verifyingIdentity: "本人確認",
        verificationOfDocuments:
          "あなたの文書が検証されています、このプロセスは約5分かかります、どうぞ、待ってください",
      },
      apiProvider: {
        gatewaysDisabledByFilters:
          "フィルタで無効になったゲートウェイ。",
        noGatewaysFound: "ゲートウェイが見つかりません。",
        noCryptosFound: "仮想通貨が見つかりません。",
        noFiatsFound: "フィアット通貨が見つかりません。",
        noPaymentMethodsFound: "利用可能な支払い方法が見つかりません。",
        noGatewayForCombination:
          "私たちは試しましたが...私たちは、クリプトカレン性、フィアット通貨、支払い方法、および/またはプレフィルド {{outCurrency}} 財布財布のゲートウェイを見つけていません。他の人と一緒にお試しください。",
        noGatewaysConnected:
          "現時点ではゲートウェイが接続されていません、数分でやり直してください。",
        sellerAvailablePayingWith: "利用可能な支払い",
        sellerAvailableOr: "また",
        partnerContextErrorMessage:
          "パートナーコンテキストが正しく設定されていません",
        apiKeyNotProvidedErrorMessage: "APIキーが提供されていません",
        otherCurrencies: `他の通貨`,
      },
      apiContent: {
        processResponseError: "応答の解析中にエラーが発生しました",
      },
      iframeScreen: {
        autoRedirectFailed:
          "プロセスを終了するように自動的にリダイレクトすることはできませんでした、下のボタンをクリックしてプロセスを終了してください。",
        tryOtherGateway: "別のゲートウェイを試す",
        bankRejection:
          "銀行が取引を拒否した可能性があります。別のクレジットカードを使用するか、別のゲートウェイで試してください。",
        redirect: {
          message: "転送して購入手続きを完了する",
          clickButton:
            "何も起こらなければ、下のボタンをクリックしてください。",
          beRedirected: "転送して購入手続きを完了する",
          redirectCountdown: "転送しています",
          completePurchase: "購入完了",
          transactionFinished: "または、すでにトランザクションを終了した場合",
          buyMoreCrypto: "もっと仮想通貨を購入する",
        },
        autoRedirect: {
          redirecting: "手続きを完了するために転送しています...",
          newWindow:
            "新しいウィンドウを開く必要がない場合は、下のボタンをクリックしてプロセスを終了します。",
          newWindowComplete:
            "取引を完了するには、新しいウィンドウを開いてください",
          alreadyCompleted: "すでに取引を完了した場合",
          finishProcess: "手続きを終了する",
          pleaseClick: "下のボタンをクリックしてプロセスを終了してください。",
        },
      },
      timeMagnitudes: { second: "秒数", minute: "分", hour: "時間", day: "日" },
      paymentReviewScreen: {
        pay: "支払う",
        convRate: "コンバージョン率",
        transFee: "取引料金",
        inExchangeOf: "と引き換えに",
        expectedTransTime: "予想されるトランザクション時間",
        walletAddress: "ウォレットアドレス",
        addressTag: "アドレスタグ",
        title: "支払いレビュー"
      },
      verifyCreditCardScreen: {
        hint: "このコードはどこにありますか？",
        resendCode: "コードを再送する",
        gotIt: "とった",
        helpTitle: "2FA クレジットカード",
        helpText: `説明に6桁の確認コードが記載された小さな取引がクレジットカードに請求されました。 クレジットカードの取引を確認し、コードをコピーしてここに入力します。`,
        pendingTransactionScreenshotAlt: "保留中のトランザクションのスクリーンショット",
      },
      errorCountriesNotSupported: {
        title: "国はサポートされていません",
        isNotSupportedBy: "Onramperではまだサポートされていません。",
        description: "私たちはあなたができるだけ早くそれを利用できるようにするために一生懸命取り組んでいます!"
      },
      errorDisabledGateways: {
        title: "それはあなたではありません...",
        description: "このOnramper統合により、このエリアで利用可能なゲートウェイの一部が無効になっているようです。"
      },
      errorApi: {
        title: "続行できませんでした",
        description: "エラーの詳細については、よくある質問を読むか、お問い合わせください。"
      },
      errorCrash: {
        title: "それはあなたのことではありません...",
        description: "何かが本当にうまくいかなかった。 ウィジェットを再起動してください。",
      },
      errorNoItemsFound: {
        title: "私たちはそれを試しましたが しかし...",
        someItemsDisabled: "このOnramper統合により、一部のアイテムが無効になっているようです。"
      },
      errorScreens: {
        readFaqs: "よくある質問を読む",
        forMoreInfo: "詳細については、よくある質問を読むか、お問い合わせください。"
      },
      misc: {
        searchbarPlaceholderText: "検索...",
        and: 'と',
        continue: "継続する",
        tryAgain: "再試行する",
        restart: "再起動"
      },
      countries: countries.ja
    },
  },
};

export default resources;
