import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from 'shared/hooks';

import { setLanguage } from './language.slice';

export const useLanguage = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector((state) => state.language?.currentLanguage || 'en');

  // Synchronize i18n with Redux on startup
  useEffect(() => {
    if (currentLanguage && i18n.language !== currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage, i18n]);

  const changeLanguage = (lang: string) => {
    dispatch(setLanguage(lang));
  };

  const getCurrentLanguageLabel = () => {
    switch (currentLanguage) {
      case 'fr':
        return 'Français';
      case 'en':
      default:
        return 'English(US)';
    }
  };

  return {
    t,
    currentLanguage,
    changeLanguage,
    getCurrentLanguageLabel,
  };
};
