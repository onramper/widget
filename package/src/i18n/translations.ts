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
        },
        button: {
          viewGateways: `See gateways`,
          purchasePrefix: `Buy`,
        },
        loadingText: `Loading..`,
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
        phoneNumberTitle: "Input phone number",
        verifyEmailCodeTitle: "Verify your email",
        enterVerificationCodesTitle: "Enter verification codes",
        enterVerificationCodeTitle: "Enter verification code",
        bankIbanInfoMsg:
          "Please, fill in the bank account number that you will use to send the wire transfer.",
        inputExpiryDate: 'Expiry date'
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
      misc: { searchbarPlaceholderText: "Search..." },
    },
  },
  ko: {
    translation: {
      mainScreen: {
        userIntention: "내가 사고 싶은",
        amount: "양",
        currency: "통화",
        paymentMethod: "지불 방법",
        noteForCryptoAmount: "최고의 제안 (근사)",
        noteForFiatAmount: "금액 지불",
        progressMessage: "최고의 가격 가져 오기 ...",
        infoBox: { seeAllGateways: "모든 게이트웨이보기", contact: "문의하기" },
        button: { viewGateways: "게이트웨이보기", purchasePrefix: "구입" },
        loadingText: "적재 ..",
      },
      gatewayScreen: {
        noteAboutApproximation:
          "표시된 금액은 수수료 후에받을 수있는 크립토의 대략적인 계산입니다.",
        noPricesAvailable: "현재 가격 없음.",
        errorConnectingToServerMessage:
          "서버에 연결하는 동안 오류가 발생했습니다. 나중에 다시 시도하십시오.",
        errorTryAgainMessage: "나중에 다시 시도하십시오.",
        continueButtonText: "계속하다",
        gatewayBadges: {
          bestOption: "최고의 옵션",
          bestOffer: "최고의 제안",
          easiest: "쉬운",
          fastest: "가장 빠른",
          fast: "빠른",
          alternative: "대안",
        },
        gatewayIdProperties: {
          noIdRequired: "ID가 필요 없음",
          idRequired: "신분 확인 필요",
        },
        gatewayOfferActionInFiat: "당신은받습니다.",
        gatewayOfferActionInCrypto: "당신은 돈을 지불합니다.",
      },
      header: {
        buyCrypto: "Crypto 구입",
        sellCrypto: "Crypto 판매",
        selectCrypto: "Cryptocurrency를 선택하십시오",
        selectFiat: "Fiat 통화 선택",
        selectPaymentMethod: "지불 방법 선택",
        chooseSeller: "판매자 선택",
        wireTransferDetails: "와이어 전송 세부 정보",
      },
      footer: { onramperPrefix: "구동" },
      menu: {
        title: "메뉴",
        faq: "FAQ / 지원",
        legal: "개인 정보 정책",
        terms: "사용 조건",
        liveChat: "라이브 채팅",
        about: "배우퍼에 대해서",
      },
      kycScreens: {
        sendingProgressMessage: "배상...",
        continueButtonText: "계속하다",
        itemPrefix: "안건",
        noReference: "참조 없음",
      },
      formView: {
        defaultTitle: "구매 양식",
        emailTitle: "이메일을 입력하십시오",
        phoneNumberTitle: "입력 전화 번호",
        verifyEmailCodeTitle: "이메일 확인하십시오",
        enterVerificationCodesTitle: "확인 코드를 입력하십시오",
        enterVerificationCodeTitle: "확인 코드를 입력하십시오",
        bankIbanInfoMsg:
          "철사 전송을 보내는 데 사용할 은행 계좌 번호를 작성하십시오.",
        inputExpiryDate: '만료일'
      },
      loadingScreen: {
        title: "귀하의 정보 확인",
        didYouKnow: "알다시피 ...",
        whileDidYouKnow: "동안, 당신은 알고 있었습니까 ...",
        creatingOrder: "우리는 주문을 창조하고 있습니다 ... 기다려주세요.",
        cryptoFacts: [
          "대다수의 Bitcoin 광업은 중국, 조지아, 스웨덴 및 캐나다에서 일어난다",
          "아무도 비트 코인의 창조주의 진짜 정체성을 알고 있지 않다.",
          "1600 만 명이 넘는 비트 코인이 순환 ",
          "2010 년에 누군가가 10000 BTC로 피자를 샀다.",
          "FBI는 가장 큰 비트 코인 지갑 중 하나를 소유하고 있습니다.",
          "Bitcoin의 단위는 `satoshi 바이트`라고합니다.",
          "당신은 bitcoin을 금지 할 수 없습니다.",
          "Bitcoin은 광업을 통해 만들어졌습니다.",
        ],
        verifyingIdentity: "신원 확인",
        verificationOfDocuments:
          "귀하의 문서가 확인되고 있으며,이 과정은 약 5 분, 제발, 기다려주세요,",
      },
      apiProvider: {
        gatewaysDisabledByFilters: "필터별로 사용 중지됨",
        noGatewaysFound: "게이트웨이가 발견되지 않았습니다.",
        noCryptosFound: "암호가 발견되지 않았습니다.",
        noFiatsFound: "피아트 통화가 발견되지 않았습니다.",
        noPaymentMethodsFound: "사용할 수있는 지불 방법이 없습니다.",
        noGatewayForCombination:
          "우리는 Cryptocurrency, Fiat 통화, 지불 방법 및 / 또는 미리 채워진 {{outCurrency}} 지갑 주소 의이 조합을위한 게이트웨이를 찾지 못했습니다. 제발, 다른 사람과 연락하십시오.",
        noGatewaysConnected:
          "이 순간에 연결된 게이트웨이가 없으세요, 몇 분 안에 다시 시도하십시오.",
        sellerAvailablePayingWith: "사용할 수있는 이용 가능",
        sellerAvailableOr: "또는",
        partnerContextErrorMessage:
          "파트너 컨텍스트가 제대로 설정되지 않았습니다.",
        apiKeyNotProvidedErrorMessage: "API 키가 제공되지 않음",
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
          message: "구매를 끝내기 위해 리디렉션되었습니다.",
          clickButton: "아무 일도 일어나지 않으면 아래 버튼을 클릭하십시오.",
          beRedirected: "당신은 구매를 끝내기 위해 리디렉션 될 것입니다.",
          redirectCountdown: "당신을 리디렉션",
          completePurchase: "완전한 구매",
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
      misc: { searchbarPlaceholderText: "찾다..." },
    },
  },
  ja: {
    translation: {
      mainScreen: {
        userIntention: "私が購入したい",
        amount: "額",
        currency: "通貨",
        paymentMethod: "支払方法",
        noteForCryptoAmount: "最高のオファーが見つかりました（おおよそ）",
        noteForFiatAmount: "あなたが払う金額",
        progressMessage: "ベストプライスをフェッチする...",
        infoBox: {
          seeAllGateways: "すべてのゲートウェイを見る",
          contact: "お問い合わせ",
        },
        button: {
          viewGateways: "ゲートウェイを見てください",
          purchasePrefix: "買う",
        },
        loadingText: "積載",
      },
      gatewayScreen: {
        noteAboutApproximation:
          "表示された金額は、料金後に受信する暗号の近似計算です。",
        noPricesAvailable: "現時点で利用可能な価格はありません。",
        errorConnectingToServerMessage:
          "サーバーに接続しようとしたときにエラーが発生しました。後でもう一度やり直してください。",
        errorTryAgainMessage: "あとでもう一度試してみてください",
        continueButtonText: "継続する",
        gatewayBadges: {
          bestOption: "最適なオプション",
          bestOffer: "最高の提案",
          easiest: "簡単に",
          fastest: "最速で",
          fast: "速い",
          alternative: "別",
        },
        gatewayIdProperties: {
          noIdRequired: "IDは必要ありません",
          idRequired: "身分証明書が必要です",
        },
        gatewayOfferActionInFiat: "あなたが受け取る",
        gatewayOfferActionInCrypto: "あなたが支払う",
      },
      header: {
        buyCrypto: "暗号を買う",
        sellCrypto: "クリプトを売る",
        selectCrypto: "CryptoCurrencyを選択してください",
        selectFiat: "フィアット通貨を選択してください",
        selectPaymentMethod: "支払い方法を選択してください",
        chooseSeller: "売り手を選択してください",
        wireTransferDetails: "ワイヤートランスファーの詳細",
      },
      footer: { onramperPrefix: "搭載" },
      menu: {
        title: "メニュー",
        faq: "FAQ /サポート",
        legal: "プライバシーポリシー",
        terms: "利用規約",
        liveChat: "ライブチャット",
        about: "Onramperについて",
      },
      kycScreens: {
        sendingProgressMessage: "送信...",
        continueButtonText: "継続する",
        itemPrefix: "アイテム",
        noReference: "参照なし",
      },
      formView: {
        defaultTitle: "購入書を購入する",
        emailTitle: "あなたのEメールを入力してください",
        phoneNumberTitle: "入力電話番号",
        verifyEmailCodeTitle: "あなたの電子メールを確認します",
        enterVerificationCodesTitle: "検証コードを入力してください",
        enterVerificationCodeTitle: "認証コードを入力してください",
        bankIbanInfoMsg:
          "ワイヤー転送を送信するために使用する銀行口座番号を入力してください。",
        inputExpiryDate: '有効期限'
      },
      loadingScreen: {
        title: "あなたの情報をチェックしてください",
        didYouKnow: "知ってますか...",
        whileDidYouKnow: "しながら、あなたは知っていました...",
        creatingOrder:
          "私たちはあなたの注文を作成しています...待ってください。",
        cryptoFacts: [
          "Bitcoin Miningの大部分は、中国、ジョージア、スウェーデン、カナダで行われます",
          "Bitcoinのクリエイターの本当のアイデンティティを知らないだれも",
          "1,600万人以上のビットコインが流通しています",
          "2010年に、誰かが10000 BTCでピザを買った",
          "FBIは最大のビットコイン財布の1つを所有しています",
          "Bitcoinの単位は「satoshi byte」と呼ばれます",
          "あなたはBitcoinを禁止することはできません",
          "Bitcoinはマイニングによって作成されます",
        ],
        verifyingIdentity: "あなたのアイデンティティを確認してください",
        verificationOfDocuments:
          "あなたの文書が検証されています、このプロセスは約5分かかります、どうぞ、待ってください",
      },
      apiProvider: {
        gatewaysDisabledByFilters:
          "フィルタによって無効になっているゲートウェイ。",
        noGatewaysFound: "ゲートウェイは見つかりませんでした。",
        noCryptosFound: "暗号は見つかりませんでした。",
        noFiatsFound: "Fiat通貨が見つかりませんでした。",
        noPaymentMethodsFound: "利用可能な支払い方法は見つかりませんでした。",
        noGatewayForCombination:
          "私たちは試しましたが...私たちは、クリプトカレン性、フィアット通貨、支払い方法、および/またはプレフィルド {{outCurrency}} 財布財布のゲートウェイを見つけていません。他の人と一緒にお試しください。",
        noGatewaysConnected:
          "現時点ではゲートウェイが接続されていません、数分でやり直してください。",
        sellerAvailablePayingWith: "お支払いがあります",
        sellerAvailableOr: "また",
        partnerContextErrorMessage:
          "パートナーコンテキストが正しく設定されていません",
        apiKeyNotProvidedErrorMessage: "APIキーは提供されていません",
      },
      apiContent: {
        processResponseError: "応答の解析中にエラーが発生しました",
      },
      iframeScreen: {
        autoRedirectFailed:
          "プロセスを終了するように自動的にリダイレクトすることはできませんでした、下のボタンをクリックしてプロセスを終了してください。",
        tryOtherGateway: "別のゲートウェイを試してください",
        bankRejection:
          "銀行が取引を拒否した可能性があります。別のクレジットカードを使用するか、別のゲートウェイで試してください。",
        redirect: {
          message: "あなたは購入を終了するようにリダイレクトされました",
          clickButton:
            "何も起こらなかった場合は、下のボタンをクリックしてください。",
          beRedirected: "購入を終了するようにリダイレクトされます",
          redirectCountdown: "あなたをリダイレクトする",
          completePurchase: "完全な購入",
          transactionFinished: "または、すでにトランザクションを終了した場合",
          buyMoreCrypto: "もっと暗号を買う",
        },
        autoRedirect: {
          redirecting: "プロセスを終了するようにあなたをリダイレクトする...",
          newWindow:
            "新しいウィンドウを開く必要がない場合は、下のボタンをクリックしてプロセスを終了します。",
          newWindowComplete:
            "トランザクションを完了するために新しいウィンドウが開かれたはずです",
          alreadyCompleted: "すでに取引を完了した場合",
          finishProcess: "終了プロセス",
          pleaseClick: "下のボタンをクリックしてプロセスを終了してください。",
        },
      },
      timeMagnitudes: { second: "秒数", minute: "分", hour: "時間", day: "日" },
      misc: { searchbarPlaceholderText: "検索..." },
    },
  },
};

export default resources;
