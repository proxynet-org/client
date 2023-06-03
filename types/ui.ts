export type SnackbarState = {
  open: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration: number;
};
