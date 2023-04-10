import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  itemKeyIn,
  labelChooseType,
  labelChoose,
  labelRetrieve,
} from '../../redux/reducers/ledgerSingleSlice';

export const Label: React.FC = () => {
  const { labelChoosingType, labelMain, labelSubs, item } = useAppSelector(
    (state) => state.ledgerSingle
  );
  const dispatch = useAppDispatch();

  const labelChosen = labelMain === '' ? labelSubs : [labelMain, ...labelSubs];
  // console.log(labelChoosing.type);

  useEffect(() => {
    //TODO: onSnapshot
    // dispatch(getCityInfo());
  }, []);
  // const time: DateConstructor = new Date();

  const labelArray: string[] = [
    '食物',
    '飲料',
    '交通',
    '服裝',
    '醫藥',
    '娛樂',
    '其他',
    '社交',
  ];

  return (
    <>
      <ItemDisplay>
        <LabelChosens>
          {labelChosen.length !== 0 &&
            labelChosen.map((name) => (
              <LabelChosen
                key={name}
                onClick={() => {
                  dispatch(labelRetrieve(name));
                }}
              >
                {name}
              </LabelChosen>
            ))}
        </LabelChosens>
        <ItemInput
          value={item}
          onChange={(e) => dispatch(itemKeyIn(e.target.value))}
        />
      </ItemDisplay>
      <LabelOptions>
        <LabelTypes>
          <LabelType
            $isChosen={labelChoosingType === 'main'}
            onClick={() => dispatch(labelChooseType('main'))}
          >
            主要標籤
          </LabelType>
          <LabelType
            $isChosen={labelChoosingType === 'sub'}
            onClick={() => dispatch(labelChooseType('sub'))}
          >
            次要標籤
          </LabelType>
        </LabelTypes>
        <LabelButtons>
          {labelArray.map((label, index) => (
            <LabelButton
              key={index}
              $isChosen={labelMain === label}
              onClick={() => dispatch(labelChoose(label))}
            >
              {label}
            </LabelButton>
          ))}
        </LabelButtons>
      </LabelOptions>
    </>
  );
};

type LabelTypeProps = {
  $isChosen: boolean;
};
type LabelButtonProps = {
  $isChosen: boolean;
};

const ItemDisplay = styled.div`
  margin: 10px auto 0;
  height: 20%;
  width: 90%;
  border: 1px solid lightblue;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 20px;
`;

const LabelChosens = styled.div`
  height: 80%;
  width: 20%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  gap: 5px;
`;
const LabelChosen = styled.div`
  width: 50px;
  height: 25px;
  border-radius: 5px;
  border: 1px solid lightblue;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: lightpink;
  cursor: pointer; //TODO: delete cursor icon
`;
const ItemInput = styled.input`
  height: 80%;
  width: 75%;
  padding-right: 15px;
  border: 1px solid lightblue;
  font-size: 20px;
  margin-left: auto;
  text-align: right;
`;

const LabelOptions = styled(ItemDisplay)`
  height: 35%;
  display: flex;
  justify-content: left;
  border: 1px solid lightblue;
`;
const LabelTypes = styled.div`
  height: 90%;
  width: 20%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  border: 1px solid lightblue;
`;
const LabelType = styled.div<LabelTypeProps>`
  height: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  border: 1px solid lightblue;
  cursor: pointer;
  background-color: ${({ $isChosen }) => ($isChosen ? 'lightblue' : '')};
`;
const LabelButtons = styled.div`
  height: 90%;
  width: 75%;
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  gap: 10px;
  border: 1px solid lightblue;
  margin-left: auto;
  padding: 10px 20px;
`;
const LabelButton = styled.div<LabelButtonProps>`
  height: 45px;
  width: 45px;
  border: 1px solid lightblue;
  margin-top: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: ${({ $isChosen }) => ($isChosen ? 'lightblue' : '')};
`;
