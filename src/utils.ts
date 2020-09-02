export const copyToClipBoard = async (text: string, copied: (status: boolean, text: string) => void) => {
    try {
        await navigator.clipboard.writeText(text);
        copied(true, text);
    } catch (err) {
        copied(false, text);
    }
};

export const arrayUnique = (array: any[]) => {
    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
}

export const arrayObjUnique = (array: any[], attrFilter: string) => {
    return array.filter((value: any, index: number, self: any) => self.findIndex((el: any) => el[attrFilter] === value[attrFilter]) === index)
}


export const toMaxDecimalsFloor = (n: number | string, decimals: number) => {
    const amount = typeof n === 'string' ? Number(n.replace(',', '.')) : n
    let factor = Number('1e' + decimals)
    let nRound = Math.floor((amount) * factor) / factor
    return !isFinite(nRound) ? 0 : nRound
}

export const toMaxDecimalsRound = (n: number | string, decimals: number) => {
    const amount = typeof n === 'string' ? Number(n.replace(',', '.')) : n
    let factor = Number('1e' + decimals)
    let nRound = Math.round((amount) * factor) / factor
    return !isFinite(nRound) ? 0 : nRound
}

const ordredMagnitudes = [
    { magnitude: 'seconds', magnitudeShort: 's', factor: 1 },
    { magnitude: 'minutes', magnitudeShort: 'm', factor: 60 },
    { magnitude: 'hours', magnitudeShort: 'h', factor: 3600 },
    { magnitude: 'days', magnitudeShort: 'd', factor: 86400 },
]
export const formatSeconds = (s: number) => {
    let value = s
    var i = 0
    for (i; i < ordredMagnitudes.length; i++) {
        let nextValue = s / ordredMagnitudes[i].factor
        if (nextValue < 1) break
        value = nextValue
    }
    return {
        n: value,
        magnitude: ordredMagnitudes[i - 1].magnitude,
        magnitudeShort: ordredMagnitudes[i - 1].magnitudeShort
    }
}

window.opener = { ...window.opener, formatSeconds }

//ADD TYPES
/* export function usePromise(promiseOrFunction, defaultValue) {
    const [state, setState] = React.useState({ value: defaultValue, error: null, isPending: true })

    React.useEffect(() => {
        const promise = (typeof promiseOrFunction === 'function')
            ? promiseOrFunction()
            : promiseOrFunction

        let isSubscribed = true
        promise
            .then(value => isSubscribed ? setState({ value, error: null, isPending: false }) : null)
            .catch(error => isSubscribed ? setState({ value: defaultValue, error: error, isPending: false }) : null)

        return () => (isSubscribed = false)
    }, [promiseOrFunction, defaultValue])

    const { value, error, isPending } = state
    return [value, error, isPending]
} */