import {
  faCheck,
  faClipboard,
  faReply,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled, { keyframes } from 'styled-components/macro';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  CHOOSE_LABEL,
  CLEAR_HOUSE,
  SUBMIT_LEDGER,
} from '../../redux/reducers/landingIntroSlice';
import { TYPE_ITEM } from '../../redux/reducers/ledgerSingleSlice';
import { mainLabels } from '../../utils/gameSettings';

export const LedgerDemo: React.FC = () => {
  const { chosenLabel, isTrying } = useAppSelector(
    (state) => state.landingIntro
  );
  const { item } = useAppSelector((state) => state.ledgerSingle.data);
  const dispatch = useAppDispatch();

  const demoLabels = mainLabels.slice(0, 3);

  const subLabels = mainLabels.find(
    (label) => label.name === chosenLabel
  )?.subLabels;

  return (
    <Wrapper>
      <LabelOptions>
        {demoLabels.map((label, index) => (
          <LabelOption
            key={index}
            $isChosen={chosenLabel === label.name}
            $color={label.colorCode}
            onClick={() =>
              dispatch(CHOOSE_LABEL(label.name as '食物' | '飲品' | '交通'))
            }
          >
            <LabelIcons icon={label.icon} />
            <LabelText>{label.name}</LabelText>
          </LabelOption>
        ))}
      </LabelOptions>
      <SubLabelOptions>
        {subLabels &&
          subLabels.map((subLabel) => (
            <SubLabelOption
              key={subLabel}
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
          placeholder="(消費品項)"
          onChange={(e) => dispatch(TYPE_ITEM(e.target.value))}
        />
      </ItemDisplay>
      <AmountText>{`$ 888`}</AmountText>
      <ConfirmRow>
        <ConfirmButton
          onClick={() => {
            dispatch(SUBMIT_LEDGER());
            setTimeout(() => dispatch(CLEAR_HOUSE()), 3000);
          }}
        >
          <CheckIcon icon={faCheck} />
        </ConfirmButton>
        <TryMeWrap $isShown={!isTrying}>
          <TryMeIcon icon={faReply} />
          <TryMeText>Try me</TryMeText>
        </TryMeWrap>
      </ConfirmRow>
    </Wrapper>
  );
};

type LabelOptionProps = {
  $isChosen: boolean;
  $color: string;
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: 40px;
  width: 100%;
  box-shadow: 1px 1px 5px #808080;
`;

const LabelOptions = styled.div`
  width: 100%;
  margin-left: auto;
  height: 90px;
  padding: 0 5px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #ebebeb;
`;
const LabelOption = styled.div<LabelOptionProps>`
  width: 30%;
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
  height: 60px;
  display: flex;
  gap: 15px;
  align-items: center;
`;
const SubLabelOption = styled.div`
  height: 50%;
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
  margin: 0 15px;
  border-bottom: 3px solid #e6e6e6;
`;
const ItemIcon = styled(FontAwesomeIcon)`
  height: 24px;
`;
const ItemInput = styled.input`
  height: 60px;
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

const AmountText = styled.p`
  line-height: 60px;
  height: 10%;
  margin: 0 15px;
  color: #808080;
  font-size: 28px;
  display: flex;
  align-items: center;
  color: #dabd7a;
`;

const ConfirmRow = styled.div`
  height: 60px;
  position: relative;
  width: 100%;
  padding-bottom: 10px;

  /* opacity: 0.5; */
  &:hover {
    filter: brightness(1.1);
  }
`;
const ConfirmButton = styled.div`
  padding: 0 30px;
  width: 30%;
  margin: auto;
  height: 100%;
  /* position: absolute; */
  bottom: 2%;
  margin-left: auto;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;

  background-color: #f2f2f2;
  z-index: 1;
  cursor: pointer;
  &:hover {
    background-color: #ffffff;
  }
`;

const CheckIcon = styled(FontAwesomeIcon)`
  color: #dabd7a;
  font-size: 28px;
`;

const tryMe = keyframes`
  0%{
    transform: translateX(0);
  }
  100%{
    transform: translateX(-20px);

  }
`;

type TryMeWrapProps = {
  $isShown: boolean;
};

const TryMeWrap = styled.div<TryMeWrapProps>`
  color: darkred;
  width: 40%;

  display: ${({ $isShown }) => ($isShown ? 'flex' : 'none')};
  position: absolute;
  top: 18px;
  right: -10%;
  animation: ${tryMe} 1.2s ease infinite alternate;
`;

const TryMeIcon = styled(FontAwesomeIcon)`
  padding-right: 5px;
  font-size: 24px;
`;

const TryMeText = styled.p`
  line-height: 24px;
  font-size: 16px;
`;
