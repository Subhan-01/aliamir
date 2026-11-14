/**
 * Shared facts. Every string below is taken from the live site (https://aliamir.com/).
 */
export const WA_ADVICE = { number: '+923313719834', href: 'https://wa.me/923313719834' } as const
export const WA_PM = { number: '+923268418063', href: 'https://wa.me/923268418063' } as const
export const PM_EMAIL = 'propertymanagementbyaliamir@gmail.com'

export const SOCIALS = [
  { label: 'Facebook', href: 'https://www.facebook.com/Propertyadvicesbyaliamir/' },
  { label: 'Instagram', href: 'https://www.instagram.com/PropertyAdvicesByAliAmir' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@propertyadvicesbyaliamir' },
] as const

export const NAV = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/property-management', label: 'Property Management' },
  { to: '/vision', label: 'Vision' },
  { to: '/contact', label: 'Contact' },
] as const

const publicAsset = (fileName: string) => `${import.meta.env.BASE_URL}assets/${fileName}`

/** The original logo artwork (black Urdu calligraphy) — used unmodified. */
export const LOGO = publicAsset('ali-amir-logo.png')

const LIVE = 'https://aliamir.com/assets/images'
/**
 * ali-pic-1 / ali-pic-5 ship with the project. The other portraits are loaded from the
 * live site until their files are copied into /public/assets (then just change the path).
 */
export const IMG = {
  hero: publicAsset('ali-pic-5.jpg'),
  who: publicAsset('ali-pic-1.jpg'),
  about: `${LIVE}/ali-amir.jpg`,
  gallery: [
    { src: publicAsset('ali-pic-1.jpg'), alt: 'Ali Amir Real Estate Pakistan' },
    { src: `${LIVE}/Ali-Amir_.jpg`, alt: 'Ali Amir Property Consultant' },
    { src: `${LIVE}/ali-pic-3.jpg`, alt: 'Ali Amir Advisory Session' },
    { src: `${LIVE}/Ali-Amir.jpg`, alt: 'Ali Amir Investor Meeting' },
    { src: publicAsset('ali-pic-5.jpg'), alt: 'Ali Amir Real Estate Expert' },
  ],
} as const
