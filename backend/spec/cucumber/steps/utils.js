function getValidPayload(type) {
  const lowercaseType = type.toLowerCase();
  switch (lowercaseType) {
    case 'create user':
      return {
        email: 'user1@example.com',
        password: 'password123',
      };

    default:
      return undefined;
  }
}

export { getValidPayload };