export default function clamp(num: number, min: number, max: number) {
    return Math.max(
        Math.min(max, num),
        min
    );
}