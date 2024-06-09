export function getPageTitle(title?: string): string {
  const mainTitle = '陈梓聪的代码实验室'

  return title ? `${title} - ${mainTitle}` : mainTitle
}
