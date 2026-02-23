"use client"

interface AdminSectionHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
}

export function AdminSectionHeader({ title, description, children }: AdminSectionHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold">{title}</h2>
        {description != null && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children != null && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}
