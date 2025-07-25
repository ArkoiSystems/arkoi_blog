import { AnchorHTMLAttributes } from 'react'
import Link, { LinkProps } from 'next/link'

export type CustomLinkProps = LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>

export default function CustomLink({ href, ...rest }: CustomLinkProps) {
  const isInternalLink = href && href.startsWith('/')
  const isAnchorLink = href && href.startsWith('#')

  if (isInternalLink) {
    return <Link className="break-words" href={href} {...rest} />
  }

  if (isAnchorLink) {
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return <a className="break-words" href={href} {...rest} />
  }

  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a className="break-words" target="_blank" rel="noopener noreferrer" href={href} {...rest} />
  )
}
