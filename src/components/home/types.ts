export interface LinkItem {
  label: string;
  href: string;
  note: string;
  iconUrl?: string; // e.g. https://unavatar.io/twitter/[handle]
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface CursedInscription {
  label: string;
  href: string;
}

export interface FunnyMediaItem {
  src: string;
}
