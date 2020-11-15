declare module '*.css' {
    const content: { [className: string]: string };
    export default content;
}

interface SvgrComponent extends React.StatelessComponent<React.SVGAttributes<SVGElement>> { }

declare module '*.svg' {
    const svgUrl: string;
    const svgComponent: SvgrComponent;
    export default svgUrl;
    export { svgComponent as ReactComponent }
}

declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module "*.jpg" {
    const value: any;
    export default value;
}

declare module "*.png" {
    const value: any;
    export default value;
}
