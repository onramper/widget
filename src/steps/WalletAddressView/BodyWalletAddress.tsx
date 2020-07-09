import React, { useContext, useState, useEffect, useCallback } from 'react'
import stylesCommon from '../../styles.module.css'

import PickView from '../../PickView'

import InputText from '../../common/Input/InputText'

import IconChevronRight from '../../icons/chevron_right.svg'

import { APIContext } from '../../wrappers/APIContext'
import { NavContext } from '../../wrappers/context'

type BodyWalletAddressType = {
    onButtonAction: () => void
    handleInputChange: (name: string, value: any) => void
}

const BodyWalletAddress: React.FC<BodyWalletAddressType> = (props) => {
    const { handleInputChange, onButtonAction } = props
    const { collected, data, inputInterface } = useContext(APIContext)
    const { walletAddress } = collected
    const [selectedAddress, setSelectedAddress] = useState(walletAddress)
    const { collectData } = inputInterface
    const { nextScreen, backScreen } = useContext(NavContext);
    const items = [
        {
            name: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
        },
        {
            name: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2'
        }
    ]

    /* const loadedAddrs = items.map((item, i) => ({ ...item, icon: data.availableCryptos[collected.selectedCrypto].icon, name: `Address ${i + 1}: ${item.name}` })) */

    useEffect(() => {
        collectData('walletAddress', selectedAddress)
    }, [selectedAddress, collectData])

    const handleAddressSelection = (index: number) => {
        setSelectedAddress(items[index].name)
        backScreen()
    }

    const onChange = useCallback((name: string, value: string) => {
        setSelectedAddress(value)
        handleInputChange(name, value)
    }, [handleInputChange])

    return (
        <main className={stylesCommon.body}>
            <InputText
                value={selectedAddress}
                icon={items.length > 0 ? IconChevronRight : undefined}
                iconPosition='end'
                onIconClick={() => nextScreen(<PickView onItemClick={handleAddressSelection} title="Select address" items={items} />)}
                name='walletAddress' onChange={onChange} className={stylesCommon['body__child']} label={`RECEIVER ${data.availableCryptos[collected.selectedCrypto].name} WALLET ADDRESS`} placeholder="" />
            <div className={`${stylesCommon['body__child']} ${stylesCommon.grow}`}>
                <button onClick={onButtonAction} className={`${stylesCommon['button-action']}`}>Continue</button>
            </div>
        </main>
    )
}

BodyWalletAddress.defaultProps = {

}

export default BodyWalletAddress