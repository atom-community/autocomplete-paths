"use babel"

export const OptionScopes = {
  enableHtmlSupport: [
    {
      scopes: ["text.html.basic"],
      prefixes: ["src=['\"]", "href=['\"]", "name=['\"]"],
      extensions: ["js", "png", "gif", "jpeg", "jpg", "tiff", "html", "json", "svg"],
      relative: true,
    },
  ],
}
