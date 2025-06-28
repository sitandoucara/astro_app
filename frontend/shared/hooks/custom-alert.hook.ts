import { useState, useCallback } from 'react';
import { AlertAction } from 'shared/components/custom-alert.component';

export interface ShowAlertOptions {
  title: string;
  message?: string;
  actions?: AlertAction[];
  icon?: React.ReactNode;
}

export const useCustomAlert = () => {
  const [alertConfig, setAlertConfig] = useState<ShowAlertOptions & { visible: boolean }>({
    visible: false,
    title: '',
  });

  const showAlert = useCallback((options: ShowAlertOptions) => {
    setAlertConfig({
      ...options,
      visible: true,
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertConfig((prev) => ({
      ...prev,
      visible: false,
    }));
  }, []);

  // Convenience methods for different types of alerts
  const showSuccess = useCallback(
    (title: string, message?: string, actions?: AlertAction[]) => {
      showAlert({
        title,
        message,
        actions: actions || [{ text: 'OK', style: 'edit-style' }],
      });
    },
    [showAlert]
  );

  const showError = useCallback(
    (title: string, message?: string, actions?: AlertAction[]) => {
      showAlert({
        title,
        message,
        actions: actions || [{ text: 'OK', style: 'edit-style' }],
      });
    },
    [showAlert]
  );

  const showWarning = useCallback(
    (title: string, message?: string, actions?: AlertAction[]) => {
      showAlert({
        title,
        message,
        actions: actions || [{ text: 'OK', style: 'edit-style' }],
      });
    },
    [showAlert]
  );

  const showConfirm = useCallback(
    (
      title: string,
      message?: string,
      onConfirm?: () => void,
      onCancel?: () => void,
      confirmText: string = 'Confirm',
      cancelText: string = 'Cancel'
    ) => {
      showAlert({
        title,
        message,
        actions: [
          {
            text: cancelText,
            style: 'cancel',
            onPress: onCancel,
          },
          {
            text: confirmText,
            style: 'destructive',
            onPress: onConfirm,
          },
        ],
      });
    },
    [showAlert]
  );

  return {
    alertConfig,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showConfirm,
  };
};
