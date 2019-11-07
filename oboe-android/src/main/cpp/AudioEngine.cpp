//
// Created by ralf on 08.09.19.
//

#include "AudioEngine.h"

void AudioEngine::start() {
    AudioStreamBuilder audioStreamBuilder;
    audioStreamBuilder.setAudioApi(AudioApi::Unspecified);
    audioStreamBuilder.setFormat(AudioFormat::Float);
    audioStreamBuilder.setChannelCount(ChannelCount::Mono);
    audioStreamBuilder.setPerformanceMode(PerformanceMode::LowLatency);
    audioStreamBuilder.setSharingMode(SharingMode::Exclusive);
    audioStreamBuilder.setSampleRate(48000);

    audioStreamBuilder.setCallback( this );

    //audioStreamBuilder.openStream(&audioStream);
    audioStreamBuilder.openManagedStream(managedAudioStream);

    osc.setAmplitude(0.5);
    osc.setFrequency(440);
    osc.setSampleRate( managedAudioStream->getSampleRate() );
    osc.setChannelCount( managedAudioStream->getChannelCount() );

    //managedAudioStream->setBufferSizeInFrames(managedAudioStream->getFramesPerBurst() * 2);

    managedAudioStream->requestStart();

}

void AudioEngine::pressKey(float key) {
    float freq = changeKey(key);
    osc.setWaveOn(true);
}

float AudioEngine::changeKey(float key) {
    float freq = powf(2, (key - 49) / 12) * 440;
    osc.setFrequency(freq);
    return freq;
}

void AudioEngine::pause() {
    osc.setWaveOn(false);
}

DataCallbackResult
AudioEngine::onAudioReady(AudioStream *oboeStream, void *audioData, int32_t numFrames) {

    osc.renderAudio( static_cast<float *>(audioData), numFrames );

    return DataCallbackResult::Continue;
}

void AudioEngine::setOscMode(int32_t mode) {
    osc.setOscMode(mode);
}

void AudioEngine::setAmplitude(float amp) {
    osc.setAmplitude(amp/100);
}