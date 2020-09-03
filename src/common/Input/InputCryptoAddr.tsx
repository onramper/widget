import React, { useContext, useState, useEffect, useCallback } from 'react'

import PickView from '../../PickView'

import InputText from '../../common/Input/InputText'

import IconChevronRight from '../../icons/chevron-right.svg'

import { APIContext } from '../../ApiContext'
import { NavContext } from '../../NavContext'
import { ItemType } from '../../ApiContext'

type InputCryptoAddrType = {
    handleInputChange: (name: string, value: any) => void
    error?: string
    className: string
    type?: string
}

const InputCryptoAddr: React.FC<InputCryptoAddrType> = (props) => {
    const { handleInputChange, error, type } = props
    const { collected } = useContext(APIContext)
    const [selectedAddress, setSelectedAddress] = useState('')
    const { nextScreen, backScreen } = useContext(NavContext);

    const selectedCrypto = collected.selectedCrypto
    let items: ItemType[] = []
    if (selectedCrypto && collected.defaultAddrs[selectedCrypto.name])
        items = collected.defaultAddrs[selectedCrypto.name].map((addr) => ({ name: addr, id: addr }))

    useEffect(() => {
        handleInputChange('cryptocurrencyAddress', selectedAddress)
    }, [selectedAddress, handleInputChange])

    const handleAddressSelection = (name: string, index: number) => {
        setSelectedAddress(items[index].name)
        backScreen()
    }

    const onChange = useCallback((name: string, value: string) => {
        setSelectedAddress(value)
        handleInputChange(name, value)
    }, [handleInputChange])

    return (
        <InputText
            type={type}
            error={error}
            value={selectedAddress}
            icon={items.length > 0 ? IconChevronRight : undefined}
            iconPosition='end'
            onIconClick={() => nextScreen(<PickView onItemClick={handleAddressSelection} title="Select address" items={items} />)}
            name='cryptocurrencyAddress' onChange={onChange} className={props.className} label={`RECEIVER ${collected.selectedCrypto?.name} WALLET ADDRESS`} placeholder="" />
    )
}

export default InputCryptoAddr