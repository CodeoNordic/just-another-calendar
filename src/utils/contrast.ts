import tinycolor from "tinycolor2";
import rgbaToRgb from "rgba-to-rgb";

export function luminance(r: number, g:number, b:number) {
    const RED = 0.2126;
    const GREEN = 0.7152;
    const BLUE = 0.0722;

    const GAMMA = 2.4;

    var a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928
        ? v / 12.92
        : Math.pow((v + 0.055) / 1.055, GAMMA);
    });
    return a[0] * RED + a[1] * GREEN + a[2] * BLUE;
}

export function contrast(rgb1: [number, number, number], rgb2: [number, number, number]): number {
    var lum1 = luminance(...rgb1);
    var lum2 = luminance(...rgb2);
    var brightest = Math.max(lum1, lum2);
    var darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * @param color color to check contrast (any valid css color)
 * @param bg background color (any valid css color)
 * @returns true if the contrast is greater than 1.5
 * @example
 * ```ts
 * calculateContrast("#000", "#fff"); // true
 * calculateContrast("#000", "#000"); // false
 * ```
 */
export default function calculateContrast(color: string, bg: string = "#fff") {
    const colorRGBAObj = tinycolor(color).toRgb();
    const bgRGBAObj = tinycolor(bg).toRgb();

    const bgRGB = rgbaToRgb("rgb(255, 255, 255)", `rgba(${bgRGBAObj.r}, ${bgRGBAObj.g}, ${bgRGBAObj.b}, ${bgRGBAObj.a || 1})`);
    const bgRGBObj = tinycolor(bgRGB).toRgb();

    const rgb = rgbaToRgb(bgRGB, `rgba(${colorRGBAObj.r}, ${colorRGBAObj.g}, ${colorRGBAObj.b}, ${colorRGBAObj.a || 1})`);

    const rgbObj = tinycolor(rgb).toRgb();

    const contrastValue = contrast([rgbObj.r, rgbObj.g, rgbObj.b], [bgRGBObj.r, bgRGBObj.g, bgRGBObj.b]);
    return contrastValue > 1.5;
};