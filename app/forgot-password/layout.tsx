import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Forgot Password | stokr",
    description: "Reset access to your stokr account.",
}

export default function ForgotPasswordLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
