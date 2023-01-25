import '@rneui/themed';

declare module '@rneui/themed' {
  export interface TextProps {
    bold?: boolean;
    center?: boolean;
  }

  export interface ComponentTheme {
    Text: Partial<TextProps>;
  }
}
