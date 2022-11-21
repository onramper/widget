import React from "react";
import stylesCommon from "../../styles.module.css";
import styles from "./styles.module.css";
import { ReactComponent as ErrorIllustration } from "../../icons/error.svg";
import Loading from "../../common/Loading";

interface BodyLoadingType {
  error: string;
  title?: string;
  message?: string;
}

/* const IconSVGStyles = {
  width: "100%",
  height: "10rem",
}; */

const BodyLoading: React.FC<BodyLoadingType> = (props) => {

  return (
    <main className={`${stylesCommon.body} ${styles.body}`}>
      {props.error ? (
        <ErrorIllustration className={styles["error-image"]} />
      ) : (
        <Loading />
      )}
           
      <p style={{ fontSize: "1.4375rem", fontWeight:"600", marginBottom: "0rem", marginTop: "26px" }}>
        {props.error
          ? props.error
          : props.title
          ? props.title
          : "Creating your order"}
      </p>
      {!props.error && (
        <p style={{ color: "rgba(107, 111, 128, 1)", fontSize: "0.9rem" }}>
          {props.message
            ? props.message
            : "We’re verifying details, please wait..."}
        </p>
      )}      
    </main>
  );
};

/* const CardAnimation = () => (
  <>
    <span className={styles["container-icon"]}>
      <span className={`${styles.icon}`}>
        <IdCardIcon style={{ ...IconSVGStyles, fill: "darkgray" }} />
      </span>
      <span className={`${styles.icon} ${styles.telon}`}>
        <IdCardIcon style={{ ...IconSVGStyles }} />
      </span>
    </span>
  </>
); */

export default BodyLoading;
