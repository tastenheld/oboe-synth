package de.tastenheld.synth.library;


public class OboeSynth {
    // Used to load the 'native-lib' library on application startup.
    static {
        System.loadLibrary("native-lib");
    }

    public void setOscMode(String oscName) {
        OscMode mode = OscMode.valueOf(oscName.toUpperCase());
        this.setOsc(mode.index);
    }

    /**
     * A native method that is implemented by the 'native-lib' native library,
     * which is packaged with this application.
     */
    public native void startEngine();
    public native void pause();
    public native void setAmplitude(float amp);
    public native void pressKey(float key);
    public native void pan(float x, float y);
    public native void tilt(float x, float y);

    public native void setTotalKeys(float keys);
    public native void setKeyboardSize(float width, float height);
    private native void setOsc(int osc);
}