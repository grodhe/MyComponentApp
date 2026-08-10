// Public URL your app is (or will be) reachable at. Used to build the URLs
// encoded in printed QR codes -- e.g. the QR on a drawer's label opens
// `${PUBLIC_APP_BASE_URL}/location/6` in whatever browser scans it, and a
// component's label opens `${PUBLIC_APP_BASE_URL}/components/6`.
//
// Reads from the VITE_PUBLIC_APP_BASE_URL environment variable, so moving
// this app to a different server/domain is a one-line change in a .env
// file instead of editing source code -- see .env.example. Vite only reads
// env vars at BUILD time (this gets baked into the compiled JS), so after
// changing it you need to rebuild, not just restart.
export const PUBLIC_APP_BASE_URL =
    import.meta.env.VITE_PUBLIC_APP_BASE_URL || "https://rodhelind.se/hobbyist";
