import React from 'react'

export interface TableWrapperProps {
  children: React.ReactNode
}

export default function TableWrapper({ children }: TableWrapperProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table>{children}</table>
    </div>
  )
}
