import React from "react";
import { useTranslation } from "react-i18next";
import classes from "./styles.module.css";
import commonClasses from "./../../styles.module.css";
import LogoOnramper from "../../icons/onramper_logo.svg";

const Footer: React.FC<{ className?: string }> = (props) => {
  const { t } = useTranslation();
  return (
    <footer
      className={`${classes.footer} ${commonClasses.footer} ${
        props.className || ""
      }`}
    >
      <a href="https://onramper.com" target="_blank" rel="noreferrer">
        <span>{t("footer.onramperPrefix")}</span>
        <img
          style={{ opacity: 0.5, marginLeft: "0.5rem" }}
          src={LogoOnramper}
          alt="logo"
        ></img>
      </a>
    </footer>
  );
};

export default Footer;
