//
// Created by ralf on 08.09.19.
//

#include <jni.h>
#include <string>
#include <iomanip>
#include "AudioEngine.h"

AudioEngine engine;
float lastKey = 49;
float lastAmplitude = 80;
float totalKeys = 12;
float kWidth = 200;
float kHeight = 100;
bool tiltXStarted = false;
float tiltX = 0;
bool tiltYStarted = false;
float tiltY = 0;

extern "C" JNIEXPORT void JNICALL
Java_de_tastenheld_synth_library_OboeSynth_startEngine(
        JNIEnv *env,
        jobject /* this */) {

    engine.start();
}

extern "C" JNIEXPORT void JNICALL
Java_de_tastenheld_synth_library_OboeSynth_pause(
        JNIEnv *env,
        jobject /* this */) {

    engine.pause();
    tiltXStarted = false;
    tiltYStarted = false;
}

extern "C" JNIEXPORT void JNICALL
Java_de_tastenheld_synth_library_OboeSynth_setOsc(
        JNIEnv *env,
        jobject /* this */,
        jint osc) {

    engine.setOscMode(osc);
}

extern "C" JNIEXPORT void JNICALL
Java_de_tastenheld_synth_library_OboeSynth_setAmplitude(
        JNIEnv *env,
        jobject /* this */,
        jfloat amp) {

    lastAmplitude = amp;
    engine.setAmplitude(amp);
}

extern "C" JNIEXPORT void JNICALL
Java_de_tastenheld_synth_library_OboeSynth_pressKey(
        JNIEnv *env,
        jobject /* this */,
        jfloat key) {

    lastKey = key;
    engine.setAmplitude(lastAmplitude);
    engine.pressKey(key);
}

extern "C" JNIEXPORT void JNICALL
Java_de_tastenheld_synth_library_OboeSynth_pan(
        JNIEnv *env,
        jobject /* this */,
        jfloat x,
        jfloat y) {

    if (fabs(x) > 0.001) {
        float key = lastKey + totalKeys * (x / kWidth);
        engine.changeKey(key);
    }

    if (fabs(y) > 0.001) {
        float amp = lastAmplitude - lastAmplitude * ( y / kHeight );
        engine.setAmplitude( amp );
    }
}

extern "C" JNIEXPORT void JNICALL
Java_de_tastenheld_synth_library_OboeSynth_tilt(
        JNIEnv *env,
        jobject /* this */,
        jfloat x,
        jfloat y) {

    if (!tiltXStarted) {
        tiltX = x;
        tiltXStarted = true;
    }

    if (!tiltYStarted) {
        tiltY = y;
        tiltYStarted = true;
    }

    float diffX = x - tiltX;

    if (fabs(diffX) > 0.001) {
        float key = lastKey - diffX * totalKeys;
        engine.changeKey(key);
    }

    float diffY = y - tiltY;

    if (fabs(diffY) > 0.001) {
        float amp = lastAmplitude + diffY * lastAmplitude;
        engine.setAmplitude(amp);
    }

}

extern "C" JNIEXPORT void JNICALL
Java_de_tastenheld_synth_library_OboeSynth_setTotalKeys(
        JNIEnv *env,
        jobject /* this */,
        jfloat keys) {

    totalKeys = keys;
}

extern "C" JNIEXPORT void JNICALL
Java_de_tastenheld_synth_library_OboeSynth_setKeyboardSize(
        JNIEnv *env,
        jobject /* this */,
        jfloat width, jfloat height) {

    kWidth = width;
    kHeight = height;
}