export interface NavigationItem {
  readonly href: string;
  readonly labelKey: string;
}

export const publicNavigation: readonly NavigationItem[] = [
  {
    href: "/courses",
    labelKey: "courses",
  },
  {
    href: "/how-it-works",
    labelKey: "howItWorks",
  },
  {
    href: "/for-instructors",
    labelKey: "forInstructors",
  },
  {
    href: "/about",
    labelKey: "about",
  },
];

export const appNavigation: readonly NavigationItem[] = [
  {
    href: "/app/courses",
    labelKey: "courses",
  },
  {
    href: "/app/progress",
    labelKey: "progress",
  },
];