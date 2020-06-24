const getExpectedCrypto = async (amount: number) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return amount * 0.0001073
}


export {
    getExpectedCrypto
}