export interface DropdownChildren {
  label: string
  value: string | number
}

export interface DropdownOption extends DropdownChildren {
  isOpen?: boolean
  children: DropdownChildren[]
}

export type Mode = 'top' | 'bottom'
