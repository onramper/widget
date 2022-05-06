import React, { useContext, useState, useEffect } from 'react';
import Header from '../../common/Header'
import BodyPickOption from './BodyPickOptionView'
import styles from '../../styles.module.css'
import Step from '../Step'

import { NextStep } from '../../ApiContext'

import { NavContext } from '../../NavContext'

const PickOptionView: React.FC<{ nextStep: NextStep & { type: 'pickOne' } }> = ({ nextStep }) => {
  const { nextScreen } = useContext(NavContext);
  const [isFilled, setIsFilled] = useState(false)

  const nextStepOptions = nextStep.options || []

  const [selectedOption, setSelectedOption] = useState(nextStepOptions[0])
  let infoMsg: any = useState(nextStep.description)
  if (!nextStep.description) {
    infoMsg = 'Choose one option'
  }

  const handleButtonAction = async () => {
    nextScreen(<Step nextStep={selectedOption.nextStep} />)
  }

  const handleOptionChange = (i: number) => {
    setSelectedOption(nextStepOptions[i])
  }

  useEffect(() => {
    setIsFilled(selectedOption !== undefined)
  }, [selectedOption])

  return (
    <div className={styles.view}>
      <Header title={nextStep.title ?? "Choose identity document"} backButton />
      <BodyPickOption
        steps={nextStepOptions}
        onActionButton={handleButtonAction}
        handleOptionChange={handleOptionChange}
        infoMsg={infoMsg}
        isFilled={isFilled}
      />
    </div>
  );
};

export default PickOptionView;
