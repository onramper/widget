import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { TransactionSettingsProps } from "./TransactionSettings.models";
import commonClasses from "./../../styles.module.css";
import classes from "./TransactionSettings.module.css";
import { ReactComponent as SettingsIcon } from "./../../icons/settings.svg";
import InputDelegator from "../../common/Input/InputDelegator";
import { CSSTransition } from "react-transition-group";
import DropdownCheckableGroup from "../../common/DropdownCheckableGroup/DropdownCheckableGroup";
import { ListItem } from "../../common/DropdownCheckableGroup/DropdownCheckableGroup.models";
import { BASE_API } from "../../ApiContext/api/constants";
import { NavContext } from "../../NavContext";
import Step from "../../steps/Step";

const wallets = [
  {
    id: "account1",
    title: "Account 1",
    info: "0x3fg4-lkfdjsakl;fjdaslk;fjasdkl;jfasd;jf;ldsajl-abc",
  },
  {
    id: "metamask",
    title: "Metamask",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxwYXRoIGQ9Ik0xNy4yMDcgMi4yMjg1MkwxMC45NjA5IDYuODY3NTZMMTIuMTE2IDQuMTMwNTlMMTcuMjA3IDIuMjI4NTJaIiBmaWxsPSIjRTI3NjFCIiBzdHJva2U9IiNFMjc2MUIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPg0KPHBhdGggZD0iTTIuNzg5MDYgMi4yMjg1Mkw4Ljk4NDkyIDYuOTExNUw3Ljg4NjM2IDQuMTMwNTlMMi43ODkwNiAyLjIyODUyWiIgZmlsbD0iI0U0NzYxQiIgc3Ryb2tlPSIjRTQ3NjFCIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik0xNC45NjA0IDEyLjk4MTlMMTMuMjk2OSAxNS41MzA2TDE2Ljg1NjIgMTYuNTA5OUwxNy44Nzk0IDEzLjAzODRMMTQuOTYwNCAxMi45ODE5WiIgZmlsbD0iI0U0NzYxQiIgc3Ryb2tlPSIjRTQ3NjFCIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik0yLjEyODkxIDEzLjAzODRMMy4xNDU4NiAxNi41MDk5TDYuNzA1MTggMTUuNTMwNkw1LjA0MTY1IDEyLjk4MTlMMi4xMjg5MSAxMy4wMzg0WiIgZmlsbD0iI0U0NzYxQiIgc3Ryb2tlPSIjRTQ3NjFCIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik02LjUwMzU2IDguNjc1NTNMNS41MTE3MiAxMC4xNzU4TDkuMDQ1OTMgMTAuMzMyOEw4LjkyMDM4IDYuNTM0OTFMNi41MDM1NiA4LjY3NTUzWiIgZmlsbD0iI0U0NzYxQiIgc3Ryb2tlPSIjRTQ3NjFCIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik0xMy40OTA4IDguNjc1NTJMMTEuMDQyNSA2LjQ5MDk3TDEwLjk2MDkgMTAuMzMyOEwxNC40ODg5IDEwLjE3NThMMTMuNDkwOCA4LjY3NTUyWiIgZmlsbD0iI0U0NzYxQiIgc3Ryb2tlPSIjRTQ3NjFCIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik02LjcwNzAzIDE1LjUzMDVMOC44Mjg4MSAxNC40OTQ3TDYuOTk1NzkgMTMuMDYzNUw2LjcwNzAzIDE1LjUzMDVaIiBmaWxsPSIjRTQ3NjFCIiBzdHJva2U9IiNFNDc2MUIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPg0KPHBhdGggZD0iTTExLjE2OCAxNC40OTQ3TDEzLjI5NiAxNS41MzA1TDEzLjAwMSAxMy4wNjM1TDExLjE2OCAxNC40OTQ3WiIgZmlsbD0iI0U0NzYxQiIgc3Ryb2tlPSIjRTQ3NjFCIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik0xMy4yOTIxIDE1LjUzMDdMMTEuMTY0MSAxNC40OTQ5TDExLjMzMzYgMTUuODgyMkwxMS4zMTQ3IDE2LjQ2NkwxMy4yOTIxIDE1LjUzMDdaIiBmaWxsPSIjRDdDMUIzIiBzdHJva2U9IiNEN0MxQjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPg0KPHBhdGggZD0iTTYuNzAzMTIgMTUuNTMwN0w4LjY4MDUzIDE2LjQ2Nkw4LjY2Nzk3IDE1Ljg4MjJMOC44MjQ5MSAxNC40OTQ5TDYuNzAzMTIgMTUuNTMwN1oiIGZpbGw9IiNEN0MxQjMiIHN0cm9rZT0iI0Q3QzFCMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+DQo8cGF0aCBkPSJNOC43MTU1NiAxMi4xNDY3TDYuOTQ1MzEgMTEuNjI1N0w4LjE5NDUzIDExLjA1NDRMOC43MTU1NiAxMi4xNDY3WiIgZmlsbD0iIzIzMzQ0NyIgc3Ryb2tlPSIjMjMzNDQ3IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik0xMS4yODEyIDEyLjE0NjdMMTEuODAyMyAxMS4wNTQ0TDEzLjA1NzggMTEuNjI1N0wxMS4yODEyIDEyLjE0NjdaIiBmaWxsPSIjMjMzNDQ3IiBzdHJva2U9IiMyMzM0NDciIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPg0KPHBhdGggZD0iTTYuNzA2NDkgMTUuNTMwNkw3LjAwNzgxIDEyLjk4MTlMNS4wNDI5NyAxMy4wMzg0TDYuNzA2NDkgMTUuNTMwNloiIGZpbGw9IiNDRDYxMTYiIHN0cm9rZT0iI0NENjExNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+DQo8cGF0aCBkPSJNMTIuOTk2MSAxMi45ODE5TDEzLjI5NzQgMTUuNTMwNkwxNC45NjA5IDEzLjAzODRMMTIuOTk2MSAxMi45ODE5WiIgZmlsbD0iI0NENjExNiIgc3Ryb2tlPSIjQ0Q2MTE2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik0xNC40ODg5IDEwLjE3NThMMTAuOTYwOSAxMC4zMzI3TDExLjI4NzQgMTIuMTQ2OUwxMS44MDg0IDExLjA1NDZMMTMuMDYzOSAxMS42MjU5TDE0LjQ4ODkgMTAuMTc1OFoiIGZpbGw9IiNDRDYxMTYiIHN0cm9rZT0iI0NENjExNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+DQo8cGF0aCBkPSJNNi45NDY4OSAxMS42MjU5TDguMjAyMzggMTEuMDU0Nkw4LjcxNzEzIDEyLjE0NjlMOS4wNDk4NCAxMC4zMzI3TDUuNTE1NjIgMTAuMTc1OEw2Ljk0Njg5IDExLjYyNTlaIiBmaWxsPSIjQ0Q2MTE2IiBzdHJva2U9IiNDRDYxMTYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPg0KPHBhdGggZD0iTTUuNTExNzIgMTAuMTc1OEw2Ljk5MzIgMTMuMDYzNEw2Ljk0Mjk4IDExLjYyNTlMNS41MTE3MiAxMC4xNzU4WiIgZmlsbD0iI0U0NzUxRiIgc3Ryb2tlPSIjRTQ3NTFGIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik0xMy4wNjI4IDExLjYyNTlMMTMgMTMuMDYzNEwxNC40ODc4IDEwLjE3NThMMTMuMDYyOCAxMS42MjU5WiIgZmlsbD0iI0U0NzUxRiIgc3Ryb2tlPSIjRTQ3NTFGIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik05LjA0NzU1IDEwLjMzMjVMOC43MTQ4NCAxMi4xNDY3TDkuMTI5MTYgMTQuMjg3M0w5LjIyMzMyIDExLjQ2ODdMOS4wNDc1NSAxMC4zMzI1WiIgZmlsbD0iI0U0NzUxRiIgc3Ryb2tlPSIjRTQ3NTFGIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik0xMC45NjI1IDEwLjMzMjVMMTAuNzkzIDExLjQ2MjVMMTAuODY4MyAxNC4yODczTDExLjI4ODkgMTIuMTQ2N0wxMC45NjI1IDEwLjMzMjVaIiBmaWxsPSIjRTQ3NTFGIiBzdHJva2U9IiNFNDc1MUYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPg0KPHBhdGggZD0iTTExLjI4NzggMTIuMTQ2OEwxMC44NjcyIDE0LjI4NzRMMTEuMTY4NSAxNC40OTQ1TDEzLjAwMTUgMTMuMDYzM0wxMy4wNjQzIDExLjYyNTdMMTEuMjg3OCAxMi4xNDY4WiIgZmlsbD0iI0Y2ODUxQiIgc3Ryb2tlPSIjRjY4NTFCIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik02Ljk0NTMxIDExLjYyNTdMNi45OTU1MyAxMy4wNjMzTDguODI4NTUgMTQuNDk0NUw5LjEyOTg3IDE0LjI4NzRMOC43MTU1NiAxMi4xNDY4TDYuOTQ1MzEgMTEuNjI1N1oiIGZpbGw9IiNGNjg1MUIiIHN0cm9rZT0iI0Y2ODUxQiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+DQo8cGF0aCBkPSJNMTEuMzE3MSAxNi40NjU2TDExLjMzNTkgMTUuODgxOEwxMS4xNzkgMTUuNzQzN0g4LjgxMjM1TDguNjY3OTcgMTUuODgxOEw4LjY4MDUzIDE2LjQ2NTZMNi43MDMxMiAxNS41MzAzTDcuMzkzNjUgMTYuMDk1Mkw4Ljc5MzUyIDE3LjA2ODNIMTEuMTk3OEwxMi42MDM5IDE2LjA5NTJMMTMuMjk0NSAxNS41MzAzTDExLjMxNzEgMTYuNDY1NloiIGZpbGw9IiNDMEFEOUUiIHN0cm9rZT0iI0MwQUQ5RSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+DQo8cGF0aCBkPSJNMTEuMTY2NCAxNC40OTQ1TDEwLjg2NTEgMTQuMjg3NEg5LjEyNjIyTDguODI0OTEgMTQuNDk0NUw4LjY2Nzk3IDE1Ljg4MThMOC44MTIzNSAxNS43NDM3SDExLjE3OUwxMS4zMzU5IDE1Ljg4MThMMTEuMTY2NCAxNC40OTQ1WiIgZmlsbD0iIzE2MTYxNiIgc3Ryb2tlPSIjMTYxNjE2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik0xNy40NzA1IDcuMTY4ODhMMTguMDA0MSA0LjYwNzY3TDE3LjIwNjkgMi4yMjg1MkwxMS4xNjggNi43MTA2MkwxMy40OTA2IDguNjc1NDdMMTYuNzczNyA5LjYzNTkyTDE3LjUwMTkgOC43ODg0NkwxNy4xODgxIDguNTYyNDdMMTcuNjkwMyA4LjEwNDIyTDE3LjMwMTEgNy44MDI5TDE3LjgwMzMgNy40MTk5OEwxNy40NzA1IDcuMTY4ODhaIiBmaWxsPSIjNzYzRDE2IiBzdHJva2U9IiM3NjNEMTYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPg0KPHBhdGggZD0iTTEuOTk2MDkgNC42MDc2N0wyLjUyOTY4IDcuMTY4ODhMMi4xOTA3IDcuNDE5OThMMi42OTI4OSA3LjgwMjlMMi4zMDk5NyA4LjEwNDIyTDIuODEyMTYgOC41NjI0N0wyLjQ5ODI5IDguNzg4NDZMMy4yMjAyIDkuNjM1OTJMNi41MDMzMSA4LjY3NTQ3TDguODI1OTggNi43MTA2MkwyLjc4NzA1IDIuMjI4NTJMMS45OTYwOSA0LjYwNzY3WiIgZmlsbD0iIzc2M0QxNiIgc3Ryb2tlPSIjNzYzRDE2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik0xNi43NzI4IDkuNjM1OTlMMTMuNDg5NiA4LjY3NTU0TDE0LjQ4NzggMTAuMTc1OUwxMyAxMy4wNjM1TDE0Ljk1ODYgMTMuMDM4NEgxNy44Nzc2TDE2Ljc3MjggOS42MzU5OVoiIGZpbGw9IiNGNjg1MUIiIHN0cm9rZT0iI0Y2ODUxQiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+DQo8cGF0aCBkPSJNNi41MDQzIDguNjc1NTRMMy4yMjExOCA5LjYzNTk5TDIuMTI4OTEgMTMuMDM4NEg1LjA0MTY1TDYuOTkzOTQgMTMuMDYzNUw1LjUxMjQ2IDEwLjE3NTlMNi41MDQzIDguNjc1NTRaIiBmaWxsPSIjRjY4NTFCIiBzdHJva2U9IiNGNjg1MUIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPg0KPHBhdGggZD0iTTEwLjk1ODggMTAuMzMyN0wxMS4xNjU5IDYuNzEwNjVMMTIuMTIwMSA0LjEzMDYySDcuODgyODFMOC44MjQ0MyA2LjcxMDY1TDkuMDQ0MTQgMTAuMzMyN0w5LjExOTQ3IDExLjQ3NTJMOS4xMjU3NSAxNC4yODc1SDEwLjg2NDZMMTAuODc3MiAxMS40NzUyTDEwLjk1ODggMTAuMzMyN1oiIGZpbGw9IiNGNjg1MUIiIHN0cm9rZT0iI0Y2ODUxQiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+DQo8L3N2Zz4NCg==",
    info: "0x3fg4-lkfdjsakl;fjdaslk;fjasdkl;jfasd;jf;ldsajl-xyz",
  },
  {
    id: "account2",
    title: "Account 2",
    info: "0x3fg4-lkfdjsakl;fjdaslk;fjasdkl;jfasd;jf;ldsajl-zyx",
  },
  {
    id: "account3",
    title: "Account 3",
    info: "0x3fg4-lkfdjsakl;fjdaslk;fjasdkl;jfasd;jf;ldsajl-cab",
  },
];

const Transition = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{ in: boolean }>
>((props, ref) => {
  return (
    <CSSTransition
      nodeRef={ref}
      in={props.in}
      timeout={200}
      classNames={{
        enter: classes["collapse-enter"],
        enterActive: classes["collapse-enter-active"],
        exit: classes["collapse-exit"],
        exitActive: classes["collapse-exit-active"],
      }}
      unmountOnExit={true}
    >
      {props.children}
    </CSSTransition>
  );
});

const TransactionSettings: React.FC<TransactionSettingsProps> = (props) => {
  const { nextScreen } = useContext(NavContext);
  const [isOpen, setIsOpen] = useState(false);
  const [slippage, setSlippage] = useState(props.defaultSlippage.toFixed(2));
  const [deadline, setDeadline] = useState(
    String(Math.floor((props.defaultDeadline / 60) * 100) / 100)
  );
  const wrapperRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  const [walletId, setWalletId] = useState("account1");

  const computeSlippageAutoBtnClass = useCallback(() => {
    const outlineClass =
      props.defaultSlippage === Number(slippage)
        ? ""
        : commonClasses["outline"];
    return `${commonClasses["secondary-btn"]} ${outlineClass} ${classes["auto-btn"]}`;
  }, [props.defaultSlippage, slippage]);

  const resetSlippage = useCallback(() => {
    setSlippage(props.defaultSlippage.toFixed(2));
  }, [props.defaultSlippage]);

  const goToWalletDestination = useCallback(async () => {
    const stepUrl = `${BASE_API}/GoTo/TestGateway/destinationWallet/WyJHWHVZZGVBb1B6SF9JcXJWQXh6R3ZRLS0iLDEwMCwiRVVSIiwiQlRDIiwiY3JlZGl0Q2FyZCJd`;
    const walletStep = await (await fetch(`${stepUrl}`, { method: 'POST' })).json();
    nextScreen(<Step nextStep={walletStep} />);
  }, [nextScreen]);

  useEffect(() => {
    const onClickEvent = (event: MouseEvent) => {
      if (!event.target || wrapperRef.current?.contains(event.target as Node)) {
        return;
      }
      setIsOpen(false);
    };

    window.addEventListener("click", onClickEvent);
    return () => {
      window.removeEventListener("click", onClickEvent);
    };
  }, []);

  return (
    <div className={classes["wrapper"]} ref={wrapperRef}>
      <SettingsIcon
        className={classes["icon"]}
        onClick={() => setIsOpen((value) => !value)}
      />

      <Transition ref={settingsRef} in={isOpen}>
        <div className={classes["settings-wrapper"]} ref={settingsRef}>
          <div className={classes["heading"]}> Transaction Settings </div>
          <div className={classes["setting-item"]}>
            <div className={classes["setting-name"]}> Slippage tolerance: </div>
            <div className={classes["setting-content"]}>
              <button
                className={computeSlippageAutoBtnClass()}
                onClick={resetSlippage}
              >
                Auto
              </button>
              <InputDelegator
                align="right"
                label=""
                variant="setting"
                symbol="%"
                symbolPosition="end"
                name="slippage"
                type="number"
                value={slippage}
                onChange={(name: string, value: string) => setSlippage(value)}
              />
            </div>
          </div>
          <div className={classes["setting-item"]}>
            <div className={classes["setting-name"]}>Transaction deadline:</div>
            <div className={classes["setting-content"]}>
              <InputDelegator
                align="center"
                label=""
                variant="setting"
                type="number"
                name="transactionDeadline"
                value={deadline}
                onChange={(name: string, value: string) => setDeadline(value)}
                className={classes["deadline-input"]}
              />
              <div className={classes["setting-label"]}>Minutes</div>
            </div>
          </div>

          <div className={classes["setting-item"]}>
            <div className={classes["setting-name"]}>Destination wallet:</div>
            <div className={classes["setting-content"]}>
              <DropdownCheckableGroup
                suplimentBtnText="+ Add new wallet"
                addNewBtnText="+ Add a destination wallet"
                items={wallets}
                idSelected={walletId}
                onSelect={(item: ListItem) => setWalletId(item.id)}
                onAdd={goToWalletDestination}
              />
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default TransactionSettings;
