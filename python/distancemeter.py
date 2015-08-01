#!/usr/bin/python
import time
import RPi.GPIO as GPIO


class Distancemeter:

    def __init__(self):
        GPIO.setmode(GPIO.BCM)
        self.GPIO_TRIGGER = 23
        self.GPIO_ECHO = 24

        # Set pins as output and input
        GPIO.setup(self.GPIO_TRIGGER, GPIO.OUT)  # Trigger
        GPIO.setup(self.GPIO_ECHO, GPIO.IN)  # Echo

        # Set trigger to False (Low)
        GPIO.output(self.GPIO_TRIGGER, False)

    def measure(self):
        GPIO.output(self.GPIO_TRIGGER, True)
        time.sleep(0.00001)
        GPIO.output(self.GPIO_TRIGGER, False)
        start = time.time()

        while GPIO.input(self.GPIO_ECHO) == 0:
            start = time.time()

        while GPIO.input(self.GPIO_ECHO) == 1:
            stop = time.time()

        elapsed = stop - start
        distance = (elapsed * 34300) / 2

        return distance

    def measure_average(self):
        distance1 = measure()
        time.sleep(0.1)
        distance2 = measure()
        time.sleep(0.1)
        distance3 = measure()
        distance = distance1 + distance2 + distance3
        distance = distance / 3
        GPIO.cleanup()
        return distance
