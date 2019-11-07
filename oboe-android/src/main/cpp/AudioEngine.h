//
// Created by ralf on 08.09.19.
//

#ifndef SYNTH_LIB_AUDIOENGINE_H
#define SYNTH_LIB_AUDIOENGINE_H


#include "Oscillator.h"
#include <oboe/Oboe.h>
#include <jni.h>
#include <string>

using namespace oboe;

class AudioEngine : public AudioStreamCallback {

public:
    void start();

    void pressKey(float key);
    float changeKey(float key);
    void pause();

    DataCallbackResult
    onAudioReady(AudioStream *oboeStream, void *audioData, int32_t numFrames) override;

    //AudioStream *audioStream;
    ManagedStream  managedAudioStream;

    Oscillator osc;
    void setOscMode(int32_t mode);
    void setAmplitude(float amp);
};


#endif //SYNTH_LIB_AUDIOENGINE_H
