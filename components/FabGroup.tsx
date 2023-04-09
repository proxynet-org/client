import { useToggle } from 'usehooks-ts';
import { FAB, FABGroupProps, useTheme } from 'react-native-paper';

type Props = {
  icon: (open: boolean) => string;
  actions: FABGroupProps['actions'];
};

export default function FabGroup({ icon, actions }: Props) {
  const [open, toggleOpen] = useToggle(false);
  const { colors } = useTheme();

  const styledActions = actions.map((action) => ({
    ...action,
    labelTextColor: colors.onSecondary,
  }));

  return (
    <FAB.Group
      backdropColor={colors.backdrop}
      open={open}
      visible
      icon={icon(open)}
      actions={styledActions}
      onStateChange={toggleOpen}
      onPress={() => {
        if (open) {
          // do something if the speed dial is open
        }
      }}
    />
  );
}
