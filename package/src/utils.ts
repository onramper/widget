import i18next from 'i18next';

export const copyToClipBoard = async (text: string, copied: (status: boolean, text: string) => void) => {
    try {
        await navigator.clipboard.writeText(text);
        copied(true, text);
    } catch (err) {
        copied(false, text);
    }
};

export const arrayUnique = (array: any[]) => {
    const a = array.concat();
    for (let i = 0; i < a.length; ++i) {
        for (let j = i + 1; j < a.length; ++j) {
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
    const factor = Number('1e' + decimals)
    const nRound = Math.floor((amount) * factor) / factor
    return !isFinite(nRound) ? 0 : nRound
}

export const toMaxDecimalsRound = (n: number | string, decimals: number) => {
    const amount = typeof n === 'string' ? Number(n.replace(',', '.')) : n
    const factor = Number('1e' + decimals)
    const nRound = Math.round((amount) * factor) / factor
    return !isFinite(nRound) ? 0 : nRound
}

const orderedMagnitudes = [
    { magnitude: i18next.t('timeMagnitudes.second'), magnitudeShort: 's', factor: 1 },
    { magnitude: i18next.t('timeMagnitudes.minute'), magnitudeShort: 'm', factor: 60 },
    { magnitude: i18next.t('timeMagnitudes.hour'), magnitudeShort: 'h', factor: 3600 },
    { magnitude: i18next.t('timeMagnitudes.day'), magnitudeShort: 'd', factor: 86400 }
];
export const formatSeconds = (s: number) => {
    let value = s
    let i = 0
    for (i; i < orderedMagnitudes.length; i++) {
        const nextValue = s / orderedMagnitudes[i].factor
        if (nextValue < 1) break
        value = nextValue
    }
    return {
        n: value,
        magnitude: orderedMagnitudes[i - 1].magnitude,
        magnitudeShort: orderedMagnitudes[i - 1].magnitudeShort
    }
}

export const scrollTo = (element: HTMLElement | null, to: number, duration: number) => {
    //t = current time
    //b = start value
    //c = change in value
    //d = duration
    const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    };

    if (element === null) return
    const start = element.scrollTop
    const change = to - start
    let currentTime = 0
    const increment = 20;

    const animateScroll = function () {
        currentTime += increment;
        const val = easeInOutQuad(currentTime, start, change, duration);
        element.scrollTop = val;
        if (currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
}

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
