import React from 'react';
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
      <ItemDisplay>
        <ItemIcon icon={faClipboard} />
        <ItemInput
          value={item}
          placeholder="(備註)"
          onChange={(e) => dispatch(itemKeyIn(e.target.value))}
        />
      </ItemDisplay>
    </>
  );
};

type LabelOptionProps = {
  $isChosen: boolean;
  $color: string;
};

const LabelOptions = styled.div`
  height: 15%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #ebebeb;
`;
const LabelOption = styled.div<LabelOptionProps>`
  width: 8%;
  height: 90%;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${({ $color }) => `${$color}`};
  background-color: ${({ $isChosen }) => ($isChosen ? '#FAFAFA' : '#ebebeb')};
  cursor: pointer;
  &:hover {
    background-color: #fafafa;
  }
`;
const LabelIcons = styled(FontAwesomeIcon)`
  height: 30px;
`;
const LabelText = styled.div`
  height: 32px;
  /* font-weight: bold; */
  display: flex;
  justify-content: center;
  align-items: center;
`;
const SubLabelOptions = styled.div`
  height: 10%;
  display: flex;
  align-items: center;
`;
const SubLabelOption = styled.div`
  height: 50%;
  margin-left: 15px;
  padding: 0 15px;
  border-radius: 19px;
  color: #808080;
  background-color: #e6e6e6;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ItemDisplay = styled.div`
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #808080;
  margin-left: 15px;
  border-bottom: 3px solid #e6e6e6;
`;
const ItemIcon = styled(FontAwesomeIcon)`
  height: 24px;
`;
const ItemInput = styled.input`
  height: 80%;
  width: 75%;
  padding-left: 15px;
  font-size: 24px;
  margin-right: auto;
  color: #808080;
  background-color: #f2f2f2;
`;
