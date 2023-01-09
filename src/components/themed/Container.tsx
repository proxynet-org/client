import { View as DefaultView } from 'react-native';

export type ViewProps = DefaultView['props'];

export function Container(props: ViewProps) {
  const { style, ...otherProps } = props;

  return (
    <DefaultView
      style={[
        {
          backgroundColor: 'transparent',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
