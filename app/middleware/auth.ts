export default defineNuxtRouteMiddleware((to) => {
    const token = useCookie("adminToken");
     console.log("Token value:", token.value); // ← dagdag
    console.log("Route:", to.path); // ← dagdag

    if (!token.value) {
        return navigateTo("/login");
    }
});