import React, { useContext, useState, useEffect } from 'react'
import stylesCommon from '../../styles.module.css'

import InputText from '../../common/Input/InputText'
import ButtonAction from '../../common/ButtonAction'
import InfoBox from '../../common/InfoBox'

import { APIContext } from '../../context'

type BodyFormViewType = {
    onActionButton: () => void
    handleInputChange: (name: string, value: any) => void
    fields: {
        name: string;
        type: string
    }[]
    isFilled?: boolean
    isLoading?: boolean
    errorMsg?: string
    inputName?: string
}

const BodyFormView: React.FC<BodyFormViewType> = (props) => {
    const { handleInputChange, onActionButton, fields = [] } = props
    const { collected } = useContext(APIContext);
    const { isFilled = false, isLoading = false, errorMsg } = props

    const [errmsg, setErrorMsg] = useState(errorMsg)

    useEffect(() => {
        setErrorMsg(errorMsg)
    }, [errorMsg])

    return (
        <main className={stylesCommon.body}>
            {
                <div className={`${errmsg ? stylesCommon['body__child'] : ''}`}>
                    <InfoBox in={errmsg !== undefined} type='error' canBeDismissed onDismissClick={() => setErrorMsg(undefined)} >
                        {`${errmsg}.`}
                        <button className={stylesCommon['button--link']} onClick={() => console.log('Try again')} >Try again.</button>
                    </InfoBox>
                </div>
            }
            {
                fields.map((dataName, i) =>
                    <div key={i} className={`${stylesCommon['body__child']}`}>
                        <InputText name={dataName.name} value={collected[dataName.name]} onChange={handleInputChange} className={stylesCommon['body__child']} label={dataName.name.charAt(0).toUpperCase() + dataName.name.slice(1)} type={dataName.type} />
                    </div>
                )
            }
            <div className={`${stylesCommon['body__child']} ${stylesCommon['grow']}`}>
                <ButtonAction onClick={onActionButton} text={isLoading ? 'Sending...' : 'Continue'} disabled={!isFilled || isLoading} />
            </div>
        </main >
    )
}

BodyFormView.defaultProps = {

}

export default BodyFormView