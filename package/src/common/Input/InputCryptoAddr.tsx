import React, { useContext, useEffect, useCallback } from 'react'

import InputText from '../../common/Input/InputText'

import { APIContext } from '../../ApiContext'

type InputCryptoAddrType = {
    handleInputChange: (name: string, value: any) => void
    error?: string
    className: string
    type?: string
    hint?: string
    onHelpClick?: () => void
    disabled?: boolean
}

const InputCryptoAddr = React.forwardRef<HTMLDivElement, InputCryptoAddrType>((props, ref) => {
    const { handleInputChange, error, type, hint, disabled = false } = props
    const { collected } = useContext(APIContext)

    useEffect(() => {
        handleInputChange('cryptocurrencyAddress', collected.defaultAddrs[collected.selectedCrypto?.id ?? ''] ?? '')
    }, [collected.defaultAddrs, collected.selectedCrypto, handleInputChange])

    const onChange = useCallback((name: string, value: string) => {
        handleInputChange(name, value)
    }, [handleInputChange])

    return (
        <InputText
            ref={ref}
            hint={hint}
            type={type}
            error={error}
            value={collected.cryptocurrencyAddress ?? ''}
            iconPosition='end'
            name='cryptocurrencyAddress' onChange={onChange} className={props.className}
            label={`Your ${collected.selectedCrypto?.name} wallet address`}
            disabled={disabled && !!collected.defaultAddrs[collected.selectedCrypto?.id ?? '']}
        />
    )
})

export default InputCryptoAddr
