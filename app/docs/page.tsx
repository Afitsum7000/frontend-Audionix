import { Metadata } from "next"
import { DocsSidebar } from "@/components/docs/docs-sidebar"
import { DocsContent } from "@/components/docs/docs-content"
import { MobileDocsNav } from "@/components/docs/mobile-docs-nav"

export const metadata: Metadata = {
  title: "API Documentation - AUDIONIX Voice to Text",
  description: "Learn how to integrate the AUDIONIX Speech-to-Text API into your applications.",
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DocsSidebar />
      <MobileDocsNav />
      <div className="lg:pt-0 pt-14">
        <DocsContent />
      </div>
    </div>
  )
}
