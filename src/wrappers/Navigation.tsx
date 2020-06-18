import React, { useState, useReducer } from 'react'
import BuyCryptoView from '../BuyCryptoView'
import ChooseGatewayView from '../ChooseGatewayView'
import PickCryptoScreen from '../PickCryptoScreen'

type ProductType = {
    id: number;
    name: string;
    price: number;
}

type InitialStateType = {
    products: ProductType[];
    shoppingCart: number;
}

const initialState: InitialStateType = {
    products: [],
    shoppingCart: 0,
}

const AppContext = React.createContext<{
    state: InitialStateType;
    dispatch: React.Dispatch<any>;
}>({
    state: initialState,
    dispatch: () => null
});

function productReducer(products: any, action: any) {

}

function shoppingCartReducer(products: any, action: any) {

}

const mainReducer = ({ products, shoppingCart }: InitialStateType, action: any) => ({
    products: productReducer(products, action),
    shoppingCart: shoppingCartReducer(shoppingCart, action),
});

const steps: screenType[] = []

type screenType = {
    render: JSX.Element;
}

const defaultScreens = [{
    'render': <BuyCryptoView />
}]

export const NavigationContext = React.createContext<{
    state: screenType[]; dispatch: React.Dispatch<any>;
}>({
    state: defaultScreens,
    dispatch: () => null
})

function mainReducehr(state: screenType[], action: { type: string, newScreen: screenType }) {
    switch (action.type) {
        case 'push':
            return [...state, action.newScreen]
        case 'pop':
            return [...state.slice(0, -1)]
    }
}

export const NavigationProvider: React.FC = (props) => {
    /* const [state, dispatch] = useReducer(mainReducer, initialState as InitialStateType); */



    const [navigationState, setNavigationState] = useState<screenType[]>([])
    /* const [navigationStsate, dispatch] = useReducer(mainReducer, defaultScreens) */


    return (
        <>
            <button onClick={() => { setNavigationState(old => [...old, steps[1]]) }}>add</button>
            <button onClick={() => { setNavigationState(old => [...old.slice(0, -1)]) }}>delete</button>
           {/*  <NavigationContext.Provider value={defaultScreens}>
                {navigationState.map(screen => screen.render)}
            </NavigationContext.Provider> */}
        </>
    )
}