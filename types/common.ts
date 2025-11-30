import { Home, LucideIcon, User } from "lucide-react";

export enum userType {
  ADMIN,
  CUSTOMER,
  SERVICE_CENTER,
}
export type linksType = {
  label: string;
  href: string;
  icon: string;
};

export const iconsMap: Record<string, React.ComponentType<any>> = {
  home: Home,
  user: User,
};
