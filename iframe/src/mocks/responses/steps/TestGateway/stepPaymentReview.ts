import { BASE_API } from "../../../constants";

export default {
  type: "paymentReview",
  progress: 30,
  useHeading: true,
  title: "Review Payment",
  description: "Please verify the details below carefully",
  url: `${BASE_API}/GoTo/TestGateway/personalInfoStep/WyJHWHVZZGVBb1B6SF9JcXJWQXh6R3ZRLS0iLDEwMCwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd`,
  data: [
    {
      type: "stepsOverview",
      items: [
        {
          description: "You pay",
          title: "200 EUR",
          name: "fiatCurrency",
          icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACYUlEQVR4nO3Zu2sUURTH8c/4QMU3WmglCEYExULUWIgvLFSwFgRBLMRORGxsFEux9R+wsUwhJBCsbC0MooKmEAsRfCT4IL6SsZiNTK4ZM6/sTpL9wYG9e+/MPd+Zu+eeezaK49h80KJOO1CXuiBNUxekaeqCNE1L8g6MoqjsHKuwG9uxHivwBZ/wAs8wFl5UeH+L4ziXFVSEU+jHD8T/sZ8YxCWsLOrXX/9mAWQbHs3gfJZ9xOEmgBzFaIaTv/AWr/EtY8wI1nUaZF+Gg304jmXB+C04jwGMt8Zen+zsFMgavAkARnEyzxNoQd2WBIaOgtwJIL7jQE6IadUJkLX4HIBcrgLRKZBrAcRLLG03SB07+4WgfVcSodqqKG9ozdjZN0tC6qQmsAnvqzpWIOSjeq51KGg/UQNEGeXOtVI6k/p8NugbCfpn0v0S80+rMkurzmpFZiba7qXVGC1okChloXYE/TNZbar7jfyu+X65VRUkdLxMFKxFZaJW2vnFwbDxgvNngheNWmWeYOh83r5ZVTdqtexq0Ndnjkath0H7oJodzKuqIEP4kGpvwJGK9yylqiAxHgTfXax4z3Kq4YS4y9QT4gT2tMuvuosP/QHMkFRFZC6B7JVslGmYAayeayBwKwCJ8RwnclzbgxtSv6+iIFXP7FOG4J5/T40klZVBvJJU4ZdjI3aiF1tb4262gNqSomQpxjm8wxVT95Oels2a6k5RJiS7/TE8LnjtVwyXnbjOpTWdenEa+yVvZPKPnjFJbXgYTyUZwqCkCI7iSys3SNO1oLPfRqoL0jR1QZqmeQPyB3kxxnuMX9YkAAAAAElFTkSuQmCC",
          items: [
            {
              contentValues: {
                label: "Conversion Rate",
                value: "1 BTC ≈ 39,799.41 EUR",
              },
            },
            {
              contentValues: {
                label: "Transfer Fee",
                value: "8.34 EUR",
              },
            },
          ],
        },
        {
          description: "You receive",
          title: "0.00472 BTC",
          icon: "data:image/png;base64,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",
          info: "This might differ due to market volatility.",
        },
      ],
    },
    {
      type: "stepsOverview",
      items: [
        {
          description: "BTC wallet address",
          title: "F1890EBF320C9310BF6F904D70",
          name: "WalletAddress",
        },
      ],
    },
    {
      type: "stepsOverview",
      items: [
        {
          description: "Address tag",
          title: "F1890EBF320C9310BF6F904D70",
          name: "AddressTag",
        },
      ],
    },
    {
      type: "stepsOverview",
      items: [
        {
          description: "Expected transaction time",
          title: "~10 minutes",
          name: "ExpectedTransationTime",
        },
      ],
    },
  ],
};
