export interface ChildProfile {
  readonly id: string
  readonly nickname: string
  readonly birthDate: string
  readonly completedItems: readonly string[]
}

export interface FamilyProfile {
  readonly id: string
  readonly children: readonly ChildProfile[]
  readonly createdAt: string
  readonly updatedAt: string
}

const STORAGE_KEY = "sukusuku-family"

export function generateId(): string {
  return crypto.randomUUID()
}

function isSSR(): boolean {
  return typeof window === "undefined"
}

function now(): string {
  return new Date().toISOString()
}

export function getFamilyProfile(): FamilyProfile | null {
  if (isSSR()) {
    return null
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return null
    }
    return JSON.parse(raw) as FamilyProfile
  } catch {
    return null
  }
}

export function saveFamilyProfile(profile: FamilyProfile): void {
  if (isSSR()) {
    return
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  } catch {
    // Ignore localStorage errors (quota exceeded, private browsing, etc.)
  }
}

export function createFamilyProfile(): FamilyProfile {
  const timestamp = now()
  return {
    id: generateId(),
    children: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

export function addChild(
  profile: FamilyProfile,
  nickname: string,
  birthDate: string
): FamilyProfile {
  const child: ChildProfile = {
    id: generateId(),
    nickname,
    birthDate,
    completedItems: [],
  }

  return {
    ...profile,
    children: [...profile.children, child],
    updatedAt: now(),
  }
}

export function removeChild(
  profile: FamilyProfile,
  childId: string
): FamilyProfile {
  return {
    ...profile,
    children: profile.children.filter((child) => child.id !== childId),
    updatedAt: now(),
  }
}

export function toggleChecklistItem(
  profile: FamilyProfile,
  childId: string,
  itemId: string
): FamilyProfile {
  return {
    ...profile,
    children: profile.children.map((child) => {
      if (child.id !== childId) {
        return child
      }

      const hasItem = child.completedItems.includes(itemId)

      return {
        ...child,
        completedItems: hasItem
          ? child.completedItems.filter((id) => id !== itemId)
          : [...child.completedItems, itemId],
      }
    }),
    updatedAt: now(),
  }
}

export function getChildAge(birthDate: string): {
  years: number
  months: number
} {
  const birth = new Date(birthDate)
  const today = new Date()

  let years = today.getFullYear() - birth.getFullYear()
  let months = today.getMonth() - birth.getMonth()

  if (today.getDate() < birth.getDate()) {
    months -= 1
  }

  if (months < 0) {
    years -= 1
    months += 12
  }

  return { years, months }
}
