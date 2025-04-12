/**
 * User test fixtures
 */

export const user1 = {
  _id: 'user123',
  email: 'john.doe@example.com',
  username: 'johndoe',
  password: '$2a$10$FEBywZh8u9M0Cec/0mWep.1kXrwKeiWDba6tdKvDfEBjyePJnDT7K', // hashed "password123"
  firstName: 'John',
  lastName: 'Doe',
  profilePicture: 'https://example.com/profiles/johndoe.jpg',
  isVerified: true,
  relationshipIds: ['relationship123', 'relationship456'],
  createdAt: new Date('2022-01-01'),
  updatedAt: new Date('2022-01-01'),
};

export const user2 = {
  _id: 'user456',
  email: 'jane.smith@example.com',
  username: 'janesmith',
  password: '$2a$10$XdvNkfdNIL8F8xsuIjYwU.RPbNMup.verwsEX.npEAZZ.BDa.MZKi', // hashed "securepass"
  firstName: 'Jane',
  lastName: 'Smith',
  profilePicture: 'https://example.com/profiles/janesmith.jpg',
  isVerified: true,
  relationshipIds: ['relationship789'],
  createdAt: new Date('2022-02-15'),
  updatedAt: new Date('2022-02-15'),
};

export const user3 = {
  _id: 'user789',
  email: 'alex.johnson@example.com',
  username: 'alexj',
  password: '$2a$10$IbfPoCGdLLHh1hyQ9b.4BOJ6ZMwmtt.tK.qpki3XP3zUtF5EL1zKO', // hashed "alexpass"
  firstName: 'Alex',
  lastName: 'Johnson',
  profilePicture: null,
  isVerified: false,
  relationshipIds: [],
  createdAt: new Date('2022-03-20'),
  updatedAt: new Date('2022-03-20'),
};

export const newUserData = {
  email: 'new.user@example.com',
  username: 'newuser',
  password: 'newpass123',
  firstName: 'New',
  lastName: 'User',
};

export const invalidUserData = {
  email: 'invalid-email',
  username: '',
  password: '123', // too short
  firstName: '',
  lastName: '',
};

/**
 * Test fixture for user data
 * Contains sample client and lawyer users for testing authentication and role-based access
 */

export const clientUser = {
  _id: '60d0fe4f5311236168a109ca',
  name: 'John Client',
  email: 'client@example.com',
  password: 'securepassword123',
  role: 'client',
  createdAt: new Date('2023-01-01T00:00:00Z'),
  updatedAt: new Date('2023-01-01T00:00:00Z')
};

export const lawyerUser = {
  _id: '60d0fe4f5311236168a109cb',
  name: 'Laura Lawyer',
  email: 'lawyer@example.com',
  password: 'securepassword456',
  role: 'lawyer',
  createdAt: new Date('2023-01-01T00:00:00Z'),
  updatedAt: new Date('2023-01-01T00:00:00Z')
};

export const anotherClientUser = {
  _id: '60d0fe4f5311236168a109cc',
  name: 'Jane Client',
  email: 'jane@example.com',
  password: 'securepassword789',
  role: 'client',
  createdAt: new Date('2023-01-01T00:00:00Z'),
  updatedAt: new Date('2023-01-01T00:00:00Z')
};

// Mock user data with hashed password (for mocking the DB response)
export const clientUserWithHashedPassword = {
  ...clientUser,
  password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LG1dXGV.tKGYxlrFgzxZUpSWIRE/2P.'
};

export const lawyerUserWithHashedPassword = {
  ...lawyerUser,
  password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LG1dXGV.tKGYxlrFgzxZUpSWIRE/2P.'
};

// Sample user registration data
export const validUserRegistration = {
  name: 'New User',
  email: 'newuser@example.com',
  password: 'securepassword123',
  role: 'client'
};

export const invalidUserRegistration = {
  name: 'In',
  email: 'notavalidemail',
  password: 'short',
  role: 'invalid'
}; 