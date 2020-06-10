// dev is the default value (in case no stage is set)
const domain = process.env.REACT_APP_STAGE === "prod"? "onramper.com": "onramper.dev"

export default {
  domain,
  api: `api.${domain}`,
  widget: `widget.${domain}`,
}
