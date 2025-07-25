import { slug } from 'github-slugger'
import Link from 'next/link'

export interface TagProps {
  text: string
}

export default function Tag({ text }: TagProps) {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 mr-3 text-sm font-medium uppercase"
    >
      {text.split(' ').join('-')}
    </Link>
  )
}
