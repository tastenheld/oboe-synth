//
// Created by ralf on 08.09.19.
//

#ifndef SYNTH_LIB_OSCILLATOR_H
#define SYNTH_LIB_OSCILLATOR_H

#include <cstdint>
#include <atomic>
#include <math.h>
#include <memory>
#include "IRenderableAudio.h"

constexpr double kDefaultFrequency = 440.0;
constexpr int32_t kDefaultSampleRate = 48000;
constexpr double kPi = M_PI;
constexpr double kTwoPi = kPi * 2;

class Oscillator {

public:

    ~Oscillator() = default;

    void setWaveOn(bool isWaveOn) {
        mIsWaveOn.store(isWaveOn);
    };

    void setSampleRate(int32_t sampleRate) {
        mSampleRate = sampleRate;
        updatePhaseIncrement();
    };

    void setFrequency(double frequency) {
        mFrequency = frequency;
        updatePhaseIncrement();
    };

    void setChannelCount(int32_t channelCount) {
        kChannelCount = channelCount;
    }

    void setOscMode( int32_t oscMode) {
        if (oscMode >= 4) {
            kOscMode = 0;
        }
        kOscMode = oscMode;
    }

    inline void setAmplitude(float amplitude) {
        mAmplitude = amplitude;
    };

    void renderAudio(float *audioData, int32_t numFrames) override {

        if (mIsWaveOn) {
            for (int i = 0; i < numFrames; ++i) {

                if (kOscMode == 1) {
                    // Square wave
                    if (mPhase <= kPi) {
                        audioData[i] = -mAmplitude;
                    } else {
                        audioData[i] = mAmplitude;
                    }
                } else if (kOscMode == 2) {
                    audioData[i] = saw();
                } else if (kOscMode == 3) {
                    audioData[i] = triangle();
                } else {
                    // Sine wave (sinf)
                    audioData[i * kChannelCount] = sin();
                }

                mPhase += mPhaseIncrement;
                if (mPhase > kTwoPi) mPhase -= kTwoPi;
            }
        } else {
            memset(audioData, 0, sizeof(float) * numFrames);
        }
    };

private:
    std::atomic<bool> mIsWaveOn{false};
    float mPhase = 0.0;
    std::atomic<float> mAmplitude{0};
    std::atomic<double> mPhaseIncrement{0.0};
    double mFrequency = kDefaultFrequency;
    int32_t mSampleRate = kDefaultSampleRate;
    int32_t kChannelCount = 1;
    int32_t kOscMode = 0;

    void updatePhaseIncrement() {
        mPhaseIncrement.store((kTwoPi * mFrequency) / static_cast<double>(mSampleRate));
    };

    float sin() {
        return sinf(mPhase) * mAmplitude;
    }

    float saw() {
        return mAmplitude - (2*mAmplitude * mPhase / kTwoPi);
    }

    float triangle() {
        float value = -mAmplitude + ( 2*mAmplitude * mPhase / kTwoPi );
        return 2*mAmplitude * ( fabs(value) - mAmplitude/2 );
    }
};


#endif //SYNTH_LIB_OSCILLATOR_H
