declare module '@heroicons/react/outline' {
  import { ComponentType, SVGProps } from 'react';
  
  type Icon = ComponentType<SVGProps<SVGSVGElement>>;
  
  export const MenuIcon: Icon;
  export const XIcon: Icon;
  export const ShoppingBagIcon: Icon;
  export const MapPinIcon: Icon;
  export const PhoneIcon: Icon;
  
  // Add any additional icons you use here
}
