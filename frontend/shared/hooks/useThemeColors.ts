import { useAppSelector } from 'shared/hooks';

export const useThemeColors = () => {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return {
    // Backgrounds
    backgroundColor: isDarkMode ? '#F2EAE0' : '#281109',
    cardBg: isDarkMode ? 'bg-light-cardback' : 'bg-[#442F29]/50',
    bgInput: isDarkMode ? 'bg-[#91837C]' : 'bg-[#584540]',
    inputBg: isDarkMode ? 'bg-[#91837C]' : 'bg-[#584540]',
    bgButton: isDarkMode ? 'bg-[#281109]' : 'bg-[#F2EAE0]',
    bgButton2: isDarkMode ? 'bg-[#281109]' : 'bg-[#F6D5C1]',
    buttonBg: isDarkMode ? 'bg-[#281109]' : 'bg-[#F2EAE0]',
    iconBg: isDarkMode ? 'bg-light-border' : 'bg-dark-border',
    progressColor: isDarkMode ? 'bg-[#281109]' : 'bg-[#F2EAE0]',
    modalBg: isDarkMode ? '#0F0A0A' : '#ffffff',

    // Text Colors
    textColor: isDarkMode ? '#32221E' : '#F2EAE0',
    titleColor: isDarkMode ? '#32221E' : '#D8C8B4',
    textPrimary: isDarkMode ? 'text-light-text1' : 'text-dark-text1',
    textSecondary: isDarkMode ? 'text-[#7B635A]' : 'text-[#ffffff]',
    textThird: isDarkMode ? 'text-[#ffffff]' : 'text-[#281109]',
    textthree: isDarkMode ? 'text-[#ffff]' : 'text-[#ffffff]',
    buttonTextColor: isDarkMode ? 'text-dark-text1' : 'text-light-text1',
    textButton1: isDarkMode ? 'text-[#F2EAE0]' : 'text-[#281109]',
    textButton2: isDarkMode ? 'text-[#F2EAE0]' : 'text-[#281109]',
    buttonText: isDarkMode ? 'text-dark-text1' : 'text-light-text1',
    modalText: isDarkMode ? '#ffffff' : '#281109',

    // Alternative text variants (for different screens)
    textSecondaryAlt: isDarkMode ? 'text-[#D8D3D0]' : 'text-[#D9D5D4]',
    textPrimaryAlt: isDarkMode ? 'text-light-text1' : 'text-[#F6D5C1]',
    buttonTextColorAlt: isDarkMode ? 'text-dark-text1' : 'text-[#FFFFFF]',

    // Icon Colors
    iconColor: isDarkMode ? '#281109' : '#F2EAE0',
    iconColorAlt: isDarkMode ? '#F2EAE0' : '#32221E',
    iconColorAlt2: isDarkMode ? '#32221E' : '#F2EAE0',
    placeholderColor: isDarkMode ? '#281109' : '#ffffff',

    // Borders
    border: isDarkMode ? 'border-[#281109]' : 'border-[#F2EAE0]',
    borderColor: isDarkMode ? 'border-light-border' : 'border-dark-border',

    // Status Colors
    correctColor: isDarkMode ? '#16A34A' : '#22C55E',
    dangerColor: isDarkMode ? '#871515' : '#EF4444',

    // Modal
    modalTint: (isDarkMode ? 'dark' : 'light') as 'dark' | 'light',
    modalBgPlace: isDarkMode ? '#F2EAE0' : '#281109',
    modalTextPlace: isDarkMode ? '#32221E' : '#F2EAE0',

    // Complex color object (ex: Profile Page)
    colors: {
      tailwind: {
        background: isDarkMode ? 'bg-[#F2EAE0]' : 'bg-[#281109]',
        cardBg: isDarkMode ? 'bg-[#8B7E78]' : 'bg-[#402B25]',
        itemBg: isDarkMode ? 'bg-[#F5F0ED]' : 'bg-[#5D4B46]',
        iconBg: isDarkMode ? 'bg-[#281109]' : 'bg-[#F2EAE0]',
        textPrimary: isDarkMode ? 'text-[#281109]' : 'text-[#F2EAE0]',
        textSecondary: isDarkMode ? 'text-[#A8958C]' : 'text-[#D8C8B4]',
        textReverse: isDarkMode ? 'text-[#F2EAE0]' : 'text-[#281109]',
        borderReverse: isDarkMode ? 'border-[#281109]' : 'border-[#F2EAE0]',
        textOnCard: isDarkMode ? 'text-[#281109]' : 'text-[#F2EAE0]',
        modalBg: isDarkMode ? 'bg-[#F2EAE0]' : 'bg-[#402B25]',
      },
      raw: {
        icon: isDarkMode ? '#281109' : '#F2EAE0',
        thumb: isDarkMode ? '#F2EAE0' : '#32221E',
        trackOff: '#32221E',
        trackOn: '#F2EAE0',
        modalBg: isDarkMode ? '#F2EAE0' : '#402B25',
        danger: isDarkMode ? '#871515' : '#EF4444',
      },
    },

    // Others
    isDarkMode,
  };
};
