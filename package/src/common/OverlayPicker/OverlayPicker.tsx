import React from 'react';

import { OverlayPickerProps } from './OverlayPicker.models';
import OverlayView from '../OverlayView/OverlayView';
import List from '../ListRedesign/List';

const PickView: React.FC<OverlayPickerProps> = (props) => {
  const { onItemClick = () => null,  name = '' } = props;

  return (
    <OverlayView title={props.title}>
      <List 
        onItemClick={(index, item) => onItemClick(name, index, item)} 
        items={props.items} 
        searchable={!!props.searchable} 
      />
    </OverlayView>
  );
};

export default PickView;
