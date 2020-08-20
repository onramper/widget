import React from 'react'
import { render, act } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import { APIContext, APIProvider } from '../index'
import { initialState } from '../initialState'
import response_gateways_empty from './data/empty_response.json'

import { fetchMock, simulateSingleFetchFailure, setFetchReturn } from '../../__mocks__/node-fetch';

var globalRef: any = global;

globalRef.fetch = fetchMock

const TestComponent: React.FC<{ attr?: string, contextAttr?: string, callback?: any, parameter?: any }> = ({ attr = '', contextAttr = '', callback }) => {
    const context = React.useContext(APIContext)

    const [error, setError] = React.useState<{ [key: string]: string }>()

    React.useEffect(() => {
        if (context.data.response_gateways && context[contextAttr]?.[attr] !== undefined) {
            callback(context[contextAttr][attr])
        }
    }, [attr, callback, context, context.data.response_gateways, contextAttr])

    React.useEffect(() => {
        if (error) callback(error)
    }, [callback, error])

    React.useEffect(() => {
        const gateways = async () => {
            const err = await context.apiInterface.init()
            if (err) setError(err)
        }
        gateways()
    }, [context.apiInterface, context.apiInterface.init])

    return null
}

describe('API context - defaultValues', () => {
    const components: [string, { [key: string]: any }, string, any][] = [
        ['default amount when it\'s a valid amount', { defaultAmount: 99 }, 'amount', 99],
        ['default amount when it\'s an invalid amount', { defaultAmount: -5 }, 'amount', initialState.collected.amount],
        ['default crypto when it\'s available', { defaultCrypto: 'ETH' }, 'selectedCrypto', { 'id': 'ETH' }],
        ['default crypto when it isn\'t available', { defaultCrypto: 'NEO' }, 'selectedCrypto', { 'id': 'BTC' }],
        ['default addresses', { defaultAddrs: { 'btc': ['addr1'] } }, 'defaultAddrs', { 'BTC': ['addr1'] }]
    ];

    for (const [name, props, attr, expectedResult] of components) {
        it(`Should set ${name}`, async (done) => {

            const callback = (data: any) => {
                try {
                    if (typeof data === 'object')
                        expect(data).toEqual(expect.objectContaining(expectedResult));
                    else
                        expect(data).toEqual(expectedResult);
                    done()
                } catch (error) {
                    done(error)
                }
            }

            const tree = (
                <APIProvider {...props}>
                    <TestComponent attr={attr} contextAttr={'collected'} callback={callback} />
                </APIProvider >
            )

            await act(async () => { render(tree) })
        })
    }
})


describe('API context - filters', () => {
    const components: [string, { [key: string]: any }, string, any][] = [
        ['no onlyCryptos filter applied', { filters: { onlyCryptos: undefined } }, 'availableCryptos', [{ id: 'BTC' }, { id: 'ETH' }]],
        ['available only one crypto', { filters: { onlyCryptos: ['btc'] } }, 'availableCryptos', [{ id: 'BTC' }]],
        ['available only one crypto (one of the filter no available)', { filters: { onlyCryptos: ['eth', ''] } }, 'availableCryptos', [{ id: 'ETH' }]],
        ['no excludeCryptos filter applied', { filters: { excludeCryptos: undefined } }, 'availableCryptos', [{ id: 'BTC' }, { id: 'ETH' }]],
        ['excluded one', { filters: { excludeCryptos: ['eth'] } }, 'availableCryptos', [{ id: 'BTC' }]],
        ['none excluded', { filters: { excludeCryptos: ['neo'] } }, 'availableCryptos', [{ id: 'BTC' }, { id: 'ETH' }]]
    ];

    for (const [name, props, attr, expectedResult] of components) {
        it(`Should be ${name}`, async (done) => {

            function callback(data: any) {
                try {
                    expect(data.length).toEqual(expectedResult.length);
                    data.forEach((res: any, i: number) => {
                        expect(res).toEqual(
                            expect.objectContaining(expectedResult[i])
                        );
                    });
                    done()
                } catch (error) {
                    done(error)
                }
            }

            const tree = (<APIProvider {...props} ><TestComponent attr={attr} contextAttr={'data'} callback={callback} /></APIProvider >)

            await act(async () => { render(tree) })
        })
    }
})

describe('API context - errors', () => {
    let components: [string, { [key: string]: any }, string | undefined, any, () => void][] = [
        ['NO_CRYPTOS error', { filters: { onlyCryptos: [''] } }, undefined, { 'GATEWAYS': { type: 'NO_CRYPTOS', message: expect.any(String) } }, () => null],
        ['NO_GATEWAYS error', {}, undefined, { 'GATEWAYS': { type: 'NO_GATEWAYS', message: expect.any(String) } }, () => setFetchReturn(JSON.stringify(response_gateways_empty))],
        ['API error', {}, undefined, { 'GATEWAYS': { type: 'API', message: expect.any(String) } }, simulateSingleFetchFailure],
    ];

    for (const [name, props, attr, expectedResult, setup] of components) {

        it(`Should be ${name}`, async (done) => {
            setup()
            function callback(data: any) {
                try {
                    expect(data).toEqual(expect.objectContaining(expectedResult));
                    done()
                } catch (error) {
                    done(error)
                }
            }

            const tree = (
                <APIProvider {...props}>
                    <TestComponent callback={callback} contextAttr={attr} />
                </APIProvider >
            )

            await act(async () => { render(tree) })
        })
    }

})