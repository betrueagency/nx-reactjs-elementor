const { getJestProjects } = require('@nrwl/jest');

export default {
  projects: [...getJestProjects(), '<rootDir>/e2e/react-elementor-e2e'],
};
