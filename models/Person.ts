export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  photoUri?: string;
  phoneNumbers: string[];
  emails: string[];
  circleIds: string[];
  tags: string[];
  notes: string;
  connectionIds: string[];
  createdAt: number;
  updatedAt: number;
}

export type PersonCreate = Pick<Person, 'firstName' | 'lastName'> &
  Partial<Omit<Person, 'id' | 'firstName' | 'lastName' | 'createdAt' | 'updatedAt'>>;

export function getFullName(person: Person): string {
  return `${person.firstName} ${person.lastName}`.trim();
}

export function getInitials(person: Person): string {
  const first = person.firstName[0] ?? '';
  const last = person.lastName[0] ?? '';
  return `${first}${last}`.toUpperCase();
}
