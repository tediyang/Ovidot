module.exports = {
  apps: [
      {
          name: "ovidot",
          script: "app.js",
          env: {
              PORT: process.env.PORT || 5000,
          },
      },
  ],
};
