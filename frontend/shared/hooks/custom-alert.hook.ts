import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import React, { useState, useCallback } from 'react';
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
        icon: React.createElement(MaterialIcons, {
          name: 'check-circle',
          size: 48,
          color: '#22C55E',
        }),
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
        icon: React.createElement(FontAwesome6, {
          name: 'triangle-exclamation',
          size: 48,
          color: '#EF4444',
        }),
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
        icon: React.createElement(FontAwesome6, {
          name: 'triangle-exclamation',
          size: 48,
          color: '#F59E0B',
        }),
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
        icon: React.createElement(FontAwesome6, {
          name: 'circle-question',
          size: 48,
          color: '#6B7280',
        }),
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
