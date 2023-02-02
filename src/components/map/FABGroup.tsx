import { useState, forwardRef, useImperativeHandle, useMemo } from 'react';
import { View } from 'react-native';
import { FAB, FABProps } from '@rneui/themed';

type Props = {
  fab: FABProps;
  fabs: FABProps[];
  containerStyle?: View['props']['style'];
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  space?: number;
};

export type FabGroupHandle = {
  show: () => void;
  hide: () => void;
};

export const FABGroup = forwardRef<FabGroupHandle, Props>(
  ({ fab, fabs, containerStyle, direction, space }, ref) => {
    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(true);

    const marginTop = useMemo(
      () => (direction === 'column' ? space : 0),
      [direction, space],
    );

    const marginBottom = useMemo(
      () => (direction === 'column-reverse' ? space : 0),
      [direction, space],
    );

    const marginLeft = useMemo(
      () => (direction === 'row' ? space : 0),
      [direction, space],
    );

    const marginRight = useMemo(
      () => (direction === 'row-reverse' ? space : 0),
      [direction, space],
    );

    useImperativeHandle(
      ref,
      () => ({
        show: () => setVisible(true),
        hide: () => {
          setOpen(false);
          setVisible(false);
        },
      }),
      [],
    );

    return (
      <View
        style={[
          {
            flexDirection: direction,
          },
          containerStyle,
        ]}
      >
        <FAB {...fab} onPress={() => setOpen(!open)} />
        {fabs.map((subFab, key) => (
          <FAB
            visible={visible && open}
            key={key}
            style={{
              zIndex: !visible || !open ? -1 : 0,
              marginLeft,
              marginRight,
              marginBottom,
              marginTop,
            }}
            {...subFab}
          />
        ))}
      </View>
    );
  },
);

FABGroup.displayName = 'FABGroup';
