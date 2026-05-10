export type ShareTemplateId =
  | "instagram-story"
  | "instagram-feed"
  | "x-twitter"
  | "linkedin"
  | "tiktok-reels"

export type ShareTemplate = {
  id: ShareTemplateId
  label: string
  width: number
  height: number
  description: string
}

export const SHARE_TEMPLATES: ShareTemplate[] = [
  {
    id: "instagram-story",
    label: "Instagram Story",
    width: 1080,
    height: 1920,
    description: "Vertical story format with score, bull case, bear case, and top risks.",
  },
  {
    id: "instagram-feed",
    label: "Instagram Feed",
    width: 1080,
    height: 1350,
    description: "Tall feed post with summary, score, bull vs bear, and risks.",
  },
  {
    id: "x-twitter",
    label: "X / Twitter",
    width: 1600,
    height: 900,
    description: "Wide compact card for timeline sharing.",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    width: 1200,
    height: 1500,
    description: "Professional research snapshot with disclaimer.",
  },
  {
    id: "tiktok-reels",
    label: "TikTok / Reels",
    width: 1080,
    height: 1920,
    description: "Vertical short-form card with a focused research hook.",
  },
]

export function getShareTemplate(templateId: ShareTemplateId) {
  return SHARE_TEMPLATES.find((template) => template.id === templateId) || SHARE_TEMPLATES[0]
}
