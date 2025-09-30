(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/[root-of-the-server]__dc15d093._.js", {

"[externals]/node:buffer [external] (node:buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}}),
"[project]/src/middleware.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// This file implements Next.js Middleware.
// Middleware allows you to run code on the server before a request is completed.
// It's useful for things like authentication, A/B testing, redirects, and more.
__turbopack_context__.s({
    "config": (()=>config),
    "middleware": (()=>middleware)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
;
function middleware(request) {
    // In its current state, this middleware does nothing but pass the request along.
    // It's a placeholder for future logic.
    // A real-world authentication check might look something like this:
    //
    // 1. Get the session token from the request cookies.
    // const sessionCookie = request.cookies.get('session');
    //
    // 2. If the cookie doesn't exist, redirect to the login page.
    // if (!sessionCookie) {
    //   const loginUrl = new URL('/login', request.url);
    //   return NextResponse.redirect(loginUrl);
    // }
    //
    // 3. Verify the token with a backend service (e.g., Firebase Auth).
    // const isValid = await verifyToken(sessionCookie.value);
    //
    // 4. If the token is invalid, redirect to login.
    // if (!isValid) {
    //   ...
    // }
    // `NextResponse.next()` continues the request lifecycle.
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    // The `matcher` property takes an array of path patterns.
    // Here, it's configured to run for any path inside `/blog/admin` and `/dashboard`.
    // The `:path*` part is a wildcard that matches all sub-paths.
    matcher: [
        '/blog/admin/:path*',
        '/dashboard/:path*'
    ]
};
}}),
}]);

//# sourceMappingURL=%5Broot-of-the-server%5D__dc15d093._.js.map