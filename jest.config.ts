const { getJestProjects } = require('@nx/jest');

export default {
  projects: [...getJestProjects(), '<rootDir>/e2e/react-elementor-e2e'],
};
