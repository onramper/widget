import React, { useContext } from 'react'
import stylesCommon from '../../styles.module.css'

import InputText from '../../common/Input/InputText'
import ButtonAction from '../../common/ButtonAction'

import { APIContext } from '../../context'

type BodyFormViewType = {
    onActionButton: () => void
    handleInputChange: (name: string, value: any) => void
    fields: string[]
}

const BodyFormView: React.FC<BodyFormViewType> = (props) => {
    const { handleInputChange, onActionButton, fields = [] } = props

    const { collected } = useContext(APIContext);

    return (
        <main className={stylesCommon.body}>
            {
                fields.map((dataName, i) =>
                    <div key={i} className={`${stylesCommon['body__child']}`}>
                        <InputText name={dataName} value={collected[dataName]} onChange={handleInputChange} className={stylesCommon['body__child']} label={dataName} />
                    </div>
                )
            }
            <div className={`${stylesCommon['body__child']}`}>
                <ButtonAction onClick={onActionButton} text='Continue' />
            </div>
        </main>
    )
}

BodyFormView.defaultProps = {

}

export default BodyFormView