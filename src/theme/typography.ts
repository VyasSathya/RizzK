/**
 * Typography - Font families and text styles matching the prototype
 * Uses Raleway font family
 */

export const fonts = {
  body: 'Raleway_400Regular',
  bodyMedium: 'Raleway_500Medium',
  bodySemiBold: 'Raleway_600SemiBold',
  bodyBold: 'Raleway_700Bold',
  heading: 'Raleway_700Bold',
  headingSemiBold: 'Raleway_600SemiBold',
  headingBold: 'Raleway_700Bold',
};

export const textStyles = {
  h1: { fontFamily: fonts.headingBold, fontSize: 36, letterSpacing: 2, lineHeight: 44 },
  h2: { fontFamily: fonts.headingSemiBold, fontSize: 28, letterSpacing: 1.5, lineHeight: 36 },
  h3: { fontFamily: fonts.headingSemiBold, fontSize: 22, letterSpacing: 1, lineHeight: 28 },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24 },
  bodyMedium: { fontFamily: fonts.bodyMedium, fontSize: 16, lineHeight: 24 },
  bodySemiBold: { fontFamily: fonts.bodySemiBold, fontSize: 16, lineHeight: 24 },
  bodyBold: { fontFamily: fonts.bodyBold, fontSize: 16, lineHeight: 24 },
  small: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20 },
  smallSemiBold: { fontFamily: fonts.bodySemiBold, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: fonts.bodyMedium, fontSize: 12, letterSpacing: 1, lineHeight: 16 },
  button: { fontFamily: fonts.bodySemiBold, fontSize: 16, letterSpacing: 1 },
  buttonLarge: { fontFamily: fonts.bodySemiBold, fontSize: 18, letterSpacing: 1.5 },
};

export default { fonts, textStyles };
