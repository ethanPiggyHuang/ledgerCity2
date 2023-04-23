import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  itemKeyIn,
  labelChooseMain,
  labelRetrieve,
} from '../../redux/reducers/ledgerSingleSlice';
import {
  mainLabels,
  labelColorCodes,
  subLabels,
} from '../../utils/gameSettings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUtensils,
  faMugHot,
  faTrainSubway,
  faShirt,
  faGamepad,
  faHouse,
  faMobileScreenButton,
  faBriefcaseMedical,
  faGift,
  faTags,
  faClipboard,
} from '@fortawesome/free-solid-svg-icons';

export const Label: React.FC = () => {
  const { labelMain, labelSubs, item } = useAppSelector(
    (state) => state.ledgerSingle.data
  );
  const dispatch = useAppDispatch();

  const labelChosen = labelMain === '' ? labelSubs : [labelMain, ...labelSubs];

  const labelIcons = [
    faUtensils,
    faMugHot,
    faTrainSubway,
    faShirt,
    faGamepad,
    faHouse,
    faMobileScreenButton,
    faBriefcaseMedical,
    faGift,
    faTags,
  ];

  useEffect(() => {
    //TODO: onSnapshot
    // dispatch(getCityInfo());
  }, []);
  // const time: DateConstructor = new Date();

  return (
    <>
      <LabelOptions>
        {mainLabels.map((label, index) => (
          <LabelOption
            key={index}
            $isChosen={labelMain === label}
            $color={labelColorCodes[index]}
            onClick={() => dispatch(labelChooseMain(label))}
          >
            <LabelIcons icon={labelIcons[index]} />
            <LabelText>{label}</LabelText>
          </LabelOption>
        ))}
      </LabelOptions>
      <ItemDisplay>
        <ItemIcon icon={faClipboard} />
        <ItemInput
          value={item}
          placeholder="(備註)"
          onChange={(e) => dispatch(itemKeyIn(e.target.value))}
        />
      </ItemDisplay>
      <SubLabelOptions>
        {subLabels[labelMain].map((subLabel) => (
          <SubLabelOption
            key={subLabel}
            onClick={() => dispatch(itemKeyIn(subLabel))}
          >
            {subLabel}
          </SubLabelOption>
        ))}
      </SubLabelOptions>
    </>
  );
};

type LabelOptionProps = {
  $isChosen: boolean;
  $color: string;
};

const LabelOptions = styled.div`
  height: 145px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ebebeb;
  gap: 18px;
`;
const LabelOption = styled.div<LabelOptionProps>`
  width: 57px;
  height: 117px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${({ $color }) => `${$color}`};
  background-color: ${({ $isChosen }) => ($isChosen ? '#FAFAFA' : '#ebebeb')};
`;
const LabelIcons = styled(FontAwesomeIcon)`
  height: 46px;
`;
const LabelText = styled.div`
  margin-top: 16px;
  height: 32px;
  font-size: 20px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ItemDisplay = styled.div`
  margin: 0 10px;
  height: 75px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #808080;
  padding-left: 20px;
  border-bottom: 3px solid #e6e6e6;
`;
const ItemIcon = styled(FontAwesomeIcon)`
  height: 40px;
`;
const ItemInput = styled.input`
  height: 80%;
  width: 75%;
  padding-left: 15px;
  font-size: 24px;
  margin-right: auto;
  margin-left: 30px;
  text-align: left;
  border: none;
  color: #808080;
  background-color: #f2f2f2;
`;
const SubLabelOptions = styled.div`
  height: 75px;
  display: flex;
  align-items: center;
`;
const SubLabelOption = styled.div`
  height: 38px;
  margin-left: 15px;
  padding: 0 38px;
  font-size: 20px;
  border-radius: 19px;
  color: #808080;
  background-color: #e6e6e6;
  display: flex;
  align-items: center;
  cursor: pointer;
`;
