import { Mail, Github, Linkedin } from './Icons'

export const SocialIcons = {
  mail: Mail,
  github: Github,
  linkedin: Linkedin,
}

export interface SocialIconProps {
  kind: keyof typeof SocialIcons
  href: string | undefined
  size?: number
}

export default function SocialIcon({ kind, href, size = 8 }: SocialIconProps) {
  if (
    !href ||
    (kind === 'mail' && !/^mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(href))
  )
    return null

  const SocialSvg = SocialIcons[kind]

  return (
    <a
      className="text-sm text-gray-500 transition hover:text-gray-600"
      target="_blank"
      rel="noopener noreferrer"
      href={href}
    >
      <span className="sr-only">{kind}</span>
      <SocialSvg
        className={`hover:text-primary-500 dark:hover:text-primary-400 fill-current text-gray-700 dark:text-gray-200 h-${size} w-${size}`}
      />
    </a>
  )
}
