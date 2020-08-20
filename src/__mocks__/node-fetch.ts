import fetch from 'node-fetch';

export const fetchMock = (jest.genMockFromModule(
    'node-fetch'
) as unknown) as jest.Mock<typeof fetch>;

const apiResponses = {
    'https://api.onramper.dev/gateways': '{"gateways":[{"paymentMethods":["creditCard","bankTransfer"],"fiatCurrencies":[{"code":"EUR","precision":2}],"cryptoCurrencies":[{"code":"BTC","precision":5},{"code":"ETH","precision":5}]}],"localization":{"country":"es","state":null,"currency":"EUR"}}'
};

export function setFetchReturn(data: string) {
    fetchMock.mockImplementationOnce(
        jest.fn().mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(JSON.parse(data)),
        })
    );
}

const singleFailUrls: string[] = [];

fetchMock.mockImplementation(
    jest.fn().mockImplementation((url: string) => {
        for (const [urlStart, response] of Object.entries(apiResponses)) {
            if (url.startsWith(urlStart)) {
                const indexFailure = singleFailUrls.findIndex((s) => url.startsWith(s));
                if (indexFailure !== -1) {
                    singleFailUrls.splice(indexFailure, 1);
                    return Promise.resolve({ ok: false });
                }
                return Promise.resolve({
                    text: jest.fn().mockResolvedValue(response),
                    json: jest.fn().mockImplementation(() => JSON.parse(response)),
                    ok: true
                });
            }
        }
        throw new Error('url not in the list of mocked API results');
    })
);

export function simulateSingleFetchFailure(url: string | null = null) {
    if (url === null) {
        fetchMock.mockImplementationOnce(
            jest.fn().mockResolvedValue({ ok: false })
        );
    } else {
        singleFailUrls.push(url);
    }
}

export default fetchMock;