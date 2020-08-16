import React, { useContext, useState, useEffect } from 'react';
import Header from '../../common/Header'
import Footer from '../../common/Footer'
import BodyPickOption from './BodyPickOptionView'
import styles from '../../styles.module.css'
import Step from '../Step'

import { NextStep } from '../../common/types'

import { NavContext } from '../../wrappers/context'

const PickOptionView: React.FC<{ nextStep: NextStep }> = ({ nextStep }) => {
  const { nextScreen } = useContext(NavContext);
  const [isFilled, setIsFilled] = useState(false)

  const nextStepOptions = nextStep.options || []

  const [selectedOption, setSelectedOption] = useState(nextStepOptions[0])
  const infoMsg = 'Choose one option'

  const handleButtonAction = async () => {
    nextScreen(<Step {...selectedOption} />)
  }

  const handleOptionChange = (i: number) => {
    setSelectedOption(nextStepOptions[i])
  }

  useEffect(() => {
    setIsFilled(selectedOption !== undefined ? true : false)
  }, [selectedOption])

  return (
    <div className={styles.view}>
      <Header title="Purchase form" backButton />
      <BodyPickOption
        steps={nextStepOptions}
        onActionButton={handleButtonAction}
        handleOptionChange={handleOptionChange}
        infoMsg={infoMsg}
        isFilled={isFilled}
      />
      <Footer />
    </div>
  );
};

export default PickOptionView;