import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  displayCity,
  dropHouse,
  dragHouseStart,
  dragLightOn,
  dragLightOff,
} from '../../redux/reducers/cityArrangementSlice';

export const City: React.FC = () => {
  const cityBasicInfo = useAppSelector((state) => state.cityBasicInfo);
  const { housesPosition, gridsStatus, isHouseDraggable, scale } =
    useAppSelector((state) => state.cityArrangement);
  const dispatch = useAppDispatch();
  const gap = 20;
  const gridlength = 120;
  const wrapperWidth = (gridlength + gap) * housesPosition[0].length;

  useEffect(() => {
    dispatch(displayCity(cityBasicInfo));
  }, [cityBasicInfo, dispatch]);

  return (
    <>
      <CityRange
        $widthAttrs={`${wrapperWidth * scale}px`}
        $gap={gap}
        $scale={scale}
      >
        {housesPosition.map((row, yIndex) => {
          return (
            <Row
              key={yIndex}
              $paddingTopAttrs={`${gap * scale}px`}
              $gapAttrs={`${gap * scale}px`}
            >
              {row.map((house, xIndex) => {
                return (
                  <Grid
                    $lengthAttrs={`${gridlength * scale}px`}
                    $status={gridsStatus[yIndex][xIndex]}
                    key={xIndex}
                    // ref={testRef}
                    // onDragEnter={(e) => {
                    // }}
                    onDragLeave={(e) => dispatch(dragLightOff())}
                    onDragOver={(e) => {
                      e.preventDefault();
                      dispatch(dragLightOn({ xIndex, yIndex }));
                    }}
                    onDrop={(e) => {
                      dispatch(dropHouse({ xIndex, yIndex }));
                    }}
                  >
                    {house.type !== '' && (
                      <House
                        $lengthAttrs={`${100 * scale}px`}
                        $type={house.type}
                        draggable={isHouseDraggable}
                        onDragStart={(event: React.DragEvent) => {
                          if (isHouseDraggable) {
                            const target = event.target as HTMLDivElement;
                            target.style.opacity = '0.01';
                            console.log(house.id, house.type);
                            dispatch(
                              dragHouseStart({
                                id: house.id,
                                target: house.type,
                                pastIndex: { xIndex, yIndex },
                              })
                            );
                          }
                        }}
                        onDragEnd={(event: React.DragEvent) => {
                          const target = event.target as HTMLDivElement;
                          target.style.opacity = '1';
                        }}
                      >
                        {house.type}
                      </House>
                    )}
                  </Grid>
                );
              })}
            </Row>
          );
        })}
      </CityRange>
    </>
  );
};

type CityRangeProps = {
  $widthAttrs: string;
  $gap: number;
  $scale: number;
};
type RowProps = {
  $paddingTopAttrs: string;
  $gapAttrs: string;
};
type GridProps = {
  $lengthAttrs: string;
  $status: number;
};
type HouseProps = {
  $lengthAttrs: string;
  $type: string;
};

const CityWrapper = styled.div`
  width: 100vw;
  height: 100vh;
`;

const CityRange = styled.div.attrs<CityRangeProps>(({ $widthAttrs }) => ({
  style: {
    width: $widthAttrs,
  },
}))<CityRangeProps>`
  margin: auto;
  position: relative;
  border: 1px red solid;
  flex-wrap: wrap;
`;

const Row = styled.div.attrs<RowProps>(({ $paddingTopAttrs, $gapAttrs }) => ({
  style: {
    paddingTop: $paddingTopAttrs,
    gap: $gapAttrs,
  },
}))<RowProps>`
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
  border: 1px solid lightblue;
  background-color: ${({ $status }) =>
    $status === 1 ? 'lightgreen' : $status === -1 ? 'lightcoral' : ''};
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
  background-color: ${({ $type }) => {
    switch ($type) {
      case '食物': {
        return '#e46161';
      }
      case '飲料': {
        return '#f1b963';
      }
      case '交通': {
        return '#f8f398';
      }
      default: {
        return '#cbf078';
      }
    }
  }};
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
