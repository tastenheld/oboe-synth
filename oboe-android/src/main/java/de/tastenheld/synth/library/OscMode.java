package de.tastenheld.synth.library;

public enum OscMode {

    SINE(0), SQUARE(1), SAW(2), TRIANGLE(3);

    int index;

    OscMode( int index ) {
        this.index = index;
    }
}