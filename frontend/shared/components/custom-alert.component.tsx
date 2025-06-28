import { FontAwesome6 } from '@expo/vector-icons';
import React from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInUp, SlideOutDown } from 'react-native-reanimated';
import { useThemeColors } from 'shared/theme/theme-color.hook';

export interface AlertAction {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'destructive' | 'cancel' | 'edit-style';
  loading?: boolean;
}

export interface CustomAlertProps {
  visible: boolean;
  title: string;
  message?: string;
  actions?: AlertAction[];
  onClose?: () => void;
  icon?: React.ReactNode;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  actions = [{ text: 'OK', style: 'default' }],
  onClose,
  icon,
}) => {
  const colors = useThemeColors();

  const handleBackdropPress = () => {
    if (onClose) {
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(200)}
        className="flex-1 items-center justify-center bg-black/50 p-4">
        <TouchableOpacity
          className="absolute inset-0"
          activeOpacity={1}
          onPress={handleBackdropPress}
        />

        <Animated.View
          entering={SlideInUp.duration(400).springify().damping(18).stiffness(120).mass(0.8)}
          exiting={SlideOutDown.duration(250).springify().damping(15).stiffness(150)}
          className={`w-full max-w-sm rounded-xl p-6 ${colors.colors.tailwind.modalBg}`}
          style={{ backgroundColor: colors.colors.raw.modalBg }}>
          <View className="mb-4 items-center">
            {icon || (
              <FontAwesome6
                name="triangle-exclamation"
                size={48}
                color={colors.colors.raw.danger}
              />
            )}
          </View>

          {/* Title */}
          <Text
            className={`text-aref mb-2 text-center text-lg font-bold ${colors.colors.tailwind.textOnCard}`}>
            {title}
          </Text>

          {/* Message */}
          {message && (
            <Text className={`text-aref mb-6 text-center ${colors.colors.tailwind.textOnCard}`}>
              {message}
            </Text>
          )}

          {/* Actions... */}
          <View className="flex-row gap-2">
            {actions.map((action, index) => {
              if (action.style === 'edit-style') {
                // Style edit (ok)
                return (
                  <View key={index} className="flex-1 rounded-full border-2 border-stone-600 p-2">
                    <TouchableOpacity
                      onPress={() => {
                        if (action.onPress) {
                          action.onPress();
                        }
                        if (onClose) {
                          onClose();
                        }
                      }}
                      activeOpacity={0.8}
                      disabled={action.loading}
                      className={`shadow-opacity-30 elevation-1 rounded-full ${colors.buttonBg} py-2 shadow-md shadow-light-text2 ${action.loading ? 'opacity-50' : ''}`}>
                      {action.loading ? (
                        <ActivityIndicator color={colors.buttonText} size="small" />
                      ) : (
                        <Text
                          className={`text-aref text-center text-base font-bold tracking-wide ${colors.buttonText}`}>
                          {action.text}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                );
              }

              // Default styles for others
              return (
                <TouchableOpacity
                  key={index}
                  className={`flex-1 rounded-lg p-3 ${
                    action.style === 'destructive'
                      ? 'bg-red-600'
                      : action.style === 'cancel'
                        ? `border ${colors.colors.tailwind.borderReverse}`
                        : 'bg-blue-600'
                  }`}
                  onPress={() => {
                    if (action.onPress) {
                      action.onPress();
                    }
                    if (onClose && action.style !== 'destructive') {
                      onClose();
                    }
                  }}
                  disabled={action.loading}
                  activeOpacity={0.8}>
                  {action.loading ? (
                    <ActivityIndicator
                      color={action.style === 'cancel' ? colors.colors.raw.icon : 'white'}
                      size="small"
                    />
                  ) : (
                    <Text
                      className={`text-aref text-center font-medium ${
                        action.style === 'cancel' ? colors.colors.tailwind.textOnCard : 'text-white'
                      }`}>
                      {action.text}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};
