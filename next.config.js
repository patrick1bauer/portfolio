module.exports = {
  trailingSlash: true,
  generateBuildId: async () => {
    return "build-id";
  },
  output: "export",
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ["localhost:3000"],
};
