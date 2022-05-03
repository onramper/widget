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

const cryptoFacts = shuffle([
  "The majority of bitcoin mining takes place in China, Georgia, Sweden and Canada",
  "No one knows the real identity of the creator of Bitcoin",
  "Over 16 million of Bitcoins are in circulation",
  "In 2010, someone bought a pizza with 10000 BTC",
  "The FBI is owning one of the largest Bitcoin wallets",
  "A unit of Bitcoin is called a 'Satoshi byte'",
  "You can't ban Bitcoin",
  "Bitcoin is created through mining",
]);

const BodyLoading: React.FC<BodyLoadingType> = (props) => {
  const [factIndex, setFactIndex] = React.useState(0);

  React.useEffect(() => {
    const t = setInterval(
      () => setFactIndex((old) => (old + 1) % cryptoFacts.length),
      1000 * 10
    );
    return () => clearInterval(t);
  }, []);

  return (
    <main className={`${stylesCommon.body} ${styles.body}`}>
      {props.error ? (
        <ErrorIllustration className={styles["error-image"]} />
      ) : (
        <Loading />
      )}
      <p style={{ fontSize: "1.4375rem", marginBottom: "0rem" }}>
        {props.error
          ? props.error
          : props.title
          ? props.title
          : "Checking your information"}
      </p>
      {!props.error && (
        <p style={{ color: "#252525", fontSize: "0.9rem" }}>
          {props.message
            ? props.message
            : "We are creating your order... please wait."}
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
        {props.error ? "Did you know..." : "While, did you know..."}
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
