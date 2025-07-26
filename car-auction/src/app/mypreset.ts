import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{slate.50}',
      100: '{slate.100}',
      200: '{slate.200}',
      300: '{slate.300}',
      400: '{slate.400}',
      500: '{slate.500}',
      600: '{slate.600}',
      700: '{slate.700}',
      800: '{slate.800}',
      900: '{slate.900}',
      950: '{slate.950}',
    },
  },
  components: {
    button: {
      root: {
        borderRadius: '0px',
      },
    },
    card: {
      root: {
        borderRadius: '0px',
      },
    },
    select: {
      root: {
        borderRadius: '0px',
      },
    },
    multiselect: {
      root: {
        borderRadius: '0px',
      },
    },
    togglebutton: {
      root: {
        borderRadius: '0px',
      },
    },
  },
});
