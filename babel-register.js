require("@babel/register")({
  cache: false,
  extensions: [".js"],
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
        },
      },
    ]
  ],
});