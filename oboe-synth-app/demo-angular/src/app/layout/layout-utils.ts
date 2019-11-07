import { screen as Screen, isAndroid } from "tns-core-modules/platform";
import * as Application from "tns-core-modules/application";

export abstract class LayoutUtils {

    private static SCREEN_WIDTH: number;
    private static SCREEN_HEIGHT: number;
    private static SYSTEM_STATUS_BAR_HEIGHT: number;
    private static SCALE: number;

    public static getScale(): number {
        if (!LayoutUtils.SCALE) {
            LayoutUtils.SCALE = Screen.mainScreen.scale;
        }

        return LayoutUtils.SCALE;
    }

    public static getScreenWidth(): number {
        if (!LayoutUtils.SCREEN_WIDTH) {
            LayoutUtils.SCREEN_WIDTH = Screen.mainScreen.widthDIPs;
        }
        return LayoutUtils.SCREEN_WIDTH;
    }

    public static getScreenHeight(): number {
        if (!LayoutUtils.SCREEN_HEIGHT) {
            let scale = Screen.mainScreen.heightPixels / Screen.mainScreen.heightDIPs;
            LayoutUtils.SCREEN_HEIGHT = Screen.mainScreen.heightDIPs - LayoutUtils.getSystemStatusBarHeight() / scale;
        }
        return LayoutUtils.SCREEN_HEIGHT;
    }

    public static getPercentWidthFromScreen(percent: number): number {
        return (LayoutUtils.getScreenWidth() * percent) / 100;
    }

    public static getPercentHeightFromScreen(percent: number): number {
        return (LayoutUtils.getScreenHeight() * percent) / 100;
    }

    public static getSystemStatusBarHeight(): number {

        if (!LayoutUtils.SYSTEM_STATUS_BAR_HEIGHT) {
            if (isAndroid) {
                let resourceId = Application.android.context.getResources().getIdentifier('status_bar_height', 'dimen', 'android');
                if (resourceId) {
                    let appResources = Application.android.context.getResources();
                    LayoutUtils.SYSTEM_STATUS_BAR_HEIGHT = appResources.getDimensionPixelSize(resourceId);
                }
            }
        }
        return LayoutUtils.SYSTEM_STATUS_BAR_HEIGHT;
    }
}