import React from 'react';
import styled from 'styled-components/macro';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { citySetting, mainLabel, gridColor } from '../../utils/gameSettings';
import { HouseCityHall } from './housesSvg/HouseCityHall';
import { HouseGround } from './housesSvg/HouseGround';
import { HouseOfPlants } from './housesSvg/HouseOfPlants';
import useGridDrag from './hooks/useGridDrag';
import useHouseDrag from './hooks/useHouseDrag';

interface Props {
  row: { type: string; id: string }[];
  yIndex: number;
}

export const GridRow: React.FC<Props> = ({ row, yIndex }) => {
  const { gridLength, houseLength } = citySetting;
  const { gridsStatus, dragMode, scale } = useAppSelector(
    (state) => state.city
  );
  const dispatch = useAppDispatch();

  const { handleGridDragLeave, handleGridDragOver, handleGridDrop } =
    useGridDrag({
      dragMode,
      dispatch,
      gridsStatus,
    });

  const { handleHouseDragStart, handleHouseDragEnd } = useHouseDrag({
    dragMode,
    dispatch,
  });

  const renderHouse = (houseType: string) => {
    if (houseType === '市政廳') return <HouseCityHall />;
    const HouseComponent =
      mainLabel.find((label) => label.name === houseType)?.houseComponent ??
      HouseOfPlants;
    return <HouseComponent />;
  };

  return (
    <Wrapper key={yIndex}>
      {row.map((house, xIndex) => (
        <Grid
          $lengthAttrs={`${gridLength * scale}px`}
          $backgroundColor={gridColor[gridsStatus[yIndex][xIndex]]}
          key={xIndex}
          onDragLeave={handleGridDragLeave}
          onDragOver={(event) => handleGridDragOver(event, xIndex, yIndex)}
          onDrop={() => handleGridDrop(xIndex, yIndex)}
        >
          {house.type !== '' && (
            <>
              <HouseGround houseType={house.type} />
              <House
                $lengthAttrs={`${houseLength * scale}px`}
                $isdraggable={dragMode === 'houses'}
                draggable={dragMode === 'houses'}
                onDragStart={(event) =>
                  handleHouseDragStart(event, house, xIndex, yIndex)
                }
                onDragEnd={(event) => handleHouseDragEnd(event)}
              >
                {renderHouse(house.type)}
              </House>
            </>
          )}
        </Grid>
      ))}
    </Wrapper>
  );
};

interface GridProps {
  $lengthAttrs: string;
  $backgroundColor: 'lightgreen' | 'lightcarol' | '';
}

interface HouseProps {
  $lengthAttrs: string;
  $isdraggable: boolean;
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Grid = styled.div.attrs<GridProps>(({ $lengthAttrs }) => ({
  style: {
    width: $lengthAttrs,
    height: $lengthAttrs,
  },
}))<GridProps>`
  position: relative;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  display: flex;
  align-items: center;
  justify-content: center;
`;
const House = styled.div.attrs<HouseProps>(({ $lengthAttrs }) => ({
  style: {
    width: $lengthAttrs,
    height: $lengthAttrs,
  },
}))<HouseProps>`
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ $isdraggable }) => ($isdraggable ? 'grab' : '')};
  &:active {
    cursor: grabbing;
  }
`;
