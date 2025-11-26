/**
 * Typography - Font families and text styles matching the prototype
 * Uses Raleway for body and Cinzel for headings
 */

export const fonts = {
  // Raleway - Primary body font
  body: 'Raleway_400Regular',
  bodyMedium: 'Raleway_500Medium',
  bodySemiBold: 'Raleway_600SemiBold',
  bodyBold: 'Raleway_700Bold',
  // Cinzel - Elegant heading font
  heading: 'Cinzel_400Regular',
  headingSemiBold: 'Cinzel_600SemiBold',
  headingBold: 'Cinzel_700Bold',
};

export const textStyles = {
  // Headings (Cinzel)
  h1: { fontFamily: fonts.headingBold, fontSize: 36, letterSpacing: 2, lineHeight: 44 },
  h2: { fontFamily: fonts.headingSemiBold, fontSize: 28, letterSpacing: 1.5, lineHeight: 36 },
  h3: { fontFamily: fonts.headingSemiBold, fontSize: 22, letterSpacing: 1, lineHeight: 28 },
  // Body text (Raleway)
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24 },
  bodyMedium: { fontFamily: fonts.bodyMedium, fontSize: 16, lineHeight: 24 },
  bodySemiBold: { fontFamily: fonts.bodySemiBold, fontSize: 16, lineHeight: 24 },
  bodyBold: { fontFamily: fonts.bodyBold, fontSize: 16, lineHeight: 24 },
  // Small text
  small: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20 },
  smallSemiBold: { fontFamily: fonts.bodySemiBold, fontSize: 14, lineHeight: 20 },
  // Captions
  caption: { fontFamily: fonts.bodyMedium, fontSize: 12, letterSpacing: 1, lineHeight: 16 },
  // Buttons
  button: { fontFamily: fonts.bodySemiBold, fontSize: 16, letterSpacing: 1 },
  buttonLarge: { fontFamily: fonts.bodySemiBold, fontSize: 18, letterSpacing: 1.5 },
};

export default { fonts, textStyles };
