import { redirect } from "next/navigation";

export enum ToastType {
  NOT_LOGGED_IN,
  NOT_ACTIVE_HOST,
}

export const toastMessages: Record<ToastType, { title: string; description: string }> = {
  [ToastType.NOT_LOGGED_IN]: {
    title: "You are not signed in",
    description: "This action requires you to be logged in",
  },
  [ToastType.NOT_ACTIVE_HOST]: {
    title: "You are not an active host",
    description: "Please go to the profile page and become an active host",
    
  },
};

export function redirectWithToast(href: string, toastType: ToastType) {
  return redirect(`${href}?toast=${toastType}`);
}

export function redirectToLogin() {
  return redirectWithToast("/sign-in", ToastType.NOT_LOGGED_IN);
}
