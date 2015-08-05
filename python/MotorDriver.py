import RPi.GPIO as io
import time
import sys
import signal
from Motor import Motor

io.cleanup()
io.setmode(io.BOARD)

# motors
motor1 = Motor(11, 7, 21)
motor2 = Motor(15, 13, 19)
motor3 = Motor(29, 31, 23)
motor4 = Motor(35, 33, 37)

if len(sys.argv) <= 1:
    print "No arguments"

direction = sys.argv[1]
speed = 100  # float(sys.argv[2])

if direction == "forward":
    motor1.forward(speed)
    motor2.forward(speed)
    motor3.forward(speed)
    motor4.forward(speed)
if direction == "backward":
    motor1.backward(speed)
    motor2.backward(speed)
    motor3.backward(speed)
    motor4.backward(speed)
if direction == "left":
    motor1.backward(speed)
    motor2.backward(speed)
    motor3.forward(speed)
    motor4.forward(speed)
if direction == "right":
    motor1.forward(speed)
    motor2.forward(speed)
    motor3.backward(speed)
    motor4.backward(speed)
if direction == "none":
    motor1.stop()
    motor2.stop()
    motor3.stop()
    motor4.stop()


def signal_handler(signal, frame):
    print('Exit signal received!')
    motor1.stopPins()
    motor2.stopPins()
    motor3.stopPins()
    motor4.stopPins()
    io.cleanup()
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)
signal.pause()