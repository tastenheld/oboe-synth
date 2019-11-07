export class SynthUtils {

    public static keyIsWhite(key: number): boolean {
        let whiteKey = true;
        let firstKey = key % 12;

        switch (firstKey) {
            case 0:
            case 2:
            case 5:
            case 7:
            case 10:
                whiteKey = false;
                break;
            default:
                whiteKey = true;
        }
        return whiteKey;
    }

    public static countWhiteKeys(firstKey: number, lastKey: number): number {

        let whiteKeys = 0;

        while (firstKey <= lastKey) {
            if (SynthUtils.keyIsWhite(firstKey)) {
                whiteKeys++;
            }
            firstKey++;
        }

        return whiteKeys;
    }
}