import React, { Fragment, useState } from "react";
import InputText from "../Input/InputText";
import InputRedesign from "./Input/Input";
import {InputProps} from "./Input/Input.models";

/* TODO: at the very final test cases each combination of props:
  PS: you can create a bunch of inputs and compare how each works and looks
*/

const initialProps: {[key:string]: string|boolean|number|undefined} | InputProps = {
  disabled: false,
  symbol: "This input symbol",
  placeholder: "input placeholder",
  label: "This input label",
  className: "some-class",
  icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAASAAAAEgARslrPgAABbxJREFUWMOVl12IXWcVhp+19pmT+ctMJzNj04Qm6UzqX2yoSbWmFlsvKhWhpqCC3lSR3hSkigiKKIhCvVB6I4IgUnopiCFaBS9S1PwMNpWaibYlFTNJ5y9/c2Z6TuZkztnr9WLvmTkzs89M8sFh77PX/r71futb71rvNoCeX/+dSAODUdy+ivEQbnvNbBinB7eyGY4bGOCGmYFn9xiYG2TPLLMj3G5h1MztKsZFzMZwe4nQhJUT5h49iHX/8q8kYdb0eBq375vxIG5+G47y+2JbDmK9LcU5i9mPk97klbSW4hFBU+lRQr8gdEjCCYGAEJIg8p9AIcifKQRBgS2fu9GWEDyM9Ku02vwcIZymRhT6nsQ9y46k1Ymr/9cv1gJQbUC0t+1G/MDM9jvSM4jD6x1tBKH2IDaJROt762wPKfSUE3yckBeF/I5AqB0ItQORID3iCt3XelZrHN8GiNsDmN1rAwgOOGIYbX7um4G4vSgVR1Wh4RKhHgwA5IaFMuqEkIOFAdrSRiijWm5TQCh7ZiKjbXZBZhgCt96SQuXliaw1tjjKNkihLQOBGwoRBgnGvb1lDg328uH+brZ3JDQEr8zO8VqlhjsoDEPlEsLUgh4HaXW3kYokMXoSJwUWI7KdrAMREuWS89jOfo7uHeSTw33c19tJh+fhBQLxjxtVwMCFwqxErKJfHwkQj+8Z4Msf2sn7B7qpNVLGZhf4zZszzCwu4Un2fmriwI4evvGR3Ty1Z5CBcomi0WGW5YcJIgNRWsnkHAT5WYfBlz5wNz997H5mb97iRr3JkV39PLFnB6P9XXzr5Du810yRwad23cXPjozywI4eNhs3G4GUVUjzLMld60omISLEvr5OvvvwPs5MVXj62Dm+cPwcv317FoCjI0McubuPNBUm+OLI8JbOASpLzRVqLl+zAqS1ICLEZ/YN8sHBHv5w4SqTC3UWGylz9UYWSne6EkchOt3Z07ttS+chca3e2EDRLAdyfuSZiQH77+qi5EYa2S4JuLRQZ67e4MTlOU5NVlCIgzt6ODS0fUsAM4sNxudqK2uBwIxSEQOUgwA4vLOP3701iwQvj09zZmqeydoSVxaX6O/q4LkHdjPU1bElgBMzFd6ZX8TJipG1JuEGBgBTC3UAvnZwFxPzi7x8fprqrSavTy+QJM7oQBff+dhejo4Ob+n8ZjM4fuk69WZKKfGsNLuwMIppaPC3iTmu1JZ4X0+ZFx6/n8+ODvHW9Zs0Ihjo6uATu/o5MNibiY4txu8vXuPVyQquZT/kINhIQ3MjAf41vcCfL1zlmQd3092R8OTIEE+ObO1s/XjjepUXx9+lupSSJAZau1kvbpWw1AhePH2RN2YW7txrPv5zo8a3T/+X89drOBR2Sl8VFGtllwPjM+/x/J/e5PWp+TtyHBJ/uXSDZ199m1NT8yTZw8JOmfiRr/wQsKzR5AeaH6ybMVGpc/JShZDYN9BNTzlp6ziVOHetys//eZkXzk5wYf4mieerLieL0eonLPnm8UXcOlfUrZMr4VU1G0Cp5Bze3ccj9w7w0Xv62D/YzfZyiUYE07Ulzl2tcv5alZNT81yu3cLdsoZVoJBb1Ha9JFEj1LlKw3xSS2K6G5EGY5crjL07T7nkbO8s0dmRdchqM2UxzVuxW55sLXxvrydqJUJXcBtszUxBS3Fayw4M0lRUFhtQz3fjlgXPjFZWteoJKBQ8Vx1xsb3SFUW2ZcVrIi+ta23F8q5QY4470muIKFa6FFK0yNEaW0GHLdCYTYJTjnhJobNtlW6bOrHy/jpaqRXgBhBrxOkZ4JgL/of4iaTJ1jBpSxBaWVRtwG+iti8R+pEaMeEmcNkfEc9KjBGK9jmxyXHEbR1HEDqD9PVtXdtOrFQef+4YOQFHMD6P2aMYB3AbNss+z7H8s7voi9jzQrPKd2GEuS3hVsO4Ym7/xu00xjFJFzvcqT7/af4P1RYdI2fwKMMAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMDQtMTRUMDk6MjQ6NDkrMDA6MDC+BauTAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTA0LTE0VDA5OjI0OjQ5KzAwOjAwz1gTLwAAAEZ0RVh0c29mdHdhcmUASW1hZ2VNYWdpY2sgNi43LjgtOSAyMDE0LTA1LTEyIFExNiBodHRwOi8vd3d3LmltYWdlbWFnaWNrLm9yZ9yG7QAAAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6aGVpZ2h0ADE5Mg8AcoUAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgAMTky06whCAAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxNTIzNjk3ODg5sceEhwAAAA90RVh0VGh1bWI6OlNpemUAMEJClKI+7AAAAFZ0RVh0VGh1bWI6OlVSSQBmaWxlOi8vL21udGxvZy9mYXZpY29ucy8yMDE4LTA0LTE0L2FkZjE5OTViNWMwZWEwOWYzNGM0MWVhZjViZGFhYzExLmljby5wbmcONoMUAAAAAElFTkSuQmCC",
  iconPosition: "end",
  symbolPosition: "start",
  value: "",
  type: "text",
  name: "cryptocurrencyAddress",
  onIconClick: () => {
    alert("icon click")
  },
  onHintClick: () => {
    alert("hint click")
  },
  error: "input error",
  hint: "this input hint",
  hintButton: true,
  clickableIcon: true,
  maxLength: 255,
  info: "input info ",
  iconTitle: "Icon title stuff",
  isRequired: true,
};

const TemporarDebugComponent: React.FC = () => {
  const [value, setValue] = useState("");

  const [propsToUse, setPropsToUse] = useState({...initialProps})

  const constrolPropsToggle = (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {Object.entries(propsToUse).map(([name, value]) => {
        if(typeof initialProps[name] === "function") return "";

        if(name === "type") {
          return (
            <button 
            key={name} 
            style={{margin: "2px", width: "126px", borderColor: value ? "blue" : "gray" }}
            onClick={() => {
                const types = ["text", "number", "date"];
                let nextIndex = types.findIndex(item => item === value) + 1;
                if(nextIndex >= types.length) {
                  nextIndex = 0;
                }
                setPropsToUse({...propsToUse, [name]: types[nextIndex]});
            }}
          >
            {name}:<span style={{fontStyle: "italic"}}>{value}</span>
          </button>
          )
        }

        return (
          <button 
            key={name} 
            style={{margin: "2px", borderColor: value ? "blue" : "gray" }}
            onClick={() => {

              if(name === "type") {
                const types = ["text", "number", "date"];
                let nextIndex = types.findIndex(item => item === value) + 1;
                if(nextIndex >= types.length) {
                  nextIndex = 0;
                }
                setPropsToUse({...propsToUse, [name]: types[nextIndex]});
                return;
              }

              if(typeof initialProps[name] === "boolean") {
                setPropsToUse({...propsToUse, [name]: !value});
                return;
              }

              setPropsToUse({...propsToUse, [name]: value ? undefined : initialProps[name]}) 
            }}
          >
            {name}:<span style={{fontStyle: "italic"}}>{name === "icon" ? "ICON" : initialProps[name]}{" "}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div style={{ flexGrow: 1 }}>
      <div style={{height: "265px"}}>
        <InputText
          {...(propsToUse as InputProps)}
          onChange={(name: string, value: string) => {
            setValue(value);
          }}
          value={value}
        />

        <InputRedesign
          {...(propsToUse as InputProps)}
          onChange={(name: string, value: string) => {
            setValue(value);
          }}
          value={value}
        />
      </div>

      {constrolPropsToggle}
    </div>
  );
};
  
export default TemporarDebugComponent;
