import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/(api|trpc)(.*)", "/", "/hosts/(.*)", "/search" /* '/profile/((?!edit).*)' */],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
