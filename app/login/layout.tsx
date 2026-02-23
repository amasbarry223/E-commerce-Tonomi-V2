import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Connexion administrateur",
  description: "Connectez-vous pour accéder au tableau de bord. L'accès au dashboard nécessite une authentification administrateur.",
  robots: "noindex, nofollow",
}

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
