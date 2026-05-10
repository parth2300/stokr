import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Reset Password | stokr",
    description: "Choose a new password for your stokr account.",
}

export default function ResetPasswordLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
