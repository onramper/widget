import React from "react";
import stylesCommon from "../../styles.module.css";
import styles from "./styles.module.css";
import { ReactComponent as ErrorIllustration } from "../../icons/error.svg";
import Loading from "../../common/Loading";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const cryptoFacts = shuffle(t('loadingScreen.cryptoFacts', { returnObjects: true }));
  const [factIndex, setFactIndex] = React.useState(0);

  React.useEffect(() => {
    const t = setInterval(
      () => setFactIndex((old) => (old + 1) % cryptoFacts.length),
      1000 * 10
    );
    return () => clearInterval(t);
  }, [cryptoFacts.length]);

  return (
    <main className={`${stylesCommon.body} ${styles.body}`}>
      {props.error ? (
        <ErrorIllustration className={styles["error-image"]} />
      ) : (
        <Loading />
      )}
      <p style={{ fontSize: "1.4375rem", marginBottom: "0rem" }}>
        {props.error ? props.error : t('loadingScreen.title')}
      </p>
      {!props.error && (
        <p style={{ color: "#252525", fontSize: "0.9rem" }}>
          {t('loadingScreen.creatingOrder')}
        </p>
      )}
      <span
        style={{
          fontStyle: "italic",
          fontSize: "13px",
          padding: "5px",
          marginTop: "1.5rem",
        }}
      >
        {props.error ? t('loadingScreen.didYouKnow') : t('loadingScreen.whileDidYouKnow')}
      </span>
      <p
        style={{
          margin: "0rem",
          alignSelf: "center",
          bottom: "1.125rem",
          fontSize: "13px",
          borderRadius: "16px",
        }}
      >
        {cryptoFacts[factIndex]}
      </p>
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

function shuffle(array: string[]) {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export default BodyLoading;
