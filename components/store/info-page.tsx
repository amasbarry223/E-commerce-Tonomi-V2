"use client"

import Link from "next/link"
import { useNavigationStore } from "@/lib/store-context"
import { PAGES } from "@/lib/routes"
import { SECTION_CONTAINER } from "@/lib/layout"
import { INFO_PAGES, isFaqPage, type InfoPageKey } from "@/lib/content/info-pages"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  ChevronRight,
  Info,
  Truck,
  RotateCcw,
  FileText,
  Shield,
  HelpCircle,
  ArrowLeft,
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const INFO_PAGE_KEYS: InfoPageKey[] = [
  "about",
  "delivery",
  "returns",
  "terms",
  "privacy",
  "faq",
]

const INFO_PAGE_ICONS: Record<InfoPageKey, React.ComponentType<{ className?: string }>> = {
  about: Info,
  delivery: Truck,
  returns: RotateCcw,
  terms: FileText,
  privacy: Shield,
  faq: HelpCircle,
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

export function InfoPage() {
  const { currentPage, navigate } = useNavigationStore()

  const pageKey = INFO_PAGE_KEYS.includes(currentPage as InfoPageKey)
    ? (currentPage as InfoPageKey)
    : null

  if (!pageKey) {
    return (
      <div className={cn(SECTION_CONTAINER, "py-12")}>
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h1 className="text-xl font-semibold text-foreground">Page non trouvée</h1>
          <p className="text-muted-foreground text-sm">
            Cette page d&apos;informations n&apos;existe pas ou a été déplacée.
          </p>
          <Button variant="outline" asChild>
            <Link href="/">Retour à l&apos;accueil</Link>
          </Button>
        </div>
      </div>
    )
  }

  const content = INFO_PAGES[pageKey]
  const Icon = INFO_PAGE_ICONS[pageKey]

  return (
    <div className={cn(SECTION_CONTAINER, "py-8 sm:py-12")}>
      <div className="mx-auto max-w-3xl">
        {/* Breadcrumb — aligné comme les autres pages */}
        <nav aria-label="Fil d'Ariane" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <li>
              <button
                type="button"
                onClick={() => navigate(PAGES.store.home)}
                className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                Accueil
              </button>
            </li>
            <li aria-hidden className="flex items-center">
              <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
            </li>
            <li className="text-foreground font-medium" aria-current="page">
              {content.title}
            </li>
          </ol>
        </nav>

        {/* Titre centré — cohérent avec les pages type compte / contenu */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
            <Icon className="h-6 w-6" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {content.title}
          </h1>
        </div>

        {/* Contenu centré */}
        <main>
          {isFaqPage(content) ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              <Accordion type="single" collapsible className="w-full space-y-2">
                {content.items.map((item, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <AccordionItem
                      value={`faq-${index}`}
                      className="border rounded-xl bg-card px-4 shadow-sm transition-shadow hover:shadow-md data-[state=open]:border-primary/30 data-[state=open]:shadow-md"
                    >
                      <AccordionTrigger className="py-5 text-left font-medium hover:no-underline [&[data-state=open]]:text-primary">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed pb-5 pt-0">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-5"
            >
              {content.sections.map((section, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="overflow-hidden border bg-card shadow-sm transition-shadow hover:shadow-md">
                    <CardHeader className="pb-2">
                      <h2 className="font-semibold text-foreground text-lg leading-tight">
                        {section.title}
                      </h2>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {section.content}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Pied de page centré — Retour + Autres pages */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10 pt-8 border-t border-border flex flex-col items-center gap-6 text-center"
          >
            <Button
              variant="ghost"
              className="gap-2"
              asChild
            >
              <Link
                href="/"
                onClick={(e) => {
                  e.preventDefault()
                  navigate(PAGES.store.home)
                }}
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à l&apos;accueil
              </Link>
            </Button>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
                Autres pages
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {INFO_PAGE_KEYS.filter((k) => k !== pageKey).map((key) => (
                  <Button
                    key={key}
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="rounded-full text-xs font-medium"
                    onClick={() => navigate(PAGES.store[key])}
                  >
                    {INFO_PAGES[key].title}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}
