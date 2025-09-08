import type { ThemeTypes } from '@/types/themeTypes/ThemeType';

const PurpleTheme: ThemeTypes = {
    name: 'PurpleTheme',
    dark: false,
    variables: {
        'border-color': '#eeeeee',
        'carousel-control-size': 10
    },
    colors: {
        primary: '#1d3d90',
        secondary: '#49BEFF',
        info: '#539BFF',
        success: '#13DEB9',
        accent: '#FFAB91',
        warning: '#FFAE1F',
        error: '#ee4238',
        muted:'#5a6a85',
        lightprimary: '#ECF2FF',
        lightsecondary: '#E8F7FF',
        lightsuccess: '#E6FFFA',
        lighterror: '#FDEDE8',
        lightwarning: '#FEF5E5',
        grey: '#7f7f7f',
        textPrimary: '#2A3547',
        textSecondary: '#2A3547',
        borderColor: '#e5eaef',
        inputBorder: '#000',
        containerBg: '#ffffff',
        hoverColor: '#f6f9fc',
        surface: '#fff',
        'on-surface-variant': '#fff',
        grey100: '#F2F6FA',
        grey200: '#EAEFF4'
    }
};
export { PurpleTheme};
