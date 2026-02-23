import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "./empty"

describe("Empty", () => {
  it("renders children and data-slot", () => {
    render(
      <Empty data-testid="empty-root">
        <span>Contenu vide</span>
      </Empty>
    )
    const root = screen.getByTestId("empty-root")
    expect(root).toBeInTheDocument()
    expect(root).toHaveAttribute("data-slot", "empty")
    expect(screen.getByText("Contenu vide")).toBeInTheDocument()
  })

  it("renders EmptyHeader, EmptyTitle, EmptyDescription with correct structure", () => {
    render(
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon" />
          <EmptyTitle>Titre de l&apos;état vide</EmptyTitle>
          <EmptyDescription>
            Description pour guider l&apos;utilisateur.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
    expect(screen.getByText("Titre de l'état vide")).toBeInTheDocument()
    expect(
      screen.getByText("Description pour guider l'utilisateur.")
    ).toBeInTheDocument()
    const header = document.querySelector("[data-slot='empty-header']")
    expect(header).toBeInTheDocument()
  })
})
