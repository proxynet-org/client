import { forwardRef, useState } from 'react';
import { ViewProps, StyleSheet } from 'react-native';
import DefaultSlider, {
  SliderProps,
  SliderReferenceType,
} from '@react-native-community/slider';
import { MD3Theme, Text, TextProps, useTheme } from 'react-native-paper';
import { View } from './Themed';

type SliderPropsType = {
  viewStyle?: ViewProps['style'];
  viewProps?: ViewProps;
  label?: string;
  labelProps?: TextProps<Text>;
  labelStyle?: TextProps<Text>['style'];
  left?: React.ReactNode | ((value: number) => JSX.Element);
  right?: React.ReactNode | ((value: number) => JSX.Element);
  sliderProps?: SliderProps;
};

const makeStyle = (theme: MD3Theme) =>
  StyleSheet.create({
    viewStyle: {
      backgroundColor: theme.colors.primaryContainer,
    },
    sliderContainer: {
      flexDirection: 'row',
      height: 40,
      alignItems: 'center',
      backgroundColor: 'transparent',
    },
    slider: {
      flex: 1,
    },
  });

const Slider = forwardRef<SliderReferenceType, SliderPropsType>(
  (props, ref) => {
    const {
      viewProps,
      viewStyle,
      label,
      labelProps,
      labelStyle,
      left,
      right,
      sliderProps,
    } = props;

    const styles = makeStyle(useTheme());

    const [value, setValue] = useState(sliderProps?.value ?? 0);

    return (
      <View {...viewProps} style={[styles.viewStyle, viewStyle]}>
        {label && (
          <Text {...labelProps} style={labelStyle}>
            {label}
          </Text>
        )}
        <View style={styles.sliderContainer}>
          {left && (typeof left === 'function' ? left(value) : left)}
          <DefaultSlider
            {...sliderProps}
            ref={ref as SliderReferenceType}
            style={[styles.slider, sliderProps?.style]}
            onValueChange={setValue}
          />
          {right && (typeof right === 'function' ? right(value) : right)}
        </View>
      </View>
    );
  },
);

Slider.displayName = 'Slider';
Slider.defaultProps = {
  viewStyle: {},
  viewProps: {},
  label: '',
  labelProps: {
    children: '',
  },
  labelStyle: {},
  left: null,
  right: undefined,
  sliderProps: {},
};

export default Slider;
