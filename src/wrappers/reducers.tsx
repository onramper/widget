type ActionMap<M extends { [index: string]: any }> = {
    [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
    }
    : {
        type: Key;
        screen: M[Key];
    }
};

type screenType = React.ReactNode;

export enum Types {
    Push = 'PUSH',
    Pop = 'POP'
}

type ShoppingCartPayload = {
    [Types.Push]: screenType;
    [Types.Pop]: undefined;
}

export type ShoppingCartActions = ActionMap<ShoppingCartPayload>[keyof ActionMap<ShoppingCartPayload>];

export const shoppingCartReducer = (state: screenType[], action: ShoppingCartActions) => {
    switch (action.type) {
        case Types.Push:
            return [...state, action.screen];
        case Types.Pop:
            return [...state.slice(0, -1)];
    }
}