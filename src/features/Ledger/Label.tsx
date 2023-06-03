import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components/macro';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  CHOOSE_LABEL,
  TYPE_ITEM,
} from '../../redux/reducers/ledgerSingleSlice';
import { mainLabels } from '../../utils/gameSettings';

export const Label: React.FC = () => {
  const { labelMain, item } = useAppSelector(
    (state) => state.ledgerSingle.data
  );
  const dispatch = useAppDispatch();

  return (
    <>
      <LabelOptions>
        {mainLabels.map((label, index) => (
          <LabelOption
            key={index}
            $isChosen={labelMain === label.name}
            $color={label.colorCode}
            onClick={() => dispatch(CHOOSE_LABEL(label.name))}
          >
            <LabelIcons icon={label.icon} />
            <LabelText>{label.name}</LabelText>
          </LabelOption>
        ))}
      </LabelOptions>
      <SubLabelOptions>
        {mainLabels
          .find((label) => label.name === labelMain)
          ?.subLabels.map((subLabel, index) => (
            <SubLabelOption
              key={index}
              onClick={() => dispatch(TYPE_ITEM(subLabel))}
            >
              {`${subLabel}`}
            </SubLabelOption>
          ))}
      </SubLabelOptions>
      <ItemDisplay>
        <ItemIcon icon={faClipboard} />
        <ItemInput
          type="text"
          value={item}
          placeholder="（可增加註記）"
          size={10}
          onChange={(e) => dispatch(TYPE_ITEM(e.target.value))}
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
  height: 12%;
  padding: 0 5px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #ebebeb;
`;
const LabelOption = styled.div<LabelOptionProps>`
  width: 9%;
  height: 66px;
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
  &:active {
    filter: brightness(1.1);
  }
`;
const LabelIcons = styled(FontAwesomeIcon)`
  font-size: 24px;
`;
const LabelText = styled.div`
  height: 24px;
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
  &:hover {
    filter: brightness(0.95);
  }
  &:active {
    filter: brightness(1.1);
  }
`;

const ItemDisplay = styled.div`
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #808080;
  margin: 0 15px;
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
  ::placeholder {
    color: #c8c8c8;
  }
`;
