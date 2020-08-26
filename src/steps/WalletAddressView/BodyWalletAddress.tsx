import React from 'react'
import stylesCommon from '../../styles.module.css'

import ButtonAction from '../../common/ButtonAction'

import InputCryptoAddr from '../../common/Input/InputCryptoAddr'

type BodyWalletAddressType = {
    onActionButton: () => void
    handleInputChange: (name: string, value: any) => void
    isFilled: boolean
    isLoading?: boolean
}

const BodyWalletAddress: React.FC<BodyWalletAddressType> = (props) => {
    const { handleInputChange, onActionButton, isFilled, isLoading = false } = props

    return (
        <main className={stylesCommon.body}>
            <InputCryptoAddr className={stylesCommon['body__child']} handleInputChange={handleInputChange} />
            <div className={`${stylesCommon['body__child']} ${stylesCommon.grow}`}>
                <ButtonAction onClick={onActionButton} text={isLoading ? 'Creating transaction...' : 'Continue'} disabled={!isFilled} />
            </div>
        </main>
    )
}

BodyWalletAddress.defaultProps = {

}

export default BodyWalletAddress