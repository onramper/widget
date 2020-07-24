import React, { useContext, useState, useEffect, useCallback } from 'react'
import stylesCommon from '../../styles.module.css'

import PickView from '../../PickView'

import InputText from '../../common/Input/InputText'
import ButtonAction from '../../common/ButtonAction'

import IconChevronRight from '../../icons/chevron_right.svg'

import { APIContext } from '../../context'
import { NavContext } from '../../wrappers/context'

type BodyWalletAddressType = {
    onActionButton: () => void
    handleInputChange: (name: string, value: any) => void
    isFilled: boolean
}

const BodyWalletAddress: React.FC<BodyWalletAddressType> = (props) => {
    const { handleInputChange, onActionButton, isFilled } = props
    const { collected, data } = useContext(APIContext)
    const [selectedAddress, setSelectedAddress] = useState('')
    const { nextScreen, backScreen } = useContext(NavContext);

    const selectedCrypto = data.availableCryptos[collected.selectedCrypto]
    let items: { name: string }[] = []
    if (collected.defaultAddrs[selectedCrypto.name])
        items = collected.defaultAddrs[selectedCrypto.name].map((item) => ({ name: item }))

    /* const loadedAddrs = items.map((item, i) => ({ ...item, icon: data.availableCryptos[collected.selectedCrypto].icon, name: `Address ${i + 1}: ${item.name}` })) */

    useEffect(() => {
        handleInputChange('walletAddress', selectedAddress)
    }, [selectedAddress, handleInputChange])

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
                <ButtonAction onClick={onActionButton} text='Continue' disabled={!isFilled} />
            </div>
        </main>
    )
}

BodyWalletAddress.defaultProps = {

}

export default BodyWalletAddress