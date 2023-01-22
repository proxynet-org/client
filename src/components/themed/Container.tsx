import { View as DefaultView } from 'react-native';

export type ViewProps = DefaultView['props'];

export function Container(props: ViewProps) {
  const { style, ...otherProps } = props;

  return (
    <DefaultView
      style={[
        {
          flex: 1,
          backgroundColor: 'transparent',
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
