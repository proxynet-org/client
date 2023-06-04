import { FAB, FABGroupProps, useTheme } from 'react-native-paper';
import useToggle from '@/hooks/useToggle';

type Props = {
  icon: (open: boolean) => string;
  actions: FABGroupProps['actions'];
};

export default function FabGroup({ icon, actions }: Props) {
  const [open, toggleOpen] = useToggle(false);
  const { colors } = useTheme();

  const styledActions = actions.map((action) => ({
    ...action,
    color: colors.onSurface,
    labelTextColor: colors.onSurface,
    containerStyle: {
      backgroundColor: colors.surface,
    },
    style: {
      backgroundColor: colors.surface,
    },
  }));

  return (
    <FAB.Group
      backdropColor={colors.backdrop}
      open={open}
      visible
      icon={icon(open)}
      actions={styledActions}
      onStateChange={toggleOpen}
    />
  );
}
