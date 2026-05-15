'use client'

import React from 'react'

type FormSectionProps = {
  title: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function FormSection({
  title,
  required,
  children,
  className = '',
}: FormSectionProps) {
  return (
    <section
      className={`rounded-lg border border-gray-200 bg-white px-6 py-5 shadow-sm ${className}`}
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {title}
        {required ? <span className="text-red-500 ml-0.5">*</span> : null}
      </h2>
      {children}
    </section>
  )
}
