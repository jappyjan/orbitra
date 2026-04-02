import { getFullName, getInitials, Person, PersonCreate } from '../Person';

function makePerson(overrides: Partial<Person> = {}): Person {
  return {
    id: 'test-id',
    firstName: 'Jane',
    lastName: 'Doe',
    phoneNumbers: [],
    emails: [],
    circleIds: [],
    tags: [],
    notes: '',
    connectionIds: [],
    createdAt: 1000,
    updatedAt: 1000,
    ...overrides,
  };
}

describe('getFullName', () => {
  it('returns first and last name joined by space', () => {
    const person = makePerson({ firstName: 'Alice', lastName: 'Smith' });
    expect(getFullName(person)).toBe('Alice Smith');
  });

  it('trims whitespace when lastName is empty', () => {
    const person = makePerson({ firstName: 'Alice', lastName: '' });
    expect(getFullName(person)).toBe('Alice');
  });

  it('trims whitespace when firstName is empty', () => {
    const person = makePerson({ firstName: '', lastName: 'Smith' });
    expect(getFullName(person)).toBe('Smith');
  });

  it('returns empty string when both names are empty', () => {
    const person = makePerson({ firstName: '', lastName: '' });
    expect(getFullName(person)).toBe('');
  });

  it('handles names with extra whitespace', () => {
    const person = makePerson({ firstName: ' Bob ', lastName: ' Jones ' });
    // trim only trims the combined result: " Bob  Jones " -> "Bob   Jones" (inner spaces preserved)
    expect(getFullName(person)).toBe('Bob   Jones');
  });
});

describe('getInitials', () => {
  it('returns uppercase initials from first and last name', () => {
    const person = makePerson({ firstName: 'jane', lastName: 'doe' });
    expect(getInitials(person)).toBe('JD');
  });

  it('returns single initial when lastName is empty', () => {
    const person = makePerson({ firstName: 'Alice', lastName: '' });
    expect(getInitials(person)).toBe('A');
  });

  it('returns single initial when firstName is empty', () => {
    const person = makePerson({ firstName: '', lastName: 'Smith' });
    expect(getInitials(person)).toBe('S');
  });

  it('returns empty string when both names are empty', () => {
    const person = makePerson({ firstName: '', lastName: '' });
    expect(getInitials(person)).toBe('');
  });

  it('handles lowercase names by uppercasing', () => {
    const person = makePerson({ firstName: 'alice', lastName: 'smith' });
    expect(getInitials(person)).toBe('AS');
  });

  it('handles unicode first characters', () => {
    const person = makePerson({ firstName: 'Ötzi', lastName: 'Ünter' });
    expect(getInitials(person)).toBe('ÖÜ');
  });
});

describe('Person interface', () => {
  it('can create a valid Person object', () => {
    const person = makePerson();
    expect(person.id).toBe('test-id');
    expect(person.firstName).toBe('Jane');
    expect(person.lastName).toBe('Doe');
    expect(person.phoneNumbers).toEqual([]);
    expect(person.emails).toEqual([]);
    expect(person.circleIds).toEqual([]);
    expect(person.tags).toEqual([]);
    expect(person.notes).toBe('');
    expect(person.connectionIds).toEqual([]);
    expect(person.createdAt).toBe(1000);
    expect(person.updatedAt).toBe(1000);
  });

  it('supports optional photoUri', () => {
    const withPhoto = makePerson({ photoUri: 'file:///photo.jpg' });
    expect(withPhoto.photoUri).toBe('file:///photo.jpg');

    const withoutPhoto = makePerson();
    expect(withoutPhoto.photoUri).toBeUndefined();
  });

  it('supports arrays for phoneNumbers and emails', () => {
    const person = makePerson({
      phoneNumbers: ['+1234567890', '+0987654321'],
      emails: ['alice@example.com', 'alice@work.com'],
    });
    expect(person.phoneNumbers).toHaveLength(2);
    expect(person.emails).toHaveLength(2);
  });
});

describe('PersonCreate type', () => {
  it('requires firstName and lastName, allows optional fields', () => {
    const create: PersonCreate = {
      firstName: 'Bob',
      lastName: 'Builder',
    };
    expect(create.firstName).toBe('Bob');
    expect(create.lastName).toBe('Builder');
  });

  it('accepts optional Person fields except id and timestamps', () => {
    const create: PersonCreate = {
      firstName: 'Bob',
      lastName: 'Builder',
      phoneNumbers: ['+1111111111'],
      emails: ['bob@build.com'],
      circleIds: ['circle-work'],
      tags: ['builder', 'hero'],
      notes: 'Can he fix it?',
      connectionIds: ['other-id'],
      photoUri: 'file:///bob.jpg',
    };
    expect(create.tags).toEqual(['builder', 'hero']);
    expect(create.notes).toBe('Can he fix it?');
  });
});
