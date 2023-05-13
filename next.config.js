module.exports = {
    trailingSlash: true,
    generateBuildId: async () => {
      // Generate unique build ID here
      return 'build-id';
    },
    output: 'export',
  };